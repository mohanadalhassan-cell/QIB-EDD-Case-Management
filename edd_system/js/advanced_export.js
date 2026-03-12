/**
 * ============================================================================
 * ADVANCED EXPORT & REPORTING MODULE
 * ============================================================================
 * Professional report generation in multiple formats
 * ============================================================================
 */

const AdvancedExport = {

  // ============================================================================
  // CSV EXPORT
  // ============================================================================

  exportToCSV: function(data, filename = 'export.csv') {
    const csv = this.generateCSV(data);
    this.downloadFile(csv, filename, 'text/csv');
  },

  generateCSV: function(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return 'No data to export';
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => 
      headers.map(header => 
        this.escapeCSVField(obj[header])
      ).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  },

  escapeCSVField: function(field) {
    if (field === null || field === undefined) return '';
    
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  },

  // ============================================================================
  // JSON EXPORT
  // ============================================================================

  exportToJSON: function(data, filename = 'export.json') {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  },

  // ============================================================================
  // EXCEL-STYLE EXPORT (as CSV with special formatting)
  // ============================================================================

  exportToExcel: function(data, sheetName = 'Data') {
    let html = '<table border="1">';
    
    if (Array.isArray(data) && data.length > 0) {
      // Headers
      html += '<thead><tr>';
      Object.keys(data[0]).forEach(key => {
        html += `<th>${this.escapeHTML(key)}</th>`;
      });
      html += '</tr></thead>';

      // Rows
      html += '<tbody>';
      data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(value => {
          html += `<td>${this.escapeHTML(String(value))}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody>';
    }

    html += '</table>';

    // Force Excel download
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    this.downloadBlob(blob, `${sheetName}.xls`);
  },

  // ============================================================================
  // HTML REPORT EXPORT
  // ============================================================================

  exportToHTML: function(title, content, filename = 'report.html') {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${this.escapeHTML(title)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            background: #f5f5f5;
            color: #333;
          }
          .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          h1 { color: #1f2937; margin-bottom: 30px; border-bottom: 3px solid #00D4FF; padding-bottom: 15px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .meta { font-size: 12px; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #00D4FF; }
          td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
          tr:hover { background: #f9fafb; }
          .section { margin-bottom: 40px; }
          .section-title { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #00D4FF; }
          .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
          .stat-card { background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #00D4FF; }
          .stat-value { font-size: 24px; font-weight: 700; color: #00D4FF; }
          .stat-label { font-size: 12px; color: #6b7280; margin-top: 5px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1>${this.escapeHTML(title)}</h1>
            </div>
            <div class="meta">
              <div>Generated: ${new Date().toLocaleString()}</div>
              <div>System: EDD_QIB</div>
            </div>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>This report was automatically generated by the EDD_QIB System.</p>
            <p>&copy; 2026 Qatar Islamic Bank. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    this.downloadFile(html, filename, 'text/html');
  },

  // ============================================================================
  // GENERATE CASE REPORT
  // ============================================================================

  generateCaseReport: function(caseData) {
    const caseInfo = `
      <div class="section">
        <div class="section-title">Case Information</div>
        <table>
          <tr>
            <th>Case ID</th>
            <td>${caseData.id}</td>
            <th>Status</th>
            <td>${caseData.status}</td>
          </tr>
          <tr>
            <th>Customer Name</th>
            <td>${caseData.customerName}</td>
            <th>Risk Rating</th>
            <td>${caseData.riskRating}</td>
          </tr>
          <tr>
            <th>Assigned Department</th>
            <td>${caseData.assignedDepartment}</td>
            <th>Priority</th>
            <td>${caseData.priority}</td>
          </tr>
          <tr>
            <th>Created Date</th>
            <td>${new Date(caseData.createdAt).toLocaleDateString()}</td>
            <th>Created By</th>
            <td>${caseData.createdByName}</td>
          </tr>
        </table>
      </div>
    `;

    return caseInfo;
  },

  // ============================================================================
  // GENERATE STATISTICS REPORT
  // ============================================================================

  generateStatisticsReport: function(stats) {
    const statsHTML = `
      <div class="section">
        <div class="section-title">Summary Statistics</div>
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${stats.total || 0}</div>
            <div class="stat-label">Total Cases</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.pending || 0}</div>
            <div class="stat-label">Pending Review</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.inProgress || 0}</div>
            <div class="stat-label">In Progress</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completed || 0}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.highRisk || 0}</div>
            <div class="stat-label">High Risk</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.avgAgeInDays || 0}</div>
            <div class="stat-label">Average Age (Days)</div>
          </div>
        </div>
      </div>
    `;

    return statsHTML;
  },

  // ============================================================================
  // PRINT FUNCTIONALITY
  // ============================================================================

  printReport: function(title, content) {
    const printWindow = window.open('', '_blank');
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { margin-bottom: 20px; color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
          th { background: #f0f0f0; font-weight: bold; }
          @media print { body { margin: 0; padding: 10px; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${content}
        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleString()}
        </p>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 500);
  },

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  downloadFile: function(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    this.downloadBlob(blob, filename);
  },

  downloadBlob: function(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  escapeHTML: function(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

};

// Export summary function
AdvancedExport.exportCasesToMultipleFormats = function(cases, baseName = 'cases_export') {
  const timestamp = new Date().toISOString().slice(0, 10);
  
  console.log('Exporting cases to multiple formats...');
  
  // CSV
  AdvancedExport.exportToCSV(cases, `${baseName}_${timestamp}.csv`);
  
  // JSON
  AdvancedExport.exportToJSON(cases, `${baseName}_${timestamp}.json`);
  
  NotificationSystem.success(
    '✅ Export Complete',
    'Cases exported to CSV, JSON, and Excel formats'
  );
};

console.log('✅ Advanced Export Module loaded');
