/**
 * EDD INVESTIGATION DECISION ENGINE
 * 
 * Handles the complete 11-section investigation workflow:
 * 1. Risk Classification (Auto-loaded from CRP)
 * 2. Customer Information (Auto-loaded from T24)
 * 3. Purpose of Account (Investigator manual)
 * 4. Source of Income (Hybrid: T24 + Manual)
 * 5. Initial Deposit (Auto-loaded from T24)
 * 6. Expected Transactions (Investigator manual)
 * 7. Existing Bank Relations (Auto-loaded from T24)
 * 8. Other Banks (Investigator manual)
 * 9. Related Parties (Investigator manual)
 * 10. PEP Information (Hybrid: Regulatory + Manual)
 * 11. Business Recommendation (Decision workflow)
 *
 * GOVERNANCE PRINCIPLE: 
 * - All risk scores originate from external systems (CRP, T24, TM, Regulatory)
 * - This platform READS and DISPLAYS risk data only
 * - No risk calculation or modification occurs in this system
 * - All decisions are logged with full audit trail
 * 
 * Workflow:
 * Investigator (Maker) → Complete 11 sections → Submit decision
 * Manager (Checker) → Review all sections → Approve/Reject
 * Compliance → If escalated, final determination
 */

class EDDInvestigationEngine {
  constructor() {
    this.caseId = this.generateCaseId();
    this.rimNumber = '';
    this.caseData = {
      section1: {}, // Risk Classification (READ-ONLY from CRP)
      section2: {}, // Customer Information (READ-ONLY from T24)
      section3: {}, // Purpose of Account (INVESTIGATOR INPUT)
      section4: {}, // Source of Income (HYBRID)
      section5: {}, // Initial Deposit (READ-ONLY from T24)
      section6: {}, // Expected Transactions (INVESTIGATOR INPUT)
      section7: {}, // Existing Bank Relations (READ-ONLY from T24)
      section8: {}, // Other Banks (INVESTIGATOR INPUT)
      section9: {}, // Related Parties (INVESTIGATOR INPUT)
      section10: {}, // PEP Information (HYBRID: Regulatory + Manual)
      section11: {} // Business Recommendation (DECISION)
    };
    this.auditTrail = [];
    this.status = 'DRAFT';
  }

  /**
   * SECTION 1: Load Risk Classification from CRP
   * SOURCE: External - CRP (Customer Risk Profiling Engine)
   * TYPE: READ-ONLY
   */
  async loadRiskClassification(rimNumber) {
    this.rimNumber = rimNumber;
    try {
      // In production: GET /api/risk/classification/{rim}
      const riskData = {
        rimNumber: rimNumber,
        overallRiskCategory: 'HIGH',
        riskScore: 78,
        riskScoreMax: 100,
        primaryRiskDriver: 'ACT_RISK_SCORE (Activity/Transaction Risk)',
        riskFactors: {
          PROD_RISK_SCORE: 90,
          PROD_RISK_CATEG: 'MEDIUM',
          ACT_RISK_SCORE: 160,
          ACT_RISK_CATEG: 'HIGH',
          OCCP_RISK_SCORE: 80,
          OCCP_RISK_CATEG: 'MEDIUM',
          COUNTRY_RISK_SCORE: 40,
          COUNTRY_RISK_CATEG: 'LOW'
        },
        lastSyncTimestamp: new Date().toISOString(),
        source: 'CRP (Customer Risk Profiling Engine)',
        authority: 'QCB Approved',
        dataQualityStatus: 'VERIFIED'
      };
      this.caseData.section1 = riskData;
      this.logAudit('LOAD_RISK_CLASSIFICATION', `Risk classification loaded from CRP for RIM: ${rimNumber}`, riskData);
      return riskData;
    } catch (error) {
      this.logAudit('ERROR_LOAD_RISK_CLASSIFICATION', error.message, {});
      throw error;
    }
  }

