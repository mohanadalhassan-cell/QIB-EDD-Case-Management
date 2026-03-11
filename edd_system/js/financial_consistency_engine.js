/**
 * ═══════════════════════════════════════════════════════════════════════
 * FINANCIAL CONSISTENCY ENGINE v1.0
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Purpose: Detect behavioral anomalies by comparing declared income vs
 *          actual transaction activity patterns
 * 
 * Core Logic:
 *   1. Extract declared monthly income from customer profile
 *   2. Calculate expected activity range (multiplier-based)
 *   3. Analyze actual transactions to determine real activity level
 *   4. Calculate variance from expected range
 *   5. Generate risk assessment and recommendations
 *
 * Integration: Works with HighRiskImpactSystem for case analysis
 * ═══════════════════════════════════════════════════════════════════════
 */

class FinancialConsistencyEngine {
  constructor() {
    this.name = 'Financial Consistency Analysis Engine';
    this.version = '1.0.0';
    this.lastComputedAt = null;
  }

  /**
   * Main analysis function: Compares declared income against actual activity
   * @param {Object} customerData - Customer profile with income declaration
   * @param {Array} transactionHistory - Array of transaction objects
   * @returns {Object} Comprehensive financial consistency analysis
   */
  analyzeFinancialBehavior(customerData, transactionHistory) {
    const analysis = {
      timestamp: new Date().toISOString(),
      customerCode: customerData?.customerCode || 'UNKNOWN',
      
      // Income Declaration metrics
      declaredIncome: {
        monthly: this._extractMonthlyIncome(customerData),
        annual: this._extractMonthlyIncome(customerData) * 12,
        source: customerData?.incomeSource || 'Not Specified',
        lastUpdated: customerData?.incomeVerificationDate || 'Unknown'
      },

      // Expected activity calculation
      expectedActivity: this._calculateExpectedActivityRange(
        this._extractMonthlyIncome(customerData)
      ),

      // Actual transaction analysis
      actualActivity: this._analyzeTransactionActivity(transactionHistory),

      // Variance and anomaly detection
      consistencyMetrics: this._calculateConsistencyMetrics(
        this._extractMonthlyIncome(customerData),
        transactionHistory
      ),

      // Risk assessment
      riskAssessment: this._generateRiskAssessment(
        this._extractMonthlyIncome(customerData),
        transactionHistory
      ),

      // Recommendations
      recommendations: this._generateRecommendations(
        this._extractMonthlyIncome(customerData),
        transactionHistory
      )
    };

    this.lastComputedAt = new Date();
    return analysis;
  }

  /**
   * Extract monthly income from customer data
   * @private
   */
  _extractMonthlyIncome(customerData) {
    const income = customerData?.monthlyIncome || 
                   (customerData?.annualIncome ? customerData.annualIncome / 12 : 0) ||
                   25000; // Default for demo
    return Math.max(income, 0);
  }

  /**
   * Calculate expected activity range based on income
   * Multiplier model: normal business activity 2x to 6x monthly income
   * @private
   */
  _calculateExpectedActivityRange(monthlyIncome) {
    const lowerBound = monthlyIncome * 2;   // Conservative: 2x
    const upperBound = monthlyIncome * 6;   // Generous: 6x
    
    return {
      lowerBound: this._formatCurrency(lowerBound),
      lowerBoundValue: lowerBound,
      upperBound: this._formatCurrency(upperBound),
      upperBoundValue: upperBound,
      midpoint: this._formatCurrency((lowerBound + upperBound) / 2),
      midpointValue: (lowerBound + upperBound) / 2,
      methodology: 'Income Multiplier Model (2x-6x monthly declared income)'
    };
  }

  /**
   * Analyze transaction history to determine actual activity level
   * @private
   */
  _analyzeTransactionActivity(transactions) {
    if (!transactions || transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalOutflows: 0,
        totalInflows: 0,
        netFlow: 0,
        averageTransactionSize: 0,
        largestTransaction: 0,
        highValueTransactionCount: 0,
        analysis: 'Insufficient transaction data'
      };
    }

    let outflows = 0, inflows = 0;
    let largestTransaction = 0;
    let highValueCount = 0;

    transactions.forEach(tx => {
      const amount = Math.abs(tx.amount || 0);
      if (tx.type === 'outflow' || tx.amount < 0) {
        outflows += amount;
      } else {
        inflows += amount;
      }
      if (amount > largestTransaction) largestTransaction = amount;
      if (amount > 50000) highValueCount++;
    });

    const netFlow = inflows - outflows;
    const grossActivity = inflows + outflows;

