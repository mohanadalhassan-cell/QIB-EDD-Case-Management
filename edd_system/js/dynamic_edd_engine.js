/**
 * Dynamic EDD Engine — QIB Case Management System
 *
 * Architecture:
 *   Layer 1 — Data Layer:       Customer field definitions & data schema
 *   Layer 2 — Field Logic Layer: Per-field scoring maps
 *   Layer 3 — Rule Engine:      Configurable IF/AND/OR condition rules
 *   Layer 4 — Risk Scoring:     Weighted aggregation into a composite score
 *   Layer 5 — Decision Engine:  Final EDD outcome based on score thresholds
 *
 * All configuration is stored in localStorage (key: 'edd_engine_config') so
 * administrators can change rules, weights and thresholds at runtime without
 * touching any source code.
 */

'use strict';

/* ─────────────────────────────────────────────────────────────
   DEFAULT ENGINE CONFIGURATION
   ───────────────────────────────────────────────────────────── */

const DEFAULT_ENGINE_CONFIG = {
  version: '2.0.0',
  lastModified: new Date().toISOString(),

  /* ── Layer 1 · Field Definitions ─────────────────────────── */
  fields: [
    {
      id: 'nationality',
      label: 'Nationality / Country of Origin',
      labelAr: 'الجنسية / بلد المنشأ',
      type: 'select',
      dataSource: 'ETL_CUST_NATIONALITY',
      enabled: true,
    },
    {
      id: 'occupation',
      label: 'Occupation / Business Activity',
      labelAr: 'المهنة / النشاط التجاري',
      type: 'select',
      dataSource: 'ETL_CUST_OCCUPATION',
      enabled: true,
    },
    {
      id: 'income',
      label: 'Annual Income (QAR)',
      labelAr: 'الدخل السنوي (ريال)',
      type: 'number',
      dataSource: 'ETL_CUST_INCOME',
      enabled: true,
    },
    {
      id: 'pep',
      label: 'Politically Exposed Person (PEP)',
      labelAr: 'شخص معرض سياسياً',
      type: 'boolean',
      dataSource: 'ETL_PEP_FLAG',
      enabled: true,
    },
    {
      id: 'sanctions',
      label: 'Sanctions Match',
      labelAr: 'تطابق قائمة العقوبات',
      type: 'boolean',
      dataSource: 'ETL_SANCTIONS_FLAG',
      enabled: true,
    },
    {
      id: 'adverse_media',
      label: 'Adverse Media Hit',
      labelAr: 'إشارة وسائل إعلام سلبية',
      type: 'boolean',
      dataSource: 'ETL_ADVERSE_MEDIA_FLAG',
      enabled: true,
    },
    {
      id: 'transaction_volume',
      label: 'Monthly Transaction Volume (QAR)',
      labelAr: 'حجم المعاملات الشهرية',
      type: 'number',
      dataSource: 'ETL_TXN_MONTHLY_VOLUME',
      enabled: true,
    },
    {
      id: 'country_risk',
      label: 'Country Risk Score',
      labelAr: 'درجة مخاطر الدولة',
      type: 'number',
      dataSource: 'ETL_COUNTRY_RISK_SCORE',
      enabled: true,
    },
  ],

  /* ── Layer 2 · Field Scoring Maps ────────────────────────── */
  fieldScoring: {
    nationality: {
      HIGH_RISK_LIST: 100,
      MEDIUM_RISK_LIST: 60,
      LOW_RISK_LIST: 10,
      DEFAULT: 20,
    },
    occupation: {
      'Money Services': 90,
      'Political / Government': 85,
      'Real Estate': 70,
      'Cash Intensive Business': 80,
      Banking: 40,
      'Healthcare / Medical': 30,
      Education: 20,
      Technology: 20,
      DEFAULT: 30,
    },
    income: {
      thresholds: [
        { max: 50000, score: 20 },
        { max: 150000, score: 30 },
        { max: 500000, score: 50 },
        { max: 1000000, score: 70 },
        { min: 1000001, score: 90 },
      ],
    },
    transaction_volume: {
      thresholds: [
        { max: 10000, score: 10 },
        { max: 50000, score: 25 },
        { max: 200000, score: 50 },
        { max: 500000, score: 75 },
        { min: 500001, score: 95 },
      ],
    },
    country_risk: { passthrough: true },
    pep: { true: 95, false: 0 },
    sanctions: { true: 100, false: 0 },
    adverse_media: { true: 80, false: 0 },
  },

  /* ── Layer 3 · Rule Engine ────────────────────────────────── */
  rules: [
    {
      id: 'RULE-001',
      name: 'Auto-Escalate: Sanctions Match',
      nameAr: 'تصعيد تلقائي: تطابق العقوبات',
      priority: 1,
      enabled: true,
      conditions: [
        { field: 'sanctions', operator: 'equals', value: true },
      ],
      logic: 'AND',
      action: { type: 'FORCE_DECISION', decision: 'EDD_REQUIRED', riskCategory: 'CRITICAL' },
    },
    {
      id: 'RULE-002',
      name: 'Auto-Escalate: PEP with High Country Risk',
      nameAr: 'تصعيد تلقائي: شخص معرض سياسياً مع مخاطر دولة عالية',
      priority: 2,
      enabled: true,
      conditions: [
        { field: 'pep', operator: 'equals', value: true },
        { field: 'country_risk', operator: 'gte', value: 70 },
      ],
      logic: 'AND',
      action: { type: 'FORCE_DECISION', decision: 'EDD_REQUIRED', riskCategory: 'HIGH' },
    },
    {
      id: 'RULE-003',
      name: 'High Risk: Cash Intensive + High Volume',
      nameAr: 'مخاطر عالية: نشاط نقدي كثيف مع حجم معاملات مرتفع',
      priority: 3,
      enabled: true,
      conditions: [
        { field: 'occupation', operator: 'equals', value: 'Cash Intensive Business' },
        { field: 'transaction_volume', operator: 'gte', value: 200000 },
      ],
      logic: 'AND',
      action: { type: 'BOOST_SCORE', amount: 30, riskCategory: 'HIGH' },
    },
    {
      id: 'RULE-004',
      name: 'Medium Risk: High-Risk Occupation',
      nameAr: 'مخاطر متوسطة: مهنة عالية الخطورة',
      priority: 4,
      enabled: true,
      conditions: [
        { field: 'occupation', operator: 'in', value: ['Money Services', 'Real Estate', 'Political / Government'] },
      ],
      logic: 'AND',
      action: { type: 'BOOST_SCORE', amount: 20, riskCategory: 'MEDIUM' },
    },
    {
      id: 'RULE-005',
      name: 'Low Risk: Low Income + Low Volume',
      nameAr: 'مخاطر منخفضة: دخل منخفض وحجم معاملات منخفض',
      priority: 5,
      enabled: true,
      conditions: [
        { field: 'income', operator: 'lte', value: 50000 },
        { field: 'transaction_volume', operator: 'lte', value: 10000 },
      ],
      logic: 'AND',
      action: { type: 'REDUCE_SCORE', amount: 15, riskCategory: 'LOW' },
    },
  ],

  /* ── Layer 4 · Risk Scoring Weights ──────────────────────── */
  weights: {
    nationality: 0.20,
    occupation: 0.25,
    income: 0.10,
    pep: 0.20,
    sanctions: 0.10,
    adverse_media: 0.05,
    transaction_volume: 0.05,
    country_risk: 0.05,
  },

  /* ── Layer 5 · Decision Thresholds ───────────────────────── */
  decisionThresholds: {
    CRITICAL: { min: 90, decision: 'EDD_REQUIRED', label: 'Critical Risk', labelAr: 'مخاطر حرجة', color: '#FF1744' },
    HIGH: { min: 70, decision: 'EDD_REQUIRED', label: 'High Risk', labelAr: 'مخاطر عالية', color: '#FF5252' },
    MEDIUM: { min: 40, decision: 'EDD_REVIEW', label: 'Medium Risk', labelAr: 'مخاطر متوسطة', color: '#FFA726' },
    LOW: { min: 0, decision: 'CDD_SUFFICIENT', label: 'Low Risk', labelAr: 'مخاطر منخفضة', color: '#00E676' },
  },
};

