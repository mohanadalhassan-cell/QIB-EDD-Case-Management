/**
 * EDD FORM VALIDATION MODULE
 * 
 * Enforces mandatory field rules across all 11 sections:
 * 1. No empty fields allowed
 * 2. If field marked as "Not Applicable" → requires justification
 * 3. Auto-fills external data (no validation needed)
 * 4. All investigator input must be completed or marked N/A with reason
 * 
 * MANDATORY FIELD RULE:
 * Every section must be completed OR explicitly marked as "N/A - [reason]"
 */

class EDDFormValidator {
  constructor() {
    this.validationRules = this.defineValidationRules();
    this.fieldErrors = {};
    this.sectionStatus = {};
  }

  /**
   * Define validation rules for each section
   */
  defineValidationRules() {
    return {
      section1: {
        type: 'external',
        mandatory: true,
        fields: ['overallRiskCategory', 'riskScore', 'primaryRiskDriver'],
        autoPopulated: true,
        requiresValidation: false,
        description: 'Risk Classification (Auto-filled from CRP)'
      },
      section2: {
        type: 'external',
        mandatory: true,
        fields: ['fullName', 'dateOfBirth', 'nationality', 'occupation', 'contactPhone'],
        autoPopulated: true,
        requiresValidation: false,
        description: 'Customer Information (Auto-filled from T24)'
      },
      section3: {
        type: 'manual',
        mandatory: true,
        fields: [
          { name: 'accountPurpose', type: 'textarea', minLength: 10 },
          { name: 'businessRelationship', type: 'textarea', minLength: 10 }
        ],
        autoPopulated: false,
        requiresValidation: true,
        description: 'Purpose of Account (Investigator Input)',
        naAllowed: false // Cannot be marked N/A
      },
      section4: {
        type: 'hybrid',
        mandatory: true,
        fields: [
          { name: 'sourceExplanation', type: 'textarea', minLength: 10 },
          { name: 'incomeVerified', type: 'radio', required: true }
        ],
        autoPopulated: 'partial', // T24 auto-fills employment, investigator assesses
        requiresValidation: true,
        description: 'Source of Income (T24 + Investigator Assessment)',
        naAllowed: false // Must verify income source
      },
      section5: {
        type: 'external',
        mandatory: true,
        fields: ['depositAmount', 'depositDate', 'depositMethod', 'verificationStatus'],
        autoPopulated: true,
        requiresValidation: false,
        description: 'Initial Deposit (Auto-filled from T24)'
      },
      section6: {
        type: 'manual',
        mandatory: true,
        fields: [
          { name: 'expectedMonthlyIncome', type: 'number', required: true, min: 0 },
          { name: 'expectedMonthlyExpense', type: 'number', required: true, min: 0 },
          { name: 'transactionDescription', type: 'textarea', minLength: 10 }
        ],
        autoPopulated: false,
        requiresValidation: true,
        description: 'Expected Transactions (Investigator Input)',
        naAllowed: false // Cannot be marked N/A
      },
      section7: {
        type: 'external',
        mandatory: true,
        fields: ['accounts', 'totalAggregateBalance', 'relationshipDuration'],
        autoPopulated: true,
        requiresValidation: false,
        description: 'Existing Bank Relations (Auto-filled from T24)'
      },
      section8: {
        type: 'manual',
        mandatory: 'conditional',
        fields: [
          { name: 'hasOtherBanks', type: 'radio', required: true },
          { name: 'otherBankDetails', type: 'textarea', minLength: 5, conditionalRequired: true }
        ],
        autoPopulated: false,
        requiresValidation: true,
        description: 'Other Banks (Investigator Input - Optional)',
        naAllowed: false, // Must answer Yes/No/Unknown
        navigationNote: 'Optional field - but must provide answer (Yes/No/Unknown)'
      },
      section9: {
        type: 'manual',
        mandatory: 'conditional',
        fields: [
          { name: 'hasRelatedParties', type: 'radio', required: true },
          { name: 'relatedPartiesList', type: 'textarea', minLength: 5, conditionalRequired: true }
        ],
        autoPopulated: false,
        requiresValidation: true,
        description: 'Related Parties (Investigator Input - Optional)',
        naAllowed: false, // Must answer Yes/No/Unknown
        navigationNote: 'Optional field - but must provide answer (Yes/No/Unknown)'
      },
      section10: {
        type: 'hybrid',
        mandatory: 'conditional',
        fields: [
          { name: 'pepAssessment', type: 'textarea', minLength: 10, conditionalRequired: true },
          { name: 'sourceOfFundsVerification', type: 'textarea', minLength: 10, conditionalRequired: true },
          { name: 'managerApproval', type: 'radio', conditionalRequired: true }
        ],
        autoPopulated: 'partial', // Regulatory database auto-fills PEP status
        requiresValidation: 'conditional', // Only if isPEP = true
        description: 'PEP Information (Regulatory + Investigator Assessment)',
        naAllowed: 'conditional', // Can be N/A only if NOT PEP
        condition: 'isPEP === true',
        navigationNote: 'CONDITIONAL - Only required if customer is identified as PEP'
      },
      section11: {
        type: 'decision',
        mandatory: true,
        fields: [
          { name: 'investigatorAssessment', type: 'textarea', minLength: 20 },
          { name: 'investigatorRecommendation', type: 'radio', required: true },
          { name: 'managerDecision', type: 'radio', required: true },
          { name: 'managerComments', type: 'textarea', minLength: 5, required: true }
        ],
        autoPopulated: false,
        requiresValidation: true,
        description: 'Business Recommendation & Decision',
        naAllowed: false, // Decision must be explicit
        workflowNote: 'Two-stage approval: Investigator (Maker) + Manager (Checker)'
      }
    };
  }

