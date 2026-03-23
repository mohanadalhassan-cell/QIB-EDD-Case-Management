/**
 * QIB EDD Dynamic Risk Rule Engine
 * ═══════════════════════════════════════════════════════════════
 * A 5-layer configurable risk analysis engine that mirrors
 * enterprise AML/EDD engines (NICE Actimize, SAS AML, Oracle FCCM).
 *
 * Architecture:
 *   Layer 1 — Data Layer          (raw input fields from T24/CRM)
 *   Layer 2 — Field Logic Layer   (per-field metadata & weight)
 *   Layer 3 — Dependency Engine   (cascading disable logic)
 *   Layer 4 — Rule Engine         (condition → score rules)
 *   Layer 5 — Risk Scoring &
 *             Decision Engine     (total score → category → action)
 *
 * Admin API (all state stored in localStorage for demo persistence):
 *   DynamicRuleEngine.setFieldStatus(fieldId, 'ACTIVE'|'INACTIVE')
 *   DynamicRuleEngine.setRuleStatus(ruleId, 'ACTIVE'|'INACTIVE')
 *   DynamicRuleEngine.updateRuleScore(ruleId, newScore)
 *   DynamicRuleEngine.updateFieldWeight(fieldId, newWeight)
 *   DynamicRuleEngine.updateRiskCategory(categoryId, min, max, action)
 *   DynamicRuleEngine.evaluate(customerData)        → DecisionResult
 *   DynamicRuleEngine.getDependencyImpact(fieldId)  → ImpactReport
 *   DynamicRuleEngine.resetToDefaults()
 *
 * Version: 1.0.0  |  QIB Compliance Technology  |  2026
 */