  /**
   * SECTION 2: Load Customer Information from T24
   * SOURCE: External - T24 Core Banking System
   * TYPE: READ-ONLY
   */
  async loadCustomerInformation(rimNumber) {
    try {
      // In production: GET /api/customer/profile/{rim}
      const customerData = {
        rimNumber: rimNumber,
        fullName: 'Abdullah Mohammed Al-Kuwari',
        dateOfBirth: '1975-03-15',
        nationality: 'Qatari',
        occupation: 'Government Official',
        contactPhone: '+974 4411-0234',
        emailAddress: 'a.alkuwari@qib.qa',
        relationshipManager: 'Ahmed Al-Dosari',
        relationshipStartDate: '2016-01-20',
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Core Banking',
        dataQualityStatus: 'VERIFIED'
      };
      this.caseData.section2 = customerData;
      this.logAudit('LOAD_CUSTOMER_INFO', `Customer information loaded from T24 for RIM: ${rimNumber}`, customerData);
      return customerData;
    } catch (error) {
      this.logAudit('ERROR_LOAD_CUSTOMER_INFO', error.message, {});
      throw error;
    }
  }

  /**
   * SECTION 3: Validate Purpose of Account (Investigator Input)
   * SOURCE: Investigator Manual Entry
   * TYPE: REQUIRED FIELD
   */
  validatePurposeOfAccount(accountPurpose, businessRelationship) {
    if (!accountPurpose || accountPurpose.trim().length === 0) {
      throw new Error('Section 3: Account purpose is mandatory');
    }
    if (!businessRelationship || businessRelationship.trim().length === 0) {
      throw new Error('Section 3: Business relationship explanation is mandatory');
    }
    this.caseData.section3 = {
      accountPurpose: accountPurpose,
      businessRelationship: businessRelationship,
      completedAt: new Date().toISOString()
    };
    this.logAudit('VALIDATE_ACCOUNT_PURPOSE', 'Account purpose validated', this.caseData.section3);
    return true;
  }

  /**
   * SECTION 4: Validate Source of Income (Hybrid: T24 + Investigator Assessment)
   * SOURCE: Hybrid (T24 Auto-Fill + Investigator Manual Assessment)
   * TYPE: REQUIRED FIELD
   */
  async validateSourceOfIncome(sourceExplanation, incomeVerified) {
    try {
      // Load auto-populated T24 employment data
      const t24SourceData = {
        employmentStatus: 'Employed (Government)',
        employerName: 'Qatar Ministry of Interior',
        yearsOfEmployment: 22,
        estimatedAnnualIncome: 'QAR 450,000 - 500,000',
        source: 'T24',
        lastSyncTimestamp: new Date().toISOString()
      };

      // Validate investigator assessment
      if (!sourceExplanation || sourceExplanation.trim().length === 0) {
        throw new Error('Section 4: Source of wealth explanation is mandatory');
      }

      this.caseData.section4 = {
        externalData: t24SourceData,
        investigatorAssessment: sourceExplanation,
        incomeVerified: incomeVerified,
        completedAt: new Date().toISOString()
      };

      this.logAudit('VALIDATE_SOURCE_OF_INCOME', 'Source of income validated', this.caseData.section4);
      return true;
    } catch (error) {
      this.logAudit('ERROR_VALIDATE_SOURCE_OF_INCOME', error.message, {});
      throw error;
    }
  }

  /**
   * SECTION 5: Load Initial Deposit from T24
   * SOURCE: External - T24 Transaction History
   * TYPE: READ-ONLY
   */
  async loadInitialDeposit(rimNumber) {
    try {
      // In production: GET /api/transactions/initial/{rim}
      const depositData = {
        rimNumber: rimNumber,
        depositAmount: 250000,
        depositCurrency: 'QAR',
        depositDate: '2026-02-15',
        depositMethod: 'Cheque Transfer',
        sourceAccount: 'QIB-PB-001234',
        verificationStatus: 'VERIFIED',
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Transaction History',
        dataQualityStatus: 'VERIFIED'
      };
      this.caseData.section5 = depositData;
      this.logAudit('LOAD_INITIAL_DEPOSIT', `Initial deposit loaded from T24 for RIM: ${rimNumber}`, depositData);
      return depositData;
    } catch (error) {
      this.logAudit('ERROR_LOAD_INITIAL_DEPOSIT', error.message, {});
      throw error;
    }
  }