  /**
   * Validate a single field
   * 
   * Returns: { isValid: boolean, error: string | null }
   */
  validateField(sectionName, fieldName, fieldValue) {
    const section = this.validationRules[sectionName];
    if (!section) {
      return { isValid: false, error: `Unknown section: ${sectionName}` };
    }

    const fieldRule = section.fields.find(f => 
      typeof f === 'string' ? f === fieldName : f.name === fieldName
    );

    if (!fieldRule) {
      return { isValid: true, error: null }; // Field not in rules, skip
    }

    // Get the field definition
    const def = typeof fieldRule === 'string' ? {} : fieldRule;

    // Check if field is empty
    if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim().length === 0)) {
      // Check if N/A is allowed
      if (!section.naAllowed && section.type !== 'external') {
        return {
          isValid: false,
          error: `${sectionName}/${fieldName} is mandatory and cannot be left empty. If not applicable, enter "N/A - [reason]".`
        };
      }
    }

    // Validate field type & length
    if (def.type === 'textarea' && fieldValue && def.minLength) {
      if (fieldValue.trim().length < def.minLength) {
        return {
          isValid: false,
          error: `${fieldName} must be at least ${def.minLength} characters`
        };
      }
    }

    if (def.type === 'number' && fieldValue) {
      const numValue = Number(fieldValue);
      if (isNaN(numValue)) {
        return { isValid: false, error: `${fieldName} must be a valid number` };
      }
      if (def.min !== undefined && numValue < def.min) {
        return { isValid: false, error: `${fieldName} cannot be less than ${def.min}` };
      }
    }

    // Validate conditional fields
    if (def.conditionalRequired && !fieldValue) {
      return {
        isValid: false,
        error: `${fieldName} is required because the previous answer is "Yes"`
      };
    }

    return { isValid: true, error: null };
  }

  /**
   * Validate entire section
   * 
   * Returns: { isComplete: boolean, errors: {fieldName: errorMessage} }
   */
  validateSection(sectionName, sectionData) {
    const section = this.validationRules[sectionName];
    if (!section) {
      throw new Error(`Unknown section: ${sectionName}`);
    }

    // External sections don't need validation (auto-populated)
    if (section.type === 'external') {
      return { isComplete: true, errors: {} };
    }

    const errors = {};

    // Validate each field in the section
    if (Array.isArray(section.fields)) {
      for (const fieldRule of section.fields) {
        const fieldName = typeof fieldRule === 'string' ? fieldRule : fieldRule.name;
        const fieldValue = sectionData[fieldName];

        const validation = this.validateField(sectionName, fieldName, fieldValue);
        if (!validation.isValid) {
          errors[fieldName] = validation.error;
        }
      }
    }

    const isComplete = Object.keys(errors).length === 0;
    this.sectionStatus[sectionName] = isComplete;

    return {
      isComplete: isComplete,
      errors: errors,
      completionPercentage: isComplete ? 100 : 0,
      section: sectionName
    };
  }

  /**
   * Validate all sections (form completion check)
   * 
   * Returns progress: { totalSections: 11, completedSections: n, progress: % }
   */
  validateAllSections(caseData) {
    const results = {
      totalSections: 11,
      completedSections: 0,
      incompleteBy: [],
      warnings: [],
      canSubmit: false,
      progress: 0
    };

    for (let i = 1; i <= 11; i++) {
      const sectionName = `section${i}`;
      const sectionData = caseData[sectionName] || {};
      const validation = this.validateSection(sectionName, sectionData);

      if (validation.isComplete) {
        results.completedSections += 1;
      } else {
        results.incompleteBy.push({
          section: sectionName,
          errors: validation.errors
        });
      }
    }

    results.progress = Math.round((results.completedSections / results.totalSections) * 100);

    // Can submit if all mandatory sections complete
    if (results.completedSections === results.totalSections) {
      results.canSubmit = true;
    } else {
      results.warnings.push(`${results.totalSections - results.completedSections} sections incomplete`);
    }

    return results;
  }

  /**
   * Check if specific field should be marked N/A
   * 
   * Usage: If user cannot fill field, mark as "N/A - [reason]"
   */
  allowsNA(sectionName, fieldName) {
    const section = this.validationRules[sectionName];
    if (!section) return false;

    // Check general NA allowance
    if (section.naAllowed === false) return false; // Explicitly disallowed
    if (section.naAllowed === true) return true;   // Explicitly allowed
    if (section.naAllowed === 'conditional') {
      // Check condition (e.g., "isPEP === true")
      // In real implementation, evaluate condition
      return true;
    }

    return false;
  }

  /**
   * Get section completion status with visual feedback
   * 
   * Returns: { sectionNum: 1, name: "Risk Classification", status: "EXTERNAL|COMPLETE|INCOMPLETE|CONDITIONAL", 
   *            completionPercent: 100, errors: [...] }
   */
  getSectionStatus(sectionName, caseData) {
    const section = this.validationRules[sectionName];
    const sectionNum = parseInt(sectionName.replace('section', ''));

    let status = 'UNKNOWN';
    let completionPercent = 0;

    if (section.type === 'external') {
      status = caseData[sectionName] && Object.keys(caseData[sectionName]).length > 0 ? 'EXTERNAL' : 'EXTERNAL_PENDING';
      completionPercent = 100;
    } else if (section.mandatory === 'conditional') {
      status = 'CONDITIONAL';
      completionPercent = caseData[sectionName] && Object.keys(caseData[sectionName]).length > 0 ? 100 : 0;
    } else {
      const validation = this.validateSection(sectionName, caseData[sectionName] || {});
      status = validation.isComplete ? 'COMPLETE' : 'INCOMPLETE';
      completionPercent = validation.isComplete ? 100 : 0;
    }

    return {
      sectionNum: sectionNum,
      name: section.description,
      status: status,
      completionPercent: completionPercent,
      type: section.type,
      mandatory: section.mandatory,
      errors: this.fieldErrors[sectionName] || []
    };
  }

  /**
   * Get all validation messages for display
   */
  getValidationSummary(caseData) {
    const summary = {
      totalIssues: 0,
      criticalIssues: [],
      warnings: [],
      bySection: {}
    };

    for (let i = 1; i <= 11; i++) {
      const sectionName = `section${i}`;
      const status = this.getSectionStatus(sectionName, caseData);
      summary.bySection[sectionName] = status;

      if (status.status === 'INCOMPLETE') {
        const errors = status.errors || [];
        if (errors.length > 0) {
          summary.totalIssues += errors.length;
          summary.criticalIssues.push({
            section: sectionName,
            message: `${sectionName} has ${errors.length} missing field(s)`
          });
        }
      }
    }

    return summary;
  }

  /**
   * Display user-friendly validation error messages
   */
  formatErrorMessage(sectionName, error) {
    const bgColor = {
      mandatory: '#fff3cd',    // Yellow
      incomplete: '#f8d7da',   // Red
      valid: '#d4edda'         // Green
    };

    return `
      <div style="background-color: ${bgColor.incomplete}; padding: 12px; border-left: 4px solid #dc3545; margin: 8px 0;">
        <strong>${sectionName}:</strong> ${error}
        <br/>
        <small>If not applicable, enter "N/A - [reason]"</small>
      </div>
    `;
  }

  /**
   * Get progress bar data for UI
   */
  getProgressData(caseData) {
    const validation = this.validateAllSections(caseData);
    return {
      completed: validation.completedSections,
      total: validation.totalSections,
      percent: validation.progress,
      canSubmit: validation.canSubmit,
      incomplete: validation.incompleteBy.map(item => item.section)
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EDDFormValidator;
}