// Notifications Center Controller
let currentTab = 'all';
let currentChannel = 'sms';

document.addEventListener('DOMContentLoaded', function() {
  // Check session
  const session = JSON.parse(sessionStorage.getItem('edd_session') || '{}');
  if (!session.authenticated) {
    window.location.href = 'login.html';
    return;
  }

  // Update user info
  document.getElementById('user-name').textContent = session.user || 'User';
  document.getElementById('user-role').textContent = session.role || 'Staff';

  // Load initial data
  loadNotifications();
  loadTemplates();

  // Tab handlers
  document.querySelectorAll('.notif-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.notif-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      currentTab = this.dataset.tab;
      loadNotifications();
    });
  });

  // Filter handler
  document.getElementById('filter-status').addEventListener('change', loadNotifications);

  // Logout handler
  document.getElementById('logout-btn').addEventListener('click', function() {
    sessionStorage.removeItem('edd_session');
    window.location.href = 'login.html';
  });
});

// Sample notifications data
const notificationsData = [
  {
    id: 'N001',
    type: 'sms',
    recipient: 'Ahmed Al-Mansour',
    phone: '+974 xxxx1234',
    case_id: 'EDD-2024-001',
    subject: 'Document Request',
    message: 'Dear Customer, please submit additional documents for your EDD review. Ref: EDD-2024-001',
    status: 'sent',
    sent_at: '2024-01-15T14:30:00',
    unread: false
  },
  {
    id: 'N002',
    type: 'app',
    recipient: 'Fatima Al-Rashid',
    case_id: 'EDD-2024-002',
    subject: 'Review Complete',
    message: 'Your Enhanced Due Diligence review has been completed. Please check your account.',
    status: 'sent',
    sent_at: '2024-01-15T13:15:00',
    unread: true
  },
  {
    id: 'N003',
    type: 'sms',
    recipient: 'Mohammed Al-Baker',
    phone: '+974 xxxx5678',
    case_id: 'EDD-2024-003',
    subject: 'Action Required',
    message: 'Urgent: Additional information required for your account review. Contact us within 5 days.',
    status: 'pending',
    sent_at: '2024-01-15T12:00:00',
    unread: true
  },
  {
    id: 'N004',
    type: 'app',
    recipient: 'Sara Al-Thani',
    case_id: 'EDD-2024-004',
    subject: 'KYC Update',
    message: 'Your KYC information has been updated successfully.',
    status: 'sent',
    sent_at: '2024-01-15T11:45:00',
    unread: false
  },
  {
    id: 'N005',
    type: 'sms',
    recipient: 'Khalid Al-Sulaiti',
    phone: '+974 xxxx9012',
    case_id: 'EDD-2024-005',
    subject: 'Reminder',
    message: 'Reminder: Please respond to our previous request for documents.',
    status: 'failed',
    sent_at: '2024-01-15T10:30:00',
    unread: false,
    error: 'Invalid phone number'
  },
  {
    id: 'N006',
    type: 'sms',
    recipient: 'Noor Al-Mahmoud',
    phone: '+974 xxxx3456',
    case_id: 'EDD-2024-006',
    subject: 'Compliance Notice',
    message: 'Your account has been flagged for compliance review. A representative will contact you.',
    status: 'sent',
    sent_at: '2024-01-15T09:20:00',
    unread: false
  },
  {
    id: 'N007',
    type: 'app',
    recipient: 'Hassan Al-Farsi',
    case_id: 'EDD-2024-007',
    subject: 'Appointment Confirmation',
    message: 'Your appointment for document verification is confirmed for Jan 20, 2024 at 10:00 AM.',
    status: 'sent',
    sent_at: '2024-01-14T16:45:00',
    unread: false
  },
  {
    id: 'N008',
    type: 'sms',
    recipient: 'Layla Al-Dosari',
    phone: '+974 xxxx7890',
    case_id: 'EDD-2024-008',
    subject: 'Account Update',
    message: 'Your account risk level has been updated based on recent review.',
    status: 'sent',
    sent_at: '2024-01-14T15:30:00',
    unread: false
  }
];

const templates = [
  {
    id: 'doc_request',
    name: 'Document Request',
    message: 'Dear {customer_name}, please submit the following documents for your EDD review: {documents}. Ref: {case_id}',
    variables: ['customer_name', 'documents', 'case_id']
  },
  {
    id: 'review_complete',
    name: 'Review Complete',
    message: 'Dear {customer_name}, your Enhanced Due Diligence review has been completed. Status: {status}. Ref: {case_id}',
    variables: ['customer_name', 'status', 'case_id']
  },
  {
    id: 'action_required',
    name: 'Action Required',
    message: 'Urgent: Action required for your account. Please contact QIB within {days} business days. Ref: {case_id}',
    variables: ['days', 'case_id']
  },
  {
    id: 'reminder',
    name: 'Reminder',
    message: 'Reminder: We are still awaiting your response to our previous request dated {date}. Ref: {case_id}',
    variables: ['date', 'case_id']
  },
  {
    id: 'appointment',
    name: 'Appointment',
    message: 'Your appointment is scheduled for {date} at {time}. Location: {branch}. Ref: {case_id}',
    variables: ['date', 'time', 'branch', 'case_id']
  }
];

