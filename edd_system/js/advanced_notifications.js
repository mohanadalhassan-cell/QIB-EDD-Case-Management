/**
 * ============================================================================
 * ADVANCED NOTIFICATION SYSTEM
 * ============================================================================
 * Real-time notifications, alerts, and event management
 * ============================================================================
 */

const NotificationSystem = {
  
  notifications: [],
  maxNotifications: 50,
  notificationQueue: [],
  isProcessing: false,

  // ============================================================================
  // INITIALIZE
  // ============================================================================

  initialize: function() {
    console.log('✅ Advanced Notification System initialized');
    this.setupNotificationContainer();
    this.loadNotificationPreferences();
    this.startNotificationProcessor();
  },

  setupNotificationContainer: function() {
    // Create notification container if not exists
    if (!document.getElementById('notification-container')) {
      const container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; width: 400px; max-width: 90%;';
      document.body.appendChild(container);
    }
  },

  loadNotificationPreferences: function() {
    const prefs = localStorage.getItem('notification_preferences');
    this.preferences = prefs ? JSON.parse(prefs) : {
      desktop: true,
      sound: true,
      email: false,
      autoClose: true,
      autoCloseDelay: 5000
    };
  },

  // ============================================================================
  // SEND NOTIFICATIONS
  // ============================================================================

  success: function(title, message, options = {}) {
    return this.notify('success', title, message, options);
  },

  error: function(title, message, options = {}) {
    return this.notify('error', title, message, options);
  },

  warning: function(title, message, options = {}) {
    return this.notify('warning', title, message, options);
  },

  info: function(title, message, options = {}) {
    return this.notify('info', title, message, options);
  },

  notify: function(type, title, message, options = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type: type,
      title: title,
      message: message,
      timestamp: new Date(),
      ...options
    };

    this.notificationQueue.push(notification);
    this.processQueue();

    return notification.id;
  },

  processQueue: function() {
    if (this.isProcessing || this.notificationQueue.length === 0) return;

    this.isProcessing = true;
    const notification = this.notificationQueue.shift();
    this.displayNotification(notification);

    setTimeout(() => {
      this.isProcessing = false;
      if (this.notificationQueue.length > 0) {
        this.processQueue();
      }
    }, 300);
  },

  displayNotification: function(notification) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    // Create notification element
    const notifElement = document.createElement('div');
    notifElement.id = `notif-${notification.id}`;
    notifElement.className = `notification notification-${notification.type}`;
    notifElement.style.cssText = `
      background: ${this.getTypeColor(notification.type)};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      margin-bottom: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      position: relative;
      overflow: hidden;
    `;

    notifElement.innerHTML = `
      <div style="flex-shrink: 0; font-size: 20px;">
        ${this.getTypeIcon(notification.type)}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">${notification.title}</div>
        <div style="font-size: 13px; opacity: 0.9;">${notification.message}</div>
        ${notification.action ? `
          <button onclick="eval('${notification.action}')" style="
            margin-top: 8px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s;
          ">
            ${notification.actionLabel || 'Action'}
          </button>
        ` : ''}
      </div>
      <button onclick="document.getElementById('notif-${notification.id}').remove();" style="
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        opacity: 0.7;
        transition: opacity 0.3s;
      ">
        ×
      </button>
    `;

    container.appendChild(notifElement);

    // Add to notifications list
    this.notifications.unshift(notification);
    if (this.notifications.length > this.maxNotifications) {
      this.notifications.pop();
    }

    // Play sound if enabled
    if (this.preferences.sound && notification.type !== 'info') {
      this.playNotificationSound(notification.type);
    }

    // Desktop notification if enabled
    if (this.preferences.desktop && 'Notification' in window) {
      this.sendDesktopNotification(notification);
    }

    // Auto close
    if (this.preferences.autoClose && notification.type !== 'error') {
      setTimeout(() => {
        const element = document.getElementById(`notif-${notification.id}`);
        if (element) {
          element.style.animation = 'slideOut 0.3s ease';
          setTimeout(() => element.remove(), 300);
        }
      }, this.preferences.autoCloseDelay);
    }
  },

  getTypeColor: function(type) {
    const colors = {
      success: 'linear-gradient(135deg, #22C55E, #16A34A)',
      error: 'linear-gradient(135deg, #EF4444, #DC2626)',
      warning: 'linear-gradient(135deg, #F59E0B, #D97706)',
      info: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
    };
    return colors[type] || colors.info;
  },

  getTypeIcon: function(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || '📢';
  },

  playNotificationSound: function(type) {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = type === 'error' ? 300 : 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.warn('Could not play notification sound');
    }
  },

  sendDesktopNotification: function(notification) {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/assets/qib-logo.png',
        tag: notification.type,
        requireInteraction: notification.type === 'error'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/assets/qib-logo.png'
          });
        }
      });
    }
  },

  // ============================================================================
  // NOTIFICATION ACTIONS
  // ============================================================================

  clearAll: function() {
    const container = document.getElementById('notification-container');
    if (container) container.innerHTML = '';
    this.notifications = [];
  },

  removeNotification: function(notificationId) {
    const element = document.getElementById(`notif-${notificationId}`);
    if (element) {
      element.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => element.remove(), 300);
    }
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  },

  getNotifications: function() {
    return this.notifications;
  },

  getNotificationHistory: function(limit = 10) {
    return this.notifications.slice(0, limit);
  },

  // ============================================================================
  // SYSTEM ALERTS
  // ============================================================================

  notifyCaseCreated: function(caseId, customerName) {
    this.success('✨ New Case Created', `Case ${caseId} for ${customerName} has been created successfully`);
  },

  notifyCaseUpdated: function(caseId) {
    this.info('📝 Case Updated', `Case ${caseId} has been updated`);
  },

  notifyCaseEscalated: function(caseId) {
    this.warning('⬆️ Case Escalated', `Case ${caseId} has been escalated to senior review`);
  },

  notifyDocumentReceived: function(documentName) {
    this.success('📄 Document Received', `Document "${documentName}" has been uploaded successfully`);
  },

  notifyDocumentRequested: function(customerName) {
    this.info('📋 Documents Requested', `Documents requested from ${customerName}`);
  },

  notifySLAWarning: function(caseId, daysRemaining) {
    this.warning('⏰ SLA Warning', `Case ${caseId} has ${daysRemaining} days before SLA breach`);
  },

  notifyOverdueSLA: function(caseId) {
    this.error('🚨 SLA Breached', `Case ${caseId} has exceeded SLA deadline`);
  },

  notifyHighRiskDetected: function(customerName, riskScore) {
    this.error('🔴 High Risk Alert', `High risk detected for ${customerName} (Score: ${riskScore})`);
  },

  notifyApprovalNeeded: function(caseCount) {
    this.warning('✋ Approval Required', `${caseCount} case(s) are pending your approval`);
  },

  // ============================================================================
  // PREFERENCES
  // ============================================================================

  setPreferences: function(preferences) {
    this.preferences = {
      ...this.preferences,
      ...preferences
    };
    localStorage.setItem('notification_preferences', JSON.stringify(this.preferences));
  },

  startNotificationProcessor: function() {
    // Check for new events periodically
    setInterval(() => {
      // This can be connected to WebSocket or polling API
      // For now, it's a placeholder for future real-time updates
    }, 5000);
  }

};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(450px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(450px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  NotificationSystem.initialize();
});