const DynamicRuleEngine = (() => {

  // ─────────────────────────────────────────────────────────────
  // PERSISTENCE HELPERS
  // ─────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'QIB_DynamicRuleEngine_v1';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('DynamicRuleEngine: could not persist state', e);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 2 — FIELD LOGIC LAYER  (default definitions)
  // ─────────────────────────────────────────────────────────────
  const DEFAULT_FIELDS = [
    {
      id: 'COUNTRY',
      name: 'Country / Nationality Risk',
      type: 'CATEGORICAL',
      status: 'ACTIVE',
      weight: 40,
      description: 'Assesses risk based on customer nationality or country of residence against FATF/QCB high-risk list.',
      dependencies: ['GEO_RISK']
    },
    {
      id: 'SECTOR',
      name: 'Business Sector Risk',
      type: 'CATEGORICAL',
      status: 'ACTIVE',
      weight: 30,
      description: 'Evaluates risk exposure from the customer\'s business activity or industry sector.',
      dependencies: ['INDUSTRY_RISK', 'BUSINESS_RISK']
    },
    {
      id: 'RESIDENCY',
      name: 'Residency Status',
      type: 'BOOLEAN',
      status: 'ACTIVE',
      weight: 20,
      description: 'Non-resident customers carry additional regulatory scrutiny.',
      dependencies: ['LOCATION_RISK']
    },
    {
      id: 'OWNERSHIP',
      name: 'Ownership Structure',
      type: 'CATEGORICAL',
      status: 'ACTIVE',
      weight: 25,
      description: 'Complex or opaque ownership structures elevate risk.',
      dependencies: ['BENEFICIAL_OWNER_RISK']
    },
    {
      id: 'PEP',
      name: 'PEP / Sanctions Screening',
      type: 'BOOLEAN',
      status: 'ACTIVE',
      weight: 50,
      description: 'Politically Exposed Persons and sanctioned individuals carry highest risk.',
      dependencies: []
    },
    {
      id: 'DOCUMENT',
      name: 'Document Completeness',
      type: 'NUMERIC',
      status: 'ACTIVE',
      weight: 15,
      description: 'Incomplete documentation raises identity verification risk.',
      dependencies: ['KYC_COMPLETENESS']
    },
    {
      id: 'TRANSACTION',
      name: 'Transaction Behaviour',
      type: 'NUMERIC',
      status: 'ACTIVE',
      weight: 20,
      description: 'Unusual transaction patterns trigger additional review.',
      dependencies: ['CASH_RISK', 'WIRE_RISK']
    },
    {
      id: 'GEO_RISK',
      name: 'Geographic Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 10,
      description: 'Derived from COUNTRY field — geographic risk overlay.',
      dependencies: []
    },
    {
      id: 'INDUSTRY_RISK',
      name: 'Industry Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 10,
      description: 'Derived from SECTOR — industry-level risk classification.',
      dependencies: []
    },
    {
      id: 'BUSINESS_RISK',
      name: 'Business Activity Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 10,
      description: 'Derived from SECTOR — business activity risk flag.',
      dependencies: []
    },
    {
      id: 'LOCATION_RISK',
      name: 'Location Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 5,
      description: 'Derived from RESIDENCY — location-based risk factor.',
      dependencies: []
    },
    {
      id: 'BENEFICIAL_OWNER_RISK',
      name: 'Beneficial Owner Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 10,
      description: 'Derived from OWNERSHIP — ultimate beneficial owner risk.',
      dependencies: []
    },
    {
      id: 'KYC_COMPLETENESS',
      name: 'KYC Completeness Score (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 5,
      description: 'Derived from DOCUMENT — overall KYC form completeness metric.',
      dependencies: []
    },
    {
      id: 'CASH_RISK',
      name: 'Cash Transaction Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 8,
      description: 'Derived from TRANSACTION — cash-heavy transaction pattern risk.',
      dependencies: []
    },
    {
      id: 'WIRE_RISK',
      name: 'Wire Transfer Risk (Derived)',
      type: 'DERIVED',
      status: 'ACTIVE',
      weight: 8,
      description: 'Derived from TRANSACTION — cross-border wire transfer risk.',
      dependencies: []
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // LAYER 4 — RULE ENGINE  (default rules)
  // ─────────────────────────────────────────────────────────────
  const DEFAULT_RULES = [
    {
      id: 'R001',
      name: 'FATF High-Risk Nationality',
      fieldId: 'COUNTRY',
      condition: 'NATIONALITY IN HIGH_RISK_LIST',
      conditionKey: 'highRiskNationality',
      score: 40,
      status: 'ACTIVE',
      priority: 1,
      description: 'Customer nationality appears on FATF/QCB high-risk countries list.'
    },
    {
      id: 'R002',
      name: 'Sanction-Listed Country',
      fieldId: 'COUNTRY',
      condition: 'COUNTRY IN SANCTIONED_LIST',
      conditionKey: 'sanctionedCountry',
      score: 70,
      status: 'ACTIVE',
      priority: 1,
      description: 'Customer country appears on OFAC/UN/EU sanctions list.'
    },
    {
      id: 'R003',
      name: 'Crypto / Virtual Assets Sector',
      fieldId: 'SECTOR',
      condition: 'SECTOR = CRYPTO',
      conditionKey: 'cryptoSector',
      score: 50,
      status: 'ACTIVE',
      priority: 2,
      description: 'Customer operates in cryptocurrency or virtual asset sector.'
    },
    {
      id: 'R004',
      name: 'Gambling / Gaming Sector',
      fieldId: 'SECTOR',
      condition: 'SECTOR = GAMBLING',
      conditionKey: 'gamblingSector',
      score: 45,
      status: 'ACTIVE',
      priority: 2,
      description: 'Customer operates in gambling or gaming industry.'
    },
    {
      id: 'R005',
      name: 'Precious Metals / Stones Sector',
      fieldId: 'SECTOR',
      condition: 'SECTOR = PRECIOUS_METALS',
      conditionKey: 'preciousMetalsSector',
      score: 35,
      status: 'ACTIVE',
      priority: 2,
      description: 'Customer deals in precious metals, gems, or luxury goods.'
    },
    {
      id: 'R006',
      name: 'Non-Resident Status',
      fieldId: 'RESIDENCY',
      condition: 'RESIDENT_STATUS = NON_RESIDENT',
      conditionKey: 'nonResident',
      score: 20,
      status: 'ACTIVE',
      priority: 3,
      description: 'Customer is not a resident of Qatar.'
    },
    {
      id: 'R007',
      name: 'Complex / Offshore Ownership',
      fieldId: 'OWNERSHIP',
      condition: 'OWNERSHIP = COMPLEX OR OFFSHORE',
      conditionKey: 'complexOwnership',
      score: 35,
      status: 'ACTIVE',
      priority: 2,
      description: 'Ownership structure is opaque, complex, or involves offshore entities.'
    },
    {
      id: 'R008',
      name: 'PEP Match Confirmed',
      fieldId: 'PEP',
      condition: 'PEP_STATUS = TRUE',
      conditionKey: 'isPEP',
      score: 60,
      status: 'ACTIVE',
      priority: 1,
      description: 'Customer matches Politically Exposed Person database.'
    },
    {
      id: 'R009',
      name: 'Sanctions Match Confirmed',
      fieldId: 'PEP',
      condition: 'SANCTIONS_MATCH = TRUE',
      conditionKey: 'isSanctioned',
      score: 100,
      status: 'ACTIVE',
      priority: 1,
      description: 'Customer matches OFAC/UN/EU sanctions screening list.'
    },
    {
      id: 'R010',
      name: 'Document Completeness Below 75%',
      fieldId: 'DOCUMENT',
      condition: 'DOC_COMPLETENESS < 75',
      conditionKey: 'lowDocCompleteness',
      score: 25,
      status: 'ACTIVE',
      priority: 3,
      description: 'Customer documents are less than 75% complete.'
    },
    {
      id: 'R011',
      name: 'Document Completeness Below 50%',
      fieldId: 'DOCUMENT',
      condition: 'DOC_COMPLETENESS < 50',
      conditionKey: 'veryLowDocCompleteness',
      score: 15,
      status: 'ACTIVE',
      priority: 3,
      description: 'Critical document shortfall — below 50% completeness (additive).'
    },
    {
      id: 'R012',
      name: 'Unusual Transaction Volume',
      fieldId: 'TRANSACTION',
      condition: 'TRANSACTION_ALERTS > 0',
      conditionKey: 'transactionAlerts',
      score: 20,
      status: 'ACTIVE',
      priority: 2,
      description: 'Customer has active transaction monitoring alerts.'
    },
    {
      id: 'R013',
      name: 'Multiple Transaction Alerts (≥3)',
      fieldId: 'TRANSACTION',
      condition: 'TRANSACTION_ALERTS >= 3',
      conditionKey: 'highTransactionAlerts',
      score: 20,
      status: 'ACTIVE',
      priority: 2,
      description: 'Customer has 3 or more active transaction monitoring alerts (additive).'
    },
    {
      id: 'R014',
      name: 'Adverse Media Hit',
      fieldId: 'PEP',
      condition: 'ADVERSE_MEDIA = TRUE',
      conditionKey: 'adverseMedia',
      score: 30,
      status: 'ACTIVE',
      priority: 2,
      description: 'Adverse media hit found in negative news screening.'
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // LAYER 5 — RISK CATEGORIES  (default thresholds)
  // ─────────────────────────────────────────────────────────────
  const DEFAULT_CATEGORIES = [
    {
      id: 'CAT_LOW',
      name: 'LOW RISK',
      minScore: 0,
      maxScore: 30,
      action: 'AUTO_APPROVE',
      actionLabel: 'Auto-Approve',
      color: '#00E676',
      description: 'Customer poses minimal risk — eligible for automated approval.'
    },
    {
      id: 'CAT_MEDIUM',
      name: 'MEDIUM RISK',
      minScore: 31,
      maxScore: 69,
      action: 'COMPLIANCE_REVIEW',
      actionLabel: 'Compliance Review',
      color: '#FFB800',
      description: 'Customer poses moderate risk — human compliance officer review required.'
    },
    {
      id: 'CAT_HIGH',
      name: 'HIGH RISK',
      minScore: 70,
      maxScore: 999,
      action: 'EDD_INVESTIGATION',
      actionLabel: 'EDD Investigation',
      color: '#FF4757',
      description: 'Customer poses elevated risk — full Enhanced Due Diligence investigation required.'
    }
  ];

  // ─────────────────────────────────────────────────────────────
  // STATE INITIALISATION
  // ─────────────────────────────────────────────────────────────
  /**
   * Build a fresh engine state from factory defaults.
   * Creates deep copies of DEFAULT_FIELDS, DEFAULT_RULES, and DEFAULT_CATEGORIES
   * so every call produces an independent, mutable state object that can be
   * persisted to localStorage without mutating the originals.
   *
   * @returns {{ fields: object[], rules: object[], categories: object[], auditLog: object[], lastModified: string }}
   */
  function buildDefaultState() {
    return {
      fields: JSON.parse(JSON.stringify(DEFAULT_FIELDS)),
      rules: JSON.parse(JSON.stringify(DEFAULT_RULES)),
      categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
      auditLog: [],
      lastModified: new Date().toISOString()
    };
  }

  let _state = loadState() || buildDefaultState();

  function _persist() {
    _state.lastModified = new Date().toISOString();
    saveState(_state);
  }

  function _addAuditEntry(action, details) {
    _state.auditLog.unshift({
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Admin'
    });
    if (_state.auditLog.length > 200) _state.auditLog.length = 200;
    _persist();
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 3 — DEPENDENCY ENGINE
  // ─────────────────────────────────────────────────────────────

  /**
   * Recursively collect all field IDs that depend on a given field.
   */
  function _getAllDependents(fieldId) {
    const visited = new Set();
    const queue = [fieldId];
    while (queue.length) {
      const current = queue.shift();
      const field = _state.fields.find(f => f.id === current);
      if (!field) continue;
      (field.dependencies || []).forEach(dep => {
        if (!visited.has(dep)) {
          visited.add(dep);
          queue.push(dep);
        }
      });
    }
    visited.delete(fieldId);
    return [...visited];
  }

  /**
   * Find all rules affected when a field is toggled.
   */
  function _getAffectedRules(fieldIds) {
    const idSet = new Set(fieldIds);
    return _state.rules.filter(r => idSet.has(r.fieldId));
  }

  /**
   * Generate an impact report for toggling a field to INACTIVE.
   * @param {string} fieldId
   * @returns {{ dependentFields: string[], affectedRules: object[], totalImpact: number }}
   */
  function getDependencyImpact(fieldId) {
    const dependentFields = _getAllDependents(fieldId);
    const affectedRules = _getAffectedRules([fieldId, ...dependentFields]);
    return {
      targetField: fieldId,
      dependentFields,
      affectedRules,
      totalImpact: dependentFields.length + affectedRules.length
    };
  }

  // ─────────────────────────────────────────────────────────────
  // ADMIN API — FIELD MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  /**
   * Enable or disable a field (and cascade to dependents + their rules).
   */
  function setFieldStatus(fieldId, status) {
    const field = _state.fields.find(f => f.id === fieldId);
    if (!field) throw new Error(`Field not found: ${fieldId}`);

    const previousStatus = field.status;
    field.status = status;

    // Cascade to all dependent fields
    const dependents = _getAllDependents(fieldId);
    dependents.forEach(depId => {
      const depField = _state.fields.find(f => f.id === depId);
      if (depField) depField.status = status;
    });

    // Cascade to affected rules
    const affectedRules = _getAffectedRules([fieldId, ...dependents]);
    affectedRules.forEach(r => { r.status = status; });

    _addAuditEntry(
      `FIELD_${status}`,
      `Field "${field.name}" (${fieldId}) changed from ${previousStatus} to ${status}. ` +
      `Cascaded to ${dependents.length} dependent field(s) and ${affectedRules.length} rule(s).`
    );

    return { field, dependents, affectedRules };
  }

  function updateFieldWeight(fieldId, newWeight) {
    const field = _state.fields.find(f => f.id === fieldId);
    if (!field) throw new Error(`Field not found: ${fieldId}`);
    const old = field.weight;
    field.weight = Number(newWeight);
    _addAuditEntry('FIELD_WEIGHT_UPDATE', `Field "${field.name}" weight changed from ${old} to ${newWeight}.`);
    _persist();
  }

  // ─────────────────────────────────────────────────────────────
  // ADMIN API — RULE MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  function setRuleStatus(ruleId, status) {
    const rule = _state.rules.find(r => r.id === ruleId);
    if (!rule) throw new Error(`Rule not found: ${ruleId}`);
    const old = rule.status;
    rule.status = status;
    _addAuditEntry(`RULE_${status}`, `Rule "${rule.name}" (${ruleId}) changed from ${old} to ${status}.`);
    _persist();
  }

  function updateRuleScore(ruleId, newScore) {
    const rule = _state.rules.find(r => r.id === ruleId);
    if (!rule) throw new Error(`Rule not found: ${ruleId}`);
    const old = rule.score;
    rule.score = Number(newScore);
    _addAuditEntry('RULE_SCORE_UPDATE', `Rule "${rule.name}" score changed from ${old} to ${newScore}.`);
    _persist();
  }

  function updateRulePriority(ruleId, newPriority) {
    const rule = _state.rules.find(r => r.id === ruleId);
    if (!rule) throw new Error(`Rule not found: ${ruleId}`);
    rule.priority = Number(newPriority);
    _persist();
  }

  // ─────────────────────────────────────────────────────────────
  // ADMIN API — RISK CATEGORY MANAGEMENT
  // ─────────────────────────────────────────────────────────────

  function updateRiskCategory(categoryId, min, max, action) {
    const cat = _state.categories.find(c => c.id === categoryId);
    if (!cat) throw new Error(`Category not found: ${categoryId}`);
    const old = { min: cat.minScore, max: cat.maxScore, action: cat.action };
    cat.minScore = Number(min);
    cat.maxScore = Number(max);
    if (action) cat.action = action;
    _addAuditEntry(
      'CATEGORY_UPDATE',
      `Category "${cat.name}" updated: [${old.min}–${old.max}] → [${min}–${max}], action: ${cat.action}.`
    );
    _persist();
  }

  // ─────────────────────────────────────────────────────────────
  // LAYER 5 — RISK SCORING ENGINE
  // ─────────────────────────────────────────────────────────────

  /**
   * Evaluate a customer data object against all active fields and rules.
   *
   * customerData shape (all optional — engine skips missing keys):
   * {
   *   highRiskNationality: bool,
   *   sanctionedCountry:   bool,
   *   cryptoSector:        bool,
   *   gamblingSector:      bool,
   *   preciousMetalsSector:bool,
   *   nonResident:         bool,
   *   complexOwnership:    bool,
   *   isPEP:               bool,
   *   isSanctioned:        bool,
   *   lowDocCompleteness:  bool,
   *   veryLowDocCompleteness: bool,
   *   transactionAlerts:   bool,
   *   highTransactionAlerts: bool,
   *   adverseMedia:        bool
   * }
   *
   * @returns {DecisionResult}
   */
  function evaluate(customerData) {
    const input = customerData || {};
    const firedRules = [];
    const skippedRules = [];
    let totalScore = 0;

    // Build active field ID set
    const activeFieldIds = new Set(
      _state.fields.filter(f => f.status === 'ACTIVE').map(f => f.id)
    );

    // Score each active rule
    const sortedRules = [..._state.rules].sort((a, b) => a.priority - b.priority);

    sortedRules.forEach(rule => {
      if (rule.status !== 'ACTIVE') {
        skippedRules.push({ ...rule, skipReason: 'Rule disabled' });
        return;
      }
      if (!activeFieldIds.has(rule.fieldId)) {
        skippedRules.push({ ...rule, skipReason: `Parent field ${rule.fieldId} inactive` });
        return;
      }

      const conditionMet = !!input[rule.conditionKey];
      if (conditionMet) {
        totalScore += rule.score;
        firedRules.push({ ...rule, contributedScore: rule.score });
      }
    });

    // Determine risk category
    const category = _state.categories
      .slice()
      .sort((a, b) => a.minScore - b.minScore)
      .find(c => totalScore >= c.minScore && totalScore <= c.maxScore)
      || _state.categories[_state.categories.length - 1];

    const result = {
      totalScore,
      category: category.name,
      categoryId: category.id,
      categoryColor: category.color,
      action: category.action,
      actionLabel: category.actionLabel,
      firedRules,
      skippedRules,
      activeFieldCount: activeFieldIds.size,
      totalFieldCount: _state.fields.length,
      evaluatedAt: new Date().toISOString()
    };

    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // DECISION ENGINE LABEL HELPERS
  // ─────────────────────────────────────────────────────────────

  function getDecisionIcon(action) {
    const icons = {
      AUTO_APPROVE:       '✅',
      COMPLIANCE_REVIEW:  '🔍',
      EDD_INVESTIGATION:  '🚨'
    };
    return icons[action] || '❓';
  }

  function getDecisionDescription(action) {
    const descs = {
      AUTO_APPROVE:
        'Customer meets all automated approval criteria. Case is eligible for straight-through processing without manual intervention.',
      COMPLIANCE_REVIEW:
        'Customer poses moderate risk factors. A compliance officer must manually review and approve before onboarding proceeds.',
      EDD_INVESTIGATION:
        'Customer poses elevated risk. A full Enhanced Due Diligence investigation is mandatory before any approval.'
    };
    return descs[action] || '';
  }

  // ─────────────────────────────────────────────────────────────
  // DATA ACCESSORS
  // ─────────────────────────────────────────────────────────────

  function getFields()     { return _state.fields; }
  function getRules()      { return _state.rules; }
  function getCategories() { return _state.categories; }
  function getAuditLog()   { return _state.auditLog; }
  function getLastModified() { return _state.lastModified; }

  // ─────────────────────────────────────────────────────────────
  // RESET
  // ─────────────────────────────────────────────────────────────

  function resetToDefaults() {
    _state = buildDefaultState();
    _addAuditEntry('RESET', 'All fields, rules, and categories reset to factory defaults.');
    _persist();
  }

  // ─────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────
  return {
    // Admin — Fields
    setFieldStatus,
    updateFieldWeight,
    // Admin — Rules
    setRuleStatus,
    updateRuleScore,
    updateRulePriority,
    // Admin — Categories
    updateRiskCategory,
    // Engine
    evaluate,
    getDependencyImpact,
    // Helpers
    getDecisionIcon,
    getDecisionDescription,
    // Accessors
    getFields,
    getRules,
    getCategories,
    getAuditLog,
    getLastModified,
    resetToDefaults
  };
})();

// CommonJS / Node interop
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicRuleEngine;
}
