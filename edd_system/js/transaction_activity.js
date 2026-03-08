/**
 * QIB EDD Case Management System — Transaction Activity Analysis Module
 * Version: 1.0
 * 
 * Displays transaction behavior analysis for EDD Review
 * Data Source: T24/TM (Transaction Monitoring) via ETL
 * 
 * CRITICAL FOR AML/EDD:
 * - Cash Activity Analysis
 * - Wire Transfer Patterns
 * - Transaction Velocity (Spike Detection)
 * - Country Exposure
 * - TM Alert Integration
 * - Income vs Activity Mismatch Detection
 */

const TransactionActivityModule = {
  version: '1.0',

  // Format currency
  formatCurrency: function(amount, currency = 'QAR') {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('en-US') + ' ' + currency;
  },

  // Format percentage
  formatPercentage: function(value) {
    if (value === null || value === undefined) return '-';
    return value + '%';
  },

  // Format date
  formatDate: function(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  // Get severity color
  getSeverityColor: function(severity) {
    const colors = {
      'CRITICAL': '#D32F2F',
      'HIGH': '#F44336',
      'MEDIUM': '#FF9800',
      'LOW': '#4CAF50'
    };
    return colors[severity] || '#9E9E9E';
  },

  // Get status badge class
  getStatusClass: function(status) {
    const classes = {
      'OPEN': 'status-open',
      'INVESTIGATING': 'status-investigating',
      'ESCALATED': 'status-escalated',
      'CLOSED': 'status-closed'
    };
    return classes[status] || 'status-default';
  },

  // Get country risk color
  getCountryRiskColor: function(risk) {
    const colors = {
      'HIGH': '#F44336',
      'MEDIUM': '#FF9800',
      'LOW': '#4CAF50'
    };
    return colors[risk] || '#9E9E9E';
  },

  // Get velocity alert level
  getVelocityAlertLevel: function(changePct) {
    if (changePct >= 200) return { level: 'CRITICAL', color: '#D32F2F' };
    if (changePct >= 100) return { level: 'HIGH', color: '#F44336' };
    if (changePct >= 50) return { level: 'MEDIUM', color: '#FF9800' };
    return { level: 'NORMAL', color: '#4CAF50' };
  },

  // Render the Transaction Activity Panel
  renderTransactionPanel: function(rim) {
    const summary = EDDMockData.getTransactionSummary(rim);
    
    if (!summary.hasData) {
      return `
        <div class="txn-empty">
          <i class="fas fa-chart-line"></i>
          <p>No Transaction Activity Data Available</p>
        </div>
      `;
    }

    let html = '';

    // Header with Period Info
    html += `
      <div class="txn-header">
        <div class="txn-period">
          <span class="period-label">Analysis Period:</span>
          <span class="period-value">${this.formatDate(summary.PERIOD_START)} - ${this.formatDate(summary.PERIOD_END)}</span>
        </div>
        <div class="txn-income">
          <span class="income-label">DECLARED_MONTHLY_INCOME:</span>
          <span class="income-value">${this.formatCurrency(summary.DECLARED_MONTHLY_INCOME)}</span>
        </div>
      </div>
    `;

    // Risk Flags / Alerts Banner
    if (summary.FLAGS.length > 0) {
      html += '<div class="txn-flags">';
      summary.FLAGS.forEach(flag => {
        const iconClass = flag.type === 'critical' ? 'fa-exclamation-circle' : 'fa-exclamation-triangle';
        const alertClass = flag.type === 'critical' ? 'flag-critical' : 'flag-warning';
        html += `
          <div class="txn-flag ${alertClass}">
            <i class="fas ${iconClass}"></i>
            <span>${flag.message}</span>
          </div>
        `;
      });
      html += '</div>';
    }

    // Summary Cards Row
    html += `
      <div class="txn-summary-row">
        <div class="txn-summary-card">
          <div class="card-icon inflow"><i class="fas fa-arrow-down"></i></div>
          <div class="card-content">
            <div class="card-label">TOTAL_INFLOW</div>
            <div class="card-value inflow">${this.formatCurrency(summary.TOTAL_INFLOW)}</div>
          </div>
        </div>
        <div class="txn-summary-card">
          <div class="card-icon outflow"><i class="fas fa-arrow-up"></i></div>
          <div class="card-content">
            <div class="card-label">TOTAL_OUTFLOW</div>
            <div class="card-value outflow">${this.formatCurrency(summary.TOTAL_OUTFLOW)}</div>
          </div>
        </div>
        <div class="txn-summary-card">
          <div class="card-icon ${summary.NET_FLOW >= 0 ? 'positive' : 'negative'}"><i class="fas fa-balance-scale"></i></div>
          <div class="card-content">
            <div class="card-label">NET_FLOW</div>
            <div class="card-value ${summary.NET_FLOW >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(summary.NET_FLOW)}</div>
          </div>
        </div>
        <div class="txn-summary-card alerts">
          <div class="card-icon ${summary.CRITICAL_ALERTS_COUNT > 0 ? 'critical' : 'normal'}"><i class="fas fa-bell"></i></div>
          <div class="card-content">
            <div class="card-label">TM_ALERTS (Open)</div>
            <div class="card-value ${summary.CRITICAL_ALERTS_COUNT > 0 ? 'critical' : ''}">${summary.OPEN_ALERTS_COUNT}</div>
          </div>
        </div>
      </div>
    `;

    // Two Column Layout
    html += '<div class="txn-two-col">';
    
    // Left Column - Cash Activity
    html += `
      <div class="txn-section">
        <h4><i class="fas fa-money-bill-wave"></i> CASH_ACTIVITY</h4>
        <div class="txn-detail-grid">
          <div class="detail-row">
            <span class="detail-label">TOTAL_CASH_DEPOSITS</span>
            <span class="detail-value">${this.formatCurrency(summary.CASH_ACTIVITY.TOTAL_CASH_DEPOSITS)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">CASH_DEPOSIT_COUNT</span>
            <span class="detail-value">${summary.CASH_ACTIVITY.CASH_DEPOSIT_COUNT} transactions</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">MAX_CASH_DEPOSIT</span>
            <span class="detail-value highlight">${this.formatCurrency(summary.CASH_ACTIVITY.MAX_CASH_DEPOSIT)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">TOTAL_CASH_WITHDRAWALS</span>
            <span class="detail-value">${this.formatCurrency(summary.CASH_ACTIVITY.TOTAL_CASH_WITHDRAWALS)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">CASH_INTENSIVE_FLAG</span>
            <span class="detail-value ${summary.CASH_ACTIVITY.CASH_INTENSIVE_FLAG ? 'flag-yes' : 'flag-no'}">${summary.CASH_ACTIVITY.CASH_INTENSIVE_FLAG ? 'YES' : 'NO'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">STRUCTURING_ALERT</span>
            <span class="detail-value ${summary.CASH_ACTIVITY.STRUCTURING_ALERT ? 'flag-yes' : 'flag-no'}">${summary.CASH_ACTIVITY.STRUCTURING_ALERT ? 'YES' : 'NO'}</span>
          </div>
        </div>
        ${summary.CASH_ACTIVITY.STRUCTURING_DETAILS ? `<div class="detail-note"><i class="fas fa-exclamation-triangle"></i> ${summary.CASH_ACTIVITY.STRUCTURING_DETAILS}</div>` : ''}
      </div>
    `;
    
    // Right Column - Wire Transfers
    html += `
      <div class="txn-section">
        <h4><i class="fas fa-exchange-alt"></i> WIRE_TRANSFERS</h4>
        <div class="txn-detail-grid">
          <div class="detail-row">
            <span class="detail-label">INBOUND_TOTAL</span>
            <span class="detail-value inflow">${this.formatCurrency(summary.WIRE_TRANSFERS.INBOUND_TOTAL)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">INBOUND_COUNT</span>
            <span class="detail-value">${summary.WIRE_TRANSFERS.INBOUND_COUNT} transfers</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">INBOUND_COUNTRIES</span>
            <span class="detail-value countries">${summary.WIRE_TRANSFERS.INBOUND_COUNTRIES.join(', ')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">OUTBOUND_TOTAL</span>
            <span class="detail-value outflow">${this.formatCurrency(summary.WIRE_TRANSFERS.OUTBOUND_TOTAL)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">OUTBOUND_COUNT</span>
            <span class="detail-value">${summary.WIRE_TRANSFERS.OUTBOUND_COUNT} transfers</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">HIGH_RISK_WIRE_FLAG</span>
            <span class="detail-value ${summary.WIRE_TRANSFERS.HIGH_RISK_WIRE_FLAG ? 'flag-yes' : 'flag-no'}">${summary.WIRE_TRANSFERS.HIGH_RISK_WIRE_FLAG ? 'YES' : 'NO'}</span>
          </div>
        </div>
        ${summary.WIRE_TRANSFERS.HIGH_RISK_WIRE_DETAILS ? `<div class="detail-note critical"><i class="fas fa-exclamation-circle"></i> ${summary.WIRE_TRANSFERS.HIGH_RISK_WIRE_DETAILS}</div>` : ''}
      </div>
    `;
    
    html += '</div>';

    // Velocity Section
    const velocityLevel = this.getVelocityAlertLevel(summary.VELOCITY.VELOCITY_CHANGE_PCT);
    html += `
      <div class="txn-velocity-section">
        <h4><i class="fas fa-tachometer-alt"></i> TRANSACTION VELOCITY</h4>
        <div class="velocity-comparison">
          <div class="velocity-period">
            <span class="period-label">Previous 6 Months Avg</span>
            <span class="period-value">${this.formatCurrency(summary.VELOCITY.PREVIOUS_6M_AVG)}</span>
          </div>
          <div class="velocity-arrow">
            <i class="fas fa-arrow-right"></i>
            <span class="velocity-change" style="color: ${velocityLevel.color}; background: ${velocityLevel.color}15;">
              ${summary.VELOCITY.VELOCITY_CHANGE_PCT >= 0 ? '+' : ''}${summary.VELOCITY.VELOCITY_CHANGE_PCT}%
            </span>
          </div>
          <div class="velocity-period">
            <span class="period-label">Current 6 Months Avg</span>
            <span class="period-value">${this.formatCurrency(summary.VELOCITY.CURRENT_6M_AVG)}</span>
          </div>
          <div class="velocity-status">
            <span class="status-badge" style="background: ${velocityLevel.color};">${velocityLevel.level}</span>
          </div>
        </div>
        ${summary.VELOCITY.VELOCITY_ALERT ? `<div class="velocity-alert"><i class="fas fa-exclamation-triangle"></i> ${summary.VELOCITY.VELOCITY_ALERT_REASON}</div>` : ''}
      </div>
    `;

    // Country Exposure
    html += `
      <div class="txn-country-section">
        <h4><i class="fas fa-globe"></i> COUNTRY_EXPOSURE</h4>
        <div class="country-list">
    `;
    
    summary.COUNTRY_EXPOSURE.forEach(country => {
      const riskColor = this.getCountryRiskColor(country.risk);
      html += `
        <div class="country-item">
          <div class="country-info">
            <span class="country-flag">${country.code}</span>
            <span class="country-name">${country.country}</span>
            <span class="country-risk" style="background: ${riskColor}15; color: ${riskColor};">${country.risk}</span>
          </div>
          <div class="country-amount">${this.formatCurrency(country.amount)}</div>
          <div class="country-direction">
            ${country.direction === 'BOTH' ? '<i class="fas fa-exchange-alt"></i>' : 
              country.direction === 'INBOUND' ? '<i class="fas fa-arrow-down" style="color:#4CAF50;"></i>' : 
              '<i class="fas fa-arrow-up" style="color:#F44336;"></i>'}
          </div>
        </div>
      `;
    });
    
    html += '</div></div>';

    // TM Alerts Section
    if (summary.TM_ALERTS.length > 0) {
      html += `
        <div class="txn-alerts-section">
          <h4><i class="fas fa-bell"></i> TM_ALERTS (Transaction Monitoring)</h4>
          <table class="alerts-table">
            <thead>
              <tr>
                <th>ALERT_ID</th>
                <th>DATE</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>SEVERITY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      summary.TM_ALERTS.forEach(alert => {
        const sevColor = this.getSeverityColor(alert.SEVERITY);
        html += `
          <tr>
            <td class="alert-id">${alert.ALERT_ID}</td>
            <td>${this.formatDate(alert.DATE)}</td>
            <td>${alert.TYPE}</td>
            <td>${alert.AMOUNT ? this.formatCurrency(alert.AMOUNT) : '-'}</td>
            <td><span class="severity-badge" style="background: ${sevColor}15; color: ${sevColor};">${alert.SEVERITY}</span></td>
            <td><span class="status-badge ${this.getStatusClass(alert.STATUS)}">${alert.STATUS}</span></td>
          </tr>
        `;
      });
      
      html += '</tbody></table></div>';
    }

    // Large Transactions
    if (summary.LARGE_TRANSACTIONS.length > 0) {
      html += `
        <div class="txn-large-section">
          <h4><i class="fas fa-list-ol"></i> LARGE_TRANSACTIONS (&gt; 100,000 QAR)</h4>
          <table class="large-txn-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TYPE</th>
                <th>AMOUNT</th>
                <th>COUNTRY</th>
                <th>NARRATIVE</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      summary.LARGE_TRANSACTIONS.forEach(txn => {
        const typeClass = txn.TYPE.includes('In') || txn.TYPE.includes('Deposit') ? 'inflow' : 'outflow';
        html += `
          <tr>
            <td>${this.formatDate(txn.DATE)}</td>
            <td><span class="txn-type ${typeClass}">${txn.TYPE}</span></td>
            <td class="amount ${typeClass}">${this.formatCurrency(txn.AMOUNT)}</td>
            <td>${txn.COUNTRY}</td>
            <td>${txn.NARRATIVE}</td>
          </tr>
        `;
      });
      
      html += '</tbody></table></div>';
    }

    return html;
  },

  // Update the panel in the DOM
  updateTransactionPanel: function(rim) {
    const panelContent = document.getElementById('transactionActivityContent');
    if (panelContent) {
      panelContent.innerHTML = this.renderTransactionPanel(rim);
    }

    // Update alerts badge
    const summary = EDDMockData.getTransactionSummary(rim);
    const badge = document.getElementById('tmAlertsBadge');
    if (badge && summary.hasData) {
      if (summary.OPEN_ALERTS_COUNT > 0) {
        badge.textContent = summary.OPEN_ALERTS_COUNT;
        badge.style.display = 'inline-block';
        if (summary.CRITICAL_ALERTS_COUNT > 0) {
          badge.style.background = '#D32F2F';
        }
      } else {
        badge.style.display = 'none';
      }
    }
  }
};

// CSS Styles for Transaction Activity Panel
const transactionActivityStyles = `
<style>
/* Transaction Activity Panel Styles */
.transaction-activity-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.transaction-activity-panel .panel-header {
  background: linear-gradient(135deg, #FF5722, #E64A19);
  color: white;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-activity-panel .panel-header h3 {
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tm-alerts-badge {
  background: #F44336;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.transaction-content {
  padding: 20px;
}

.txn-empty {
  text-align: center;
  padding: 40px;
  color: #9E9E9E;
}

.txn-empty i {
  font-size: 48px;
  margin-bottom: 15px;
}

.txn-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #E0E0E0;
  margin-bottom: 15px;
}

.txn-period .period-label,
.txn-income .income-label {
  font-size: 11px;
  color: #757575;
  font-family: monospace;
}

.txn-period .period-value {
  font-weight: 600;
  margin-left: 8px;
}

.txn-income .income-value {
  font-weight: 600;
  color: #1976D2;
  margin-left: 8px;
}

.txn-flags {
  margin-bottom: 20px;
}

.txn-flag {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 13px;
}

.txn-flag.flag-critical {
  background: #FFEBEE;
  border-left: 4px solid #D32F2F;
  color: #C62828;
}

.txn-flag.flag-warning {
  background: #FFF3E0;
  border-left: 4px solid #FF9800;
  color: #E65100;
}

.txn-summary-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.txn-summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: #FAFAFA;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
}

.txn-summary-card .card-icon {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.txn-summary-card .card-icon.inflow { background: #E8F5E9; color: #4CAF50; }
.txn-summary-card .card-icon.outflow { background: #FFEBEE; color: #F44336; }
.txn-summary-card .card-icon.positive { background: #E8F5E9; color: #4CAF50; }
.txn-summary-card .card-icon.negative { background: #FFEBEE; color: #F44336; }
.txn-summary-card .card-icon.critical { background: #FFEBEE; color: #D32F2F; }
.txn-summary-card .card-icon.normal { background: #E3F2FD; color: #1976D2; }

.txn-summary-card .card-label {
  font-size: 10px;
  color: #757575;
  font-family: monospace;
  margin-bottom: 4px;
}

.txn-summary-card .card-value {
  font-size: 18px;
  font-weight: 700;
}

.txn-summary-card .card-value.inflow { color: #4CAF50; }
.txn-summary-card .card-value.outflow { color: #F44336; }
.txn-summary-card .card-value.positive { color: #4CAF50; }
.txn-summary-card .card-value.negative { color: #F44336; }
.txn-summary-card .card-value.critical { color: #D32F2F; }

.txn-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.txn-section {
  background: #FAFAFA;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #E0E0E0;
}

.txn-section h4 {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #424242;
  display: flex;
  align-items: center;
  gap: 8px;
}

.txn-detail-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #EEEEEE;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-family: monospace;
  font-size: 11px;
  color: #616161;
}

.detail-value {
  font-weight: 500;
  font-size: 13px;
}

.detail-value.inflow { color: #4CAF50; }
.detail-value.outflow { color: #F44336; }
.detail-value.highlight { color: #FF5722; font-weight: 700; }
.detail-value.flag-yes { color: #D32F2F; font-weight: 700; }
.detail-value.flag-no { color: #4CAF50; }
.detail-value.countries { font-size: 11px; color: #1976D2; }

.detail-note {
  margin-top: 10px;
  padding: 10px;
  background: #FFF3E0;
  border-radius: 4px;
  font-size: 12px;
  color: #E65100;
}

.detail-note.critical {
  background: #FFEBEE;
  color: #C62828;
}

.detail-note i {
  margin-right: 6px;
}

.txn-velocity-section {
  background: #F5F5F5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.txn-velocity-section h4 {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #424242;
}

.velocity-comparison {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.velocity-period {
  text-align: center;
}

.velocity-period .period-label {
  display: block;
  font-size: 11px;
  color: #757575;
  margin-bottom: 5px;
}

.velocity-period .period-value {
  font-size: 18px;
  font-weight: 700;
  color: #424242;
}

.velocity-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.velocity-arrow i {
  color: #9E9E9E;
}

.velocity-change {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
}

.velocity-status .status-badge {
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.velocity-alert {
  margin-top: 12px;
  padding: 10px;
  background: #FFF3E0;
  border-radius: 4px;
  font-size: 12px;
  color: #E65100;
}

.txn-country-section {
  background: #FAFAFA;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.txn-country-section h4 {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #424242;
}

.country-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.country-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #E0E0E0;
}

.country-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.country-flag {
  background: #E0E0E0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.country-name {
  font-weight: 500;
}

.country-risk {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.country-amount {
  font-family: monospace;
  font-weight: 600;
}

.country-direction {
  width: 30px;
  text-align: center;
}

.txn-alerts-section,
.txn-large-section {
  margin-bottom: 20px;
}

.txn-alerts-section h4,
.txn-large-section h4 {
  margin: 0 0 15px 0;
  font-size: 13px;
  color: #424242;
}

.alerts-table,
.large-txn-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.alerts-table th,
.large-txn-table th {
  background: #F5F5F5;
  padding: 10px 8px;
  text-align: left;
  font-family: monospace;
  font-size: 10px;
  color: #616161;
  border-bottom: 2px solid #E0E0E0;
}

.alerts-table td,
.large-txn-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #EEEEEE;
}

.alerts-table .alert-id {
  font-family: monospace;
  font-size: 11px;
}

.severity-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.status-badge.status-open { background: #FFEBEE; color: #D32F2F; }
.status-badge.status-investigating { background: #FFF3E0; color: #E65100; }
.status-badge.status-escalated { background: #FCE4EC; color: #AD1457; }
.status-badge.status-closed { background: #E8F5E9; color: #2E7D32; }

.txn-type {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.txn-type.inflow { background: #E8F5E9; color: #2E7D32; }
.txn-type.outflow { background: #FFEBEE; color: #C62828; }

.large-txn-table .amount {
  font-family: monospace;
  font-weight: 600;
}

.large-txn-table .amount.inflow { color: #4CAF50; }
.large-txn-table .amount.outflow { color: #F44336; }

/* Responsive */
@media (max-width: 1200px) {
  .txn-summary-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .txn-two-col {
    grid-template-columns: 1fr;
  }
}
</style>
`;

// Inject styles when module loads
if (typeof document !== 'undefined') {
  const styleContainer = document.createElement('div');
  styleContainer.innerHTML = transactionActivityStyles;
  document.head.appendChild(styleContainer.firstElementChild);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TransactionActivityModule;
}
