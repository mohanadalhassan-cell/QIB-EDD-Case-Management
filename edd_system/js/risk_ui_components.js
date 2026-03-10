/**
 * ============================================================================
 * RISK UI COMPONENTS - مكونات واجهة المخاطر
 * ============================================================================
 * عرض نقاط المخاطر والمخططات التفاعلية
 */

window.RISK_UI = {
  
  // ═══════════════════════════════════════════════════════════════
  // 1️⃣ RISK SCORE CARD - بطاقة نقاط المخاطر
  // ═══════════════════════════════════════════════════════════════
  
  createRiskScoreCard: function(riskScores) {
    if (!riskScores) return '';
    
    const rs = riskScores;
    const color = this.getCategoryColor(rs.FINAL_RISK_CATEG);
    const icon = this.getCategoryIcon(rs.FINAL_RISK_CATEG);
    
    return `
      <div class="risk-score-card" style="background: linear-gradient(135deg, ${color}20 0%, ${color}05 100%); border: 2px solid ${color}; border-radius: 12px; padding: 20px; margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">نقاط المخاطر</div>
            <div style="font-size: 42px; font-weight: bold; color: ${color}; margin-bottom: 5px;">${rs.FINAL_RISK_SCORE}</div>
            <div style="font-size: 14px; color: #666;">
              <strong style="color: ${color};">${rs.FINAL_RISK_CATEG === 'HIGH' ? 'مخاطر عالية' : rs.FINAL_RISK_CATEG === 'MEDIUM' ? 'مخاطر متوسطة' : 'مخاطر منخفضة'}</strong>
            </div>
          </div>
          <div style="font-size: 60px; opacity: 0.3;">${icon}</div>
        </div>
        
        <div style="margin-top: 20px; border-top: 1px solid ${color}20; padding-top: 15px;">
          <div style="font-size: 12px; font-weight: 600; color: #333; margin-bottom: 10px;">مصادر المخاطر</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: white; padding: 10px; border-radius: 6px; border-left: 3px solid #FF9800;">
              <div style="font-size: 11px; color: #666;">الدولة</div>
              <div style="font-size: 16px; font-weight: bold; color: #333;">${rs.COUNTRY_RISK_SCORE}</div>
              <div style="font-size: 10px; color: #999;">${rs.COUNTRY_RISK_CATEG}</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 6px; border-left: 3px solid #2196F3;">
              <div style="font-size: 11px; color: #666;">النشاط</div>
              <div style="font-size: 16px; font-weight: bold; color: #333;">${rs.ACT_RISK_SCORE}</div>
              <div style="font-size: 10px; color: #999;">${rs.ACT_RISK_CATEG}</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 6px; border-left: 3px solid #4CAF50;">
              <div style="font-size: 11px; color: #666;">المنتج</div>
              <div style="font-size: 16px; font-weight: bold; color: #333;">${rs.PROD_RISK_SCORE}</div>
              <div style="font-size: 10px; color: #999;">${rs.PROD_RISK_CATEG}</div>
            </div>
            <div style="background: white; padding: 10px; border-radius: 6px; border-left: 3px solid #9C27B0;">
              <div style="font-size: 11px; color: #666;">المهنة</div>
              <div style="font-size: 16px; font-weight: bold; color: #333;">${rs.OCCP_RISK_SCORE}</div>
              <div style="font-size: 10px; color: #999;">${rs.OCCP_RISK_CATEG}</div>
            </div>
          </div>
        </div>
        
        ${rs.PRIMARY_RISK_DRIVER ? `
        <div style="margin-top: 15px; background: white; padding: 12px; border-radius: 6px; border-left: 4px solid ${color};">
          <div style="font-size: 11px; color: #666; font-weight: 600;">مصدر المخاطر الرئيسي</div>
          <div style="font-size: 14px; color: ${color}; font-weight: bold; margin-top: 5px;">
            ${this.getDriverLabel(rs.PRIMARY_RISK_DRIVER)}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 2️⃣ RISK PROFILE - ملف المخاطر الشامل
  // ═══════════════════════════════════════════════════════════════
  
  createRiskProfile: function(caseData) {
    if (!caseData || !caseData.riskScores) return '';
    
    const rs = caseData.riskScores;
    
    return `
      <div style="background: #F5F7FA; border-radius: 12px; padding: 20px; margin: 15px 0;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📊 ملف المخاطر الشامل</h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div style="background: white; padding: 15px; border-radius: 8px; border-top: 4px solid #FF5252;">
            <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px;">الدولة</div>
            <div style="font-size: 20px; font-weight: bold; color: ${this.getCategoryColor(rs.COUNTRY_RISK_CATEG)};">${rs.COUNTRY_RISK_SCORE}</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">حالة: <span style="color: ${this.getCategoryColor(rs.COUNTRY_RISK_CATEG)};">${rs.COUNTRY_RISK_CATEG}</span></div>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px; border-top: 4px solid #FF9800;">
            <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px;">النشاط</div>
            <div style="font-size: 20px; font-weight: bold; color: ${this.getCategoryColor(rs.ACT_RISK_CATEG)};">${rs.ACT_RISK_SCORE}</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">حالة: <span style="color: ${this.getCategoryColor(rs.ACT_RISK_CATEG)};">${rs.ACT_RISK_CATEG}</span></div>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px; border-top: 4px solid #2196F3;">
            <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px;">المنتج</div>
            <div style="font-size: 20px; font-weight: bold; color: ${this.getCategoryColor(rs.PROD_RISK_CATEG)};">${rs.PROD_RISK_SCORE}</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">حالة: <span style="color: ${this.getCategoryColor(rs.PROD_RISK_CATEG)};">${rs.PROD_RISK_CATEG}</span></div>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px; border-top: 4px solid #4CAF50;">
            <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px;">المهنة</div>
            <div style="font-size: 20px; font-weight: bold; color: ${this.getCategoryColor(rs.OCCP_RISK_CATEG)};">${rs.OCCP_RISK_SCORE}</div>
            <div style="font-size: 12px; color: #999; margin-top: 5px;">حالة: <span style="color: ${this.getCategoryColor(rs.OCCP_RISK_CATEG)};">${rs.OCCP_RISK_CATEG}</span></div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 3️⃣ RISK BREAKDOWN CHART - رسم بياني لتوزيع المخاطر
  // ═══════════════════════════════════════════════════════════════
  
  createRiskChart: function(riskScores, containerId = 'risk-chart') {
    if (!riskScores) return;
    
    const rs = riskScores;
    const data = [
      { label: 'الدولة', value: rs.COUNTRY_RISK_SCORE, color: '#FF5252' },
      { label: 'النشاط', value: rs.ACT_RISK_SCORE, color: '#FF9800' },
      { label: 'المنتج', value: rs.PROD_RISK_SCORE, color: '#2196F3' },
      { label: 'المهنة', value: rs.OCCP_RISK_SCORE, color: '#4CAF50' }
    ];
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = `
      <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 20px 0; color: #333; font-size: 16px;">📈 توزيع نقاط المخاطر</h3>
        
        <div style="display: flex; gap: 30px; flex-wrap: wrap;">
          <!-- Bar Chart -->
          <div style="flex: 1; min-width: 250px;">
    `;
    
    data.forEach(item => {
      const percentage = total > 0 ? (item.value / total * 100) : 0;
      html += `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <strong style="font-size: 12px; color: #333;">${item.label}</strong>
            <span style="font-size: 12px; color: ${item.color}; font-weight: bold;">${item.value}</span>
          </div>
          <div style="background: #E0E0E0; height: 20px; border-radius: 10px; overflow: hidden;">
            <div style="background: ${item.color}; height: 100%; width: ${percentage}%; transition: all 0.3s; display: flex; align-items: center; justify-content: flex-end; padding-right: 5px; color: white; font-size: 10px; font-weight: bold;">
              ${percentage.toFixed(0)}%
            </div>
          </div>
        </div>
      `;
    });
    
    html += `
          </div>
          
          <!-- Donut Chart -->
          <div style="flex: 1; min-width: 200px; display: flex; align-items: center; justify-content: center;">
            <svg viewBox="0 0 120 120" style="width: 150px; height: 150px;">
    `;
    
    let currentAngle = 0;
    data.forEach(item => {
      const percentage = total > 0 ? (item.value / total) : 0;
      const angle = percentage * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      
      const x1 = 60 + 40 * Math.cos(startRad);
      const y1 = 60 + 40 * Math.sin(startRad);
      const x2 = 60 + 40 * Math.cos(endRad);
      const y2 = 60 + 40 * Math.sin(endRad);
      
      const largeArc = angle > 180 ? 1 : 0;
      
      const pathData = `M 60 60 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
      
      html += `<path d="${pathData}" fill="${item.color}" stroke="white" stroke-width="2" />`;
      
      currentAngle = endAngle;
    });
    
    html += `
              <circle cx="60" cy="60" r="25" fill="white" />
            </svg>
          </div>
        </div>
        
        <!-- Legend -->
        <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;">
    `;
    
    data.forEach(item => {
      const percentage = total > 0 ? (item.value / total * 100) : 0;
      html += `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 12px; height: 12px; background: ${item.color}; border-radius: 2px;"></div>
          <div style="font-size: 11px; color: #666;">
            <div style="font-weight: 600;">${item.label}</div>
            <div>${item.value} نقطة (${percentage.toFixed(0)}%)</div>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
    
    container.innerHTML = html;
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
  
  getDriverLabel: function(driver) {
    const labels = {
      'COUNTRY': '🌍 مخاطر جغرافية',
      'ACTIVITY': '💼 مخاطر النشاط التجاري',
      'PRODUCT': '💳 مخاطر المنتج',
      'OCCUPATION': '👔 مخاطر المهنة',
      'PEP': '🚨 شخص مكشوف سياسياً'
    };
    return labels[driver] || driver;
  }
};

console.log('[RISK UI] Components loaded');
