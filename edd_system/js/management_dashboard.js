// Management Dashboard Controller
document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const session = JSON.parse(sessionStorage.getItem('edd_session') || '{}');
  if (!session.authenticated) {
    window.location.href = 'login.html';
    return;
  }

  // Update user info
  document.getElementById('user-name').textContent = session.user?.name || 'User';
  document.getElementById('user-role').textContent = session.user?.role || 'Role';
  document.getElementById('user-avatar').textContent = getInitials(session.user?.name || 'User');

  // Load data
  loadRecentCompletions();

  // Period selector
  document.getElementById('period-selector').addEventListener('change', function(e) {
    // Refresh data based on period (demo only refreshes UI)
    console.log('Period changed to:', e.target.value);
  });

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = 'login.html';
  });
});

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function loadRecentCompletions() {
  const completed = MockData.eddCases.filter(c => c.status === 'completed').slice(0, 5);
  const tbody = document.getElementById('completions-tbody');

  tbody.innerHTML = completed.map(c => {
    const customer = MockData.customers.find(cust => cust.rim === c.rim) || {};
    return `
      <tr onclick="openCase('${c.id}')" style="cursor: pointer;">
        <td><span style="color: var(--accent); font-weight: 600;">${c.id}</span></td>
        <td>${customer.name || 'Unknown'}</td>
        <td><span class="risk-indicator ${customer.risk_level || 'medium'}"><span class="dot"></span>${(customer.risk_level || 'medium').toUpperCase()}</span></td>
        <td>${customer.segment || 'N/A'}</td>
        <td style="font-size: 12px; color: var(--text-muted);">${formatDate(c.completed_date || c.created_date)}</td>
        <td style="color: var(--text-secondary);">2.3 days</td>
      </tr>
    `;
  }).join('');
}

function openCase(caseId) {
  window.location.href = `edd_case.html?id=${caseId}`;
}

function exportReport() {
  alert('Export Management Report - Feature demo only');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Add styles
const styles = `
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
  
  @media (max-width: 1200px) {
    .kpi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .kpi-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(20px);
  }
  
  .kpi-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(0, 212, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    margin-bottom: 16px;
  }
  
  .kpi-icon.success {
    background: rgba(0, 230, 118, 0.1);
    color: #00E676;
  }
  
  .kpi-icon.warning {
    background: rgba(255, 167, 38, 0.1);
    color: #FFA726;
  }
  
  .kpi-icon.danger {
    background: rgba(255, 82, 82, 0.1);
    color: #FF5252;
  }
  
  .kpi-value {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 4px;
  }
  
  .kpi-label {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }
  
  .kpi-trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--glass-border);
  }
  
  .kpi-trend.up {
    color: #00E676;
  }
  
  .kpi-trend.down {
    color: #FF5252;
  }
  
  .kpi-trend.neutral {
    color: var(--text-muted);
  }
  
  .chart-container {
    min-height: 200px;
  }
  
  .bar-chart {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .bar-item {
    display: grid;
    grid-template-columns: 40px 1fr 50px;
    align-items: center;
    gap: 12px;
  }
  
  .bar-label {
    font-size: 12px;
    color: var(--text-muted);
  }
  
  .bar-track {
    height: 24px;
    background: rgba(255,255,255,0.05);
    border-radius: 6px;
    overflow: hidden;
  }
  
  .bar-fill {
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 212, 255, 0.3), rgba(0, 212, 255, 0.6));
    border-radius: 6px;
    transition: width 0.5s ease;
  }
  
  .bar-fill.accent {
    background: linear-gradient(90deg, var(--accent), #00E5FF);
  }
  
  .bar-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    text-align: right;
  }
  
  .bar-item.current .bar-label {
    color: var(--accent);
    font-weight: 600;
  }
  
  .donut-chart {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }
  
  .donut-ring {
    position: relative;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: conic-gradient(
      #FF5252 0deg 126deg,
      #FFA726 126deg 288deg,
      #00E676 288deg 360deg
    );
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .donut-center {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: var(--bg-secondary);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .donut-total {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
  }
  
  .donut-label {
    font-size: 11px;
    color: var(--text-muted);
  }
  
  .legend {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }
  
  .legend-color.high { background: #FF5252; }
  .legend-color.medium { background: #FFA726; }
  .legend-color.low { background: #00E676; }
  
  .legend-label {
    flex: 1;
    font-size: 13px;
    color: var(--text-secondary);
  }
  
  .legend-value {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .progress-bar {
    width: 100px;
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 3px;
    overflow: hidden;
    display: inline-block;
    margin-right: 8px;
  }
  
  .progress-fill {
    height: 100%;
    background: #00E676;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-fill.warning {
    background: #FFA726;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