function loadNotifications() {
  const container = document.getElementById('notif-items');
  const statusFilter = document.getElementById('filter-status').value;

  let filtered = notificationsData;

  // Filter by tab
  if (currentTab === 'sms') {
    filtered = filtered.filter(n => n.type === 'sms');
  } else if (currentTab === 'app') {
    filtered = filtered.filter(n => n.type === 'app');
  } else if (currentTab === 'scheduled') {
    filtered = filtered.filter(n => n.status === 'pending');
  }

  // Filter by status
  if (statusFilter !== 'all') {
    filtered = filtered.filter(n => n.status === statusFilter);
  }

  // Update tab counts
  document.getElementById('tab-all-count').textContent = notificationsData.length;
  document.getElementById('tab-sms-count').textContent = notificationsData.filter(n => n.type === 'sms').length;
  document.getElementById('tab-app-count').textContent = notificationsData.filter(n => n.type === 'app').length;
  document.getElementById('tab-scheduled-count').textContent = notificationsData.filter(n => n.status === 'pending').length;

  container.innerHTML = filtered.map(notif => `
    <div class="notif-item ${notif.unread ? 'unread' : ''}" onclick="viewNotification('${notif.id}')">
      <div class="notif-icon ${notif.type}">
        ${notif.type === 'sms' ? '📱' : '🔔'}
      </div>
      <div class="notif-content">
        <h4>
          ${notif.subject}
          <span class="notif-status ${notif.status}">${notif.status}</span>
        </h4>
        <p>${notif.message}</p>
        <div class="notif-meta">
          <span>👤 ${notif.recipient}</span>
          <span>📋 ${notif.case_id}</span>
          ${notif.phone ? `<span>📞 ${notif.phone}</span>` : ''}
        </div>
      </div>
      <div class="notif-time">
        ${formatTime(notif.sent_at)}
      </div>
    </div>
  `).join('');

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding: 40px; text-align: center; color: var(--text-muted);">
        <p>No notifications found</p>
      </div>
    `;
  }
}

function loadTemplates() {
  const container = document.getElementById('template-list');
  
  container.innerHTML = templates.map(tpl => `
    <div class="template-item" onclick="useTemplate('${tpl.id}')">
      <h4>${tpl.name}</h4>
      <p>${tpl.message.substring(0, 60)}...</p>
      <div class="template-vars">
        ${tpl.variables.map(v => `<span class="template-var">{${v}}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function openCompose() {
  document.getElementById('compose-modal').classList.add('active');
}

function closeCompose() {
  document.getElementById('compose-modal').classList.remove('active');
  document.getElementById('compose-message').value = '';
  document.getElementById('compose-recipient').value = '';
  document.getElementById('compose-template').value = '';
}

function selectChannel(channel) {
  currentChannel = channel;
  document.querySelectorAll('.channel-option').forEach(opt => {
    opt.classList.remove('selected');
    if (opt.dataset.channel === channel) {
      opt.classList.add('selected');
    }
  });
}

function useTemplate(templateId) {
  const tpl = templates.find(t => t.id === templateId);
  if (tpl) {
    openCompose();
    document.getElementById('compose-template').value = templateId;
    document.getElementById('compose-message').value = tpl.message;
  }
}

function applyTemplate() {
  const templateId = document.getElementById('compose-template').value;
  if (templateId) {
    const tpl = templates.find(t => t.id === templateId);
    if (tpl) {
      document.getElementById('compose-message').value = tpl.message;
    }
  }
}

function sendNotification() {
  const recipient = document.getElementById('compose-recipient').value;
  const message = document.getElementById('compose-message').value;

  if (!recipient) {
    alert('Please select a recipient');
    return;
  }

  if (!message.trim()) {
    alert('Please enter a message');
    return;
  }

  // Simulate sending
  const newNotif = {
    id: 'N' + String(notificationsData.length + 1).padStart(3, '0'),
    type: currentChannel,
    recipient: recipient.includes('Ahmed') ? 'Ahmed Al-Mansour' : recipient,
    case_id: recipient.split('(')[1]?.replace(')', '') || 'BULK',
    subject: 'Custom Message',
    message: message,
    status: 'sent',
    sent_at: new Date().toISOString(),
    unread: false
  };

  notificationsData.unshift(newNotif);
  loadNotifications();
  closeCompose();

  alert('Notification sent successfully!');
}

function viewNotification(id) {
  const notif = notificationsData.find(n => n.id === id);
  if (notif) {
    notif.unread = false;
    loadNotifications();
    
    alert(`Notification Details:\n\nTo: ${notif.recipient}\nSubject: ${notif.subject}\nStatus: ${notif.status}\n\nMessage:\n${notif.message}`);
  }
}

function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
