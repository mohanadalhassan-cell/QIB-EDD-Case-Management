/**
 * QIB EDD System - Export Reports Module
 * ======================================
 * Generates professional reports and presentations:
 * - PDF Case Report
 * - Excel Data Export
 * - PowerPoint Presentation
 * - Financial Analysis Report
 * 
 * Data Sources: T24, ETL, SnapView, Risk Dataset
 */

const ExportReports = {

  // =====================================================
  // PDF REPORT GENERATOR
  // =====================================================

  generatePDFReport: function(caseId, customerRim) {
    const eddCase = MockData.eddCases.find(c => c.caseId === caseId) || MockData.eddCases[0];
    const customer = MockData.customers.find(c => c.rim === customerRim);
    const financialProfile = EnterpriseFeatures.getFinancialProfile(customerRim);
    const expectedActivity = EnterpriseFeatures.getExpectedActivity(customerRim);
    const network = EnterpriseFeatures.getCustomerNetwork(customerRim);
    
    if (!eddCase || !customer) {
      alert('Case data not available');
      return;
    }

    // Calculate financial behavior indicators
    const financialAnalysis = this.analyzeFinancialBehavior(financialProfile, expectedActivity, customer);

    // Generate HTML content for PDF
    const reportHTML = this.generatePDFHTML(eddCase, customer, financialProfile, expectedActivity, financialAnalysis, network);
    
    // Open print dialog (browser will handle PDF save)
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  },

  generatePDFHTML: function(eddCase, customer, financial, activity, analysis, network) {
    const formatCurrency = (amt) => amt ? amt.toLocaleString() + ' QAR' : 'N/A';
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : 'N/A';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EDD Case Report - ${eddCase.caseId}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 1.5; color: #333; }
    .header { background: linear-gradient(135deg, #1a237e, #0d47a1); color: white; padding: 20px; margin-bottom: 20px; }
    .header h1 { font-size: 24px; margin-bottom: 5px; }
    .header .subtitle { font-size: 12px; opacity: 0.9; }
    .header .logo { float: right; font-size: 32px; font-weight: bold; }
    .section { margin-bottom: 20px; page-break-inside: avoid; }
    .section-title { background: #f5f5f5; padding: 8px 12px; font-size: 14px; font-weight: 600; border-left: 4px solid #1a237e; margin-bottom: 10px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .field { background: #fafafa; padding: 10px; border-radius: 4px; }
    .field-label { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .field-value { font-size: 13px; font-weight: 600; color: #1a237e; }
    .field-value.risk-high { color: #d32f2f; }
    .field-value.risk-medium { color: #f57c00; }
    .field-value.risk-low { color: #388e3c; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { background: #1a237e; color: white; padding: 8px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #e0e0e0; }
    tr:nth-child(even) { background: #f5f5f5; }
    .risk-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 10px; font-weight: 600; }
    .risk-badge.high { background: #ffebee; color: #d32f2f; }
    .risk-badge.medium { background: #fff3e0; color: #f57c00; }
    .risk-badge.low { background: #e8f5e9; color: #388e3c; }
    .indicator { padding: 10px; margin-bottom: 8px; border-left: 4px solid; border-radius: 0 4px 4px 0; }
    .indicator.critical { background: #ffebee; border-color: #d32f2f; }
    .indicator.high { background: #fff3e0; border-color: #f57c00; }
    .indicator.medium { background: #fff8e1; border-color: #ffc107; }
    .indicator.low { background: #e8f5e9; border-color: #388e3c; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 2px solid #1a237e; font-size: 9px; color: #666; }
    .page-break { page-break-before: always; }
    .summary-box { background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .summary-score { font-size: 48px; font-weight: bold; color: #1a237e; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: rgba(0,0,0,0.03); z-index: -1; }
  </style>
</head>
<body>
  <div class="watermark">QIB CONFIDENTIAL</div>
  
  <!-- Header -->
  <div class="header">
    <div class="logo">QIB</div>
    <h1>EDD Case Investigation Report</h1>
    <div class="subtitle">تقرير التحقق المعزز من العناية الواجبة — Decision Support System</div>
    <div class="subtitle">Case ID: ${eddCase.caseId} | Generated: ${new Date().toLocaleString()}</div>
  </div>

  <!-- DSS Notice -->
  <div class="section">
    <div style="background: #e3f2fd; border: 2px solid #2196F3; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
      <strong>ℹ️ Decision Support System Notice</strong><br/>
      <span style="font-size: 10px;">This report presents indicators for employee review. The system does NOT generate automated risk scores or decisions. Final assessment is the responsibility of the reviewing officer.</span>
    </div>
  </div>

  <!-- Indicators Summary -->
  <div class="section">
    <div class="section-title">🔍 Indicators Detected — المؤشرات المكتشفة</div>
    <div class="summary-box">
      <div class="grid">
        <div style="text-align: center;">
          <div class="summary-score">${analysis.riskFactors.length}</div>
          <div style="font-size: 14px; font-weight: 600;">Indicators Detected</div>
          <span style="font-size: 11px; color: #666;">Employee Assessment Required</span>
        </div>
        <div>
          <h4 style="margin-bottom: 10px;">Observations for Review:</h4>
          ${analysis.riskFactors.map(f => `
            <div class="indicator ${f.severity.toLowerCase()}">
              <strong>${f.type}</strong><br/>
              ${f.description}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- Customer Information -->
  <div class="section">
    <div class="section-title">👤 Customer Information — معلومات العميل</div>
    <div class="grid">
      <div class="field"><div class="field-label">Customer Name</div><div class="field-value">${customer.name}</div></div>
      <div class="field"><div class="field-label">Arabic Name</div><div class="field-value">${customer.nameAr}</div></div>
      <div class="field"><div class="field-label">RIM Number</div><div class="field-value">${customer.rim}</div></div>
      <div class="field"><div class="field-label">QID</div><div class="field-value">${customer.qid}</div></div>
      <div class="field"><div class="field-label">Nationality</div><div class="field-value">${customer.nationality}</div></div>
      <div class="field"><div class="field-label">Segment</div><div class="field-value">${customer.segment}</div></div>
      <div class="field"><div class="field-label">Occupation</div><div class="field-value">${customer.occupation || 'N/A'}</div></div>
      <div class="field"><div class="field-label">Employer</div><div class="field-value">${customer.employer || 'N/A'}</div></div>
    </div>
  </div>

  <!-- Case Details -->
  <div class="section">
    <div class="section-title">📋 Case Details — تفاصيل الحالة</div>
    <div class="grid">
      <div class="field"><div class="field-label">Case ID</div><div class="field-value">${eddCase.caseId}</div></div>
      <div class="field"><div class="field-label">Status</div><div class="field-value">${eddCase.status}</div></div>
      <div class="field"><div class="field-label">Trigger Source</div><div class="field-value">${eddCase.triggerSource}</div></div>
      <div class="field"><div class="field-label">Created Date</div><div class="field-value">${formatDate(eddCase.createdDate)}</div></div>
      <div class="field"><div class="field-label">Due Date</div><div class="field-value">${formatDate(eddCase.dueDate)}</div></div>
      <div class="field"><div class="field-label">Priority</div><div class="field-value">${eddCase.priority}</div></div>
    </div>
    <div style="margin-top: 10px;">
      <div class="field-label">Triggers</div>
      <div>${eddCase.triggers.map(t => `<span class="risk-badge high">${t}</span>`).join(' ')}</div>
    </div>
  </div>

  <!-- Financial Profile Analysis -->
  <div class="section page-break">
    <div class="section-title">💰 Financial Profile Analysis — تحليل الملف المالي</div>
    ${financial ? `
    <div class="grid-3">
      <div class="field"><div class="field-label">SALARY (Declared)</div><div class="field-value">${formatCurrency(financial.SALARY)}</div></div>
      <div class="field"><div class="field-label">LAST_SAL_AMT (Actual)</div><div class="field-value ${analysis.incomeVariance > 100 ? 'risk-high' : ''}">${formatCurrency(financial.LAST_SAL_AMT)}</div></div>
      <div class="field"><div class="field-label">AVG_LAST_3_SALARY</div><div class="field-value">${formatCurrency(financial.AVG_LAST_3_SALARY)}</div></div>
      <div class="field"><div class="field-label">ANNUAL_INC</div><div class="field-value">${formatCurrency(financial.ANNUAL_INC)}</div></div>
      <div class="field"><div class="field-label">SEC_INC_AMT</div><div class="field-value">${formatCurrency(financial.SEC_INC_AMT)}</div></div>
      <div class="field"><div class="field-label">LAST_SAL_DA</div><div class="field-value">${financial.LAST_SAL_DA}</div></div>
    </div>

    <!-- Income Consistency Analysis -->
    <div style="margin-top: 15px; padding: 15px; background: ${analysis.incomeConsistent ? '#e8f5e9' : '#ffebee'}; border-radius: 8px;">
      <h4>Income Consistency Check</h4>
      <table style="margin-top: 10px;">
        <tr><td><strong>Declared Salary (SALARY)</strong></td><td>${formatCurrency(financial.SALARY)}</td></tr>
        <tr><td><strong>Actual Salary (LAST_SAL_AMT)</strong></td><td>${formatCurrency(financial.LAST_SAL_AMT)}</td></tr>
        <tr><td><strong>Income Variance</strong></td><td style="color: ${analysis.incomeVariance > 100 ? '#d32f2f' : analysis.incomeVariance > 50 ? '#f57c00' : '#388e3c'};">${analysis.incomeVariance.toFixed(1)}%</td></tr>
        <tr><td><strong>Annual Financial Capacity</strong></td><td>${formatCurrency(financial.LAST_SAL_AMT * 12)}</td></tr>
        <tr><td><strong>Status</strong></td><td><span class="risk-badge ${analysis.incomeConsistent ? 'low' : 'high'}">${analysis.incomeConsistent ? 'CONSISTENT' : 'INCONSISTENT'}</span></td></tr>
      </table>
      ${!analysis.incomeConsistent ? `
      <div class="indicator critical" style="margin-top: 10px;">
        <strong>⚠️ Income Inconsistency Detected</strong><br/>
        Declared salary does not match actual salary received. This may indicate undisclosed income sources or potential money laundering risk.
      </div>
      ` : ''}
    </div>
    ` : '<p>Financial profile data not available</p>'}
  </div>

  <!-- Expected vs Actual Activity -->
  <div class="section">
    <div class="section-title">📊 Expected vs Actual Activity — النشاط المتوقع مقابل الفعلي</div>
    ${activity ? `
    <div class="grid-3">
      <div class="field"><div class="field-label">LM_EXP_CASH</div><div class="field-value">${formatCurrency(activity.LM_EXP_CASH)}</div></div>
      <div class="field"><div class="field-label">LM_EXP_NONCASH</div><div class="field-value">${formatCurrency(activity.LM_EXP_NONCASH)}</div></div>
      <div class="field"><div class="field-label">LM_EXP_TRFR</div><div class="field-value">${formatCurrency(activity.LM_EXP_TRFR)}</div></div>
    </div>
    <div style="margin-top: 15px;">
      <table>
        <tr><th>Metric</th><th>Expected</th><th>Capacity</th><th>Status</th></tr>
        <tr>
          <td>Monthly Activity</td>
          <td>${formatCurrency(activity.LM_EXP_CASH + activity.LM_EXP_NONCASH + activity.LM_EXP_TRFR)}</td>
          <td>${formatCurrency(financial ? financial.LAST_SAL_AMT * 2 : 0)}</td>
          <td><span class="risk-badge ${analysis.activityWithinCapacity ? 'low' : 'high'}">${analysis.activityWithinCapacity ? 'WITHIN CAPACITY' : 'EXCEEDS CAPACITY'}</span></td>
        </tr>
        <tr>
          <td>Annual Turnover</td>
          <td>${formatCurrency(activity.ANNUAL_EXP_TURNOVER)}</td>
          <td>${formatCurrency(financial ? financial.LAST_SAL_AMT * 12 : 0)}</td>
          <td><span class="risk-badge ${activity.DEVIATION_FLAG ? 'high' : 'low'}">${activity.DEVIATION_FLAG ? 'DEVIATION' : 'NORMAL'}</span></td>
        </tr>
      </table>
    </div>
    ` : '<p>Expected activity data not available</p>'}
  </div>

  <!-- Risk Classification -->
  <div class="section">
    <div class="section-title">⚠️ Risk Classification Model — نموذج تصنيف المخاطر</div>
    ${customer.riskScores ? `
    <table>
      <tr><th>Risk Dimension</th><th>Score</th><th>Category</th><th>Weight</th></tr>
      <tr><td>Product Risk (PROD_RISK)</td><td>${customer.riskScores.PROD_RISK_SCORE}</td><td><span class="risk-badge ${customer.riskScores.PROD_RISK_CATEG.toLowerCase()}">${customer.riskScores.PROD_RISK_CATEG}</span></td><td>20%</td></tr>
      <tr><td>Activity Risk (ACT_RISK)</td><td>${customer.riskScores.ACT_RISK_SCORE}</td><td><span class="risk-badge ${customer.riskScores.ACT_RISK_CATEG.toLowerCase()}">${customer.riskScores.ACT_RISK_CATEG}</span></td><td>25%</td></tr>
      <tr><td>Occupation Risk (OCCP_RISK)</td><td>${customer.riskScores.OCCP_RISK_SCORE}</td><td><span class="risk-badge ${customer.riskScores.OCCP_RISK_CATEG.toLowerCase()}">${customer.riskScores.OCCP_RISK_CATEG}</span></td><td>20%</td></tr>
      <tr><td>Country Risk (COUNTRY_RISK)</td><td>${customer.riskScores.COUNTRY_RISK_SCORE}</td><td><span class="risk-badge ${customer.riskScores.COUNTRY_RISK_CATEG.toLowerCase()}">${customer.riskScores.COUNTRY_RISK_CATEG}</span></td><td>20%</td></tr>
      <tr style="background: #e3f2fd;"><td><strong>FINAL RISK</strong></td><td><strong>${customer.riskScores.FINAL_RISK_SCORE}</strong></td><td><span class="risk-badge ${customer.riskScores.FINAL_RISK_CATEG.toLowerCase().replace(' ', '-')}">${customer.riskScores.FINAL_RISK_CATEG}</span></td><td>100%</td></tr>
    </table>
    ${customer.riskScores.AUTO_HIGH_REASONS && customer.riskScores.AUTO_HIGH_REASONS.length > 0 ? `
    <div class="indicator critical" style="margin-top: 10px;">
      <strong>🚨 AUTO HIGH Classification Triggered</strong><br/>
      ${customer.riskScores.AUTO_HIGH_REASONS.join(', ')}
    </div>
    ` : ''}
    ` : '<p>Risk scores not available</p>'}
  </div>

  <!-- Network Connections -->
  ${network ? `
  <div class="section page-break">
    <div class="section-title">🕸️ Relationship Network — شبكة العلاقات</div>
    <table>
      <tr><th>Related Entity</th><th>Type</th><th>Relationship</th><th>Ownership %</th><th>Risk Flag</th></tr>
      ${network.relatedNodes.map(node => `
        <tr>
          <td>${node.name}<br/><small style="color: #666;">${node.nameAr}</small></td>
          <td>${node.type}</td>
          <td>${node.relationship}</td>
          <td>${node.ownershipPct ? node.ownershipPct + '%' : '-'}</td>
          <td>${node.isPEP ? '<span class="risk-badge high">PEP</span>' : '<span class="risk-badge low">Normal</span>'}</td>
        </tr>
      `).join('')}
    </table>
    <div style="margin-top: 15px;">
      <h4>Connected Accounts Summary</h4>
      <table>
        <tr><th>Account</th><th>Type</th><th>Balance</th><th>Status</th></tr>
        ${network.accounts.map(acc => `
          <tr>
            <td>${acc.number}</td>
            <td>${acc.type}</td>
            <td>${formatCurrency(acc.balance)}</td>
            <td><span class="risk-badge ${acc.status === 'Active' ? 'low' : 'medium'}">${acc.status}</span></td>
          </tr>
        `).join('')}
        <tr style="background: #e3f2fd;">
          <td colspan="2"><strong>Total Exposure</strong></td>
          <td colspan="2"><strong>${formatCurrency(network.accounts.reduce((sum, a) => sum + a.balance, 0))}</strong></td>
        </tr>
      </table>
    </div>
  </div>
  ` : ''}

  <!-- Recommendation -->
  <div class="section">
    <div class="section-title">📝 Investigation Summary & Recommendation</div>
    <div style="padding: 15px; background: #f5f5f5; border-radius: 8px;">
      <h4>Summary of Findings:</h4>
      <ul style="margin: 10px 0 10px 20px;">
        ${analysis.riskFactors.map(f => `<li>${f.description}</li>`).join('')}
      </ul>
      
      <h4>Recommendation:</h4>
      <div class="indicator ${analysis.overallRisk === 'HIGH' || analysis.overallRisk === 'AUTO HIGH' ? 'critical' : analysis.overallRisk === 'MEDIUM' ? 'high' : 'low'}" style="margin-top: 10px;">
        ${analysis.recommendation}
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="grid">
      <div>
        <strong>Qatar Islamic Bank - Operations Division</strong><br/>
        EDD Case Management System v2.1<br/>
        Document Classification: CONFIDENTIAL
      </div>
      <div style="text-align: right;">
        Generated: ${new Date().toLocaleString()}<br/>
        Case ID: ${eddCase.caseId}<br/>
        Report ID: RPT-${Date.now()}
      </div>
    </div>
  </div>
</body>
</html>
    `;
  },

  // =====================================================
  // FINANCIAL BEHAVIOR ANALYSIS
  // =====================================================

  analyzeFinancialBehavior: function(financial, activity, customer) {
    const analysis = {
      riskScore: 0,
      overallRisk: 'LOW',
      incomeVariance: 0,
      incomeConsistent: true,
      activityWithinCapacity: true,
      riskFactors: [],
      recommendation: ''
    };

    if (!financial) {
      analysis.riskFactors.push({
        type: 'DATA_GAP',
        description: 'Financial profile data not available',
        severity: 'MEDIUM'
      });
      analysis.riskScore += 20;
    } else {
      // Rule 1: Income Variance Check
      // LAST_SAL_AMT is the actual verified salary
      // SALARY is the declared salary during onboarding
      const declaredSalary = financial.SALARY || 0;
      const actualSalary = financial.LAST_SAL_AMT || 0;
      
      if (declaredSalary > 0) {
        analysis.incomeVariance = Math.abs((actualSalary - declaredSalary) / declaredSalary * 100);
        
        // Actual salary significantly higher than declared
        if (actualSalary > declaredSalary * 2) {
          analysis.incomeConsistent = false;
          analysis.riskFactors.push({
            type: 'INCOME_INCONSISTENCY',
            description: `Actual salary (${actualSalary.toLocaleString()} QAR) is ${(actualSalary / declaredSalary).toFixed(1)}x higher than declared salary (${declaredSalary.toLocaleString()} QAR)`,
            severity: 'HIGH'
          });
          analysis.riskScore += 30;
        }
        
        // Actual salary significantly lower than declared (income drop)
        if (actualSalary < declaredSalary * 0.5 && actualSalary > 0) {
          analysis.riskFactors.push({
            type: 'INCOME_DROP',
            description: `Significant income drop detected: Actual ${actualSalary.toLocaleString()} QAR vs Declared ${declaredSalary.toLocaleString()} QAR`,
            severity: 'MEDIUM'
          });
          analysis.riskScore += 15;
        }
      }

      // Rule 2: Salary Activity Gap
      if (financial.LAST_SAL_DA) {
        const lastSalaryDate = new Date(financial.LAST_SAL_DA);
        const daysSinceLastSalary = Math.floor((new Date() - lastSalaryDate) / (1000 * 60 * 60 * 24));
        if (daysSinceLastSalary > 90) {
          analysis.riskFactors.push({
            type: 'SALARY_GAP',
            description: `No salary credit for ${daysSinceLastSalary} days (last: ${financial.LAST_SAL_DA})`,
            severity: 'MEDIUM'
          });
          analysis.riskScore += 15;
        }
      }
    }

    // Rule 3: Activity vs Capacity Check
    if (activity && financial) {
      const monthlyActivity = (activity.LM_EXP_CASH || 0) + (activity.LM_EXP_NONCASH || 0) + (activity.LM_EXP_TRFR || 0);
      const monthlyCapacity = (financial.LAST_SAL_AMT || 0) * 2; // 2x salary as reasonable capacity
      
      if (monthlyActivity > financial.LAST_SAL_AMT * 20) {
        analysis.activityWithinCapacity = false;
        analysis.riskFactors.push({
          type: 'FINANCIAL_BEHAVIOUR_RISK',
          description: `Expected monthly activity (${monthlyActivity.toLocaleString()} QAR) exceeds 20x actual salary`,
          severity: 'CRITICAL'
        });
        analysis.riskScore += 40;
      } else if (monthlyActivity > financial.LAST_SAL_AMT * 10) {
        analysis.riskFactors.push({
          type: 'HIGH_ACTIVITY_RATIO',
          description: `Expected activity is ${(monthlyActivity / financial.LAST_SAL_AMT).toFixed(1)}x actual salary`,
          severity: 'HIGH'
        });
        analysis.riskScore += 25;
      }

      // Activity deviation
      if (activity.DEVIATION_FLAG) {
        analysis.riskFactors.push({
          type: 'ACTIVITY_DEVIATION',
          description: activity.DEVIATION_REASON || 'Actual activity deviates from expected pattern',
          severity: 'HIGH'
        });
        analysis.riskScore += 20;
      }
    }

    // Risk scores from customer profile
    if (customer.riskScores) {
      // AUTO HIGH check
      if (customer.riskScores.FINAL_RISK_CATEG === 'AUTO HIGH') {
        analysis.riskFactors.push({
          type: 'AUTO_HIGH_RISK',
          description: `AUTO HIGH classification: ${customer.riskScores.AUTO_HIGH_REASONS?.join(', ') || 'System triggered'}`,
          severity: 'CRITICAL'
        });
        analysis.riskScore += 50;
      }
      
      // High final risk score
      if (customer.riskScores.FINAL_RISK_SCORE > 400) {
        analysis.riskFactors.push({
          type: 'HIGH_RISK_SCORE',
          description: `Final risk score ${customer.riskScores.FINAL_RISK_SCORE} exceeds threshold (400)`,
          severity: 'HIGH'
        });
        analysis.riskScore += 20;
      }

      // PEP check
      if (customer.riskScores.IS_PEP) {
        analysis.riskFactors.push({
          type: 'PEP_STATUS',
          description: 'Customer is a Politically Exposed Person',
          severity: 'CRITICAL'
        });
        analysis.riskScore += 35;
      }
    }

    // Determine overall risk level
    if (analysis.riskScore >= 70) {
      analysis.overallRisk = 'AUTO HIGH';
      analysis.recommendation = 'ESCALATE TO COMPLIANCE: Multiple high-risk indicators detected. Recommend enhanced due diligence, source of wealth verification, and compliance review before any account activity.';
    } else if (analysis.riskScore >= 50) {
      analysis.overallRisk = 'HIGH';
      analysis.recommendation = 'HIGH RISK: Conduct enhanced monitoring. Verify source of funds and income documentation. Consider periodic review schedule.';
    } else if (analysis.riskScore >= 30) {
      analysis.overallRisk = 'MEDIUM';
      analysis.recommendation = 'MEDIUM RISK: Standard EDD procedures apply. Document all findings and monitor for any suspicious patterns.';
    } else {
      analysis.overallRisk = 'LOW';
      analysis.recommendation = 'LOW RISK: Customer profile appears consistent. Proceed with standard CDD procedures. Schedule regular periodic review.';
    }

    // Normalize score to 100
    analysis.riskScore = Math.min(100, analysis.riskScore);

    return analysis;
  },

  // =====================================================
  // EXCEL EXPORT
  // =====================================================

  exportToExcel: function(caseId, customerRim) {
    const eddCase = MockData.eddCases.find(c => c.caseId === caseId) || MockData.eddCases[0];
    const customer = MockData.customers.find(c => c.rim === customerRim);
    const financial = EnterpriseFeatures.getFinancialProfile(customerRim);
    const activity = EnterpriseFeatures.getExpectedActivity(customerRim);
    const analysis = this.analyzeFinancialBehavior(financial, activity, customer);

    // Create CSV content
    let csv = 'QIB EDD Case Export\n';
    csv += `Case ID,${eddCase.caseId}\n`;
    csv += `Generated,${new Date().toLocaleString()}\n\n`;

    csv += 'CUSTOMER INFORMATION\n';
    csv += 'Field,Value\n';
    csv += `RIM,${customer.rim}\n`;
    csv += `Name,${customer.name}\n`;
    csv += `Arabic Name,${customer.nameAr}\n`;
    csv += `Nationality,${customer.nationality}\n`;
    csv += `Segment,${customer.segment}\n`;
    csv += `QID,${customer.qid}\n\n`;

    csv += 'FINANCIAL PROFILE (Source: ETL/Payroll)\n';
    csv += 'Field,Value,Description\n';
    if (financial) {
      csv += `SALARY,${financial.SALARY},Declared salary during onboarding\n`;
      csv += `LAST_SAL_AMT,${financial.LAST_SAL_AMT},Actual verified salary (most recent)\n`;
      csv += `AVG_LAST_3_SALARY,${financial.AVG_LAST_3_SALARY},Average of last 3 months\n`;
      csv += `ANNUAL_INC,${financial.ANNUAL_INC},Annual income declared\n`;
      csv += `SEC_INC_AMT,${financial.SEC_INC_AMT},Secondary income\n`;
      csv += `LAST_SAL_DA,${financial.LAST_SAL_DA},Date of last salary credit\n`;
    }
    csv += '\n';

    csv += 'EXPECTED ACTIVITY (Source: Risk Dataset)\n';
    csv += 'Field,Value\n';
    if (activity) {
      csv += `LM_EXP_CASH,${activity.LM_EXP_CASH}\n`;
      csv += `LM_EXP_NONCASH,${activity.LM_EXP_NONCASH}\n`;
      csv += `LM_EXP_TRFR,${activity.LM_EXP_TRFR}\n`;
      csv += `ANNUAL_EXP_TURNOVER,${activity.ANNUAL_EXP_TURNOVER}\n`;
    }
    csv += '\n';

    csv += 'RISK CLASSIFICATION (Source: ETL/SnapView)\n';
    csv += 'Dimension,Score,Category\n';
    if (customer.riskScores) {
      csv += `PROD_RISK,${customer.riskScores.PROD_RISK_SCORE},${customer.riskScores.PROD_RISK_CATEG}\n`;
      csv += `ACT_RISK,${customer.riskScores.ACT_RISK_SCORE},${customer.riskScores.ACT_RISK_CATEG}\n`;
      csv += `OCCP_RISK,${customer.riskScores.OCCP_RISK_SCORE},${customer.riskScores.OCCP_RISK_CATEG}\n`;
      csv += `COUNTRY_RISK,${customer.riskScores.COUNTRY_RISK_SCORE},${customer.riskScores.COUNTRY_RISK_CATEG}\n`;
      csv += `FINAL_RISK,${customer.riskScores.FINAL_RISK_SCORE},${customer.riskScores.FINAL_RISK_CATEG}\n`;
    }
    csv += '\n';

    csv += 'FINANCIAL ANALYSIS\n';
    csv += 'Metric,Value\n';
    csv += `Risk Score,${analysis.riskScore}\n`;
    csv += `Overall Risk Level,${analysis.overallRisk}\n`;
    csv += `Income Variance,${analysis.incomeVariance.toFixed(1)}%\n`;
    csv += `Income Consistent,${analysis.incomeConsistent ? 'Yes' : 'No'}\n`;
    csv += '\n';

    csv += 'RISK FACTORS\n';
    csv += 'Type,Description,Severity\n';
    analysis.riskFactors.forEach(f => {
      csv += `${f.type},"${f.description}",${f.severity}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `EDD_Case_${eddCase.caseId}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  },

  // =====================================================
  // PRESENTATION EXPORT
  // =====================================================

  exportPresentation: function(caseId, customerRim) {
    const eddCase = MockData.eddCases.find(c => c.caseId === caseId) || MockData.eddCases[0];
    const customer = MockData.customers.find(c => c.rim === customerRim);
    const financial = EnterpriseFeatures.getFinancialProfile(customerRim);
    const activity = EnterpriseFeatures.getExpectedActivity(customerRim);
    const analysis = this.analyzeFinancialBehavior(financial, activity, customer);
    const network = EnterpriseFeatures.getCustomerNetwork(customerRim);

    const formatCurrency = (amt) => amt ? amt.toLocaleString() + ' QAR' : 'N/A';

    const presentationHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>EDD Case Presentation - ${eddCase.caseId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0a0f1a; color: white; overflow: hidden; }
    .slide { width: 100vw; height: 100vh; display: none; padding: 60px; position: relative; }
    .slide.active { display: flex; flex-direction: column; }
    .slide-header { margin-bottom: 40px; }
    .slide-header h1 { font-size: 48px; margin-bottom: 10px; background: linear-gradient(135deg, #00D4FF, #0288D1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .slide-header p { font-size: 18px; color: #9E9E9E; }
    .slide-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .slide-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .nav-btn { padding: 12px 30px; font-size: 16px; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s; }
    .nav-btn.prev { background: rgba(255,255,255,0.1); color: white; }
    .nav-btn.next { background: linear-gradient(135deg, #00D4FF, #0288D1); color: white; }
    .nav-btn:hover { transform: translateY(-2px); }
    .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; }
    .card-title { font-size: 14px; color: #9E9E9E; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
    .card-value { font-size: 36px; font-weight: 700; color: #00D4FF; }
    .card-value.danger { color: #FF5252; }
    .card-value.warning { color: #FF9800; }
    .card-value.success { color: #4CAF50; }
    .risk-meter { width: 100%; height: 20px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; margin-top: 10px; }
    .risk-fill { height: 100%; transition: width 0.5s; }
    .badge { display: inline-block; padding: 8px 20px; border-radius: 20px; font-size: 14px; font-weight: 600; }
    .badge.critical { background: rgba(244, 67, 54, 0.2); color: #FF5252; }
    .badge.high { background: rgba(255, 152, 0, 0.2); color: #FF9800; }
    .badge.medium { background: rgba(255, 193, 7, 0.2); color: #FFC107; }
    .badge.low { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
    .indicator-list { list-style: none; }
    .indicator-list li { padding: 15px; margin-bottom: 10px; border-left: 4px solid; border-radius: 0 8px 8px 0; background: rgba(255,255,255,0.03); }
    .indicator-list li.critical { border-color: #FF5252; }
    .indicator-list li.high { border-color: #FF9800; }
    .indicator-list li.medium { border-color: #FFC107; }
    .indicator-list li.low { border-color: #4CAF50; }
    .title-slide { background: linear-gradient(135deg, #0a0f1a 0%, #1a237e 100%); }
    .title-slide h1 { font-size: 64px; text-align: center; margin-bottom: 20px; }
    .title-slide .subtitle { font-size: 24px; text-align: center; color: #00D4FF; }
    .logo { position: absolute; top: 30px; right: 40px; font-size: 24px; font-weight: bold; color: rgba(255,255,255,0.3); }
    .slide-number { color: #666; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 15px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { color: #00D4FF; font-size: 12px; text-transform: uppercase; }
    .highlight-box { background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(2, 136, 209, 0.05)); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 16px; padding: 30px; text-align: center; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate { animation: fadeIn 0.5s ease-out forwards; }
  </style>
</head>
<body>
  <!-- Slide 1: Title -->
  <div class="slide title-slide active" data-slide="1">
    <div class="logo">QIB</div>
    <div class="slide-content" style="justify-content: center; align-items: center;">
      <h1>EDD Case Investigation</h1>
      <div class="subtitle">تقرير التحقق المعزز من العناية الواجبة</div>
      <div style="margin-top: 40px;">
        <div style="font-size: 24px; color: white;">${customer.name}</div>
        <div style="font-size: 18px; color: #9E9E9E; margin-top: 10px;">${customer.nameAr}</div>
        <div style="margin-top: 30px;">
          <span class="badge ${analysis.overallRisk.toLowerCase().replace(' ', '-')}">${analysis.overallRisk} RISK</span>
        </div>
      </div>
      <div style="margin-top: 60px; font-size: 14px; color: #666;">
        Case ID: ${eddCase.caseId} | ${new Date().toLocaleDateString()}
      </div>
    </div>
    <div class="slide-footer">
      <span class="slide-number">1 / 7</span>
      <button class="nav-btn next" onclick="nextSlide()">Start Presentation →</button>
    </div>
  </div>

  <!-- Slide 2: Risk Summary -->
  <div class="slide" data-slide="2">
    <div class="logo">QIB</div>
    <div class="slide-header">
      <h1>Risk Assessment Summary</h1>
      <p>ملخص تقييم المخاطر</p>
    </div>
    <div class="slide-content">
      <div class="grid-2">
        <div class="highlight-box">
          <div class="card-title">Overall Risk Score</div>
          <div class="card-value ${analysis.overallRisk === 'HIGH' || analysis.overallRisk === 'AUTO HIGH' ? 'danger' : analysis.overallRisk === 'MEDIUM' ? 'warning' : 'success'}" style="font-size: 96px;">${analysis.riskScore}</div>
          <div class="risk-meter">
            <div class="risk-fill" style="width: ${analysis.riskScore}%; background: ${analysis.riskScore >= 70 ? '#FF5252' : analysis.riskScore >= 50 ? '#FF9800' : analysis.riskScore >= 30 ? '#FFC107' : '#4CAF50'};"></div>
          </div>
          <div style="margin-top: 20px;">
            <span class="badge ${analysis.overallRisk.toLowerCase().replace(' ', '-')}">${analysis.overallRisk}</span>
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 20px; color: #00D4FF;">Key Risk Indicators</h3>
          <ul class="indicator-list">
            ${analysis.riskFactors.slice(0, 4).map(f => `
              <li class="${f.severity.toLowerCase()}">
                <strong>${f.type.replace(/_/g, ' ')}</strong><br/>
                <small style="color: #9E9E9E;">${f.description}</small>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <button class="nav-btn prev" onclick="prevSlide()">← Previous</button>
      <span class="slide-number">2 / 7</span>
      <button class="nav-btn next" onclick="nextSlide()">Next →</button>
    </div>
  </div>

  <!-- Slide 3: Customer Profile -->
  <div class="slide" data-slide="3">
    <div class="logo">QIB</div>
    <div class="slide-header">
      <h1>Customer Profile</h1>
      <p>ملف العميل</p>
    </div>
    <div class="slide-content">
      <div class="grid-2">
        <div class="card">
          <h3 style="margin-bottom: 20px;">Personal Information</h3>
          <table>
            <tr><td style="color: #9E9E9E;">Name</td><td>${customer.name}</td></tr>
            <tr><td style="color: #9E9E9E;">Arabic Name</td><td>${customer.nameAr}</td></tr>
            <tr><td style="color: #9E9E9E;">RIM</td><td style="font-family: monospace;">${customer.rim}</td></tr>
            <tr><td style="color: #9E9E9E;">QID</td><td>${customer.qid}</td></tr>
            <tr><td style="color: #9E9E9E;">Nationality</td><td>${customer.nationality}</td></tr>
          </table>
        </div>
        <div class="card">
          <h3 style="margin-bottom: 20px;">Account Information</h3>
          <table>
            <tr><td style="color: #9E9E9E;">Segment</td><td><span class="badge low">${customer.segment}</span></td></tr>
            <tr><td style="color: #9E9E9E;">Occupation</td><td>${customer.occupation || 'N/A'}</td></tr>
            <tr><td style="color: #9E9E9E;">Employer</td><td>${customer.employer || 'N/A'}</td></tr>
            <tr><td style="color: #9E9E9E;">Risk Classification</td><td><span class="badge ${customer.riskClassification}">${customer.riskClassification.toUpperCase()}</span></td></tr>
          </table>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <button class="nav-btn prev" onclick="prevSlide()">← Previous</button>
      <span class="slide-number">3 / 7</span>
      <button class="nav-btn next" onclick="nextSlide()">Next →</button>
    </div>
  </div>

  <!-- Slide 4: Financial Analysis -->
  <div class="slide" data-slide="4">
    <div class="logo">QIB</div>
    <div class="slide-header">
      <h1>Financial Analysis</h1>
      <p>التحليل المالي — Income Consistency Check</p>
    </div>
    <div class="slide-content">
      <div class="grid-4">
        <div class="card">
          <div class="card-title">SALARY (Declared)</div>
          <div class="card-value">${financial ? formatCurrency(financial.SALARY) : 'N/A'}</div>
          <small style="color: #666;">At onboarding</small>
        </div>
        <div class="card">
          <div class="card-title">LAST_SAL_AMT (Actual)</div>
          <div class="card-value ${analysis.incomeVariance > 100 ? 'danger' : ''}">${financial ? formatCurrency(financial.LAST_SAL_AMT) : 'N/A'}</div>
          <small style="color: #666;">Verified salary</small>
        </div>
        <div class="card">
          <div class="card-title">Income Variance</div>
          <div class="card-value ${analysis.incomeVariance > 100 ? 'danger' : analysis.incomeVariance > 50 ? 'warning' : 'success'}">${analysis.incomeVariance.toFixed(1)}%</div>
          <small style="color: #666;">Difference</small>
        </div>
        <div class="card">
          <div class="card-title">Annual Capacity</div>
          <div class="card-value">${financial ? formatCurrency(financial.LAST_SAL_AMT * 12) : 'N/A'}</div>
          <small style="color: #666;">Based on actual salary</small>
        </div>
      </div>
      <div style="margin-top: 40px; padding: 30px; background: ${analysis.incomeConsistent ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'}; border-radius: 16px; border: 1px solid ${analysis.incomeConsistent ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'};">
        <h3 style="color: ${analysis.incomeConsistent ? '#4CAF50' : '#FF5252'};">
          ${analysis.incomeConsistent ? '✅ Income Consistent' : '⚠️ Income Inconsistency Detected'}
        </h3>
        <p style="margin-top: 10px; color: #9E9E9E;">
          ${analysis.incomeConsistent 
            ? 'Declared salary aligns with actual salary received. No significant variance detected.' 
            : 'Declared salary does not match actual salary. This may indicate undisclosed income sources.'}
        </p>
      </div>
    </div>
    <div class="slide-footer">
      <button class="nav-btn prev" onclick="prevSlide()">← Previous</button>
      <span class="slide-number">4 / 7</span>
      <button class="nav-btn next" onclick="nextSlide()">Next →</button>
    </div>
  </div>

  <!-- Slide 5: Risk Classification -->
  <div class="slide" data-slide="5">
    <div class="logo">QIB</div>
    <div class="slide-header">
      <h1>Risk Classification Model</h1>
      <p>نموذج تصنيف المخاطر — ETL/SnapView</p>
    </div>
    <div class="slide-content">
      ${customer.riskScores ? `
      <div class="grid-4">
        <div class="card" style="text-align: center;">
          <div class="card-title">Product Risk</div>
          <div class="card-value">${customer.riskScores.PROD_RISK_SCORE}</div>
          <span class="badge ${customer.riskScores.PROD_RISK_CATEG.toLowerCase()}">${customer.riskScores.PROD_RISK_CATEG}</span>
        </div>
        <div class="card" style="text-align: center;">
          <div class="card-title">Activity Risk</div>
          <div class="card-value">${customer.riskScores.ACT_RISK_SCORE}</div>
          <span class="badge ${customer.riskScores.ACT_RISK_CATEG.toLowerCase()}">${customer.riskScores.ACT_RISK_CATEG}</span>
        </div>
        <div class="card" style="text-align: center;">
          <div class="card-title">Occupation Risk</div>
          <div class="card-value">${customer.riskScores.OCCP_RISK_SCORE}</div>
          <span class="badge ${customer.riskScores.OCCP_RISK_CATEG.toLowerCase()}">${customer.riskScores.OCCP_RISK_CATEG}</span>
        </div>
        <div class="card" style="text-align: center;">
          <div class="card-title">Country Risk</div>
          <div class="card-value">${customer.riskScores.COUNTRY_RISK_SCORE}</div>
          <span class="badge ${customer.riskScores.COUNTRY_RISK_CATEG.toLowerCase()}">${customer.riskScores.COUNTRY_RISK_CATEG}</span>
        </div>
      </div>
      <div class="highlight-box" style="margin-top: 40px;">
        <div class="card-title">FINAL RISK SCORE</div>
        <div class="card-value" style="font-size: 72px;">${customer.riskScores.FINAL_RISK_SCORE}</div>
        <span class="badge ${customer.riskScores.FINAL_RISK_CATEG.toLowerCase().replace(' ', '-')}" style="font-size: 18px; padding: 12px 30px;">${customer.riskScores.FINAL_RISK_CATEG}</span>
        ${customer.riskScores.AUTO_HIGH_REASONS ? `
          <div style="margin-top: 20px; color: #FF5252;">
            AUTO HIGH: ${customer.riskScores.AUTO_HIGH_REASONS.join(', ')}
          </div>
        ` : ''}
      </div>
      ` : '<p>Risk classification data not available</p>'}
    </div>
    <div class="slide-footer">
      <button class="nav-btn prev" onclick="prevSlide()">← Previous</button>
      <span class="slide-number">5 / 7</span>
      <button class="nav-btn next" onclick="nextSlide()">Next →</button>
    </div>
  </div>

  <!-- Slide 6: Network Connections -->
  <div class="slide" data-slide="6">
    <div class="logo">QIB</div>
    <div class="slide-header">
      <h1>Relationship Network</h1>
      <p>شبكة العلاقات والحسابات المشتركة</p>
    </div>
    <div class="slide-content">
      ${network ? `
      <div class="grid-2">
        <div class="card">
          <h3 style="margin-bottom: 20px;">Related Entities</h3>
          <table>
            <tr><th>Entity</th><th>Relationship</th><th>%</th></tr>
            ${network.relatedNodes.slice(0, 5).map(node => `
              <tr>
                <td>${node.name}${node.isPEP ? ' <span class="badge critical">PEP</span>' : ''}</td>
                <td>${node.relationship.replace(/_/g, ' ')}</td>
                <td>${node.ownershipPct ? node.ownershipPct + '%' : '-'}</td>
              </tr>
            `).join('')}
          </table>
        </div>
        <div class="card">
          <h3 style="margin-bottom: 20px;">Connected Accounts</h3>
          <table>
            <tr><th>Account</th><th>Type</th><th>Balance</th></tr>
            ${network.accounts.map(acc => `
              <tr>
                <td style="font-family: monospace; font-size: 12px;">${acc.number}</td>
                <td>${acc.type}</td>
                <td>${formatCurrency(acc.balance)}</td>
              </tr>
            `).join('')}
            <tr style="background: rgba(0, 212, 255, 0.1);">
              <td colspan="2"><strong>Total Exposure</strong></td>
              <td><strong>${formatCurrency(network.accounts.reduce((sum, a) => sum + a.balance, 0))}</strong></td>
            </tr>
          </table>
        </div>
      </div>
      ${network.riskIndicators.length > 0 ? `
      <div style="margin-top: 30px;">
        <h3 style="margin-bottom: 15px;">Network Risk Indicators</h3>
        <div class="grid-3">
          ${network.riskIndicators.map(ind => `
            <div class="card" style="border-left: 4px solid ${ind.severity === 'Critical' ? '#FF5252' : ind.severity === 'High' ? '#FF9800' : '#FFC107'};">
              <strong>${ind.type}</strong><br/>
              <small style="color: #9E9E9E;">${ind.description}</small>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      ` : '<p>Network data not available</p>'}
    </div>
    <div class="slide-footer">
      <button class="nav-btn prev" onclick="prevSlide()">← Previous</button>
      <span class="slide-number">6 / 7</span>
      <button class="nav-btn next" onclick="nextSlide()">Next →</button>
    </div>
  </div>

  <!-- Slide 7: Recommendation -->
  <div class="slide" data-slide="7">
    <div class="logo">QIB</div>
    <div class="slide-header">
      <h1>Recommendation</h1>
      <p>التوصية النهائية</p>
    </div>
    <div class="slide-content" style="justify-content: center;">
      <div class="highlight-box" style="max-width: 800px; margin: 0 auto;">
        <div style="font-size: 24px; margin-bottom: 20px;">Investigation Result</div>
        <span class="badge ${analysis.overallRisk.toLowerCase().replace(' ', '-')}" style="font-size: 24px; padding: 15px 40px;">${analysis.overallRisk} RISK</span>
        <div style="margin-top: 30px; text-align: left; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
          <p style="font-size: 16px; line-height: 1.8;">${analysis.recommendation}</p>
        </div>
      </div>
      <div style="margin-top: 40px; display: flex; gap: 20px; justify-content: center;">
        <div class="card" style="text-align: center; flex: 1; max-width: 200px;">
          <div class="card-title">Risk Score</div>
          <div class="card-value">${analysis.riskScore}</div>
        </div>
        <div class="card" style="text-align: center; flex: 1; max-width: 200px;">
          <div class="card-title">Risk Factors</div>
          <div class="card-value">${analysis.riskFactors.length}</div>
        </div>
        <div class="card" style="text-align: center; flex: 1; max-width: 200px;">
          <div class="card-title">Case ID</div>
          <div class="card-value" style="font-size: 18px;">${eddCase.caseId}</div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <button class="nav-btn prev" onclick="prevSlide()">← Previous</button>
      <span class="slide-number">7 / 7</span>
      <button class="nav-btn next" onclick="window.print()">🖨️ Print / Export</button>
    </div>
  </div>

  <script>
    let currentSlide = 1;
    const totalSlides = 7;

    function showSlide(n) {
      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      document.querySelector('[data-slide="' + n + '"]').classList.add('active');
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') window.close();
    });
  </script>
</body>
</html>
    `;

    // Open in new window
    const presWindow = window.open('', '_blank');
    presWindow.document.write(presentationHTML);
    presWindow.document.close();
  },

  // =====================================================
  // SHOW EXPORT MODAL
  // =====================================================

  showExportModal: function(caseId, customerRim) {
    const modalHTML = `
      <div id="exportModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 10, 20, 0.9); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: linear-gradient(135deg, #1a1f2e, #0d1117); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; width: 500px; overflow: hidden;">
          <div style="padding: 24px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <h2 style="margin: 0; font-size: 20px;">📤 Export Reports</h2>
            <p style="margin: 8px 0 0 0; color: var(--text-muted); font-size: 13px;">تصدير التقارير والعروض التقديمية</p>
          </div>
          
          <div style="padding: 24px;">
            <div style="display: flex; flex-direction: column; gap: 16px;">
              
              <!-- PDF Report -->
              <button onclick="ExportReports.generatePDFReport('${caseId}', '${customerRim}'); ExportReports.closeExportModal();" style="display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(244, 67, 54, 0.1); border: 1px solid rgba(244, 67, 54, 0.3); border-radius: 12px; cursor: pointer; text-align: left;">
                <div style="width: 50px; height: 50px; background: rgba(244, 67, 54, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📄</div>
                <div>
                  <div style="font-weight: 600; color: white; font-size: 15px;">PDF Investigation Report</div>
                  <div style="color: #9E9E9E; font-size: 12px; margin-top: 4px;">Complete case report with financial analysis and recommendations</div>
                </div>
              </button>

              <!-- Excel Export -->
              <button onclick="ExportReports.exportToExcel('${caseId}', '${customerRim}'); ExportReports.closeExportModal();" style="display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 12px; cursor: pointer; text-align: left;">
                <div style="width: 50px; height: 50px; background: rgba(76, 175, 80, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📊</div>
                <div>
                  <div style="font-weight: 600; color: white; font-size: 15px;">Excel Data Export</div>
                  <div style="color: #9E9E9E; font-size: 12px; margin-top: 4px;">CSV file with all case data, risk scores, and analysis</div>
                </div>
              </button>

              <!-- Presentation -->
              <button onclick="ExportReports.exportPresentation('${caseId}', '${customerRim}'); ExportReports.closeExportModal();" style="display: flex; align-items: center; gap: 16px; padding: 20px; background: rgba(156, 39, 176, 0.1); border: 1px solid rgba(156, 39, 176, 0.3); border-radius: 12px; cursor: pointer; text-align: left;">
                <div style="width: 50px; height: 50px; background: rgba(156, 39, 176, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">📽️</div>
                <div>
                  <div style="font-weight: 600; color: white; font-size: 15px;">Interactive Presentation</div>
                  <div style="color: #9E9E9E; font-size: 12px; margin-top: 4px;">7-slide presentation for management or committee review</div>
                </div>
              </button>

            </div>
          </div>
          
          <div style="padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right;">
            <button onclick="ExportReports.closeExportModal()" style="padding: 10px 24px; background: rgba(255,255,255,0.1); border: none; border-radius: 8px; color: white; cursor: pointer;">Cancel</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  },

  closeExportModal: function() {
    const modal = document.getElementById('exportModal');
    if (modal) modal.remove();
  }
};

// Make globally available
window.ExportReports = ExportReports;
