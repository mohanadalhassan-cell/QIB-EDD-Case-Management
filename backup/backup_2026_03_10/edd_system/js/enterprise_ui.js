/**
 * QIB EDD System - Enterprise UI Renderer
 * =======================================
 * Renders all enterprise-level UI components:
 * - Financial Profile Panel
 * - Expected Activity Panel
 * - Officer Digital Confirmation Modal
 * - Call Center View Modal
 * - User Guide Modal
 * - System Presentation Modal
 */

const EnterpriseUI = {

  // =====================================================
  // FINANCIAL PROFILE PANEL
  // =====================================================
  
  renderFinancialProfilePanel: function(rim) {
    const profile = EnterpriseFeatures.getFinancialProfile(rim);
    const container = document.getElementById('financialProfileContent');
    
    if (!container) return;
    
    if (!profile) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #9E9E9E;">
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style="opacity: 0.5;">
            <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
          </svg>
          <p style="margin-top: 10px;">Financial profile data not available</p>
        </div>
      `;
      return;
    }

    const formatCurrency = (amt) => amt ? amt.toLocaleString() + ' QAR' : 'N/A';
    const avgSalary = profile.AVG_LAST_3_SALARY;
    const variance = profile.SALARY_VARIANCE_PCT;
    const varianceColor = variance > 5 ? '#FF5722' : variance > 2 ? '#FFC107' : '#4CAF50';

    container.innerHTML = `
      <!-- Main Financial Summary -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px;">
        <!-- SALARY -->
        <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">SALARY</div>
          <div style="font-size: 24px; font-weight: 700; color: #4CAF50;">${formatCurrency(profile.SALARY)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Monthly</div>
        </div>
        
        <!-- ANNUAL_INC -->
        <div style="background: rgba(33, 150, 243, 0.1); border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">ANNUAL_INC</div>
          <div style="font-size: 24px; font-weight: 700; color: #2196F3;">${formatCurrency(profile.ANNUAL_INC)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Yearly</div>
        </div>
        
        <!-- SEC_INC_AMT -->
        <div style="background: rgba(156, 39, 176, 0.1); border: 1px solid rgba(156, 39, 176, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">SEC_INC_AMT</div>
          <div style="font-size: 24px; font-weight: 700; color: #9C27B0;">${formatCurrency(profile.SEC_INC_AMT)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${profile.SEC_INC_SOURCE || 'Secondary'}</div>
        </div>
        
        <!-- AVG_LAST_3_SALARY -->
        <div style="background: rgba(255, 152, 0, 0.1); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">AVG_LAST_3_SALARY</div>
          <div style="font-size: 24px; font-weight: 700; color: #FF9800;">${formatCurrency(avgSalary)}</div>
          <div style="font-size: 10px; color: ${varianceColor}; margin-top: 4px;">Variance: ${variance}%</div>
        </div>
      </div>

      <!-- Last Salary Details -->
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 16px;">
        <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 16px;">
          <h4 style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-secondary);">Last Salary Received</h4>
          <div style="display: grid; gap: 8px;">
            <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
              <span style="font-size: 11px; font-family: monospace; color: var(--text-muted);">LAST_SAL_DA</span>
              <span style="font-size: 13px; font-weight: 600;">${profile.LAST_SAL_DA}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
              <span style="font-size: 11px; font-family: monospace; color: var(--text-muted);">LAST_SAL_AMT</span>
              <span style="font-size: 13px; font-weight: 600;">${formatCurrency(profile.LAST_SAL_AMT)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px;">
              <span style="font-size: 11px; font-family: monospace; color: var(--text-muted);">LAST_MON_SALARY</span>
              <span style="font-size: 13px; font-weight: 600;">${formatCurrency(profile.LAST_MON_SALARY)}</span>
            </div>
          </div>
        </div>
        
        <!-- Salary History Table -->
        <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 16px;">
          <h4 style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-secondary);">Salary History (Last 3 Months)</h4>
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.1);">
                <th style="text-align: left; padding: 8px; color: var(--text-muted);">Month</th>
                <th style="text-align: right; padding: 8px; color: var(--text-muted);">Amount</th>
                <th style="text-align: right; padding: 8px; color: var(--text-muted);">Date Credited</th>
              </tr>
            </thead>
            <tbody>
              ${profile.SALARY_HISTORY.map(s => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                  <td style="padding: 8px;">${s.MONTH}</td>
                  <td style="text-align: right; padding: 8px; font-weight: 600; color: #4CAF50;">${formatCurrency(s.AMOUNT)}</td>
                  <td style="text-align: right; padding: 8px; color: var(--text-secondary);">${s.DATE_CREDITED}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Data Source Footer -->
      <div style="margin-top: 16px; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: var(--text-muted); font-family: monospace;">
          DATA_SOURCE: ${profile.DATA_SOURCE}
        </span>
        <span style="font-size: 11px; color: var(--text-muted);">
          Last Updated: ${profile.LAST_UPDATE}
        </span>
      </div>
    `;
  },

  // =====================================================
  // EXPECTED ACTIVITY PANEL
  // =====================================================
  
  renderExpectedActivityPanel: function(rim) {
    const profile = EnterpriseFeatures.getExpectedActivity(rim);
    const container = document.getElementById('expectedActivityContent');
    
    if (!container) return;
    
    if (!profile) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #9E9E9E;">
          <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48" style="opacity: 0.5;">
            <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
          </svg>
          <p style="margin-top: 10px;">Expected activity profile not available</p>
        </div>
      `;
      return;
    }

    const formatCurrency = (amt) => amt ? amt.toLocaleString() + ' QAR' : 'N/A';
    const deviationClass = profile.DEVIATION_FLAG ? 'critical' : 'normal';
    const deviationColor = profile.DEVIATION_FLAG ? '#F44336' : '#4CAF50';
    const ratioColor = profile.ACTUAL_VS_EXPECTED_RATIO > 1.5 ? '#F44336' : 
                       profile.ACTUAL_VS_EXPECTED_RATIO > 1.2 ? '#FF9800' : '#4CAF50';

    container.innerHTML = `
      <!-- Expected Monthly Activity Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
        <!-- LM_EXP_CASH -->
        <div style="background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">LM_EXP_CASH</div>
          <div style="font-size: 28px; font-weight: 700; color: #4CAF50;">${formatCurrency(profile.LM_EXP_CASH)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 8px;">Expected Monthly Cash</div>
          <div style="display: flex; justify-content: space-around; margin-top: 8px; font-size: 10px;">
            <span>In: ${formatCurrency(profile.EXP_INWARD_CASH)}</span>
            <span>Out: ${formatCurrency(profile.EXP_OUTWARD_CASH)}</span>
          </div>
        </div>
        
        <!-- LM_EXP_NONCASH -->
        <div style="background: rgba(33, 150, 243, 0.15); border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">LM_EXP_NONCASH</div>
          <div style="font-size: 28px; font-weight: 700; color: #2196F3;">${formatCurrency(profile.LM_EXP_NONCASH)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 8px;">Expected Monthly Non-Cash</div>
          <div style="margin-top: 8px; font-size: 10px;">Cards, Cheques, POS</div>
        </div>
        
        <!-- LM_EXP_TRFR -->
        <div style="background: rgba(156, 39, 176, 0.15); border: 1px solid rgba(156, 39, 176, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px; font-family: monospace;">LM_EXP_TRFR</div>
          <div style="font-size: 28px; font-weight: 700; color: #9C27B0;">${formatCurrency(profile.LM_EXP_TRFR)}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 8px;">Expected Monthly Transfers</div>
          <div style="display: flex; justify-content: space-around; margin-top: 8px; font-size: 10px;">
            <span>Dom: ${formatCurrency(profile.EXP_DOMESTIC_TRFR)}</span>
            <span>Int'l: ${formatCurrency(profile.EXP_INTL_TRFR)}</span>
          </div>
        </div>
      </div>

      <!-- Annual Turnover & Ratio -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
        <div style="background: rgba(255, 152, 0, 0.1); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 10px; color: var(--text-muted); font-family: monospace;">ANNUAL_EXP_TURNOVER</div>
              <div style="font-size: 24px; font-weight: 700; color: #FF9800; margin-top: 4px;">${formatCurrency(profile.ANNUAL_EXP_TURNOVER)}</div>
            </div>
            <svg viewBox="0 0 24 24" fill="#FF9800" width="36" height="36">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
          </div>
        </div>
        
        <div style="background: rgba(${profile.DEVIATION_FLAG ? '244, 67, 54' : '76, 175, 80'}, 0.1); border: 1px solid rgba(${profile.DEVIATION_FLAG ? '244, 67, 54' : '76, 175, 80'}, 0.3); border-radius: 12px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 10px; color: var(--text-muted); font-family: monospace;">ACTUAL_VS_EXPECTED_RATIO</div>
              <div style="font-size: 24px; font-weight: 700; color: ${ratioColor}; margin-top: 4px;">${profile.ACTUAL_VS_EXPECTED_RATIO.toFixed(2)}x</div>
              ${profile.DEVIATION_FLAG ? `<div style="font-size: 11px; color: #F44336; margin-top: 4px;">⚠️ ${profile.DEVIATION_REASON}</div>` : ''}
            </div>
            <svg viewBox="0 0 24 24" fill="${ratioColor}" width="36" height="36">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Activity Purpose & Expected Countries -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
        <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 16px;">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; color: var(--text-muted);">ACTIVITY_PURPOSE</h4>
          <p style="margin: 0; font-size: 13px; line-height: 1.5;">${profile.ACTIVITY_PURPOSE}</p>
        </div>
        
        <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 16px;">
          <h4 style="margin: 0 0 8px 0; font-size: 12px; color: var(--text-muted);">EXPECTED_COUNTRIES</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${profile.EXPECTED_COUNTRIES.map(c => `
              <span style="display: inline-block; padding: 4px 10px; background: rgba(33, 150, 243, 0.2); border-radius: 12px; font-size: 11px; font-weight: 600;">${c}</span>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Data Source Footer -->
      <div style="margin-top: 16px; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: var(--text-muted); font-family: monospace;">
          DATA_SOURCE: ${profile.DATA_SOURCE}
        </span>
        <span style="font-size: 11px; color: var(--text-muted);">
          Last Updated: ${profile.LAST_UPDATE}
        </span>
      </div>
    `;
  },

  // =====================================================
  // OFFICER DIGITAL CONFIRMATION MODAL
  // =====================================================
  
  showOfficerConfirmationModal: function(action, callback) {
    const user = EDDMockData.currentUser;
    const checklist = EnterpriseFeatures.confirmationChecklist;
    
    const modalHTML = `
      <div id="officerConfirmationModal" class="enterprise-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div class="modal-content" style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 32px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <svg viewBox="0 0 24 24" fill="#00D4FF" width="48" height="48">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <h2 style="margin: 16px 0 8px 0; font-size: 20px;">Officer Confirmation Required</h2>
            <p style="color: var(--text-muted); font-size: 13px;">Action: ${action}</p>
          </div>

          <!-- Officer Details -->
          <div style="background: rgba(0, 212, 255, 0.1); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <div style="font-size: 10px; color: var(--text-muted);">Employee Name</div>
                <div style="font-size: 14px; font-weight: 600;">${user?.name || 'Unknown'}</div>
              </div>
              <div>
                <div style="font-size: 10px; color: var(--text-muted);">Employee ID</div>
                <div style="font-size: 14px; font-weight: 600;">${user?.id || 'Unknown'}</div>
              </div>
              <div style="grid-column: span 2;">
                <div style="font-size: 10px; color: var(--text-muted);">Department</div>
                <div style="font-size: 14px; font-weight: 600;">${user?.department || 'Unknown'}</div>
              </div>
            </div>
          </div>

          <!-- Checklist -->
          <div style="margin-bottom: 20px;">
            <h4 style="font-size: 13px; margin-bottom: 12px; color: var(--text-secondary);">Verification Checklist</h4>
            ${checklist.map(item => `
              <label style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="checkbox" class="confirmation-check" data-id="${item.id}" ${item.required ? 'required' : ''} style="width: 18px; height: 18px;">
                <span style="font-size: 13px;">${item.label}</span>
                ${item.required ? '<span style="color: #F44336; font-size: 11px;">*</span>' : ''}
              </label>
            `).join('')}
          </div>

          <!-- PIN Entry -->
          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 13px; margin-bottom: 12px; color: var(--text-secondary);">Enter 4-Digit PIN</h4>
            <div style="display: flex; justify-content: center; gap: 12px;">
              <input type="password" maxlength="1" class="pin-digit" style="width: 50px; height: 60px; text-align: center; font-size: 24px; background: rgba(255,255,255,0.05); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; color: white;" data-index="0">
              <input type="password" maxlength="1" class="pin-digit" style="width: 50px; height: 60px; text-align: center; font-size: 24px; background: rgba(255,255,255,0.05); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; color: white;" data-index="1">
              <input type="password" maxlength="1" class="pin-digit" style="width: 50px; height: 60px; text-align: center; font-size: 24px; background: rgba(255,255,255,0.05); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; color: white;" data-index="2">
              <input type="password" maxlength="1" class="pin-digit" style="width: 50px; height: 60px; text-align: center; font-size: 24px; background: rgba(255,255,255,0.05); border: 2px solid rgba(0, 212, 255, 0.3); border-radius: 12px; color: white;" data-index="3">
            </div>
            <p id="pinError" style="color: #F44336; font-size: 12px; text-align: center; margin-top: 8px; display: none;"></p>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 12px;">
            <button onclick="EnterpriseUI.closeConfirmationModal()" style="flex: 1; padding: 14px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white; cursor: pointer; font-size: 14px;">Cancel</button>
            <button onclick="EnterpriseUI.submitConfirmation('${action}')" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #00D4FF, #0288D1); border: none; border-radius: 10px; color: white; cursor: pointer; font-size: 14px; font-weight: 600;">Confirm</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this._confirmationCallback = callback;
    
    // Setup PIN input auto-focus
    const pinInputs = document.querySelectorAll('.pin-digit');
    pinInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value && index < 3) {
          pinInputs[index + 1].focus();
        }
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          pinInputs[index - 1].focus();
        }
      });
    });
    pinInputs[0].focus();
  },

  closeConfirmationModal: function() {
    const modal = document.getElementById('officerConfirmationModal');
    if (modal) modal.remove();
  },

  submitConfirmation: function(action) {
    const user = EDDMockData.currentUser;
    const pinInputs = document.querySelectorAll('.pin-digit');
    const pin = Array.from(pinInputs).map(i => i.value).join('');
    const errorEl = document.getElementById('pinError');
    
    // Validate checklist
    const requiredChecks = document.querySelectorAll('.confirmation-check[required]');
    const allChecked = Array.from(requiredChecks).every(c => c.checked);
    
    if (!allChecked) {
      errorEl.textContent = 'Please complete all required checklist items';
      errorEl.style.display = 'block';
      return;
    }
    
    // Validate PIN
    if (pin.length !== 4) {
      errorEl.textContent = 'Please enter your 4-digit PIN';
      errorEl.style.display = 'block';
      return;
    }
    
    const verification = EnterpriseFeatures.verifyPIN(user.id, pin);
    if (!verification.valid) {
      errorEl.textContent = verification.error;
      errorEl.style.display = 'block';
      return;
    }
    
    // Success
    const confirmation = {
      employeeId: user.id,
      employeeName: user.name,
      department: user.department,
      action: action,
      timestamp: new Date().toISOString(),
      checklist: Array.from(document.querySelectorAll('.confirmation-check:checked')).map(c => c.dataset.id)
    };
    
    this.closeConfirmationModal();
    if (this._confirmationCallback) {
      this._confirmationCallback(confirmation);
    }
  },

  // =====================================================
  // CALL CENTER VIEW MODAL
  // =====================================================
  
  showCallCenterView: function(rim) {
    const data = EnterpriseFeatures.getCallCenterView(rim);
    
    if (!data) {
      alert('Customer not found');
      return;
    }

    const formatCurrency = (amt) => typeof amt === 'number' ? amt.toLocaleString() + ' QAR' : amt;

    const modalHTML = `
      <div id="callCenterModal" class="enterprise-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div class="modal-content" style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 32px; max-width: 600px; width: 90%;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
              <h2 style="margin: 0; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <svg viewBox="0 0 24 24" fill="#00D4FF" width="24" height="24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
                Call Center View
              </h2>
              <p style="color: var(--text-muted); font-size: 12px; margin-top: 4px;">Read-Only Customer Information</p>
            </div>
            <button onclick="EnterpriseUI.closeCallCenterModal()" style="background: none; border: none; color: white; cursor: pointer; font-size: 24px;">&times;</button>
          </div>

          <!-- Customer Basic Info -->
          <div style="background: rgba(0, 212, 255, 0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 16px 0; font-size: 20px;">${data.customerName}</h3>
            <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">${data.customerNameAr}</p>
            <div style="display: flex; gap: 12px; margin-top: 12px;">
              <span style="padding: 4px 12px; background: rgba(255,255,255,0.1); border-radius: 20px; font-size: 12px;">${data.nationality}</span>
              <span style="padding: 4px 12px; background: rgba(33, 150, 243, 0.2); border-radius: 20px; font-size: 12px;">${data.segment}</span>
            </div>
          </div>

          <!-- Visible Information -->
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px;">
            <div style="background: rgba(76, 175, 80, 0.1); border-radius: 12px; padding: 16px;">
              <div style="font-size: 11px; color: var(--text-muted);">Current Salary</div>
              <div style="font-size: 18px; font-weight: 700; color: #4CAF50;">${formatCurrency(data.salary)}</div>
            </div>
            <div style="background: rgba(33, 150, 243, 0.1); border-radius: 12px; padding: 16px;">
              <div style="font-size: 11px; color: var(--text-muted);">Last Salary</div>
              <div style="font-size: 18px; font-weight: 700; color: #2196F3;">${formatCurrency(data.lastSalary)}</div>
              <div style="font-size: 10px; color: var(--text-muted);">${data.lastSalaryDate}</div>
            </div>
          </div>

          <!-- Expected Activity -->
          <div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 12px 0; font-size: 13px; color: var(--text-muted);">Expected Monthly Activity</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
              <div style="text-align: center;">
                <div style="font-size: 10px; color: var(--text-muted);">Cash</div>
                <div style="font-size: 14px; font-weight: 600;">${formatCurrency(data.expectedCash)}</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 10px; color: var(--text-muted);">Non-Cash</div>
                <div style="font-size: 14px; font-weight: 600;">${formatCurrency(data.expectedNonCash)}</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 10px; color: var(--text-muted);">Transfers</div>
                <div style="font-size: 14px; font-weight: 600;">${formatCurrency(data.expectedTransfer)}</div>
              </div>
            </div>
          </div>

          <!-- Account Status -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 20px;">
            <span style="font-size: 13px;">Total Accounts</span>
            <span style="font-size: 14px; font-weight: 600;">${data.accountsCount} (${data.activeAccounts} active)</span>
          </div>

          <!-- Restricted Information Warning -->
          <div style="background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3); border-radius: 12px; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <svg viewBox="0 0 24 24" fill="#F44336" width="20" height="20">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-8h2v6h-2V9z"/>
              </svg>
              <span style="font-weight: 600; color: #F44336;">Restricted Information</span>
            </div>
            <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">
              Risk scores, AML flags, and compliance investigation notes are not accessible in Call Center view. 
              For sensitive inquiries, please escalate to your supervisor.
            </p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  closeCallCenterModal: function() {
    const modal = document.getElementById('callCenterModal');
    if (modal) modal.remove();
  },

  // =====================================================
  // USER GUIDE MODAL
  // =====================================================
  
  showUserGuideModal: function() {
    const guides = EnterpriseFeatures.getPublishedGuides();
    
    const modalHTML = `
      <div id="userGuideModal" class="enterprise-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div class="modal-content" style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 32px; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 18px; display: flex; align-items: center; gap: 10px;">
              <svg viewBox="0 0 24 24" fill="#00D4FF" width="24" height="24">
                <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
              </svg>
              User Guides & Help
            </h2>
            <button onclick="EnterpriseUI.closeUserGuideModal()" style="background: none; border: none; color: white; cursor: pointer; font-size: 24px;">&times;</button>
          </div>

          <div style="display: grid; gap: 16px;">
            ${guides.map(guide => `
              <div class="guide-card" onclick="EnterpriseUI.showGuideDetail('${guide.id}')" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div>
                    <h3 style="margin: 0 0 4px 0; font-size: 16px;">${guide.title}</h3>
                    <p style="margin: 0; font-size: 13px; color: var(--text-muted);">${guide.titleAr}</p>
                  </div>
                  <span style="padding: 4px 10px; background: rgba(76, 175, 80, 0.2); border-radius: 12px; font-size: 11px; color: #4CAF50;">v${guide.version}</span>
                </div>
                <div style="display: flex; gap: 16px; margin-top: 12px; font-size: 11px; color: var(--text-muted);">
                  <span>📁 ${guide.department}</span>
                  <span>📅 ${guide.lastUpdated}</span>
                  <span style="color: #4CAF50;">● ${guide.status}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  showGuideDetail: function(guideId) {
    const guide = EnterpriseFeatures.getUserGuide(guideId);
    if (!guide) return;

    this.closeUserGuideModal();

    const modalHTML = `
      <div id="guideDetailModal" class="enterprise-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div class="modal-content" style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 32px; max-width: 700px; width: 90%; max-height: 80vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
              <h2 style="margin: 0; font-size: 18px;">${guide.title}</h2>
              <p style="color: var(--text-muted); font-size: 12px; margin-top: 4px;">${guide.titleAr}</p>
            </div>
            <button onclick="document.getElementById('guideDetailModal').remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 24px;">&times;</button>
          </div>

          <div style="background: rgba(0, 212, 255, 0.05); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; font-size: 12px;">
            <span>Department: ${guide.department}</span>
            <span>Version: ${guide.version}</span>
            <span>Updated: ${guide.lastUpdated}</span>
          </div>

          ${guide.sections.map((section, idx) => `
            <div style="margin-bottom: 20px;">
              <h4 style="color: var(--accent-primary); font-size: 14px; margin-bottom: 8px;">${idx + 1}. ${section.title}</h4>
              <p style="font-size: 13px; line-height: 1.6; color: var(--text-secondary); padding-left: 16px;">${section.content}</p>
            </div>
          `).join('')}

          <button onclick="document.getElementById('guideDetailModal').remove()" style="width: 100%; padding: 12px; background: linear-gradient(135deg, #00D4FF, #0288D1); border: none; border-radius: 10px; color: white; cursor: pointer; font-size: 14px; margin-top: 16px;">Close</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  closeUserGuideModal: function() {
    const modal = document.getElementById('userGuideModal');
    if (modal) modal.remove();
  },

  // =====================================================
  // SYSTEM PRESENTATION MODAL
  // =====================================================
  
  currentSlide: 0,

  showPresentationModal: function() {
    const pres = EnterpriseFeatures.systemPresentation;
    this.currentSlide = 0;
    
    const modalHTML = `
      <div id="presentationModal" class="enterprise-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div class="presentation-container" style="width: 100%; max-width: 1200px; height: 90vh; display: flex; flex-direction: column;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <div>
              <h1 style="margin: 0; font-size: 24px; color: #00D4FF;">${pres.title}</h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: var(--text-muted);">${pres.subtitle}</p>
            </div>
            <button onclick="EnterpriseUI.closePresentationModal()" style="background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; font-size: 14px; padding: 8px 16px; border-radius: 8px;">✕ Close</button>
          </div>

          <!-- Slide Content -->
          <div id="slideContent" style="flex: 1; padding: 60px; overflow-y: auto;">
            <!-- Dynamic content -->
          </div>

          <!-- Navigation -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
            <button id="prevSlide" onclick="EnterpriseUI.prevSlide()" style="padding: 12px 24px; background: rgba(255,255,255,0.1); border: none; border-radius: 8px; color: white; cursor: pointer;">← Previous</button>
            <div style="display: flex; gap: 8px;" id="slideIndicators">
              ${pres.slides.map((_, i) => `
                <div class="slide-dot" data-index="${i}" onclick="EnterpriseUI.goToSlide(${i})" style="width: 10px; height: 10px; border-radius: 50%; background: ${i === 0 ? '#00D4FF' : 'rgba(255,255,255,0.3)'}; cursor: pointer;"></div>
              `).join('')}
            </div>
            <button id="nextSlide" onclick="EnterpriseUI.nextSlide()" style="padding: 12px 24px; background: linear-gradient(135deg, #00D4FF, #0288D1); border: none; border-radius: 8px; color: white; cursor: pointer;">Next →</button>
          </div>
        </div>
      </div>

      <style>
        .presentation-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .presentation-table th, .presentation-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .presentation-table th { background: rgba(0, 212, 255, 0.1); color: #00D4FF; }
        .workflow-diagram { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .workflow-node { padding: 12px 24px; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 8px; font-size: 14px; }
        .workflow-node.conditional { background: rgba(255, 152, 0, 0.1); border-color: rgba(255, 152, 0, 0.3); }
        .workflow-node.complete { background: rgba(76, 175, 80, 0.1); border-color: rgba(76, 175, 80, 0.3); }
        .workflow-arrow { font-size: 20px; color: rgba(255,255,255,0.5); }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.renderSlide();
  },

  renderSlide: function() {
    const pres = EnterpriseFeatures.systemPresentation;
    const slide = pres.slides[this.currentSlide];
    const container = document.getElementById('slideContent');
    
    if (!container || !slide) return;

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h2 style="font-size: 36px; margin: 0; color: white;">${slide.title}</h2>
        <p style="font-size: 16px; color: var(--text-muted); margin-top: 8px;">${slide.titleAr}</p>
      </div>
      <div style="max-width: 800px; margin: 0 auto; font-size: 16px; line-height: 1.8; color: var(--text-secondary);">
        ${slide.content}
      </div>
    `;

    // Update indicators
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, i) => {
      dot.style.background = i === this.currentSlide ? '#00D4FF' : 'rgba(255,255,255,0.3)';
    });

    // Update buttons
    document.getElementById('prevSlide').style.visibility = this.currentSlide === 0 ? 'hidden' : 'visible';
    document.getElementById('nextSlide').textContent = this.currentSlide === pres.slides.length - 1 ? 'Finish ✓' : 'Next →';
  },

  prevSlide: function() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.renderSlide();
    }
  },

  nextSlide: function() {
    const pres = EnterpriseFeatures.systemPresentation;
    if (this.currentSlide < pres.slides.length - 1) {
      this.currentSlide++;
      this.renderSlide();
    } else {
      this.closePresentationModal();
    }
  },

  goToSlide: function(index) {
    this.currentSlide = index;
    this.renderSlide();
  },

  closePresentationModal: function() {
    const modal = document.getElementById('presentationModal');
    if (modal) modal.remove();
  },

  // =====================================================
  // CUSTOMER RISK NETWORK GRAPH
  // =====================================================
  
  networkGraphState: {
    selectedNode: null,
    zoom: 1,
    panX: 0,
    panY: 0,
    isDragging: false
  },

  showNetworkGraphModal: function(rim) {
    const graphData = EnterpriseFeatures.buildNetworkGraph(rim);
    
    if (!graphData) {
      alert('Network data not available for this customer');
      return;
    }

    const nodeTypes = EnterpriseFeatures.nodeTypes;
    const edgeTypes = EnterpriseFeatures.edgeTypes;

    const modalHTML = `
      <div id="networkGraphModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 10, 20, 0.95); z-index: 10000; display: flex; flex-direction: column;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); background: linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(0, 212, 255, 0.1));">
          <div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700;">
              <span style="background: linear-gradient(135deg, #9C27B0, #00D4FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">🕸️ Customer Risk Network Graph</span>
            </h2>
            <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 14px;">شبكة علاقات المخاطر للعميل — AML Relationship Visualization</p>
          </div>
          <button onclick="EnterpriseUI.closeNetworkGraphModal()" style="background: rgba(255,255,255,0.1); border: none; color: white; cursor: pointer; font-size: 14px; padding: 8px 16px; border-radius: 8px;">✕ Close</button>
        </div>

        <!-- Main Content -->
        <div style="display: flex; flex: 1; overflow: hidden;">
          <!-- Canvas Area -->
          <div style="flex: 1; position: relative; background: radial-gradient(circle at center, rgba(156, 39, 176, 0.05) 0%, transparent 70%);">
            <canvas id="networkCanvas" style="width: 100%; height: 100%;"></canvas>
            
            <!-- Legend -->
            <div style="position: absolute; bottom: 20px; left: 20px; background: rgba(0, 20, 40, 0.9); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px;">
              <h4 style="margin: 0 0 12px 0; font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Legend</h4>
              <div style="display: grid; gap: 8px; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: ${nodeTypes.CUSTOMER.color};"></div> Customer</div>
                <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: ${nodeTypes.JOINT_HOLDER.color};"></div> Joint Holder</div>
                <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: ${nodeTypes.COMPANY.color};"></div> Company</div>
                <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: ${nodeTypes.SIGNATORY.color};"></div> Signatory/POA</div>
                <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: ${nodeTypes.HIGH_RISK.color};"></div> High Risk</div>
                <div style="display: flex; align-items: center; gap: 8px;"><div style="width: 12px; height: 12px; border-radius: 50%; background: ${nodeTypes.PEP.color};"></div> PEP</div>
              </div>
            </div>

            <!-- Zoom Controls -->
            <div style="position: absolute; top: 20px; right: 20px; display: flex; flex-direction: column; gap: 8px;">
              <button onclick="EnterpriseUI.zoomNetworkGraph(1.2)" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(0, 212, 255, 0.2); border: 1px solid rgba(0, 212, 255, 0.3); color: white; cursor: pointer; font-size: 18px;">+</button>
              <button onclick="EnterpriseUI.zoomNetworkGraph(0.8)" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(0, 212, 255, 0.2); border: 1px solid rgba(0, 212, 255, 0.3); color: white; cursor: pointer; font-size: 18px;">−</button>
              <button onclick="EnterpriseUI.resetNetworkGraph()" style="width: 40px; height: 40px; border-radius: 8px; background: rgba(255, 152, 0, 0.2); border: 1px solid rgba(255, 152, 0, 0.3); color: white; cursor: pointer; font-size: 14px;">⟲</button>
            </div>
          </div>

          <!-- Side Panel -->
          <div style="width: 380px; border-left: 1px solid rgba(255,255,255,0.1); overflow-y: auto; background: rgba(0, 20, 40, 0.5);">
            <!-- Node Details -->
            <div id="nodeDetailsPanel" style="padding: 24px;">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Node Details</h3>
              <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                <p>Click on a node to view details</p>
              </div>
            </div>

            <!-- Risk Indicators -->
            <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">⚠️ Risk Indicators</h3>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${graphData.riskIndicators.map(indicator => `
                  <div style="padding: 12px; background: rgba(${indicator.severity === 'Critical' ? '244, 67, 54' : indicator.severity === 'High' ? '255, 152, 0' : indicator.severity === 'Medium' ? '255, 193, 7' : '76, 175, 80'}, 0.1); border-left: 4px solid ${indicator.severity === 'Critical' ? '#F44336' : indicator.severity === 'High' ? '#FF9800' : indicator.severity === 'Medium' ? '#FFC107' : '#4CAF50'}; border-radius: 0 8px 8px 0;">
                    <div style="font-weight: 600; font-size: 12px; margin-bottom: 4px;">${indicator.type}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${indicator.description}</div>
                    <div style="font-size: 10px; margin-top: 4px; color: ${indicator.severity === 'Critical' ? '#F44336' : indicator.severity === 'High' ? '#FF9800' : indicator.severity === 'Medium' ? '#FFC107' : '#4CAF50'};">${indicator.severity} Severity</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Accounts Summary -->
            <div style="padding: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
              <h3 style="margin: 0 0 16px 0; font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">💳 Connected Accounts</h3>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${graphData.accounts.map(acc => `
                  <div style="padding: 12px; background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.2); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="font-family: monospace; font-size: 11px;">${acc.number}</span>
                      <span style="font-size: 10px; padding: 2px 6px; background: ${acc.status === 'Active' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}; border-radius: 4px; color: ${acc.status === 'Active' ? '#4CAF50' : '#F44336'};">${acc.status}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 8px;">
                      <span style="font-size: 11px; color: var(--text-muted);">${acc.type}</span>
                      <span style="font-weight: 600; font-size: 13px; color: #4CAF50;">${acc.balance.toLocaleString()} QAR</span>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top: 12px; padding: 12px; background: rgba(0, 212, 255, 0.1); border-radius: 8px; text-align: center;">
                <div style="font-size: 10px; color: var(--text-muted);">Total Exposure</div>
                <div style="font-size: 20px; font-weight: 700; color: #00D4FF;">${graphData.accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()} QAR</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Store graph data for rendering
    this.currentGraphData = graphData;
    
    // Initialize canvas
    setTimeout(() => this.renderNetworkGraph(), 100);
  },

  renderNetworkGraph: function() {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas || !this.currentGraphData) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    
    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const { nodes, edges } = this.currentGraphData;
    const nodeTypes = EnterpriseFeatures.nodeTypes;
    const edgeTypes = EnterpriseFeatures.edgeTypes;

    // Apply zoom and pan
    const zoom = this.networkGraphState.zoom;
    const panX = this.networkGraphState.panX;
    const panY = this.networkGraphState.panY;

    // Clear canvas
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < rect.width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, rect.height);
      ctx.stroke();
    }
    for (let y = 0; y < rect.height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    // Calculate center offset
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const fromX = (fromNode.x - 400) * zoom + centerX + panX;
      const fromY = (fromNode.y - 300) * zoom + centerY + panY;
      const toX = (toNode.x - 400) * zoom + centerX + panX;
      const toY = (toNode.y - 300) * zoom + centerY + panY;

      const edgeStyle = edgeTypes[edge.type] || { color: '#666', style: 'solid' };

      ctx.beginPath();
      ctx.strokeStyle = edgeStyle.color;
      ctx.lineWidth = 2;
      
      if (edgeStyle.style === 'dashed') {
        ctx.setLineDash([8, 4]);
      } else if (edgeStyle.style === 'dotted') {
        ctx.setLineDash([2, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw edge label
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      
      ctx.font = '10px system-ui';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(edge.label + (edge.ownershipPct ? ` (${edge.ownershipPct}%)` : ''), midX, midY - 8);
    });

    // Draw nodes
    nodes.forEach(node => {
      const x = (node.x - 400) * zoom + centerX + panX;
      const y = (node.y - 300) * zoom + centerY + panY;
      const nodeStyle = nodeTypes[node.type] || nodeTypes.CUSTOMER;
      const size = nodeStyle.size * zoom;

      // Draw glow for center node
      if (node.isCenter) {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
        gradient.addColorStop(0, nodeStyle.color + '40');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = nodeStyle.color + '20';
      ctx.fill();
      ctx.strokeStyle = nodeStyle.color;
      ctx.lineWidth = node.isCenter ? 4 : 2;
      ctx.stroke();

      // Draw icon
      ctx.font = `${size * 0.5}px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = nodeStyle.color;
      ctx.fillText(nodeStyle.icon, x, y);

      // Draw label
      ctx.font = `${node.isCenter ? 'bold ' : ''}${11 * zoom}px system-ui`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, x, y + size / 2 + 12 * zoom);
      
      // Draw Arabic label for center
      if (node.isCenter && node.labelAr) {
        ctx.font = `${10 * zoom}px system-ui`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(node.labelAr, x, y + size / 2 + 24 * zoom);
      }
    });

    // Add click handler
    canvas.onclick = (e) => {
      const clickX = e.offsetX;
      const clickY = e.offsetY;
      
      nodes.forEach(node => {
        const x = (node.x - 400) * zoom + centerX + panX;
        const y = (node.y - 300) * zoom + centerY + panY;
        const size = (nodeTypes[node.type]?.size || 50) * zoom;
        
        if (Math.abs(clickX - x) < size / 2 && Math.abs(clickY - y) < size / 2) {
          this.showNodeDetails(node);
        }
      });
    };
  },

  showNodeDetails: function(node) {
    const panel = document.getElementById('nodeDetailsPanel');
    if (!panel) return;

    const nodeTypes = EnterpriseFeatures.nodeTypes;
    const nodeStyle = nodeTypes[node.type] || nodeTypes.CUSTOMER;
    const data = node.data;

    let detailsHTML = `
      <h3 style="margin: 0 0 16px 0; font-size: 14px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">Node Details</h3>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: ${nodeStyle.color}20; border: 3px solid ${nodeStyle.color}; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 32px;">
          ${nodeStyle.icon}
        </div>
        <h4 style="margin: 0; font-size: 16px; color: white;">${node.label}</h4>
        ${node.labelAr ? `<p style="margin: 4px 0 0 0; font-size: 13px; color: var(--text-muted);">${node.labelAr}</p>` : ''}
        <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: ${nodeStyle.color}30; border: 1px solid ${nodeStyle.color}; border-radius: 20px; font-size: 11px; color: ${nodeStyle.color};">${node.type.replace(/_/g, ' ')}</span>
      </div>
    `;

    if (node.isCenter) {
      detailsHTML += `
        <div style="display: grid; gap: 12px;">
          <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">RIM</div>
            <div style="font-family: monospace; font-size: 14px;">${data.rim}</div>
          </div>
          <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Segment</div>
            <div style="font-size: 14px;">${data.segment}</div>
          </div>
          <div style="padding: 12px; background: rgba(${data.riskLevel === 'AUTO HIGH' || data.riskLevel === 'HIGH' ? '244, 67, 54' : '255, 152, 0'}, 0.1); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Risk Level</div>
            <div style="font-size: 14px; font-weight: 600; color: ${data.riskLevel === 'AUTO HIGH' || data.riskLevel === 'HIGH' ? '#F44336' : '#FF9800'};">${data.riskLevel}</div>
          </div>
          ${data.isPEP ? `
          <div style="padding: 12px; background: rgba(255, 87, 34, 0.2); border: 1px solid #FF5722; border-radius: 8px;">
            <div style="font-size: 10px; color: #FF5722; margin-bottom: 4px;">⚠️ PEP STATUS</div>
            <div style="font-size: 14px; font-weight: 600; color: #FF5722;">${data.pepPosition || 'Politically Exposed Person'}</div>
          </div>
          ` : ''}
        </div>
      `;
    } else {
      detailsHTML += `
        <div style="display: grid; gap: 12px;">
          ${data.rim ? `
          <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">RIM</div>
            <div style="font-family: monospace; font-size: 14px;">${data.rim}</div>
          </div>
          ` : ''}
          ${data.crNumber ? `
          <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">CR Number</div>
            <div style="font-family: monospace; font-size: 14px;">${data.crNumber}</div>
          </div>
          ` : ''}
          <div style="padding: 12px; background: rgba(156, 39, 176, 0.1); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Relationship</div>
            <div style="font-size: 14px;">${data.relationship?.replace(/_/g, ' ')}</div>
          </div>
          ${data.ownershipPct ? `
          <div style="padding: 12px; background: rgba(76, 175, 80, 0.1); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Ownership Percentage</div>
            <div style="font-size: 24px; font-weight: 700; color: #4CAF50;">${data.ownershipPct}%</div>
          </div>
          ` : ''}
          ${data.accountNumber ? `
          <div style="padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Account Number</div>
            <div style="font-family: monospace; font-size: 12px;">${data.accountNumber}</div>
          </div>
          ` : ''}
          ${data.poaType ? `
          <div style="padding: 12px; background: rgba(233, 30, 99, 0.1); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">POA Type</div>
            <div style="font-size: 14px;">${data.poaType}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Expires: ${data.poaExpiry}</div>
          </div>
          ` : ''}
          ${data.position ? `
          <div style="padding: 12px; background: rgba(33, 150, 243, 0.1); border-radius: 8px;">
            <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">Position</div>
            <div style="font-size: 14px;">${data.position}</div>
          </div>
          ` : ''}
          ${data.isPEP ? `
          <div style="padding: 12px; background: rgba(255, 87, 34, 0.2); border: 1px solid #FF5722; border-radius: 8px;">
            <div style="font-size: 12px; font-weight: 600; color: #FF5722;">⚠️ PEP - Politically Exposed Person</div>
          </div>
          ` : ''}
        </div>
      `;
    }

    panel.innerHTML = detailsHTML;
  },

  zoomNetworkGraph: function(factor) {
    this.networkGraphState.zoom *= factor;
    this.networkGraphState.zoom = Math.max(0.5, Math.min(2.5, this.networkGraphState.zoom));
    this.renderNetworkGraph();
  },

  resetNetworkGraph: function() {
    this.networkGraphState.zoom = 1;
    this.networkGraphState.panX = 0;
    this.networkGraphState.panY = 0;
    this.renderNetworkGraph();
  },

  closeNetworkGraphModal: function() {
    const modal = document.getElementById('networkGraphModal');
    if (modal) modal.remove();
    this.currentGraphData = null;
  },

  // =====================================================
  // INITIALIZATION
  // =====================================================
  
  init: function(rim) {
    // Render Financial Profile Panel
    this.renderFinancialProfilePanel(rim);
    
    // Render Expected Activity Panel
    this.renderExpectedActivityPanel(rim);
  }
};

// Make globally available
window.EnterpriseUI = EnterpriseUI;
