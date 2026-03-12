/**
 * STAGE ELIGIBILITY CHECKER
 * ═══════════════════════════════════════════════════════════════
 * Determines which stage (A/B/C) each request is eligible for
 * based on AUTOMATED_DECISIONING_POLICY_FRAMEWORK
 * 
 * Used by: Dashboard UI (eligibility badges), Decision engine
 * Outputs: Stage eligibility + reason codes + confidence level
 */

const StageEligibilityChecker = {

  // ═══════════════════════════════════════════════════════════════
  // 1. STAGE ELIGIBILITY ASSESSMENT
  // ═══════════════════════════════════════════════════════════════

  assessStageEligibility: function(caseData) {
    /**
     * Main entry point: Evaluate case against all policy criteria
     * Returns: { stageC, stageB, stageA, bestStage, confidence, reasons }
     */
    
    const assessment = {
      timestamp: new Date(),
      caseId: caseData.id,
      customer: {
        id: caseData.customerId,
        segment: caseData.segment,
        riskProfile: caseData.riskProfile
      },
      
      // Stage eligibility assessment
      stageCEligible: false,
      stageBEligible: false,
      stageAEligible: true,  // Always eligible for manual review
      
      // Why each stage is/isn't eligible
      stageCReasons: [],
      stageBReasons: [],
      
      // Best stage recommendation
      bestStage: 'A',
      confidence: 0,
      
      // Detailed findings
      findings: {
        dataQuality: {},
        sanctions: {},
        pep: {},
        riskScore: {},
        documents: {},
        employment: {},
        sourceOfWealth: {}
      },
      
      // Fallback triggers (prevent automation)
      fallbackTriggers: [],
      
      // Decision recommendation (if eligible)
      recommendedDecision: null
    };
    
    // ═══════════════════════════════════════════════════════════════
    // 1A. CRITICAL FALLBACK CHECKS (Hard stops)
    // ═══════════════════════════════════════════════════════════════
    
    // Check for PEP
    if (this._checkPepMatch(caseData)) {
      assessment.fallbackTriggers.push('PEP_MATCH');
      assessment.stageCReasons.push('❌ PEP match detected - requires escalation');
      assessment.stageBReasons.push('❌ PEP match detected - requires escalation to compliance');
      assessment.bestStage = 'ESCALATE_COMPLIANCE';
      assessment.confidence = 100;
      return assessment;
    }
    
    // Check for Sanctions
    if (this._checkSanctionsMatch(caseData)) {
      assessment.fallbackTriggers.push('SANCTIONS_MATCH');
      assessment.stageCReasons.push('❌ Sanctions match detected - IMMEDIATE ESCALATION');
      assessment.bestStage = 'ESCALATE_IMMEDIATE';
      assessment.confidence = 100;
      return assessment;
    }
    
    // Check for Fraud
    if (this._checkFraudAlert(caseData)) {
      assessment.fallbackTriggers.push('FRAUD_ALERT');
      assessment.stageCReasons.push('❌ Fraud alert detected - immediate escalation');
      assessment.bestStage = 'ESCALATE_SECURITY';
      assessment.confidence = 100;
      return assessment;
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 1B. DATA QUALITY CHECKS
    // ═══════════════════════════════════════════════════════════════
    
    const dataQualityCheck = this._assessDataQuality(caseData);
    assessment.findings.dataQuality = dataQualityCheck;
    
    if (!dataQualityCheck.passed) {
      assessment.fallbackTriggers.push('DATA_QUALITY_INSUFFICIENT');
      assessment.stageCReasons.push(`❌ Data quality ${dataQualityCheck.score}% (threshold 95%)`);
      assessment.stageBReasons.push(`⚠️ Data quality concerns (${dataQualityCheck.score}%)`);
      if (dataQualityCheck.score < 85) {
        assessment.bestStage = 'A_MANUAL';
      }
    } else {
      assessment.stageCReasons.push(`✓ Data quality ${dataQualityCheck.score}% (sufficient)`);
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 1C. SANCTIONS & PEP VERIFICATION (Detailed)
    // ═══════════════════════════════════════════════════════════════
    
    const sanctionsCheck = this._assessSanctionsCompliance(caseData);
    assessment.findings.sanctions = sanctionsCheck;
    
    if (!sanctionsCheck.passed) {
      assessment.stageCReasons.push('❌ Sanctions/PEP check required or pending');
      assessment.stageBReasons.push('❌ Sanctions/PEP check required or pending');
      assessment.fallbackTriggers.push('COMPLIANCE_CHECK_PENDING');
    } else {
      assessment.stageCReasons.push('✓ Sanctions check PASSED (negative)');
      assessment.stageCReasons.push('✓ PEP check PASSED (negative)');
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 1D. RISK SCORE CALCULATION
    // ═══════════════════════════════════════════════════════════════
    
    const riskAssessment = this._calculateRiskScore(caseData);
    assessment.findings.riskScore = riskAssessment;
    
    // Stage C: Risk must be LOW (0-35)
    if (riskAssessment.score > 35) {
      assessment.stageCReasons.push(
        `❌ Risk score ${riskAssessment.score} (Stage C requires 0-35)`
      );
      
      // Stage B: Risk must be MEDIUM (36-60)
      if (riskAssessment.score <= 60) {
        assessment.stageBReasons.push(
          `✓ Risk score ${riskAssessment.score} (Stage B medium-risk band)`
        );
      } else {
        assessment.stageBReasons.push(
          `❌ Risk score ${riskAssessment.score} > 60 (requires manual Stage A)`
        );
        assessment.fallbackTriggers.push('RISK_SCORE_HIGH');
      }
    } else {
      assessment.stageCReasons.push(
        `✓ Risk score ${riskAssessment.score} (LOW, within Stage C range)`
      );
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 1E. DOCUMENT COMPLETENESS
    // ═══════════════════════════════════════════════════════════════
    
    const documentCheck = this._assessDocumentCompleteness(caseData);
    assessment.findings.documents = documentCheck;
    
    if (documentCheck.completeness < 95) {
      assessment.stageCReasons.push(
        `❌ Documents ${documentCheck.completeness}% complete (need 95%+)`
      );
      assessment.stageBReasons.push(
        `⚠️ Documents incomplete (${documentCheck.completeness}%) - auto-request`
      );
      
      // Can auto-request missing docs
      if (documentCheck.missingDocuments && documentCheck.missingDocuments.length > 0) {
        assessment.recommendedDecision = 'AUTO_REQUEST_DOCUMENTS';
        assessment.documentRequest = documentCheck.missingDocuments;
      }
    } else {
      assessment.stageCReasons.push(
        `✓ Documents complete (${documentCheck.completeness}%)`
      );
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 1F. EMPLOYMENT VERIFICATION
    // ═══════════════════════════════════════════════════════════════
    
    const employmentCheck = this._assessEmploymentVerification(caseData);
    assessment.findings.employment = employmentCheck;
    
    if (!employmentCheck.verified) {
      assessment.stageCReasons.push(
        `❌ Employment not verified (${employmentCheck.status})`
      );
      assessment.stageBReasons.push(
        `⚠️ Employment verification needed`
      );
      
      // Can request employment verification docs
      if (!assessment.documentRequest) assessment.documentRequest = [];
      assessment.documentRequest.push('employment-verification');
      assessment.recommendedDecision = 'AUTO_REQUEST_DOCUMENTS';
    } else {
      assessment.stageCReasons.push(
        `✓ Employment verified (${employmentCheck.employer})`
      );
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 1G. SOURCE OF WEALTH / FUNDS
    // ═══════════════════════════════════════════════════════════════
    
    const wealthCheck = this._assessSourceOfWealth(caseData);
    assessment.findings.sourceOfWealth = wealthCheck;
    
    if (!wealthCheck.documented) {
      assessment.stageCReasons.push(
        `❌ Source of wealth not documented`
      );
      assessment.stageBReasons.push(
        `⚠️ Source of wealth explanation needed`
      );
      
      assessment.recommendedDecision = 'AUTO_REQUEST_DOCUMENTS';
      if (!assessment.documentRequest) assessment.documentRequest = [];
      assessment.documentRequest.push('source-of-funds-documentation');
    } else if (wealthCheck.scored > 15) {
      // High wealth risk score
      assessment.stageCReasons.push(
        `❌ Source of wealth risk score ${wealthCheck.scored} (unclear/complex)`
      );
      assessment.stageBReasons.push(
        `⚠️ Source of wealth needs investigation`
      );
      assessment.fallbackTriggers.push('WEALTH_SOURCE_UNCLEAR');
    } else {
      assessment.stageCReasons.push(
        `✓ Source of wealth documented & clear`
      );
    }
    
    // ═══════════════════════════════════════════════════════════════
    // 2. DETERMINE BEST STAGE & CONFIDENCE
    // ═══════════════════════════════════════════════════════════════
    
    // If fallback triggered, not eligible for automation
    if (assessment.fallbackTriggers.length > 0) {
      assessment.stageCEligible = false;
      assessment.stageBEligible = false;
      assessment.stageAEligible = true;
      assessment.bestStage = 'A_MANUAL';
      assessment.confidence = 100;
    }
    // Stage C checks
    else if (
      dataQualityCheck.passed &&
      sanctionsCheck.passed &&
      riskAssessment.score <= 35 &&
      documentCheck.completeness >= 95 &&
      employmentCheck.verified &&
      wealthCheck.documented &&
      wealthCheck.scored <= 15
    ) {
      // ALL Stage C criteria met
      assessment.stageCEligible = true;
      assessment.stageBEligible = true;
      assessment.stageAEligible = true;
      assessment.bestStage = 'C_FULLY_AUTOMATED';
      assessment.confidence = Math.min(dataQualityCheck.score, 96); // High confidence
      assessment.recommendedDecision = 'AUTO_APPROVE'; // Tentative
    }
    // Stage B checks
    else if (
      dataQualityCheck.score >= 85 &&
      sanctionsCheck.passed &&
      riskAssessment.score <= 60 &&
      documentCheck.completeness >= 85
    ) {
      // Stage B (human-in-loop): System recommends, human reviews
      assessment.stageCEligible = false;
      assessment.stageBEligible = true;
      assessment.stageAEligible = true;
      assessment.bestStage = 'B_HUMAN_IN_LOOP';
      assessment.confidence = Math.min(dataQualityCheck.score, 80);
      assessment.recommendedDecision = 'SYSTEM_RECOMMENDS_HUMAN_REVIEWS';
    }
    // Stage A
    else {
      assessment.stageCEligible = false;
      assessment.stageBEligible = false;
      assessment.stageAEligible = true;
      assessment.bestStage = 'A_MANUAL';
      assessment.confidence = 100;
      assessment.recommendedDecision = 'MANUAL_REVIEW';
    }
    
    return assessment;
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. INDIVIDUAL CHECK METHODS
  // ═══════════════════════════════════════════════════════════════

  _checkPepMatch: function(caseData) {
    // Check if customer has PEP flag
    const pepCheck = caseData.complianceChecks?.pep || {};
    return pepCheck.matched === true || pepCheck.familyOfPep === true;
  },

  _checkSanctionsMatch: function(caseData) {
    // Check if customer has sanctions match
    const sanctionsCheck = caseData.complianceChecks?.sanctions || {};
    return sanctionsCheck.matched === true || sanctionsCheck.hits?.length > 0;
  },

  _checkFraudAlert: function(caseData) {
    // Check for fraud/security alerts
    const fraud = caseData.fraudCheck || {};
    return fraud.alert === true || fraud.compromised === true;
  },

  _assessDataQuality: function(caseData) {
    /**
     * Calculate data quality score (0-100)
     * Need 95%+ for Stage C, 85%+ for Stage B
     */
    const required = [
      'name', 'dateOfBirth', 'nationality', 'idNumber',
      'address', 'email', 'phone',
      'occupation', 'employmentStatus',
      'monthlyIncome', 'sourceOfIncome',
      'sourceOfWealth', 'netWorthRange'
    ];
    
    let present = 0;
    required.forEach(field => {
      if (caseData[field] && caseData[field] !== '' && caseData[field] !== null) {
        present++;
      }
    });
    
    const completeness = Math.round((present / required.length) * 100);
    
    // Check freshness
    let freshness = 100;
    if (caseData.kyc?.lastUpdated) {
      const months = (new Date() - new Date(caseData.kyc.lastUpdated)) / (1000 * 60 * 60 * 24 * 30);
      if (months > 24) freshness = 50; // Too old
      else if (months > 12) freshness = 75;
      else if (months > 6) freshness = 90;
    }
    
    const overallQuality = Math.round((completeness + freshness) / 2);
    
    return {
      score: overallQuality,
      completeness: completeness,
      freshness: freshness,
      passed: overallQuality >= 95,
      missing: required.filter(f => !caseData[f])
    };
  },

  _assessSanctionsCompliance: function(caseData) {
    const checks = caseData.complianceChecks || {};
    const sanctions = checks.sanctions || {};
    const pep = checks.pep || {};
    
    const lastSanctionsCheck = sanctions.checkDate ? 
      new Date(sanctions.checkDate) : null;
    const lastPepCheck = pep.checkDate ? 
      new Date(pep.checkDate) : null;
    
    // Check if recent (within 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    return {
      sanctionsChecked: sanctions.checked === true && sanctions.matched === false,
      sanctionsRecent: lastSanctionsCheck && lastSanctionsCheck > thirtyDaysAgo,
      pepChecked: pep.checked === true && pep.matched === false,
      pepRecent: lastPepCheck && lastPepCheck > thirtyDaysAgo,
      passed: (
        sanctions.matched === false &&
        pep.matched === false &&
        sanctions.checked === true &&
        pep.checked === true
      ),
      lastSanctionsCheck: lastSanctionsCheck,
      lastPepCheck: lastPepCheck
    };
  },

  _calculateRiskScore: function(caseData) {
    /**
     * Risk Score: 0-100
     * Stage C: 0-35 (LOW)
     * Stage B: 36-60 (MEDIUM)
     * Stage A: 61+ (HIGH/VERY HIGH)
     */
    let score = 0;
    const factors = [];
    
    // Occupation Risk (0-40)
    const occupation = caseData.occupationCode || '';
    const highRiskOccupations = ['LAWYER', 'ACCOUNTANT', 'CPA', 'MILITARY', 'POLITICIAN'];
    const mediumRiskOccupations = ['BUSINESS_OWNER', 'SELF_EMPLOYED', 'DIRECTOR'];
    
    if (highRiskOccupations.includes(occupation)) {
      score += 40;
      factors.push('High-risk occupation: +40');
    } else if (mediumRiskOccupations.includes(occupation)) {
      score += 15;
      factors.push('Medium-risk occupation: +15');
    }
    
    // Geographic Risk (0-30)
    const nationality = caseData.nationality || '';
    if (nationality === 'QA') {
      score += 0;
      factors.push('Qatari national: +0');
    } else if (['SA', 'AE', 'KW', 'OM', 'BH'].includes(nationality)) {
      score += 5;
      factors.push('GCC national: +5');
    } else if (this._isHighRiskCountry(nationality)) {
      score += 30;
      factors.push('High-risk jurisdiction: +30');
    } else {
      score += 10;
      factors.push('Foreign national: +10');
    }
    
    // Financial Risk (0-25)
    const income = parseFloat(caseData.monthlyIncome) || 0;
    if (income < 300000) {
      score += 25;
      factors.push('Income below threshold: +25');
    } else if (income < 500000) {
      score += 10;
      factors.push('Mid-range income: +10');
    } else if (income < 2000000) {
      score += 5;
      factors.push('Comfortable income: +5');
    } else {
      score += 10;
      factors.push('Very high income (UBO risk): +10');
    }
    
    // Source of Wealth (0-20)
    const sourceOfWealth = caseData.sourceOfWealth || '';
    if (sourceOfWealth === 'SALARY') {
      score += 0;
      factors.push('Salary source: +0');
    } else if (['BUSINESS', 'INVESTMENT'].includes(sourceOfWealth)) {
      score += 5;
      factors.push(`${sourceOfWealth} source: +5`);
    } else if (['GIFT', 'INHERITANCE'].includes(sourceOfWealth)) {
      score += 15;
      factors.push(`${sourceOfWealth} source: +15`);
    } else if (!sourceOfWealth) {
      score += 20;
      factors.push('Unclear source of wealth: +20');
    }
    
    // Compliance History (-5 to +15)
    const negativeEvents = caseData.complianceHistory?.events || [];
    const monthsSinceLastEvent = negativeEvents.length > 0 ?
      (new Date() - new Date(negativeEvents[0].date)) / (1000 * 60 * 60 * 24 * 30) : 999;
    
    if (negativeEvents.length === 0) {
      score -= 5;
      factors.push('Clean compliance history: -5');
    } else if (monthsSinceLastEvent > 36) {
      // Old event, mostly forgiven
      factors.push('Old negative event (>3 years): no penalty');
    } else if (monthsSinceLastEvent > 12) {
      score += 5;
      factors.push('Resolved compliance issue: +5');
    } else if (negativeEvents.length === 1) {
      score += 10;
      factors.push('Recent compliance issue: +10');
    } else {
      score += 15;
      factors.push('Multiple compliance issues: +15');
    }
    
    return {
      score: Math.min(Math.max(score, 0), 100),
      band: score <= 35 ? 'LOW' : (score <= 60 ? 'MEDIUM' : 'HIGH'),
      factors: factors,
      breakdown: {
        occupation: score,
        geographic: score,
        financial: score,
        wealth: score
      }
    };
  },

  _assessDocumentCompleteness: function(caseData) {
    const required = [
      { field: 'identity', name: 'Identity Document' },
      { field: 'residence', name: 'Residence Proof' },
      { field: 'employment', name: 'Employment Verification' },
      { field: 'sourceOfFunds', name: 'Source of Funds Documentation' }
    ];
    
    let provided = 0;
    const missing = [];
    
    required.forEach(doc => {
      if (caseData.documents && caseData.documents[doc.field]) {
        provided++;
      } else {
        missing.push(doc.name);
      }
    });
    
    return {
      completeness: Math.round((provided / required.length) * 100),
      provided: provided,
      required: required.length,
      missingDocuments: missing,
      requiredAtLeast: 3 // At least 3 of 4 for Stage B
    };
  },

  _assessEmploymentVerification: function(caseData) {
    const employment = caseData.employment || {};
    const verified = employment.verified === true ||
                     employment.verificationDate && 
                     (new Date() - new Date(employment.verificationDate)) < (90 * 24 * 60 * 60 * 1000);
    
    return {
      verified: verified,
      employer: employment.employer || 'Unknown',
      designation: employment.designation || 'Unknown',
      status: verified ? 'VERIFIED' : 'PENDING_VERIFICATION',
      source: employment.source || 'manual'
    };
  },

  _assessSourceOfWealth: function(caseData) {
    const wealth = caseData.sourceOfWealth || '';
    const explanation = caseData.sourceOfWealthExplanation || '';
    
    const documented = wealth && wealth !== '' &&
                      explanation && explanation.length > 20;
    
    let scored = 0;
    if (!documented) scored = 20;
    else if (['GIFT', 'INHERITANCE', 'OTHER'].includes(wealth)) scored = 15;
    else if (['BUSINESS', 'INVESTMENT'].includes(wealth)) scored = 5;
    else scored = 0; // SALARY
    
    return {
      source: wealth,
      documented: documented,
      explanation: explanation,
      scored: scored,
      clear: documented && scored <= 5
    };
  },

  _isHighRiskCountry: function(countryCode) {
    const highRiskCountries = [
      'KP', 'IR', 'SY', 'CU', 'SO'
    ];
    return highRiskCountries.includes(countryCode);
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. FORMATTED OUTPUT FOR UI DISPLAY
  // ═══════════════════════════════════════════════════════════════

  formatAssessmentForUI: function(assessment) {
    /**
     * Format assessment results for dashboard display
     */
    return {
      // Eligibility Badge
      badge: {
        eligible: assessment.stageCEligible,
        stage: this._getStageLabel(assessment.bestStage),
        color: this._getStageColor(assessment.bestStage),
        text: this._getStageText(assessment.bestStage),
        icon: this._getStageIcon(assessment.bestStage)
      },
      
      // Confidence & Quality Indicators
      metrics: {
        confidence: assessment.confidence,
        dataQuality: assessment.findings.dataQuality.score,
        riskScore: assessment.findings.riskScore.score,
        riskBand: assessment.findings.riskScore.band
      },
      
      // Decision Reasoning (plain language)
      reasoning: {
        title: this._getReasonTitle(assessment.bestStage),
        explanation: this._getReasonExplanation(assessment),
        positives: assessment.stageCReasons.filter(r => r.includes('✓')),
        concerns: assessment.stageCReasons.filter(r => r.includes('❌') || r.includes('⚠️')),
        fallbackTriggers: assessment.fallbackTriggers,
        recommendation: assessment.recommendedDecision
      },
      
      // What's needed to proceed
      nextSteps: this._getNextSteps(assessment)
    };
  },

  _getStageLabel: function(stage) {
    const labels = {
      'C_FULLY_AUTOMATED': 'Stage C - Fully Automated',
      'B_HUMAN_IN_LOOP': 'Stage B - Human-in-Loop',
      'A_MANUAL': 'Stage A - Manual Review',
      'ESCALATE_COMPLIANCE': 'Escalate to Compliance',
      'ESCALATE_IMMEDIATE': 'Immediate Escalation',
      'ESCALATE_SECURITY': 'Escalate to Security'
    };
    return labels[stage] || 'Under Review';
  },

  _getStageColor: function(stage) {
    const colors = {
      'C_FULLY_AUTOMATED': 'green',
      'B_HUMAN_IN_LOOP': 'blue',
      'A_MANUAL': 'amber',
      'ESCALATE_COMPLIANCE': 'red',
      'ESCALATE_IMMEDIATE': 'red',
      'ESCALATE_SECURITY': 'red'
    };
    return colors[stage] || 'gray';
  },

  _getStageText: function(stage) {
    const text = {
      'C_FULLY_AUTOMATED': 'Eligible for Auto-Approval',
      'B_HUMAN_IN_LOOP': 'Requires Human Review',
      'A_MANUAL': 'Requires Manual Review',
      'ESCALATE_COMPLIANCE': 'Escalate Immediately',
      'ESCALATE_IMMEDIATE': 'Compliance Hold',
      'ESCALATE_SECURITY': 'Security Review Required'
    };
    return text[stage] || 'Pending Review';
  },

  _getStageIcon: function(stage) {
    const icons = {
      'C_FULLY_AUTOMATED': '✅',
      'B_HUMAN_IN_LOOP': '👤',
      'A_MANUAL': '⚠️',
      'ESCALATE_COMPLIANCE': '🚨',
      'ESCALATE_IMMEDIATE': '🛑',
      'ESCALATE_SECURITY': '🔒'
    };
    return icons[stage] || '⏳';
  },

  _getReasonTitle: function(stage) {
    const titles = {
      'C_FULLY_AUTOMATED': 'Eligible for Automatic Approval',
      'B_HUMAN_IN_LOOP': 'Moderate Risk - Human Review Needed',
      'A_MANUAL': 'Manual Review Required',
      'ESCALATE_COMPLIANCE': 'Compliance Review Required',
      'ESCALATE_IMMEDIATE': 'Immediate Escalation Required',
      'ESCALATE_SECURITY': 'Security Review Required'
    };
    return titles[stage];
  },

  _getReasonExplanation: function(assessment) {
    if (assessment.stageCEligible) {
      return 'This request meets all policy criteria for automated approval. Low risk profile with complete documentation.';
    } else if (assessment.stageBEligible) {
      return 'This request has moderate risk or minor documentation gaps. Our system will recommend a decision, but a human reviewer will make the final call.';
    } else if (assessment.fallbackTriggers.length > 0) {
      return `This request cannot be automatically processed due to: ${assessment.fallbackTriggers.join(', ')}. Manual review required.`;
    } else {
      return 'This request requires human review due to complexity or risk indicators.';
    }
  },

  _getNextSteps: function(assessment) {
    const steps = [];
    
    if (assessment.stageCEligible) {
      steps.push({ action: 'AUTO_APPROVE', message: 'Ready for automatic approval' });
    } else if (assessment.stageBEligible) {
      steps.push({ action: 'SYSTEM_RECOMMEND', message: 'System will make recommendation for human review' });
    }
    
    if (assessment.documentRequest && assessment.documentRequest.length > 0) {
      steps.push({
        action: 'REQUEST_DOCUMENTS',
        documents: assessment.documentRequest,
        message: `Request: ${assessment.documentRequest.join(', ')}`
      });
    }
    
    if (assessment.fallbackTriggers.includes('COMPLIANCE_CHECK_PENDING')) {
      steps.push({
        action: 'WAIT_COMPLIANCE',
        message: 'Awaiting compliance clearance checks'
      });
    }
    
    if (assessment.fallbackTriggers.length > 0) {
      steps.push({
        action: 'ESCALATE',
        queue: assessment.bestStage,
        message: `Escalate to: ${assessment.bestStage}`
      });
    }
    
    return steps;
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StageEligibilityChecker;
}
