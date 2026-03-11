/**
 * ============================================================================
 * SECTOR FILTER - مرشح القطاع
 * ============================================================================
 * تصنيف وتصفية الحالات حسب القطاع والمخاطر
 */

window.SECTOR_FILTER = {
  
  sectors: [
    { code: 'ALL', name: 'جميع القطاعات', icon: '🌐' },
    { code: 'BANKING', name: 'الخدمات المصرفية', icon: '🏦' },
    { code: 'ENERGY', name: 'الطاقة والنفط', icon: '⛽' },
    { code: 'RETAIL', name: 'التجزئة والتسوق', icon: '🛍️' },
    { code: 'TECHNOLOGY', name: 'التكنولوجيا', icon: '💻' },
    { code: 'REAL_ESTATE', name: 'العقارات', icon: '🏢' },
    { code: 'HEALTHCARE', name: 'الرعاية الصحية', icon: '🏥' },
    { code: 'EDUCATION', name: 'التعليم', icon: '🎓' },
    { code: 'CONSTRUCTION', name: 'البناء والتشييد', icon: '🏗️' },
    { code: 'TOURISM', name: 'السياحة والفنادق', icon: '🏨' },
    { code: 'LOGISTICS', name: 'اللوجستيات', icon: '📦' },
    { code: 'MANUFACTURING', name: 'التصنيع', icon: '🏭' },
    { code: 'TELECOMMUNICATIONS', name: 'الاتصالات', icon: '📱' },
    { code: 'FOOD_BEVERAGE', name: 'الغذاء والمشروبات', icon: '🍽️' },
    { code: 'INSURANCE', name: 'التأمين', icon: '📋' },
    { code: 'INVESTMENT', name: 'الاستثمار', icon: '📈' },
    { code: 'LEGAL', name: 'الخدمات القانونية', icon: '⚖️' },
    { code: 'CONSULTING', name: 'الاستشارات', icon: '💡' },
    { code: 'HOSPITALITY', name: 'الضيافة', icon: '🍷' }
  ],
  
  // ═══════════════════════════════════════════════════════════════
  // CREATE FILTER UI
  // ═══════════════════════════════════════════════════════════════
  
  createFilterUI: function(containerId = 'sector-filter-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = `
      <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">🔍 تصفية حسب القطاع والمخاطر</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <!-- Sector Filter -->
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 8px;">القطاع</label>
            <select id="sector-filter-select" onchange="SECTOR_FILTER.filterCases()" 
              style="width: 100%; padding: 10px; border: 2px solid #E0E0E0; border-radius: 6px; font-size: 14px;">
    `;
    
    this.sectors.forEach(sector => {
      html += `<option value="${sector.code}">${sector.icon} ${sector.name}</option>`;
    });
    
    html += `
            </select>
          </div>
          
          <!-- Risk Level Filter -->
          <div>
            <label style="display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 8px;">مستوى المخاطر</label>
            <select id="risk-filter-select" onchange="SECTOR_FILTER.filterCases()"
              style="width: 100%; padding: 10px; border: 2px solid #E0E0E0; border-radius: 6px; font-size: 14px;">
              <option value="ALL">🌐 جميع المستويات</option>
              <option value="HIGH">⛔ مخاطر عالية فقط</option>
              <option value="MEDIUM">⚠️ مخاطر متوسطة فقط</option>
              <option value="LOW">✅ مخاطر منخفضة فقط</option>
            </select>
          </div>
        </div>
        
        <!-- Filter Stats -->
        <div id="filter-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 12px;">
          <div style="background: linear-gradient(135deg, #E8F5E9, #F1F8E9); padding: 12px; border-radius: 6px; border-left: 4px solid #4CAF50;">
            <div style="color: #666;">منخفضة (LOW)</div>
            <div style="font-size: 20px; font-weight: bold; color: #4CAF50;" id="stat-low">0</div>
          </div>
          <div style="background: linear-gradient(135deg, #FFF3E0, #FFEBEE); padding: 12px; border-radius: 6px; border-left: 4px solid #FF9800;">
            <div style="color: #666;">متوسطة (MEDIUM)</div>
            <div style="font-size: 20px; font-weight: bold; color: #FF9800;" id="stat-medium">0</div>
          </div>
          <div style="background: linear-gradient(135deg, #FFEBEE, #FCE4EC); padding: 12px; border-radius: 6px; border-left: 4px solid #FF5252;">
            <div style="color: #666;">عالية (HIGH)</div>
            <div style="font-size: 20px; font-weight: bold; color: #FF5252;" id="stat-high">0</div>
          </div>
          <div style="background: linear-gradient(135deg, #E3F2FD, #E1F5FE); padding: 12px; border-radius: 6px; border-left: 4px solid #2196F3;">
            <div style="color: #666;">الإجمالي</div>
            <div style="font-size: 20px; font-weight: bold; color: #2196F3;" id="stat-total">0</div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    this.updateStats();
  },
  
  // ═══════════════════════════════════════════════════════════════
  // FILTER CASES
  // ═══════════════════════════════════════════════════════════════
  
  filterCases: function() {
    const sectorFilter = document.getElementById('sector-filter-select')?.value || 'ALL';
    const riskFilter = document.getElementById('risk-filter-select')?.value || 'ALL';
    
    if (!window.eddDataModel) {
      console.warn('Data model not available');
      return;
    }
    
    let cases = window.eddDataModel.getAllCases();
    
    // Filter by sector
    if (sectorFilter !== 'ALL') {
      cases = cases.filter(c => c.sector === sectorFilter);
    }
    
    // Filter by risk level
    if (riskFilter !== 'ALL') {
      cases = cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === riskFilter);
    }
    
    // Update display
    this.displayFilteredCases(cases);
    this.updateStats();
  },
  
  displayFilteredCases: function(cases) {
    const container = document.getElementById('filtered-cases-list');
    if (!container) return;
    
    if (cases.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #999;">
          <div style="font-size: 48px; margin-bottom: 10px;">🔍</div>
          <div style="font-size: 16px; color: #666;">لا توجد حالات تطابق الفلاتر المختارة</div>
        </div>
      `;
      return;
    }
    
    let html = `
      <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
          📋 الحالات المطابقة (${cases.length})
        </h3>
        
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #F5F5F5; border-bottom: 2px solid #E0E0E0;">
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #666;">رقم الحالة</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #666;">اسم العميل</th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #666;">القطاع</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #666;">نقاط المخاطر</th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #666;">المستوى</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    cases.slice(0, 50).forEach(caseItem => {
      const rs = caseItem.riskScores;
      const color = this.getCategoryColor(rs.FINAL_RISK_CATEG);
      const icon = this.getCategoryIcon(rs.FINAL_RISK_CATEG);
      const sectorInfo = this.sectors.find(s => s.code === caseItem.sector);
      
      html += `
        <tr style="border-bottom: 1px solid #E0E0E0; transition: all 0.2s;">
          <td style="padding: 12px; font-size: 12px; color: #333;"><strong>${caseItem.id}</strong></td>
          <td style="padding: 12px; font-size: 12px; color: #666;">${caseItem.customer_name}</td>
          <td style="padding: 12px; font-size: 12px; color: #666;">
            ${sectorInfo ? sectorInfo.icon + ' ' + sectorInfo.name : caseItem.sector}
          </td>
          <td style="padding: 12px; text-align: center; font-size: 14px; font-weight: bold; color: ${color};">
            ${rs.FINAL_RISK_SCORE}
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="display: inline-block; background: ${color}20; color: ${color}; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">
              ${icon} ${rs.FINAL_RISK_CATEG}
            </span>
          </td>
        </tr>
      `;
    });
    
    if (cases.length > 50) {
      html += `
        <tr style="border-bottom: 1px solid #E0E0E0; background: #F9F9F9;">
          <td colspan="5" style="padding: 12px; text-align: center; color: #999; font-size: 12px;">
            وغيرها... (${cases.length - 50} حالة إضافية)
          </td>
        </tr>
      `;
    }
    
    html += `
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // UPDATE STATISTICS
  // ═══════════════════════════════════════════════════════════════
  
  updateStats: function() {
    const sectorFilter = document.getElementById('sector-filter-select')?.value || 'ALL';
    const riskFilter = document.getElementById('risk-filter-select')?.value || 'ALL';
    
    if (!window.eddDataModel) return;
    
    let cases = window.eddDataModel.getAllCases();
    
    if (sectorFilter !== 'ALL') {
      cases = cases.filter(c => c.sector === sectorFilter);
    }
    
    if (riskFilter !== 'ALL') {
      cases = cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === riskFilter);
    }
    
    const low = cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === 'LOW').length;
    const medium = cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === 'MEDIUM').length;
    const high = cases.filter(c => c.riskScores?.FINAL_RISK_CATEG === 'HIGH').length;
    const total = cases.length;
    
    document.getElementById('stat-low').textContent = low;
    document.getElementById('stat-medium').textContent = medium;
    document.getElementById('stat-high').textContent = high;
    document.getElementById('stat-total').textContent = total;
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
  
  getCategoryIcon: function(category) {
    const icons = {
      'HIGH': '⛔',
      'MEDIUM': '⚠️',
      'LOW': '✅'
    };
    return icons[category] || '❓';
  },
  
  getSectorInfo: function(code) {
    return this.sectors.find(s => s.code === code);
  }
};

console.log('[SECTOR FILTER] Loaded');