  /**
   * SECTION 6: Validate Expected Transactions (Investigator Input)
   * SOURCE: Investigator Manual Entry
   * TYPE: REQUIRED FIELD
   */
  validateExpectedTransactions(monthlyIncome, monthlyExpense, transactionDescription) {
    if (!monthlyIncome || monthlyIncome <= 0) {
      throw new Error('Section 6: Expected monthly income is mandatory');
    }
    if (!monthlyExpense || monthlyExpense < 0) {
      throw new Error('Section 6: Expected monthly expense is mandatory');
    }
    if (!transactionDescription || transactionDescription.trim().length === 0) {
      throw new Error('Section 6: Transaction description is mandatory');
    }
    this.caseData.section6 = {
      expectedMonthlyIncome: monthlyIncome,
      expectedMonthlyExpense: monthlyExpense,
      transactionDescription: transactionDescription,
      netExpectedCashFlow: monthlyIncome - monthlyExpense,
      completedAt: new Date().toISOString()
    };
    this.logAudit('VALIDATE_EXPECTED_TRANSACTIONS', 'Expected transactions profile validated', this.caseData.section6);
    return true;
  }

  /**
   * SECTION 7: Load Existing Bank Relations from T24
   * SOURCE: External - T24 Customer Portfolio
   * TYPE: READ-ONLY
   */
  async loadExistingBankRelations(rimNumber) {
    try {
      // In production: GET /api/accounts/{rim}/list
      const accountsData = {
        rimNumber: rimNumber,
        accounts: [
          {
            accountNumber: 'QIB-PB-001234',
            accountType: 'Savings Account',
            balance: 1250000,
            status: 'Active'
          },
          {
            accountNumber: 'QIB-INV-001234',
            accountType: 'Investment Account',
            balance: 3500000,
            status: 'Active'
          },
          {
            accountNumber: 'QIB-CF-001234',
            accountType: 'Credit Facility',
            balance: 500000,
            status: 'Active'
          }
        ],
        totalAggregateBalance: 4750000,
        relationshipDuration: '8+ years',
        lastSyncTimestamp: new Date().toISOString(),
        source: 'T24 Portfolio',
        dataQualityStatus: 'VERIFIED'
      };
      this.caseData.section7 = accountsData;
      this.logAudit('LOAD_EXISTING_RELATIONS', `Bank relations loaded from T24 for RIM: ${rimNumber}`, accountsData);
      return accountsData;
    } catch (error) {
      this.logAudit('ERROR_LOAD_EXISTING_RELATIONS', error.message, {});
      throw error;
    }
  }

  /**
   * SECTION 8: Validate Other Banks (Investigator Input)
   * SOURCE: Investigator Manual Entry
   * TYPE: OPTIONAL FIELD (but must be filled with "No" or bank list)
   */
  validateOtherBanks(hasOtherBanks, otherBankDetails) {
    // Mandatory rule: Must answer Yes/No/Unknown even if optional
    if (hasOtherBanks === undefined || hasOtherBanks === null) {
      throw new Error('Section 8: Must specify if customer has other bank accounts');
    }

    // If Yes: must provide details
    if (hasOtherBanks === true && (!otherBankDetails || otherBankDetails.trim().length === 0)) {
      throw new Error('Section 8: Must list other banks if answer is "Yes"');
    }

    // If No: must provide comment/reason
    if (hasOtherBanks === false && (!otherBankDetails || otherBankDetails.trim().length === 0)) {
      throw new Error('Section 8: Must provide reason if customer has no other banks');
    }

    this.caseData.section8 = {
      hasOtherBanks: hasOtherBanks,
      details: otherBankDetails,
      completedAt: new Date().toISOString()
    };
    this.logAudit('VALIDATE_OTHER_BANKS', 'Other banks section validated', this.caseData.section8);
    return true;
  }

  /**
   * SECTION 9: Validate Related Parties (Investigator Input)
   * SOURCE: Investigator Manual Entry
   * TYPE: OPTIONAL FIELD (but must confirm "None" if not applicable)
   */
  validateRelatedParties(hasRelatedParties, relatedPartiesList) {
    // Mandatory rule: Must answer Yes/No/Unknown
    if (hasRelatedParties === undefined || hasRelatedParties === null) {
      throw new Error('Section 9: Must specify if there are related parties');
    }

    // If Yes: must list
    if (hasRelatedParties === true && (!relatedPartiesList || relatedPartiesList.trim().length === 0)) {
      throw new Error('Section 9: Must list related parties if answer is "Yes"');
    }

    // If No: accept confirmation
    this.caseData.section9 = {
      hasRelatedParties: hasRelatedParties,
      relatedPartiesList: relatedPartiesList || 'None identified',
      completedAt: new Date().toISOString()
    };
    this.logAudit('VALIDATE_RELATED_PARTIES', 'Related parties section validated', this.caseData.section9);
    return true;
  }

