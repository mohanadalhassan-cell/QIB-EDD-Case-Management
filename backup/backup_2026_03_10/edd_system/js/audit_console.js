// Audit Console Controller
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

  // Load audit log
  loadAuditLog();
  loadLiveFeed();

  // Setup filters
  setupFilters();

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = 'login.html';
  });
});

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function loadAuditLog() {
  const tbody = document.getElementById('audit-tbody');
  
  // Generate mock audit entries
  const auditEntries = [
    { timestamp: '2024-02-20 14:32:15', user: 'Fatima Al-Thani', department: 'Business', action: 'approve', case_id: 'EDD-2024-001234', details: 'Business maker approval submitted', ip: '10.0.1.45' },
    { timestamp: '2024-02-20 14:28:42', user: 'Hassan Al-Naimi', department: 'CDD', action: 'update', case_id: 'EDD-2024-001235', details: 'Updated source of income fields', ip: '10.0.1.67' },
    { timestamp: '2024-02-20 14:15:08', user: 'System', department: 'IT', action: 'create', case_id: 'EDD-2024-001240', details: 'Auto-triggered EDD case from T24 CRP', ip: 'System' },
    { timestamp: '2024-02-20 14:10:33', user: 'Maryam Al-Sulaiti', department: 'CDD', action: 'approve', case_id: 'EDD-2024-001233', details: 'CDD checker approval - case completed', ip: '10.0.1.89' },
    { timestamp: '2024-02-20 13:55:21', user: 'Ahmed Al-Mansouri', department: 'Compliance', action: 'escalate', case_id: 'EDD-2024-001236', details: 'Escalated to Compliance - PEP high risk', ip: '10.0.1.102' },
    { timestamp: '2024-02-20 13:45:18', user: 'Fatima Al-Thani', department: 'Business', action: 'update', case_id: 'EDD-2024-001234', details: 'Added business recommendation comments', ip: '10.0.1.45' },
    { timestamp: '2024-02-20 13:30:00', user: 'Khalid Al-Mohannadi', department: 'Business', action: 'login', case_id: '—', details: 'User login successful', ip: '10.0.1.156' },
    { timestamp: '2024-02-20 13:22:45', user: 'Hassan Al-Naimi', department: 'CDD', action: 'reject', case_id: 'EDD-2024-001232', details: 'Returned to Business - missing documents', ip: '10.0.1.67' },
    { timestamp: '2024-02-20 13:15:12', user: 'System', department: 'IT', action: 'create', case_id: 'EDD-2024-001239', details: 'Auto-triggered EDD case - Annual Review', ip: 'System' },
    { timestamp: '2024-02-20 13:00:00', user: 'Maryam Al-Sulaiti', department: 'CDD', action: 'update', case_id: 'EDD-2024-001238', details: 'Verified source of wealth documentation', ip: '10.0.1.89' },
  ];

  tbody.innerHTML = auditEntries.map(entry => `
    <tr>
      <td style="font-family: 'SF Mono', monospace; font-size: 11px; color: var(--text-muted);">${entry.timestamp}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="mini-avatar">${getInitials(entry.user)}</div>
          ${entry.user}
        </div>
      </td>
      <td>
        <span class="dept-badge ${entry.department.toLowerCase()}">${entry.department}</span>
      </td>
      <td>
        <span class="action-badge ${entry.action}">${entry.action.toUpperCase()}</span>
      </td>
      <td>
        ${entry.case_id !== '—' ? `<a href="edd_case.html?id=${entry.case_id}" style="color: var(--accent);">${entry.case_id}</a>` : '—'}
      </td>
      <td style="font-size: 12px; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${entry.details}</td>
      <td style="font-family: 'SF Mono', monospace; font-size: 11px; color: var(--text-muted);">${entry.ip}</td>
    </tr>
  `).join('');
}

