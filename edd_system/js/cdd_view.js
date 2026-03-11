// CDD View Controller - Dynamic Case Management
let caseManager = null;
let currentViewingStatus = null;
let currentCaseFilter = [];

document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const session = JSON.parse(sessionStorage.getItem('edd_session') || '{}');
  if (!session.authenticated) {
    window.location.replace('/edd_system/login.html');
    return;
  }

  // Initialize case manager
  if (typeof CaseManager !== 'undefined' && !window.caseManager) {
    window.caseManager = new CaseManager();
  }
  caseManager = window.caseManager;

  // Update user info
  document.getElementById('user-name').textContent = session.user?.name || 'User';
  document.getElementById('user-role').textContent = session.user?.role || 'Role';
  document.getElementById('user-avatar').textContent = getInitials(session.user?.name || 'User');

  // Load cases dynamically
  loadCDDCases();

  // Load activity timeline
  loadActivityTimeline();

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = '/edd_system/login.html';
  });

  // Create Case button (if exists)
  const createCaseBtn = document.getElementById('create-case-btn');
  if (createCaseBtn) {
    createCaseBtn.addEventListener('click', openCreateCaseModal);
  }

  // Add modal styles
  addModalStyles();
  addSectorBadgeStyles();
});

/**
 * Get user initials for avatar
 */
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

/**
 * Load all CDD cases and display counts and cards
 */
function loadCDDCases() {
  if (!caseManager) return;

  // Get case counts by status
  const counts = caseManager.getCountsByStatus();

  // Update stat cards
  updateStatCard('pending-count', counts.PENDING_CDD);
  updateStatCard('maker-count', counts.MAKER_REVIEW);
  updateStatCard('checker-count', counts.CHECKER_REVIEW);
  updateStatCard('completed-count', counts.COMPLETED);

  // Update kanban board
  renderKanbanColumn('PENDING_CDD', 'kanban-pending', counts.PENDING_CDD);
  renderKanbanColumn('MAKER_REVIEW', 'kanban-maker', counts.MAKER_REVIEW);
  renderKanbanColumn('CHECKER_REVIEW', 'kanban-checker', counts.CHECKER_REVIEW);
  renderKanbanColumn('ESCALATED_COMPLIANCE', 'kanban-escalated', counts.ESCALATED_COMPLIANCE);
}

/**
 * Update stat card with count
 */
function updateStatCard(elementId, count) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = count;
  }
}

/**
 * Render a kanban column with cases
 */
function renderKanbanColumn(status, containerId, caseCount) {
  const container = document.getElementById(containerId);
  const countElement = document.getElementById('kanban-' + containerId.split('-')[1] + '-count');
  
  if (!container) return;

  // Update count badge
  if (countElement) {
    countElement.textContent = caseCount;
  }

  if (caseCount === 0) {
    container.innerHTML = `
      <div class="kanban-empty">
        <p>No cases in this stage</p>
        <button onclick="openCreateCaseModal()" style="margin-top: 12px; padding: 8px 16px; background: var(--accent); color: #000; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
          Create One
        </button>
      </div>
    `;
    return;
  }

  // Get cases for this status and show first 3 as preview
  const cases = caseManager.getCasesByStatus(status).slice(0, 3);
  
  container.innerHTML = cases.map(caseObj => renderKanbanCard(caseObj)).join('') + (caseCount > 3 ? `
    <div class="kanban-card" style="text-align: center; padding: 20px; cursor: pointer; opacity: 0.7;" onclick="openCaseListModal('${status}')">
      <p>+${caseCount - 3} more cases...</p>
      <button style="padding: 8px 12px; background: var(--accent); color: #000; border: none; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;">
        View All
      </button>
    </div>
  ` : '');

  // Add "View All" or "Create New" button at bottom
  const viewBtn = document.createElement('div');
  viewBtn.style.cssText = 'padding: 12px; text-align: center; border-top: 1px solid var(--glass-border);';
  viewBtn.innerHTML = `
    <button onclick="openCaseListModal('${status}')" style="width: 100%; padding: 8px; background: rgba(0, 212, 255, 0.1); border: 1px solid var(--accent); color: var(--accent); border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">
      View All ${caseCount}
    </button>
  `;
  
  // Don't re-add if already exists
  const existingBtn = container.parentElement?.querySelector('.kanban-view-all-btn');
  if (!existingBtn && caseCount > 0) {
    viewBtn.className = 'kanban-view-all-btn';
    // Insert after kanban-cards div
    const cards = container;
    if (cards.parentElement) {
      cards.parentElement.appendChild(viewBtn);
    }
  }
}

/**
 * Render a single kanban card
 */
