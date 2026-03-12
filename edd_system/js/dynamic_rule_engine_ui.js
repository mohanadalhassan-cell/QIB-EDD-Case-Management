/* ═══════════════════════════════════════════════════════════
   ADMIN CONTROL PANEL — UI Logic
   ═══════════════════════════════════════════════════════════ */

let config = DynamicEDDEngine.getConfig();

/* ── HTML Escape Helper (prevents XSS when rendering user-supplied strings) ── */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Validate a CSS colour string to prevent style injection */
function safeColor(color) {
  return /^#[0-9A-Fa-f]{3,8}$/.test(color) ? color : '#888888';
}

/* ── Toast Helper ── */
function showToast(msg, icon = '✅') {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').textContent = icon;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Layer Tab Switching ── */
document.getElementById('layer-tabs').addEventListener('click', (e) => {
  const btn = e.target.closest('.layer-tab');
  if (!btn) return;
  document.querySelectorAll('.layer-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.layer-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
});

/* ══════════════════════════════════════════════════════════
   LAYER 3 — RULE ENGINE RENDERING
   ══════════════════════════════════════════════════════════ */

const OPERATORS = {
  equals: '=',
  notEquals: '≠',
  gt: '>',
  gte: '≥',
  lt: '<',
  lte: '≤',
  in: 'IN',
  notIn: 'NOT IN',
  contains: 'CONTAINS',
};

function actionBadge(rule) {
  const a = rule.action;
  const validCategories = ['critical', 'high', 'medium', 'low'];
  const catClass = validCategories.includes((a.riskCategory || '').toLowerCase())
    ? (a.riskCategory || 'high').toLowerCase()
    : 'high';
  if (a.type === 'FORCE_DECISION') {
    return `<span class="engine-badge badge-${catClass}">⚡ FORCE → ${esc(a.riskCategory)}</span>`;
  }
  if (a.type === 'BOOST_SCORE') return `<span class="engine-badge" style="background:rgba(255,167,38,0.15);color:#FFA726;">▲ +${esc(String(a.amount))} pts</span>`;
  if (a.type === 'REDUCE_SCORE') return `<span class="engine-badge" style="background:rgba(0,230,118,0.15);color:#00E676;">▼ -${esc(String(a.amount))} pts</span>`;
  return '';
}

function renderRules() {
  config = DynamicEDDEngine.getConfig();
  const container = document.getElementById('rules-container');
  const sorted = [...config.rules].sort((a, b) => a.priority - b.priority);
  if (sorted.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.3);">No rules configured. Click "+ Add Rule" to create one.</div>';
    return;
  }
  container.innerHTML = sorted.map(rule => `
    <div class="rule-card ${rule.enabled ? '' : 'disabled'}" data-rule-id="${esc(rule.id)}">
      <div class="rule-header">
        <div>
          <div class="rule-name">${esc(rule.name)}</div>
          ${rule.nameAr ? `<div class="rule-name-ar">${esc(rule.nameAr)}</div>` : ''}
        </div>
        <div class="rule-meta">
          <span style="font-size:11px;color:rgba(255,255,255,0.4);">P${esc(String(rule.priority))}</span>
          ${actionBadge(rule)}
          <label class="toggle-switch" title="${rule.enabled ? 'Disable' : 'Enable'} rule">
            <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-rule-id="${esc(rule.id)}" class="rule-toggle">
            <span class="toggle-slider"></span>
          </label>
          <button class="btn btn-sm btn-secondary rule-edit-btn" data-rule-id="${esc(rule.id)}" title="Edit">✏️</button>
          <button class="btn btn-sm btn-danger rule-delete-btn" data-rule-id="${esc(rule.id)}" title="Delete">🗑</button>
        </div>
      </div>
      <div class="rule-conditions">
        <span style="font-size:11px;color:rgba(255,255,255,0.4);">IF</span>
        ${rule.conditions.map((c, i) => `
          ${i > 0 ? `<span class="condition-logic">${esc(rule.logic)}</span>` : ''}
          <span class="condition-chip">
            <span style="color:#fff;">${esc(c.field)}</span>
            <span class="condition-op">${esc(OPERATORS[c.operator] || c.operator)}</span>
            <span style="color:#FFA726;">${esc(Array.isArray(c.value) ? c.value.join(', ') : String(c.value))}</span>
          </span>
        `).join('')}
      </div>
      <div class="rule-action">
        ${rule.action.type === 'FORCE_DECISION'
          ? `<span class="action-force">⚡ FORCE DECISION:</span> <strong>${esc(rule.action.decision)}</strong> → Risk Category: <strong>${esc(rule.action.riskCategory)}</strong>`
          : rule.action.type === 'BOOST_SCORE'
            ? `<span class="action-boost">▲ BOOST SCORE</span> by <strong>+${esc(String(rule.action.amount))}</strong> points`
            : `<span class="action-reduce">▼ REDUCE SCORE</span> by <strong>-${esc(String(rule.action.amount))}</strong> points`
        }
      </div>
    </div>
  `).join('');

  // Attach event listeners using data attributes (avoids inline handler injection)
  container.querySelectorAll('.rule-toggle').forEach(el => {
    el.addEventListener('change', () => toggleRule(el.dataset.ruleId, el.checked));
  });
  container.querySelectorAll('.rule-edit-btn').forEach(el => {
    el.addEventListener('click', () => openEditModal(el.dataset.ruleId));
  });
  container.querySelectorAll('.rule-delete-btn').forEach(el => {
    el.addEventListener('click', () => deleteRule(el.dataset.ruleId));
  });
}

function toggleRule(ruleId, enabled) {
  DynamicEDDEngine.updateRule(ruleId, { enabled });
  showToast(`Rule ${enabled ? 'enabled' : 'disabled'}`, enabled ? '✅' : '⏸');
  renderRules();
}

function deleteRule(ruleId) {
  if (!confirm('Delete this rule?')) return;
  DynamicEDDEngine.deleteRule(ruleId);
  showToast('Rule deleted', '🗑');
  renderRules();
}

/* ══════════════════════════════════════════════════════════
   RULE MODAL
   ══════════════════════════════════════════════════════════ */

const FIELDS = DynamicEDDEngine.getConfig().fields.map(f => f.id);
const OPERATOR_OPTS = Object.entries(OPERATORS).map(([k,v]) => `<option value="${k}">${v} (${k})</option>`).join('');

function updateActionForm() {
  const type = document.getElementById('modal-action-type').value;
  const p = document.getElementById('modal-action-params');
  if (type === 'FORCE_DECISION') {
    p.innerHTML = `
      <div class="form-row">
        <label>Decision</label>
        <select id="modal-action-decision">
          <option value="EDD_REQUIRED">EDD_REQUIRED</option>
          <option value="EDD_REVIEW">EDD_REVIEW</option>
          <option value="CDD_SUFFICIENT">CDD_SUFFICIENT</option>
        </select>
      </div>
      <div class="form-row">
        <label>Risk Category</label>
        <select id="modal-action-risk">
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>`;
  } else {
    p.innerHTML = `
      <div class="form-row">
        <label>Score Adjustment Amount (0–100)</label>
        <input type="number" id="modal-action-amount" min="1" max="100" value="20">
      </div>`;
  }
}

function addConditionRow(field = '', operator = 'equals', value = '') {
  const row = document.createElement('div');
  row.className = 'cond-row';
  row.innerHTML = `
    <select class="cond-field">
      ${FIELDS.map(f => `<option value="${f}" ${f === field ? 'selected' : ''}>${f}</option>`).join('')}
    </select>
    <select class="cond-op">${OPERATOR_OPTS.replace(`value="${operator}"`, `value="${operator}" selected`)}</select>
    <input class="cond-val" type="text" value="${value}" placeholder="value">
    <button class="btn-remove-cond" onclick="this.parentElement.remove()">×</button>
  `;
  document.getElementById('modal-conditions').appendChild(row);
}

document.getElementById('btn-add-condition').addEventListener('click', () => addConditionRow());

function openAddModal() {
  document.getElementById('modal-title').textContent = 'Add New Rule';
  document.getElementById('modal-rule-id').value = '';
  document.getElementById('modal-rule-name').value = '';
  document.getElementById('modal-rule-name-ar').value = '';
  document.getElementById('modal-rule-priority').value = '10';
  document.getElementById('modal-rule-logic').value = 'AND';
  document.getElementById('modal-conditions').innerHTML = '';
  document.getElementById('modal-action-type').value = 'FORCE_DECISION';
  updateActionForm();
  addConditionRow();
  document.getElementById('rule-modal').style.display = 'flex';
}

function openEditModal(ruleId) {
  config = DynamicEDDEngine.getConfig();
  const rule = config.rules.find(r => r.id === ruleId);
  if (!rule) return;
  document.getElementById('modal-title').textContent = 'Edit Rule';
  document.getElementById('modal-rule-id').value = rule.id;
  document.getElementById('modal-rule-name').value = rule.name;
  document.getElementById('modal-rule-name-ar').value = rule.nameAr || '';
  document.getElementById('modal-rule-priority').value = rule.priority;
  document.getElementById('modal-rule-logic').value = rule.logic;
  document.getElementById('modal-conditions').innerHTML = '';
  document.getElementById('modal-action-type').value = rule.action.type;
  updateActionForm();
  rule.conditions.forEach(c => addConditionRow(c.field, c.operator, Array.isArray(c.value) ? c.value.join(',') : c.value));
  // populate action values
  if (rule.action.type === 'FORCE_DECISION') {
    setTimeout(() => {
      const el = document.getElementById('modal-action-decision');
      if (el) el.value = rule.action.decision || 'EDD_REQUIRED';
      const re = document.getElementById('modal-action-risk');
      if (re) re.value = rule.action.riskCategory || 'HIGH';
    }, 50);
  } else {
    setTimeout(() => {
      const el = document.getElementById('modal-action-amount');
      if (el) el.value = rule.action.amount || 20;
    }, 50);
  }
  document.getElementById('rule-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('rule-modal').style.display = 'none';
}

document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
document.getElementById('rule-modal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('rule-modal')) closeModal();
});

document.getElementById('btn-modal-save').addEventListener('click', () => {
  const id = document.getElementById('modal-rule-id').value;
  const name = document.getElementById('modal-rule-name').value.trim();
  if (!name) { alert('Rule name is required.'); return; }

  const conditions = [...document.querySelectorAll('#modal-conditions .cond-row')].map(row => ({
    field: row.querySelector('.cond-field').value,
    operator: row.querySelector('.cond-op').value,
    value: (() => {
      const raw = row.querySelector('.cond-val').value.trim();
      if (raw === 'true') return true;
      if (raw === 'false') return false;
      const n = Number(raw);
      if (!isNaN(n) && raw !== '') return n;
      if (raw.includes(',')) return raw.split(',').map(s => s.trim());
      return raw;
    })(),
  }));

  const actionType = document.getElementById('modal-action-type').value;
  let action;
  if (actionType === 'FORCE_DECISION') {
    action = {
      type: 'FORCE_DECISION',
      decision: document.getElementById('modal-action-decision').value,
      riskCategory: document.getElementById('modal-action-risk').value,
    };
  } else {
    action = {
      type: actionType,
      amount: parseInt(document.getElementById('modal-action-amount').value) || 20,
    };
  }

  const rule = {
    id: id || undefined,
    name,
    nameAr: document.getElementById('modal-rule-name-ar').value.trim(),
    priority: parseInt(document.getElementById('modal-rule-priority').value) || 10,
    logic: document.getElementById('modal-rule-logic').value,
    enabled: true,
    conditions,
    action,
  };

  if (id) {
    DynamicEDDEngine.updateRule(id, rule);
    showToast('Rule updated successfully');
  } else {
    DynamicEDDEngine.addRule(rule);
    showToast('Rule added successfully');
  }
  closeModal();
  renderRules();
});

document.getElementById('btn-add-rule').addEventListener('click', openAddModal);

/* ══════════════════════════════════════════════════════════
   LAYER 4 — WEIGHTS RENDERING
   ══════════════════════════════════════════════════════════ */

function renderWeights() {
  config = DynamicEDDEngine.getConfig();
  const container = document.getElementById('weights-container');
  container.innerHTML = config.fields
    .filter(f => f.enabled)
    .map(f => {
      const w = (config.weights[f.id] || 0);
      return `
        <div class="weight-row">
          <div class="weight-label">${esc(f.label)}</div>
          <input type="range" class="weight-slider" data-field="${esc(f.id)}"
            min="0" max="100" value="${Math.round(w * 100)}">
          <div class="weight-value" id="wv-${esc(f.id)}">${w.toFixed(2)}</div>
        </div>`;
    }).join('');
  // Attach event listeners after rendering
  container.querySelectorAll('.weight-slider').forEach(s => {
    s.addEventListener('input', () => updateWeightDisplay(s));
  });
  updateTotalWeight();
}

function updateWeightDisplay(slider) {
  const fieldId = slider.dataset.field;
  const val = slider.value / 100;
  document.getElementById('wv-' + fieldId).textContent = val.toFixed(2);
  updateTotalWeight();
}

function updateTotalWeight() {
  const sliders = document.querySelectorAll('.weight-slider');
  let total = 0;
  sliders.forEach(s => total += s.value / 100);
  const el = document.getElementById('total-weight');
  el.textContent = total.toFixed(2);
  el.style.color = Math.abs(total - 1.0) < 0.01 ? '#00E676' : '#FFA726';
}

document.getElementById('btn-save-weights').addEventListener('click', () => {
  const weights = {};
  document.querySelectorAll('.weight-slider').forEach(s => {
    weights[s.dataset.field] = s.value / 100;
  });
  DynamicEDDEngine.updateWeights(weights);
  showToast('Weights saved successfully');
});

/* ══════════════════════════════════════════════════════════
   LAYER 5 — THRESHOLD RENDERING
   ══════════════════════════════════════════════════════════ */

function renderThresholds() {
  config = DynamicEDDEngine.getConfig();
  const container = document.getElementById('thresholds-container');
  container.innerHTML = Object.entries(config.decisionThresholds)
    .sort((a, b) => b[1].min - a[1].min)
    .map(([key, t]) => {
      const color = safeColor(t.color);
      return `
      <div class="threshold-card">
        <div class="threshold-label" style="color:${color}">${esc(t.label)}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;font-family:var(--font-arabic);direction:rtl;">${esc(t.labelAr || '')}</div>
        <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:8px;">Minimum Score:</div>
        <input type="number" class="threshold-min-input" data-key="${esc(key)}"
          min="0" max="100" value="${parseInt(t.min) || 0}" style="color:${color};border-color:${color}33;">
        <div class="threshold-decision">${esc(t.decision)}</div>
      </div>
    `}).join('');
}

document.getElementById('btn-save-thresholds').addEventListener('click', () => {
  const updates = {};
  document.querySelectorAll('.threshold-min-input').forEach(el => {
    const key = el.dataset.key;
    const cfg = config.decisionThresholds[key];
    updates[key] = { ...cfg, min: parseInt(el.value) };
  });
  DynamicEDDEngine.updateThresholds(updates);
  config = DynamicEDDEngine.getConfig();
  showToast('Thresholds saved successfully');
});

/* ══════════════════════════════════════════════════════════
   LIVE EVALUATOR
   ══════════════════════════════════════════════════════════ */

function renderEvalForm() {
  config = DynamicEDDEngine.getConfig();
  const form = document.getElementById('eval-form');
  form.innerHTML = config.fields.filter(f => f.enabled).map(f => {
    if (f.type === 'boolean') {
      return `<div class="eval-field">
        <label>${esc(f.label)}</label>
        <select id="eval-${esc(f.id)}">
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>`;
    }
    if (f.type === 'select') {
      // Get scoring options
      const sc = config.fieldScoring[f.id];
      const opts = sc && !sc.thresholds && !sc.passthrough && !sc.true
        ? Object.keys(sc).filter(k => k !== 'DEFAULT').map(k => `<option value="${esc(k)}">${esc(k)}</option>`).join('')
        : `<option value="LOW_RISK_LIST">LOW_RISK_LIST</option>
           <option value="MEDIUM_RISK_LIST">MEDIUM_RISK_LIST</option>
           <option value="HIGH_RISK_LIST">HIGH_RISK_LIST</option>`;
      return `<div class="eval-field">
        <label>${esc(f.label)}</label>
        <select id="eval-${esc(f.id)}">${opts}</select>
      </div>`;
    }
    return `<div class="eval-field">
      <label>${esc(f.label)}</label>
      <input type="number" id="eval-${esc(f.id)}" placeholder="Enter value">
    </div>`;
  }).join('');
}

function getEvalData() {
  const data = {};
  config.fields.filter(f => f.enabled).forEach(f => {
    const el = document.getElementById('eval-' + f.id);
    if (!el) return;
    let val = el.value;
    if (f.type === 'boolean') val = val === 'true';
    else if (f.type === 'number') val = parseFloat(val) || 0;
    data[f.id] = val;
  });
  return data;
}

function showResult(result) {
  const { finalScore, baseScore, scoreAdjustment, decision, triggeredRules, fieldScores } = result;
  const pct = finalScore + '%';
  const gaugeColor = safeColor(decision.color || '#00E676');
  document.getElementById('eval-result').innerHTML = `
    <div class="score-gauge" style="--gauge-pct:${pct};--gauge-color:${gaugeColor};">
      <div class="score-gauge-inner">
        <div class="score-number" style="color:${gaugeColor};">${esc(String(finalScore))}</div>
        <div class="score-label">Risk Score</div>
      </div>
    </div>
    <div style="margin-bottom:12px;">
      <span class="result-chip" style="background:${gaugeColor}22;color:${gaugeColor};border:1px solid ${gaugeColor}44;">
        ${esc(decision.label || decision.category)}
      </span>
    </div>
    <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">${esc(decision.decision)}</div>
    ${decision.forced
      ? `<div style="font-size:11px;color:#FFA726;margin-bottom:12px;">⚡ Forced by rule: ${esc(String(decision.forcedByRule))}</div>`
      : `<div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:12px;">Base: ${esc(String(baseScore))} ${scoreAdjustment >= 0 ? '+' : ''}${esc(String(scoreAdjustment))} adj = <strong>${esc(String(finalScore))}</strong></div>`
    }
    ${triggeredRules.length > 0 ? `
    <div style="text-align:left;margin-bottom:12px;">
      <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-bottom:6px;">Triggered Rules:</div>
      ${triggeredRules.map(r => `<div style="font-size:11px;color:#FFA726;margin-bottom:2px;">▶ ${esc(r.id)}: ${esc(r.name)}</div>`).join('')}
    </div>` : ''}
    <table class="score-table" style="text-align:left;margin-top:4px;">
      <thead><tr><th>Field</th><th>Score</th><th>Weight</th><th></th></tr></thead>
      <tbody>
        ${fieldScores.map(fs => {
          const barColor = fs.score >= 70 ? '#FF5252' : fs.score >= 40 ? '#FFA726' : '#00E676';
          return `
          <tr>
            <td>${esc(fs.label)}</td>
            <td style="color:${barColor};font-weight:700;">${esc(String(fs.score))}</td>
            <td style="color:rgba(255,255,255,0.5);">${esc((fs.weight * 100).toFixed(0))}%</td>
            <td style="width:80px;"><div class="score-bar-wrap"><div class="score-bar-fill" style="width:${esc(String(fs.score))}%;background:${barColor};"></div></div></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

document.getElementById('btn-evaluate').addEventListener('click', () => {
  const data = getEvalData();
  const result = DynamicEDDEngine.evaluate(data);
  showResult(result);
});

document.getElementById('btn-demo-high').addEventListener('click', () => {
  // Fill in a high-risk customer
  const demo = DynamicEDDEngine.runDemo()[0];
  config.fields.filter(f => f.enabled).forEach(f => {
    const el = document.getElementById('eval-' + f.id);
    if (!el) return;
    const v = demo.result.fieldScores.find(fs => fs.fieldId === f.id);
    if (f.type === 'boolean') {
      if (f.id === 'pep' || f.id === 'sanctions' || f.id === 'adverse_media') el.value = 'true';
    } else if (f.type === 'number') {
      const vals = { income: 2000000, transaction_volume: 600000, country_risk: 90 };
      if (vals[f.id] !== undefined) el.value = vals[f.id];
    } else {
      const vals = { nationality: 'HIGH_RISK_LIST', occupation: 'Political / Government' };
      if (vals[f.id]) el.value = vals[f.id];
    }
  });
  document.getElementById('btn-evaluate').click();
});

document.getElementById('btn-demo-low').addEventListener('click', () => {
  config.fields.filter(f => f.enabled).forEach(f => {
    const el = document.getElementById('eval-' + f.id);
    if (!el) return;
    if (f.type === 'boolean') el.value = 'false';
    else if (f.type === 'number') {
      const vals = { income: 60000, transaction_volume: 8000, country_risk: 15 };
      if (vals[f.id] !== undefined) el.value = vals[f.id];
    } else {
      const vals = { nationality: 'LOW_RISK_LIST', occupation: 'Technology' };
      if (vals[f.id]) el.value = vals[f.id];
    }
  });
  document.getElementById('btn-evaluate').click();
});

/* ── Global actions ── */
document.getElementById('btn-reset-defaults').addEventListener('click', () => {
  if (!confirm('Reset all rules, weights and thresholds to factory defaults?')) return;
  config = DynamicEDDEngine.resetToDefaults();
  renderRules(); renderWeights(); renderThresholds(); renderEvalForm();
  showToast('Configuration reset to defaults', '🔄');
});

document.getElementById('btn-export-config').addEventListener('click', () => {
  const cfg = DynamicEDDEngine.getConfig();
  const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `edd_engine_config_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  showToast('Configuration exported');
});

/* ── Initial Render ── */
renderRules();
renderWeights();
renderThresholds();
renderEvalForm();
