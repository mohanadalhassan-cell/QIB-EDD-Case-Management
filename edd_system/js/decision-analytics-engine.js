/**
 * DECISION ANALYTICS ENGINE
 * ─────────────────────────────────────────────────────────────
 * Analyzes EDD case outcomes, escalation triggers, and rule performance
 * to provide evidence-based recommendations for policy refinement
 * 
 * Purpose: Help management decide if EDD logic is too aggressive
 * and identify which rules should be adjusted
 */

const DecisionAnalyticsEngine = {
  
  // ═══════════════════════════════════════════════════════════════
  // 1. CASE-LEVEL ANALYTICS DATA MODEL
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Case Analytics Record - Captures all decision-relevant data
   * @typedef {Object} CaseAnalytics
   * @property {string} caseId - Unique case identifier
   * @property {Date} createdDate - When case was created
   * @property {string} customerSegment - mass|premium|tamayuz|private
   * @property {string} riskProfile - low|medium|high|critical
   * @property {Array<string>} escalationReasons - Array of rule triggers
   * @property {boolean} escalated - Was case escalated from initial decision
   * @property {string} initialDecision - approve|clarify|reject|escalate
   * @property {string} finalDecision - approve|clarify|reject
   * @property {Array<Object>} triggeredRules - Which rules fired
   * @property {boolean} requiresManualReview - Manual intervention needed
   * @property {string} manualReviewOutcome - approve|approve_with_conditions|reject
   * @property {Array<string>} docsRequested - Additional documents requested
   * @property {Array<string>} docsReceived - Documents actually received
   * @property {boolean} acceptedAfterClarification - Approved after manual review
   * @property {number} daysToResolution - Total days from creation to final decision
   * @property {Object} occupationProfile - Occupation-based triggers
   * @property {Object} pepProfile - PEP-related triggers
   * @property {Object} wealthProfile - Source of wealth triggers
   * @property {Object} transactionProfile - Transaction behavior triggers
   */
  
  caseModel: {
    createRecord: function(caseData) {
      return {
        caseId: caseData.id,
        createdDate: new Date(caseData.createdAt),
        customerSegment: caseData.segment || 'mass',
        riskProfile: caseData.riskLevel || 'medium',
        escalationReasons: caseData.triggers || [],
        escalated: caseData.escalated || false,
        initialDecision: caseData.initialDecision || 'clarify',
        finalDecision: caseData.finalDecision || null,
        triggeredRules: caseData.rulesApplied || [],
        requiresManualReview: caseData.needsReview || false,
        manualReviewOutcome: caseData.reviewResult || null,
        docsRequested: caseData.requestedDocs || [],
        docsReceived: caseData.receivedDocs || [],
        acceptedAfterClarification: caseData.approvedAfterReview || false,
        daysToResolution: this._calculateResolutionDays(caseData),
        occupationProfile: caseData.occupationRisks || {},
        pepProfile: caseData.pepRisks || {},
        wealthProfile: caseData.wealthRisks || {},
        transactionProfile: caseData.transactionRisks || {}
      };
    },
    
    _calculateResolutionDays: function(caseData) {
      const created = new Date(caseData.createdAt);
      const resolved = caseData.resolvedAt ? new Date(caseData.resolvedAt) : new Date();
      return Math.floor((resolved - created) / (1000 * 60 * 60 * 24));
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 2. KPIs AND FORMULAS
  // ═══════════════════════════════════════════════════════════════
  
  kpiEngine: {
    
    /**
     * ESCALATION KPIs
     */
    calculateEscalationRate: function(cases) {
      if (!cases.length) return 0;
      const escalated = cases.filter(c => c.escalated).length;
      return ((escalated / cases.length) * 100).toFixed(2);
    },
    
    calculateEscalationByReason: function(cases) {
      const reasons = {};
      cases.forEach(c => {
        c.escalationReasons.forEach(reason => {
          reasons[reason] = (reasons[reason] || 0) + 1;
        });
      });
      return reasons;
    },
    
    /**
     * REJECTION KPIs
     */
    calculateRejectionRate: function(cases) {
      if (!cases.length) return 0;
      const rejected = cases.filter(c => c.finalDecision === 'reject').length;
      return ((rejected / cases.length) * 100).toFixed(2);
    },
    
    calculateInitialRejectionRate: function(cases) {
      if (!cases.length) return 0;
      const initialRejects = cases.filter(c => c.initialDecision === 'reject').length;
      return ((initialRejects / cases.length) * 100).toFixed(2);
    },
    
    /**
     * CLARIFICATION / MANUAL REVIEW KPIs
     */
    calculateClarificationRate: function(cases) {
      if (!cases.length) return 0;
      const clarify = cases.filter(c => c.initialDecision === 'clarify').length;
      return ((clarify / cases.length) * 100).toFixed(2);
    },
    
    calculateManualReviewRate: function(cases) {
      if (!cases.length) return 0;
      const reviewed = cases.filter(c => c.requiresManualReview).length;
      return ((reviewed / cases.length) * 100).toFixed(2);
    },
    
    /**
     * APPROVAL RATES
     */
    calculateApprovalRate: function(cases) {
      if (!cases.length) return 0;
      const approved = cases.filter(c => c.finalDecision === 'approve').length;
      return ((approved / cases.length) * 100).toFixed(2);
    },
    
    calculateInitialApprovalRate: function(cases) {
      if (!cases.length) return 0;
      const initialApprovals = cases.filter(c => c.initialDecision === 'approve').length;
      return ((initialApprovals / cases.length) * 100).toFixed(2);
    },
    
    /**
     * FALSE POSITIVE METRICS
     */
    calculateFalsePositiveRate: function(cases) {
      // Cases escalated but eventually approved = false positives
      if (!cases.length) return 0;
      const falsePositives = cases.filter(c => 
        c.escalated && c.finalDecision === 'approve'
      ).length;
      return ((falsePositives / cases.length) * 100).toFixed(2);
    },
    
    calculateOverEscalationRate: function(cases) {
      // Cases escalated to manual review but approved without additional docs
      if (!cases.length) return 0;
      const overEscalated = cases.filter(c => 
        c.requiresManualReview && 
        c.manualReviewOutcome === 'approve' &&
        c.docsReceived.length === 0
      ).length;
      return ((overEscalated / cases.length) * 100).toFixed(2);
    },
    
    /**
     * DOCUMENT REQUEST EFFECTIVENESS
     */
    calculateDocRequestCompletionRate: function(cases) {
      const withDocs = cases.filter(c => c.docsRequested.length > 0);
      if (!withDocs.length) return 0;
      const completed = withDocs.filter(c => c.docsReceived.length > 0).length;
      return ((completed / withDocs.length) * 100).toFixed(2);
    },
    
    /**
     * RESOLUTION TIME KPIs
     */
    calculateAverageResolutionDays: function(cases) {
      if (!cases.length) return 0;
      const total = cases.reduce((sum, c) => sum + c.daysToResolution, 0);
      return (total / cases.length).toFixed(1);
    },
    
    calculateMedianResolutionDays: function(cases) {
      if (!cases.length) return 0;
      const sorted = cases.map(c => c.daysToResolution).sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    },
    
    /**
     * SEGMENT-SPECIFIC KPIs
     */
    calculateKpisBySegment: function(cases) {
      const segments = {};
      
      cases.forEach(c => {
        if (!segments[c.customerSegment]) {
          segments[c.customerSegment] = [];
        }
        segments[c.customerSegment].push(c);
      });
      
      const results = {};
      Object.keys(segments).forEach(segment => {
        const segmentCases = segments[segment];
        results[segment] = {
          count: segmentCases.length,
          escalationRate: this.calculateEscalationRate(segmentCases),
          rejectionRate: this.calculateRejectionRate(segmentCases),
          approvalRate: this.calculateApprovalRate(segmentCases),
          clarificationRate: this.calculateClarificationRate(segmentCases),
          falsePositiveRate: this.calculateFalsePositiveRate(segmentCases),
          avgResolutionDays: this.calculateAverageResolutionDays(segmentCases)
        };
      });
      
      return results;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 3. FALSE POSITIVE IDENTIFICATION
  // ═══════════════════════════════════════════════════════════════
  
  falsePositiveDetector: {
    
    /**
     * Identify cases that were over-escalated
     */
    identifyFalsePositives: function(cases) {
      return cases.filter(c => {
        // Case was escalated but eventually approved
        return c.escalated && c.finalDecision === 'approve';
      }).map(c => ({
        caseId: c.caseId,
        falsePositiveType: 'over-escalation',
        escalatedBecause: c.escalationReasons,
        finalDecision: c.finalDecision,
        manualReviewResult: c.manualReviewOutcome,
        docsRequested: c.docsRequested,
        docsReceived: c.docsReceived
      }));
    },
    
    /**
     * Identify cases that needed only document request, not escalation
     */
    identifyDocumentReachedCases: function(cases) {
      return cases.filter(c => {
        return c.requiresManualReview &&
               c.docsReceived.length > 0 &&
               c.manualReviewOutcome === 'approve';
      }).map(c => ({
        caseId: c.caseId,
        falsePositiveType: 'could-be-auto-request',
        escalationReasons: c.escalationReasons,
        docsRequested: c.docsRequested,
        docsReceived: c.docsReceived,
        timeTaken: c.daysToResolution
      }));
    },
    
    /**
     * Identify cases rejected initially but might have been approved with docs
     */
    identifyPrematurRejects: function(cases) {
      return cases.filter(c => {
        return c.initialDecision === 'reject' &&
               (c.docsRequested.length > 0 || c.manualReviewOutcome);
      });
    },
    
    /**
     * Score case for false positive likelihood (0-100)
     */
    scoreFalsePositiveLikelihood: function(caseRecord) {
      let score = 0;
      
      // Escalated = base score
      if (caseRecord.escalated) score += 40;
      
      // No additional docs needed
      if (caseRecord.docsRequested.length === 0) score += 20;
      
      // Eventually approved
      if (caseRecord.finalDecision === 'approve') score += 30;
      
      // Occupation-based trigger (often aggressive)
      if (caseRecord.occupationProfile.triggered) score += 10;
      
      // Low risk profile but high escalation
      if (caseRecord.riskProfile === 'low' && caseRecord.escalationReasons.length > 2) score += 10;
      
      // Non-premium segment
      if (caseRecord.customerSegment === 'mass') score += 5;
      
      return Math.min(score, 100);
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 4. RULE PERFORMANCE ANALYTICS
  // ═══════════════════════════════════════════════════════════════
  
  rulePerformanceAnalyzer: {
    
    /**
     * Analyze performance of each rule
     */
    analyzeRulePerformance: function(cases) {
      const ruleStats = {};
      
      cases.forEach(c => {
        c.triggeredRules.forEach(rule => {
          if (!ruleStats[rule.name]) {
            ruleStats[rule.name] = {
              name: rule.name,
              category: rule.category,
              timesTriggered: 0,
              casesEscalated: 0,
              casesApproved: 0,
              casesRejected: 0,
              casesReviewedManually: 0,
              falsePositiveCount: 0,
              avgConfidence: 0,
              confidenceSum: 0
            };
          }
          
          ruleStats[rule.name].timesTriggered++;
          ruleStats[rule.name].confidenceSum += (rule.confidence || 0.5);
          
          if (c.escalated) ruleStats[rule.name].casesEscalated++;
          if (c.finalDecision === 'approve') ruleStats[rule.name].casesApproved++;
          if (c.finalDecision === 'reject') ruleStats[rule.name].casesRejected++;
          if (c.requiresManualReview) ruleStats[rule.name].casesReviewedManually++;
          if (c.escalated && c.finalDecision === 'approve') ruleStats[rule.name].falsePositiveCount++;
        });
      });
      
      // Calculate metrics
      Object.keys(ruleStats).forEach(ruleName => {
        const stats = ruleStats[ruleName];
        stats.avgConfidence = (stats.confidenceSum / stats.timesTriggered).toFixed(2);
        stats.escalationRate = ((stats.casesEscalated / stats.timesTriggered) * 100).toFixed(1);
        stats.rejectionRate = ((stats.casesRejected / stats.timesTriggered) * 100).toFixed(1);
        stats.approvalRate = ((stats.casesApproved / stats.timesTriggered) * 100).toFixed(1);
        stats.falsePositiveRate = ((stats.falsePositiveCount / stats.timesTriggered) * 100).toFixed(1);
        stats.precision = this._calculateRulePrecision(stats);
      });
      
      return ruleStats;
    },
    
    _calculateRulePrecision: function(stats) {
      // Precision = cases correctly rejected / total escalated
      if (stats.casesEscalated === 0) return 0;
      const correct = stats.casesRejected;
      return ((correct / stats.casesEscalated) * 100).toFixed(1);
    },
    
    /**
     * Identify aggressive rules (high escalation, low precision)
     */
    identifyAggressiveRules: function(ruleStats) {
      return Object.values(ruleStats)
        .filter(rule => {
          return rule.escalationRate > 50 && // Escalates >50% of triggered cases
                 rule.precision < 60;        // But only 60% of escalations are justified
        })
        .sort((a, b) => parseFloat(b.escalationRate) - parseFloat(a.escalationRate));
    },
    
    /**
     * Identify rules that rarely escalate but are high-value
     */
    identifyHighPrecisionRules: function(ruleStats) {
      return Object.values(ruleStats)
        .filter(rule => {
          return rule.precision > 80 && // >80% of escalations justified
                 rule.escalationRate > 0;
        })
        .sort((a, b) => parseFloat(b.precision) - parseFloat(a.precision));
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 5. OCCUPATION & PROFILE-BASED ESCALATION ANALYTICS
  // ═══════════════════════════════════════════════════════════════
  
  profileAnalyzer: {
    
    /**
     * Analyze escalations by occupation
     */
    analyzeOccupationEscalations: function(cases) {
      const occupations = {};
      
      cases.forEach(c => {
        const occ = c.occupationProfile.occupationCode || 'unknown';
        if (!occupations[occ]) {
          occupations[occ] = {
            occupationCode: occ,
            occupationName: c.occupationProfile.occupationName || 'Unknown',
            count: 0,
            escalatedCount: 0,
            approvedCount: 0,
            rejectedCount: 0,
            falsePositiveCount: 0
          };
        }
        
        occupations[occ].count++;
        if (c.escalated) occupations[occ].escalatedCount++;
        if (c.finalDecision === 'approve') occupations[occ].approvedCount++;
        if (c.finalDecision === 'reject') occupations[occ].rejectedCount++;
        if (c.escalated && c.finalDecision === 'approve') occupations[occ].falsePositiveCount++;
      });
      
      // Calculate rates
      Object.keys(occupations).forEach(occ => {
        const data = occupations[occ];
        data.escalationRate = ((data.escalatedCount / data.count) * 100).toFixed(1);
        data.approvalRate = ((data.approvedCount / data.count) * 100).toFixed(1);
        data.rejectionRate = ((data.rejectedCount / data.count) * 100).toFixed(1);
        data.falsePositiveRate = ((data.falsePositiveCount / data.count) * 100).toFixed(1);
      });
      
      return occupations;
    },
    
    /**
     * Analyze escalations by PEP profile
     */
    analyzePepEscalations: function(cases) {
      const pepTriggers = {};
      
      cases.forEach(c => {
        if (c.pepProfile.matched) {
          const trigger = c.pepProfile.triggerType || 'other';
          if (!pepTriggers[trigger]) {
            pepTriggers[trigger] = {
              trigger: trigger,
              count: 0,
              escalatedCount: 0,
              falsePositiveCount: 0
            };
          }
          
          pepTriggers[trigger].count++;
          if (c.escalated) pepTriggers[trigger].escalatedCount++;
          if (c.escalated && c.finalDecision === 'approve') {
            pepTriggers[trigger].falsePositiveCount++;
          }
        }
      });
      
      Object.keys(pepTriggers).forEach(trigger => {
        const data = pepTriggers[trigger];
        data.escalationRate = ((data.escalatedCount / data.count) * 100).toFixed(1);
        data.falsePositiveRate = ((data.falsePositiveCount / data.count) * 100).toFixed(1);
      });
      
      return pepTriggers;
    },
    
    /**
     * Identify over-escalated occupation categories
     */
    identifyAggressiveOccupations: function(occupations) {
      return Object.values(occupations)
        .filter(occ => {
          return occ.count >= 5 &&  // At least 5 cases
                 occ.escalationRate > 70 && // >70% escalation
                 occ.falsePositiveRate > 20; // >20% false positives
        })
        .sort((a, b) => parseFloat(b.escalationRate) - parseFloat(a.escalationRate));
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 6. DECISION RECOMMENDATION FRAMEWORK
  // ═══════════════════════════════════════════════════════════════
  
  recommendationEngine: {
    
    /**
     * Generate recommendations for each rule
     */
    generateRuleRecommendations: function(ruleStats, cases) {
      const recommendations = [];
      
      Object.values(ruleStats).forEach(rule => {
        const rec = {
          ruleName: rule.name,
          ruleCategory: rule.category,
          currentMetrics: {
            timesTriggered: rule.timesTriggered,
            escalationRate: rule.escalationRate,
            falsePositiveRate: rule.falsePositiveRate,
            precision: rule.precision
          },
          recommendation: 'keep',
          rationale: '',
          impact: 'low'
        };
        
        // KEEP: High precision, justified escalations
        if (rule.precision > 80 && rule.escalationRate > 10) {
          rec.recommendation = 'keep';
          rec.rationale = `Rule shows high precision (${rule.precision}% accurate). Keep current settings.`;
          rec.impact = 'none';
        }
        
        // REDUCE WEIGHT: High escalation rate but many false positives
        else if (rule.escalationRate > 60 && rule.falsePositiveRate > 25) {
          rec.recommendation = 'reduce-weight';
          rec.rationale = `Rule escalates ${rule.escalationRate}% of cases but has ${rule.falsePositiveRate}% false positive rate. Consider reducing sensitivity or weight.`;
          rec.impact = 'medium';
          rec.suggestedAction = 'Lower rule weight from current to 0.7-0.8x';
        }
        
        // MOVE TO MANUAL: Still valuable but shouldn't auto-escalate
        else if (rule.precision > 70 && rule.escalationRate > 40) {
          rec.recommendation = 'move-to-manual';
          rec.rationale = `Rule is accurate (${rule.precision}%) but triggers auto-escalation in ${rule.escalationRate}% of cases. Move to manual review trigger instead.`;
          rec.impact = 'medium';
        }
        
        // REPLACE WITH DOC REQUEST: False positives often resolved with docs
        else if (rule.falsePositiveRate > 30) {
          rec.recommendation = 'replace-with-doc-request';
          rec.rationale = `Many escalations (${rule.falsePositiveRate}% false positives) could be resolved with additional documents instead of escalation.`;
          rec.impact = 'medium';
          rec.suggestedDocuments = ['employment-verification', 'source-of-funds'];
        }
        
        // MONITOR: Low frequency but something to watch
        else if (rule.timesTriggered < 10) {
          rec.recommendation = 'monitor';
          rec.rationale = `Rule triggered only ${rule.timesTriggered} times. Not enough data yet. Continue monitoring.`;
          rec.impact = 'low';
        }
        
        // SPLIT CATEGORIES: If occupation rule too broad
        else if (rule.name.includes('occupation') && rule.escalationRate > 50) {
          rec.recommendation = 'split-categories';
          rec.rationale = `Occupation rule is too broad. Escalates ${rule.escalationRate}% of cases. Consider splitting into specific occupation subcategories.`;
          rec.impact = 'high';
        }
        
        recommendations.push(rec);
      });
      
      return recommendations.sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      });
    },
    
    /**
     * Generate occupation-level recommendations
     */
    generateOccupationRecommendations: function(occupations) {
      const recommendations = [];
      
      Object.values(occupations)
        .filter(occ => occ.count >= 5) // Only with meaningful data
        .forEach(occ => {
          const rec = {
            occupationCode: occ.occupationCode,
            occupationName: occ.occupationName,
            caseCount: occ.count,
            currentEscalationRate: occ.escalationRate,
            falsePositiveRate: occ.falsePositiveRate,
            recommendation: 'monitor'
          };
          
          if (occ.escalationRate > 70 && occ.falsePositiveRate > 25) {
            rec.recommendation = 'lower-risk-threshold';
            rec.rationale = `${occ.escalationRate}% escalation rate with ${occ.falsePositiveRate}% false positives. Consider lowering occupation risk category or requiring docs instead of auto-escalation.`;
          } else if (occ.escalationRate > 90) {
            rec.recommendation = 'review-policy';
            rec.rationale = `${occ.escalationRate}% escalation rate is very high. Policy may be over-aggressive for this occupation.`;
          } else if (occ.rejectionRate > 40) {
            rec.recommendation = 'add-doc-requirements';
            rec.rationale = `High rejection rate (${occ.rejectionRate}%). Consider requiring specific documents early instead of automatic rejection.`;
          }
          
          recommendations.push(rec);
        });
      
      return recommendations;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 7. MANAGEMENT DASHBOARD STRUCTURE
  // ═══════════════════════════════════════════════════════════════
  
  dashboardStructure: {
    
    /**
     * Generate comprehensive dashboard data
     */
    generateDashboardData: function(cases) {
      const dashboard = {
        summary: {
          totalCases: cases.length,
          dateRange: {
            start: new Date(Math.min(...cases.map(c => c.createdDate))).toISOString(),
            end: new Date(Math.max(...cases.map(c => c.createdDate))).toISOString()
          }
        },
        
        // KEY METRICS SECTION
        keyMetrics: {
          approvalRate: DecisionAnalyticsEngine.kpiEngine.calculateApprovalRate(cases),
          escalationRate: DecisionAnalyticsEngine.kpiEngine.calculateEscalationRate(cases),
          rejectionRate: DecisionAnalyticsEngine.kpiEngine.calculateRejectionRate(cases),
          falsePositiveRate: DecisionAnalyticsEngine.kpiEngine.calculateFalsePositiveRate(cases),
          manualReviewRate: DecisionAnalyticsEngine.kpiEngine.calculateManualReviewRate(cases),
          clarificationRate: DecisionAnalyticsEngine.kpiEngine.calculateClarificationRate(cases),
          avgResolutionDays: DecisionAnalyticsEngine.kpiEngine.calculateAverageResolutionDays(cases)
        },
        
        // SEGMENT BREAKDOWN
        bySegment: DecisionAnalyticsEngine.kpiEngine.calculateKpisBySegment(cases),
        
        // ESCALATION REASONS
        escalationBreakdown: DecisionAnalyticsEngine.kpiEngine.calculateEscalationByReason(cases),
        
        // RULE PERFORMANCE
        rulePerformance: DecisionAnalyticsEngine.rulePerformanceAnalyzer.analyzeRulePerformance(cases),
        
        // PROFILE-BASED ANALYSIS
        occupationAnalysis: DecisionAnalyticsEngine.profileAnalyzer.analyzeOccupationEscalations(cases),
        pepAnalysis: DecisionAnalyticsEngine.profileAnalyzer.analyzePepEscalations(cases),
        
        // FALSE POSITIVES
        falsePositives: DecisionAnalyticsEngine.falsePositiveDetector.identifyFalsePositives(cases),
        
        // RECOMMENDATIONS
        ruleRecommendations: DecisionAnalyticsEngine.recommendationEngine.generateRuleRecommendations(
          DecisionAnalyticsEngine.rulePerformanceAnalyzer.analyzeRulePerformance(cases), 
          cases
        ),
        occupationRecommendations: DecisionAnalyticsEngine.recommendationEngine.generateOccupationRecommendations(
          DecisionAnalyticsEngine.profileAnalyzer.analyzeOccupationEscalations(cases)
        ),
        
        // ALERTS FOR MANAGEMENT
        alerts: DecisionAnalyticsEngine._generateAlerts(cases)
      };
      
      return dashboard;
    },
    
    _generateAlerts: function(cases) {
      const alerts = [];
      const fps = DecisionAnalyticsEngine.kpiEngine.calculateFalsePositiveRate(cases);
      const escRate = DecisionAnalyticsEngine.kpiEngine.calculateEscalationRate(cases);
      
      if (parseFloat(fps) > 20) {
        alerts.push({
          severity: 'high',
          title: 'High False Positive Rate',
          message: `${fps}% of cases escalated are eventually approved. Review escalation rules.`
        });
      }
      
      if (parseFloat(escRate) > 70) {
        alerts.push({
          severity: 'medium',
          title: 'High Escalation Rate',
          message: `${escRate}% of cases escalated. Consider review policy automation balance.`
        });
      }
      
      const aggressiveRules = DecisionAnalyticsEngine.rulePerformanceAnalyzer.identifyAggressiveRules(
        DecisionAnalyticsEngine.rulePerformanceAnalyzer.analyzeRulePerformance(cases)
      );
      
      if (aggressiveRules.length > 0) {
        alerts.push({
          severity: 'medium',
          title: 'Aggressive Rules Detected',
          message: `${aggressiveRules.length} rules show high escalation with low precision. Review recommended.`
        });
      }
      
      return alerts;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════
  // 8. DRILL-DOWN & CASE RETRIEVAL
  // ═══════════════════════════════════════════════════════════════
  
  drillDown: {
    
    /**
     * Get cases for a specific metric
     */
    getCasesForMetric: function(cases, metric, value) {
      switch(metric) {
        case 'escalated':
          return cases.filter(c => c.escalated);
        case 'false-positive':
          return cases.filter(c => c.escalated && c.finalDecision === 'approve');
        case 'rejected':
          return cases.filter(c => c.finalDecision === 'reject');
        case 'approved':
          return cases.filter(c => c.finalDecision === 'approve');
        case 'manual-review':
          return cases.filter(c => c.requiresManualReview);
        case 'occupation':
          return cases.filter(c => c.occupationProfile.occupationCode === value);
        case 'segment':
          return cases.filter(c => c.customerSegment === value);
        case 'escalation-reason':
          return cases.filter(c => c.escalationReasons.includes(value));
        default:
          return [];
      }
    },
    
    /**
     * Get case evidence for review
     */
    getCaseEvidence: function(caseRecord) {
      return {
        caseId: caseRecord.caseId,
        segment: caseRecord.customerSegment,
        profile: {
          occupation: caseRecord.occupationProfile,
          pep: caseRecord.pepProfile,
          wealth: caseRecord.wealthProfile
        },
        triggers: caseRecord.escalationReasons,
        decision: {
          initial: caseRecord.initialDecision,
          final: caseRecord.finalDecision,
          manualReview: caseRecord.manualReviewOutcome
        },
        documents: {
          requested: caseRecord.docsRequested,
          received: caseRecord.docsReceived
        },
        timeline: {
          created: caseRecord.createdDate,
          daysToResolution: caseRecord.daysToResolution
        }
      };
    }
  },
  
  /**
   * MAIN ANALYSIS INTERFACE
   */
  analyze: function(cases) {
    return this.dashboardStructure.generateDashboardData(cases);
  }
};

// Export for use in Node/browsers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DecisionAnalyticsEngine;
}