function renderKanbanCard(caseObj) {
  if (!caseObj) return '';

  const customer = caseManager.findCustomer(caseObj.rim);
  const daysOpen = Math.floor((new Date() - new Date(caseObj.created_date)) / (1000 * 60 * 60 * 24));
  const customerInitials = (caseObj.customer_name || 'N/A').split(' ').map((n, i) => i < 2 ? n[0] : '').join('');
  
  const riskColor = caseObj.risk_level === 'HIGH' ? '#FF5252' : caseObj.risk_level === 'MEDIUM' ? '#FFA726' : '#00E676';
  
  return `
    <div class="kanban-card" onclick="openCaseDetail('${caseObj.case_id}')">
      <div class="kanban-card-header">
        <span class="case-id">${caseObj.case_id}</span>
        <span style="background: ${riskColor}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;">
          ${caseObj.risk_level}
        </span>
      </div>
      <div class="kanban-card-body">
        <h4>${customerInitials}</h4>
        <p>${caseObj.rim} • ${caseObj.sector}</p>
      </div>
      <div class="kanban-card-footer">
        <span class="assigned-user" style="font-size: 11px; color: var(--text-muted);">
          ${caseObj.assigned_user || 'Unassigned'}
        </span>
        <span class="days-open ${daysOpen > 7 ? 'overdue' : ''}" style="font-size: 11px; ${daysOpen > 7 ? 'color: #FF5252;' : 'color: var(--text-muted);'}">
          ${daysOpen}d
        </span>
      </div>
    </div>
  `;
}

/**
 * Open case list modal for a specific status
 */
function openCaseListModal(status) {
  if (!caseManager) return;

  currentViewingStatus = status;
  const statusLabel = CaseManager.STATUS_STAGES[status]?.stage || status;
  
  // Update modal title
  document.getElementById('modal-title').textContent = `Cases - ${statusLabel}`;
  
  // Get all cases for this status
  currentCaseFilter = caseManager.getCasesByStatus(status);
  
  // Populate table
  populateCaseTable(currentCaseFilter);
  
  // Show modals
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('case-list-modal').style.display = 'block';
  
  // Clear search
  document.getElementById('case-search').value = '';
}

/**
 * Populate case table with data
 */
