/**
 * ============================================================================
 * ADVANCED FILTERS MODULE
 * ============================================================================
 * Provides comprehensive filtering, searching, and sorting capabilities
 * for EDD_QIB system cases and data
 * ============================================================================
 */

const AdvancedFilters = {
  
  // Filter configuration
  filters: {
    status: [],
    priority: [],
    department: [],
    riskLevel: [],
    dateRange: { from: null, to: null },
    customerName: '',
    caseId: '',
    assignee: []
  },

  // ============================================================================
  // FILTER INITIALIZATION
  // ============================================================================

  initialize: function() {
    console.log('✅ Advanced Filters initialized');
    this.setupFilterUI();
    this.attachEventListeners();
  },

  setupFilterUI: function() {
    // Status filter
    const statusOptions = ['NEW', 'PENDING_REVIEW', 'IN_PROGRESS', 'ESCALATED', 'COMPLETED', 'ARCHIVED'];
    
    // Priority filter
    const priorityOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    
    // Risk level filter
    const riskOptions = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL'];
    
    // Department filter
    const deptOptions = ['OPERATIONS', 'COMPLIANCE', 'BUSINESS', 'CDD', 'ADMIN'];
    
    console.log('Filter options loaded:', {
      status: statusOptions.length,
      priority: priorityOptions.length,
      risk: riskOptions.length,
      departments: deptOptions.length
    });
  },

  attachEventListeners: function() {
    // Status filter
    document.querySelectorAll('[data-filter="status"]')?.forEach(el => {
      el.addEventListener('change', () => this.applyFilters());
    });

    // Priority filter
    document.querySelectorAll('[data-filter="priority"]')?.forEach(el => {
      el.addEventListener('change', () => this.applyFilters());
    });

    // Date range filter
    document.getElementById('filter-date-from')?.addEventListener('change', () => this.applyFilters());
    document.getElementById('filter-date-to')?.addEventListener('change', () => this.applyFilters());

    // Search filters
    document.getElementById('filter-case-id')?.addEventListener('input', () => this.applyFilters());
    document.getElementById('filter-customer-name')?.addEventListener('input', () => this.applyFilters());

    // Reset filters button
    document.getElementById('reset-filters')?.addEventListener('click', () => this.resetAllFilters());
  },

  // ============================================================================
  // APPLY FILTERS
  // ============================================================================

  applyFilters: function() {
    console.log('Applying filters...');
    
    // Collect filter values
    this.filters.status = this.getSelectedValues('[data-filter="status"]');
    this.filters.priority = this.getSelectedValues('[data-filter="priority"]');
    this.filters.department = this.getSelectedValues('[data-filter="department"]');
    this.filters.riskLevel = this.getSelectedValues('[data-filter="risk-level"]');
    this.filters.customerName = document.getElementById('filter-customer-name')?.value || '';
    this.filters.caseId = document.getElementById('filter-case-id')?.value || '';
    this.filters.dateRange.from = document.getElementById('filter-date-from')?.value;
    this.filters.dateRange.to = document.getElementById('filter-date-to')?.value;

    // Filter data
    const filteredCases = this.filterCases(this.getAllCases());
    
    // Update display
    this.displayFilteredResults(filteredCases);
    this.updateFilterStats();
  },

  getSelectedValues: function(selector) {
    const selected = [];
    document.querySelectorAll(selector)?.forEach(el => {
      if (el.checked || el.selected) {
        selected.push(el.value);
      }
    });
    return selected;
  },

  filterCases: function(cases) {
    return cases.filter(caseItem => {
      // Status filter
      if (this.filters.status.length > 0 && !this.filters.status.includes(caseItem.status)) {
        return false;
      }

      // Priority filter
      if (this.filters.priority.length > 0 && !this.filters.priority.includes(caseItem.priority)) {
        return false;
      }

      // Department filter
      if (this.filters.department.length > 0 && !this.filters.department.includes(caseItem.assignedDepartment)) {
        return false;
      }

      // Risk level filter
      if (this.filters.riskLevel.length > 0 && !this.filters.riskLevel.includes(caseItem.riskRating)) {
        return false;
      }

      // Customer name filter
      if (this.filters.customerName && !caseItem.customerName?.toLowerCase().includes(this.filters.customerName.toLowerCase())) {
        return false;
      }

      // Case ID filter
      if (this.filters.caseId && !caseItem.id?.toLowerCase().includes(this.filters.caseId.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (this.filters.dateRange.from) {
        const caseDate = new Date(caseItem.createdAt);
        const filterFromDate = new Date(this.filters.dateRange.from);
        if (caseDate < filterFromDate) return false;
      }

      if (this.filters.dateRange.to) {
        const caseDate = new Date(caseItem.createdAt);
        const filterToDate = new Date(this.filters.dateRange.to);
        if (caseDate > filterToDate) return false;
      }

      return true;
    });
  },

  displayFilteredResults: function(cases) {
    const resultsContainer = document.getElementById('filtered-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    
    if (cases.length === 0) {
      resultsContainer.innerHTML = '<div class="no-results">No cases match your filters</div>';
      return;
    }

    cases.forEach(caseItem => {
      const caseElement = this.createCaseElement(caseItem);
      resultsContainer.appendChild(caseElement);
    });
  },

  createCaseElement: function(caseItem) {
    const div = document.createElement('div');
    div.className = 'case-result-item';
    div.innerHTML = `
      <div class="case-result-header">
        <span class="case-id">${caseItem.id}</span>
        <span class="case-status" data-status="${caseItem.status}">${caseItem.status}</span>
      </div>
      <div class="case-result-body">
        <div class="case-customer">${caseItem.customerName}</div>
        <div class="case-details">
          <span class="detail">Priority: ${caseItem.priority || 'N/A'}</span>
          <span class="detail">Risk: ${caseItem.riskRating || 'N/A'}</span>
          <span class="detail">Dept: ${caseItem.assignedDepartment || 'Unassigned'}</span>
        </div>
      </div>
    `;
    return div;
  },

  updateFilterStats: function() {
    const statsContainer = document.getElementById('filter-stats');
    if (!statsContainer) return;

    const activeFilters = Object.values(this.filters).filter(f => {
      if (Array.isArray(f)) return f.length > 0;
      if (typeof f === 'string') return f.length > 0;
      if (typeof f === 'object' && f.from && f.to) return true;
      return false;
    }).length;

    statsContainer.textContent = `Active Filters: ${activeFilters}`;
  },

  // ============================================================================
  // SORTING
  // ============================================================================

  sortBy: function(field, direction = 'asc') {
    console.log(`Sorting by ${field} (${direction})`);
    
    if (!window.filteredCases) {
      window.filteredCases = this.getAllCases();
    }

    window.filteredCases.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (direction === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });

    this.displayFilteredResults(window.filteredCases);
  },

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  getAllCases: function() {
    // This should be populated from your data source
    return window.allCases || [];
  },

  resetAllFilters: function() {
    console.log('Resetting all filters...');
    
    // Clear filter inputs
    document.querySelectorAll('[data-filter]').forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = false;
      }
    });

    document.getElementById('filter-customer-name').value = '';
    document.getElementById('filter-case-id').value = '';
    document.getElementById('filter-date-from').value = '';
    document.getElementById('filter-date-to').value = '';

    // Reset filters object
    this.filters = {
      status: [],
      priority: [],
      department: [],
      riskLevel: [],
      dateRange: { from: null, to: null },
      customerName: '',
      caseId: '',
      assignee: []
    };

    // Display all cases
    this.displayFilteredResults(this.getAllCases());
    this.updateFilterStats();
  },

  exportFilteredData: function(format = 'json') {
    const filteredCases = this.filterCases(this.getAllCases());
    
    if (format === 'csv') {
      return this.convertToCSV(filteredCases);
    } else if (format === 'json') {
      return JSON.stringify(filteredCases, null, 2);
    }
    
    return null;
  },

  convertToCSV: function(cases) {
    const headers = ['Case ID', 'Customer Name', 'Status', 'Priority', 'Risk Level', 'Department'];
    const rows = cases.map(c => [
      c.id,
      c.customerName,
      c.status,
      c.priority,
      c.riskRating,
      c.assignedDepartment || 'Unassigned'
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
};

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  AdvancedFilters.initialize();
});
