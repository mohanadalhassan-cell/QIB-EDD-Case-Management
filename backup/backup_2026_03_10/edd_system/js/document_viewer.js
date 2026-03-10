// Document Viewer Controller
let currentZoom = 100;
let currentDoc = null;

document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const session = JSON.parse(sessionStorage.getItem('edd_session') || '{}');
  if (!session.authenticated) {
    window.location.href = '/edd_system/login.html';
    return;
  }

  // Load documents
  loadDocuments();

  // Check for document ID in URL
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get('id');
  if (docId) {
    setTimeout(() => selectDocument(docId), 100);
  }

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = '/edd_system/login.html';
  });
});

function loadDocuments() {
  const docList = document.getElementById('doc-list');
  const documents = MockData.documents;

  const docTypeIcons = {
    'passport': '🛂',
    'qid': '🪪',
    'bank_statement': '🏦',
    'salary_certificate': '💰',
    'utility_bill': '📄',
    'trade_license': '📋'
  };

  docList.innerHTML = documents.map(doc => `
    <div class="doc-item ${doc.id === currentDoc?.id ? 'active' : ''}" onclick="selectDocument('${doc.id}')">
      <div class="doc-icon">${docTypeIcons[doc.type] || '📄'}</div>
      <div class="doc-item-info">
        <h4>${doc.name}</h4>
        <p>${formatDocType(doc.type)}</p>
        <span class="doc-status ${doc.verified ? 'verified' : 'pending'}">
          ${doc.verified ? '✓ Verified' : '○ Pending'}
        </span>
      </div>
    </div>
  `).join('');
}

