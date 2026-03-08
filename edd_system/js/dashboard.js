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
    window.location.replace('login.html');
  });

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
      <tr onclick="window.location.href='edd_case.html?id=${c.caseId}'" style="cursor: pointer;">
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
