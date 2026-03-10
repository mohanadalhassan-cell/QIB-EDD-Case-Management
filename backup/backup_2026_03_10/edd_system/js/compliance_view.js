// Compliance View Controller
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