/* ─────────────────────────────────────────────────────────────
   STORAGE HELPERS
   ───────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'edd_engine_config';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to ensure new fields always exist
      return {
        ...DEFAULT_ENGINE_CONFIG,
        ...parsed,
        fields: parsed.fields || DEFAULT_ENGINE_CONFIG.fields,
        fieldScoring: { ...DEFAULT_ENGINE_CONFIG.fieldScoring, ...parsed.fieldScoring },
        rules: parsed.rules || DEFAULT_ENGINE_CONFIG.rules,
        weights: { ...DEFAULT_ENGINE_CONFIG.weights, ...parsed.weights },
        decisionThresholds: {
          ...DEFAULT_ENGINE_CONFIG.decisionThresholds,
          ...parsed.decisionThresholds,
        },
      };
    }
  } catch (e) {
    console.warn('[DynamicEDDEngine] Failed to load config from localStorage:', e);
  }
  return { ...DEFAULT_ENGINE_CONFIG };
}

function saveConfig(config) {
  try {
    config.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('[DynamicEDDEngine] Failed to save config:', e);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   LAYER 2 — FIELD SCORING
   ───────────────────────────────────────────────────────────── */

function scoreField(fieldId, value, scoringMap) {
  const map = scoringMap[fieldId];
  if (!map) return 0;

  // Boolean fields
  if (map.true !== undefined) {
    return value === true || value === 'true' || value === 1 ? map.true : map.false;
  }

  // Pass-through numeric fields (e.g. country_risk already 0-100)
  if (map.passthrough) {
    const n = parseFloat(value);
    return isNaN(n) ? 0 : Math.min(100, Math.max(0, n));
  }

  // Threshold-based numeric fields
  if (map.thresholds) {
    const n = parseFloat(value);
    if (isNaN(n)) return 0;
    for (const t of map.thresholds) {
      const aboveMin = t.min === undefined || n >= t.min;
      const belowMax = t.max === undefined || n <= t.max;
      if (aboveMin && belowMax) return t.score;
    }
    return 0;
  }

  // Lookup by value string
  if (map[value] !== undefined) return map[value];
  return map.DEFAULT !== undefined ? map.DEFAULT : 0;
}

