/**
 * CDD/EDD Case Manager
 * Handles all case operations: loading, creating, querying, and workflow progression
 * Data stored in sessionStorage for demo purposes
 */

class CaseManager {
  constructor() {
    this.cases = [];
    this.storageKey = 'edd_cases';
    this.caseCounterKey = 'edd_case_counter';
    
    // Initialize from storage or create new
    this.loadCases();
  }

  /**
   * CASE STATUS TO WORKFLOW STAGE MAPPING
   */
  static STATUS_STAGES = {
    'PENDING_CDD': {
      stage: 'Pending CDD Review',
      icon: 'calendar',
      color: '#FF5252',
      priority: 1
    },
    'MAKER_REVIEW': {
      stage: 'Awaiting Maker',
      icon: 'edit',
      color: '#FFA726',
      priority: 2
    },
    'CHECKER_REVIEW': {
      stage: 'Awaiting Checker',
      icon: 'shield',
      color: '#00D4FF',
      priority: 3
    },
    'COMPLETED': {
      stage: 'Completed',
      icon: 'check_circle',
      color: '#00E676',
      priority: 4
    },
    'ESCALATED_COMPLIANCE': {
      stage: 'Escalated to Compliance',
      icon: 'warning',
      color: '#FF5252',
      priority: 5
    }
  };

  /**
   * Load cases from sessionStorage or initialize with default cases
   */
  loadCases() {
    const stored = sessionStorage.getItem(this.storageKey);
    
    if (stored) {
      try {
        this.cases = JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse stored cases, initializing fresh');
        this.initializeDefaultCases();
      }
    } else {
      this.initializeDefaultCases();
    }
  }

  /**
   * Initialize system with high-risk customer cases on first load
   */
  initializeDefaultCases() {
    this.cases = [];
    
    // Reset counter
    sessionStorage.setItem(this.caseCounterKey, '1000');
    
    // Create cases from high-risk customers
    if (typeof EDDMockData !== 'undefined' && EDDMockData.customers) {
      const highRiskCustomers = EDDMockData.customers.filter(c => 
        c.riskClassification === 'High' || c.isPEP === true
      );
      
      // Distribute statuses across stages for demo variety
      highRiskCustomers.forEach((customer, index) => {
        const statuses = ['PENDING_CDD', 'MAKER_REVIEW', 'CHECKER_REVIEW', 'COMPLETED', 'ESCALATED_COMPLIANCE'];
        const status = statuses[index % statuses.length];
        
        const newCase = this.createCase({
          customer_id: customer.rim,
          rim: customer.rim,
          sector: customer.riskScores?.SECTOR || 'PB',
          created_date: this.addDaysToDate(new Date(), -Math.floor(Math.random() * 20)),
          case_status: status
        });
        
        this.cases.push(newCase);
      });
    }
    
    // Save to storage
    this.saveCases();
  }

  /**
   * Helper: Add days to a date
   */
  addDaysToDate(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  }

  /**
   * Create a new case with auto-generated ID
   */
  createCase(caseData) {
    const counter = parseInt(sessionStorage.getItem(this.caseCounterKey) || '1000') + 1;
    sessionStorage.setItem(this.caseCounterKey, counter.toString());
    
    const year = new Date().getFullYear();
    const caseId = `EDD-${year}-${String(counter).padStart(6, '0')}`;
    
    const customer = this.findCustomer(caseData.customer_id || caseData.rim);
    const assignedUser = this.getNextAvailableCDDAnalyst();
    
    const newCase = {
      case_id: caseId,
      customer_id: caseData.customer_id || caseData.rim,
      rim: caseData.rim || caseData.customer_id,
      sector: caseData.sector || 'PB',
      risk_level: caseData.risk_level || (customer?.riskClassification === 'High' ? 'HIGH' : 'MEDIUM'),
      case_status: caseData.case_status || 'PENDING_CDD',
      created_date: caseData.created_date || new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0],
      assigned_user: caseData.assigned_user || assignedUser,
      maker_user: caseData.maker_user || null,
      checker_user: caseData.checker_user || null,
      escalated_to: caseData.escalated_to || null,
      case_notes: caseData.case_notes || '',
      document_count: caseData.document_count || 0,
      review_frequency: caseData.review_frequency || 'Annual',
      customer_name: customer?.name || 'Unknown Customer',
      triggers: customer?.triggers || []
    };
    