function loadLiveFeed() {
  const feed = document.getElementById('live-feed');
  
  const liveEvents = [
    { time: 'Just now', user: 'Fatima Al-Thani', action: 'submitted approval for EDD-2024-001234' },
    { time: '2 min ago', user: 'Hassan Al-Naimi', action: 'updated EDD-2024-001235' },
    { time: '5 min ago', user: 'System', action: 'created new case EDD-2024-001240' },
    { time: '8 min ago', user: 'Maryam Al-Sulaiti', action: 'completed case EDD-2024-001233' },
  ];

  feed.innerHTML = liveEvents.map((e, i) => `
    <div class="live-event ${i === 0 ? 'new' : ''}">
      <span class="live-time">${e.time}</span>
      <span class="live-user">${e.user}</span>
      <span class="live-action">${e.action}</span>
    </div>
  `).join('');
}

function setupFilters() {
  // Add filter event listeners
  const elements = ['search-input', 'filter-action', 'filter-department', 'filter-date-from', 'filter-date-to'];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', applyFilters);
      el.addEventListener('input', applyFilters);
    }
  });
}

function applyFilters() {
  // Demo only - would filter the table
  console.log('Filters applied');
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-action').value = 'all';
  document.getElementById('filter-department').value = 'all';
  document.getElementById('filter-date-from').value = '';
  document.getElementById('filter-date-to').value = '';
  loadAuditLog();
}

function refreshLogs() {
  loadAuditLog();
  loadLiveFeed();
}

function exportAuditLog() {
  alert('Export Audit Log - Feature demo only');
}

// Add styles
const styles = `
  .read-only-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(255, 167, 38, 0.1);
    border: 1px solid rgba(255, 167, 38, 0.3);
    border-radius: 6px;
    font-size: 12px;
    color: #FFA726;
  }
  
  .mini-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--accent-glow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 600;
  }
  
  .dept-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .dept-badge.business {
    background: rgba(33, 150, 243, 0.2);
    color: #64B5F6;
  }
  
  .dept-badge.cdd {
    background: rgba(255, 152, 0, 0.2);
    color: #FFB74D;
  }
  
  .dept-badge.compliance {
    background: rgba(156, 39, 176, 0.2);
    color: #CE93D8;
  }
  
  .dept-badge.it {
    background: rgba(0, 212, 255, 0.2);
    color: var(--accent);
  }
  
  .action-badge {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
  }
  
  .action-badge.create {
    background: rgba(0, 230, 118, 0.2);
    color: #00E676;
  }
  
  .action-badge.update {
    background: rgba(0, 212, 255, 0.2);
    color: var(--accent);
  }
  
  .action-badge.approve {
    background: rgba(0, 230, 118, 0.2);
    color: #00E676;
  }
  
  .action-badge.reject {
    background: rgba(255, 82, 82, 0.2);
    color: #FF5252;
  }
  
  .action-badge.escalate {
    background: rgba(255, 167, 38, 0.2);
    color: #FFA726;
  }
  
  .action-badge.login {
    background: rgba(158, 158, 158, 0.2);
    color: #9E9E9E;
  }
  
  .page-indicator {
    font-size: 12px;
    color: var(--text-muted);
    padding: 8px 16px;
  }
  
  .live-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: #00E676;
    border-radius: 50%;
    margin-right: 8px;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  .live-feed {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .live-event {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    font-size: 13px;
    transition: all 0.3s ease;
  }
  
  .live-event.new {
    background: rgba(0, 212, 255, 0.1);
    border: 1px solid rgba(0, 212, 255, 0.3);
  }
  
  .live-time {
    color: var(--text-muted);
    font-size: 11px;
    min-width: 80px;
  }
  
  .live-user {
    color: var(--accent);
    font-weight: 500;
  }
  
  .live-action {
    color: var(--text-secondary);
  }
  
  .audit-table tbody tr:hover {
    background: rgba(0, 212, 255, 0.03);
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
