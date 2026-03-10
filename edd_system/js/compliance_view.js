// ═══════════════════════════════════════════════════════════════════════════════
// QIB COMPLIANCE VIEW CONTROLLER
// Escalation Monitoring with 5% Threshold Analytics
// FATF Rec 20 | QCB AML/CFT Framework | COBIT 2019 DSS05
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const session = JSON.parse(sessionStorage.getItem('edd_session') || '{}');
  if (!session.authenticated) {
    window.location.replace('/edd_system/login.html');
    return;
  }

  // Update user info
  document.getElementById('user-name').textContent = session.user?.name || 'User';
  document.getElementById('user-role').textContent = session.user?.role || 'Role';
  document.getElementById('user-avatar').textContent = getInitials(session.user?.name || 'User');

  // Load data
  loadEscalatedCases();
  loadPEPList();

  // Add Escalation Analytics Panel
  addEscalationAnalyticsPanel();

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = '/edd_system/login.html';
  });
});

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function loadEscalatedCases() {
  const escalated = MockData.eddCases.filter(c => c.status === 'escalated' || c.status === 'pending_compliance');
  
  // Update stats
  document.getElementById('escalated-count').textContent = escalated.length;
  
  const tbody = document.getElementById('escalated-tbody');
  
  if (escalated.length === 0) {
    // Add sample escalated cases for demo
    const sampleCases = [
      {
        id: 'EDD-2024-001241',
        rim: 'RIM001234',
        reason: 'PEP High Risk - Former Minister',
        escalation_date: '2024-02-18'
      },
      {
        id: 'EDD-2024-001242',
        rim: 'RIM001235',
        reason: 'Large Cash Transactions',
        escalation_date: '2024-02-17'
      }
    ];
    
    tbody.innerHTML = sampleCases.map(c => {
      const customer = MockData.customers.find(cust => cust.rim === c.rim) || { name: 'Unknown Customer', risk_level: 'high' };
      return `
        <tr>
          <td><span style="color: var(--accent); font-weight: 600;">${c.id}</span></td>
          <td>${customer.name}</td>
          <td><span class="risk-indicator ${customer.risk_level}"><span class="dot"></span>${customer.risk_level.toUpperCase()}</span></td>
          <td style="font-size: 12px;">${c.reason}</td>
          <td style="font-size: 12px; color: var(--text-muted);">${formatDate(c.escalation_date)}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="openCase('${c.id}')">Review</button>
          </td>
        </tr>
      `;
    }).join('');
  } else {
    tbody.innerHTML = escalated.map(c => {
      const customer = MockData.customers.find(cust => cust.rim === c.rim) || { name: 'Unknown', risk_level: 'medium' };
      return `
        <tr>
          <td><span style="color: var(--accent); font-weight: 600;">${c.id}</span></td>
          <td>${customer.name}</td>
          <td><span class="risk-indicator ${customer.risk_level}"><span class="dot"></span>${customer.risk_level.toUpperCase()}</span></td>
          <td style="font-size: 12px;">${c.triggers.join(', ')}</td>
          <td style="font-size: 12px; color: var(--text-muted);">${formatDate(c.created_date)}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="openCase('${c.id}')">Review</button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function loadPEPList() {
  const pepCustomers = MockData.customers.filter(c => c.pep_status);
  document.getElementById('pep-count').textContent = pepCustomers.length;

  const container = document.getElementById('pep-list');
  
  container.innerHTML = pepCustomers.map(c => `
    <div class="pep-item">
      <div class="pep-avatar">${getInitials(c.name)}</div>
      <div class="pep-info">
        <h4>${c.name}</h4>
        <p>${c.rim} • ${c.segment}</p>
        <div class="pep-tags">
          <span class="pep-tag">PEP</span>
          <span class="risk-tag ${c.risk_level}">${c.risk_level.toUpperCase()}</span>
        </div>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="viewPEP('${c.rim}')">
        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
      </button>
    </div>
  `).join('');
}

function openCase(caseId) {
  window.location.href = `/edd_system/edd_case.html?id=${caseId}`;
}

function viewPEP(rim) {
  alert(`View PEP profile for ${rim} - Feature demo only`);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Escalation Analytics Panel (5% Threshold Monitoring) ────────────────────

function addEscalationAnalyticsPanel() {
  const pageContent = document.querySelector('.page-content') || document.querySelector('.main-content');
  if (!pageContent) return;

  // Insert after the first card or at the top
  const firstCard = pageContent.querySelector('.card');

  const panel = document.createElement('div');
  panel.className = 'card';
  panel.style.cssText = 'margin-bottom: 24px; border-radius: 16px; border: 1px solid rgba(0,212,255,0.2); overflow: hidden;';
  panel.innerHTML = `
    <div style="background: linear-gradient(135deg, rgba(0,212,255,0.08), rgba(136,0,255,0.05)); border-bottom: 2px solid rgba(0,212,255,0.2); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <h3 style="margin: 0; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
          <svg viewBox="0 0 24 24" fill="#00D4FF" width="22" height="22"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
          Escalation Analytics — 5% Threshold Monitoring
        </h3>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">
          QCB AML/CFT Framework • FATF Rec 20 • Real-time monitoring
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <span style="padding: 4px 10px; border-radius: 20px; font-size: 9px; background: rgba(0,212,255,0.1); color: #00D4FF; border: 1px solid rgba(0,212,255,0.2);">FATF Rec 20</span>
        <span style="padding: 4px 10px; border-radius: 20px; font-size: 9px; background: rgba(76,175,80,0.1); color: #4CAF50; border: 1px solid rgba(76,175,80,0.2);">QCB AML/CFT</span>
        <span style="padding: 4px 10px; border-radius: 20px; font-size: 9px; background: rgba(255,152,0,0.1); color: #FFB300; border: 1px solid rgba(255,152,0,0.2);">COBIT DSS05</span>
      </div>
    </div>
    <div style="padding: 24px;">
      <!-- Escalation Metrics Row -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 24px;">
        <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid var(--glass-border);">
          <div style="font-size: 28px; font-weight: 700; color: #00D4FF;">247</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Total Cases (MTD)</div>
        </div>
        <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid var(--glass-border);">
          <div style="font-size: 28px; font-weight: 700; color: #00E676;">235</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Resolved Normal</div>
        </div>
        <div style="background: rgba(255,152,0,0.05); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(255,152,0,0.3);">
          <div style="font-size: 28px; font-weight: 700; color: #FFA726;">8</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Escalated Cases</div>
        </div>
        <div id="threshold-card" style="background: rgba(0,230,118,0.05); border-radius: 12px; padding: 20px; text-align: center; border: 2px solid rgba(0,230,118,0.4); position: relative;">
          <div style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: #00E676; color: #0a1f3d; padding: 2px 10px; border-radius: 10px; font-size: 9px; font-weight: 700;">WITHIN THRESHOLD</div>
          <div style="font-size: 28px; font-weight: 700; color: #00E676;">3.2%</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">Escalation Rate</div>
          <div style="font-size: 10px; color: #00E676; margin-top: 4px;">Target: ≤ 5.0%</div>
        </div>
        <div style="background: rgba(0,0,0,0.2); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid var(--glass-border);">
          <div style="font-size: 28px; font-weight: 700; color: #CE93D8;">4</div>
          <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">PEP Escalations</div>
        </div>
      </div>

      <!-- Escalation Trend (Last 6 Months) -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <div style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px solid var(--glass-border);">
          <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 16px; display: flex; justify-content: space-between;">
            <span>Escalation Trend (6 Months)</span>
            <span style="font-size: 10px; color: var(--text-muted); font-weight: 400;">BCBS 239 — Trend Analysis</span>
          </h4>
          <div style="display: flex; align-items: flex-end; gap: 12px; height: 120px; padding: 0 10px;">
            ${[
              { month: 'Sep', rate: 4.8, count: 11, color: '#FFA726' },
              { month: 'Oct', rate: 3.9, count: 9, color: '#00E676' },
              { month: 'Nov', rate: 5.2, count: 13, color: '#FF5252' },
              { month: 'Dec', rate: 4.1, count: 10, color: '#00E676' },
              { month: 'Jan', rate: 3.5, count: 8, color: '#00E676' },
              { month: 'Feb', rate: 3.2, count: 8, color: '#00E676' }
            ].map(m => `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 4px;">
                <span style="font-size: 10px; font-weight: 600; color: ${m.color};">${m.rate}%</span>
                <div style="width: 100%; background: ${m.color}; border-radius: 6px 6px 0 0; height: ${m.rate * 20}px; min-height: 10px; opacity: 0.8; position: relative;">
                  ${m.rate > 5 ? '<div style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); font-size: 8px;">⚠️</div>' : ''}
                </div>
                <span style="font-size: 10px; color: var(--text-muted);">${m.month}</span>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 12px; border-top: 2px dashed rgba(255,82,82,0.3); position: relative;">
            <span style="position: absolute; top: -8px; right: 0; font-size: 9px; color: #FF5252; font-weight: 600;">5% THRESHOLD LINE</span>
          </div>
        </div>

        <!-- Escalation Breakdown -->
        <div style="background: rgba(0,0,0,0.15); border-radius: 12px; padding: 20px; border: 1px solid var(--glass-border);">
          <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 16px;">Escalation Reasons</h4>
          ${[
            { reason: 'PEP High Risk', count: 4, pct: 50, color: '#FF5252' },
            { reason: 'Large Cash Txns', count: 2, pct: 25, color: '#FFA726' },
            { reason: 'Sanctions Alert', count: 1, pct: 12.5, color: '#CE93D8' },
            { reason: 'Missing SOW Docs', count: 1, pct: 12.5, color: '#64B5F6' }
          ].map(r => `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                <span style="color: var(--text-secondary);">${r.reason}</span>
                <span style="color: ${r.color}; font-weight: 600;">${r.count} (${r.pct}%)</span>
              </div>
              <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden;">
                <div style="height: 100%; width: ${r.pct}%; background: ${r.color}; border-radius: 3px;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  if (firstCard) {
    firstCard.parentNode.insertBefore(panel, firstCard);
  } else {
    pageContent.prepend(panel);
  }
}

// Add styles
const styles = `
  .alert-banner {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
    border-radius: 12px;
    background: rgba(255, 167, 38, 0.1);
    border: 1px solid rgba(255, 167, 38, 0.3);
  }
  
  .alert-banner svg {
    flex-shrink: 0;
    color: #FFA726;
  }
  
  .alert-banner strong {
    display: block;
    color: #FFA726;
    margin-bottom: 4px;
  }
  
  .alert-banner p {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 0;
  }
  
  .pep-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
    margin-bottom: 10px;
    transition: all 0.2s ease;
  }
  
  .pep-item:hover {
    background: rgba(0, 212, 255, 0.05);
  }
  
  .pep-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
  }
  
  .pep-info {
    flex: 1;
  }
  
  .pep-info h4 {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 2px;
    color: var(--text-primary);
  }
  
  .pep-info p {
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  
  .pep-tags {
    display: flex;
    gap: 6px;
  }
  
  .pep-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(156, 39, 176, 0.2);
    color: #CE93D8;
    font-weight: 600;
  }
  
  .risk-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
  }
  
  .risk-tag.high {
    background: rgba(255, 82, 82, 0.2);
    color: #FF5252;
  }
  
  .risk-tag.medium {
    background: rgba(255, 167, 38, 0.2);
    color: #FFA726;
  }
  
  .compliance-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px 16px;
    background: rgba(0,0,0,0.2);
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .compliance-action:hover {
    background: rgba(0, 212, 255, 0.05);
    border-color: var(--accent);
    transform: translateY(-2px);
  }
  
  .compliance-action .action-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }
  
  .compliance-action .action-icon.approve {
    background: rgba(0, 230, 118, 0.2);
    color: #00E676;
  }
  
  .compliance-action .action-icon.restrict {
    background: rgba(255, 167, 38, 0.2);
    color: #FFA726;
  }
  
  .compliance-action .action-icon.freeze {
    background: rgba(33, 150, 243, 0.2);
    color: #64B5F6;
  }
  
  .compliance-action .action-icon.report {
    background: rgba(255, 82, 82, 0.2);
    color: #FF5252;
  }
  
  .compliance-action h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-primary);
  }
  
  .compliance-action p {
    font-size: 11px;
    color: var(--text-muted);
    margin: 0;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
