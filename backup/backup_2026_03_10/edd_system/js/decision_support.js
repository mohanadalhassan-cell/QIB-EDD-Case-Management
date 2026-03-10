/**
 * QIB EDD System - Decision Support Module
 * =========================================
 * 
 * CRITICAL PRINCIPLE: Human-in-the-Loop
 * 
 * This module implements a Decision Support System (DSS), NOT a Decision Engine.
 * The system:
 *   - Collects and presents data
 *   - Displays behavioral indicators
 *   - Highlights anomalies for review
 * 
 * The system does NOT:
 *   - Generate automated risk scores
 *   - Make automated decisions
 *   - Override employee judgment
 * 
 * FINAL DECISION = EMPLOYEE RESPONSIBILITY
 */

const DecisionSupport = {

  // =====================================================
  // INDICATOR TYPES (No Risk Scores)
  // =====================================================

  indicatorTypes: {
    INCOME_MISMATCH: {
      code: 'INC_MISMATCH',
      title: 'Income Mismatch',
      titleAr: 'تضارب الدخل',
      category: 'FINANCIAL',
      icon: '💰'
    },
    ACTIVITY_EXCEEDS: {
      code: 'ACT_EXCEEDS',
      title: 'Activity Exceeds Expected',
      titleAr: 'النشاط يتجاوز المتوقع',
      category: 'ACTIVITY',
      icon: '📊'
    },
    AML_POSITIVE: {
      code: 'AML_POS',
      title: 'AML Positive Result',
      titleAr: 'نتيجة AML إيجابية',
      category: 'SCREENING',
      icon: '🔴'
    },
    PEP_STATUS: {
      code: 'PEP',
      title: 'PEP Identified',
      titleAr: 'شخص سياسي بارز',
      category: 'SCREENING',
      icon: '👔'
    },
    DORMANT_REACTIVATION: {
      code: 'DORMANT',
      title: 'Dormant Account Reactivation',
      titleAr: 'إعادة تنشيط حساب خامل',
      category: 'ACTIVITY',
      icon: '⏰'
    },
    SALARY_GAP: {
      code: 'SAL_GAP',
      title: 'Salary Credit Gap',
      titleAr: 'انقطاع الراتب',
      category: 'FINANCIAL',
      icon: '📅'
    },
    HIGH_CASH: {
      code: 'HIGH_CASH',
      title: 'High Cash Activity',
      titleAr: 'نشاط نقدي مرتفع',
      category: 'ACTIVITY',
      icon: '💵'
    },
    MULTI_JURISDICTION: {
      code: 'MULTI_JURIS',
      title: 'Multiple Jurisdictions',
      titleAr: 'تعاملات متعددة الدول',
      category: 'GEOGRAPHIC',
      icon: '🌍'
    },
    COMPLEX_STRUCTURE: {
      code: 'COMPLEX',
      title: 'Complex Relationship Structure',
      titleAr: 'هيكل علاقات معقد',
      category: 'RELATIONSHIP',
      icon: '🕸️'
    },
    OCCUPATION_SENSITIVE: {
      code: 'OCC_SENS',
      title: 'Sensitive Occupation',
      titleAr: 'مهنة حساسة',
      category: 'PROFILE',
      icon: '⚠️'
    }
  },

  // =====================================================
  // EMPLOYEE ASSESSMENT OPTIONS
  // =====================================================

  assessmentOptions: [
    {
      id: 'NO_CONCERNS',
      label: 'No Concerns Identified',
      labelAr: 'لا توجد مخاوف',
      description: 'All indicators reviewed, no risk concerns identified',
      color: '#4CAF50',
      icon: '✅'
    },
    {
      id: 'EXPLANATION_ACCEPTABLE',
      label: 'Explanation Acceptable',
      labelAr: 'تفسير مقبول',
      description: 'Customer provided satisfactory explanation for indicators',
      color: '#2196F3',
      icon: '📝'
    },
    {
      id: 'FURTHER_REVIEW',
      label: 'Further Review Required',
      labelAr: 'مراجعة إضافية مطلوبة',
      description: 'Additional documentation or verification needed',
      color: '#FF9800',
      icon: '🔍'
    },
    {
      id: 'ESCALATE_COMPLIANCE',
      label: 'Escalate to Compliance',
      labelAr: 'تصعيد للامتثال',
      description: 'Suspicious indicators require compliance review',
      color: '#F44336',
      icon: '⬆️'
    }
  ],

  // =====================================================
  // DETECT INDICATORS (Not Risk Scores)
  // =====================================================

  detectIndicators: function(customerRim) {
    const customer = MockData.customers.find(c => c.rim === customerRim);
    const financial = EnterpriseFeatures.getFinancialProfile(customerRim);
    const activity = EnterpriseFeatures.getExpectedActivity(customerRim);
    
    const indicators = [];
    
    if (!customer) return indicators;

    // Income Mismatch Detection
    if (financial) {
      const declaredSalary = financial.SALARY || 0;
      const actualSalary = financial.LAST_SAL_AMT || 0;
      
      if (declaredSalary > 0 && actualSalary > declaredSalary * 2) {
        indicators.push({
          type: this.indicatorTypes.INCOME_MISMATCH,
          observation: `Actual salary (${actualSalary.toLocaleString()} QAR) differs significantly from declared salary (${declaredSalary.toLocaleString()} QAR)`,
          observationAr: `الراتب الفعلي (${actualSalary.toLocaleString()} ر.ق) يختلف بشكل كبير عن المصرح (${declaredSalary.toLocaleString()} ر.ق)`,
          dataPoints: {
            declaredSalary: declaredSalary,
            actualSalary: actualSalary,
            variance: ((actualSalary - declaredSalary) / declaredSalary * 100).toFixed(1) + '%'
          }
        });
      }

      // Salary Gap Detection
      if (financial.LAST_SAL_DA) {
        const lastSalaryDate = new Date(financial.LAST_SAL_DA);
        const daysSince = Math.floor((new Date() - lastSalaryDate) / (1000 * 60 * 60 * 24));
        if (daysSince > 90) {
          indicators.push({
            type: this.indicatorTypes.SALARY_GAP,
            observation: `No salary credit received for ${daysSince} days (last: ${financial.LAST_SAL_DA})`,
            observationAr: `لم يتم استلام راتب منذ ${daysSince} يوم`,
            dataPoints: {
              lastSalaryDate: financial.LAST_SAL_DA,
              daysSinceLastSalary: daysSince
            }
          });
        }
      }
    }

    // Activity Exceeds Expected
    if (activity && financial) {
      const monthlyExpected = (activity.LM_EXP_CASH || 0) + (activity.LM_EXP_NONCASH || 0) + (activity.LM_EXP_TRFR || 0);
      const monthlyCapacity = (financial.LAST_SAL_AMT || 0) * 3;
      
      if (monthlyExpected > monthlyCapacity && monthlyCapacity > 0) {
        indicators.push({
          type: this.indicatorTypes.ACTIVITY_EXCEEDS,
          observation: `Expected monthly activity (${monthlyExpected.toLocaleString()} QAR) exceeds financial capacity based on salary`,
          observationAr: `النشاط الشهري المتوقع (${monthlyExpected.toLocaleString()} ر.ق) يتجاوز القدرة المالية`,
          dataPoints: {
            expectedActivity: monthlyExpected,
            salaryCapacity: monthlyCapacity,
            ratio: (monthlyExpected / monthlyCapacity).toFixed(1) + 'x'
          }
        });
      }

      // Deviation Flag
      if (activity.DEVIATION_FLAG) {
        indicators.push({
          type: this.indicatorTypes.ACTIVITY_EXCEEDS,
          observation: activity.DEVIATION_REASON || 'Actual activity deviates from expected profile',
          observationAr: 'النشاط الفعلي يختلف عن النمط المتوقع',
          dataPoints: {
            actualVsExpectedRatio: activity.ACTUAL_VS_EXPECTED_RATIO
          }
        });
      }
    }

    // PEP Status
    if (customer.riskScores && customer.riskScores.IS_PEP) {
      indicators.push({
        type: this.indicatorTypes.PEP_STATUS,
        observation: 'Customer identified as Politically Exposed Person',
        observationAr: 'العميل مصنف كشخص سياسي بارز',
        dataPoints: {
          pepStatus: true
        }
      });
    }

    // AML Results
    if (customer.amlResults) {
      const positiveResults = customer.amlResults.filter(r => r.result === 'POSITIVE' || r.result === 'POTENTIAL_MATCH');
      positiveResults.forEach(result => {
        indicators.push({
          type: this.indicatorTypes.AML_POSITIVE,
          observation: `${result.screeningType} screening returned ${result.result}`,
          observationAr: `فحص ${result.screeningType} أظهر نتيجة ${result.result}`,
          dataPoints: {
            screeningType: result.screeningType,
            result: result.result,
            matchScore: result.matchScore
          }
        });
      });
    }

    // High Cash Activity
    if (activity && activity.LM_EXP_CASH > 50000) {
      indicators.push({
        type: this.indicatorTypes.HIGH_CASH,
        observation: `High expected cash activity: ${activity.LM_EXP_CASH.toLocaleString()} QAR per month`,
        observationAr: `نشاط نقدي متوقع مرتفع: ${activity.LM_EXP_CASH.toLocaleString()} ر.ق شهرياً`,
        dataPoints: {
          expectedCash: activity.LM_EXP_CASH,
          expectedInwardCash: activity.EXP_INWARD_CASH,
          expectedOutwardCash: activity.EXP_OUTWARD_CASH
        }
      });
    }

    // Complex Structure (from network)
    const network = EnterpriseFeatures.getCustomerNetwork(customerRim);
    if (network && network.relatedNodes.length > 5) {
      indicators.push({
        type: this.indicatorTypes.COMPLEX_STRUCTURE,
        observation: `Customer has ${network.relatedNodes.length} related entities including companies and joint accounts`,
        observationAr: `العميل لديه ${network.relatedNodes.length} كيان مرتبط تشمل شركات وحسابات مشتركة`,
        dataPoints: {
          relatedEntities: network.relatedNodes.length,
          accounts: network.accounts.length
        }
      });
    }

    // Sensitive Occupation
    const sensitiveOccupations = ['Money Exchange', 'Real Estate', 'Jewelry', 'Car Dealer', 'Import/Export'];
    if (customer.occupation && sensitiveOccupations.some(o => customer.occupation.includes(o))) {
      indicators.push({
        type: this.indicatorTypes.OCCUPATION_SENSITIVE,
        observation: `Customer occupation "${customer.occupation}" is classified as sensitive for AML purposes`,
        observationAr: `مهنة العميل "${customer.occupation}" مصنفة كمهنة حساسة`,
        dataPoints: {
          occupation: customer.occupation
        }
      });
    }

    return indicators;
  },

  // =====================================================
  // SHOW ANALYSIS PANEL (Indicators Only, No Scores)
  // =====================================================

  showAnalysisPanel: function(customerRim) {
    const customer = MockData.customers.find(c => c.rim === customerRim);
    const financial = EnterpriseFeatures.getFinancialProfile(customerRim);
    const activity = EnterpriseFeatures.getExpectedActivity(customerRim);
    const indicators = this.detectIndicators(customerRim);

    const formatCurrency = (amt) => amt ? amt.toLocaleString() + ' QAR' : 'N/A';
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB') : 'N/A';

    const panelHTML = `
      <div id="analysisPanel" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 10, 20, 0.95); z-index: 10000; overflow-y: auto;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 30px;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div>
              <h1 style="font-size: 28px; margin: 0;">📋 Customer Analysis Panel</h1>
              <p style="color: var(--text-muted); margin: 8px 0 0 0;">لوحة تحليل العميل — Decision Support System</p>
            </div>
            <button onclick="DecisionSupport.closeAnalysisPanel()" style="background: rgba(255,255,255,0.1); border: none; padding: 12px 24px; border-radius: 8px; color: white; cursor: pointer;">
              ✕ Close
            </button>
          </div>

          <!-- Important Notice -->
          <div style="background: linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(33, 150, 243, 0.05)); border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="font-size: 32px;">ℹ️</div>
              <div>
                <div style="font-weight: 600; font-size: 16px;">Decision Support System — نظام دعم القرار</div>
                <div style="color: var(--text-muted); margin-top: 5px; font-size: 13px;">
                  This system presents indicators for your review. <strong>The final assessment is your responsibility.</strong><br/>
                  هذا النظام يعرض المؤشرات لمراجعتك. <strong>القرار النهائي هو مسؤوليتك.</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Customer Summary -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
              <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Customer</div>
              <div style="font-size: 18px; font-weight: 600; margin-top: 5px;">${customer ? customer.name : 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 13px;">${customer ? customer.nameAr : ''}</div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
              <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Relationship Since</div>
              <div style="font-size: 18px; font-weight: 600; margin-top: 5px;">${customer ? customer.relationshipSince || '2019' : 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 13px;">~${customer ? Math.floor((new Date() - new Date(customer.relationshipSince || '2019')) / (365.25 * 24 * 60 * 60 * 1000)) : 0} Years</div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
              <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Declared Salary</div>
              <div style="font-size: 18px; font-weight: 600; margin-top: 5px;">${financial ? formatCurrency(financial.SALARY) : 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 13px;">At onboarding</div>
            </div>
            <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
              <div style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">Actual Salary</div>
              <div style="font-size: 18px; font-weight: 600; margin-top: 5px;">${financial ? formatCurrency(financial.LAST_SAL_AMT) : 'N/A'}</div>
              <div style="color: var(--text-muted); font-size: 13px;">Most recent</div>
            </div>
          </div>

          <!-- Two Column Layout -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            
            <!-- Left: Indicators Detected -->
            <div>
              <h2 style="font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span>🔍</span> Indicators Detected — المؤشرات المكتشفة
                <span style="background: rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 20px; font-size: 14px;">${indicators.length}</span>
              </h2>
              
              ${indicators.length === 0 ? `
                <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 12px; padding: 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                  <div style="font-weight: 600;">No Indicators Detected</div>
                  <div style="color: var(--text-muted); margin-top: 5px;">لم يتم اكتشاف مؤشرات</div>
                </div>
              ` : indicators.map((ind, i) => `
                <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                  <div style="display: flex; align-items: flex-start; gap: 15px;">
                    <div style="font-size: 28px;">${ind.type.icon}</div>
                    <div style="flex: 1;">
                      <div style="font-weight: 600; font-size: 15px;">${ind.type.title}</div>
                      <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 8px;">${ind.type.titleAr}</div>
                      <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; font-size: 13px; margin-top: 10px;">
                        📌 <strong>Observation:</strong> ${ind.observation}
                      </div>
                      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                        ${Object.entries(ind.dataPoints).map(([key, val]) => `
                          <span style="background: rgba(0, 212, 255, 0.1); padding: 4px 10px; border-radius: 4px; font-size: 11px;">
                            ${key}: <strong>${val}</strong>
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Right: Employee Assessment -->
            <div>
              <h2 style="font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span>📝</span> Employee Assessment — تقييم الموظف
              </h2>

              <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px;">
                
                <!-- Assessment Options -->
                <div style="margin-bottom: 24px;">
                  <label style="font-weight: 600; display: block; margin-bottom: 12px;">Select Your Assessment — اختر تقييمك</label>
                  ${this.assessmentOptions.map(opt => `
                    <label style="display: flex; align-items: center; gap: 12px; padding: 15px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s;" 
                           onmouseover="this.style.borderColor='${opt.color}'" 
                           onmouseout="this.style.borderColor='var(--border-color)'">
                      <input type="radio" name="assessment" value="${opt.id}" style="width: 18px; height: 18px; accent-color: ${opt.color};">
                      <div style="font-size: 24px;">${opt.icon}</div>
                      <div>
                        <div style="font-weight: 600;">${opt.label}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${opt.labelAr}</div>
                        <div style="font-size: 11px; color: #9E9E9E; margin-top: 3px;">${opt.description}</div>
                      </div>
                    </label>
                  `).join('')}
                </div>

                <!-- Comments -->
                <div style="margin-bottom: 24px;">
                  <label style="font-weight: 600; display: block; margin-bottom: 8px;">Comments / Findings — الملاحظات</label>
                  <textarea id="assessmentComments" rows="4" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; color: white; resize: vertical;" placeholder="Document your findings and observations..."></textarea>
                </div>

                <!-- Checklist -->
                <div style="margin-bottom: 24px; background: rgba(255,255,255,0.03); padding: 15px; border-radius: 8px;">
                  <label style="font-weight: 600; display: block; margin-bottom: 12px;">Confirmation Checklist</label>
                  <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="check1" style="width: 16px; height: 16px;">
                    <span>I have reviewed all customer financial indicators</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; cursor: pointer;">
                    <input type="checkbox" id="check2" style="width: 16px; height: 16px;">
                    <span>I have reviewed AML screening results</span>
                  </label>
                  <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" id="check3" style="width: 16px; height: 16px;">
                    <span>I confirm my assessment is based on available data</span>
                  </label>
                </div>

                <!-- Digital Signature -->
                <div style="background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05)); border: 1px solid rgba(33, 150, 243, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                  <label style="font-weight: 600; display: block; margin-bottom: 8px;">🔐 Digital Confirmation — التأكيد الرقمي</label>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                      <label style="font-size: 12px; color: var(--text-muted);">Employee ID</label>
                      <input type="text" id="employeeId" value="EMP-12345" readonly style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; color: white;">
                    </div>
                    <div>
                      <label style="font-size: 12px; color: var(--text-muted);">4-Digit PIN</label>
                      <input type="password" id="pinInput" maxlength="4" placeholder="••••" style="width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; color: white; text-align: center; font-size: 18px; letter-spacing: 8px;">
                    </div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button onclick="DecisionSupport.submitAssessment('${customerRim}')" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #00D4FF, #0288D1); border: none; border-radius: 10px; color: white; font-weight: 600; font-size: 16px; cursor: pointer;">
                  ✓ Submit Assessment — تقديم التقييم
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', panelHTML);
  },

  closeAnalysisPanel: function() {
    const panel = document.getElementById('analysisPanel');
    if (panel) panel.remove();
  },

  // =====================================================
  // SUBMIT ASSESSMENT
  // =====================================================

  submitAssessment: function(customerRim) {
    // Get selected assessment
    const selectedAssessment = document.querySelector('input[name="assessment"]:checked');
    if (!selectedAssessment) {
      alert('Please select an assessment option\nيرجى اختيار خيار التقييم');
      return;
    }

    // Check checklist
    const check1 = document.getElementById('check1').checked;
    const check2 = document.getElementById('check2').checked;
    const check3 = document.getElementById('check3').checked;
    
    if (!check1 || !check2 || !check3) {
      alert('Please confirm all checklist items\nيرجى تأكيد جميع عناصر القائمة');
      return;
    }

    // Verify PIN
    const pin = document.getElementById('pinInput').value;
    if (pin.length !== 4) {
      alert('Please enter your 4-digit PIN\nيرجى إدخال رمز PIN المكون من 4 أرقام');
      return;
    }

    // Get comments
    const comments = document.getElementById('assessmentComments').value;

    // Find assessment details
    const assessmentOption = this.assessmentOptions.find(a => a.id === selectedAssessment.value);

    // Create assessment record
    const assessment = {
      customerRim: customerRim,
      assessmentType: selectedAssessment.value,
      assessmentLabel: assessmentOption.label,
      comments: comments,
      employeeId: document.getElementById('employeeId').value,
      timestamp: new Date().toISOString(),
      indicatorsCount: this.detectIndicators(customerRim).length
    };

    console.log('Assessment Submitted:', assessment);

    // Show success message
    this.closeAnalysisPanel();
    this.showSuccessMessage(assessment);
  },

  showSuccessMessage: function(assessment) {
    const option = this.assessmentOptions.find(a => a.id === assessment.assessmentType);
    
    const msgHTML = `
      <div id="successModal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 10, 20, 0.9); z-index: 10000; display: flex; align-items: center; justify-content: center;">
        <div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; padding: 40px; text-align: center; max-width: 450px;">
          <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
          <h2 style="margin-bottom: 10px;">Assessment Submitted</h2>
          <p style="color: var(--text-muted); margin-bottom: 20px;">تم تقديم التقييم بنجاح</p>
          
          <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; text-align: left; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: var(--text-muted);">Assessment:</span>
              <span style="color: ${option.color}; font-weight: 600;">${option.icon} ${option.label}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: var(--text-muted);">Employee:</span>
              <span>${assessment.employeeId}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--text-muted);">Timestamp:</span>
              <span>${new Date(assessment.timestamp).toLocaleString()}</span>
            </div>
          </div>
          
          <button onclick="document.getElementById('successModal').remove()" style="padding: 12px 40px; background: linear-gradient(135deg, #00D4FF, #0288D1); border: none; border-radius: 8px; color: white; font-weight: 600; cursor: pointer;">
            OK
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', msgHTML);
  },

  // =====================================================
  // QUICK INDICATOR DISPLAY (For Export/Reports)
  // =====================================================

  getIndicatorSummary: function(customerRim) {
    const indicators = this.detectIndicators(customerRim);
    
    return {
      totalIndicators: indicators.length,
      indicators: indicators.map(ind => ({
        type: ind.type.title,
        observation: ind.observation,
        category: ind.type.category
      })),
      categories: {
        FINANCIAL: indicators.filter(i => i.type.category === 'FINANCIAL').length,
        ACTIVITY: indicators.filter(i => i.type.category === 'ACTIVITY').length,
        SCREENING: indicators.filter(i => i.type.category === 'SCREENING').length,
        GEOGRAPHIC: indicators.filter(i => i.type.category === 'GEOGRAPHIC').length,
        RELATIONSHIP: indicators.filter(i => i.type.category === 'RELATIONSHIP').length,
        PROFILE: indicators.filter(i => i.type.category === 'PROFILE').length
      }
    };
  }
};

// Make globally available
window.DecisionSupport = DecisionSupport;

// Add global function for showing analysis
function showAnalysisPanel() {
  if (typeof currentCustomerRim !== 'undefined' && currentCustomerRim) {
    DecisionSupport.showAnalysisPanel(currentCustomerRim);
  } else {
    alert('Customer data not loaded');
  }
}
