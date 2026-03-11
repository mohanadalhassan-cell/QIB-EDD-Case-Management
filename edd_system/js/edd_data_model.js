/**
 * ============================================================================
 * UNIFIED DATA MODEL - المركز الموحد لإدارة البيانات
 * ============================================================================
 * Single Source of Truth (SSOT) لجميع بيانات التطبيق
 * جميع الملفات الأخرى تعتمد على هذا الملف فقط
 * ============================================================================
 */

class EDDDataModel {
  constructor() {
    this.version = '2.0.0';
    this.lastUpdated = new Date().toISOString();
    
    // Initialize all data collections
    this.cases = new Map();
    this.users = new Map();
    this.kyc = new Map();
    this.notifications = new Map();
    this.auditLog = [];
    this.systemConfig = {};
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // ============================================================================
  // CASES Management
  // ============================================================================
  
  getAllCases(filterBy = null) {
    let cases = Array.from(this.cases.values());
    
    if (filterBy) {
      if (filterBy.status) {
        cases = cases.filter(c => c.status === filterBy.status);
      }
      if (filterBy.department) {
        cases = cases.filter(c => c.assignedDepartment === filterBy.department);
      }
      if (filterBy.riskRating) {
        cases = cases.filter(c => c.riskRating === filterBy.riskRating);
      }
    }
    
    return cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getCaseById(caseId) {
    return this.cases.get(caseId) || null;
  }

  createCase(caseData) {
    const id = this.generateId('CASE');
    const newCase = {
      id,
      ...caseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: caseData.status || 'NEW',
      comments: [],
      documents: []
    };
    
    this.cases.set(id, newCase);
    this.logAudit('CREATE_CASE', `Created case ${id}`, { caseId: id });
    return newCase;
  }

  updateCase(caseId, updates) {
    const caseData = this.cases.get(caseId);
    if (!caseData) return null;
    
    const oldStatus = caseData.status;
    Object.assign(caseData, updates);
    caseData.updatedAt = new Date().toISOString();
    
    if (oldStatus !== updates.status) {
      this.logAudit('UPDATE_CASE', `Status changed: ${oldStatus} → ${updates.status}`, { 
        caseId, 
        oldStatus, 
        newStatus: updates.status 
      });
    }
    
    return caseData;
  }

  deleteCase(caseId) {
    const result = this.cases.delete(caseId);
    if (result) {
      this.logAudit('DELETE_CASE', `Deleted case ${caseId}`, { caseId });
    }
    return result;
  }

  getCasesByStatus(status) {
    return this.getAllCases({ status });
  }

  getCasesByDepartment(department) {
    return this.getAllCases({ department });
  }

  getCasesByRisk(riskRating) {
    return this.getAllCases({ riskRating });
  }

  // ============================================================================
  // USERS Management
  // ============================================================================
  
  getAllUsers() {
    return Array.from(this.users.values());
  }

  getUserById(userId) {
    return this.users.get(userId) || null;
  }

  getUserByUsername(username) {
    const userArray = Array.from(this.users.values());
    return userArray.find(u => u.username === username) || null;
  }

  createUser(userData) {
    const id = this.generateId('USER');
    const newUser = {
      id,
      ...userData,
      createdAt: new Date().toISOString(),
      active: true,
      lastLogin: null
    };
    
    this.users.set(id, newUser);
    this.logAudit('CREATE_USER', `Created user ${userData.username}`, { userId: id });
    return newUser;
  }

  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (!user) return null;
    
    Object.assign(user, updates);
    return user;
  }

  disableUser(userId) {
    return this.updateUser(userId, { active: false });
  }

  enableUser(userId) {
    return this.updateUser(userId, { active: true });
  }

  recordUserLogin(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.logAudit('LOGIN', `User ${user.username} logged in`, { userId });
    }
  }

  // ============================================================================
  // KYC Management
  // ============================================================================
  
  getAllKYC() {
    return Array.from(this.kyc.values());
  }

  getKYCById(kycId) {
    return this.kyc.get(kycId) || null;
  }

  createKYC(kycData) {
    const id = this.generateId('KYC');
    const newKYC = {
      id,
      ...kycData,
      createdAt: new Date().toISOString(),
      status: 'SUBMITTED',
      riskRating: 'PENDING'
    };
    
    this.kyc.set(id, newKYC);
    this.logAudit('KYC_SUBMIT', `KYC submitted: ${kycData.email}`, { kycId: id });
    return newKYC;
  }

