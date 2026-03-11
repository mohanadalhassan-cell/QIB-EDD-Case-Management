/**
 * ============================================================================
 * DATA BRIDGE - جسر البيانات
 * ============================================================================
 * يربط النموذج الموحد الجديد بالنظام القديم للتوافق الكامل
 * Bridges new unified model with legacy system for full compatibility
 * ============================================================================
 */

// ============================================================================
// LEGACY FALLBACK - استخدم النموذج الموحد إذا كانت البيانات القديمة غير موجودة
// ============================================================================

// EDDMockData compatibility (Legacy)
if (typeof window.EDDMockData === 'undefined') {
  window.EDDMockData = {
    get cases() {
      return window.eddDataModel ? 
        window.eddDataModel.getAllCases() : 
        [];
    },
    get customers() {
      return window.eddDataModel ? 
        window.eddDataModel.getAllCases().map(c => ({
          id: c.customerId,
          name: c.customerName,
          email: c.email,
          phone: c.phoneNumber,
          rim: c.customerId,
          qid: c.nin || 'N/A',
          sector: c.sector,
          risk: c.riskRating
        })) : 
        [];
    },
    get users() {
      return window.eddDataModel ? 
        window.eddDataModel.getAllUsers() : 
        [];
    }
  };
}

// Case Manager compatibility (Legacy)
if (typeof window.caseManager === 'undefined') {
  window.caseManager = {
    getAllCases: () => {
      return window.eddDataModel ? 
        window.eddDataModel.getAllCases() : 
        [];
    },
    getCaseById: (id) => {
      return window.eddDataModel ? 
        window.eddDataModel.getCaseById(id) : 
        null;
    },
    createCase: (data) => {
      return window.eddDataModel ? 
        window.eddDataModel.createCase(data) : 
        null;
    },
    updateCase: (id, updates) => {
      return window.eddDataModel ? 
        window.eddDataModel.updateCase(id, updates) : 
        null;
    },
    getCasesByStatus: (status) => {
      return window.eddDataModel ? 
        window.eddDataModel.getCasesByStatus(status) : 
        [];
    },
    getCasesByDepartment: (dept) => {
      return window.eddDataModel ? 
        window.eddDataModel.getAllCases({ department: dept }) : 
        [];
    },
    getCasesByRisk: (risk) => {
      return window.eddDataModel ? 
        window.eddDataModel.getCasesByRisk(risk) : 
        [];
    }
  };
}

// ============================================================================
// GLOBAL HELPERS
// ============================================================================

/**
 * Get total cases count
 */
function getTotalCases() {
  const data = window.eddDataModel || window.EDDMockData;
  return data && data.cases ? data.cases.length : 0;
}

/**
 * Get cases by status count
 */
function getCasesCountByStatus(status) {
  const data = window.eddDataModel || window.caseManager || window.EDDMockData;
  if (!data) return 0;
  
  if (window.eddDataModel && data.getCasesByStatus) {
    return data.getCasesByStatus(status).length;
  }
  
  const cases = data.cases || data.getAllCases?.() || [];
  return cases.filter(c => c.status === status).length;
}

/**
 * Get cases by risk rating count
 */
function getCasesCountByRisk(risk) {
  const data = window.eddDataModel || window.caseManager || window.EDDMockData;
  if (!data) return 0;
  
  if (window.eddDataModel && data.getCasesByRisk) {
    return data.getCasesByRisk(risk).length;
  }
  
  const cases = data.cases || data.getAllCases?.() || [];
  return cases.filter(c => c.riskRating === risk).length;
}

/**
 * Get dashboard statistics
 */
function getDashboardStats() {
  const data = window.eddDataModel;
  if (!data) return null;
  
  if (data.getDashboardMetrics) {
    return data.getDashboardMetrics();
  }
  
  return null;
}

/**
 * Get system statistics
 */
function getSystemStats() {
  const data = window.eddDataModel;
  if (!data || !data.getStatistics) return null;
  
  return data.getStatistics();
}

/**
 * Export all cases
 */
function exportAllCases() {
  const data = window.eddDataModel;
  if (!data || !data.getAllCases) return [];
  
  return data.getAllCases();
}

/**
 * Safe navigation helper
 */
function navigateTo(page, params = {}) {
  if (window.pathManager && window.pathManager.navigate) {
    window.pathManager.navigate(page, params);
  } else {
    window.location.href = `/edd_system/${page}.html`;
  }
}

/**
 * Safe API call helper
 */
async function safeAPICall(endpoint, options = {}) {
  if (window.pathManager && window.pathManager.fetchAPI) {
    return window.pathManager.fetchAPI(endpoint, options);
  } else {
    return fetch(endpoint, options).then(r => r.json());
  }
}

// ============================================================================
// AUTO-INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📊 Data Bridge initialized');
  console.log('✅ Unified Data Model:', window.eddDataModel ? 'Ready' : 'Not available');
  console.log('✅ Path Manager:', window.pathManager ? 'Ready' : 'Not available');
  console.log('🔄 Legacy Fallback:', window.EDDMockData ? 'Active' : 'Not needed');
  
  // Log available cases
  const totalCases = getTotalCases();
  console.log(`📝 Total cases loaded: ${totalCases}`);
});

// ============================================================================
// EXPORT FOR MODULES
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getTotalCases,
    getCasesCountByStatus,
    getCasesCountByRisk,
    getDashboardStats,
    getSystemStats,
    exportAllCases,
    navigateTo,
    safeAPICall
  };
}
