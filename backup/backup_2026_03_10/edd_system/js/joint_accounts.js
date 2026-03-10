/**
 * QIB EDD Case Management System — Joint Account Exposure Module
 * Version: 1.0
 * 
 * Handles detection and display of Joint Account Exposure
 * Data Source: T24 via ETL/SnapView
 * 
 * FIELD NAMES (Exact ETL Header):
 * - JOINT_RIM_1, JOINT_RIM_2, JOINT_RIM_3, JOINT_RIM_4, JOINT_RIM_5
 * - JOINT_RIM_PERC, JOINT_RIM_PERC_2, JOINT_RIM_PERC_3, JOINT_RIM_PERC_4, JOINT_RIM_PERC_5
 */

const JointAccountsModule = {
  version: '1.0',

  // Format currency with thousands separator
  formatCurrency: function(amount, currency = 'QAR') {
    if (amount === null || amount === undefined) return '-';
    return amount.toLocaleString('en-US') + ' ' + currency;
  },

  // Format percentage
  formatPercentage: function(value) {
    if (value === null || value === undefined) return '-';
    return value + '%';
  },

  // Get role badge color
  getRoleBadgeClass: function(role) {
    if (role === 'Primary Holder') {
      return 'primary-holder';
    }
    return 'joint-holder';
  },

  // Check if customer has joint accounts
  hasJointAccounts: function(rim) {
    const exposure = EDDMockData.getJointExposure(rim);
    return exposure && exposure.TOTAL_JOINT_ACCOUNTS > 0;
  },

  // Get exposure summary
  getExposureSummary: function(rim, declaredIncome) {
    const exposure = EDDMockData.getJointExposure(rim);
    const customer = EDDMockData.getCustomerByRIM(rim);
    
    const summary = {
      hasJointAccounts: exposure.TOTAL_JOINT_ACCOUNTS > 0,
      totalJointAccounts: exposure.TOTAL_JOINT_ACCOUNTS,
      totalExposure: exposure.TOTAL_EXPOSURE,
      accounts: exposure.ACCOUNTS,
      declaredIncome: declaredIncome || (customer ? customer.monthlyIncome : 0),
      alerts: []
    };

    // Check for income mismatch
    if (summary.declaredIncome && summary.totalExposure > (summary.declaredIncome * 12 * 5)) {
      summary.alerts.push({
        type: 'warning',
        code: 'INCOME_MISMATCH',
        message: 'Joint Account Exposure significantly exceeds declared annual income'
      });
    }

    // Check for multiple joint accounts
    if (summary.totalJointAccounts >= 3) {
      summary.alerts.push({
        type: 'info',
        code: 'MULTIPLE_JOINTS',
        message: 'Customer has ' + summary.totalJointAccounts + ' joint account relationships'
      });
    }

    // Check for high exposure
    if (summary.totalExposure >= 1000000) {
      summary.alerts.push({
        type: 'warning',
        code: 'HIGH_EXPOSURE',
        message: 'Total joint account exposure exceeds 1,000,000 QAR'
      });
    }

    return summary;
  },

  // Build joint holders list for an account
  buildJointHoldersList: function(account, currentRim) {
    const holders = [];
    const rimFields = ['JOINT_RIM_1', 'JOINT_RIM_2', 'JOINT_RIM_3', 'JOINT_RIM_4', 'JOINT_RIM_5'];
    const percFields = ['JOINT_RIM_PERC', 'JOINT_RIM_PERC_2', 'JOINT_RIM_PERC_3', 'JOINT_RIM_PERC_4', 'JOINT_RIM_PERC_5'];

    rimFields.forEach((field, index) => {
      if (account[field]) {
        const rim = account[field];
        const customerName = EDDMockData.getCustomerNameByRIM(rim);
        holders.push({
          rim: rim,
          name: customerName,
          percentage: account[percFields[index]],
          role: index === 0 ? 'Primary Holder' : 'Joint Holder',
          isCurrentCustomer: rim === currentRim
        });
      }
    });

    return holders;
  },

  // Render the Joint Exposure Panel HTML
  renderJointExposurePanel: function(rim) {
    const exposure = EDDMockData.getJointExposure(rim);
    const customer = EDDMockData.getCustomerByRIM(rim);
    const summary = this.getExposureSummary(rim, customer ? customer.monthlyIncome : 0);

    if (!summary.hasJointAccounts) {
      return `
        <div class="joint-exposure-empty">
          <i class="fas fa-users-slash"></i>
          <p>No Joint Account Relationships Found</p>
        </div>
      `;
    }

    let html = `
      <div class="joint-exposure-header">
        <div class="joint-stat">
          <span class="stat-label">TOTAL_JOINT_ACCOUNTS</span>
          <span class="stat-value">${summary.totalJointAccounts}</span>
        </div>
        <div class="joint-stat">
          <span class="stat-label">TOTAL_EXPOSURE</span>
          <span class="stat-value exposure-amount">${this.formatCurrency(summary.totalExposure)}</span>
        </div>
      </div>
    `;

    // Alerts section
    if (summary.alerts.length > 0) {
      html += '<div class="joint-alerts">';
      summary.alerts.forEach(alert => {
        const iconClass = alert.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
        const alertClass = alert.type === 'warning' ? 'alert-warning' : 'alert-info';
        html += `
          <div class="joint-alert ${alertClass}">
            <i class="fas ${iconClass}"></i>
            <span>${alert.message}</span>
          </div>
        `;
      });
      html += '</div>';
    }

    // Accounts table
    html += `
      <div class="joint-accounts-table">
        <table>
          <thead>
            <tr>
              <th>ACCOUNT_NUMBER</th>
              <th>ACCOUNT_TYPE</th>
              <th>CUSTOMER_ROLE</th>
              <th>OWNERSHIP_%</th>
              <th>ACCOUNT_BALANCE</th>
              <th>CUSTOMER_EXPOSURE</th>
            </tr>
          </thead>
          <tbody>
    `;

    summary.accounts.forEach(acc => {
      const roleClass = this.getRoleBadgeClass(acc.CUSTOMER_ROLE);
      html += `
        <tr>
          <td class="account-number">${acc.ACCOUNT_NUMBER}</td>
          <td>${acc.ACCOUNT_TYPE}</td>
          <td><span class="role-badge ${roleClass}">${acc.CUSTOMER_ROLE}</span></td>
          <td class="percentage">${this.formatPercentage(acc.OWNERSHIP_PERCENTAGE)}</td>
          <td class="amount">${this.formatCurrency(acc.ACCOUNT_BALANCE)}</td>
          <td class="amount exposure">${this.formatCurrency(acc.CUSTOMER_EXPOSURE)}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    // Joint holders breakdown for each account
    html += '<div class="joint-holders-breakdown">';
    html += '<h4><i class="fas fa-users"></i> Joint Holders Details</h4>';
    
    summary.accounts.forEach(acc => {
      const holders = this.buildJointHoldersList(acc, rim);
      html += `
        <div class="account-holders-card">
          <div class="card-header">
            <span class="account-label">Account: ${acc.ACCOUNT_NUMBER}</span>
            <span class="account-balance">${this.formatCurrency(acc.ACCOUNT_BALANCE)}</span>
          </div>
          <div class="holders-list">
      `;
      
      holders.forEach(holder => {
        const highlightClass = holder.isCurrentCustomer ? 'current-customer' : '';
        html += `
          <div class="holder-item ${highlightClass}">
            <div class="holder-info">
              <span class="holder-name">${holder.name}</span>
              <span class="holder-rim">${holder.rim}</span>
            </div>
            <div class="holder-role">
              <span class="role-badge ${this.getRoleBadgeClass(holder.role)}">${holder.role}</span>
              <span class="holder-perc">${this.formatPercentage(holder.percentage)}</span>
            </div>
          </div>
        `;
      });

      html += '</div></div>';
    });

    html += '</div>';

    return html;
  },

  // Update the panel in the DOM
  updateJointExposurePanel: function(rim) {
    const panelContent = document.getElementById('jointExposureContent');
    if (panelContent) {
      panelContent.innerHTML = this.renderJointExposurePanel(rim);
    }

    // Update badge count
    const badge = document.getElementById('jointAccountsBadge');
    if (badge) {
      const exposure = EDDMockData.getJointExposure(rim);
      if (exposure.TOTAL_JOINT_ACCOUNTS > 0) {
        badge.textContent = exposure.TOTAL_JOINT_ACCOUNTS;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  }
};

// CSS Styles for Joint Exposure Panel
const jointExposureStyles = `
<style>
/* Joint Exposure Panel Styles */
.joint-exposure-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.joint-exposure-panel .panel-header {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: white;
  padding: 15px 20px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.joint-exposure-panel .panel-header h3 {
  margin: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.joint-exposure-panel .panel-header h3 i {
  font-size: 18px;
}

.joint-accounts-badge {
  background: #FF5722;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.joint-exposure-content {
  padding: 20px;
}

.joint-exposure-empty {
  text-align: center;
  padding: 40px;
  color: #9E9E9E;
}

.joint-exposure-empty i {
  font-size: 48px;
  margin-bottom: 15px;
}

.joint-exposure-header {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #E0E0E0;
}

.joint-stat {
  display: flex;
  flex-direction: column;
}

.joint-stat .stat-label {
  font-family: monospace;
  font-size: 11px;
  color: #757575;
  margin-bottom: 5px;
}

.joint-stat .stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1976D2;
}

.joint-stat .stat-value.exposure-amount {
  color: #F44336;
}

.joint-alerts {
  margin-bottom: 20px;
}

.joint-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 13px;
}

.joint-alert.alert-warning {
  background: #FFF3E0;
  color: #E65100;
  border-left: 4px solid #FF9800;
}

.joint-alert.alert-info {
  background: #E3F2FD;
  color: #1565C0;
  border-left: 4px solid #2196F3;
}

.joint-accounts-table {
  margin-bottom: 20px;
  overflow-x: auto;
}

.joint-accounts-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.joint-accounts-table th {
  background: #F5F5F5;
  padding: 12px 10px;
  text-align: left;
  font-family: monospace;
  font-size: 11px;
  color: #616161;
  border-bottom: 2px solid #E0E0E0;
}

.joint-accounts-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #EEEEEE;
}

.joint-accounts-table .account-number {
  font-family: monospace;
  font-weight: 500;
}

.joint-accounts-table .amount {
  text-align: right;
  font-family: monospace;
}

.joint-accounts-table .amount.exposure {
  color: #F44336;
  font-weight: bold;
}

.joint-accounts-table .percentage {
  font-weight: 500;
}

.role-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.role-badge.primary-holder {
  background: #E8F5E9;
  color: #2E7D32;
}

.role-badge.joint-holder {
  background: #FFF8E1;
  color: #F57F17;
}

.joint-holders-breakdown {
  background: #FAFAFA;
  padding: 15px;
  border-radius: 6px;
}

.joint-holders-breakdown h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #424242;
  display: flex;
  align-items: center;
  gap: 8px;
}

.account-holders-card {
  background: white;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  overflow: hidden;
}

.account-holders-card .card-header {
  background: #ECEFF1;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.account-holders-card .account-label {
  font-weight: 500;
  color: #455A64;
}

.account-holders-card .account-balance {
  font-family: monospace;
  color: #1976D2;
}

.holders-list {
  padding: 10px 15px;
}

.holder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F5F5F5;
}

.holder-item:last-child {
  border-bottom: none;
}

.holder-item.current-customer {
  background: #E3F2FD;
  margin: 0 -15px;
  padding: 8px 15px;
}

.holder-info {
  display: flex;
  flex-direction: column;
}

.holder-name {
  font-weight: 500;
  font-size: 13px;
}

.holder-rim {
  font-family: monospace;
  font-size: 11px;
  color: #757575;
}

.holder-role {
  display: flex;
  align-items: center;
  gap: 10px;
}

.holder-perc {
  font-family: monospace;
  font-weight: bold;
  color: #424242;
}
</style>
`;

// Inject styles when module loads
if (typeof document !== 'undefined') {
  const styleContainer = document.createElement('div');
  styleContainer.innerHTML = jointExposureStyles;
  document.head.appendChild(styleContainer.firstElementChild);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JointAccountsModule;
}