  updateKYCStatus(kycId, status, riskRating = null) {
    const kycData = this.kyc.get(kycId);
    if (!kycData) return null;
    
    kycData.status = status;
    if (riskRating) kycData.riskRating = riskRating;
    
    return kycData;
  }

  // ============================================================================
  // NOTIFICATIONS Management
  // ============================================================================
  
  getNotifications(userId = null) {
    let notifications = Array.from(this.notifications.values());
    
    if (userId) {
      notifications = notifications.filter(n => n.userId === userId);
    }
    
    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createNotification(userId, message, type = 'info', metadata = {}) {
    const id = this.generateId('NOTIF');
    const notification = {
      id,
      userId,
      message,
      type, // 'info', 'success', 'warning', 'error'
      metadata,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    this.notifications.set(id, notification);
    return notification;
  }

  markNotificationAsRead(notificationId) {
    const notif = this.notifications.get(notificationId);
    if (notif) {
      notif.read = true;
    }
    return notif;
  }

  clearNotifications(userId) {
    const notifications = this.getNotifications(userId);
    notifications.forEach(n => this.notifications.delete(n.id));
  }

  // ============================================================================
  // AUDIT LOG Management
  // ============================================================================
  
  getAuditLog(limit = 1000) {
    return this.auditLog.slice(-limit);
  }

  logAudit(action, details, metadata = {}) {
    const entry = {
      id: this.generateId('AUDIT'),
      action,
      details,
      metadata,
      timestamp: new Date().toISOString(),
      ipAddress: 'localhost'
    };
    
    this.auditLog.push(entry);
    
    // Keep only last 10,000 entries
    if (this.auditLog.length > 10000) {
      this.auditLog.shift();
    }
    
    return entry;
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================
  
  getStatistics() {
    const cases = this.getAllCases();
    const statuses = {};
    const riskCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    
    cases.forEach(c => {
      statuses[c.status] = (statuses[c.status] || 0) + 1;
      if (riskCounts.hasOwnProperty(c.riskRating)) {
        riskCounts[c.riskRating]++;
      }
    });

    return {
      totalCases: cases.length,
      byStatus: statuses,
      byRisk: riskCounts,
      totalUsers: this.users.size,
      totalAuditEntries: this.auditLog.length,
      lastUpdated: new Date().toISOString()
    };
  }

  getDashboardMetrics(userId = null) {
    const stats = this.getStatistics();
    const cases = this.getAllCases();
    
    return {
      stats,
      recentCases: cases.slice(0, 10),
      userCases: userId ? cases.filter(c => c.createdBy === userId) : [],
      pendingApprovals: cases.filter(c => c.status === 'REVIEW').length,
      highRiskCases: cases.filter(c => c.riskRating === 'HIGH').length
    };
  }

  // ============================================================================
  // SEARCH & FILTER
  // ============================================================================
  
  searchCases(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllCases().filter(c => 
      c.id.toLowerCase().includes(lowerQuery) ||
      c.customerName?.toLowerCase().includes(lowerQuery) ||
      c.assignedTo?.toLowerCase().includes(lowerQuery)
    );
  }

  searchUsers(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllUsers().filter(u =>
      u.username.toLowerCase().includes(lowerQuery) ||
      u.email?.toLowerCase().includes(lowerQuery) ||
      u.fullName?.toLowerCase().includes(lowerQuery)
    );
  }

  // ============================================================================
  // EXPORT / IMPORT (For Persistence)
  // ============================================================================
  
  exportData() {
    return {
      version: this.version,
      timestamp: new Date().toISOString(),
      data: {
        cases: Array.from(this.cases.entries()),
        users: Array.from(this.users.entries()),
        kyc: Array.from(this.kyc.entries()),
        notifications: Array.from(this.notifications.entries()),
        auditLog: this.auditLog
      }
    };
  }

  importData(exportedData) {
    try {
      const { data } = exportedData;
      
      this.cases = new Map(data.cases);
      this.users = new Map(data.users);
      this.kyc = new Map(data.kyc);
      this.notifications = new Map(data.notifications);
      this.auditLog = data.auditLog;
      
      this.lastUpdated = new Date().toISOString();
      return true;
    } catch (error) {
      console.error('Data import failed:', error);
      return false;
    }
  }

  // ============================================================================
  // PERSISTENCE (SessionStorage)
  // ============================================================================
  
  saveToStorage() {
    try {
      const exported = this.exportData();
      sessionStorage.setItem('edd_data_model', JSON.stringify(exported));
      return true;
    } catch (error) {
      console.error('Failed to save to storage:', error);
      return false;
    }
  }

  loadFromStorage() {
    try {
      const stored = sessionStorage.getItem('edd_data_model');
      if (stored) {
        const data = JSON.parse(stored);
        this.importData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load from storage:', error);
      return false;
    }
  }

  clearStorage() {
    sessionStorage.removeItem('edd_data_model');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================
  
  generateId(prefix = 'ID') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
  }

  reset() {
    this.cases.clear();
    this.users.clear();
    this.kyc.clear();
    this.notifications.clear();
    this.auditLog = [];
    this.initializeSampleData();
  }

  // ============================================================================
  // SAMPLE DATA INITIALIZATION
  // ============================================================================
  
  initializeSampleData() {
    // Initialize users using generator (or hardcoded if generator not available)
    let users;
    if (typeof SAMPLE_DATA_GENERATOR !== 'undefined') {
      users = SAMPLE_DATA_GENERATOR.generateUsers();
    } else {
      users = [
        {
          id: 'USER_001',
          username: 'ahmed.thani',
          email: 'ahmed.thani@qib.com.qa',
          fullName: 'Ahmed Al Thani',
          role: 'CDD_MAKER',
          department: 'Compliance',
          active: true,
          lastLogin: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
          id: 'USER_002',
          username: 'fatima.ibrahim',
          email: 'fatima.ibrahim@qib.com.qa',
          fullName: 'Fatima Ibrahim',
          role: 'BUSINESS_MAKER',
          department: 'Retail Banking',
          active: true,
          lastLogin: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          id: 'USER_003',
          username: 'admin.system',
          email: 'admin@qib.com.qa',
          fullName: 'System Administrator',
          role: 'ADMIN',
          department: 'IT',
          active: true,
          lastLogin: new Date(Date.now() - 10 * 60000).toISOString()
        }
      ];
    }

    users.forEach((user, index) => {
      user.createdAt = user.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      this.users.set(user.id || `USER_${String(index + 1).padStart(3, '0')}`, user);
    });

    // Initialize 120 cases using generator
    let cases;
    if (typeof SAMPLE_DATA_GENERATOR !== 'undefined') {
      cases = SAMPLE_DATA_GENERATOR.generateCases(120);
    } else {
      // Fallback: Create minimal cases if generator not available
      cases = [];
      const caseStatuses = ['NEW', 'REVIEW', 'PENDING', 'APPROVED', 'REJECTED'];
      for (let i = 0; i < 120; i++) {
        cases.push({
          id: `CASE_${String(i + 1).padStart(6, '0')}`,
          customerId: `CUST_${String(i + 1).padStart(6, '0')}`,
          customerName: `Customer ${i + 1}`,
          status: caseStatuses[i % caseStatuses.length],
          riskRating: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      }
    }

    cases.forEach((thisCase, index) => {
      thisCase.createdAt = thisCase.createdAt || new Date().toISOString();
      thisCase.updatedAt = thisCase.updatedAt || new Date().toISOString();
      
      // ✨ ENRICH WITH AUTOMATIC RISK SCORES
      thisCase = this.enrichCaseWithRiskScores(thisCase);
      
      this.cases.set(thisCase.id, thisCase);
    });

    console.log('✅ Sample data initialized:', {
      users: this.users.size,
      cases: this.cases.size,
      totalDataPoints: this.users.size + this.cases.size
    });
  }

  // ✨ NEW: Enrich case with automatic risk scores from RiskEngine
  enrichCaseWithRiskScores(caseData) {
    if (typeof RiskEngine === 'undefined') {
      console.warn('RiskEngine not available, skipping risk score enrichment');
      return caseData;
    }

    // Use RiskEngine to calculate automatic risk scores
    const enriched = RiskEngine.enrichCustomerWithRiskScores(caseData);
    return enriched;
  }
}

// ============================================================================
// GLOBAL SINGLETON INSTANCE
// ============================================================================

// Create global instance accessible from all modules
window.EDDDataModel = EDDDataModel;
window.eddDataModel = window.eddDataModel || new EDDDataModel();

// Try to restore from storage
if (!window.eddDataModel.loadFromStorage()) {
  console.log('📝 Using fresh data model (no storage found)');
}

// Auto-save to storage every 30 seconds
setInterval(() => {
  window.eddDataModel.saveToStorage();
}, 30000);

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EDDDataModel;
}
