// CDD View Controller
document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const session = JSON.parse(sessionStorage.getItem('edd_session') || '{}');
  if (!session.authenticated) {
    window.location.replace('login.html');
    return;
  }

  // Update user info
  document.getElementById('user-name').textContent = session.user?.name || 'User';
  document.getElementById('user-role').textContent = session.user?.role || 'Role';
  document.getElementById('user-avatar').textContent = getInitials(session.user?.name || 'User');

  // Load cases
  loadCDDCases();

  // Load activity timeline
  loadActivityTimeline();

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = 'login.html';
  });
});

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function loadCDDCases() {
  const cases = MockData.eddCases;
  
  // Filter by CDD stages
  const pendingCDD = cases.filter(c => c.status === 'pending_cdd');
  const makerReview = cases.filter(c => c.status === 'pending_cdd' && Math.random() > 0.5); // Simulated
  const checkerApproval = cases.filter(c => c.status === 'pending_cdd_approval');
  const escalated = cases.filter(c => c.status === 'escalated');

  // Update stats
  document.getElementById('pending-count').textContent = pendingCDD.length;
  document.getElementById('maker-count').textContent = 1;
  document.getElementById('checker-count').textContent = checkerApproval.length;
  document.getElementById('completed-count').textContent = 
    cases.filter(c => c.status === 'completed').length;

  // Update kanban counts
  document.getElementById('kanban-pending-count').textContent = pendingCDD.length;
  document.getElementById('kanban-maker-count').textContent = 1;
  document.getElementById('kanban-checker-count').textContent = checkerApproval.length;
  document.getElementById('kanban-escalated-count').textContent = escalated.length;

  // Render kanban cards
  renderKanbanColumn('kanban-pending', pendingCDD);
  renderKanbanColumn('kanban-maker', pendingCDD.slice(0, 1));
  renderKanbanColumn('kanban-checker', checkerApproval);
  renderKanbanColumn('kanban-escalated', escalated);
}

function renderKanbanColumn(containerId, cases) {
  const container = document.getElementById(containerId);
  
  if (cases.length === 0) {
    container.innerHTML = `
      <div class="kanban-empty">
        <p>No cases in this stage</p>
      </div>
    `;
    return;
  }

  container.innerHTML = cases.map(eddCase => {
    const customer = MockData.customers.find(c => c.rim === eddCase.rim) || {};
    const daysOpen = Math.floor((new Date() - new Date(eddCase.created_date)) / (1000 * 60 * 60 * 24));
    
    return `
      <div class="kanban-card" onclick="openCase('${eddCase.id}')">
        <div class="kanban-card-header">
          <span class="case-id">${eddCase.id}</span>
          <span class="risk-indicator ${customer.risk_level || 'medium'}">
            <span class="dot"></span>
            ${(customer.risk_level || 'medium').toUpperCase()}
          </span>
        </div>
        <div class="kanban-card-body">
          <h4>${customer.name || 'Unknown'}</h4>
          <p>${customer.rim || eddCase.rim} • ${customer.segment || 'N/A'}</p>
        </div>
        <div class="kanban-card-footer">
          <div class="triggers">
            ${eddCase.triggers.slice(0, 2).map(t => `<span class="trigger-tag">${t}</span>`).join('')}
          </div>
          <span class="days-open ${daysOpen > 7 ? 'overdue' : ''}">${daysOpen}d</span>
        </div>
      </div>
    `;
  }).join('');
}

function loadActivityTimeline() {
  const timeline = document.getElementById('activity-timeline');
  
  const activities = [
    { action: 'Case EDD-2024-001238 approved by Checker', user: 'Maryam Al-Sulaiti', time: '10 minutes ago', type: 'success' },
    { action: 'Case EDD-2024-001237 submitted for Checker approval', user: 'Hassan Al-Naimi', time: '25 minutes ago', type: 'info' },
    { action: 'Case EDD-2024-001236 escalated to Compliance', user: 'Hassan Al-Naimi', time: '1 hour ago', type: 'warning' },
    { action: 'Case EDD-2024-001235 returned to Business with comments', user: 'Maryam Al-Sulaiti', time: '2 hours ago', type: 'info' },
    { action: 'Case EDD-2024-001234 received from Business', user: 'System', time: '3 hours ago', type: 'info' },
  ];

  timeline.innerHTML = activities.map((a, i) => `
    <div class="timeline-item ${i === 0 ? 'active' : ''}">
      <div class="timeline-marker ${a.type}"></div>
      <div class="timeline-content">
        <h4>${a.action}</h4>
        <p>${a.user} • ${a.time}</p>
      </div>
    </div>
  `).join('');
}

function openCase(caseId) {
  window.location.href = `edd_case.html?id=${caseId}`;
}

// Add kanban styles
const styles = `
  .kanban-board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    overflow-x: auto;
    padding-bottom: 20px;
  }
  
  @media (max-width: 1200px) {
    .kanban-board {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (max-width: 768px) {
    .kanban-board {
      grid-template-columns: 1fr;
    }
  }
  
  .kanban-column {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
  }
  
  .kanban-header {
    padding: 16px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .kanban-header h3 {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .kanban-count {
    background: var(--accent);
    color: var(--bg-primary);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 10px;
  }
  
  .kanban-cards {
    padding: 12px;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .kanban-card {
    background: rgba(0,0,0,0.3);
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .kanban-card:hover {
    background: rgba(0, 212, 255, 0.05);
    border-color: var(--accent);
    transform: translateY(-2px);
  }
  
  .kanban-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .kanban-card-header .case-id {
    font-size: 11px;
    font-weight: 600;
    color: var(--accent);
  }
  
  .kanban-card-body h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-primary);
  }
  
  .kanban-card-body p {
    font-size: 11px;
    color: var(--text-muted);
  }
  
  .kanban-card-footer {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .triggers {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  
  .trigger-tag {
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 4px;
    background: rgba(255, 82, 82, 0.2);
    color: #FF5252;
    font-weight: 500;
  }
  
  .days-open {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
  }
  
  .days-open.overdue {
    color: #FF5252;
  }
  
  .kanban-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: var(--text-muted);
    font-size: 13px;
  }
  
  .timeline-marker.success { background: #00E676; }
  .timeline-marker.warning { background: #FFA726; }
  .timeline-marker.info { background: var(--accent); }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
