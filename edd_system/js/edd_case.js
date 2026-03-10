// EDD Case Controller

// Global variable to store current customer RIM for network graph
let currentCustomerRim = null;
let caseManager = null;

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

  // Initialize case manager if available
  if (typeof CaseManager !== 'undefined' && !window.caseManager) {
    window.caseManager = new CaseManager();
  }
  caseManager = window.caseManager;

  // Get case ID from URL - support both 'id' and 'case_id' parameters
  const urlParams = new URLSearchParams(window.location.search);
  const caseId = urlParams.get('case_id') || urlParams.get('id') || 'EDD-2024-001234';

  // Load case data
  loadCase(caseId);

  // Tab handling
  setupTabs();

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    sessionStorage.removeItem('edd_user');
    window.location.replace('/edd_system/login.html');
  });
});

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// Show Customer Risk Network Graph
function showNetworkGraph() {
  if (currentCustomerRim && typeof EnterpriseUI !== 'undefined') {
    EnterpriseUI.showNetworkGraphModal(currentCustomerRim);
  } else {
    alert('Customer data not loaded. Please wait for the case to load.');
  }
}

// Show Export Reports Modal
function showExportModal() {
  const caseId = document.getElementById('case-id').textContent || 'EDD-2024-001234';
  if (currentCustomerRim && typeof ExportReports !== 'undefined') {
    ExportReports.showExportModal(caseId, currentCustomerRim);
  } else {
    alert('Case data not loaded. Please wait for the case to load.');
  }
}

function loadCase(caseId) {
  // First try to load from case manager (new CDD case format)
  let eddCase = null;
  let customer = null;

  if (caseManager) {
    eddCase = caseManager.getCaseById(caseId);
    if (eddCase) {
      customer = caseManager.findCustomer(eddCase.rim);
    }
  }

  // Fallback to old MockData format if not found in case manager
  if (!eddCase) {
    eddCase = MockData.eddCases.find(c => c.caseId === caseId) || MockData.eddCases[0];
    customer = MockData.customers.find(c => c.rim === eddCase.rim);
  }

  if (!eddCase || !customer) return;

  // Store current RIM for network graph
  currentCustomerRim = customer.rim;

  // Update header - Handle both case formats
  document.getElementById('case-id').textContent = eddCase.case_id || eddCase.caseId;
  document.getElementById('customer-name').textContent = customer.name;
  document.getElementById('rim-number').textContent = customer.rim;
  document.getElementById('segment').textContent = customer.segment || 'Private Banking';
  document.getElementById('trigger-source').textContent = eddCase.triggerSource || 'T24/CRP';
  document.getElementById('created-date').textContent = formatDate(eddCase.created_date || eddCase.createdDate);

  // Risk badge
  const riskBadge = document.getElementById('risk-badge');
  const riskLevel = eddCase.risk_level || customer.riskClassification || 'HIGH';
  riskBadge.textContent = riskLevel.toUpperCase() + ' RISK';
  riskBadge.className = 'risk-badge ' + riskLevel.toLowerCase();

  // Status badge
  const statusBadge = document.getElementById('status-badge');
  const status = eddCase.case_status || eddCase.status || 'PENDING_CDD';
  statusBadge.textContent = formatStatus(status);
  statusBadge.className = 'status-badge ' + getStatusClass(status);

  // Triggers
  const triggersList = document.getElementById('triggers-list');
  const triggers = eddCase.triggers || [];
  triggersList.innerHTML = triggers.map(t => 
    `<span class="status-badge escalated">${t}</span>`
  ).join('');

  // Update workflow steps
  updateWorkflow(status);

  // Update Risk Analysis Panel (ETL/SnapView data)
  if (typeof RiskEngine !== 'undefined' && customer.riskScores) {
    RiskEngine.updateRiskPanel(customer);
  }

  // Update Joint Account Exposure Panel (T24/SnapView data)
  if (typeof JointAccountsModule !== 'undefined') {
    JointAccountsModule.updateJointExposurePanel(customer.rim);
  }

  // Update Transaction Activity Panel (T24/TM data)
  if (typeof TransactionActivityModule !== 'undefined') {
    TransactionActivityModule.updateTransactionPanel(customer.rim);
  }

  // Update Enterprise Features (Financial Profile, Expected Activity)
  if (typeof EnterpriseUI !== 'undefined') {
    EnterpriseUI.init(customer.rim);
    
    // Check for expected activity deviation
    const activity = EnterpriseFeatures.getExpectedActivity(customer.rim);
    if (activity && activity.DEVIATION_FLAG) {
      const badge = document.getElementById('deviationBadge');
      if (badge) badge.style.display = 'inline-block';
    }
  }

  // Load documents
  loadDocuments(eddCase.caseId);

  // Load comments and history
  loadComments(eddCase);
  loadTimeline(eddCase);

  // Update QCB consent
  document.getElementById('qcb-consent').textContent = 
    'Consent: ' + (customer.consentQCB ? 'Yes' : 'No');

  // Update document count
  const caseDocs = MockData.documents.filter(d => d.caseId === eddCase.caseId);
  document.getElementById('doc-count').textContent = caseDocs.length + ' documents available';
}