/* ─────────────────────────────────────────────────────────────
   LAYER 3 — RULE EVALUATION
   ───────────────────────────────────────────────────────────── */

function evaluateCondition(condition, customerData) {
  const fieldValue = customerData[condition.field];
  const testValue = condition.value;

  // Normalise both sides to the same type before strict comparison
  function normalise(a, b) {
    if (typeof b === 'boolean') return a === true || a === 'true' || a === 1 ? true : false;
    if (typeof b === 'number') return parseFloat(a);
    return String(a);
  }

  switch (condition.operator) {
    case 'equals':
    case '==':
      return normalise(fieldValue, testValue) === testValue;
    case 'notEquals':
    case '!=':
      return normalise(fieldValue, testValue) !== testValue;
    case 'gt':
    case '>':
      return parseFloat(fieldValue) > parseFloat(testValue);
    case 'gte':
    case '>=':
      return parseFloat(fieldValue) >= parseFloat(testValue);
    case 'lt':
    case '<':
      return parseFloat(fieldValue) < parseFloat(testValue);
    case 'lte':
    case '<=':
      return parseFloat(fieldValue) <= parseFloat(testValue);
    case 'in':
      return Array.isArray(testValue) && testValue.includes(fieldValue);
    case 'notIn':
      return Array.isArray(testValue) && !testValue.includes(fieldValue);
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(testValue).toLowerCase());
    case 'startsWith':
      return String(fieldValue).toLowerCase().startsWith(String(testValue).toLowerCase());
    default:
      return false;
  }
}

function evaluateRule(rule, customerData) {
  if (!rule.enabled) return false;
  const results = rule.conditions.map((c) => evaluateCondition(c, customerData));
  return rule.logic === 'OR' ? results.some(Boolean) : results.every(Boolean);
}

/* ─────────────────────────────────────────────────────────────
   LAYER 4 — RISK SCORING (Weighted Composite)
   ───────────────────────────────────────────────────────────── */

function computeBaseScore(customerData, config) {
  const { fields, fieldScoring, weights } = config;
  let totalWeight = 0;
  let weightedScore = 0;

  for (const field of fields) {
    if (!field.enabled) continue;
    const w = weights[field.id] || 0;
    const raw = customerData[field.id];
    if (raw === undefined || raw === null || raw === '') continue;
    const score = scoreField(field.id, raw, fieldScoring);
    weightedScore += score * w;
    totalWeight += w;
  }

  return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
}

/* ─────────────────────────────────────────────────────────────
   LAYER 5 — DECISION ENGINE
   ───────────────────────────────────────────────────────────── */

function resolveDecision(finalScore, thresholds) {
  for (const [key, t] of Object.entries(thresholds).filter(([,t]) => t.min !== undefined).sort((a, b) => b[1].min - a[1].min)) {
    if (finalScore >= t.min) {
      return { category: key, ...t };
    }
  }
  return { category: 'LOW', ...thresholds.LOW };
}

/* ─────────────────────────────────────────────────────────────
   PUBLIC API — DynamicEDDEngine
   ───────────────────────────────────────────────────────────── */

