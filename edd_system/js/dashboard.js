/**
 * QIB EDD System — Dashboard Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Check session - use edd_session with authenticated flag
  const sessionData = sessionStorage.getItem('edd_session');
  if (!sessionData) {
    window.location.replace('login.html');
    return;
  }

  let session;
  try {
    session = JSON.parse(sessionData);
    if (!session.authenticated || !session.user) {
      window.location.replace('login.html');
      return;
    }
  } catch (e) {
    window.location.replace('login.html');
    return;
  }

  const currentUser = session.user;
  
  // Update user info in sidebar
  const userAvatar = document.getElementById('user-avatar');
  const userName = document.getElementById('user-name');
  const userRole = document.getElementById('user-role');
  
  if (userAvatar) userAvatar.textContent = getInitials(currentUser.name);
  if (userName) userName.textContent = currentUser.name;
  if (userRole) userRole.textContent = getRoleLabel(currentUser.role);

  // Logout handler
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('edd_session');
    sessionStorage.removeItem('edd_user');
    window.location.replace('/edd_system/login.html');
  });

  // ═══ NEW: APPLY ROLE-BASED FILTERING ═══
  applyRoleBasedFiltering(currentUser.role);

  // Load dashboard data
  loadDashboardStats();
  loadRecentCases();
  loadActivityTimeline();
});

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getRoleLabel(role) {
  const labels = {
    business: 'Business Department',
    cdd: 'CDD Operations',
    compliance: 'Compliance',
    management: 'Management',
    audit: 'Audit',
    it: 'IT Administration'
  };
  return labels[role] || role;
}

// ═══ NEW: ROLE-BASED FILTERING AND VIEW MANAGEMENT ═══
function applyRoleBasedFiltering(role) {
  'use strict';

  // Get page elements for role-based modification
  const pageTitle = document.querySelector('.page-title');
  const breadcrumb = document.querySelector('.breadcrumb');
  
  switch (role) {
    
    case 'business': {
      // EMPLOYEE/MAKER VIEW: Only assigned cases + submission capability
      if (pageTitle) pageTitle.textContent = 'My EDD Cases — Business Department';
      if (breadcrumb) breadcrumb.innerHTML = '<a href="dashboard.html">Dashboard</a> / <span>My Cases</span>';
      
      // Filter to show only "My Cases"
      const casesTable = document.getElementById('cases-table');
      if (casesTable) {
        const originalCases = casesTable.querySelectorAll('tr');
        originalCases.forEach(tr => {
          // Mark as "My Case" if applicable
          tr.classList.add('business-view');
        });
      }
      
      // Show "Submit for Review" action instead of generic "Review"
      document.body.classList.add('role-business');
      break;
    }
    
    case 'management': {
      // MANAGER VIEW: Full analytics + trend analysis (no case editing)
      if (pageTitle) pageTitle.textContent = 'Management Dashboard — EDD Analytics';
      if (breadcrumb) breadcrumb.innerHTML = '<a href="dashboard.html">Dashboard</a> / <span>Analytics</span>';
      
      // Hide case-level actions
      document.querySelectorAll('[onclick*="openCase"], [onclick*="editCase"]').forEach(btn => {
        btn.style.display = 'none';
      });
      
      // Show export button if it exists
      const exportBtn = document.createElement('button');
      exportBtn.className = 'btn btn-secondary btn-sm';
      exportBtn.innerHTML = '📊 Export to Excel';
      exportBtn.style.cssText = 'margin-left: 8px; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); color: #4CAF50; padding: 8px 14px; border-radius: 8px; cursor: pointer;';
      exportBtn.onclick = () => exportDashboardToExcel();
      const headerRight = document.querySelector('.header-right');
      if (headerRight) headerRight.appendChild(exportBtn);
      
      document.body.classList.add('role-management');
      break;
    }
    
    case 'audit': {
      // AUDITOR VIEW: Redirect to Audit Console
      window.location.href = 'audit_console.html';
      break;
    }
    
    case 'compliance': {
      // COMPLIANCE VIEW: Can see cases marked for compliance review
      window.location.href = 'compliance_view.html';
      break;
    }
    
    case 'it': {
      // ADMIN/IT VIEW: System administration
      window.location.href = 'admin_dashboard.html';
      break;
    }
    
    default: {
      // Unknown role: show basic dashboard
      console.warn('Unknown role:', role);
      document.body.classList.add('role-unknown');
    }
  }
}

// ═══ EXPORT TO EXCEL FUNCTION ═══
function exportDashboardToExcel() {
  const stats = EDDMockData.getStatistics();
  const csv = [
    ['EDD Dashboard Export — ' + new Date().toLocaleDateString()],
    [],
    ['Metric', 'Value'],
    ['Total EDD Cases', stats.totalCases],
    ['Pending Review', stats.inProgress],
    ['SLA Breached', stats.slaBreach],
    ['Completed', stats.completed],
    [],
    ['By Segment', 'Count'],
    ['Mass Banking', stats.bySegment.Mass],
    ['Tamayuz Banking', stats.bySegment.Tamayuz],
    ['Private Banking', stats.bySegment.Private]
  ];
  
  let csvContent = csv.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'EDD_Dashboard_' + new Date().toISOString().split('T')[0] + '.csv';
  link.click();
  URL.revokeObjectURL(url);
}


function loadDashboardStats() {
  const stats = EDDMockData.getStatistics();
  
  document.getElementById('stat-total').textContent = stats.totalCases;
  document.getElementById('stat-pending').textContent = stats.inProgress;
  document.getElementById('stat-sla').textContent = stats.slaBreach;
  document.getElementById('stat-completed').textContent = stats.completed;
  
  document.getElementById('seg-mass').textContent = stats.bySegment.Mass;
  document.getElementById('seg-tamayuz').textContent = stats.bySegment.Tamayuz;
  document.getElementById('seg-private').textContent = stats.bySegment.Private;
}

function loadRecentCases() {
  const tbody = document.getElementById('cases-table');
  if (!tbody) return;

  const cases = EDDMockData.cases.slice(0, 6);
  
  tbody.innerHTML = cases.map(c => {
    const customer = EDDMockData.getCustomerByRIM(c.rim);
    return `
      <tr onclick="window.location.href='/edd_system/edd_case.html?id=${c.caseId}'" style="cursor: pointer;">
        <td><strong style="color: var(--accent);">${c.caseId}</strong></td>
        <td>
          <div style="font-weight: 500;">${customer?.name || 'Unknown'}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${c.rim}</div>
        </td>
        <td><span class="status-badge ${c.assignedSegment.toLowerCase()}">${c.assignedSegment}</span></td>
        <td><span class="status-badge ${getStatusClass(c.status)}">${c.status}</span></td>
        <td><span class="risk-badge ${c.priority.toLowerCase()}">${c.priority}</span></td>
        <td>
          ${c.slaBreach 
            ? '<span style="color: var(--error); font-size: 12px;">⚠ Breached</span>' 
            : '<span style="color: var(--success); font-size: 12px;">✓ On Track</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusClass(status) {
  if (status === 'Completed') return 'completed';
  if (status.includes('Escalated')) return 'escalated';
  if (status.includes('Pending')) return 'pending';
  if (status.includes('Review')) return 'in-progress';
  return 'new';
}

function loadActivityTimeline() {
  const timeline = document.getElementById('activity-timeline');
  if (!timeline) return;

  const recentLogs = EDDMockData.auditLog.slice(-6).reverse();
  
  timeline.innerHTML = recentLogs.map(log => {
    const isSuccess = log.action.includes('Completed') || log.action.includes('Approval');
    const isWarning = log.action.includes('Escalated') || log.action.includes('Restricted');
    
    return `
      <div class="timeline-item ${isSuccess ? 'success' : ''} ${isWarning ? 'warning' : ''}">
        <div class="timeline-time">${formatDateTime(log.timestamp)}</div>
        <div class="timeline-title">${log.action}</div>
        <div class="timeline-desc">${log.details}</div>
        <div class="timeline-user">Case: ${log.caseId} • By: ${log.userId}</div>
      </div>
    `;
  }).join('');
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