function updateWorkflow(status) {
  const steps = document.querySelectorAll('.workflow-step');
  const statusOrder = ['pending_business', 'business_review', 'pending_business_approval', 'pending_cdd', 'pending_cdd_approval', 'pending_compliance', 'completed'];
  const currentIndex = statusOrder.indexOf(status);

  steps.forEach((step, index) => {
    step.classList.remove('completed', 'active');
    if (index < Math.floor(currentIndex / 1.2)) {
      step.classList.add('completed');
    } else if (index === Math.floor(currentIndex / 1.2)) {
      step.classList.add('active');
    }
  });
}

function loadDocuments(caseId) {
  // Find case to get document IDs
  const eddCase = MockData.eddCases.find(c => c.caseId === caseId);
  if (!eddCase || !eddCase.documents) return;

  // Get documents by IDs from case
  const documents = eddCase.documents.map(docId => MockData.documents[docId]).filter(d => d);
  const grid = document.getElementById('document-grid');

  const docTypeIcons = {
    'Passport': '🛂',
    'National ID': '🪪',
    'Bank Statement': '🏦',
    'Salary Certificate': '💰',
    'Employment Letter': '💼',
    'Trade License': '📋',
    'Company Registration': '🏢',
    'Residence Permit': '📄',
    'Inheritance Certificate': '📜',
    'Property Deed': '🏠',
    'POA Document': '📝',
    'Retirement Letter': '📨',
    'Investment Statement': '📊'
  };

  grid.innerHTML = documents.map(doc => `
    <div class="document-card" onclick="viewDocument('${doc.id}')">
      <div class="document-icon">${docTypeIcons[doc.type] || '📄'}</div>
      <div class="document-info">
        <h4>${doc.type}</h4>
        <p>${doc.filename} • ${doc.source}</p>
        <span class="document-date">Uploaded: ${formatDate(doc.uploadDate)}</span>
        <span class="document-status ${doc.status === 'Valid' ? 'verified' : 'pending'}">${doc.status}</span>
      </div>
    </div>
  `).join('');
}

function loadComments(eddCase) {
  const section = document.getElementById('comments-section');
  // Mock comments based on case status
  const comments = [
    {
      author: 'Fatima Al-Thani',
      role: 'Business RM',
      date: eddCase.createdDate,
      text: 'Initial EDD case created for annual review. Customer is a high-value Private Banking client with PEP status.'
    },
    {
      author: 'System',
      role: 'Automated',
      date: eddCase.createdDate,
      text: 'Customer data refreshed from T24 Core Banking. QCB KYC data retrieved successfully.'
    }
  ];

  section.innerHTML = comments.map(c => `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-author">${c.author}</span>
        <span class="comment-role">${c.role}</span>
        <span class="comment-date">${formatDate(c.date)}</span>
      </div>
      <div class="comment-text">${c.text}</div>
    </div>
  `).join('');
}