function populateCaseTable(cases) {
  const tableBody = document.getElementById('case-table-body');
  const noMsg = document.getElementById('no-cases-msg');
  const table = document.getElementById('case-table');
  
  if (!cases || cases.length === 0) {
    tableBody.innerHTML = '';
    table.style.display = 'none';
    noMsg.style.display = 'block';
    return;
  }
  
  table.style.display = 'table';
  noMsg.style.display = 'none';
  
  tableBody.innerHTML = cases.map((caseObj, idx) => {
    const customer = caseManager.findCustomer(caseObj.rim);
    const riskColor = caseObj.risk_level === 'HIGH' ? '#FF5252' : caseObj.risk_level === 'MEDIUM' ? '#FFA726' : '#00E676';
    const customerInitials = (caseObj.customer_name || 'N/A').split(' ').map((n, i) => i < 2 ? n[0] : '').join('');
    
    return `
      <tr style="${idx % 2 === 0 ? 'background: rgba(0,0,0,0.15);' : ''} border-bottom: 1px solid var(--glass-border);">
        <td style="padding: 12px;">
          <a href="#" onclick="openCaseDetail('${caseObj.case_id}'); return false;" style="color: var(--accent); text-decoration: none; font-weight: 600;">
            ${caseObj.case_id}
          </a>
        </td>
        <td style="padding: 12px;">
          <div style="font-weight: 600;">${customerInitials}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${caseObj.customer_name || 'Unknown'}</div>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="background: ${riskColor}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
            ${caseObj.risk_level}
          </span>
        </td>
        <td style="padding: 12px; text-align: center;">
          <span style="background: rgba(0, 212, 255, 0.1); color: var(--accent); padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">
            ${caseObj.sector}
          </span>
        </td>
        <td style="padding: 12px;">
          <span style="font-size: 12px;">${caseObj.assigned_user || 'Unassigned'}</span>
        </td>
        <td style="padding: 12px;">
          <span style="font-size: 12px; color: var(--text-muted);">${formatDate(caseObj.created_date)}</span>
        </td>
        <td style="padding: 12px; text-align: center;">
          <button onclick="openCaseDetail('${caseObj.case_id}')" 
            style="padding: 6px 12px; background: var(--accent); color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
            Open
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/**
 * Filter case table by search
 */
function filterCaseTable() {
  const searchTerm = document.getElementById('case-search').value.toLowerCase();
  
  if (!searchTerm) {
    populateCaseTable(currentCaseFilter);
    return;
  }
  
  const filtered = currentCaseFilter.filter(c =>
    c.case_id.toLowerCase().includes(searchTerm) ||
    c.customer_name.toLowerCase().includes(searchTerm) ||
    c.rim.toLowerCase().includes(searchTerm)
  );
  
  populateCaseTable(filtered);
}

/**
 * Close case list modal
 */
function closeCaseListModal() {
  closeAllModals();
}

/**
 * Open create case modal
 */
function openCreateCaseModal() {
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('create-case-modal').style.display = 'block';
  document.getElementById('create-case-form').reset();
}

/**
 * Close create case modal
 */
function closeCreateCaseModal() {
  closeAllModals();
}

/**
 * Close all modals
 */
function closeAllModals() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('case-list-modal').style.display = 'none';
  document.getElementById('create-case-modal').style.display = 'none';
}

/**
 * Submit create case form
 */
function submitCreateCaseForm() {
  if (!caseManager) return;

  const rim = document.getElementById('new-case-rim').value.trim();
  const sector = document.getElementById('new-case-sector').value;
  const risk = document.getElementById('new-case-risk').value;
  const notes = document.getElementById('new-case-notes').value.trim();

  if (!rim || !sector || !risk) {
    alert('Please fill in all required fields');
    return;
  }

  try {
    const newCase = caseManager.addCase({
      customer_id: rim,
      rim: rim,
      sector: sector,
      risk_level: risk,
      case_status: 'PENDING_CDD',
      case_notes: notes
    });

    closeAllModals();
    alert(`Case ${newCase.case_id} created successfully!`);
    
    // Reload view
    loadCDDCases();
    
  } catch (error) {
    alert('Error creating case: ' + error.message);
  }
}

/**
 * Open case detail page
 */
function openCaseDetail(caseId) {
  window.location.href = `/edd_system/edd_case.html?case_id=${caseId}`;
}

/**
 * Load activity timeline
 */
function loadActivityTimeline() {
  const timeline = document.getElementById('activity-timeline');
  if (!timeline) return;

  const activities = [
    { action: 'Case EDD-2026-002145 approved by Checker', user: 'Ahmed Hassan', time: '10 minutes ago', type: 'success' },
    { action: 'Case EDD-2026-002144 submitted for Checker approval', user: 'Fatima Al-Mansoor', time: '25 minutes ago', type: 'info' },
    { action: 'Case EDD-2026-002143 escalated to Compliance', user: 'Mohammed Al-Suwaidi', time: '1 hour ago', type: 'warning' },
    { action: 'Case EDD-2026-002142 returned to Business with comments', user: 'Sara Al-Khalifa', time: '2 hours ago', type: 'info' },
    { action: 'Case EDD-2026-002141 received from Business', user: 'System', time: '3 hours ago', type: 'info' },
  ];

  timeline.innerHTML = activities.map((a, i) => `
    <div class="timeline-item ${i === 0 ? 'active' : ''}" style="display: flex; gap: 12px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--glass-border);">
      <div class="timeline-marker ${a.type}" style="width: 12px; height: 12px; border-radius: 50%; margin-top: 4px; background-color: ${
        a.type === 'success' ? '#00E676' : 
        a.type === 'warning' ? '#FFA726' : 
        'var(--accent)'
      };"></div>
      <div class="timeline-content">
        <h4 style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">${a.action}</h4>
        <p style="font-size: 12px; color: var(--text-muted);">${a.user} • ${a.time}</p>
      </div>
    </div>
  `).join('');
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' });
}

/**
 * Add modal styles to page
 */
function addModalStyles() {
  const styles = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 999;
    }
    
    .modal-content {
      background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(30, 30, 45, 0.95));
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 12px;
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
      z-index: 1001;
      max-height: 90vh;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
    
    .modal-header {
      padding: 24px;
      border-bottom: 1px solid rgba(0, 212, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      color: var(--text-primary);
    }
    
    .modal-close {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .modal-close:hover {
      background: rgba(0, 212, 255, 0.1);
      border-color: var(--accent);
    }
    
    .modal-body {
      padding: 24px;
      flex: 1;
      overflow-y: auto;
    }
    
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(0, 212, 255, 0.1);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

/**
 * Add sector badge styles
 */
function addSectorBadgeStyles() {
  const styles = `
    .sector-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: rgba(0, 212, 255, 0.1);
      color: var(--accent);
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    
    .risk-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }
    
    .risk-badge.high {
      background: #FF5252;
    }
    
    .risk-badge.medium {
      background: #FFA726;
    }
    
    .risk-badge.low {
      background: #00E676;
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
