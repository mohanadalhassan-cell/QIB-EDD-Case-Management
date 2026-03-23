/**
 * QIB Dynamic EDD Engine
 * ======================
 * Version: 1.0.0
 *
 * Architecture Layers:
 *   1. Data Layer          — Dynamic field registry (fields can be added/edited/removed at runtime)
 *   2. Field Logic Layer   — Conditional visibility / dependency rules per field
 *   3. Rule Engine         — Configurable business rules evaluated against case data
 *   4. Risk Scoring Engine — Weighted, configurable scoring across multiple risk dimensions
 *   5. Decision Engine     — Automated EDD trigger decisions with override support
 *   6. Dependency Map      — Integrity tracker that prevents orphaned references
 *
 * All configuration is stored in localStorage under the key 'dynamicEDDConfig'
 * so it survives page reloads without a backend database requirement.
 *
 * Usage (Admin Control Panel):
 *   DynamicEDDEngine.init();   // initialise from persisted config
 *   DynamicEDDEngine.evaluate(caseData);  // run all layers against a case
 */

const DynamicEDDEngine = (() => {

  // ═══════════════════════════════════════════════════════════════════════════
  // 0. PERSISTENCE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  const STORAGE_KEY = 'dynamicEDDConfig';

  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[DynamicEDDEngine] Failed to parse stored config:', e);
      return null;
    }
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.error('[DynamicEDDEngine] Failed to save config:', e);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. DATA LAYER — Field Registry
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Default field definitions shipped with the engine.
   * Admins can add, edit, or disable any field at runtime.
   *
   * Field schema:
   *   id         — unique snake_case identifier
   *   label      — display label (English)
   *   labelAr    — display label (Arabic)
   *   type       — text | number | boolean | select | date
   *   category   — CUSTOMER | FINANCIAL | ACTIVITY | SCREENING | GEOGRAPHY
   *   required   — whether field is mandatory for case submission
   *   active     — whether field is currently in use
   *   options    — array of {value, label} pairs (for type === 'select')
   *   weight     — contribution weight used by Risk Scoring Engine (0-100)
   */
  const DEFAULT_FIELDS = [
    { id: 'customer_type',    label: 'Customer Type',         labelAr: 'نوع العميل',            type: 'select',  category: 'CUSTOMER',   required: true,  active: true, weight: 10, options: [{value:'individual',label:'Individual'},{value:'corporate',label:'Corporate'},{value:'pep',label:'PEP'}] },
    { id: 'nationality',      label: 'Nationality',           labelAr: 'الجنسية',               type: 'text',    category: 'CUSTOMER',   required: true,  active: true, weight: 15, options: [] },
    { id: 'annual_income',    label: 'Annual Income (QAR)',   labelAr: 'الدخل السنوي',          type: 'number',  category: 'FINANCIAL',  required: true,  active: true, weight: 20, options: [] },
    { id: 'source_of_funds',  label: 'Source of Funds',       labelAr: 'مصدر الأموال',          type: 'select',  category: 'FINANCIAL',  required: true,  active: true, weight: 20, options: [{value:'salary',label:'Salary'},{value:'business',label:'Business'},{value:'investment',label:'Investment'},{value:'inheritance',label:'Inheritance'},{value:'other',label:'Other'}] },
    { id: 'is_pep',           label: 'PEP Status',            labelAr: 'شخص سياسي بارز',        type: 'boolean', category: 'SCREENING',  required: true,  active: true, weight: 25, options: [] },
    { id: 'sanctions_match',  label: 'Sanctions Match',       labelAr: 'تطابق قائمة العقوبات', type: 'boolean', category: 'SCREENING',  required: true,  active: true, weight: 30, options: [] },
    { id: 'country_risk',     label: 'Country Risk Level',    labelAr: 'مستوى مخاطر الدولة',   type: 'select',  category: 'GEOGRAPHY',  required: true,  active: true, weight: 20, options: [{value:'low',label:'Low'},{value:'medium',label:'Medium'},{value:'high',label:'High'},{value:'critical',label:'Critical'}] },
    { id: 'transaction_vol',  label: 'Transaction Volume',    labelAr: 'حجم المعاملات',         type: 'number',  category: 'ACTIVITY',   required: false, active: true, weight: 15, options: [] },
    { id: 'cash_intensity',   label: 'Cash Intensity (%)',    labelAr: 'كثافة النقد',           type: 'number',  category: 'ACTIVITY',   required: false, active: true, weight: 15, options: [] },
    { id: 'adverse_media',    label: 'Adverse Media',         labelAr: 'أخبار سلبية',           type: 'boolean', category: 'SCREENING',  required: false, active: true, weight: 20, options: [] },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. FIELD LOGIC LAYER — Dependency & Visibility Rules
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * A field dependency rule states:
   *   "Show/require field <targetFieldId> when field <sourceFieldId> matches <condition>"
   *
   * Rule schema:
   *   id           — unique identifier
   *   sourceFieldId — field whose value drives the condition
   *   condition    — { operator: 'eq'|'gt'|'lt'|'gte'|'lte'|'neq'|'contains', value }
   *   targetFieldId — field to show/hide/require
   *   effect       — 'show' | 'hide' | 'require' | 'unrequire'
   *   active       — whether the rule is enforced
   */
  const DEFAULT_FIELD_DEPENDENCIES = [
    { id: 'dep_pep_source',       sourceFieldId: 'is_pep',          condition: { operator: 'eq', value: true },         targetFieldId: 'source_of_funds', effect: 'require', active: true },
    { id: 'dep_corp_income',      sourceFieldId: 'customer_type',   condition: { operator: 'eq', value: 'corporate' },  targetFieldId: 'annual_income',   effect: 'require', active: true },
    { id: 'dep_high_cash_vol',    sourceFieldId: 'cash_intensity',  condition: { operator: 'gte', value: 50 },          targetFieldId: 'transaction_vol', effect: 'require', active: true },
    { id: 'dep_sanctions_media',  sourceFieldId: 'sanctions_match', condition: { operator: 'eq', value: true },         targetFieldId: 'adverse_media',   effect: 'require', active: true },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. RULE ENGINE — Business Rules
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * A business rule evaluates one or more conditions against case fields
   * and fires an action when all conditions are met.
   *
   * Rule schema:
   *   id          — unique identifier (e.g. 'BR-001')
   *   name        — human-readable name
   *   description — explanation
   *   conditions  — array of { fieldId, operator, value } (ALL must be true)
   *   action      — 'FLAG_EDD' | 'FLAG_HIGH' | 'FLAG_CRITICAL' | 'BLOCK' | 'ALERT'
   *   severity    — 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
   *   active      — whether rule is enforced
   *   createdBy   — user who created the rule
   *   createdAt   — ISO date string
   */
  const DEFAULT_RULES = [
    {
      id: 'BR-001', name: 'PEP Auto-EDD',
      description: 'Automatically flag EDD for any politically exposed person.',
      conditions: [{ fieldId: 'is_pep', operator: 'eq', value: true }],
      action: 'FLAG_EDD', severity: 'HIGH', active: true,
      createdBy: 'System', createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'BR-002', name: 'Sanctions Match Block',
      description: 'Block and escalate any case with a confirmed sanctions match.',
      conditions: [{ fieldId: 'sanctions_match', operator: 'eq', value: true }],
      action: 'BLOCK', severity: 'CRITICAL', active: true,
      createdBy: 'System', createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'BR-003', name: 'High Country Risk + PEP',
      description: 'Critical flag when customer is PEP from a high-risk country.',
      conditions: [
        { fieldId: 'is_pep',       operator: 'eq',  value: true },
        { fieldId: 'country_risk', operator: 'eq',  value: 'high' }
      ],
      action: 'FLAG_CRITICAL', severity: 'CRITICAL', active: true,
      createdBy: 'System', createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'BR-004', name: 'High Cash Intensity',
      description: 'Flag EDD when cash transactions exceed 60% of total volume.',
      conditions: [{ fieldId: 'cash_intensity', operator: 'gte', value: 60 }],
      action: 'FLAG_EDD', severity: 'MEDIUM', active: true,
      createdBy: 'System', createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'BR-005', name: 'Adverse Media + High Risk Country',
      description: 'Escalate when adverse media is present and country risk is high.',
      conditions: [
        { fieldId: 'adverse_media', operator: 'eq',  value: true },
        { fieldId: 'country_risk',  operator: 'eq',  value: 'high' }
      ],
      action: 'FLAG_HIGH', severity: 'HIGH', active: true,
      createdBy: 'Compliance', createdAt: '2024-03-01T00:00:00Z'
    },
    {
      id: 'BR-006', name: 'Corporate High Transaction Volume',
      description: 'Flag EDD for corporate customers with very high transaction volumes.',
      conditions: [
        { fieldId: 'customer_type',  operator: 'eq',  value: 'corporate' },
        { fieldId: 'transaction_vol', operator: 'gte', value: 1000000 }
      ],
      action: 'FLAG_EDD', severity: 'MEDIUM', active: true,
      createdBy: 'Risk', createdAt: '2024-03-01T00:00:00Z'
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. RISK SCORING ENGINE — Weighted Scoring Configuration
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Scoring dimension schema:
   *   id        — unique identifier
   *   name      — human-readable name
   *   fieldId   — source field used for scoring
   *   scoreMap  — maps field values (or ranges) to score points
   *   maxScore  — maximum score contribution from this dimension
   *   weight    — percentage weight of this dimension in the final score (all weights should sum to 100)
   *   active    — whether dimension is included
   */
  const DEFAULT_SCORING_DIMENSIONS = [
    {
      id: 'SD-COUNTRY', name: 'Country Risk',
      fieldId: 'country_risk', maxScore: 100, weight: 25, active: true,
      scoreMap: { low: 10, medium: 40, high: 75, critical: 100 }
    },
    {
      id: 'SD-PEP', name: 'PEP Status',
      fieldId: 'is_pep', maxScore: 100, weight: 25, active: true,
      scoreMap: { true: 100, false: 0 }
    },
    {
      id: 'SD-SANCTIONS', name: 'Sanctions Match',
      fieldId: 'sanctions_match', maxScore: 100, weight: 20, active: true,
      scoreMap: { true: 100, false: 0 }
    },
    {
      id: 'SD-CASH', name: 'Cash Intensity',
      fieldId: 'cash_intensity', maxScore: 100, weight: 15, active: true,
      // For numeric fields the scoreMap uses threshold keys: '<N' or '>=N'
      scoreMap: { lt30: 10, lt60: 40, gte60: 80 }
    },
    {
      id: 'SD-MEDIA', name: 'Adverse Media',
      fieldId: 'adverse_media', maxScore: 100, weight: 15, active: true,
      scoreMap: { true: 100, false: 0 }
    },
  ];

  /**
   * Thresholds that map a composite score (0-100) to a risk category.
   */
  const DEFAULT_SCORE_THRESHOLDS = {
    LOW:      { min: 0,   max: 24,  color: '#10b981' },
    MEDIUM:   { min: 25,  max: 49,  color: '#f59e0b' },
    HIGH:     { min: 50,  max: 74,  color: '#ef4444' },
    CRITICAL: { min: 75,  max: 100, color: '#7c3aed' },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. DECISION ENGINE — EDD Trigger Decisions
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * The Decision Engine combines the risk score and fired rules to produce
   * an automated recommendation. Human override is always honoured.
   *
   * Decision config schema:
   *   eddScoreThreshold   — minimum composite score that triggers EDD recommendation
   *   blockScoreThreshold — minimum composite score that triggers BLOCK recommendation
   *   blockOnSanctions    — always BLOCK when sanctions_match is true
   *   autoApproveBelow    — auto-approve when score is below this value and no rules fired
   */
  const DEFAULT_DECISION_CONFIG = {
    eddScoreThreshold:   50,
    blockScoreThreshold: 90,
    blockOnSanctions:    true,
    autoApproveBelow:    25,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. INTERNAL STATE
  // ═══════════════════════════════════════════════════════════════════════════

  let _fields            = [];
  let _fieldDependencies = [];
  let _rules             = [];
  let _scoringDimensions = [];
  let _scoreThresholds   = {};
  let _decisionConfig    = {};
  let _auditLog          = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Deep-clone via JSON round-trip (engine data is JSON-serialisable). */
  function _clone(obj) { return JSON.parse(JSON.stringify(obj)); }

  /** Evaluate a single condition { fieldId, operator, value } against caseData. */
  function _evalCondition(cond, caseData) {
    const actual = caseData[cond.fieldId];
    const expected = cond.value;
    switch (cond.operator) {
      case 'eq':       return String(actual) === String(expected) || actual === expected; // coerce so boolean true == 'true' from form inputs
      case 'neq':      return String(actual) !== String(expected) && actual !== expected;
      case 'gt':       return Number(actual) >  Number(expected);
      case 'gte':      return Number(actual) >= Number(expected);
      case 'lt':       return Number(actual) <  Number(expected);
      case 'lte':      return Number(actual) <= Number(expected);
      case 'contains': return String(actual).toLowerCase().includes(String(expected).toLowerCase());
      default:         return false;
    }
  }

  /** Compute numeric score contribution from a scoring dimension. */
  function _dimensionScore(dim, caseData) {
    const raw = caseData[dim.fieldId];
    if (raw === undefined || raw === null) return 0;

    const map = dim.scoreMap;

    // Boolean or select (string key)
    const strKey = String(raw);
    if (map[strKey] !== undefined) return Math.min(Number(map[strKey]), dim.maxScore);

    // Numeric range keys: lt<N> / gte<N>
    const num = Number(raw);
    if (!isNaN(num)) {
      const keys = Object.keys(map)
        .filter(k => k.startsWith('lt') || k.startsWith('gte'))
        .map(k => ({ key: k, threshold: Number(k.replace('lt','').replace('gte','')) }))
        .sort((a, b) => a.threshold - b.threshold);

      for (const { key, threshold } of keys) {
        if (key.startsWith('lt')  && num <  threshold) return Math.min(Number(map[key]), dim.maxScore);
        if (key.startsWith('gte') && num >= threshold) return Math.min(Number(map[key]), dim.maxScore);
      }
    }

    return 0;
  }

  /** Append to audit log (capped at 500 entries). */
  function _audit(action, detail) {
    _auditLog.unshift({ ts: new Date().toISOString(), action, detail });
    if (_auditLog.length > 500) _auditLog.length = 500;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. DEPENDENCY MAP
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Build a forward and reverse dependency map for all active references.
   *
   * Returns:
   *   {
   *     fieldUsedByRules:       { fieldId → [ruleId, ...] }
   *     fieldUsedByDeps:        { fieldId → [depId, ...] }
   *     fieldUsedByScoring:     { fieldId → [dimensionId, ...] }
   *     ruleConflicts:          [ { ruleId, reason } ]
   *   }
   */
  function buildDependencyMap() {
    const fieldUsedByRules   = {};
    const fieldUsedByDeps    = {};
    const fieldUsedByScoring = {};
    const ruleConflicts      = [];

    const activeFieldIds = new Set(_fields.filter(f => f.active).map(f => f.id));

    // Rules → fields
    _rules.filter(r => r.active).forEach(r => {
      r.conditions.forEach(c => {
        if (!fieldUsedByRules[c.fieldId]) fieldUsedByRules[c.fieldId] = [];
        fieldUsedByRules[c.fieldId].push(r.id);
        if (!activeFieldIds.has(c.fieldId)) {
          ruleConflicts.push({ ruleId: r.id, reason: `References inactive/deleted field "${c.fieldId}"` });
        }
      });
    });

    // Field dependencies → fields
    _fieldDependencies.filter(d => d.active).forEach(d => {
      [d.sourceFieldId, d.targetFieldId].forEach(fid => {
        if (!fieldUsedByDeps[fid]) fieldUsedByDeps[fid] = [];
        fieldUsedByDeps[fid].push(d.id);
        if (!activeFieldIds.has(fid)) {
          ruleConflicts.push({ ruleId: d.id, reason: `Dependency references inactive/deleted field "${fid}"` });
        }
      });
    });

    // Scoring dimensions → fields
    _scoringDimensions.filter(s => s.active).forEach(s => {
      if (!fieldUsedByScoring[s.fieldId]) fieldUsedByScoring[s.fieldId] = [];
      fieldUsedByScoring[s.fieldId].push(s.id);
      if (!activeFieldIds.has(s.fieldId)) {
        ruleConflicts.push({ ruleId: s.id, reason: `Scoring dimension references inactive/deleted field "${s.fieldId}"` });
      }
    });

    return { fieldUsedByRules, fieldUsedByDeps, fieldUsedByScoring, ruleConflicts };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════

  return {

    // ── Lifecycle ─────────────────────────────────────────────────────────────

    /** Load persisted config or fall back to defaults. */
    init() {
      const stored = loadConfig();
      _fields            = stored?.fields            ?? _clone(DEFAULT_FIELDS);
      _fieldDependencies = stored?.fieldDependencies ?? _clone(DEFAULT_FIELD_DEPENDENCIES);
      _rules             = stored?.rules             ?? _clone(DEFAULT_RULES);
      _scoringDimensions = stored?.scoringDimensions ?? _clone(DEFAULT_SCORING_DIMENSIONS);
      _scoreThresholds   = stored?.scoreThresholds   ?? _clone(DEFAULT_SCORE_THRESHOLDS);
      _decisionConfig    = stored?.decisionConfig    ?? _clone(DEFAULT_DECISION_CONFIG);
      _auditLog          = stored?.auditLog          ?? [];
      _audit('INIT', 'Engine initialised from ' + (stored ? 'stored' : 'default') + ' config');
      return this;
    },

    /** Persist current state to localStorage. */
    save() {
      saveConfig({
        fields: _fields, fieldDependencies: _fieldDependencies,
        rules: _rules, scoringDimensions: _scoringDimensions,
        scoreThresholds: _scoreThresholds, decisionConfig: _decisionConfig,
        auditLog: _auditLog,
      });
      return this;
    },

    /** Reset all configuration to factory defaults. */
    reset() {
      _fields            = _clone(DEFAULT_FIELDS);
      _fieldDependencies = _clone(DEFAULT_FIELD_DEPENDENCIES);
      _rules             = _clone(DEFAULT_RULES);
      _scoringDimensions = _clone(DEFAULT_SCORING_DIMENSIONS);
      _scoreThresholds   = _clone(DEFAULT_SCORE_THRESHOLDS);
      _decisionConfig    = _clone(DEFAULT_DECISION_CONFIG);
      _auditLog          = [];
      _audit('RESET', 'Engine reset to factory defaults');
      this.save();
      return this;
    },

    // ── Data Layer — Field Registry ───────────────────────────────────────────

    getFields()       { return _clone(_fields); },
    getActiveFields() { return _clone(_fields.filter(f => f.active)); },

    addField(field) {
      if (!field.id || _fields.find(f => f.id === field.id)) throw new Error('Field id missing or already exists: ' + field.id);
      const f = { active: true, required: false, options: [], weight: 10, ...field };
      _fields.push(f);
      _audit('ADD_FIELD', `Added field "${f.id}"`);
      this.save();
      return _clone(f);
    },

    updateField(fieldId, updates) {
      const idx = _fields.findIndex(f => f.id === fieldId);
      if (idx === -1) throw new Error('Field not found: ' + fieldId);
      Object.assign(_fields[idx], updates);
      _audit('UPDATE_FIELD', `Updated field "${fieldId}"`);
      this.save();
      return _clone(_fields[idx]);
    },

    /** Soft-delete: marks the field inactive and validates dependency map. */
    deactivateField(fieldId) {
      this.updateField(fieldId, { active: false });
      const { ruleConflicts } = buildDependencyMap();
      if (ruleConflicts.length > 0) {
        console.warn('[DynamicEDDEngine] Dependency conflicts after deactivating field:', ruleConflicts);
      }
      _audit('DEACTIVATE_FIELD', `Deactivated field "${fieldId}" (${ruleConflicts.length} conflict(s))`);
      this.save();
      return ruleConflicts;
    },

    // ── Field Logic Layer — Dependency Rules ───────────────────────────────────

    getFieldDependencies()       { return _clone(_fieldDependencies); },
    getActiveFieldDependencies() { return _clone(_fieldDependencies.filter(d => d.active)); },

    addFieldDependency(dep) {
      if (!dep.id || _fieldDependencies.find(d => d.id === dep.id)) throw new Error('Dependency id missing or already exists: ' + dep.id);
      const d = { active: true, ...dep };
      _fieldDependencies.push(d);
      _audit('ADD_DEP', `Added dependency "${d.id}"`);
      this.save();
      return _clone(d);
    },

    updateFieldDependency(depId, updates) {
      const idx = _fieldDependencies.findIndex(d => d.id === depId);
      if (idx === -1) throw new Error('Dependency not found: ' + depId);
      Object.assign(_fieldDependencies[idx], updates);
      _audit('UPDATE_DEP', `Updated dependency "${depId}"`);
      this.save();
      return _clone(_fieldDependencies[idx]);
    },

    removeFieldDependency(depId) {
      _fieldDependencies = _fieldDependencies.filter(d => d.id !== depId);
      _audit('REMOVE_DEP', `Removed dependency "${depId}"`);
      this.save();
    },

    /**
     * Given current caseData, apply all active field dependency rules
     * and return the effective field state (visible / required).
     */
    applyFieldLogic(caseData) {
      const state = {};
      _fields.filter(f => f.active).forEach(f => {
        state[f.id] = { visible: true, required: f.required };
      });

      _fieldDependencies.filter(d => d.active).forEach(dep => {
        const fired = _evalCondition({ fieldId: dep.sourceFieldId, ...dep.condition }, caseData);
        if (!state[dep.targetFieldId]) return;
        if (fired) {
          if (dep.effect === 'hide')      state[dep.targetFieldId].visible  = false;
          if (dep.effect === 'show')      state[dep.targetFieldId].visible  = true;
          if (dep.effect === 'require')   state[dep.targetFieldId].required = true;
          if (dep.effect === 'unrequire') state[dep.targetFieldId].required = false;
        }
      });

      return state;
    },

    // ── Rule Engine ────────────────────────────────────────────────────────────

    getRules()       { return _clone(_rules); },
    getActiveRules() { return _clone(_rules.filter(r => r.active)); },

    addRule(rule) {
      if (!rule.id || _rules.find(r => r.id === rule.id)) throw new Error('Rule id missing or already exists: ' + rule.id);
      const r = { active: true, createdBy: 'Admin', createdAt: new Date().toISOString(), ...rule };
      _rules.push(r);
      _audit('ADD_RULE', `Added rule "${r.id}: ${r.name}"`);
      this.save();
      return _clone(r);
    },

    updateRule(ruleId, updates) {
      const idx = _rules.findIndex(r => r.id === ruleId);
      if (idx === -1) throw new Error('Rule not found: ' + ruleId);
      Object.assign(_rules[idx], updates);
      _audit('UPDATE_RULE', `Updated rule "${ruleId}"`);
      this.save();
      return _clone(_rules[idx]);
    },

    removeRule(ruleId) {
      _rules = _rules.filter(r => r.id !== ruleId);
      _audit('REMOVE_RULE', `Removed rule "${ruleId}"`);
      this.save();
    },

    /** Evaluate all active rules against caseData. Returns array of fired rules. */
    evaluateRules(caseData) {
      const fired = [];
      _rules.filter(r => r.active).forEach(rule => {
        const allMet = rule.conditions.every(c => _evalCondition(c, caseData));
        if (allMet) fired.push(_clone(rule));
      });
      return fired;
    },

    // ── Risk Scoring Engine ────────────────────────────────────────────────────

    getScoringDimensions()       { return _clone(_scoringDimensions); },
    getScoreThresholds()         { return _clone(_scoreThresholds); },
    getDecisionConfig()          { return _clone(_decisionConfig); },

    addScoringDimension(dim) {
      if (!dim.id || _scoringDimensions.find(d => d.id === dim.id)) throw new Error('Dimension id missing or already exists: ' + dim.id);
      const d = { active: true, ...dim };
      _scoringDimensions.push(d);
      _audit('ADD_DIM', `Added scoring dimension "${d.id}"`);
      this.save();
      return _clone(d);
    },

    updateScoringDimension(dimId, updates) {
      const idx = _scoringDimensions.findIndex(d => d.id === dimId);
      if (idx === -1) throw new Error('Dimension not found: ' + dimId);
      Object.assign(_scoringDimensions[idx], updates);
      _audit('UPDATE_DIM', `Updated scoring dimension "${dimId}"`);
      this.save();
      return _clone(_scoringDimensions[idx]);
    },

    updateDecisionConfig(updates) {
      Object.assign(_decisionConfig, updates);
      _audit('UPDATE_DECISION_CFG', JSON.stringify(updates));
      this.save();
    },

    updateScoreThresholds(thresholds) {
      Object.assign(_scoreThresholds, thresholds);
      _audit('UPDATE_THRESHOLDS', JSON.stringify(thresholds));
      this.save();
    },

    /**
     * Calculate a composite risk score (0–100) for the given caseData.
     * Returns: { score, category, breakdown }
     */
    calculateRiskScore(caseData) {
      const activeDims = _scoringDimensions.filter(d => d.active);
      const totalWeight = activeDims.reduce((s, d) => s + d.weight, 0) || 1;
      let weightedScore = 0;
      const breakdown = [];

      activeDims.forEach(dim => {
        const raw = _dimensionScore(dim, caseData);
        const normalised = (raw / dim.maxScore) * 100;
        const contribution = (normalised * dim.weight) / totalWeight;
        weightedScore += contribution;
        breakdown.push({ dimensionId: dim.id, name: dim.name, rawScore: raw, contribution: Math.round(contribution * 10) / 10 });
      });

      const score = Math.round(Math.min(weightedScore, 100));
      let category = 'LOW';
      for (const [cat, range] of Object.entries(_scoreThresholds)) {
        if (score >= range.min && score <= range.max) { category = cat; break; }
      }

      return { score, category, breakdown };
    },

    // ── Decision Engine ────────────────────────────────────────────────────────

    /**
     * Full evaluation pipeline. Pass a plain caseData object.
     *
     * Returns:
     *   {
     *     score, category, breakdown,
     *     firedRules,
     *     recommendation: 'APPROVE' | 'EDD_REQUIRED' | 'HIGH_RISK' | 'BLOCK',
     *     reasons: string[],
     *     fieldState: { [fieldId]: { visible, required } }
     *   }
     */
    evaluate(caseData) {
      const scoring    = this.calculateRiskScore(caseData);
      const firedRules = this.evaluateRules(caseData);
      const fieldState = this.applyFieldLogic(caseData);
      const cfg        = _decisionConfig;
      const reasons    = [];

      let recommendation = 'APPROVE';

      // Score-based escalation
      if (scoring.score >= cfg.blockScoreThreshold) {
        recommendation = 'BLOCK';
        reasons.push(`Composite risk score ${scoring.score} ≥ block threshold ${cfg.blockScoreThreshold}`);
      } else if (scoring.score >= cfg.eddScoreThreshold) {
        recommendation = 'EDD_REQUIRED';
        reasons.push(`Composite risk score ${scoring.score} ≥ EDD threshold ${cfg.eddScoreThreshold}`);
      } else if (scoring.score < cfg.autoApproveBelow && firedRules.length === 0) {
        recommendation = 'APPROVE';
        reasons.push(`Score ${scoring.score} is below auto-approve threshold and no rules fired`);
      }

      // Rule-based escalation (always overrides score)
      firedRules.forEach(rule => {
        reasons.push(`Rule ${rule.id} fired: ${rule.name}`);
        if (rule.action === 'BLOCK' || (rule.action === 'FLAG_CRITICAL' && recommendation !== 'BLOCK')) {
          recommendation = 'BLOCK';
        } else if (rule.action === 'FLAG_HIGH' && !['BLOCK'].includes(recommendation)) {
          recommendation = 'HIGH_RISK';
        } else if (rule.action === 'FLAG_EDD' && recommendation === 'APPROVE') {
          recommendation = 'EDD_REQUIRED';
        }
      });

      // Hard override: always block on sanctions match
      if (cfg.blockOnSanctions && caseData.sanctions_match === true) {
        recommendation = 'BLOCK';
        if (!reasons.find(r => r.includes('sanctions'))) {
          reasons.push('Sanctions match detected — hard block enforced');
        }
      }

      _audit('EVALUATE', `recommendation=${recommendation} score=${scoring.score} rules=${firedRules.length}`);

      return { ...scoring, firedRules, recommendation, reasons, fieldState };
    },

    // ── Dependency Map ─────────────────────────────────────────────────────────

    getDependencyMap() { return buildDependencyMap(); },

    // ── Audit Log ─────────────────────────────────────────────────────────────

    getAuditLog(limit = 100) { return _auditLog.slice(0, limit); },

    clearAuditLog() {
      _auditLog = [];
      _audit('CLEAR_AUDIT', 'Audit log cleared');
      this.save();
    },

    // ── Export / Import ────────────────────────────────────────────────────────

    /** Export the full configuration as a JSON string (for download). */
    exportConfig() {
      return JSON.stringify({
        exportedAt: new Date().toISOString(),
        fields: _fields, fieldDependencies: _fieldDependencies,
        rules: _rules, scoringDimensions: _scoringDimensions,
        scoreThresholds: _scoreThresholds, decisionConfig: _decisionConfig,
      }, null, 2);
    },

    /** Import a previously exported configuration JSON string. */
    importConfig(jsonStr) {
      const cfg = JSON.parse(jsonStr);
      if (cfg.fields)            _fields            = cfg.fields;
      if (cfg.fieldDependencies) _fieldDependencies = cfg.fieldDependencies;
      if (cfg.rules)             _rules             = cfg.rules;
      if (cfg.scoringDimensions) _scoringDimensions = cfg.scoringDimensions;
      if (cfg.scoreThresholds)   _scoreThresholds   = cfg.scoreThresholds;
      if (cfg.decisionConfig)    _decisionConfig    = cfg.decisionConfig;
      _audit('IMPORT', `Config imported (exported at ${cfg.exportedAt})`);
      this.save();
    },
  };

})();

// Auto-initialise on load
DynamicEDDEngine.init();
