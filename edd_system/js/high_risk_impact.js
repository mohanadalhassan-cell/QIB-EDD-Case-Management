// ═══════════════════════════════════════════════════════════════
// HIGH RISK IMPACT SYSTEM — Decision Support Logic
// Banking Risk Detection & Action Guidance
// ═══════════════════════════════════════════════════════════════

/**
 * High Risk Impact System
 * Detects HIGH/MEDIUM risk customers and displays:
 * 1. Current Risk Exposure
 * 2. Potential Consequences
 * 3. Next Best Actions
 * 4. Investigator Authority statement
 */

class HighRiskImpactSystem {
  constructor() {
    this.riskConfig = {
      HIGH: {
        threshold: 'AUTO_HIGH or manual HIGH',
        displayFull: true,
        color: 'red',
        badge: '⚠️ HIGH RISK'
      },
      MEDIUM: {
        threshold: 'MEDIUM risk classification',
        displayFull: false,
        color: 'orange',
        badge: '⚠️ MEDIUM RISK'
      },
      LOW: {
        threshold: 'GREEN or CLEARED',
        displayFull: false,
        color: 'green',
        badge: null
      }
    };
  }

  /**
   * Detect risk level from case data
   * @param {Object} caseData - EDD case object
   * @returns {string} - 'HIGH', 'MEDIUM', or 'LOW'
   */
  detectRiskLevel(caseData) {
    if (!caseData) return 'LOW';

    const riskCategory = caseData.riskCategory || 'LOW';
    
    if (riskCategory === 'HIGH' || riskCategory === 'AUTO_HIGH') {
      return 'HIGH';
    } else if (riskCategory === 'MEDIUM') {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  /**
   * Generate Current Risk Exposure from case data
   * @param {Object} caseData - EDD case object
   * @returns {Array} - Risk exposure items
   */
  generateRiskExposure(caseData) {
    if (!caseData) return [];

    const exposure = [];

    // PEP Status
    if (caseData.pepStatus !== undefined) {
      exposure.push({
        label: 'PEP Status',
        value: caseData.pepStatus 
          ? `Yes (${caseData.pepType || 'Politician/Public Official'})` 
          : 'No',
        level: caseData.pepStatus ? 'high' : 'low'
      });
    }

    // Country Risk
    if (caseData.countryRisk) {
      exposure.push({
        label: 'Country Risk Level',
        value: caseData.countryRisk.level 
          ? `${caseData.countryRisk.level} (${caseData.countryRisk.name || 'N/A'})`
          : 'Not available',
        level: caseData.countryRisk.level?.toLowerCase() || 'medium'
      });
    }

    // Occupation Risk
    if (caseData.occupationRisk) {
      exposure.push({
        label: 'Occupation Risk',
        value: caseData.occupationRisk.level 
          ? `${caseData.occupationRisk.level} (${caseData.occupationRisk.category || 'N/A'})`
          : 'Not classified',
        level: caseData.occupationRisk.level?.toLowerCase() || 'medium'
      });
    }

    // Activity Risk
    if (caseData.activityFlags && caseData.activityFlags.length > 0) {
      exposure.push({
        label: 'Activity Risk',
        value: caseData.activityFlags.join(', '),
        level: 'high'
      });
    } else {
      exposure.push({
        label: 'Activity Risk',
        value: 'Normal transaction patterns',
        level: 'low'
      });
    }

    // Product Risk
    if (caseData.productRisk) {
      exposure.push({
        label: 'Product Risk',
        value: caseData.productRisk.level 
          ? `${caseData.productRisk.level} (${caseData.productRisk.name || 'N/A'})`
          : 'Standard product',
        level: caseData.productRisk.level?.toLowerCase() || 'low'
      });
    }

    // Documentation Score
    if (caseData.documentationScore !== undefined) {
      const score = caseData.documentationScore;
      const status = score >= 75 ? 'Verified' : 'Missing critical evidence';
      exposure.push({
        label: 'Data Confidence',
        value: `${score}% (${status})`,
        level: score >= 75 ? 'low' : 'high'
      });
    }

    return exposure;
  }

  /**
   * Generate Potential Consequences based on risk factors
   * @param {Object} caseData - EDD case object
   * @returns {Array} - Consequence items
   */
  generateConsequences(caseData) {
    const consequences = [];
    
    if (!caseData) return consequences;

    // Group A: Timeline & Governance Operational Impact
    consequences.push('Timeline Impact: Review cycle extended from 14 to 21 days (Compliance Committee approval required)');
    consequences.push('Governance: Decision authority escalates to Chief Risk Officer for final sign-off');
    consequences.push('Workload: Additional investigator hours required for documentation and evidence gathering');

    // Group B: Escalation & Oversight Requirements
    if (caseData.pepStatus || caseData.countryRisk?.level === 'High') {
      consequences.push('Escalation Path: Case moves to Compliance Committee with mandatory executive review');
      consequences.push('Regulatory Readiness: Prepare case file for potential regulator inspection within 30 days');
    }

    // Group C: Controls & Monitoring Enhancement
    if (caseData.activityFlags?.length > 0) {
      consequences.push('Account Controls: Enhanced monitoring activated (real-time alerts vs. weekly batch processing)');
      consequences.push('Evidence Requirements: Additional documentation (Source of Wealth verification required)');
    }

    // Group D: Regulatory & Audit Focus
    consequences.push('Audit Attention: Elevated risk profile triggers increased regulatory examination likelihood');
    consequences.push('Data Confidence: Current documentation completeness at ' + (caseData.documentationScore || 0) + '% — target 80%+ required for completion');

    return consequences;
  }

  /**
   * Generate Next Best Actions based on case data
   * @param {Object} caseData - EDD case object
   * @returns {Array} - Action items
   */
  generateActions(caseData) {
    const actions = [];

    if (!caseData) return actions;

    // Missing Source of Wealth
    if (!caseData.sourceOfWealthDoc || caseData.sourceOfWealthDoc === 'Missing') {
      actions.push({
        id: 'ACT001',
        text: 'Collect: Source of Wealth documentation (DMS: missing)',
        priority: 'CRITICAL',
        status: 'Missing',
        checked: false
      });
    }

    // Missing/Expired Salary Certificate
    if (!caseData.salaryDoc || caseData.salaryDoc === 'Missing') {
      actions.push({
        id: 'ACT002',
        text: 'Collect: Salary Certificate or recent tax return',
        priority: 'CRITICAL',
        status: 'Missing',
        checked: false
      });
    }

    // Passport expiry check
    if (caseData.passportExpiry) {
      const expiryDate = new Date(caseData.passportExpiry);
      const monthsUntilExpiry = (expiryDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsUntilExpiry < 6) {
        actions.push({
          id: 'ACT003',
          text: `Verify: Passport validity (expires ${caseData.passportExpiry})`,
          priority: 'HIGH',
          status: `Expires in ${Math.floor(monthsUntilExpiry)} months`,
          checked: false
        });
      }
    }

    // PEP Verification
    if (caseData.pepStatus) {
      actions.push({
        id: 'ACT004',
        text: 'Escalate: Confirm PEP status with external data provider',
        priority: 'CRITICAL',
        status: 'PEP flag requires validation',
        checked: false
      });
    }

    // High-Risk Country Documentation
    if (caseData.countryRisk?.level === 'High') {
      actions.push({
        id: 'ACT005',
        text: 'Document: Connection/justification for high-risk jurisdiction',
        priority: 'CRITICAL',
        status: 'Risk reason needed',
        checked: false
      });
    }

    // Transaction Pattern Analysis
    if (caseData.activityFlags?.includes('Structured Deposits')) {
      actions.push({
        id: 'ACT006',
        text: 'Analyze: Last 6 transactions for sanction evasion patterns',
        priority: 'HIGH',
        status: 'Transaction review required',
        checked: false
      });
    }

    // Compliance Escalation
    if (caseData.riskCategory === 'HIGH' || caseData.riskCategory === 'AUTO_HIGH') {
      actions.push({
        id: 'ACT007',
        text: 'Escalate: To Compliance committee if evidence confirms high risk',
        priority: 'CRITICAL',
        status: 'Required by policy',
        checked: false
      });
    }

    return actions;
  }

  /**
   * Render High Risk Impact Panel
   * @param {Object} caseData - EDD case object
   * @param {string} containerId - HTML element ID to render into
   */
  render(caseData, containerId = 'high-risk-impact-container') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Detect risk level
    const riskLevel = this.detectRiskLevel(caseData);

    // Hide panel for LOW risk
    if (riskLevel === 'LOW') {
      container.innerHTML = '';
      return;
    }

    // Generate content
    const exposure = this.generateRiskExposure(caseData);
    const consequences = this.generateConsequences(caseData);
    const actions = this.generateActions(caseData);

    // Build HTML
    const html = `
      <div class="high-risk-impact-panel ${riskLevel === 'MEDIUM' ? 'medium-risk' : ''}">
        <!-- Header -->
        <div class="high-risk-header">
          <div class="high-risk-badge ${riskLevel === 'MEDIUM' ? 'medium' : ''}">
            ${riskLevel === 'MEDIUM' ? '⚠️ MEDIUM RISK' : '⚠️ HIGH RISK'}
          </div>
          <div class="high-risk-title ${riskLevel === 'MEDIUM' ? 'medium' : ''}">
            High Risk Impact – Current Exposure & Consequences
          </div>
        </div>

        <!-- Current Risk Exposure Section -->
        <div class="risk-section">
          <div class="risk-section-title">📊 Current Risk Exposure</div>
          <div class="risk-exposure-grid">
            ${exposure.map(item => `
              <div class="risk-item">
                <div class="risk-item-label">${item.label}</div>
                <div class="risk-item-value">
                  <span class="risk-level-${item.level}">${item.value}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Potential Consequences Section -->
        <div class="risk-section">
          <div class="risk-section-title">💥 Potential Consequences</div>
          <div class="consequences-list">
            ${consequences.map(consequence => `
              <div class="consequence-item">
                <div class="consequence-icon">⚠️</div>
                <div class="consequence-text">${consequence}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Next Best Actions Section -->
        <div class="risk-section">
          <div class="risk-section-title">🎯 Next Best Actions</div>
          <div class="actions-list">
            ${actions.map(action => `
              <div class="action-item" data-action-id="${action.id}">
                <input 
                  type="checkbox" 
                  class="action-checkbox" 
                  data-action-id="${action.id}"
                  ${action.checked ? 'checked' : ''}
                />
                <div style="flex: 1;">
                  <div class="action-text">${action.text}</div>
                  <div class="action-status">${action.status}</div>
                </div>
                <div class="action-priority ${action.priority.toLowerCase()}">
                  ${action.priority}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Investigator Authority Statement -->
        <div class="investigator-statement">
          <div class="investigator-statement-title">Investigator Authority</div>
          <div class="investigator-statement-text">
            Automated guidance supports your investigation. Final decision remains 
            with the investigator. All decisions and actions taken are logged for audit.
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;

    // Attach event listeners for action checkboxes
    this.attachEventListeners(caseData);

    // Log audit event
    this.logAuditEvent('HIGH_RISK_PANEL_VIEWED', caseData, actions);
  }

  /**
   * Attach event listeners
   * @param {Object} caseData - EDD case object
   */
  attachEventListeners(caseData) {
    const checkboxes = document.querySelectorAll('.action-checkbox');
    
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const actionId = e.target.dataset.actionId;
        const actionItem = e.target.closest('.action-item');
        
        if (e.target.checked) {
          actionItem.classList.add('completed');
        } else {
          actionItem.classList.remove('completed');
        }

        // Log action
        this.logAuditEvent('ACTION_COMPLETED', caseData, {
          actionId: actionId,
          completed: e.target.checked
        });
      });
    });
  }

  /**
   * Log audit event
   * @param {string} eventType - Type of event
   * @param {Object} caseData - EDD case object
   * @param {*} details - Event details
   */
  logAuditEvent(eventType, caseData, details) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: eventType,
      caseId: caseData?.caseId || 'unknown',
      userId: this.getCurrentUserId(),
      details: details
    };

    console.log('[AUDIT LOG]', auditEntry);

    // In production, send to audit logging service
    // this.sendToAuditService(auditEntry);
  }

  /**
   * Get current user ID (mock)
   * @returns {string} - Current user ID
   */
  getCurrentUserId() {
    // In production, get from session/auth system
    return localStorage.getItem('userId') || 'unknown';
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

// Create global instance
const highRiskSystem = new HighRiskImpactSystem();

/**
 * Initialize High Risk Impact System when page loads
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on EDD Case page
  const caseContainer = document.getElementById('high-risk-impact-container');
  if (caseContainer) {
    // Get case data from page (mock - in production, get from API or DOM)
    const caseData = window.caseData || {
      riskCategory: 'LOW'
    };

    // Render system
    highRiskSystem.render(caseData, 'high-risk-impact-container');
  }
});

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HighRiskImpactSystem;
}