    return {
      totalTransactions: transactions.length,
      totalOutflows: this._formatCurrency(outflows),
      totalOutflowsValue: outflows,
      totalInflows: this._formatCurrency(inflows),
      totalInflowsValue: inflows,
      grossActivity: this._formatCurrency(grossActivity),
      grossActivityValue: grossActivity,
      netFlow: this._formatCurrency(netFlow),
      netFlowValue: netFlow,
      averageTransactionSize: this._formatCurrency(grossActivity / transactions.length),
      averageTransactionSizeValue: grossActivity / transactions.length,
      largestTransaction: this._formatCurrency(largestTransaction),
      largestTransactionValue: largestTransaction,
      highValueTransactionCount: highValueCount,
      analysisSource: `${transactions.length} transactions analyzed`
    };
  }

  /**
   * Calculate consistency metrics (variance, anomaly flags)
   * @private
   */
  _calculateConsistencyMetrics(monthlyIncome, transactions) {
    const expected = this._calculateExpectedActivityRange(monthlyIncome);
    const actual = this._analyzeTransactionActivity(transactions);

    const expectedMidpoint = expected.midpointValue;
    const actualGross = actual.grossActivityValue;

    const varianceAmount = actualGross - expectedMidpoint;
    const variancePercent = expectedMidpoint > 0 
      ? ((actualGross - expectedMidpoint) / expectedMidpoint) * 100 
      : 0;

    const withinBounds = actualGross >= expected.lowerBoundValue && 
                        actualGross <= expected.upperBoundValue;

    return {
      declaredIncome: this._formatCurrency(monthlyIncome),
      expectedMidpoint: expected.midpoint,
      actualActivity: actual.grossActivity,
      varianceAmount: this._formatCurrency(Math.abs(varianceAmount)),
      varianceAmountValue: Math.abs(varianceAmount),
      variancePercent: Math.round(variancePercent * 100) / 100,
      withinExpectedBounds: withinBounds,
      consistencyStatus: withinBounds ? 'NORMAL' : 'ANOMALY DETECTED',
      anomalySeverity: this._evaluateAnomalyIntensity(variancePercent),
      confidenceScore: this._calculateConfidenceScore(transactions.length)
    };
  }

  /**
   * Generate risk assessment based on financial consistency analysis
   * @private
   */
  _generateRiskAssessment(monthlyIncome, transactions) {
    const metrics = this._calculateConsistencyMetrics(monthlyIncome, transactions);
    const actual = this._analyzeTransactionActivity(transactions);

    let riskLevel = 'LOW';
    let riskScore = 20;
    const riskFactors = [];

    // Evaluate variance
    if (Math.abs(metrics.variancePercent) > 200) {
      riskLevel = 'CRITICAL';
      riskScore = 95;
      riskFactors.push('Extreme variance from expected activity (>200%)');
    } else if (Math.abs(metrics.variancePercent) > 150) {
      riskLevel = 'HIGH';
      riskScore = 80;
      riskFactors.push('Significant variance from expected activity (>150%)');
    } else if (Math.abs(metrics.variancePercent) > 75) {
      riskLevel = 'MEDIUM';
      riskScore = 55;
      riskFactors.push('Moderate variance from expected activity (>75%)');
    }

    // Evaluate high-value transaction frequency
    if (actual.highValueTransactionCount > 5) {
      riskScore += 15;
      riskFactors.push('Frequent high-value transactions (>50K)');
    }

    // Evaluate transaction velocity
    if (transactions && transactions.length > 100) {
      riskScore += 10;
      riskFactors.push('High transaction velocity (>100 transactions/period)');
    }

    // Evaluate net flow (large net outflows suspicious)
    if (actual.netFlowValue < 0 && Math.abs(actual.netFlowValue) > monthlyIncome * 3) {
      riskScore += 20;
      riskFactors.push('Significant net outflow (cash leakage pattern detected)');
    }

    // Cap score at 100
    riskScore = Math.min(riskScore, 100);

    if (riskScore < 40) riskLevel = 'LOW';
    else if (riskScore < 60) riskLevel = 'MEDIUM';
    else if (riskScore < 85) riskLevel = 'HIGH';

    return {
      riskLevel: riskLevel,
      riskScore: riskScore,
      riskFactors: riskFactors,
      summary: this._generateRiskSummary(riskLevel, metrics.variancePercent)
    };
  }

  /**
   * Generate actionable recommendations
   * @private
   */
  _generateRecommendations(monthlyIncome, transactions) {
    const metrics = this._calculateConsistencyMetrics(monthlyIncome, transactions);
    const actual = this._analyzeTransactionActivity(transactions);
    const recommendations = [];

    if (!metrics.withinExpectedBounds) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Income Documentation Verification',
        reason: `Actual activity (${actual.grossActivity}) significantly differs from expected range`,
        timeline: '5-7 business days',
        requiredDocs: ['Tax returns (2 years)', 'Bank statements', 'Business license/registration']
      });
    }

    if (actual.highValueTransactionCount > 3) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'High-Value Transaction Investigation',
        reason: `${actual.highValueTransactionCount} transactions exceed 50K threshold`,
        timeline: '7-10 business days',
        requiredDocs: ['Transaction supporting documentation', 'Purpose of payment', 'Beneficiary verification']
      });
    }

    if (metrics.variancePercent > 150) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Source of Funds Verification',
        reason: 'Activity level suggests potential undisclosed income sources',
        timeline: '10-14 business days',
        requiredDocs: ['Written explanation', 'Supporting business documents', 'Third-party verification']
      });
    }

    if (metrics.confidenceScore < 0.6) {
      recommendations.push({
        priority: 'LOW',
        action: 'Data Quality Enhancement',
        reason: 'Insufficient transaction history for conclusive analysis',
        timeline: '30 days',
        requiredDocs: ['Full 90-day transaction history', 'Complete account statement']
      });
    }

    recommendations.push({
      priority: 'ROUTINE',
      action: 'Compliance Scorecard Update',
      reason: 'Document analysis results in customer risk profile',
      timeline: 'Immediate',
      requiredDocs: ['This financial consistency analysis report']
    });

    return recommendations;
  }

  /**
   * Evaluate anomaly intensity based on variance percentage
   * @private
   */
  _evaluateAnomalyIntensity(variancePercent) {
    const absVariance = Math.abs(variancePercent);
    
    if (absVariance < 25) return 'NONE - Within normal range';
    if (absVariance < 75) return 'MILD - Acceptable variance';
    if (absVariance < 150) return 'MODERATE - Investigation recommended';
    if (absVariance < 250) return 'SIGNIFICANT - Escalation likely';
    return 'CRITICAL - Immediate escalation required';
  }

  /**
   * Calculate confidence score based on data sufficiency
   * @private
   */
  _calculateConfidenceScore(transactionCount) {
    // Confidence increases with more transactions
    // Base: 30 transactions = 50% confidence, 90 transactions = 90% confidence
    if (transactionCount < 10) return 0.3;
    if (transactionCount < 30) return 0.5;
    if (transactionCount < 60) return 0.7;
    if (transactionCount < 90) return 0.85;
    return 0.95;
  }

  /**
   * Generate human-readable risk summary
   * @private
   */
  _generateRiskSummary(riskLevel, variancePercent) {
    const absVariance = Math.abs(variancePercent);
    
    switch(riskLevel) {
      case 'CRITICAL':
        return `Critical financial consistency anomaly detected (${absVariance.toFixed(0)}% variance). Immediate investigation and documentation verification required.`;
      case 'HIGH':
        return `High-risk financial consistency anomaly (${absVariance.toFixed(0)}% variance). Recommend source-of-funds verification and enhanced due diligence.`;
      case 'MEDIUM':
        return `Moderate financial variance detected (${absVariance.toFixed(0)}% variance). Recommend income documentation review and transaction pattern analysis.`;
      case 'LOW':
        return `Financial activity is within expected parameters. Routine compliance monitoring continues.`;
      default:
        return 'Financial consistency analysis complete. See detailed metrics for assessment.';
    }
  }

  /**
   * Format currency values for display
   * @private
   */
  _formatCurrency(amount, currency = 'QAR') {
    return new Intl.NumberFormat('en-QA', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Generate HTML display card for Financial Consistency Analysis
   * @param {Object} analysis - Analysis result from analyzeFinancialBehavior()
   * @returns {string} HTML for dashboard integration
   */
  generateAnalysisCard(analysis) {
    const metrics = analysis.consistencyMetrics;
    const risk = analysis.riskAssessment;
    const actual = analysis.actualActivity;

    const cardHTML = `
      <div class="high-risk-impact-card financial-consistency-card">
        <div class="impact-card-header">
          <div class="impact-header-left">
            <h3 class="impact-title">Financial Consistency Analysis</h3>
            <p class="impact-subtitle">Declared Income vs. Actual Activity Comparison</p>
          </div>
          <div class="impact-header-right">
            <div class="risk-badge risk-badge-${risk.riskLevel.toLowerCase()}">
              ${risk.riskLevel}
            </div>
            <div class="risk-score-circle">
              <div class="risk-score-value">${risk.riskScore}</div>
              <div class="risk-score-label">Score</div>
            </div>
          </div>
        </div>

        <div class="impact-content">
          <!-- Income vs. Activity Comparison -->
          <div class="analysis-section">
            <h4 class="section-title">Income vs. Activity Comparison</h4>
            <div class="comparison-grid">
              <div class="metric-item">
                <div class="metric-label">Declared Monthly Income</div>
                <div class="metric-value">${analysis.declaredIncome.monthly}</div>
                <div class="metric-source">Source: ${analysis.declaredIncome.source}</div>
              </div>
              
              <div class="metric-item">
                <div class="metric-label">Expected Activity Range</div>
                <div class="metric-value">${analysis.expectedActivity.lowerBound} → ${analysis.expectedActivity.upperBound}</div>
                <div class="metric-source">${analysis.expectedActivity.methodology}</div>
              </div>

              <div class="metric-item">
                <div class="metric-label">Actual Gross Activity</div>
                <div class="metric-value">${actual.grossActivity}</div>
                <div class="metric-source">${actual.analysisSource}</div>
              </div>

              <div class="metric-item">
                <div class="metric-label">Variance from Expected</div>
                <div class="metric-value ${metrics.variancePercent > 50 ? 'variance-high' : ''}">
                  ${metrics.variancePercent > 0 ? '+' : ''}${metrics.variancePercent.toFixed(1)}%
                </div>
                <div class="metric-source">${metrics.anomalySeverity}</div>
              </div>
            </div>
          </div>

          <!-- Transaction Activity Breakdown -->
          <div class="analysis-section">
            <h4 class="section-title">Transaction Activity Profile</h4>
            <div class="activity-grid">
              <div class="activity-stat">
                <span class="stat-label">Total Transactions:</span>
                <span class="stat-value">${actual.totalTransactions}</span>
              </div>
              <div class="activity-stat">
                <span class="stat-label">Total Inflows:</span>
                <span class="stat-value">${actual.totalInflows}</span>
              </div>
              <div class="activity-stat">
                <span class="stat-label">Total Outflows:</span>
                <span class="stat-value">${actual.totalOutflows}</span>
              </div>
              <div class="activity-stat">
                <span class="stat-label">Net Flow:</span>
                <span class="stat-value ${actual.netFlowValue < 0 ? 'neg' : ''}">${actual.netFlow}</span>
              </div>
              <div class="activity-stat">
                <span class="stat-label">Largest Transaction:</span>
                <span class="stat-value">${actual.largestTransaction}</span>
              </div>
              <div class="activity-stat">
                <span class="stat-label">High-Value Transactions (>50K):</span>
                <span class="stat-value">${actual.highValueTransactionCount}</span>
              </div>
            </div>
          </div>

          <!-- Risk Assessment -->
          <div class="analysis-section">
            <h4 class="section-title">Risk Assessment</h4>
            <div class="risk-summary">${risk.summary}</div>
            ${risk.riskFactors.length > 0 ? `
              <div class="risk-factors">
                <strong>Contributing Factors:</strong>
                <ul>
                  ${risk.riskFactors.map(factor => `<li>${factor}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>

          <!-- Recommendations -->
          <div class="analysis-section recommendations-section">
            <h4 class="section-title">Recommended Actions</h4>
            ${analysis.recommendations.map((rec, idx) => `
              <div class="recommendation-item rec-priority-${rec.priority.toLowerCase()}">
                <div class="rec-header">
                  <span class="rec-priority">${rec.priority}</span>
                  <span class="rec-action">${rec.action}</span>
                </div>
                <p class="rec-reason">${rec.reason}</p>
                <div class="rec-details">
                  <span class="rec-timeline">⏱ ${rec.timeline}</span>
                  ${rec.requiredDocs ? `<span class="rec-docs">📄 ${rec.requiredDocs.length} documents</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Confidence Indicator -->
          <div class="analysis-footer">
            <div class="confidence-bar">
              <div class="confidence-label">Analysis Confidence: <strong>${Math.round(metrics.confidenceScore * 100)}%</strong></div>
              <div class="confidence-meter">
                <div class="confidence-fill" style="width: ${metrics.confidenceScore * 100}%"></div>
              </div>
            </div>
            <div class="timestamp">Generated: ${new Date(analysis.timestamp).toLocaleString()}</div>
          </div>
        </div>
      </div>
    `;

    return cardHTML;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinancialConsistencyEngine;
}