function loadTimeline(eddCase) {
  const timeline = document.getElementById('case-timeline');
  
  const events = [
    { action: 'Case Created', time: eddCase.created_date, user: 'System', icon: 'create' },
    { action: 'Customer data retrieved from T24', time: eddCase.created_date, user: 'System', icon: 'sync' },
    { action: 'QCB KYC data fetched', time: eddCase.created_date, user: 'System', icon: 'api' },
    { action: 'Documents uploaded', time: eddCase.created_date, user: 'System', icon: 'doc' },
    { action: 'Assigned to Business Review', time: eddCase.created_date, user: 'System', icon: 'assign' }
  ];

  timeline.innerHTML = events.map((e, i) => `
    <div class="timeline-item ${i === events.length - 1 ? 'active' : ''}">
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <h4>${e.action}</h4>
        <p>${e.user} • ${formatDateTime(e.time)}</p>
      </div>
    </div>
  `).join('');
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked tab
      tab.classList.add('active');
      
      // Hide all content
      contents.forEach(c => {
        c.classList.add('hidden');
        c.style.display = 'none';
      });
      
      // Show target content
      const targetId = 'tab-' + tab.dataset.tab;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.style.display = 'block';
      }
    });
  });
}

function viewDocument(docId) {
  window.location.href = `/edd_system/document_viewer.html?id=${docId}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
         ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatStatus(status) {
  const statusMap = {
    'pending_business': 'Pending Business',
    'business_review': 'Business Review',
    'pending_business_approval': 'Pending Approval',
    'pending_cdd': 'Pending CDD',
    'pending_cdd_approval': 'CDD Approval',
    'pending_compliance': 'Compliance Review',
    'escalated': 'Escalated',
    'completed': 'Completed'
  };
  return statusMap[status] || status;
}

function getStatusClass(status) {
  if (status.includes('completed')) return 'completed';
  if (status.includes('escalated')) return 'escalated';
  if (status.includes('pending')) return 'pending';
  return 'in-progress';
}

function formatDocType(type) {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

// Add styles for components
const styles = `
  .hidden { display: none !important; }
  
  .tabs {
    display: flex;
    gap: 8px;
    background: var(--glass-bg);
    padding: 8px;
    border-radius: 12px;
    border: 1px solid var(--glass-border);
  }
  
  .tab {
    padding: 10px 20px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
  }
  
  .tab:hover {
    background: rgba(255,255,255,0.05);
    color: var(--text-primary);
  }
  
  .tab.active {
    background: var(--accent);
    color: var(--bg-primary);
  }
  
  .tab-content {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .document-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
  
  .document-card {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: rgba(0,0,0,0.2);
    border-radius: 12px;
    border: 1px solid var(--glass-border);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .document-card:hover {
    background: rgba(0,212,255,0.05);
    border-color: var(--accent);
    transform: translateY(-2px);
  }
  
  .document-icon {
    font-size: 32px;
    line-height: 1;
  }
  
  .document-info h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-primary);
  }
  
  .document-info p {
    font-size: 12px;
    color: var(--text-muted);
  }
  
  .document-date {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 8px;
  }
  
  .document-status {
    display: inline-block;
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 4px;
    margin-top: 4px;
  }
  
  .document-status.verified {
    background: rgba(0, 230, 118, 0.2);
    color: #00E676;
  }
  
  .document-status.pending {
    background: rgba(255, 167, 38, 0.2);
    color: #FFA726;
  }
  
  .comment {
    padding: 16px;
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  .comment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .comment-author {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .comment-role {
    font-size: 11px;
    color: var(--accent);
    background: rgba(0,212,255,0.1);
    padding: 2px 8px;
    border-radius: 4px;
  }
  
  .comment-date {
    font-size: 11px;
    color: var(--text-muted);
    margin-left: auto;
  }
  
  .comment-text {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