const DynamicEDDEngine = {
  /**
   * Evaluate a customer record through all 5 layers.
   * @param {object} customerData  - Plain object with field values keyed by field id
   * @param {object} [overrideConfig] - Optional config override (for testing)
   * @returns {object} Evaluation result
   */
  evaluate(customerData, overrideConfig = null) {
    const config = overrideConfig || loadConfig();
    const triggeredRules = [];
    let scoreAdjustment = 0;
    let forcedDecision = null;

    // Sort rules by priority
    const sortedRules = [...config.rules].sort((a, b) => a.priority - b.priority);

    // Layer 3 — Rule Engine pass
    for (const rule of sortedRules) {
      if (evaluateRule(rule, customerData)) {
        triggeredRules.push(rule);
        if (rule.action.type === 'FORCE_DECISION') {
          forcedDecision = rule.action;
          break; // Highest-priority forced rule wins
        } else if (rule.action.type === 'BOOST_SCORE') {
          scoreAdjustment += rule.action.amount || 0;
        } else if (rule.action.type === 'REDUCE_SCORE') {
          scoreAdjustment -= rule.action.amount || 0;
        }
      }
    }

    // Layer 4 — Compute base score
    const baseScore = computeBaseScore(customerData, config);
    const finalScore = Math.min(100, Math.max(0, baseScore + scoreAdjustment));

    // Layer 5 — Decision
    let decision;
    if (forcedDecision) {
      decision = {
        category: forcedDecision.riskCategory,
        decision: forcedDecision.decision,
        label: config.decisionThresholds[forcedDecision.riskCategory]?.label || forcedDecision.riskCategory,
        labelAr: config.decisionThresholds[forcedDecision.riskCategory]?.labelAr || '',
        color: config.decisionThresholds[forcedDecision.riskCategory]?.color || '#FF5252',
        forced: true,
        forcedByRule: triggeredRules[0]?.id,
      };
    } else {
      decision = resolveDecision(finalScore, config.decisionThresholds);
      decision.forced = false;
    }

    return {
      baseScore,
      scoreAdjustment,
      finalScore,
      decision,
      triggeredRules: triggeredRules.map((r) => ({ id: r.id, name: r.name })),
      fieldScores: config.fields
        .filter((f) => f.enabled)
        .map((f) => ({
          fieldId: f.id,
          label: f.label,
          rawValue: customerData[f.id],
          score: scoreField(f.id, customerData[f.id], config.fieldScoring),
          weight: config.weights[f.id] || 0,
        })),
      evaluatedAt: new Date().toISOString(),
    };
  },

  /* ── Config Management ───────────────────────────────────── */

  getConfig() {
    return loadConfig();
  },

  saveConfig(config) {
    return saveConfig(config);
  },

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    return { ...DEFAULT_ENGINE_CONFIG };
  },

  getDefaultConfig() {
    return JSON.parse(JSON.stringify(DEFAULT_ENGINE_CONFIG));
  },

  addRule(rule) {
    const config = loadConfig();
    rule.id = rule.id || 'RULE-' + Date.now();
    config.rules.push(rule);
    saveConfig(config);
    return rule.id;
  },

  updateRule(ruleId, updates) {
    const config = loadConfig();
    const idx = config.rules.findIndex((r) => r.id === ruleId);
    if (idx === -1) return false;
    config.rules[idx] = { ...config.rules[idx], ...updates };
    saveConfig(config);
    return true;
  },

  deleteRule(ruleId) {
    const config = loadConfig();
    const before = config.rules.length;
    config.rules = config.rules.filter((r) => r.id !== ruleId);
    saveConfig(config);
    return config.rules.length < before;
  },

  updateWeights(weights) {
    const config = loadConfig();
    config.weights = { ...config.weights, ...weights };
    saveConfig(config);
  },

  updateThresholds(thresholds) {
    const config = loadConfig();
    config.decisionThresholds = { ...config.decisionThresholds, ...thresholds };
    saveConfig(config);
  },

  updateFieldScoring(fieldId, scoringMap) {
    const config = loadConfig();
    config.fieldScoring[fieldId] = { ...config.fieldScoring[fieldId], ...scoringMap };
    saveConfig(config);
  },

  /* ── Demo Helper ─────────────────────────────────────────── */

  runDemo() {
    const samples = [
      {
        label: 'PEP + Sanctioned Customer',
        data: {
          nationality: 'HIGH_RISK_LIST',
          occupation: 'Political / Government',
          income: 2000000,
          pep: true,
          sanctions: true,
          adverse_media: true,
          transaction_volume: 600000,
          country_risk: 90,
        },
      },
      {
        label: 'Medium Risk: Real Estate Broker',
        data: {
          nationality: 'MEDIUM_RISK_LIST',
          occupation: 'Real Estate',
          income: 300000,
          pep: false,
          sanctions: false,
          adverse_media: false,
          transaction_volume: 150000,
          country_risk: 45,
        },
      },
      {
        label: 'Low Risk: Regular Salaried Employee',
        data: {
          nationality: 'LOW_RISK_LIST',
          occupation: 'Technology',
          income: 60000,
          pep: false,
          sanctions: false,
          adverse_media: false,
          transaction_volume: 8000,
          country_risk: 15,
        },
      },
    ];

    return samples.map((s) => ({
      label: s.label,
      result: this.evaluate(s.data),
    }));
  },
};

// CommonJS + browser global export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DynamicEDDEngine;
} else if (typeof window !== 'undefined') {
  window.DynamicEDDEngine = DynamicEDDEngine;
}