function selectDocument(docId) {
  const doc = MockData.documents.find(d => d.id === docId);
  if (!doc) return;

  currentDoc = doc;

  // Update title
  document.getElementById('doc-title').textContent = doc.name;

  // Update document list selection
  document.querySelectorAll('.doc-item').forEach(item => {
    item.classList.remove('active');
  });
  event?.target?.closest('.doc-item')?.classList.add('active');

  // Show document preview (simulated)
  const preview = document.getElementById('doc-preview');
  preview.innerHTML = `
    <div class="simulated-document" style="transform: scale(${currentZoom / 100});">
      <div class="doc-header-bar">
        <span class="doc-type-badge">${formatDocType(doc.type)}</span>
        <span class="doc-source">${doc.source}</span>
      </div>
      <div class="doc-content">
        <div class="doc-watermark">QIB EDD SYSTEM</div>
        <h2>${doc.name}</h2>
        <div class="doc-image-placeholder">
          <svg viewBox="0 0 24 24" fill="currentColor" width="80" height="80" opacity="0.3">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
          <p>Document Preview</p>
          <span style="font-size: 12px; color: var(--text-muted);">(Simulated for demo)</span>
        </div>
        <div class="doc-metadata">
          <div class="meta-row">
            <span>Document ID:</span>
            <span>${doc.id}</span>
          </div>
          <div class="meta-row">
            <span>Case ID:</span>
            <span>${doc.case_id}</span>
          </div>
          <div class="meta-row">
            <span>Upload Date:</span>
            <span>${formatDate(doc.upload_date)}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Update info panel
  const infoPanel = document.getElementById('doc-info');
  infoPanel.innerHTML = `
    <div class="info-section">
      <h4>General</h4>
      <div class="info-row">
        <span class="info-label">Document ID</span>
        <span class="info-value">${doc.id}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type</span>
        <span class="info-value">${formatDocType(doc.type)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Source</span>
        <span class="info-value">${doc.source}</span>
      </div>
    </div>
    <div class="info-section">
      <h4>Case Information</h4>
      <div class="info-row">
        <span class="info-label">Case ID</span>
        <span class="info-value"><a href="edd_case.html?id=${doc.case_id}" style="color: var(--accent);">${doc.case_id}</a></span>
      </div>
    </div>
    <div class="info-section">
      <h4>Status</h4>
      <div class="info-row">
        <span class="info-label">Verification</span>
        <span class="info-value">
          <span class="status-badge ${doc.verified ? 'completed' : 'pending'}">
            ${doc.verified ? 'Verified' : 'Pending Verification'}
          </span>
        </span>
      </div>
      <div class="info-row">
        <span class="info-label">Upload Date</span>
        <span class="info-value">${formatDate(doc.upload_date)}</span>
      </div>
    </div>
    <div class="info-actions">
      <button class="btn btn-primary btn-sm" onclick="verifyDoc()" style="width: 100%;">
        ${doc.verified ? 'Revoke Verification' : 'Mark as Verified'}
      </button>
    </div>
  `;

  loadDocuments(); // Refresh list to show selection
}

function zoomIn() {
  if (currentZoom < 200) {
    currentZoom += 25;
    updateZoom();
  }
}

function zoomOut() {
  if (currentZoom > 25) {
    currentZoom -= 25;
    updateZoom();
  }
}

function fitToPage() {
  currentZoom = 100;
  updateZoom();
}

function updateZoom() {
  document.getElementById('zoom-level').textContent = currentZoom + '%';
  const doc = document.querySelector('.simulated-document');
  if (doc) {
    doc.style.transform = `scale(${currentZoom / 100})`;
  }
}

function downloadDoc() {
  if (currentDoc) {
    alert(`Download ${currentDoc.name} - Feature demo only`);
  }
}

function verifyDoc() {
  if (currentDoc) {
    currentDoc.verified = !currentDoc.verified;
    selectDocument(currentDoc.id);
    alert(currentDoc.verified ? 'Document marked as verified' : 'Verification revoked');
  }
}

function togglePanel() {
  const panel = document.getElementById('doc-list-panel');
  panel.classList.toggle('collapsed');
}

function formatDocType(type) {
  return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Add styles
const styles = `
  .sidebar.collapsed {
    width: 60px;
  }
  
  .sidebar.collapsed .sidebar-title,
  .sidebar.collapsed .nav-section-title,
  .sidebar.collapsed .nav-item span,
  .sidebar.collapsed .nav-badge,
  .sidebar.collapsed .sidebar-user .user-info {
    display: none;
  }
  
  .main-content.expanded {
    margin-left: 60px;
    width: calc(100% - 60px);
  }
  
  .document-viewer-container {
    display: grid;
    grid-template-columns: 280px 1fr 280px;
    gap: 0;
    height: calc(100vh - 80px);
    padding: 0 !important;
  }
  
  .doc-list-panel,
  .doc-info-panel {
    background: var(--glass-bg);
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  .doc-info-panel {
    border-right: none;
    border-left: 1px solid var(--glass-border);
  }
  
  .panel-header {
    padding: 16px;
    border-bottom: 1px solid var(--glass-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .panel-header h3 {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .doc-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
  
  .doc-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    margin-bottom: 8px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }
  
  .doc-item:hover {
    background: rgba(0, 212, 255, 0.05);
  }
  
  .doc-item.active {
    background: rgba(0, 212, 255, 0.1);
    border-color: var(--accent);
  }
  
  .doc-icon {
    font-size: 28px;
    line-height: 1;
  }
  
  .doc-item-info h4 {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 2px;
    color: var(--text-primary);
  }
  
  .doc-item-info p {
    font-size: 10px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }
  
  .doc-status {
    font-size: 10px;
    font-weight: 500;
  }
  
  .doc-status.verified { color: #00E676; }
  .doc-status.pending { color: var(--text-muted); }
  
  .doc-preview-panel {
    background: rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: 24px;
  }
  
  .doc-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  .doc-placeholder {
    text-align: center;
    color: var(--text-muted);
  }
  
  .doc-placeholder p {
    margin-top: 16px;
    font-size: 14px;
  }
  
  .simulated-document {
    background: white;
    border-radius: 8px;
    width: 600px;
    min-height: 800px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    transform-origin: center center;
    transition: transform 0.2s ease;
  }
  
  .doc-header-bar {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px 8px 0 0;
  }
  
  .doc-type-badge {
    background: var(--accent);
    color: #000;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
  }
  
  .doc-source {
    color: rgba(255,255,255,0.7);
    font-size: 11px;
  }
  
  .doc-content {
    padding: 40px;
    position: relative;
    color: #333;
  }
  
  .doc-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    font-size: 48px;
    font-weight: 700;
    color: rgba(0, 212, 255, 0.08);
    pointer-events: none;
    white-space: nowrap;
  }
  
  .doc-content h2 {
    font-size: 18px;
    margin-bottom: 24px;
    color: #1a1a2e;
    text-align: center;
  }
  
  .doc-image-placeholder {
    background: #f5f5f5;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    margin-bottom: 24px;
    color: #999;
  }
  
  .doc-image-placeholder p {
    margin-top: 12px;
    font-size: 14px;
  }
  
  .doc-metadata {
    background: #f9f9f9;
    padding: 16px;
    border-radius: 8px;
  }
  
  .meta-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
    font-size: 13px;
  }
  
  .meta-row:last-child {
    border-bottom: none;
  }
  
  .meta-row span:first-child {
    color: #666;
  }
  
  .meta-row span:last-child {
    font-weight: 500;
    color: #333;
  }
  
  .doc-info {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
  
  .info-section {
    margin-bottom: 24px;
  }
  
  .info-section h4 {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 12px;
  }
  
  .info-label {
    color: var(--text-muted);
  }
  
  .info-value {
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .info-actions {
    padding: 16px;
    border-top: 1px solid var(--glass-border);
  }
  
  .zoom-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--glass-bg);
    padding: 4px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
  }
  
  .zoom-controls span {
    font-size: 12px;
    min-width: 45px;
    text-align: center;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