    return newCase;
  }

  /**
   * Find customer by RIM
   */
  findCustomer(rim) {
    if (typeof EDDMockData !== 'undefined' && EDDMockData.customers) {
      return EDDMockData.customers.find(c => c.rim === rim);
    }
    return null;
  }

  /**
   * Get next available CDD analyst for assignment
   */
  getNextAvailableCDDAnalyst() {
    // List of CDD analysts from users
    const cddAnalysts = ['EMP002', 'EMP003', 'EMP006'];
    
    // Simple round-robin assignment
    const assigned = this.cases.filter(c => c.assigned_user && cddAnalysts.includes(c.assigned_user));
    const assignmentCounts = {};
    cddAnalysts.forEach(emp => {
      assignmentCounts[emp] = assigned.filter(c => c.assigned_user === emp).length;
    });
    
    const leastAssigned = cddAnalysts.reduce((prev, current) =>
      assignmentCounts[current] < assignmentCounts[prev] ? current : prev
    );
    
    return leastAssigned;
  }

  /**
   * Save all cases to sessionStorage
   */
  saveCases() {
    sessionStorage.setItem(this.storageKey, JSON.stringify(this.cases));
  }

  /**
   * Add a new case to the system
   */
  addCase(caseData) {
    const newCase = this.createCase(caseData);
    this.cases.push(newCase);
    this.saveCases();
    return newCase;
  }

  /**
   * Get case by ID
   */
  getCaseById(caseId) {
    return this.cases.find(c => c.case_id === caseId);
  }

  /**
   * Get all cases by status
   */
  getCasesByStatus(status) {
    return this.cases.filter(c => c.case_status === status);
  }

  /**
   * Get all cases by sector
   */
  getCasesBySector(sector) {
    return this.cases.filter(c => c.sector === sector);
  }

  /**
   * Get all cases by assigned user
   */
  getCasesByUser(userId) {
    return this.cases.filter(c => c.assigned_user === userId);
  }

  /**
   * Get case count by status
   */
  getCountByStatus(status) {
    return this.getCasesByStatus(status).length;
  }

  /**
   * Get all counts grouped by status
   */
  getCountsByStatus() {
    const counts = {};
    Object.keys(CaseManager.STATUS_STAGES).forEach(status => {
      counts[status] = this.getCountByStatus(status);
    });
    return counts;
  }

  /**
   * Update case status (workflow progression)
   */
  updateCaseStatus(caseId, newStatus, userId = null) {
    const caseObj = this.getCaseById(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }
    
    const validStatuses = Object.keys(CaseManager.STATUS_STAGES);
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    
    caseObj.case_status = newStatus;
    caseObj.last_updated = new Date().toISOString().split('T')[0];
    
    // Track who updated what status
    if (newStatus === 'MAKER_REVIEW' && !caseObj.maker_user) {
      caseObj.maker_user = userId || caseObj.assigned_user;
    } else if (newStatus === 'CHECKER_REVIEW' && !caseObj.checker_user) {
      caseObj.checker_user = userId || caseObj.assigned_user;
    } else if (newStatus === 'ESCALATED_COMPLIANCE' && !caseObj.escalated_to) {
      caseObj.escalated_to = userId || caseObj.assigned_user;
    }
    
    this.saveCases();
    return caseObj;
  }

  /**
   * Add note to case
   */
  addCaseNote(caseId, note) {
    const caseObj = this.getCaseById(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }
    
    caseObj.case_notes = (caseObj.case_notes || '') + '\n' + note;
    caseObj.last_updated = new Date().toISOString().split('T')[0];
    this.saveCases();
    return caseObj;
  }

  /**
   * Assign case to user
   */
  assignCase(caseId, userId) {
    const caseObj = this.getCaseById(caseId);
    if (!caseObj) {
      throw new Error(`Case ${caseId} not found`);
    }
    
    caseObj.assigned_user = userId;
    caseObj.last_updated = new Date().toISOString().split('T')[0];
    this.saveCases();
    return caseObj;
  }

  /**
   * Search cases by case ID or customer name
   */
  searchCases(query) {
    const q = query.toLowerCase().trim();
    return this.cases.filter(c =>
      c.case_id.toLowerCase().includes(q) ||
      c.customer_name.toLowerCase().includes(q) ||
      c.rim.toLowerCase().includes(q)
    );
  }

  /**
   * Get all cases with optional filtering
   */
  getAllCases(filters = {}) {
    let result = [...this.cases];
    
    if (filters.status) {
      result = result.filter(c => c.case_status === filters.status);
    }
    
    if (filters.sector) {
      result = result.filter(c => c.sector === filters.sector);
    }
    
    if (filters.assignedUser) {
      result = result.filter(c => c.assigned_user === filters.assignedUser);
    }
    
    if (filters.riskLevel) {
      result = result.filter(c => c.risk_level === filters.riskLevel);
    }
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(c =>
        c.case_id.toLowerCase().includes(q) ||
        c.customer_name.toLowerCase().includes(q) ||
        c.rim.toLowerCase().includes(q)
      );
    }
    
    // Sort by most recently updated
    result.sort((a, b) => new Date(b.last_updated) - new Date(a.last_updated));
    
    return result;
  }

  /**
   * Get stats summary
   */
  getStats() {
    return {
      total: this.cases.length,
      byStatus: this.getCountsByStatus(),
      byRiskLevel: {
        HIGH: this.cases.filter(c => c.risk_level === 'HIGH').length,
        MEDIUM: this.cases.filter(c => c.risk_level === 'MEDIUM').length,
        LOW: this.cases.filter(c => c.risk_level === 'LOW').length
      },
      bySector: {
        PB: this.cases.filter(c => c.sector === 'PB').length,
        TZ: this.cases.filter(c => c.sector === 'TZ').length,
        MS: this.cases.filter(c => c.sector === 'MS').length
      },
      averageAgeDays: Math.round(
        this.cases.reduce((sum, c) => {
          const days = Math.floor((new Date() - new Date(c.created_date)) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / Math.max(this.cases.length, 1)
      ),
      overdueCases: this.cases.filter(c => {
        const days = Math.floor((new Date() - new Date(c.created_date)) / (1000 * 60 * 60 * 24));
        return days > 30 && c.case_status !== 'COMPLETED';
      }).length
    };
  }

  /**
   * Clear all cases and reset
   */
  resetCases() {
    this.cases = [];
    sessionStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.caseCounterKey);
  }
}

// Initialize global instance
let caseManager = null;
if (typeof window !== 'undefined') {
  window.caseManager = null; // Will be initialized after DOM loads
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    if (!window.caseManager) {
      window.caseManager = new CaseManager();
    }
  });
  
  // Also create instance if DOM already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.caseManager) {
        window.caseManager = new CaseManager();
      }
    });
  } else {
    if (!window.caseManager) {
      window.caseManager = new CaseManager();
    }
  }
}
