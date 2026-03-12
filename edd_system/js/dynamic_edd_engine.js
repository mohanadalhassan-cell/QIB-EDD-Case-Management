/**
 * ============================================================================
 * DYNAMIC EDD ENGINE — محرك تحليل ديناميكي
 * ============================================================================
 * Version: 1.0.0
 *
 * A fully configurable, layered risk-scoring engine for Enhanced Due Diligence.
 *
 * Layers:
 *  1. Data Layer        — raw T24 field storage
 *  2. Field Logic Layer — per-field weight, active flag, logic, dependencies
 *  3. Rule Engine       — dynamic rules stored in localStorage / JSON config
 *  4. Risk Scoring Engine — aggregates rule results → final score
 *  5. Decision Engine   — auto-approve / manual-review / EDD trigger
 *  6. Admin API         — used by admin_edd_engine.html control panel
 *
 * Storage: localStorage key "EDD_ENGINE_CONFIG"
 * All modifications made via the Admin Panel are persisted automatically.
 * ============================================================================
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Maximum possible risk score. Rules with SET_HIGH action use 200 by default,
   * but the ceiling is set high enough to accommodate future additions without
   * overflowing threshold comparisons.
   */
  var MAX_RISK_SCORE = 9999;

  // ═══════════════════════════════════════════════════════════════
  // DEFAULT CONFIGURATION (first run or reset)
  // ═══════════════════════════════════════════════════════════════

  var DEFAULT_CONFIG = {
    version: '1.0.0',
    updatedAt: null,

    // ── Risk Category Thresholds ─────────────────────────────────
    thresholds: {
      low:    { min: 0,   max: 99  },
      medium: { min: 100, max: 149 },
      high:   { min: 150, max: MAX_RISK_SCORE }
    },

    // ── Decision Outcomes ────────────────────────────────────────
    decisions: {
      low:    { action: 'AUTO_APPROVE',    label: 'Auto Approve',     labelAr: 'موافقة تلقائية' },
      medium: { action: 'MANUAL_REVIEW',   label: 'Manual Review',    labelAr: 'مراجعة يدوية' },
      high:   { action: 'EDD_REQUIRED',    label: 'EDD Investigation', labelAr: 'تحقيق EDD' }
    },

    // ── Fields (Data Layer + Field Logic Layer) ──────────────────
    // Each field mirrors a T24 source field.
    // - weight:       Multiplier applied to the raw score produced by the field's rules.
    // - active:       When false, all rules belonging to this field are skipped.
    // - source:       Origin system (T24, MANUAL, DERIVED).
    // - category:     Grouping label for UI rendering.
    // - description:  Human-readable explanation.
    // - dependencies: Array of fieldId strings this field depends on.
    fields: [
      {
        id: 'COUNTRY_RISK',
        name: 'Country Risk',
        nameAr: 'مخاطر الدولة',
        source: 'T24',
        active: true,
        weight: 1.0,
        category: 'geography',
        description: 'Risk score derived from customer nationality / country of operation.',
        dependencies: []
      },
      {
        id: 'ACTIVITY_RISK',
        name: 'Business Activity Risk',
        nameAr: 'مخاطر النشاط التجاري',
        source: 'T24',
        active: true,
        weight: 1.0,
        category: 'business',
        description: 'Risk based on the customer\'s primary business activity or sector.',
        dependencies: []
      },
      {
        id: 'PRODUCT_RISK',
        name: 'Product Risk',
        nameAr: 'مخاطر المنتج',
        source: 'T24',
        active: true,
        weight: 0.8,
        category: 'product',
        description: 'Risk associated with the banking product(s) requested.',
        dependencies: []
      },
      {
        id: 'OCCUPATION_RISK',
        name: 'Occupation Risk',
        nameAr: 'مخاطر المهنة',
        source: 'T24',
        active: true,
        weight: 1.0,
        category: 'personal',
        description: 'Risk derived from the customer\'s declared occupation.',
        dependencies: []
      },
      {
        id: 'PEP_RISK',
        name: 'PEP Status',
        nameAr: 'الشخص المعرض سياسياً',
        source: 'T24',
        active: true,
        weight: 1.5,
        category: 'sanctions',
        description: 'Politically Exposed Person flag. High weight due to regulatory requirement.',
        dependencies: []
      },
      {
        id: 'TRANSACTION_RISK',
        name: 'Transaction Pattern Risk',
        nameAr: 'مخاطر أنماط المعاملات',
        source: 'T24',
        active: true,
        weight: 1.2,
        category: 'behaviour',
        description: 'Risk from unusual transaction volumes, frequencies or cross-border activity.',
        dependencies: ['COUNTRY_RISK', 'ACTIVITY_RISK']
      },
      {
        id: 'WEALTH_RISK',
        name: 'Source of Wealth Risk',
        nameAr: 'مخاطر مصدر الثروة',
        source: 'MANUAL',
        active: true,
        weight: 1.1,
        category: 'financial',
        description: 'Risk from unclear or unverifiable source of wealth or income.',
        dependencies: ['OCCUPATION_RISK']
      },
      {
        id: 'SANCTIONED_ENTITY',
        name: 'Sanctioned Entity Check',
        nameAr: 'فحص قوائم العقوبات',
        source: 'T24',
        active: true,
        weight: 2.0,
        category: 'sanctions',
        description: 'Match against OFAC, EU, UN and local sanctions lists.',
        dependencies: ['COUNTRY_RISK']
      }
    ],

    // ── Rules (Rule Engine) ──────────────────────────────────────
    // Each rule belongs to one field (fieldId) and adds/subtracts from the score.
    // - condition: Human-readable logic expression (informational).
    // - operator:  'GTE'|'LTE'|'EQ'|'IN'|'NOT_IN' — for runtime evaluation.
    // - operand:   Value compared against the field score or value.
    // - action:    'ADD'|'MULTIPLY'|'SET_HIGH' — how score is modified.
    // - value:     Amount to add (for ADD), multiplier (for MULTIPLY), or ignored (SET_HIGH).
    // - priority:  Execution order (lower = first).
    rules: [
      {
        id: 'RULE_HIGH_RISK_COUNTRY',
        name: 'High-Risk Country Detected',
        nameAr: 'رصد دولة عالية الخطورة',
        fieldId: 'COUNTRY_RISK',
        scoreKey: 'COUNTRY_RISK_SCORE',
        active: true,
        condition: 'COUNTRY_RISK_SCORE >= 150',
        operator: 'GTE',
        operand: 150,
        action: 'ADD',
        value: 40,
        priority: 1,
        description: 'Adds 40 points when the country risk score is HIGH (≥150).'
      },
      {
        id: 'RULE_MEDIUM_RISK_COUNTRY',
        name: 'Medium-Risk Country',
        nameAr: 'دولة متوسطة الخطورة',
        fieldId: 'COUNTRY_RISK',
        scoreKey: 'COUNTRY_RISK_SCORE',
        active: true,
        condition: 'COUNTRY_RISK_SCORE >= 100 AND < 150',
        operator: 'RANGE',
        operand: [100, 149],
        action: 'ADD',
        value: 15,
        priority: 2,
        description: 'Adds 15 points when the country risk score is MEDIUM (100–149).'
      },
      {
        id: 'RULE_HIGH_RISK_ACTIVITY',
        name: 'High-Risk Business Activity',
        nameAr: 'نشاط تجاري عالي الخطورة',
        fieldId: 'ACTIVITY_RISK',
        scoreKey: 'ACTIVITY_RISK_SCORE',
        active: true,
        condition: 'ACTIVITY_RISK_SCORE >= 130',
        operator: 'GTE',
        operand: 130,
        action: 'ADD',
        value: 35,
        priority: 1,
        description: 'Adds 35 points for activities categorised as HIGH risk (e.g. Hawala, Gambling).'
      },
      {
        id: 'RULE_MEDIUM_RISK_ACTIVITY',
        name: 'Medium-Risk Business Activity',
        nameAr: 'نشاط تجاري متوسط الخطورة',
        fieldId: 'ACTIVITY_RISK',
        scoreKey: 'ACTIVITY_RISK_SCORE',
        active: true,
        condition: 'ACTIVITY_RISK_SCORE >= 55 AND < 130',
        operator: 'RANGE',
        operand: [55, 129],
        action: 'ADD',
        value: 10,
        priority: 2,
        description: 'Adds 10 points for MEDIUM risk activities (e.g. Real Estate, Mining).'
      },
      {
        id: 'RULE_HIGH_RISK_PRODUCT',
        name: 'High-Risk Product',
        nameAr: 'منتج مصرفي عالي الخطورة',
        fieldId: 'PRODUCT_RISK',
        scoreKey: 'PRODUCT_RISK_SCORE',
        active: true,
        condition: 'PRODUCT_RISK_SCORE >= 130',
        operator: 'GTE',
        operand: 130,
        action: 'ADD',
        value: 25,
        priority: 1,
        description: 'Adds 25 points for high-risk products such as Private Banking or Shell Accounts.'
      },
      {
        id: 'RULE_HIGH_RISK_OCCUPATION',
        name: 'High-Risk Occupation',
        nameAr: 'مهنة عالية الخطورة',
        fieldId: 'OCCUPATION_RISK',
        scoreKey: 'OCCUPATION_RISK_SCORE',
        active: true,
        condition: 'OCCUPATION_RISK_SCORE >= 120',
        operator: 'GTE',
        operand: 120,
        action: 'ADD',
        value: 30,
        priority: 1,
        description: 'Adds 30 points for occupations classified as HIGH risk.'
      },
      {
        id: 'RULE_PEP_FLAG',
        name: 'PEP Confirmed',
        nameAr: 'تأكيد الشخص المعرض سياسياً',
        fieldId: 'PEP_RISK',
        scoreKey: 'PEP_STATUS',
        active: true,
        condition: 'PEP_STATUS == TRUE',
        operator: 'EQ',
        operand: true,
        action: 'ADD',
        value: 50,
        priority: 1,
        description: 'Adds 50 points when customer is confirmed as a Politically Exposed Person.'
      },
      {
        id: 'RULE_UNUSUAL_TRANSACTIONS',
        name: 'Unusual Transaction Volume',
        nameAr: 'حجم معاملات غير معتاد',
        fieldId: 'TRANSACTION_RISK',
        scoreKey: 'TRANSACTION_ANOMALY_SCORE',
        active: true,
        condition: 'TRANSACTION_ANOMALY_SCORE >= 80',
        operator: 'GTE',
        operand: 80,
        action: 'ADD',
        value: 30,
        priority: 1,
        description: 'Adds 30 points when transaction patterns indicate anomalous behaviour.'
      },
      {
        id: 'RULE_UNKNOWN_WEALTH',
        name: 'Source of Wealth Unknown',
        nameAr: 'مصدر الثروة مجهول',
        fieldId: 'WEALTH_RISK',
        scoreKey: 'WEALTH_SOURCE',
        active: true,
        condition: 'WEALTH_SOURCE == UNKNOWN',
        operator: 'EQ',
        operand: 'UNKNOWN',
        action: 'ADD',
        value: 20,
        priority: 1,
        description: 'Adds 20 points when source of wealth cannot be verified.'
      },
      {
        id: 'RULE_SANCTIONED_MATCH',
        name: 'Sanctions List Match',
        nameAr: 'تطابق قوائم العقوبات',
        fieldId: 'SANCTIONED_ENTITY',
        scoreKey: 'SANCTIONS_MATCH',
        active: true,
        condition: 'SANCTIONS_MATCH == TRUE',
        operator: 'EQ',
        operand: true,
        action: 'SET_HIGH',
        value: 200,
        priority: 0,
        description: 'Forces HIGH risk (score 200) when the customer matches any sanctions list.'
      }
    ]
  };

  // ═══════════════════════════════════════════════════════════════
  // STORAGE HELPERS
  // ═══════════════════════════════════════════════════════════════

  var STORAGE_KEY = 'EDD_ENGINE_CONFIG';

  function loadConfig() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        // Merge to add any new default fields/rules that may have been added in code.
        return _mergeWithDefaults(parsed);
      }
    } catch (e) {
      console.warn('[DynamicEDDEngine] Failed to load config from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }

  function saveConfig(config) {
    try {
      config.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      _notifyChange(config);
      return true;
    } catch (e) {
      console.error('[DynamicEDDEngine] Failed to save config:', e);
      return false;
    }
  }

  function resetConfig() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('[DynamicEDDEngine] Failed to reset config:', e);
      return false;
    }
  }

  /**
   * Merge a saved config with defaults so new fields/rules added in code
   * are automatically picked up without wiping existing user edits.
   */
  function _mergeWithDefaults(saved) {
    var merged = JSON.parse(JSON.stringify(saved));
    // Add any fields present in defaults but missing in saved
    DEFAULT_CONFIG.fields.forEach(function (df) {
      var exists = merged.fields.some(function (f) { return f.id === df.id; });
      if (!exists) { merged.fields.push(JSON.parse(JSON.stringify(df))); }
    });
    // Add any rules present in defaults but missing in saved
    DEFAULT_CONFIG.rules.forEach(function (dr) {
      var exists = merged.rules.some(function (r) { return r.id === dr.id; });
      if (!exists) { merged.rules.push(JSON.parse(JSON.stringify(dr))); }
    });
    return merged;
  }

  // ═══════════════════════════════════════════════════════════════
  // CHANGE NOTIFICATION (simple pub/sub for UI refresh)
  // ═══════════════════════════════════════════════════════════════

  var _listeners = [];

  function _notifyChange(config) {
    _listeners.forEach(function (fn) {
      try { fn(config); } catch (e) { /* ignore listener errors */ }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // PUBLIC ENGINE API
  // ═══════════════════════════════════════════════════════════════

  var DynamicEDDEngine = {

    // ── Expose constant for external consumers (e.g. Admin Panel) ─
    MAX_RISK_SCORE: MAX_RISK_SCORE,

    // ── Subscribe to config changes ────────────────────────────
    onConfigChange: function (fn) {
      if (typeof fn === 'function') { _listeners.push(fn); }
    },

    // ── Load / Save / Reset ─────────────────────────────────────
    getConfig:   loadConfig,
    saveConfig:  saveConfig,
    resetConfig: function () {
      var ok = resetConfig();
      if (ok) { _notifyChange(this.getConfig()); }
      return ok;
    },

    // ════════════════════════════════════════════════════════════
    // FIELD LOGIC LAYER
    // ════════════════════════════════════════════════════════════

    getFields: function () {
      return loadConfig().fields;
    },

    getField: function (fieldId) {
      return loadConfig().fields.find(function (f) { return f.id === fieldId; }) || null;
    },

    getActiveFields: function () {
      return loadConfig().fields.filter(function (f) { return f.active; });
    },

    /** Toggle a field's active/inactive state. Returns array of affected rule IDs. */
    toggleField: function (fieldId, active) {
      var config = loadConfig();
      var field = config.fields.find(function (f) { return f.id === fieldId; });
      if (!field) { return { success: false, affected: [] }; }

      var affected = config.rules
        .filter(function (r) { return r.fieldId === fieldId; })
        .map(function (r) { return r.id; });

      field.active = Boolean(active);
      saveConfig(config);
      return { success: true, affected: affected, field: field };
    },

    /** Update a field's weight. */
    updateFieldWeight: function (fieldId, weight) {
      var config = loadConfig();
      var field = config.fields.find(function (f) { return f.id === fieldId; });
      if (!field) { return false; }
      field.weight = parseFloat(weight) || 1.0;
      saveConfig(config);
      return true;
    },

    /** Update any property of a field. */
    updateField: function (fieldId, updates) {
      var config = loadConfig();
      var idx = config.fields.findIndex(function (f) { return f.id === fieldId; });
      if (idx === -1) { return false; }
      Object.assign(config.fields[idx], updates);
      saveConfig(config);
      return true;
    },

    // ════════════════════════════════════════════════════════════
    // RULE ENGINE
    // ════════════════════════════════════════════════════════════

    getRules: function () {
      return loadConfig().rules;
    },

    getRule: function (ruleId) {
      return loadConfig().rules.find(function (r) { return r.id === ruleId; }) || null;
    },

    getActiveRules: function () {
      var config = loadConfig();
      var activeFieldIds = config.fields
        .filter(function (f) { return f.active; })
        .map(function (f) { return f.id; });
      return config.rules.filter(function (r) {
        return r.active && activeFieldIds.indexOf(r.fieldId) !== -1;
      });
    },

    getRulesForField: function (fieldId) {
      return loadConfig().rules.filter(function (r) { return r.fieldId === fieldId; });
    },

    /** Toggle a rule's active/inactive state. */
    toggleRule: function (ruleId, active) {
      var config = loadConfig();
      var rule = config.rules.find(function (r) { return r.id === ruleId; });
      if (!rule) { return false; }
      rule.active = Boolean(active);
      saveConfig(config);
      return true;
    },

    /** Update any property of a rule. */
    updateRule: function (ruleId, updates) {
      var config = loadConfig();
      var idx = config.rules.findIndex(function (r) { return r.id === ruleId; });
      if (idx === -1) { return false; }
      Object.assign(config.rules[idx], updates);
      saveConfig(config);
      return true;
    },

    /** Add a brand-new rule. Generates a unique ID if none provided. */
    addRule: function (rule) {
      var config = loadConfig();
      if (!rule.id) {
        rule.id = 'RULE_CUSTOM_' + Date.now();
      }
      if (!rule.fieldId || !config.fields.some(function (f) { return f.id === rule.fieldId; })) {
        return { success: false, error: 'Invalid or missing fieldId' };
      }
      rule.active = rule.active !== false;
      rule.priority = rule.priority || 99;
      config.rules.push(rule);
      saveConfig(config);
      return { success: true, rule: rule };
    },

    /** Remove a rule (only custom rules). */
    removeRule: function (ruleId) {
      var config = loadConfig();
      var idx = config.rules.findIndex(function (r) { return r.id === ruleId; });
      if (idx === -1) { return false; }
      config.rules.splice(idx, 1);
      saveConfig(config);
      return true;
    },

    // ════════════════════════════════════════════════════════════
    // DEPENDENCY MAP
    // ════════════════════════════════════════════════════════════

    /**
     * Returns a map: { fieldId: { field, dependsOn: [...fields], affectedRules: [...rules] } }
     */
    getDependencyMap: function () {
      var config = loadConfig();
      var map = {};

      config.fields.forEach(function (field) {
        map[field.id] = {
          field: field,
          dependsOn: field.dependencies.map(function (depId) {
            return config.fields.find(function (f) { return f.id === depId; }) || { id: depId, name: depId };
          }),
          affectedRules: config.rules.filter(function (r) { return r.fieldId === field.id; }),
          usedByFields: config.fields.filter(function (f) {
            return f.dependencies && f.dependencies.indexOf(field.id) !== -1;
          })
        };
      });

      return map;
    },

    /**
     * Returns impact analysis when toggling a field off.
     * Lists rules and dependent fields that will be affected.
     */
    getToggleImpact: function (fieldId) {
      var config = loadConfig();
      var depMap = this.getDependencyMap();
      var entry = depMap[fieldId];
      if (!entry) { return null; }

      var affectedRules = entry.affectedRules;
      var affectedFields = entry.usedByFields;

      // Recursively find downstream fields
      var allAffectedFields = affectedFields.slice();
      affectedFields.forEach(function (f) {
        var downstream = depMap[f.id] ? depMap[f.id].usedByFields : [];
        downstream.forEach(function (df) {
          if (!allAffectedFields.some(function (x) { return x.id === df.id; })) {
            allAffectedFields.push(df);
          }
        });
      });

      return {
        fieldId: fieldId,
        fieldName: entry.field.name,
        affectedRules: affectedRules,
        affectedFields: allAffectedFields
      };
    },

    // ════════════════════════════════════════════════════════════
    // RISK SCORING ENGINE
    // ════════════════════════════════════════════════════════════

    /**
     * Evaluates all active rules against a scores object and returns the
     * weighted final score with a full breakdown.
     *
     * @param {Object} scores — { COUNTRY_RISK_SCORE: 160, ACTIVITY_RISK_SCORE: 75, PEP_STATUS: true, ... }
     * @returns {Object} { finalScore, category, breakdown, decision, triggeredRules }
     */
    evaluate: function (scores) {
      var config   = loadConfig();
      var fields   = config.fields;
      var rules    = config.rules;

      var breakdown      = {};
      var triggeredRules = [];
      var totalScore     = 0;

      // Sort rules by priority (lower = first)
      var sortedRules = rules.slice().sort(function (a, b) { return (a.priority || 99) - (b.priority || 99); });

      // Group scores per field
      fields.forEach(function (field) {
        if (!field.active) {
          breakdown[field.id] = { name: field.name, active: false, rawScore: 0, weightedScore: 0, rules: [] };
          return;
        }

        var fieldRuleResults = [];
        var fieldRawScore    = 0;
        var fieldForced      = false;

        sortedRules.forEach(function (rule) {
          if (rule.fieldId !== field.id || !rule.active) { return; }
          if (fieldForced) { return; } // SET_HIGH already triggered — skip remaining rules

          var triggered = _evaluateRule(rule, scores);
          if (triggered) {
            var delta = _applyAction(rule);
            if (rule.action === 'SET_HIGH') {
              fieldRawScore = rule.value;
              fieldForced   = true;
            } else if (rule.action === 'MULTIPLY') {
              fieldRawScore = Math.round(fieldRawScore * delta);
            } else {
              fieldRawScore += delta;
            }
            fieldRuleResults.push({ ruleId: rule.id, ruleName: rule.name, delta: delta, action: rule.action });
            triggeredRules.push({ ruleId: rule.id, ruleName: rule.name, fieldId: field.id, delta: delta });
          }
        });

        var weightedScore = Math.round(fieldRawScore * (field.weight || 1.0));
        totalScore += weightedScore;

        breakdown[field.id] = {
          name: field.name,
          nameAr: field.nameAr,
          active: true,
          weight: field.weight,
          rawScore: fieldRawScore,
          weightedScore: weightedScore,
          rules: fieldRuleResults
        };
      });

      var category = this.getCategory(totalScore, config.thresholds);
      var decision = config.decisions[category.toLowerCase()];
      if (!decision) {
        console.warn('[DynamicEDDEngine] Unexpected category "' + category + '"; falling back to HIGH decision.');
        decision = config.decisions.high;
      }

      return {
        finalScore:     totalScore,
        category:       category,
        decision:       decision,
        breakdown:      breakdown,
        triggeredRules: triggeredRules,
        evaluatedAt:    new Date().toISOString()
      };
    },

    /** Convert a score to LOW / MEDIUM / HIGH using configurable thresholds. */
    getCategory: function (score, thresholds) {
      thresholds = thresholds || loadConfig().thresholds;
      if (score >= thresholds.high.min)   { return 'HIGH'; }
      if (score >= thresholds.medium.min) { return 'MEDIUM'; }
      return 'LOW';
    },

    // ════════════════════════════════════════════════════════════
    // THRESHOLD MANAGEMENT
    // ════════════════════════════════════════════════════════════

    getThresholds: function () {
      return loadConfig().thresholds;
    },

    updateThresholds: function (thresholds) {
      var config = loadConfig();
      config.thresholds = thresholds;
      saveConfig(config);
      return true;
    },

    // ════════════════════════════════════════════════════════════
    // DECISION ENGINE
    // ════════════════════════════════════════════════════════════

    getDecisions: function () {
      return loadConfig().decisions;
    },

    updateDecision: function (level, updates) {
      var config = loadConfig();
      if (!config.decisions[level]) { return false; }
      Object.assign(config.decisions[level], updates);
      saveConfig(config);
      return true;
    },

    /**
     * Convenience wrapper: evaluate + decide in one call.
     * @param {Object} customerData — same structure as evaluate()
     */
    assessCustomer: function (customerData) {
      return this.evaluate(customerData);
    },

    // ════════════════════════════════════════════════════════════
    // AUDIT LOG (session-level, not persisted)
    // ════════════════════════════════════════════════════════════

    _auditLog: [],

    logChange: function (actor, action, detail) {
      this._auditLog.push({
        timestamp: new Date().toISOString(),
        actor:     actor || 'Admin',
        action:    action,
        detail:    detail
      });
    },

    getAuditLog: function () {
      return this._auditLog.slice();
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════

  function _evaluateRule(rule, scores) {
    var op  = rule.operator;
    // Use explicit scoreKey if present, otherwise fall back to parsing the condition string
    var key = rule.scoreKey || rule.condition.split(' ')[0];
    var val = scores[key];

    if (op === 'GTE')   { return typeof val === 'number' && val >= rule.operand; }
    if (op === 'LTE')   { return typeof val === 'number' && val <= rule.operand; }
    if (op === 'EQ')    { return val === rule.operand; }
    if (op === 'IN')    { return Array.isArray(rule.operand) && rule.operand.indexOf(val) !== -1; }
    if (op === 'NOT_IN') { return Array.isArray(rule.operand) && rule.operand.indexOf(val) === -1; }
    if (op === 'RANGE') {
      return typeof val === 'number' &&
             val >= rule.operand[0] &&
             val <= rule.operand[1];
    }
    return false;
  }

  function _applyAction(rule) {
    if (rule.action === 'ADD')      { return rule.value || 0; }
    if (rule.action === 'SET_HIGH') { return rule.value || 200; }
    if (rule.action === 'MULTIPLY') { return rule.value || 1; }
    return 0;
  }

  // ═══════════════════════════════════════════════════════════════
  // EXPORT
  // ═══════════════════════════════════════════════════════════════

  global.DynamicEDDEngine = DynamicEDDEngine;

}(typeof window !== 'undefined' ? window : this));