  /**
   * SECTION 10: Validate PEP Information (Hybrid: Regulatory + Investigator)
   * SOURCE: Hybrid (Regulatory Database Auto-Fill + Investigator Manual Assessment)
   * TYPE: CONDITIONAL (Required only if isPEP = true)
   */
  async validatePEPInformation(isPEP, pepAssessment, sourceOfFundsVerification, managerApproval) {
    try {
      if (isPEP === true) {
        // PEP case: all three fields mandatory
        if (!pepAssessment || pepAssessment.trim().length === 0) {
          throw new Error('Section 10: PEP risk assessment is mandatory');
        }
        if (!sourceOfFundsVerification || sourceOfFundsVerification.trim().length === 0) {
          throw new Error('Section 10: Source of funds verification is mandatory for PEP');
        }
        if (!managerApproval) {
          throw new Error('Section 10: Manager approval status is mandatory for PEP');
        }
      }

      // Load regulatory PEP data
      const regulatoryPepData = {
        isPEP: isPEP,
        pepStatus: isPEP ? 'CONFIRMED' : 'NOT PEP',
        pepType: isPEP ? 'Domestic' : 'N/A',
        position: isPEP ? 'Government Official (Ministry Level)' : 'N/A',
        source: 'Regulatory Database',
        lastSyncTimestamp: new Date().toISOString(),
        dataQualityStatus: isPEP ? 'VERIFIED' : 'N/A'
      };

      this.caseData.section10 = {
        externalData: regulatoryPepData,
        investigatorAssessment: pepAssessment || 'Not applicable',
        sourceOfFundsVerification: sourceOfFundsVerification || 'Not applicable',
        managerApproval: managerApproval,
        completedAt: new Date().toISOString()
      };

      this.logAudit('VALIDATE_PEP_INFORMATION', `PEP information validated. isPEP: ${isPEP}`, this.caseData.section10);
      return true;
    } catch (error) {
      this.logAudit('ERROR_VALIDATE_PEP_INFORMATION', error.message, {});
      throw error;
    }
  }

  /**
   * SECTION 11: Business Recommendation & Final Decision
   * 
   * Two-stage approval:
   * 1. Investigator (Maker) submits recommendation: APPROVE / ESCALATE / REJECT / REWORK
   * 2. Manager (Checker) approves or rejects: APPROVED / REJECTED / REQUEST_REWORK
   */
  submitInvestigatorDecision(assessment, recommendation) {
    if (!assessment || assessment.trim().length === 0) {
      throw new Error('Section 11: Assessment summary is mandatory');
    }
    if (!recommendation || !['APPROVE', 'ESCALATE', 'REJECT', 'REWORK'].includes(recommendation)) {
      throw new Error('Section 11: Valid recommendation must be selected');
    }

    this.caseData.section11 = {
      investigatorAssessment: assessment,
      investigatorRecommendation: recommendation,
      investigatorSignature: 'Auto-captured',
      investigatorTimestamp: new Date().toISOString(),
      makerRole: 'Compliance Officer',
      managerDecision: null, // Pending manager review
      managerApproval: null,
      managerComments: null,
      managerSignature: null,
      managerTimestamp: null
    };

    this.status = 'PENDING_MANAGER_REVIEW';
    this.logAudit('SUBMIT_INVESTIGATOR_DECISION', `Investigator submitted recommendation: ${recommendation}`, this.caseData.section11);
    return {
      status: 'SUCCESS',
      message: 'Case submitted for manager review',
      caseId: this.caseId,
      nextStep: 'Manager/Checker Review'
    };
  }

  /**
   * Manager Review & Approval (Checker)
   * 
   * Decision Options:
   * - APPROVED: Case accepted, customer approved for operations
   * - REJECTED: Case rejected, customer declined
   * - REWORK: Return case to investigator for additional work
   */
  submitManagerApproval(managerDecision, managerComments = '') {
    if (!this.caseData.section11.investigatorRecommendation) {
      throw new Error('Cannot approve case without investigator recommendation');
    }

    if (!managerDecision || !['APPROVED', 'REJECTED', 'REWORK'].includes(managerDecision)) {
      throw new Error('Section 11: Valid manager decision must be selected');
    }

    this.caseData.section11.managerDecision = managerDecision;
    this.caseData.section11.managerApproval = managerDecision;
    this.caseData.section11.managerComments = managerComments;
    this.caseData.section11.managerSignature = 'Auto-captured';
    this.caseData.section11.managerTimestamp = new Date().toISOString();
    this.caseData.section11.checkerRole = 'Senior Compliance Manager';

    // Update case status based on decision
    switch (managerDecision) {
      case 'APPROVED':
        this.status = 'APPROVED';
        break;
      case 'REJECTED':
        this.status = 'REJECTED';
        break;
      case 'REWORK':
        this.status = 'RETURNED_FOR_REWORK';
        break;
    }

    this.logAudit('SUBMIT_MANAGER_DECISION', `Manager submitted decision: ${managerDecision}`, this.caseData.section11);
    return {
      status: 'SUCCESS',
      message: `Case marked as ${this.status}`,
      caseId: this.caseId,
      caseStatus: this.status
    };
  }

