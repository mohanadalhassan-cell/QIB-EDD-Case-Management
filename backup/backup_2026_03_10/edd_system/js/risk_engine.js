/**
 * QIB Risk Engine Module
 * Version: 2.0.0
 * 
 * This module handles the display and management of risk scores from ETL/SnapView.
 * IMPORTANT: This system READS risk scores from the Risk Engine via ETL - it does NOT calculate them.
 * 
 * ETL Field Names (EXACT - DO NOT MODIFY):
 * - RECORD_ID
 * - PROD_RISK_SCORE, PROD_RISK_CATEG
 * - ACT_RISK_SCORE, ACT_RISK_CATEG
 * - OCCP_RISK_SCORE, OCCP_RISK_CATEG
 * - COUNTRY_RISK_SCORE, COUNTRY_RISK_CATEG
 * - FINAL_RISK_SCORE, FINAL_RISK_CATEG
 * - LAST_SCORE_DATE
 * - TARGET_DESC, SECTOR, SECTOR_DESC, INDUSTRY
 * - AUTO_HIGH_TRIGGER, TRIGGER_REASON
 * 
 * Risk Category Thresholds:
 * - LOW:    Score 0-99    (Green - #4CAF50)
 * - MEDIUM: Score 100-149 (Yellow/Orange - #FFB300)
 * - HIGH:   Score 150+    (Red - #F44336)
 */

