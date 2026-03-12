/**
 * DATA INGESTION & MAPPING ENGINE
 * ═══════════════════════════════════════════════════════════════
 * Transforms bulk customer data (CSV, Excel, API) into standardized
 * EDD analysis format. Enables portfolio-level risk assessment.
 *
 * Strategic Capability: Allows QIB to analyze entire customer base
 * without per-transaction system integration. Output feeds directly
 * into Dynamic EDD Engine.
 *
 * Part of: Customer Risk Intelligence Platform
 * Version: 1.0.0 (Phase 5)
 */

'use strict';

const DataIngestionEngine = {

  /**
   * LAYER 1: DATA SOURCE DETECTION
   * Identifies source system and maps field names
   */
  detectDataSource(headers) {
    const sourceMap = {
      T24: ['CUSTOMER_ID', 'SECTOR', 'RESIDENCY', 'OCCUPATION'],
      CRM: ['CustId', 'Industry', 'Location', 'Job'],
      DMS: ['CustomerRef', 'DocType', 'DateReceived'],
      DataWarehouse: ['cust_id', 'risk_segment', 'country', 'business_type'],
      Custom: [] // fallback
    };

    let matchedSource = 'Custom';
    let maxMatches = 0;

    for (const [source, keys] of Object.entries(sourceMap)) {
      const matches = headers.filter(h => keys.some(k => h.toUpperCase().includes(k.toUpperCase()))).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        matchedSource = source;
      }
    }

    return {
      source: matchedSource,
      confidence: Math.min(100, maxMatches * 25) + '%',
      suggestedMapping: this.generateMapping(headers, matchedSource)
    };
  },

  /**
   * LAYER 2: FIELD MAPPING CONFIGURATION
   * Maps uploaded fields to QIB platform standard model
   */
  generateMapping(headers, source) {
    const standardFields = [
      'customerId',
      'nationality',
      'sector',
      'occupation',
      'income',
      'pep_status',
      'sanctions_match',
      'document_completeness',
      'employment_verified',
      'risk_score',
      'last_update'
    ];

    const customMapping = {};
    const unmappedFields = [];

    headers.forEach(header => {
      const matched = standardFields.find(std =>
        header.toLowerCase().includes(std.toLowerCase()) ||
        std.toLowerCase().includes(header.toLowerCase())
      );

      if (matched) {
        customMapping[header] = matched;
      } else {
        unmappedFields.push(header);
      }
    });

    return {
      mappings: customMapping,
      unmappedFields: unmappedFields,
      confidence: Math.round((Object.keys(customMapping).length / standardFields.length) * 100) + '%',
      status: unmappedFields.length === 0 ? 'READY_FOR_ANALYSIS' : 'REVIEW_REQUIRED'
    };
  },

  /**
   * LAYER 3: DATA VALIDATION
   * Checks data quality before analysis begins
   */
  validateDataset(rows, mapping) {
    const validation = {
      totalRecords: rows.length,
      validRecords: 0,
      issues: [],
      warnings: [],
      summary: {}
    };

    const missingCustomerIds = [];
    const duplicateIds = new Set();
    const idsSeen = new Set();
    const formatIssues = {};

    rows.forEach((row, idx) => {
      const customerId = this.getFieldValue(row, mapping, 'customerId');

      // Missing customer ID
      if (!customerId) {
        missingCustomerIds.push(idx);
        return;
      }

      // Duplicate detection
      if (idsSeen.has(customerId)) {
        duplicateIds.add(customerId);
      }
      idsSeen.add(customerId);

      // Format validation
      const income = this.getFieldValue(row, mapping, 'income');
      if (income && isNaN(parseFloat(income))) {
        if (!formatIssues.income) formatIssues.income = [];
        formatIssues.income.push({ row: idx + 1, value: income });
      }

      validation.validRecords++;
    });

    if (missingCustomerIds.length > 0) {
      validation.issues.push({
        type: 'MISSING_ID',
        severity: 'CRITICAL',
        count: missingCustomerIds.length,
        detail: `Rows ${missingCustomerIds.slice(0, 5).join(', ')}... missing Customer ID`
      });
    }

    if (duplicateIds.size > 0) {
      validation.warnings.push({
        type: 'DUPLICATE_ID',
        severity: 'WARNING',
        count: duplicateIds.size,
        detail: `${duplicateIds.size} customer(s) appear multiple times`
      });
    }

    if (Object.keys(formatIssues).length > 0) {
      Object.entries(formatIssues).forEach(([field, issues]) => {
        validation.warnings.push({
          type: 'FORMAT_ERROR',
          field: field,
          count: issues.length,
          severity: 'WARNING'
        });
      });
    }

    validation.summary = {
      passRate: Math.round((validation.validRecords / validation.totalRecords) * 100) + '%',
      criticalIssues: validation.issues.filter(i => i.severity === 'CRITICAL').length,
      warnings: validation.warnings.length,
      status: validation.issues.length === 0 ? 'VALID' : 'REQUIRES_REVIEW'
    };

    return validation;
  },

  /**
   * LAYER 4: BATCH TRANSFORMATION
   * Converts uploaded data to EDD Engine input format
   */
  transformToEddFormat(rows, mapping) {
    return rows.map((row, idx) => ({
      seq: idx + 1,
      customerId: this.getFieldValue(row, mapping, 'customerId'),
      nationality: this.getFieldValue(row, mapping, 'nationality'),
      sector: this.getFieldValue(row, mapping, 'sector'),
      occupation: this.getFieldValue(row, mapping, 'occupation'),
      income: parseFloat(this.getFieldValue(row, mapping, 'income')) || 0,
      pepStatus: this.parseBoolean(this.getFieldValue(row, mapping, 'pep_status')),
      sanctionsMatch: this.parseBoolean(this.getFieldValue(row, mapping, 'sanctions_match')),
      documentCompleteness: parseInt(this.getFieldValue(row, mapping, 'document_completeness')) || 0,
      employmentVerified: this.parseBoolean(this.getFieldValue(row, mapping, 'employment_verified')),
      riskScore: parseInt(this.getFieldValue(row, mapping, 'risk_score')) || 0,
      lastUpdate: this.getFieldValue(row, mapping, 'last_update') || new Date().toISOString()
    }));
  },

  /**
   * LAYER 5: BULK ANALYSIS & CASE GENERATION
   * Feeds transformed data into Dynamic EDD Engine
   * Returns flagged cases and insights
   */
  analyzeBatch(eddFormattedData, ruleEngine) {
    const results = {
      totalAnalyzed: eddFormattedData.length,
      casesClosed: 0,
      casesForReview: 0,
      casesEscalated: 0,
      cases: [],
      riskDistribution: { low: 0, medium: 0, high: 0 },
      topRisks: [],
      insights: {}
    };

    const casesByRisk = [];

    eddFormattedData.forEach(customer => {
      // Run through rule engine (mock)
      const riskScore = this.calculateRiskScore(customer);
      const decision = this.getDecision(riskScore);

      const caseObj = {
        customerId: customer.customerId,
        riskScore: riskScore,
        riskBand: this.getRiskBand(riskScore),
        decision: decision,
        flaggingReasons: this.getFlaggingReasons(customer),
        suggestedNextStep: this.suggestNextStep(decision),
        timestamp: new Date().toISOString()
      };

      // Categorize
      switch (decision) {
        case 'CLOSED':
          results.casesClosed++;
          break;
        case 'REVIEW':
          results.casesForReview++;
          casesByRisk.push(caseObj);
          break;
        case 'ESCALATED':
          results.casesEscalated++;
          casesByRisk.push(caseObj);
          break;
      }

      // Risk distribution
      const band = this.getRiskBand(riskScore);
      results.riskDistribution[band]++;

      results.cases.push(caseObj);
    });

    // Top risks (highest scoring cases)
    results.topRisks = results.cases
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 10);

    // Insights
    results.insights = {
      portfolioRiskSummary: {
        averageRiskScore: Math.round(
          results.cases.reduce((sum, c) => sum + c.riskScore, 0) / results.cases.length
        ),
        riskDistribution: results.riskDistribution,
        percentageRequiringAction: Math.round(
          ((results.casesForReview + results.casesEscalated) / results.totalAnalyzed) * 100
        ) + '%'
      },
      topFlags: this.identifyTopFlags(results.cases),
      recommendedActions: this.recommendActions(results)
    };

    return results;
  },

  /**
   * UTILITY: Get field value with fallback
   */
  getFieldValue(row, mapping, standardField) {
    const uploadedField = Object.keys(mapping).find(
      key => mapping[key] === standardField
    );
    return uploadedField ? row[uploadedField] : '';
  },

  /**
   * UTILITY: Parse boolean from multiple formats
   */
  parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return ['true', 'yes', '1', 'y', 't'].includes(value.toLowerCase());
    }
    return !!value;
  },

  /**
   * UTILITY: Calculate risk score (mock - should integrate with rule engine)
   */
  calculateRiskScore(customer) {
    let score = 0;

    // PEP: +40 points
    if (customer.pepStatus) score += 40;

    // Sanctions: +50 points (hard stop)
    if (customer.sanctionsMatch) score += 50;

    // High-risk sector: +20 points
    const highRiskSectors = ['CRYPTO', 'PRECIOUS_METALS', 'GAMBLING', 'WEAPONS'];
    if (highRiskSectors.includes(customer.sector?.toUpperCase())) score += 20;

    // Low income with high activity: +15 points
    if (customer.income < 300000 && customer.income > 0) score += 5;

    // Document incomplete: +10 points
    if (customer.documentCompleteness < 85) score += 10;

    // Employment not verified: +10 points
    if (!customer.employmentVerified) score += 10;

    return Math.min(100, score);
  },

  /**
   * UTILITY: Get risk band
   */
  getRiskBand(score) {
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  },

  /**
   * UTILITY: Determine decision
   */
  getDecision(score) {
    if (score >= 70) return 'ESCALATED';
    if (score >= 40) return 'REVIEW';
    return 'CLOSED';
  },

  /**
   * UTILITY: Identify flagging reasons
   */
  getFlaggingReasons(customer) {
    const reasons = [];

    if (customer.pepStatus) reasons.push('PEP Match Detected');
    if (customer.sanctionsMatch) reasons.push('Sanctions Match');
    if (customer.documentCompleteness < 85) reasons.push('Document Incomplete');
    if (!customer.employmentVerified) reasons.push('Employment Not Verified');

    const highRiskSectors = ['CRYPTO', 'PRECIOUS_METALS', 'GAMBLING', 'WEAPONS'];
    if (highRiskSectors.includes(customer.sector?.toUpperCase())) {
      reasons.push('High-Risk Sector');
    }

    return reasons;
  },

  /**
   * UTILITY: Suggest next step
   */
  suggestNextStep(decision) {
    const suggestions = {
      CLOSED: 'No action required. Case closed.',
      REVIEW: 'Assign to compliance officer for manual review.',
      ESCALATED: 'Escalate immediately. Senior review required.'
    };
    return suggestions[decision] || 'Review required';
  },

  /**
   * UTILITY: Identify top flags
   */
  identifyTopFlags(cases) {
    const flagCounts = {};

    cases.forEach(c => {
      c.flaggingReasons?.forEach(reason => {
        flagCounts[reason] = (flagCounts[reason] || 0) + 1;
      });
    });

    return Object.entries(flagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([flag, count]) => ({ flag, count }));
  },

  /**
   * UTILITY: Recommend actions
   */
  recommendActions(results) {
    const actions = [];

    if (results.insights.portfolioRiskSummary.percentageRequiringAction > 20) {
      actions.push({
        priority: 'HIGH',
        action: 'Conduct portfolio-wide compliance review',
        reason: `${results.insights.portfolioRiskSummary.percentageRequiringAction} of customers require action`
      });
    }

    if (results.casesEscalated > 0) {
      actions.push({
        priority: 'CRITICAL',
        action: `Escalate ${results.casesEscalated} cases to compliance team`,
        reason: 'Critical risk flags detected'
      });
    }

    if (results.riskDistribution.high > results.totalAnalyzed * 0.25) {
      actions.push({
        priority: 'HIGH',
        action: 'Review high-risk customer segment',
        reason: `${Math.round((results.riskDistribution.high / results.totalAnalyzed) * 100)}% of portfolio in high-risk band`
      });
    }

    return actions;
  },

  /**
   * TEMPLATE MANAGEMENT
   * Save/load field mappings for reuse
   */
  saveTemplate(templateName, mapping) {
    const templates = JSON.parse(localStorage.getItem('data_ingestion_templates') || '{}');
    templates[templateName] = {
      mapping: mapping,
      createdAt: new Date().toISOString(),
      version: '1.0.0'
    };
    localStorage.setItem('data_ingestion_templates', JSON.stringify(templates));
    return { status: 'SAVED', template: templateName };
  },

  loadTemplate(templateName) {
    const templates = JSON.parse(localStorage.getItem('data_ingestion_templates') || '{}');
    return templates[templateName] || null;
  },

  listTemplates() {
    const templates = JSON.parse(localStorage.getItem('data_ingestion_templates') || '{}');
    return Object.keys(templates).map(name => ({
      name: name,
      createdAt: templates[name].createdAt,
      fieldCount: Object.keys(templates[name].mapping).length
    }));
  }
};

// Export for use
if (typeof window !== 'undefined') {
  window.DataIngestionEngine = DataIngestionEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataIngestionEngine;
}
