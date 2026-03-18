/**
 * Security Guard & UI Safety Layer
 * - Session + role enforcement
 * - Access matrix storage (shared with Access Control page)
 * - Alert/confirm interception into toasts
 * - Demo reset helper
 */
(function(window, document) {
  'use strict';

  const BODY_HIDDEN_FLAG = '__sg_hidden';

  function hideDocument() {
    if (document.documentElement.dataset[BODY_HIDDEN_FLAG]) return;
    document.documentElement.style.visibility = 'hidden';
    document.documentElement.dataset[BODY_HIDDEN_FLAG] = 'true';
  }

  function showDocument() {
    document.documentElement.style.visibility = 'visible';
    delete document.documentElement.dataset[BODY_HIDDEN_FLAG];
  }

  const DEFAULT_PAGE_ROLES = {
    'dashboard.html': ['business', 'cdd', 'compliance', 'management', 'audit', 'it'],
    'business_view.html': ['business', 'management'],
    'cdd_view.html': ['cdd', 'compliance', 'management'],
    'compliance_view.html': ['compliance', 'audit', 'management'],
    'audit_console.html': ['audit', 'it'],
    'admin_dashboard.html': ['it', 'management'],
    'management_dashboard.html': ['management', 'it'],
    'access_control.html': ['it', 'management', 'compliance'],
    'edd_case.html': ['business', 'cdd', 'compliance', 'management', 'audit', 'it'],
    'edd_case_production.html': ['business', 'cdd', 'compliance', 'management', 'audit', 'it'],
    'customer360.html': ['business', 'cdd', 'compliance', 'management'],
    'kyc_form.html': ['business', 'cdd', 'compliance', 'management'],
    'kyc_monitoring.html': ['cdd', 'compliance', 'management', 'audit', 'it'],
    'decision-analytics-dashboard.html': ['management', 'it'],
    'organization.html': ['management', 'it'],
    'alternative_channels.html': ['business', 'cdd', 'compliance', 'management']
  };

  const NotificationCenter = {
    containerId: 'toast-stack',
    ensureContainer() {
      if (document.getElementById(this.containerId)) return;
      const el = document.createElement('div');
      el.id = this.containerId;
      el.style.cssText = [
        'position:fixed',
        'top:16px',
        'right:16px',
        'z-index:9999',
        'display:flex',
        'flex-direction:column',
        'gap:8px',
        'pointer-events:none'
      ].join(';');
      document.body.appendChild(el);
    },
    toast(message, type = 'info', duration = 3200) {
      this.ensureContainer();
      const toast = document.createElement('div');
      const colors = {
        info: '#0ea5e9',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444'
      };
      const bg = colors[type] || colors.info;
      toast.style.cssText = [
        'min-width:240px',
        'max-width:360px',
        'padding:12px 14px',
        'border-radius:10px',
        'color:#0b1224',
        'background: #fff',
        'border:1px solid ' + bg,
        'box-shadow:0 10px 30px rgba(0,0,0,0.15)',
        'font-size:13px',
        'font-weight:600',
        'pointer-events:auto'
      ].join(';');
      toast.textContent = message;
      document.getElementById(this.containerId).appendChild(toast);
      setTimeout(() => toast.remove(), duration);
    }
  };

  function overrideDialogs() {
    if (window.__dialogsPatched) return;
    window.__dialogsPatched = true;
    window.alert = function(msg) {
      NotificationCenter.toast(String(msg), 'info');
      return true;
    };
    window.confirm = function(msg) {
      NotificationCenter.toast(String(msg) + ' (auto-approved)', 'warning');
      return true;
    };
  }

  const AccessMatrixStore = {
    KEY: 'edd_access_matrix',
    PENDING_KEY: 'access_control_pending',
    load() {
      const raw = localStorage.getItem(this.KEY);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch (e) {
          console.warn('Access matrix parse error, seeding defaults', e);
        }
      }
      return this.seedDefaults();
    },
    seedDefaults() {
      localStorage.setItem(this.KEY, JSON.stringify(DEFAULT_PAGE_ROLES));
      return DEFAULT_PAGE_ROLES;
    },
    loadPending() {
      const raw = localStorage.getItem(this.PENDING_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.warn('Pending access control parse error', e);
        return null;
      }
    },
    savePending(pending) {
      localStorage.setItem(this.PENDING_KEY, JSON.stringify(pending));
    },
    clearPending() {
      localStorage.removeItem(this.PENDING_KEY);
    },
    save(matrix) {
      localStorage.setItem(this.KEY, JSON.stringify(matrix));
    },
    getAllowedRoles(pageName) {
      const matrix = this.load() || {};
      return matrix[pageName];
    }
  };

  function getPageName() {
    const parts = window.location.pathname.split('/');
    const last = parts[parts.length - 1] || '';
    return last || 'dashboard.html';
  }

  function clearSession() {
    sessionStorage.removeItem('edd_session');
    sessionStorage.removeItem('edd_user');
  }

  function redirect(url, message, type = 'info') {
    if (message) NotificationCenter.toast(message, type);
    setTimeout(() => window.location.replace(url), 120);
  }

  const AuthGuard = {
    getSession() {
      const stored = sessionStorage.getItem('edd_session');
      if (!stored) return null;
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Session parse failed', e);
        return null;
      }
    },
    enforce(options = {}) {
      hideDocument();
      overrideDialogs();

      const session = this.getSession();
      if (!session || !session.authenticated || !session.user) {
        clearSession();
        redirect('/edd_system/login.html', 'Session expired. Redirecting to login.', 'error');
        return false;
      }

      const role = session.user.role;
      const pageName = options.pageName || getPageName();
      const matrixRoles = AccessMatrixStore.getAllowedRoles(pageName);
      const allowedRoles = (options.allowedRoles && options.allowedRoles.length > 0)
        ? options.allowedRoles
        : (matrixRoles || DEFAULT_PAGE_ROLES[pageName] || DEFAULT_PAGE_ROLES['dashboard.html']);

      if (Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
        redirect('/edd_system/dashboard.html', 'Access blocked for your role. Redirecting to dashboard.', 'error');
        return false;
      }

      document.body.dataset.userRole = role;
      window.currentUserRole = role;
      showDocument();
      return true;
    },
    getAllowedRoles(pageName) {
      return AccessMatrixStore.getAllowedRoles(pageName) || DEFAULT_PAGE_ROLES[pageName];
    }
  };

  const DemoReset = {
    run() {
      clearSession();
      localStorage.removeItem(AccessMatrixStore.KEY);
      AccessMatrixStore.clearPending();
      localStorage.removeItem('edd-theme-mode');
      localStorage.removeItem('fontSize');
      localStorage.removeItem('preferredLanguage');
      localStorage.removeItem('access_control_state');
      NotificationCenter.toast('Demo state cleared. Redirecting to login...', 'success');
      setTimeout(() => window.location.replace('/edd_system/login.html'), 600);
    }
  };

  window.AuthGuard = AuthGuard;
  window.NotificationCenter = NotificationCenter;
  window.DialogShield = { override: overrideDialogs };
  window.DemoReset = DemoReset;
  window.AccessMatrixStore = AccessMatrixStore;

  // Auto-run dialog override as soon as script loads
  overrideDialogs();
})(window, document);
