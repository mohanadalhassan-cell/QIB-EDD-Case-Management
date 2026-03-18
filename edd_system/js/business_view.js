// Business View Controller
document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const sessionRaw = sessionStorage.getItem('edd_session');
  console.log('Business View - raw session:', sessionRaw);
  const session = JSON.parse(sessionRaw || '{}');
  console.log('Business View - parsed session:', session);
  if (!session.authenticated) {
    console.log('No authenticated flag, redirecting to login');
    window.location.replace('/edd_system/login.html');
    return;
  }
  console.log('Session valid, loading dashboard');

  // Update user info
  document.getElementById('user-name').textContent = session.user?.name || 'User';
  document.getElementById('user-role').textContent = session.user?.role || 'Role';
  document.getElementById('user-avatar').textContent = getInitials(session.user?.name || 'User');

  // Load cases
  loadBusinessCases();

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

let allCases = [];

function loadBusinessCases() {
  // Get cases that are in business stage
  const businessStatuses = ['pending_business', 'business_review', 'pending_business_approval'];
  allCases = MockData.eddCases.filter(c => businessStatuses.includes(c.status));

  // Update stats
  document.getElementById('pending-count').textContent = 
    allCases.filter(c => c.status === 'pending_business').length;
  document.getElementById('review-count').textContent = 
    allCases.filter(c => c.status === 'business_review').length;
  document.getElementById('approval-count').textContent = 
    allCases.filter(c => c.status === 'pending_business_approval').length;
  document.getElementById('completed-count').textContent = 
    MockData.eddCases.filter(c => c.status === 'completed').length;

  renderCases(allCases);
}

function renderCases(cases) {
  const tbody = document.getElementById('cases-tbody');
  
  document.getElementById('shown-count').textContent = cases.length;
  document.getElementById('total-count').textContent = allCases.length;

  if (cases.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No cases found matching your criteria
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = cases.map(eddCase => {
    const customer = MockData.customers.find(c => c.rim === eddCase.rim) || {};
    const daysOpen = Math.floor((new Date() - new Date(eddCase.created_date)) / (1000 * 60 * 60 * 24));
    
    return `
      <tr onclick="openCase('${eddCase.id}')" style="cursor: pointer;">
        <td>
          <span style="color: var(--accent); font-weight: 600;">${eddCase.id}</span>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--accent-glow); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;">
              ${getInitials(customer.name || 'Unknown')}
            </div>
            <div>
              <div style="font-weight: 500;">${customer.name || 'Unknown'}</div>
              <div style="font-size: 11px; color: var(--text-muted);">${customer.nationality || ''}</div>
            </div>
          </div>
        </td>
        <td>${eddCase.rim}</td>
        <td>
          <span class="segment-badge ${(customer.segment || '').toLowerCase().replace(' ', '-')}">
            ${customer.segment || 'N/A'}
          </span>
        </td>
        <td>
          <span class="risk-indicator ${customer.risk_level || 'medium'}">
            <span class="dot"></span>
            ${(customer.risk_level || 'medium').toUpperCase()}
          </span>
        </td>
        <td>
          <span style="font-size: 12px;">${eddCase.trigger_source}</span>
        </td>
        <td>
          <span class="status-badge ${getStatusClass(eddCase.status)}">
            ${formatStatus(eddCase.status)}
          </span>
        </td>
        <td style="font-size: 12px; color: var(--text-muted);">${formatDate(eddCase.created_date)}</td>
        <td>
          <span class="${daysOpen > 7 ? 'text-danger' : daysOpen > 3 ? 'text-warning' : ''}" style="font-weight: 500;">
            ${daysOpen}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openCase('${eddCase.id}')">
              Review
            </button>
            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); assignCase('${eddCase.id}')" title="Assign">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const statusFilter = document.getElementById('filter-status');
  const riskFilter = document.getElementById('filter-risk');
  const segmentFilter = document.getElementById('filter-segment');

  const applyFilters = () => {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const risk = riskFilter.value;
    const segment = segmentFilter.value;

    let filtered = allCases;

    if (search) {
      filtered = filtered.filter(c => {
        const customer = MockData.customers.find(cust => cust.rim === c.rim) || {};
        return c.id.toLowerCase().includes(search) ||
               c.rim.toLowerCase().includes(search) ||
               (customer.name || '').toLowerCase().includes(search);
      });
    }

    if (status !== 'all') {
      filtered = filtered.filter(c => c.status === status);
    }

    if (risk !== 'all') {
      filtered = filtered.filter(c => {
        const customer = MockData.customers.find(cust => cust.rim === c.rim) || {};
        return customer.risk_level === risk;
      });
    }

    if (segment !== 'all') {
      filtered = filtered.filter(c => {
        const customer = MockData.customers.find(cust => cust.rim === c.rim) || {};
        return customer.segment === segment;
      });
    }

    renderCases(filtered);
  };

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  riskFilter.addEventListener('change', applyFilters);
  segmentFilter.addEventListener('change', applyFilters);
}

function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-status').value = 'all';
  document.getElementById('filter-risk').value = 'all';
  document.getElementById('filter-segment').value = 'all';
  renderCases(allCases);
}

function openCase(caseId) {
  window.location.href = `/edd_system/edd_case.html?id=${caseId}`;
}

function assignCase(caseId) {
  alert(`Assign case ${caseId} - Feature demo only`);
}

function exportCases() {
  alert('Export to Excel - Feature demo only');
}

function showAssignModal() {
  alert('Bulk assignment modal - Feature demo only');
}

function showStats() {
  alert('Team statistics - Feature demo only');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatStatus(status) {
  const statusMap = {
    'pending_business': 'Pending Review',
    'business_review': 'Under Review',
    'pending_business_approval': 'Awaiting Approval',
    'pending_cdd': 'Pending CDD',
    'pending_cdd_approval': 'CDD Approval',
    'pending_compliance': 'Compliance',
    'escalated': 'Escalated',
    'completed': 'Completed'
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  if (status.includes('completed')) return 'completed';
  if (status.includes('escalated')) return 'escalated';
  if (status.includes('approval')) return 'pending';
  if (status.includes('review')) return 'in-progress';
  return 'pending';
}

// Add component styles
const styles = `
  .text-danger { color: #FF5252; }
  .text-warning { color: #FFA726; }
  
  .segment-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    background: rgba(255,255,255,0.1);
    color: var(--text-secondary);
  }
  
  .segment-badge.private-banking {
    background: rgba(156, 39, 176, 0.2);
    color: #CE93D8;
  }
  
  .segment-badge.personal-banking {
    background: rgba(33, 150, 243, 0.2);
    color: #64B5F6;
  }
  
  .segment-badge.sme-banking {
    background: rgba(255, 152, 0, 0.2);
    color: #FFB74D;
  }
  
  .segment-badge.corporate {
    background: rgba(76, 175, 80, 0.2);
    color: #81C784;
  }
  
  .action-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
  }
  
  .action-card:hover {
    background: rgba(0, 212, 255, 0.05);
    border-color: var(--accent);
    transform: translateY(-2px);
  }
  
  .action-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 12px;
  }
  
  .action-text h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
    color: var(--text-primary);
  }
  
  .action-text p {
    font-size: 12px;
    color: var(--text-muted);
    margin: 0;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