const RiskEngine = {
  // Risk category colors
  COLORS: {
    LOW: '#4CAF50',
    MEDIUM: '#FFB300', 
    HIGH: '#F44336',
    'AUTO HIGH': '#F44336'
  },
  
  // Risk category background colors (with opacity)
  BG_COLORS: {
    LOW: 'rgba(76,175,80,0.15)',
    MEDIUM: 'rgba(255,152,0,0.15)',
    HIGH: 'rgba(244,67,54,0.15)',
    'AUTO HIGH': 'rgba(244,67,54,0.15)'
  },
  
  // Risk category border colors (with opacity)
  BORDER_COLORS: {
    LOW: 'rgba(76,175,80,0.3)',
    MEDIUM: 'rgba(255,152,0,0.3)',
    HIGH: 'rgba(244,67,54,0.3)',
    'AUTO HIGH': 'rgba(244,67,54,0.5)'
  },
  
  // Maximum risk score for percentage calculation
  MAX_RISK_SCORE: 500,
  
  /**
   * Get color based on risk category
   * @param {string} category - LOW, MEDIUM, HIGH, or AUTO HIGH
   * @returns {string} Hex color code
   */
  getRiskColor(category) {
    return this.COLORS[category] || this.COLORS.LOW;
  },
  
  /**
   * Get background color based on risk category
   * @param {string} category - LOW, MEDIUM, HIGH, or AUTO HIGH
   * @returns {string} RGBA color string
   */
  getRiskBgColor(category) {
    return this.BG_COLORS[category] || this.BG_COLORS.LOW;
  },
  
  /**
   * Get border color based on risk category
   * @param {string} category - LOW, MEDIUM, HIGH, or AUTO HIGH
   * @returns {string} RGBA color string
   */
  getRiskBorderColor(category) {
    return this.BORDER_COLORS[category] || this.BORDER_COLORS.LOW;
  },
  
  /**
   * Calculate risk percentage (for meter display)
   * @param {number} score - Final risk score
   * @returns {number} Percentage (0-100)
   */
  getRiskPercentage(score) {
    return Math.min(100, Math.round((score / this.MAX_RISK_SCORE) * 100));
  },
  
  /**
   * Get risk meter color based on FINAL_RISK_CATEG
   * @param {string} categ - FINAL_RISK_CATEG value
   * @returns {string} Hex color
   */
  getRiskMeterColor(categ) {
    return this.getRiskColor(categ);
  },
  
  /**
   * Determine PRIMARY_RISK_DRIVER from scores
   * @param {object} rs - Risk scores object
   * @returns {string} Field name of highest risk score
   */
  getPrimaryRiskDriver(rs) {
    const scores = [
      { field: 'ACT_RISK_CATEG', score: rs.ACT_RISK_SCORE, categ: rs.ACT_RISK_CATEG },
      { field: 'PROD_RISK_CATEG', score: rs.PROD_RISK_SCORE, categ: rs.PROD_RISK_CATEG },
      { field: 'OCCP_RISK_CATEG', score: rs.OCCP_RISK_SCORE, categ: rs.OCCP_RISK_CATEG },
      { field: 'COUNTRY_RISK_CATEG', score: rs.COUNTRY_RISK_SCORE, categ: rs.COUNTRY_RISK_CATEG }
    ];
    
    // Find highest score
    let highest = scores[0];
    for (const s of scores) {
      if (s.score > highest.score) {
        highest = s;
      }
    }
    return highest;
  },
  
  /**
   * Get EDD action recommendations based on risk factors
   * @param {object} riskScores - Risk scores object from customer data
   * @returns {Array} Array of action objects with text and severity
   */
  getEDDActions(riskScores) {
    const actions = [];
    
    // Activity Risk Actions (PRIMARY if HIGH)
    if (riskScores.ACT_RISK_CATEG === 'HIGH') {
      actions.push({
        text: 'Transaction Activity Analysis',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
      actions.push({
        text: 'Source of Funds Verification',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
    } else if (riskScores.ACT_RISK_CATEG === 'MEDIUM') {
      actions.push({
        text: 'Transaction Pattern Review',
        severity: 'MEDIUM',
        color: this.COLORS.MEDIUM
      });
    }
    
    // Occupation Risk Actions
    if (riskScores.OCCP_RISK_CATEG === 'HIGH') {
      actions.push({
        text: 'Employment Verification',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
      actions.push({
        text: 'Income Source Documentation',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
    } else if (riskScores.OCCP_RISK_CATEG === 'MEDIUM') {
      actions.push({
        text: 'Occupation Verification',
        severity: 'MEDIUM',
        color: this.COLORS.MEDIUM
      });
    }
    
    // Country Risk Actions
    if (riskScores.COUNTRY_RISK_CATEG === 'HIGH') {
      actions.push({
        text: 'Country Risk Compliance Review',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
      actions.push({
        text: 'Cross-Border Transaction Monitoring',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
    } else if (riskScores.COUNTRY_RISK_CATEG === 'MEDIUM') {
      actions.push({
        text: 'Geographic Risk Assessment',
        severity: 'MEDIUM',
        color: this.COLORS.MEDIUM
      });
    }
    
    // Product Risk Actions
    if (riskScores.PROD_RISK_CATEG === 'HIGH') {
      actions.push({
        text: 'Product Suitability Assessment',
        severity: 'HIGH',
        color: this.COLORS.HIGH
      });
    } else if (riskScores.PROD_RISK_CATEG === 'MEDIUM') {
      actions.push({
        text: 'Product Suitability Review',
        severity: 'MEDIUM',
        color: this.COLORS.MEDIUM
      });
    }
    
    return actions;
  },
  
  /**
   * Get description for risk factor
   * @param {string} driver - Risk driver type (PRODUCT, ACTIVITY, OCCUPATION, COUNTRY)
   * @param {object} customer - Customer data object
   * @returns {string} Description text
   */
  getRiskDescription(driver, customer) {
    switch(driver) {
      case 'PRODUCT':
        return customer.segment === 'Private' ? 'Private Banking Products' : 
               customer.segment === 'Tamayuz' ? 'Premium Products' : 'Standard Products';
      case 'ACTIVITY':
        const triggers = customer.triggers || [];
        if (triggers.includes('High Value Transactions')) return 'High-Value Transactions';
        if (triggers.includes('Cash Intensive')) return 'Cash-Intensive Activity';
        if (triggers.includes('Cross-Border Activity')) return 'Cross-Border Transfers';
        return 'Transaction Patterns';
      case 'OCCUPATION':
        return customer.occupation || 'Employment Status';
      case 'COUNTRY':
        return `${customer.nationality} (${customer.nationalityCode})`;
      default:
        return '';
    }
  },
  
  /**
   * Format ETL update timestamp
   * @param {string} isoDate - ISO date string
   * @returns {string} Formatted date string
   */
  formatETLDate(isoDate) {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  },
  
  /**
   * Format LAST_SCORE_DATE
   * @param {string} dateStr - Date string (YYYY-MM-DD)
   * @returns {string} Formatted date string
   */
  formatScoreDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  },
  
  /**
   * Update Risk Analysis Panel with customer risk data
   * Uses EXACT ETL field names - DO NOT MODIFY
   * @param {object} customer - Customer data object with riskScores
   */
  updateRiskPanel(customer) {
    if (!customer || !customer.riskScores) {
      console.warn('No risk scores available for customer');
      this.hideRiskPanel();
      return;
    }
    
    const rs = customer.riskScores;
    
    // Determine PRIMARY_RISK_DRIVER from highest score
    const primaryDriver = this.getPrimaryRiskDriver(rs);
    
    // Update FINAL_RISK_SCORE
    const finalScoreEl = document.getElementById('final-risk-score');
    if (finalScoreEl) {
      finalScoreEl.textContent = rs.FINAL_RISK_SCORE;
      finalScoreEl.style.color = this.getRiskColor(rs.FINAL_RISK_CATEG);
    }
    
    // Update FINAL_RISK_CATEG
    const finalCategEl = document.getElementById('final-risk-categ');
    if (finalCategEl) {
      finalCategEl.textContent = rs.FINAL_RISK_CATEG;
      finalCategEl.style.color = this.getRiskColor(rs.FINAL_RISK_CATEG);
    }
    
    // Update Risk Percentage
    const percentage = this.getRiskPercentage(rs.FINAL_RISK_SCORE);
    const percentageEl = document.getElementById('risk-percentage');
    if (percentageEl) {
      percentageEl.textContent = percentage + '%';
    }
    
    // Update Risk Meter (SVG circle)
    const meterFill = document.getElementById('risk-meter-fill');
    if (meterFill) {
      const circumference = 251.2; // 2 * PI * 40
      const dashOffset = circumference - (circumference * percentage / 100);
      meterFill.style.strokeDashoffset = dashOffset;
      meterFill.style.stroke = this.getRiskColor(rs.FINAL_RISK_CATEG);
    }
    
    // Update LAST_SCORE_DATE
    const lastScoreDateEl = document.getElementById('last-score-date');
    if (lastScoreDateEl) {
      lastScoreDateEl.textContent = this.formatScoreDate(rs.LAST_SCORE_DATE);
    }
    
    // Update SECTOR_DESC
    const sectorDescEl = document.getElementById('sector-desc');
    if (sectorDescEl) {
      sectorDescEl.textContent = rs.SECTOR_DESC || '-';
    }
    
    // Update Product Risk Card (PROD_RISK_SCORE, PROD_RISK_CATEG)
    this.updateRiskCard('product', rs.PROD_RISK_SCORE, rs.PROD_RISK_CATEG, 
      rs.INDUSTRY || '-', primaryDriver.field === 'PROD_RISK_CATEG');
    
    // Update Activity Risk Card (ACT_RISK_SCORE, ACT_RISK_CATEG)
    this.updateRiskCard('activity', rs.ACT_RISK_SCORE, rs.ACT_RISK_CATEG,
      'Transaction Patterns', primaryDriver.field === 'ACT_RISK_CATEG');
    
    // Update Occupation Risk Card (OCCP_RISK_SCORE, OCCP_RISK_CATEG)
    this.updateRiskCard('occupation', rs.OCCP_RISK_SCORE, rs.OCCP_RISK_CATEG,
      customer.occupation || '-', primaryDriver.field === 'OCCP_RISK_CATEG');
    
    // Update Country Risk Card (COUNTRY_RISK_SCORE, COUNTRY_RISK_CATEG)
    this.updateRiskCard('country', rs.COUNTRY_RISK_SCORE, rs.COUNTRY_RISK_CATEG,
      `${customer.nationality} (${customer.nationalityCode})`, primaryDriver.field === 'COUNTRY_RISK_CATEG');
    
    // Update PRIMARY_RISK_DRIVER display
    const primaryDriverEl = document.getElementById('primary-risk-driver');
    if (primaryDriverEl) {
      primaryDriverEl.innerHTML = `<strong>PRIMARY RISK DRIVER:</strong> ${primaryDriver.field} = ${primaryDriver.categ}`;
      primaryDriverEl.style.color = this.getRiskColor(primaryDriver.categ);
    }
    
    // Update AUTO_HIGH_TRIGGER display
    const autoHighEl = document.getElementById('auto-high-trigger');
    if (autoHighEl) {
      if (rs.AUTO_HIGH_TRIGGER) {
        autoHighEl.style.display = 'block';
        autoHighEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="#F44336" width="20" height="20">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <div>
              <div style="font-weight: 700; color: #F44336;">AUTO HIGH TRIGGER</div>
              <div style="font-size: 12px; color: var(--text-secondary);">Reason: ${rs.TRIGGER_REASON || 'System Triggered'}</div>
            </div>
          </div>
        `;
      } else {
        autoHighEl.style.display = 'none';
      }
    }
    
    // Update EDD Actions
    this.updateEDDActions(rs);
    
    // Show panel
    this.showRiskPanel();
  },
  
  /**
   * Update individual risk factor card
   * @param {string} type - Risk type (product, activity, occupation, country)
   * @param {number} score - Risk score
   * @param {string} category - Risk category (LOW, MEDIUM, HIGH)
   * @param {string} description - Description text
   * @param {boolean} isPrimary - Whether this is the primary risk driver
   */
  updateRiskCard(type, score, category, description, isPrimary) {
    const card = document.getElementById(`risk-${type}`);
    if (!card) return;
    
    const color = this.getRiskColor(category);
    const bgColor = this.getRiskBgColor(category);
    const borderColor = this.getRiskBorderColor(category);
    
    // Update card styling
    card.style.background = bgColor;
    card.style.border = isPrimary ? `2px solid ${color}` : `1px solid ${borderColor}`;
    
    // Add/remove primary driver badge
    let badge = card.querySelector('.primary-driver-badge');
    if (isPrimary && !badge) {
      badge = document.createElement('div');
      badge.className = 'primary-driver-badge';
      badge.style.cssText = `position: absolute; top: -8px; left: 50%; transform: translateX(-50%); 
        background: ${color}; color: white; padding: 2px 10px; border-radius: 10px; 
        font-size: 9px; font-weight: 700;`;
      badge.textContent = 'PRIMARY DRIVER';
      card.style.position = 'relative';
      card.appendChild(badge);
    } else if (!isPrimary && badge) {
      badge.remove();
    }
    
    // Update score
    const scoreEl = document.getElementById(`${type === 'occupation' ? 'occp' : type}-risk-score`);
    if (scoreEl) {
      scoreEl.textContent = score;
      scoreEl.style.color = color;
    }
    
    // Update category badge
    const categEl = document.getElementById(`${type === 'occupation' ? 'occp' : type}-risk-categ`);
    if (categEl) {
      categEl.textContent = category;
      categEl.style.background = `rgba(${this.hexToRgb(color)}, 0.2)`;
      categEl.style.color = color;
    }
    
    // Update description (last child of card)
    const descEl = card.querySelector('div:last-child');
    if (descEl && descEl.style.fontSize === '10px') {
      descEl.textContent = description;
    }
  },
  
  /**
   * Update EDD Actions list based on risk scores
   * @param {object} riskScores - Risk scores object
   */
  updateEDDActions(riskScores) {
    const actionsList = document.getElementById('risk-actions-list');
    if (!actionsList) return;
    
    const actions = this.getEDDActions(riskScores);
    
    if (actions.length === 0) {
      actionsList.innerHTML = `
        <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(76,175,80,0.1); 
             border: 1px solid rgba(76,175,80,0.3); border-radius: 8px; padding: 8px 12px; font-size: 12px;">
          <svg viewBox="0 0 24 24" fill="#4CAF50" width="14" height="14">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>Standard EDD Review Only</span>
        </div>`;
      return;
    }
    
    actionsList.innerHTML = actions.map(action => {
      const severityBg = action.severity === 'HIGH' ? 'rgba(244,67,54,0.1)' : 'rgba(255,152,0,0.1)';
      const severityBorder = action.severity === 'HIGH' ? 'rgba(244,67,54,0.3)' : 'rgba(255,152,0,0.3)';
      return `
        <div style="display: inline-flex; align-items: center; gap: 6px; background: ${severityBg}; 
             border: 1px solid ${severityBorder}; border-radius: 8px; padding: 8px 12px; font-size: 12px;">
          <svg viewBox="0 0 24 24" fill="${action.color}" width="14" height="14">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>${action.text}</span>
        </div>`;
    }).join('');
  },
  
  /**
   * Convert hex color to RGB values
   * @param {string} hex - Hex color code
   * @returns {string} RGB values as "r, g, b"
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '76, 175, 80';
  },
  
  /**
   * Show the risk panel
   */
  showRiskPanel() {
    const panel = document.getElementById('risk-analysis-panel');
    if (panel) {
      panel.style.display = 'block';
    }
  },
  
  /**
   * Hide the risk panel (when no risk data available)
   */
  hideRiskPanel() {
    const panel = document.getElementById('risk-analysis-panel');
    if (panel) {
      panel.style.display = 'none';
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RiskEngine;
}
