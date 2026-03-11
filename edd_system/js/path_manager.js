/**
 * ============================================================================
 * UNIFIED PATH SYSTEM - نظام المسارات الموحد
 * ============================================================================
 * يحل مشكلة المسارات المطلقة /edd_system/... ويجعلها نسبية وآمنة
 * ============================================================================
 */

class PathManager {
  constructor() {
    this.detectEnvironment();
    this.baseUrls = this.initializeBaseUrls();
  }

  // ============================================================================
  // ENVIRONMENT DETECTION
  // ============================================================================
  
  detectEnvironment() {
    // Detect if running on localhost or remote server
    this.isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    this.protocol = window.location.protocol;
    this.hostname = window.location.hostname;
    this.port = window.location.port;
    
    // Build base URL without trailing slash
    this.baseURL = `${this.protocol}//${this.hostname}${this.port ? ':' + this.port : ''}`;
    
    console.log('🌐 Path Manager:', {
      isLocalhost: this.isLocalhost,
      baseURL: this.baseURL,
      currentPath: window.location.pathname
    });
  }

  // ============================================================================
  // INITIALIZE BASE URLS
  // ============================================================================
  
  initializeBaseUrls() {
    return {
      // Frontend paths (relative)
      eddSystem: '/edd_system',
      js: '/edd_system/js',
      css: '/edd_system/css',
      assets: '/edd_system/assets',
      
      // API paths (absolute or relative)
      api: '/api/v1',
      auth: '/api/v1/auth',
      cases: '/api/v1/cases',
      kyc: '/api/v1/kyc',
      stats: '/api/v1/stats',
      notifications: '/api/v1/notifications',
      audit: '/api/v1/audit',
      health: '/api/v1/health',
      
      // Page routes
      pages: {
        dashboard: '/edd_system/dashboard.html',
        login: '/edd_system/login.html',
        kycForm: '/edd_system/kyc_form.html',
        cddView: '/edd_system/cdd_view.html',
        adminDashboard: '/edd_system/admin_dashboard.html',
        organization: '/edd_system/organization.html',
        auditConsole: '/edd_system/audit_console.html'
      }
    };
  }

  // ============================================================================
  // PATH BUILDERS
  // ============================================================================
  
  /**
   * Get absolute URL (for API calls)
   */
  getAbsoluteUrl(path) {
    if (path.startsWith('http')) {
      return path; // Already absolute
    }
    
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    
    return `${this.baseURL}${path}`;
  }

  /**
   * Get relative path (for asset loading)
   */
  getRelativePath(path) {
    // If path starts with /, return as-is (relative to domain root)
    if (path.startsWith('/')) {
      return path;
    }
    
    // Calculate relative path based on current location
    const currentPath = window.location.pathname;
    const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
    
    if (path.includes('/edd_system/')) {
      return path; // Already correct format
    }
    
    return path;
  }

  /**
   * Get JavaScript file path
   */
  getScriptPath(filename) {
    return `${this.baseUrls.js}/${filename}`;
  }

  /**
   * Get CSS file path
   */
  getStylePath(filename) {
    return `${this.baseUrls.css}/${filename}`;
  }

  /**
   * Get asset file path (images, fonts, etc)
   */
  getAssetPath(filename) {
    return `${this.baseUrls.assets}/${filename}`;
  }

  /**
   * Get page route
   */
  getPageUrl(pageName) {
    return this.baseUrls.pages[pageName] || `/edd_system/${pageName}.html`;
  }

  /**
   * Get API endpoint
   */
  getApiUrl(endpoint) {
    if (endpoint.startsWith('/')) {
      return endpoint; // Use absolute API path
    }
    
    return `${this.baseUrls.api}/${endpoint}`;
  }

  // ============================================================================
  // FETCH HELPERS (Safe API Calls)
  // ============================================================================
  
  /**
   * Safe fetch with auth header
   */
  async fetchAPI(endpoint, options = {}) {
    const url = this.getAbsoluteUrl(this.getApiUrl(endpoint));
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // Add auth token if available
    const token = this.getAuthToken();
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.fetchAPI(endpoint, { 
      method: 'GET',
      ...options 
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.fetchAPI(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.fetchAPI(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.fetchAPI(endpoint, {
      method: 'DELETE',
      ...options
    });
  }

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  
  getAuthToken() {
    return localStorage.getItem('authToken') || 
           sessionStorage.getItem('authToken') ||
           null;
  }

  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  clearAuthToken() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  }

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  
  /**
   * Navigate to page
   */
  navigate(pageName, params = {}) {
    let url = this.getPageUrl(pageName);
    
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url += `?${queryString}`;
    }

    window.location.href = url;
  }

  /**
   * Navigate to URL
   */
  navigateTo(url) {
    window.location.href = this.getAbsoluteUrl(url);
  }

  /**
   * Redirect if not authenticated
   */
  redirectIfNotAuthenticated() {
    if (!this.getAuthToken()) {
      this.navigate('login');
      return false;
    }
    return true;
  }

  // ============================================================================
  // SCRIPT/STYLESHEET LOADING
  // ============================================================================
  
  /**
   * Load script dynamically
   */
  loadScript(filename) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.getScriptPath(filename);
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /**
   * Load stylesheet dynamically
   */
  loadStylesheet(filename) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = this.getStylePath(filename);
    document.head.appendChild(link);
  }

  // ============================================================================
  // DEBUGGING
  // ============================================================================
  
  printDebugInfo() {
    console.group('🔍 Path Manager Debug Info');
    console.log('Base URL:', this.baseURL);
    console.log('Is Localhost:', this.isLocalhost);
    console.log('Base URLs:', this.baseUrls);
    console.table({
      'Current Path': window.location.pathname,
      'Current Page': window.location.href,
      'Auth Token': this.getAuthToken() ? '✓ Set' : '✗ Not set'
    });
    console.groupEnd();
  }

  /**
   * Test all paths
   */
  testPaths() {
    console.group('🧪 Path Testing');
    
    const testCases = [
      ['Script (case_manager.js)', this.getScriptPath('case_manager.js')],
      ['CSS', this.getStylePath('edd_system.css')],
      ['API (cases)', this.getApiUrl('cases')],
      ['API (absolute)', this.getAbsoluteUrl(this.getApiUrl('cases'))],
      ['Page (dashboard)', this.getPageUrl('dashboard')],
      ['Asset', this.getAssetPath('employees/user.jpg')]
    ];

    testCases.forEach(([name, path]) => {
      console.log(`${name}: ${path}`);
    });

    console.groupEnd();
  }
}

// ============================================================================
// GLOBAL INSTANCE
// ============================================================================

window.pathManager = new PathManager();

// Auto-test in development
if (window.location.hostname === 'localhost') {
  console.log('💡 Run pathManager.testPaths() to see all paths');
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PathManager;
}
