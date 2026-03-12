/**
 * ============================================================================
 * ADVANCED CHARTS & ANALYTICS MODULE
 * ============================================================================
 * Provides comprehensive charting and analytics for EDD_QIB system
 * ============================================================================
 */

const AnalyticsCharts = {
  
  charts: {},

  // ============================================================================
  // INITIALIZE CHARTS
  // ============================================================================

  initialize: function() {
    console.log('✅ Analytics Charts Module initialized');
    this.loadChartLibrary();
  },

  loadChartLibrary: function() {
    // Check if Chart.js is available, if not create simple charting
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not available, using simple charts');
      this.useSimpleCharts = true;
    }
  },

  // ============================================================================
  // CASE STATUS DISTRIBUTION
  // ============================================================================

  renderCaseStatusChart: function(containerId, caseData) {
    const data = this.aggregateCasesByStatus(caseData);
    
    const html = `
      <div class="chart-container" id="${containerId}">
        <h3>Case Status Distribution</h3>
        <div class="simple-bar-chart">
          ${Object.entries(data).map(([status, count]) => `
            <div class="chart-bar-row">
              <span class="bar-label">${status}</span>
              <div class="bar-container">
                <div class="bar" style="width: ${(count / Math.max(...Object.values(data))) * 100}%; background: ${this.getStatusColor(status)};">
                  <span class="bar-value">${count}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    return html;
  },

  aggregateCasesByStatus: function(cases) {
    const aggregate = {};
    (cases || []).forEach(caseItem => {
      aggregate[caseItem.status] = (aggregate[caseItem.status] || 0) + 1;
    });
    return aggregate;
  },

  getStatusColor: function(status) {
    const colors = {
      'NEW': '#00D4FF',
      'PENDING_REVIEW': '#F59E0B',
      'IN_PROGRESS': '#A855F7',
      'ESCALATED': '#EF4444',
      'COMPLETED': '#22C55E',
      'ARCHIVED': '#64748B'
    };
    return colors[status] || '#6B7280';
  },

  // ============================================================================
  // PRIORITY DISTRIBUTION
  // ============================================================================

  renderPriorityChart: function(containerId, caseData) {
    const data = this.aggregateCasesByPriority(caseData);
    
    const pieChart = this.createPieChart(data);
    
    return `
      <div class="chart-container" id="${containerId}">
        <h3>Priority Distribution</h3>
        ${pieChart}
      </div>
    `;
  },

  aggregateCasesByPriority: function(cases) {
    const aggregate = {};
    (cases || []).forEach(caseItem => {
      aggregate[caseItem.priority] = (aggregate[caseItem.priority] || 0) + 1;
    });
    return aggregate;
  },

  createPieChart: function(data) {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const colors = {
      'CRITICAL': '#EF4444',
      'HIGH': '#F59E0B',
      'MEDIUM': '#22C55E',
      'LOW': '#00D4FF'
    };

    let currentRotation = 0;
    const slices = Object.entries(data).map(([priority, count]) => {
      const percentage = (count / total) * 100;
      const degrees = (percentage / 100) * 360;
      const svg = `
        <g transform="rotate(${currentRotation} 50 50)">
          <circle cx="50" cy="50" r="40" fill="none" stroke="${colors[priority] || '#6B7280'}" 
                  stroke-width="20" stroke-dasharray="${degrees * 0.628} 251.2" 
                  opacity="0.8"/>
        </g>
      `;
      currentRotation += degrees;
      return svg;
    }).join('');

    return `
      <div style="display: flex; align-items: center; justify-content: space-around;">
        <svg width="120" height="120" viewBox="0 0 100 100">
          ${slices}
        </svg>
        <div class="legend">
          ${Object.entries(data).map(([priority, count]) => `
            <div class="legend-item">
              <span class="legend-color" style="background: ${colors[priority] || '#6B7280'};"></span>
              <span>${priority}: ${count} (${((count/total)*100).toFixed(1)}%)</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ============================================================================
  // TREND ANALYSIS
  // ============================================================================

  renderTrendChart: function(containerId, caseData, days = 30) {
    const trends = this.calculateTrends(caseData, days);
    
    return `
      <div class="chart-container" id="${containerId}">
        <h3>Case Trends (Last ${days} Days)</h3>
        <div class="trend-chart">
          ${this.createTrendLine(trends)}
        </div>
      </div>
    `;
  },

  calculateTrends: function(cases, days) {
    const trends = {};
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      trends[dateStr] = (cases || []).filter(c => {
        const caseDate = new Date(c.createdAt).toISOString().split('T')[0];
        return caseDate === dateStr;
      }).length;
    }
    
    return trends;
  },

  createTrendLine: function(trends) {
    const values = Object.values(trends);
    const max = Math.max(...values, 1);
    const dates = Object.keys(trends);

    return `
      <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 200px; gap: 2px;">
        ${dates.map((date, idx) => {
          const height = (trends[date] / max) * 180;
          return `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
              <div style="height: ${height}px; width: 20px; background: linear-gradient(180deg, #00D4FF 0%, #0288D1 100%); border-radius: 4px 4px 0 0;"></div>
              <span style="font-size: 10px; color: var(--text-muted);">${date.slice(5)}</span>
              <span style="font-size: 11px; font-weight: 600;">${trends[date]}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ============================================================================
  // RISK ANALYSIS
  // ============================================================================

  renderRiskMatrix: function(containerId, caseData) {
    const riskData = this.buildRiskMatrix(caseData);
    
    return `
      <div class="chart-container" id="${containerId}">
        <h3>Risk Distribution Matrix</h3>
        <div class="risk-matrix">
          ${this.createRiskMatrixGrid(riskData)}
        </div>
      </div>
    `;
  },

  buildRiskMatrix: function(cases) {
    const matrix = {};
    const risks = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL'];
    const statuses = ['NEW', 'IN_PROGRESS', 'PENDING_REVIEW', 'ESCALATED', 'COMPLETED'];
    
    risks.forEach(risk => {
      matrix[risk] = {};
      statuses.forEach(status => {
        matrix[risk][status] = (cases || []).filter(c => 
          c.riskRating === risk && c.status === status
        ).length;
      });
    });
    
    return matrix;
  },

  createRiskMatrixGrid: function(matrix) {
    return `
      <table class="risk-matrix-table">
        <thead>
          <tr>
            <th>Risk Level</th>
            <th>New</th>
            <th>In Progress</th>
            <th>Pending Review</th>
            <th>Escalated</th>
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(matrix).map(([risk, statuses]) => `
            <tr>
              <td class="risk-label" style="background: ${this.getRiskColor(risk)}; color: white; font-weight: 600;">${risk}</td>
              ${Object.values(statuses).map(count => `
                <td style="text-align: center; background: ${this.getRiskColor(risk, 0.1)}; color: white; font-weight: 600;">
                  ${count}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },

  getRiskColor: function(risk, opacity = 1) {
    const colors = {
      'CRITICAL': `rgba(239, 68, 68, ${opacity})`,
      'HIGH': `rgba(245, 158, 11, ${opacity})`,
      'MEDIUM': `rgba(59, 130, 246, ${opacity})`,
      'LOW': `rgba(34, 197, 94, ${opacity})`,
      'MINIMAL': `rgba(107, 114, 128, ${opacity})`
    };
    return colors[risk] || `rgba(107, 114, 128, ${opacity})`;
  },

  // ============================================================================
  // DEPARTMENT WORKLOAD
  // ============================================================================

  renderDepartmentWorkload: function(containerId, caseData) {
    const workload = this.calculateDepartmentWorkload(caseData);
    
    return `
      <div class="chart-container" id="${containerId}">
        <h3>Department Workload</h3>
        <div class="workload-chart">
          ${Object.entries(workload).map(([dept, count]) => `
            <div class="workload-item">
              <div class="workload-label">${dept}</div>
              <div class="workload-bar-bg">
                <div class="workload-bar" style="width: ${(count / Math.max(...Object.values(workload))) * 100}%;">
                  ${count}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  calculateDepartmentWorkload: function(cases) {
    const workload = {};
    (cases || []).forEach(caseItem => {
      const dept = caseItem.assignedDepartment || 'Unassigned';
      workload[dept] = (workload[dept] || 0) + 1;
    });
    return workload;
  },

  // ============================================================================
  // DASHBOARD STATS
  // ============================================================================

  generateDashboardStats: function(cases) {
    const stats = {
      total: cases.length,
      pending: cases.filter(c => c.status === 'NEW' || c.status === 'PENDING_REVIEW').length,
      inProgress: cases.filter(c => c.status === 'IN_PROGRESS').length,
      escalated: cases.filter(c => c.status === 'ESCALATED').length,
      completed: cases.filter(c => c.status === 'COMPLETED').length,
      highRisk: cases.filter(c => c.riskRating === 'CRITICAL' || c.riskRating === 'HIGH').length,
      avgAgeInDays: this.calculateAverageAge(cases),
      overdueCases: this.countOverdueCases(cases)
    };
    
    return stats;
  },

  calculateAverageAge: function(cases) {
    if (cases.length === 0) return 0;
    const totalDays = cases.reduce((sum, c) => {
      const days = (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0);
    return Math.round(totalDays / cases.length);
  },

  countOverdueCases: function(cases) {
    // Count cases older than 15 days without completion
    return cases.filter(c => {
      if (c.status === 'COMPLETED') return false;
      const days = (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60 * 24);
      return days > 15;
    }).length;
  }

};

// Initialize on document ready
document.addEventListener('DOMContentLoaded', () => {
  AnalyticsCharts.initialize();
});
