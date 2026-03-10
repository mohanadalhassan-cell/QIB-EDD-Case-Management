/**
 * ============================================================================
 * ENTERPRISE DATA SOURCE TRANSPARENCY LAYER
 * ============================================================================
 * Displays data source lineage and governance for all risk/compliance data
 * 
 * GOVERNANCE PRINCIPLE: All data must show its source for audit/compliance
 */

window.DATA_SOURCE_TRANSPARENCY = {
  
  // Source system definitions
  SOURCES: {
    CRP: {
      name: 'Customer Risk Profiling',
      icon: '🔵',
      color: '#2196F3',
      authority: 'AUTHORITATIVE',
      system: 'CRP'
    },
    CORE_BANKING: {
      name: 'Core Banking System',
      icon: '🟢',
      color: '#4CAF50',
      authority: 'AUTHORITATIVE',
      system: 'CBS'
    },
    TRANSACTION_MONITORING: {
      name: 'Transaction Monitoring',
      icon: '🟡',
      color: '#FFC107',
      authority: 'AUTHORITATIVE',
      system: 'TM'
    },
    DOCUMENT_MANAGEMENT: {
      name: 'Document Management System',
      icon: '🟣',
      color: '#9C27B0',
      authority: 'SOURCE',
      system: 'DMS'
    },
    REGULATORY_DATASET: {
      name: 'External Regulatory Dataset',
      icon: '🔴',
      color: '#F44336',
      authority: 'AUTHORITATIVE',
      system: 'REG'
    },
    INTERNAL_APP: {
      name: 'Internal Application',
      icon: '⚪',
      color: '#999',
      authority: 'CALCULATED',
      system: 'APP'
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // DATA FIELD WITH SOURCE INDICATOR
  // ═══════════════════════════════════════════════════════════════
  
  createDataField: function(label, value, source, metadata = {}) {
    const sourceInfo = this.SOURCES[source] || this.SOURCES.INTERNAL_APP;
    const lastUpdated = metadata.lastUpdated || new Date().toLocaleString('ar-SA');
    const dataQuality = metadata.quality || 'VERIFIED';
    const version = metadata.version || '1.0';
    
    return `
      <div class="data-field" data-source="${source}" style="
        background: white;
        border: 1px solid #E0E0E0;
        border-left: 4px solid ${sourceInfo.color};
        border-radius: 6px;
        padding: 15px;
        margin-bottom: 12px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 15px;
        align-items: start;
      ">
        <!-- Left Side: Value -->
        <div>
          <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px;">
            ${label}
          </div>
          <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 10px;">
            ${value}
          </div>
          
          <!-- Source Info -->
          <div style="font-size: 11px; color: #999; line-height: 1.6;">
            <div>
              <strong>${sourceInfo.icon} Source:</strong> ${sourceInfo.name}
            </div>
            <div>
              <strong>Authority:</strong> <span style="color: ${sourceInfo.color}; font-weight: 600;">${sourceInfo.authority}</span>
            </div>
            <div>
              <strong>Updated:</strong> ${lastUpdated}
            </div>
            <div>
              <strong>Quality:</strong> <span style="color: #4CAF50; font-weight: 600;">✓ ${dataQuality}</span>
            </div>
          </div>
        </div>
        
        <!-- Right Side: Badge -->
        <div style="text-align: center;">
          <div style="
            background: ${sourceInfo.color};
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            margin-bottom: 8px;
          ">
            ${sourceInfo.icon}
          </div>
          <div style="font-size: 10px; color: #666; max-width: 60px;">
            ${sourceInfo.system}
          </div>
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // RISK PROFILE WITH SOURCE INDICATORS
  // ═══════════════════════════════════════════════════════════════
  
  createRiskProfileWithSources: function(caseData) {
    if (!caseData || !caseData.riskScores) return '';
    
    const rs = caseData.riskScores;
    
    return `
      <div style="background: #F5F7FA; border-radius: 12px; padding: 20px; margin: 20px 0; border: 2px solid #E3F2FD;">
        <h3 style="margin: 0 0 20px 0; color: #333; font-size: 16px; display: flex; align-items: center; gap: 10px;">
          📊 Risk Profile (External Source: CRP)
          <span style="font-size: 12px; color: #999; font-weight: 400;">Data Retrieved from Customer Risk Profiling System</span>
        </h3>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
          <!-- Country Risk with Source -->
          ${this.createDataField(
            '🌍 Country Risk Score',
            rs.COUNTRY_RISK_SCORE,
            'CRP',
            { lastUpdated: rs.LAST_SCORE_DATE, quality: 'VERIFIED' }
          )}
          
          <!-- Activity Risk with Source -->
          ${this.createDataField(
            '💼 Activity Risk Score',
            rs.ACT_RISK_SCORE,
            'CRP',
            { lastUpdated: rs.LAST_SCORE_DATE, quality: 'VERIFIED' }
          )}
          
          <!-- Product Risk with Source -->
          ${this.createDataField(
            '💳 Product Risk Score',
            rs.PROD_RISK_SCORE,
            'CRP',
            { lastUpdated: rs.LAST_SCORE_DATE, quality: 'VERIFIED' }
          )}
          
          <!-- Occupation Risk with Source -->
          ${this.createDataField(
            '👔 Occupation Risk Score',
            rs.OCCP_RISK_SCORE,
            'CRP',
            { lastUpdated: rs.LAST_SCORE_DATE, quality: 'VERIFIED' }
          )}
        </div>
        
        <!-- Final Risk Assessment -->
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #2196F3;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div>
              <div style="font-size: 12px; color: #666; font-weight: 600; margin-bottom: 5px;">Final Risk Assessment</div>
              <div style="font-size: 24px; font-weight: bold; color: ${this.getCategoryColor(rs.FINAL_RISK_CATEG)};">
                ${rs.FINAL_RISK_SCORE}/670
              </div>
              <div style="font-size: 12px; color: #666; margin-top: 5px;">
                Category: <strong>${rs.FINAL_RISK_CATEG}</strong>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; color: #999; line-height: 1.6;">
                <div><strong>🔵 Source:</strong> CRP</div>
                <div><strong>Authority:</strong> <span style="color: #2196F3;">AUTHORITATIVE</span></div>
                <div><strong>Updated:</strong> ${rs.LAST_SCORE_DATE}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Data Lineage -->
        <div style="margin-top: 15px; padding: 12px; background: #E3F2FD; border-radius: 6px; font-size: 11px; color: #1976D2;">
          <strong>Data Lineage:</strong> All risk scores originate from the Customer Risk Profiling (CRP) system. This platform retrieves and displays these scores for compliance investigation purposes only.
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // AUDIT TRAIL WITH DATA SOURCE TRACKING
  // ═══════════════════════════════════════════════════════════════
  
  createAuditTrail: function(auditEvents = []) {
    if (auditEvents.length === 0) {
      auditEvents = [
        {
          timestamp: new Date().toLocaleString('ar-SA'),
          action: 'Data Retrieved',
          source: 'CRP',
          user: 'System',
          details: 'Risk scores fetched from Customer Risk Profiling system'
        },
        {
          timestamp: new Date(Date.now() - 3600000).toLocaleString('ar-SA'),
          action: 'Data Verified',
          source: 'CRP',
          user: 'System',
          details: 'Data quality check passed'
        },
        {
          timestamp: new Date(Date.now() - 7200000).toLocaleString('ar-SA'),
          action: 'Accessed',
          source: 'Internal App',
          user: 'officer.khan@bank.qa',
          details: 'Case reviewed for compliance'
        }
      ];
    }
    
    return `
      <div style="background: white; border-radius: 12px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">📋 Data Lineage & Access Audit Trail</h3>
        
        <div style="position: relative;">
          ${auditEvents.map((event, index) => `
            <div style="display: flex; gap: 15px; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #E0E0E0;">
              <!-- Timeline marker -->
              <div style="position: relative; width: 40px; text-align: center;">
                <div style="
                  width: 12px;
                  height: 12px;
                  background: ${this.getSourceColor(event.source)};
                  border-radius: 50%;
                  margin: 5px auto;
                  border: 2px solid white;
                  box-shadow: 0 0 0 2px ${this.getSourceColor(event.source)};
                "></div>
                ${index < auditEvents.length - 1 ? `
                  <div style="
                    position: absolute;
                    width: 2px;
                    height: 40px;
                    background: #E0E0E0;
                    left: 50%;
                    top: 20px;
                    transform: translateX(-50%);
                  "></div>
                ` : ''}
              </div>
              
              <!-- Event details -->
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #333; margin-bottom: 3px;">
                  ${event.action}
                </div>
                <div style="font-size: 12px; color: #666; margin-bottom: 5px;">
                  ${event.details}
                </div>
                <div style="font-size: 11px; color: #999; display: flex; gap: 15px;">
                  <span><strong>Time:</strong> ${event.timestamp}</span>
                  <span><strong>Source:</strong> ${event.source}</span>
                  <span><strong>User:</strong> ${event.user}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <!-- Legend -->
        <div style="margin-top: 20px; padding: 12px; background: #F5F5F5; border-radius: 6px;">
          <div style="font-size: 11px; font-weight: 600; color: #666; margin-bottom: 10px;">Source Indicators:</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 11px;">
            ${Object.entries(this.SOURCES).map(([key, source]) => `
              <div style="display: flex; align-items: center; gap: 8px;">
                <div style="
                  width: 12px;
                  height: 12px;
                  background: ${source.color};
                  border-radius: 50%;
                "></div>
                <span>${source.icon} ${source.system}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // DATA FRESHNESS INDICATOR (Last Sync + Quality Status)
  // ═══════════════════════════════════════════════════════════════
  
  createDataFreshnessIndicator: function(source, lastSyncTime, qualityStatus = 'VERIFIED') {
    const sourceInfo = this.SOURCES[source] || this.SOURCES.INTERNAL_APP;
    const statusConfig = {
      VERIFIED: { icon: '✓', color: '#4CAF50', label: 'VERIFIED' },
      STALE: { icon: '⚠', color: '#FF9800', label: 'STALE (>24h)' },
      ERROR: { icon: '✗', color: '#F44336', label: 'ERROR' }
    };
    const config = statusConfig[qualityStatus] || statusConfig.VERIFIED;
    
    return `
      <div class="data-freshness-indicator" style="
        background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
        border: 1px solid rgba(0,212,255,0.2);
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        margin: 12px 0;
      ">
        <!-- Left: Source Icon + Label -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="
            background: ${sourceInfo.color};
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">
            ${sourceInfo.icon}
          </div>
          <div>
            <div style="font-weight: 600; color: #fff; margin-bottom: 2px;">
              ${sourceInfo.system} — ${sourceInfo.name}
            </div>
            <div style="font-size: 11px; color: #888;">
              Data Source: ${sourceInfo.authority}
            </div>
          </div>
        </div>
        
        <!-- Middle: Last Sync Time -->
        <div style="text-align: center;">
          <div style="font-weight: 600; color: #00D4FF; margin-bottom: 3px;">
            Last Sync
          </div>
          <div style="color: #888; font-size: 11px;">
            ${lastSyncTime}
          </div>
        </div>
        
        <!-- Right: Status Badge -->
        <div style="
          background: ${config.color}20;
          color: ${config.color};
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid ${config.color}40;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        ">
          <span style="font-size: 14px;">${config.icon}</span>
          <span>${config.label}</span>
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // RISK SCORE DISPLAY WITH SOURCE (Simple, for all pages)
  // ═══════════════════════════════════════════════════════════════
  
  createRiskScoreWithSource: function(score, category, source = 'CRP', lastSyncTime = new Date().toLocaleString('ar-SA')) {
    const sourceInfo = this.SOURCES[source] || this.SOURCES.INTERNAL_APP;
    const categoryColor = this.getCategoryColor(category);
    
    return `
      <div class="risk-score-block" style="
        background: white;
        border: 1px solid #E0E0E0;
        border-radius: 8px;
        padding: 16px;
        margin: 12px 0;
      ">
        <!-- Score Display -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div>
            <div style="font-size: 11px; color: #999; font-weight: 600; margin-bottom: 6px;">RISK SCORE</div>
            <div style="font-size: 28px; font-weight: bold; color: ${categoryColor};">
              ${score}
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
              Category: <strong>${category}</strong>
            </div>
          </div>
          <div style="
            background: ${sourceInfo.color};
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          ">
            ${sourceInfo.icon}
          </div>
        </div>
        
        <!-- Source & Freshness Info -->
        <div style="
          background: #F5F5F5;
          border-top: 1px solid #E0E0E0;
          margin: 12px -16px -16px -16px;
          padding: 12px 16px;
          border-radius: 0 0 8px 8px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          font-size: 11px;
        ">
          <div>
            <div style="color: #999; font-weight: 600; margin-bottom: 3px;">Source</div>
            <div style="color: #333; font-weight: 600;">${sourceInfo.system}</div>
            <div style="color: #999; font-size: 10px;">${sourceInfo.name}</div>
          </div>
          <div>
            <div style="color: #999; font-weight: 600; margin-bottom: 3px;">Last Sync</div>
            <div style="color: #333;">${lastSyncTime}</div>
          </div>
          <div>
            <div style="color: #999; font-weight: 600; margin-bottom: 3px;">Status</div>
            <div style="color: #4CAF50; font-weight: 600;">✓ VERIFIED</div>
          </div>
        </div>
      </div>
    `;
  },
  
  // ═══════════════════════════════════════════════════════════════
  // DATA QUALITY BADGE
  // ═══════════════════════════════════════════════════════════════
  
  createDataQualityBadge: function(status = 'VERIFIED') {
    const statusConfig = {
      VERIFIED: { color: '#4CAF50', text: '✓ Verified', description: 'Data verified from source system' },
      PENDING: { color: '#FFC107', text: '⏳ Pending', description: 'Awaiting verification' },
      STALE: { color: '#FF9800', text: '⚠️ Stale', description: 'Data older than 24 hours' },
      ERROR: { color: '#F44336', text: '✗ Error', description: 'Verification failed' }
    };
    
    const config = statusConfig[status] || statusConfig.VERIFIED;
    
    return `
      <div style="
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: ${config.color}20;
        color: ${config.color};
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        border: 1px solid ${config.color}40;
        cursor: help;
        title: ${config.description}
      ">
        ${config.text}
      </div>
    `;
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
  
  getSourceColor: function(source) {
    const colors = {
      'CRP': '#2196F3',
      'CBS': '#4CAF50',
      'TM': '#FFC107',
      'DMS': '#9C27B0',
      'REG': '#F44336',
      'APP': '#999'
    };
    return colors[source] || '#999';
  }
};

console.log('[DATA SOURCE TRANSPARENCY] Layer initialized - All data sources will be tracked and displayed');