  /**
   * Validate All Mandatory Fields
   * 
   * Rules:
   * - Sections 1, 2, 5, 7: Auto-filled from external systems (no validation needed)
   * - Sections 3, 4, 6, 11: Mandatory investigator fields
   * - Sections 8, 9: Conditional (must answer but can be "N/A")
   * - Section 10: Conditional on PEP status
   * - Section 11: Requires both investigator AND manager decision
   */
  validateAllSections() {
    const errors = [];

    // Check mandatory external-filled sections exist
    if (!this.caseData.section1 || Object.keys(this.caseData.section1).length === 0) {
      errors.push('Section 1 (Risk Classification) not loaded');
    }
    if (!this.caseData.section2 || Object.keys(this.caseData.section2).length === 0) {
      errors.push('Section 2 (Customer Information) not loaded');
    }
    if (!this.caseData.section5 || Object.keys(this.caseData.section5).length === 0) {
      errors.push('Section 5 (Initial Deposit) not loaded');
    }
    if (!this.caseData.section7 || Object.keys(this.caseData.section7).length === 0) {
      errors.push('Section 7 (Existing Bank Relations) not loaded');
    }

    // Check mandatory investigator sections
    if (!this.caseData.section3 || Object.keys(this.caseData.section3).length === 0) {
      errors.push('Section 3 (Purpose of Account) is incomplete');
    }
    if (!this.caseData.section4 || Object.keys(this.caseData.section4).length === 0) {
      errors.push('Section 4 (Source of Income) is incomplete');
    }
    if (!this.caseData.section6 || Object.keys(this.caseData.section6).length === 0) {
      errors.push('Section 6 (Expected Transactions) is incomplete');
    }

    // Check conditional sections
    if (!this.caseData.section8 || Object.keys(this.caseData.section8).length === 0) {
      errors.push('Section 8 (Other Banks) requires answer');
    }
    if (!this.caseData.section9 || Object.keys(this.caseData.section9).length === 0) {
      errors.push('Section 9 (Related Parties) requires answer');
    }

    // Check PEP if applicable
    if (this.caseData.section1.criteria === 'PEP') {
      if (!this.caseData.section10 || Object.keys(this.caseData.section10).length === 0) {
        errors.push('Section 10 (PEP Information) is mandatory for PEP customers');
      }
    }

    // Check decision section
    if (!this.caseData.section11 || !this.caseData.section11.investigatorRecommendation) {
      errors.push('Section 11: Investigator decision required');
    }
    if (!this.caseData.section11.managerDecision) {
      errors.push('Section 11: Manager approval required');
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors:\n- ${errors.join('\n- ')}`);
    }

    return true;
  }

  /**
   * Audit Trail Logging
   * 
   * Every action is logged with:
   * - Timestamp
   * - Action type
   * - User (auto-captured from session)
   * - Details
   * - Status
   */
  logAudit(actionType, description, data) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      actionType: actionType,
      description: description,
      user: 'Current User', // In production: capture from session
      dataSnapshot: JSON.parse(JSON.stringify(data)), // Clone to preserve state
      caseId: this.caseId,
      caseStatus: this.status
    };

    this.auditTrail.push(auditEntry);

    // In production: POST /api/audit-log
    console.log('AUDIT LOG:', auditEntry);
    return auditEntry;
  }

  /**
   * Generate unique case ID
   */
  generateCaseId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `EDD-${new Date().getFullYear()}-${timestamp}-${random}`;
  }

  /**
   * Export case for submission
   */
  exportCase() {
    return {
      caseId: this.caseId,
      rimNumber: this.rimNumber,
      status: this.status,
      allSections: this.caseData,
      auditTrail: this.auditTrail,
      exportedAt: new Date().toISOString()
    };
  }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EDDInvestigationEngine;
}