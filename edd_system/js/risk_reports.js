/**
 * ============================================================================
 * RISK REPORTS - نظام التقارير الشامل
 * ============================================================================
 * إنشاء وتصدير تقارير المخاطر بصيغ مختلفة
 */

window.RISK_REPORTS = {
  
  // ═══════════════════════════════════════════════════════════════
  // GENERATE CASE REPORT - تقرير الحالة الفردية
  // ═══════════════════════════════════════════════════════════════
  
  generateCaseReport: function(caseData) {
    if (!caseData || !caseData.riskScores) {
      return null;
    }
    
    const rs = caseData.riskScores;
    const now = new Date();
    
    return {
      title: `تقرير تقييم المخاطر - الحالة ${caseData.id}`,
      generatedAt: now.toLocaleString('ar-SA'),
      
      // Header
      caseInfo: {
        caseId: caseData.id,
        customerId: caseData.customerId,
        customerName: caseData.customer_name,
        sector: caseData.sector,
        status: caseData.status,
        createdDate: caseData.createdDate
      },
      
      // Risk Assessment
      riskAssessment: {
        finalScore: rs.FINAL_RISK_SCORE,
        finalCategory: rs.FINAL_RISK_CATEG,
        primaryDriver: rs.PRIMARY_RISK_DRIVER,
        secondaryDrivers: rs.SECONDARY_DRIVERS || [],
        autoHighTrigger: rs.AUTO_HIGH_TRIGGER,
        triggerReason: rs.TRIGGER_REASON
      },
      
      // Risk Breakdown
      riskBreakdown: {
        country: {
          score: rs.COUNTRY_RISK_SCORE,
          category: rs.COUNTRY_RISK_CATEG,
          description: caseData.nationality || 'N/A'
        },
        activity: {
          score: rs.ACT_RISK_SCORE,
          category: rs.ACT_RISK_CATEG,
          description: caseData.activity || 'N/A'
        },
        product: {
          score: rs.PROD_RISK_SCORE,
          category: rs.PROD_RISK_CATEG,
          description: caseData.product || 'N/A'
        },
        occupation: {
          score: rs.OCCP_RISK_SCORE,
          category: rs.OCCP_RISK_CATEG,
          description: caseData.occupation || 'N/A'
        }
      },
      
      // Recommendations
      recommendations: this.getRecommendations(rs)
    };
  },
  
  // ═══════════════════════════════════════════════════════════════
  // GENERATE PORTFOLIO REPORT - تقرير الحافظة
  // ═══════════════════════════════════════════════════════════════
  
  generatePortfolioReport: function(sectorFilter = 'ALL') {
    if (!window.eddDataModel) {
      return null;
    }
    
    let cases = window.eddDataModel.getAllCases();
    
    if (sectorFilter !== 'ALL') {
      cases = cases.filter(c => c.sector === sectorFilter);
    }
    
    const riskSummary = {
      totalCases: cases.length,
      lowRisk: cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === 'LOW').length,
      mediumRisk: cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === 'MEDIUM').length,
      highRisk: cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === 'HIGH').length
    };
    
    const averageScore = cases.reduce((sum, c) => sum + (c.riskScores?.FINAL_RISK_SCORE || 0), 0) / cases.length;
    
    const riskDrivers = {};
    cases.forEach(c => {
      const driver = c.riskScores?.PRIMARY_RISK_DRIVER;
      if (driver) {
        riskDrivers[driver] = (riskDrivers[driver] || 0) + 1;
      }
    });
    
    return {
      title: `تقرير الحافظة الشامل - ${new Date().toLocaleDateString('ar-SA')}`,
      generatedAt: new Date().toLocaleString('ar-SA'),
      sector: sectorFilter,
      
      summary: {
        totalCases: riskSummary.totalCases,
        lowRiskCount: riskSummary.lowRisk,
        lowRiskPercentage: ((riskSummary.lowRisk / riskSummary.totalCases) * 100).toFixed(2),
        mediumRiskCount: riskSummary.mediumRisk,
        mediumRiskPercentage: ((riskSummary.mediumRisk / riskSummary.totalCases) * 100).toFixed(2),
        highRiskCount: riskSummary.highRisk,
        highRiskPercentage: ((riskSummary.highRisk / riskSummary.totalCases) * 100).toFixed(2),
        averageRiskScore: averageScore.toFixed(2)
      },
      
      riskDriverDistribution: riskDrivers,
      
      topRiskCases: cases
        .sort((a, b) => (b.riskScores?.FINAL_RISK_SCORE || 0) - (a.riskScores?.FINAL_RISK_SCORE || 0))
        .slice(0, 10)
        .map(c => ({
          caseId: c.id,
          customerName: c.customer_name,
          riskScore: c.riskScores.FINAL_RISK_SCORE,
          riskCategory: c.riskScores.FINAL_RISK_CATEG,
          primaryDriver: c.riskScores.PRIMARY_RISK_DRIVER
        }))
    };
  },
  
  // ═══════════════════════════════════════════════════════════════
  // EXPORT TO HTML
  // ═══════════════════════════════════════════════════════════════
  
  exportToHTML: function(report, reportType = 'case') {
    if (reportType === 'case') {
      return this.generateCaseHTML(report);
    } else if (reportType === 'portfolio') {
      return this.generatePortfolioHTML(report);
    }
  },
  
  generateCaseHTML: function(report) {
    const rs = report.riskAssessment;
    const rb = report.riskBreakdown;
    const color = this.getCategoryColor(rs.finalCategory);
    
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 3px solid ${color};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        h1 { color: ${color}; font-size: 28px; margin: 0; }
        .meta {
            font-size: 12px;
            color: #999;
            margin-top: 10px;
        }
        .section {
            margin: 30px 0;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            border-left: 4px solid ${color};
            padding-left: 12px;
            margin-bottom: 15px;
        }
        .risk-score-big {
            font-size: 48px;
            font-weight: bold;
            color: ${color};
            text-align: center;
            padding: 20px;
            background: ${color}10;
            border-radius: 8px;
            margin: 20px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th {
            background: #f0f0f0;
            padding: 12px;
            text-align: right;
            border-bottom: 2px solid ${color};
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #999;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${report.title}</h1>
            <div class="meta">
                تاريخ الإنشاء: ${report.generatedAt}<br>
                رقم الحالة: ${report.caseInfo.caseId}
            </div>
        </div>
        
        <!-- Case Info -->
        <div class="section">
            <div class="section-title">معلومات الحالة</div>
            <table>
                <tr>
                    <th>اسم العميل</th><td>${report.caseInfo.customerName}</td>
                </tr>
                <tr>
                    <th>رقم العميل</th><td>${report.caseInfo.customerId}</td>
                </tr>
                <tr>
                    <th>القطاع</th><td>${report.caseInfo.sector}</td>
                </tr>
                <tr>
                    <th>حالة الملف</th><td>${report.caseInfo.status}</td>
                </tr>
                <tr>
                    <th>تاريخ الإنشاء</th><td>${report.caseInfo.createdDate}</td>
                </tr>
            </table>
        </div>
        
        <!-- Risk Assessment -->
        <div class="section">
            <div class="section-title">تقييم المخاطر</div>
            <div class="risk-score-big">${rs.finalScore}</div>
            <table>
                <tr>
                    <th>تصنيف المخاطر</th><td>${rs.finalCategory}</td>
                </tr>
                <tr>
                    <th>مصدر المخاطر الرئيسي</th><td>${rs.primaryDriver || 'N/A'}</td>
                </tr>
                <tr>
                    <th>تنبيه تلقائي</th><td>${rs.autoHighTrigger ? 'نعم - ' + rs.triggerReason : 'لا'}</td>
                </tr>
            </table>
        </div>
        
        <!-- Risk Breakdown -->
        <div class="section">
            <div class="section-title">تفصيل المخاطر</div>
            <table>
                <thead>
                    <tr>
                        <th>البند</th>
                        <th>النقاط</th>
                        <th>المستوى</th>
                        <th>التفاصيل</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>الدولة</td>
                        <td>${rb.country.score}</td>
                        <td>${rb.country.category}</td>
                        <td>${rb.country.description}</td>
                    </tr>
                    <tr>
                        <td>النشاط</td>
                        <td>${rb.activity.score}</td>
                        <td>${rb.activity.category}</td>
                        <td>${rb.activity.description}</td>
                    </tr>
                    <tr>
                        <td>المنتج</td>
                        <td>${rb.product.score}</td>
                        <td>${rb.product.category}</td>
                        <td>${rb.product.description}</td>
                    </tr>
                    <tr>
                        <td>المهنة</td>
                        <td>${rb.occupation.score}</td>
                        <td>${rb.occupation.category}</td>
                        <td>${rb.occupation.description}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Recommendations -->
        <div class="section">
            <div class="section-title">التوصيات</div>
            <ul style="line-height: 1.8;">
                ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
        </div>
        
        <div class="footer">
            تم إنشاء هذا التقرير بواسطة نظام إدارة المخاطر - EDD_QIB
        </div>
    </div>
</body>
</html>
    `;
  },
  
  generatePortfolioHTML: function(report) {
    const totalCases = report.summary.totalCases;
    
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${report.title}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h1 { color: #333; border-bottom: 3px solid #667eea; padding-bottom: 15px; }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .summary-card {
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        .card-low { background: #E8F5E9; border-color: #4CAF50; }
        .card-medium { background: #FFF3E0; border-color: #FF9800; }
        .card-high { background: #FFEBEE; border-color: #FF5252; }
        .card-avg { background: #E3F2FD; border-color: #2196F3; }
        .card-number {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .card-label {
            font-size: 12px;
            color: #666;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background: #f0f0f0;
            padding: 12px;
            text-align: right;
            border-bottom: 2px solid #667eea;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e0e0e0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${report.title}</h1>
        <p style="color: #999; margin-top: 10px;">تاريخ الإنشاء: ${report.generatedAt}</p>
        
        <div class="summary-grid">
            <div class="summary-card card-low">
                <div class="card-label">مخاطر منخفضة</div>
                <div class="card-number" style="color: #4CAF50;">${report.summary.lowRiskCount}</div>
                <div class="card-label">${report.summary.lowRiskPercentage}%</div>
            </div>
            <div class="summary-card card-medium">
                <div class="card-label">مخاطر متوسطة</div>
                <div class="card-number" style="color: #FF9800;">${report.summary.mediumRiskCount}</div>
                <div class="card-label">${report.summary.mediumRiskPercentage}%</div>
            </div>
            <div class="summary-card card-high">
                <div class="card-label">مخاطر عالية</div>
                <div class="card-number" style="color: #FF5252;">${report.summary.highRiskCount}</div>
                <div class="card-label">${report.summary.highRiskPercentage}%</div>
            </div>
            <div class="summary-card card-avg">
                <div class="card-label">متوسط النقاط</div>
                <div class="card-number" style="color: #2196F3;">${report.summary.averageRiskScore}</div>
                <div class="card-label">من 670</div>
            </div>
        </div>
        
        <h2 style="margin-top: 40px; color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">أعلى 10 حالات مخاطر</h2>
        <table>
            <thead>
                <tr>
                    <th>رقم الحالة</th>
                    <th>اسم العميل</th>
                    <th>نقاط المخاطر</th>
                    <th>المستوى</th>
                    <th>المصدر الرئيسي</th>
                </tr>
            </thead>
            <tbody>
                ${report.topRiskCases.map(c => `
                <tr>
                    <td>${c.caseId}</td>
                    <td>${c.customerName}</td>
                    <td style="font-weight: bold;">${c.riskScore}</td>
                    <td>${c.riskCategory}</td>
                    <td>${c.primaryDriver}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // EXPORT TO CSV
  // ═══════════════════════════════════════════════════════════════
  
  exportToCSV: function(reportType = 'portfolio') {
    if (!window.eddDataModel) return;
    
    let cases = window.eddDataModel.getAllCases();
    let csv = 'رقم الحالة,اسم العميل,القطاع,الدولة,النشاط,المنتج,المهنة,نقاط المخاطر,المستوى,المصدر الرئيسي\n';
    
    cases.forEach(c => {
      const rs = c.riskScores;
      csv += `"${c.id}","${c.customer_name}","${c.sector}","${c.nationality}","${c.activity}","${c.product}","${c.occupation}",${rs.FINAL_RISK_SCORE},"${rs.FINAL_RISK_CATEG}","${rs.PRIMARY_RISK_DRIVER}"\n`;
    });
    
    return csv;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // DOWNLOAD REPORT
  // ═══════════════════════════════════════════════════════════════
  
  downloadReport: function(filename, content, type = 'text/html') {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
  
  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  getCategoryColor: function(category) {
    const colors = {
      'HIGH': '#FF5252',
      'MEDIUM': '#FFA726',
      'LOW': '#66BB6A'
    };
    return colors[category] || '#999';
  },
  
  getRecommendations: function(riskScores) {
    const recommendations = [];
    
    if (riskScores.FINAL_RISK_CATEG === 'HIGH') {
      recommendations.push('إجراء تحقيق معمق (Enhanced Due Diligence - EDD) فوراً');
      recommendations.push('تقييم تفصيلي للأنشطة والمعاملات');
      recommendations.push('التحقق من مصادر الأموال والمستقبلات');
    }
    
    if (riskScores.ACT_RISK_SCORE > 100) {
      recommendations.push('تحليل نمط المعاملات بعناية فائقة');
      recommendations.push('المراقبة المستمرة للأنشطة المريبة');
    }
    
    if (riskScores.AUTO_HIGH_TRIGGER) {
      recommendations.push('تقييم فوري من قبل إدارة الامتثال');
      recommendations.push(`السبب: ${riskScores.TRIGGER_REASON}`);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('المتابعة الدورية العادية كافية');
    }
    
    return recommendations;
  }
};

console.log('[RISK REPORTS] Loaded');
