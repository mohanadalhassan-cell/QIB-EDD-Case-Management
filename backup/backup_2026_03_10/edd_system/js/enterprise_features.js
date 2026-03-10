/**
 * QIB EDD System - Enterprise Features Module
 * ============================================
 * Contains all enterprise-level features:
 * - Role Governance (Maker/Checker)
 * - Financial Profile Display
 * - Expected Activity Profile
 * - Officer Digital Confirmation (PIN)
 * - Call Center View (Read-Only)
 * - User Guide Module
 * - System Presentation
 * 
 * Data Source: T24 / ETL / SnapView
 */

const EnterpriseFeatures = {

  // =====================================================
  // ROLE GOVERNANCE SYSTEM
  // =====================================================
  
  roles: {
    BUSINESS_MAKER: {
      id: 'BUSINESS_MAKER',
      name: 'Business Maker',
      nameAr: 'صانع الأعمال',
      permissions: ['view_case', 'edit_case', 'add_comment', 'submit_for_approval'],
      restrictions: ['cannot_approve_own', 'cannot_delete_case'],
      description: 'Creates and submits EDD cases for review'
    },
    BUSINESS_CHECKER: {
      id: 'BUSINESS_CHECKER',
      name: 'Business Checker',
      nameAr: 'مدقق الأعمال',
      permissions: ['view_case', 'approve_business', 'reject_business', 'add_comment', 'escalate'],
      restrictions: ['cannot_approve_own_submission'],
      description: 'Reviews and approves business submissions'
    },
    CDD_MAKER: {
      id: 'CDD_MAKER',
      name: 'CDD Maker',
      nameAr: 'صانع CDD',
      permissions: ['view_case', 'edit_cdd_section', 'add_comment', 'submit_cdd'],
      restrictions: ['cannot_approve_own'],
      description: 'Performs CDD review and documentation'
    },
    CDD_CHECKER: {
      id: 'CDD_CHECKER',
      name: 'CDD Checker',
      nameAr: 'مدقق CDD',
      permissions: ['view_case', 'approve_cdd', 'reject_cdd', 'add_comment', 'escalate_compliance'],
      restrictions: ['cannot_approve_own_submission'],
      description: 'Reviews and approves CDD submissions'
    },
    COMPLIANCE_REVIEW: {
      id: 'COMPLIANCE_REVIEW',
      name: 'Compliance Review',
      nameAr: 'مراجعة الالتزام',
      permissions: ['view_all_cases', 'final_decision', 'freeze_account', 'escalate_management', 'add_compliance_note'],
      restrictions: [],
      description: 'Final review for escalated or suspicious cases'
    },
    CALL_CENTER_VIEW: {
      id: 'CALL_CENTER_VIEW',
      name: 'Call Center View',
      nameAr: 'عرض مركز الاتصال',
      permissions: ['view_customer_basic', 'view_salary', 'view_expected_activity', 'view_account_status'],
      restrictions: ['no_risk_score', 'no_aml_flags', 'no_compliance_notes', 'no_edit'],
      description: 'Read-only view for customer service inquiries'
    },
    IT_ADMIN: {
      id: 'IT_ADMIN',
      name: 'IT Administrator',
      nameAr: 'مدير تقنية المعلومات',
      permissions: ['system_config', 'user_management', 'audit_logs', 'data_export'],
      restrictions: ['no_case_decisions'],
      description: 'System administration and configuration'
    }
  },

  // Workflow stages with role assignments
  workflowStages: [
    { id: 'created', name: 'Case Created', roles: ['SYSTEM'], autoAssign: true },
    { id: 'business_maker', name: 'Business Maker Review', roles: ['BUSINESS_MAKER'] },
    { id: 'business_checker', name: 'Business Checker Approval', roles: ['BUSINESS_CHECKER'] },
    { id: 'cdd_maker', name: 'CDD Maker Review', roles: ['CDD_MAKER'] },
    { id: 'cdd_checker', name: 'CDD Checker Approval', roles: ['CDD_CHECKER'] },
    { id: 'compliance_escalation', name: 'Compliance Review', roles: ['COMPLIANCE_REVIEW'], conditional: true },
    { id: 'completed', name: 'Case Completed', roles: ['SYSTEM'] }
  ],

  // Check if case should escalate to compliance
  shouldEscalateToCompliance: function(caseData, decision) {
    const triggers = [
      caseData.triggers?.includes('PEP'),
      caseData.triggers?.includes('Sanctioned Country'),
      caseData.riskScores?.FINAL_RISK_CATEG === 'AUTO HIGH',
      decision?.flagForSuspicion,
      caseData.riskScores?.FINAL_RISK_SCORE > 400
    ];
    return triggers.some(t => t === true);
  },

  // =====================================================
  // FINANCIAL PROFILE DATA (ETL Fields)
  // =====================================================
  
  financialProfiles: {
    'RIM001234': {
      RIM: 'RIM001234',
      // Salary & Income (Exact ETL Field Names)
      SALARY: 450000,
      ANNUAL_INC: 5400000,
      SEC_INC_AMT: 150000,
      SEC_INC_SOURCE: 'Investment Returns',
      
      // Last Salary Information
      LAST_SAL_DA: '2024-02-28',
      LAST_SAL_AMT: 452000,
      LAST_MON_SALARY: 450000,
      
      // Calculated Fields
      AVG_LAST_3_SALARY: 448000,
      SALARY_VARIANCE_PCT: 2.3,
      
      // Historical Salary Data
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 452000, DATE_CREDITED: '2024-02-28' },
        { MONTH: '2024-01', AMOUNT: 448000, DATE_CREDITED: '2024-01-30' },
        { MONTH: '2023-12', AMOUNT: 444000, DATE_CREDITED: '2023-12-28' }
      ],
      
      // Source
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-28'
    },
    'RIM005678': {
      RIM: 'RIM005678',
      SALARY: 85000,
      ANNUAL_INC: 1020000,
      SEC_INC_AMT: 45000,
      SEC_INC_SOURCE: 'Rental Income',
      LAST_SAL_DA: '2024-02-25',
      LAST_SAL_AMT: 85000,
      LAST_MON_SALARY: 85000,
      AVG_LAST_3_SALARY: 84500,
      SALARY_VARIANCE_PCT: 0.6,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 85000, DATE_CREDITED: '2024-02-25' },
        { MONTH: '2024-01', AMOUNT: 84500, DATE_CREDITED: '2024-01-25' },
        { MONTH: '2023-12', AMOUNT: 84000, DATE_CREDITED: '2023-12-25' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-25'
    },
    'RIM009012': {
      RIM: 'RIM009012',
      SALARY: 35000,
      ANNUAL_INC: 420000,
      SEC_INC_AMT: 180000,
      SEC_INC_SOURCE: 'Trading Business',
      LAST_SAL_DA: '2024-02-15',
      LAST_SAL_AMT: 35000,
      LAST_MON_SALARY: 35000,
      AVG_LAST_3_SALARY: 35000,
      SALARY_VARIANCE_PCT: 0,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 35000, DATE_CREDITED: '2024-02-15' },
        { MONTH: '2024-01', AMOUNT: 35000, DATE_CREDITED: '2024-01-15' },
        { MONTH: '2023-12', AMOUNT: 35000, DATE_CREDITED: '2023-12-15' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM003456': {
      RIM: 'RIM003456',
      SALARY: 800000,
      ANNUAL_INC: 12000000,
      SEC_INC_AMT: 2500000,
      SEC_INC_SOURCE: 'Business Dividends',
      LAST_SAL_DA: '2024-02-28',
      LAST_SAL_AMT: 820000,
      LAST_MON_SALARY: 800000,
      AVG_LAST_3_SALARY: 805000,
      SALARY_VARIANCE_PCT: 1.9,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 820000, DATE_CREDITED: '2024-02-28' },
        { MONTH: '2024-01', AMOUNT: 800000, DATE_CREDITED: '2024-01-28' },
        { MONTH: '2023-12', AMOUNT: 795000, DATE_CREDITED: '2023-12-28' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-28'
    },
    'RIM007890': {
      RIM: 'RIM007890',
      SALARY: 65000,
      ANNUAL_INC: 780000,
      SEC_INC_AMT: 35000,
      SEC_INC_SOURCE: 'Part-time Consulting',
      LAST_SAL_DA: '2024-02-25',
      LAST_SAL_AMT: 65000,
      LAST_MON_SALARY: 65000,
      AVG_LAST_3_SALARY: 65000,
      SALARY_VARIANCE_PCT: 0,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 65000, DATE_CREDITED: '2024-02-25' },
        { MONTH: '2024-01', AMOUNT: 65000, DATE_CREDITED: '2024-01-25' },
        { MONTH: '2023-12', AMOUNT: 65000, DATE_CREDITED: '2023-12-25' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-25'
    },
    'RIM002345': {
      RIM: 'RIM002345',
      SALARY: 150000,
      ANNUAL_INC: 1800000,
      SEC_INC_AMT: 500000,
      SEC_INC_SOURCE: 'Real Estate Income',
      LAST_SAL_DA: '2024-02-20',
      LAST_SAL_AMT: 155000,
      LAST_MON_SALARY: 150000,
      AVG_LAST_3_SALARY: 152000,
      SALARY_VARIANCE_PCT: 2.0,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 155000, DATE_CREDITED: '2024-02-20' },
        { MONTH: '2024-01', AMOUNT: 152000, DATE_CREDITED: '2024-01-20' },
        { MONTH: '2023-12', AMOUNT: 149000, DATE_CREDITED: '2023-12-20' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-20'
    },
    'RIM006789': {
      RIM: 'RIM006789',
      SALARY: 45000,
      ANNUAL_INC: 540000,
      SEC_INC_AMT: 80000,
      SEC_INC_SOURCE: 'E-commerce Business',
      LAST_SAL_DA: '2024-02-28',
      LAST_SAL_AMT: 48000,
      LAST_MON_SALARY: 45000,
      AVG_LAST_3_SALARY: 46000,
      SALARY_VARIANCE_PCT: 4.3,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 48000, DATE_CREDITED: '2024-02-28' },
        { MONTH: '2024-01', AMOUNT: 46000, DATE_CREDITED: '2024-01-28' },
        { MONTH: '2023-12', AMOUNT: 44000, DATE_CREDITED: '2023-12-28' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-28'
    },
    'RIM008901': {
      RIM: 'RIM008901',
      SALARY: 120000,
      ANNUAL_INC: 1440000,
      SEC_INC_AMT: 300000,
      SEC_INC_SOURCE: 'Pension & Investments',
      LAST_SAL_DA: '2024-02-15',
      LAST_SAL_AMT: 120000,
      LAST_MON_SALARY: 120000,
      AVG_LAST_3_SALARY: 120000,
      SALARY_VARIANCE_PCT: 0,
      SALARY_HISTORY: [
        { MONTH: '2024-02', AMOUNT: 120000, DATE_CREDITED: '2024-02-15' },
        { MONTH: '2024-01', AMOUNT: 120000, DATE_CREDITED: '2024-01-15' },
        { MONTH: '2023-12', AMOUNT: 120000, DATE_CREDITED: '2023-12-15' }
      ],
      DATA_SOURCE: 'ETL/SnapView',
      LAST_UPDATE: '2024-02-15'
    }
  },

  // =====================================================
  // EXPECTED ACTIVITY PROFILE (ETL Fields)
  // =====================================================
  
  expectedActivityProfiles: {
    'RIM001234': {
      RIM: 'RIM001234',
      // Expected Monthly Activity (Exact ETL Field Names)
      LM_EXP_CASH: 100000,          // Expected Monthly Cash
      LM_EXP_NONCASH: 350000,       // Expected Monthly Non-Cash
      LM_EXP_TRFR: 500000,          // Expected Monthly Transfers
      
      // Detailed Breakdown
      EXP_INWARD_CASH: 60000,
      EXP_OUTWARD_CASH: 40000,
      EXP_DOMESTIC_TRFR: 300000,
      EXP_INTL_TRFR: 200000,
      
      // Annual Expected
      ANNUAL_EXP_TURNOVER: 11400000,
      
      // Activity Justification
      ACTIVITY_PURPOSE: 'Business operations, personal investments, family support',
      EXPECTED_COUNTRIES: ['QA', 'AE', 'GB', 'US'],
      
      // Comparison with Actual
      ACTUAL_VS_EXPECTED_RATIO: 1.15,
      DEVIATION_FLAG: false,
      
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM005678': {
      RIM: 'RIM005678',
      LM_EXP_CASH: 20000,
      LM_EXP_NONCASH: 65000,
      LM_EXP_TRFR: 80000,
      EXP_INWARD_CASH: 5000,
      EXP_OUTWARD_CASH: 15000,
      EXP_DOMESTIC_TRFR: 60000,
      EXP_INTL_TRFR: 20000,
      ANNUAL_EXP_TURNOVER: 1980000,
      ACTIVITY_PURPOSE: 'Salary deposits, bill payments, investment purchases',
      EXPECTED_COUNTRIES: ['QA', 'AE'],
      ACTUAL_VS_EXPECTED_RATIO: 0.95,
      DEVIATION_FLAG: false,
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM009012': {
      RIM: 'RIM009012',
      LM_EXP_CASH: 80000,
      LM_EXP_NONCASH: 50000,
      LM_EXP_TRFR: 120000,
      EXP_INWARD_CASH: 50000,
      EXP_OUTWARD_CASH: 30000,
      EXP_DOMESTIC_TRFR: 40000,
      EXP_INTL_TRFR: 80000,
      ANNUAL_EXP_TURNOVER: 3000000,
      ACTIVITY_PURPOSE: 'Import/export trading, business settlements',
      EXPECTED_COUNTRIES: ['QA', 'IR', 'TR', 'AE', 'CN'],
      ACTUAL_VS_EXPECTED_RATIO: 2.10,
      DEVIATION_FLAG: true,
      DEVIATION_REASON: 'Activity exceeds expected by 110%',
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM003456': {
      RIM: 'RIM003456',
      LM_EXP_CASH: 150000,
      LM_EXP_NONCASH: 500000,
      LM_EXP_TRFR: 1200000,
      EXP_INWARD_CASH: 50000,
      EXP_OUTWARD_CASH: 100000,
      EXP_DOMESTIC_TRFR: 800000,
      EXP_INTL_TRFR: 400000,
      ANNUAL_EXP_TURNOVER: 22200000,
      ACTIVITY_PURPOSE: 'Business conglomerate operations, investments, philanthropy',
      EXPECTED_COUNTRIES: ['QA', 'AE', 'SA', 'GB', 'US', 'CH'],
      ACTUAL_VS_EXPECTED_RATIO: 1.05,
      DEVIATION_FLAG: false,
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM007890': {
      RIM: 'RIM007890',
      LM_EXP_CASH: 15000,
      LM_EXP_NONCASH: 50000,
      LM_EXP_TRFR: 30000,
      EXP_INWARD_CASH: 5000,
      EXP_OUTWARD_CASH: 10000,
      EXP_DOMESTIC_TRFR: 25000,
      EXP_INTL_TRFR: 5000,
      ANNUAL_EXP_TURNOVER: 1140000,
      ACTIVITY_PURPOSE: 'Salary, medical expenses, household',
      EXPECTED_COUNTRIES: ['QA'],
      ACTUAL_VS_EXPECTED_RATIO: 0.88,
      DEVIATION_FLAG: false,
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM002345': {
      RIM: 'RIM002345',
      LM_EXP_CASH: 50000,
      LM_EXP_NONCASH: 100000,
      LM_EXP_TRFR: 250000,
      EXP_INWARD_CASH: 20000,
      EXP_OUTWARD_CASH: 30000,
      EXP_DOMESTIC_TRFR: 50000,
      EXP_INTL_TRFR: 200000,
      ANNUAL_EXP_TURNOVER: 4800000,
      ACTIVITY_PURPOSE: 'Real estate business, property investments',
      EXPECTED_COUNTRIES: ['QA', 'AE', 'GB'],
      ACTUAL_VS_EXPECTED_RATIO: 1.35,
      DEVIATION_FLAG: true,
      DEVIATION_REASON: 'Activity exceeds expected by 35%',
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM006789': {
      RIM: 'RIM006789',
      LM_EXP_CASH: 40000,
      LM_EXP_NONCASH: 30000,
      LM_EXP_TRFR: 50000,
      EXP_INWARD_CASH: 25000,
      EXP_OUTWARD_CASH: 15000,
      EXP_DOMESTIC_TRFR: 30000,
      EXP_INTL_TRFR: 20000,
      ANNUAL_EXP_TURNOVER: 1440000,
      ACTIVITY_PURPOSE: 'E-commerce business, personal expenses',
      EXPECTED_COUNTRIES: ['QA', 'AE', 'CN'],
      ACTUAL_VS_EXPECTED_RATIO: 1.85,
      DEVIATION_FLAG: true,
      DEVIATION_REASON: 'Cash activity unusually high',
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    },
    'RIM008901': {
      RIM: 'RIM008901',
      LM_EXP_CASH: 30000,
      LM_EXP_NONCASH: 80000,
      LM_EXP_TRFR: 60000,
      EXP_INWARD_CASH: 10000,
      EXP_OUTWARD_CASH: 20000,
      EXP_DOMESTIC_TRFR: 45000,
      EXP_INTL_TRFR: 15000,
      ANNUAL_EXP_TURNOVER: 2040000,
      ACTIVITY_PURPOSE: 'Retirement funds, family support, investments',
      EXPECTED_COUNTRIES: ['QA', 'AE', 'EG'],
      ACTUAL_VS_EXPECTED_RATIO: 0.92,
      DEVIATION_FLAG: false,
      DATA_SOURCE: 'Risk Dataset',
      LAST_UPDATE: '2024-02-15'
    }
  },

  // =====================================================
  // OFFICER DIGITAL CONFIRMATION (PIN System)
  // =====================================================
  
  officerPINs: {
    // Encrypted PINs (in real system, this would be hashed)
    'EMP001': { pin: '1234', created: '2024-01-15', lastUsed: '2024-02-28' },
    'EMP002': { pin: '5678', created: '2024-01-10', lastUsed: '2024-02-27' },
    'EMP003': { pin: '9012', created: '2024-01-05', lastUsed: '2024-02-28' },
    'EMP004': { pin: '3456', created: '2024-01-20', lastUsed: '2024-02-26' },
    'EMP005': { pin: '7890', created: '2024-01-12', lastUsed: '2024-02-25' }
  },

  confirmationChecklist: [
    { id: 'identity', label: 'Identity Verified', labelAr: 'تم التحقق من الهوية', required: true },
    { id: 'salary', label: 'Salary Verified', labelAr: 'تم التحقق من الراتب', required: true },
    { id: 'expected_activity', label: 'Expected Activity Verified', labelAr: 'تم التحقق من النشاط المتوقع', required: true },
    { id: 'joint_exposure', label: 'Joint Exposure Verified', labelAr: 'تم التحقق من التعرض المشترك', required: true },
    { id: 'documents', label: 'Documents Complete', labelAr: 'المستندات مكتملة', required: true },
    { id: 'source_of_wealth', label: 'Source of Wealth Assessed', labelAr: 'تم تقييم مصدر الثروة', required: false },
    { id: 'pep_review', label: 'PEP Status Reviewed', labelAr: 'تمت مراجعة حالة PEP', required: false }
  ],

  // Verify PIN
  verifyPIN: function(employeeId, pin) {
    const stored = this.officerPINs[employeeId];
    if (!stored) return { valid: false, error: 'PIN not set. Please create your PIN.' };
    if (stored.pin !== pin) return { valid: false, error: 'Invalid PIN' };
    stored.lastUsed = new Date().toISOString().split('T')[0];
    return { valid: true };
  },

  // Create/Reset PIN
  createPIN: function(employeeId, newPIN, confirmPIN) {
    if (newPIN !== confirmPIN) return { success: false, error: 'PINs do not match' };
    if (!/^\d{4}$/.test(newPIN)) return { success: false, error: 'PIN must be 4 digits' };
    
    this.officerPINs[employeeId] = {
      pin: newPIN,
      created: new Date().toISOString().split('T')[0],
      lastUsed: null
    };
    return { success: true };
  },

  // =====================================================
  // CALL CENTER VIEW DATA
  // =====================================================
  
  getCallCenterView: function(rim) {
    const customer = EDDMockData.getCustomerByRIM(rim);
    const financial = this.financialProfiles[rim];
    const activity = this.expectedActivityProfiles[rim];
    const accounts = EDDMockData.accounts?.filter(a => a.rim === rim) || [];
    
    if (!customer) return null;

    // Call Center sees LIMITED information only
    return {
      // Basic Info (Visible)
      customerName: customer.name,
      customerNameAr: customer.nameAr,
      nationality: customer.nationality,
      segment: customer.segment,
      
      // Financial (Visible)
      salary: financial?.SALARY || 'N/A',
      lastSalary: financial?.LAST_SAL_AMT || 'N/A',
      lastSalaryDate: financial?.LAST_SAL_DA || 'N/A',
      
      // Expected Activity (Visible)
      expectedCash: activity?.LM_EXP_CASH || 'N/A',
      expectedNonCash: activity?.LM_EXP_NONCASH || 'N/A',
      expectedTransfer: activity?.LM_EXP_TRFR || 'N/A',
      
      // Account Status (Visible)
      accountsCount: accounts.length,
      activeAccounts: accounts.filter(a => a.status === 'Active').length,
      
      // HIDDEN from Call Center
      riskScore: '*** RESTRICTED ***',
      amlFlags: '*** RESTRICTED ***',
      complianceNotes: '*** RESTRICTED ***',
      eddStatus: '*** RESTRICTED ***'
    };
  },

  // =====================================================
  // USER GUIDE MODULE
  // =====================================================
  
  userGuides: [
    {
      id: 'UG001',
      title: 'EDD Case Processing Guide',
      titleAr: 'دليل معالجة حالات EDD',
      department: 'CDD Operations',
      createdBy: 'MGR-006', // Ghaleb Essam - CDD/EDD Manager
      approvedBy: 'COMP-001', // Compliance approval
      version: '2.1',
      lastUpdated: '2024-02-01',
      status: 'Published',
      sections: [
        { title: 'Introduction', content: 'This guide covers the end-to-end process for handling Enhanced Due Diligence (EDD) cases at QIB.' },
        { title: 'When is EDD Required?', content: 'EDD is triggered for: High-risk customers, PEPs, Non-residents, High-risk countries, Complex structures, Large transactions.' },
        { title: 'Business Review Stage', content: 'Business teams must verify all customer information, assess relationship purpose, and provide initial recommendation.' },
        { title: 'CDD Review Stage', content: 'CDD team performs detailed documentation review, source verification, and risk assessment.' },
        { title: 'Compliance Escalation', content: 'Cases flagged for suspicion or high-risk must be escalated to Compliance for final review.' }
      ]
    },
    {
      id: 'UG002',
      title: 'Risk Classification Model',
      titleAr: 'نموذج تصنيف المخاطر',
      department: 'Risk Management',
      createdBy: 'RISK-001',
      approvedBy: 'COMP-001',
      version: '1.5',
      lastUpdated: '2024-01-15',
      status: 'Published',
      sections: [
        { title: 'Overview', content: 'QIB uses a comprehensive risk scoring model based on ETL data from T24 and external sources.' },
        { title: 'Risk Components', content: 'PROD_RISK, ACT_RISK, OCCP_RISK, COUNTRY_RISK combine to form FINAL_RISK_SCORE.' },
        { title: 'AUTO HIGH Triggers', content: 'Certain conditions automatically classify customers as HIGH risk regardless of score.' },
        { title: 'Score Interpretation', content: 'LOW: 0-150, MEDIUM: 151-300, HIGH: 301-400, AUTO HIGH: >400 or trigger present.' }
      ]
    },
    {
      id: 'UG003',
      title: 'Call Center Customer Inquiry',
      titleAr: 'استفسارات العملاء - مركز الاتصال',
      department: 'Call Center',
      createdBy: 'CC-001',
      approvedBy: 'COMP-001',
      version: '1.0',
      lastUpdated: '2024-01-20',
      status: 'Published',
      sections: [
        { title: 'Access Permissions', content: 'Call Center staff have read-only access to basic customer information.' },
        { title: 'What You Can See', content: 'Customer name, salary, expected activity, account status.' },
        { title: 'What You Cannot See', content: 'Risk scores, AML flags, compliance notes, investigation status.' },
        { title: 'Escalation Process', content: 'For sensitive inquiries, escalate to supervisor. Never disclose risk information.' }
      ]
    }
  ],

  // =====================================================
  // SYSTEM PRESENTATIONS - GROUP-SPECIFIC + COMPREHENSIVE
  // =====================================================
  
  presentations: {
    // ========== COMPREHENSIVE PRESENTATION ==========
    comprehensive: {
      id: 'comprehensive',
      title: 'QIB EDD Case Management System',
      titleAr: 'نظام إدارة حالات التحقق المعزز - QIB',
      subtitle: 'Enterprise Platform - Complete Overview',
      icon: '🏛️',
      color: '#00D4FF',
      description: 'Full system overview for all departments',
      descriptionAr: 'نظرة شاملة للنظام لجميع الإدارات',
      slides: [
        {
          id: 1,
          title: 'Platform Overview',
          titleAr: 'نظرة عامة على المنصة',
          content: `
            <h3>QIB EDD Case Management System</h3>
            <p>Enterprise-grade platform for managing Enhanced Due Diligence cases, ensuring regulatory compliance with QCB AML Guidelines and FATF Recommendations.</p>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">📊</div>
                <div style="font-weight: 600; color: #00D4FF;">50+ BRD Sections</div>
                <div style="font-size: 12px; color: #888;">5,700+ Lines</div>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">🔗</div>
                <div style="font-weight: 600; color: #9C27B0;">10+ Integrations</div>
                <div style="font-size: 12px; color: #888;">T24, CRP, QCB API</div>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
                <div style="font-weight: 600; color: #4CAF50;">Maker/Checker</div>
                <div style="font-size: 12px; color: #888;">Four-Eyes Principle</div>
              </div>
            </div>
            <h3>Key Capabilities</h3>
            <ul>
              <li>Automated case creation from T24/CRP risk triggers</li>
              <li>Risk-based workflow routing (40+ trigger categories)</li>
              <li>Customer Identity Re-Verification (Selfie/Video/Branch)</li>
              <li>KYC Data Correction with verification</li>
              <li>Complete audit trail for regulatory reporting</li>
            </ul>
          `
        },
        {
          id: 2,
          title: 'Architecture Overview',
          titleAr: 'نظرة عامة على البنية',
          content: `
            <h3>Enterprise Integration Architecture</h3>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; font-family: monospace; font-size: 13px;">
<pre style="color: #00D4FF; margin: 0;">
┌─────────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │  Dashboard  │ │  EDD Case   │ │  CDD View   │ │ Compliance│ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     BUSINESS LOGIC LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │   WORKFLOW  │ │ RISK ENGINE │ │ NOTIFICATION│ │   AUDIT   │ │
│  │    (FLOW)   │ │    (CRP)    │ │   GATEWAY   │ │   TRAIL   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                     INTEGRATION LAYER (ESB)                     │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────┐ │
│  │   T24   │ │ QCB API │ │   DMS   │ │   ETL   │ │  HR/LDAP  │ │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
</pre>
            </div>
            <table class="presentation-table">
              <tr><th>System</th><th>Data</th><th>Integration</th></tr>
              <tr><td>T24 Core</td><td>Customer, Accounts, KYC</td><td>Real-time SOAP/REST</td></tr>
              <tr><td>QCB API</td><td>Identity, Employment</td><td>REST with consent</td></tr>
              <tr><td>CRP Engine</td><td>Risk Scores</td><td>Real-time trigger</td></tr>
              <tr><td>DMS/FileNet</td><td>Documents</td><td>On-demand API</td></tr>
            </table>
          `
        },
        {
          id: 3,
          title: 'Complete Workflow',
          titleAr: 'سير العمل الكامل',
          content: `
            <h3>End-to-End Case Lifecycle</h3>
            <div class="workflow-diagram">
              <div class="workflow-node" style="background: rgba(255,152,0,0.1); border-color: rgba(255,152,0,0.5);">📥 CRP Trigger / T24 Alert</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">🏦 Business Maker (Review + Contact Customer)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">✅ Business Checker (Approve Recommendation)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">📋 CDD Maker (Full Due Diligence)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">✅ CDD Checker (Final Approval)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node conditional">⚠️ Compliance Review (if High Risk/PEP)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">📤 T24 Update (EDD Status + Next Review)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">✔️ Case Closed + Archived</div>
            </div>
            <p style="text-align: center; margin-top: 20px; color: #888;">SLA: 3 Business Days Total</p>
          `
        },
        {
          id: 4,
          title: 'Department Structure',
          titleAr: 'هيكل الإدارات',
          content: `
            <h3>Organizational Hierarchy</h3>
            <table class="presentation-table">
              <tr><th>Department</th><th>Teams</th><th>Role in EDD</th></tr>
              <tr><td><strong>Business</strong></td><td>Mass, Tamayuz, Private</td><td>Initial review, customer contact, recommendation</td></tr>
              <tr><td><strong>CDD Operations</strong></td><td>CDD Team</td><td>Full due diligence, risk assessment, T24 sync</td></tr>
              <tr><td><strong>Compliance</strong></td><td>Officer + Checker</td><td>High-risk review, PEP decisions, regulatory reporting</td></tr>
              <tr><td><strong>Operations</strong></td><td>Execution Team</td><td>Account restrictions, closures, execution</td></tr>
            </table>
            <h3>Hierarchical Dashboard Structure</h3>
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
<pre style="color: #4CAF50; margin: 0;">
Retail Banking Group
├── Mass Banking Dashboard     (5 Cases)
├── Tamayuz Banking Dashboard  (4 Cases)
└── Private Banking Dashboard  (3 Cases)
</pre>
            </div>
          `
        },
        {
          id: 5,
          title: 'Identity Verification',
          titleAr: 'التحقق من الهوية',
          content: `
            <h3>Customer Re-Verification Methods</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">📷</div>
                <div style="font-weight: 600; color: #00D4FF;">Live Selfie</div>
                <div style="font-size: 12px; color: #888; margin-top: 8px;">Mobile App / QIB Lite</div>
                <ul style="text-align: left; font-size: 11px; margin-top: 10px;">
                  <li>Liveness detection</li>
                  <li>Anti-spoofing</li>
                  <li>Face matching</li>
                </ul>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">🎥</div>
                <div style="font-weight: 600; color: #9C27B0;">Video KYC</div>
                <div style="font-size: 12px; color: #888; margin-top: 8px;">Video Call with Staff</div>
                <ul style="text-align: left; font-size: 11px; margin-top: 10px;">
                  <li>Employee verification</li>
                  <li>Session recording</li>
                  <li>ID capture</li>
                </ul>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 20px; border-radius: 12px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 10px;">🏦</div>
                <div style="font-weight: 600; color: #4CAF50;">Branch Visit</div>
                <div style="font-size: 12px; color: #888; margin-top: 8px;">Physical Verification</div>
                <ul style="text-align: left; font-size: 11px; margin-top: 10px;">
                  <li>In-person ID check</li>
                  <li>Photo capture</li>
                  <li>Biometric update</li>
                </ul>
              </div>
            </div>
            <h3>SLA Timeline</h3>
            <p>Day 7: Reminder → Day 14: Final Notice → Day 21: Account Restriction</p>
          `
        },
        {
          id: 6,
          title: 'Risk Intelligence',
          titleAr: 'ذكاء المخاطر',
          content: `
            <h3>Key Risk Indicators (KRI)</h3>
            <table class="presentation-table">
              <tr><th>Category</th><th>Examples</th><th>Weight</th></tr>
              <tr><td>Nationality Risk</td><td>High-risk country, Sanctioned, Tax haven</td><td>High</td></tr>
              <tr><td>Occupation Risk</td><td>PEP, Cash business, Money service</td><td>High</td></tr>
              <tr><td>Transaction Risk</td><td>Large cash, Unusual patterns</td><td>Medium</td></tr>
              <tr><td>AML Alert</td><td>Sanctions hit, Negative news</td><td>Critical</td></tr>
              <tr><td>KYC Gap</td><td>Missing/Expired documents</td><td>Medium</td></tr>
            </table>
            <h3>Risk Intelligence Dashboard</h3>
            <ul>
              <li>Top 10 high-risk trigger reasons</li>
              <li>Nationality pattern analysis</li>
              <li>Occupation risk concentration</li>
              <li>QCB regulatory alignment metrics</li>
            </ul>
          `
        },
        {
          id: 7,
          title: 'Governance & Compliance',
          titleAr: 'الحوكمة والامتثال',
          content: `
            <h3>Four-Eyes Principle</h3>
            <p>All decisions require Maker + Checker approval to ensure independent review.</p>
            <h3>Compliance Escalation</h3>
            <div class="workflow-diagram" style="font-size: 12px;">
              <div class="workflow-node">Business / CDD Escalation</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Compliance Officer Review</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Compliance Checker Validation</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">Decision Returned to Business</div>
            </div>
            <h3>Audit Trail</h3>
            <ul>
              <li>User identity (Name + Employee ID)</li>
              <li>Timestamp for every action</li>
              <li>Decision justification</li>
              <li>10-year retention policy</li>
            </ul>
          `
        },
        {
          id: 8,
          title: 'RBAC & Visibility',
          titleAr: 'صلاحيات الوصول',
          content: `
            <h3>Role-Based Access Control</h3>
            <table class="presentation-table">
              <tr><th>Role</th><th>Visibility</th><th>Actions</th></tr>
              <tr><td>Business Maker</td><td>Own + Assigned cases</td><td>Review, Contact, Recommend</td></tr>
              <tr><td>Business Checker</td><td>Pending approval cases</td><td>Approve, Reject, Return</td></tr>
              <tr><td>CDD Team</td><td>CDD assigned cases</td><td>Full review, Risk assess</td></tr>
              <tr><td>Compliance</td><td>Escalated cases only</td><td>Decision, Restriction</td></tr>
              <tr><td>Supervisor</td><td>All department cases</td><td>Assign, Monitor SLA</td></tr>
            </table>
            <h3>Supervisor Capabilities</h3>
            <ul>
              <li>View all cases in department</li>
              <li>Reassign cases between employees</li>
              <li>Monitor SLA performance</li>
              <li>Delegation management</li>
            </ul>
          `
        },
        {
          id: 9,
          title: 'Data Governance',
          titleAr: 'حوكمة البيانات',
          content: `
            <h3>Data Classification</h3>
            <table class="presentation-table">
              <tr><th>Level</th><th>Examples</th><th>Protection</th></tr>
              <tr><td style="color: #F44336;">Highly Restricted</td><td>Risk scores, PEP status</td><td>Encrypted + Role-based</td></tr>
              <tr><td style="color: #FF9800;">Restricted</td><td>QID, Financial data</td><td>Encrypted</td></tr>
              <tr><td style="color: #4CAF50;">Confidential</td><td>Customer name, RIM</td><td>Need-to-know</td></tr>
            </table>
            <h3>Retention Policy</h3>
            <div style="display: flex; gap: 20px; margin-top: 15px;">
              <div style="flex: 1; background: rgba(0,212,255,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #00D4FF;">7 Years</div>
                <div style="font-size: 12px; color: #888;">EDD Cases</div>
              </div>
              <div style="flex: 1; background: rgba(156,39,176,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #9C27B0;">10 Years</div>
                <div style="font-size: 12px; color: #888;">KYC Documents</div>
              </div>
              <div style="flex: 1; background: rgba(76,175,80,0.1); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">10 Years</div>
                <div style="font-size: 12px; color: #888;">Audit Logs</div>
              </div>
            </div>
          `
        },
        {
          id: 10,
          title: 'Contact & Support',
          titleAr: 'الاتصال والدعم',
          content: `
            <h3>System Support</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #00D4FF; margin-bottom: 10px;">🛠️ IT Service Desk</div>
                <p>Extension: 5000</p>
                <p>Email: edd.support@qib.com.qa</p>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #9C27B0; margin-bottom: 10px;">📋 CDD Operations</div>
                <p>Extension: 4100</p>
                <p>Manager: Ghaleb Essam</p>
              </div>
              <div style="background: rgba(255,152,0,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #FF9800; margin-bottom: 10px;">⚖️ Compliance</div>
                <p>Extension: 4200</p>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #4CAF50; margin-bottom: 10px;">👤 Operations Head</div>
                <p>Sayed ElMahdy</p>
                <p>Head of Retail & Shared Services Operations</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(0,212,255,0.05); border-radius: 12px;">
              <p style="color: #00D4FF; font-weight: 600;">Developed by Operations Division</p>
              <p style="color: #888; font-size: 12px;">BRD: 50 Sections | 5,700+ Lines | Enterprise-Grade</p>
            </div>
          `
        }
      ]
    },

    // ========== BUSINESS GROUP PRESENTATION ==========
    business: {
      id: 'business',
      title: 'Business Team Training',
      titleAr: 'تدريب فريق البزنس',
      subtitle: 'Mass | Tamayuz | Private Banking',
      icon: '🏦',
      color: '#4CAF50',
      description: 'For Business Makers and Checkers',
      descriptionAr: 'للمُنشئين والمُدققين في البزنس',
      slides: [
        {
          id: 1,
          title: 'Your Role in EDD',
          titleAr: 'دورك في EDD',
          content: `
            <h3>Business Team Responsibilities</h3>
            <p>As a Business team member, you are the <strong>first line of defense</strong> in the EDD process.</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(76,175,80,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">👤</div>
                <div style="font-weight: 600; color: #4CAF50;">Business Maker</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Review case details</li>
                  <li>Contact customer</li>
                  <li>Collect documents</li>
                  <li>Make recommendation</li>
                </ul>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                <div style="font-weight: 600; color: #00D4FF;">Business Checker</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Review maker's work</li>
                  <li>Validate documents</li>
                  <li>Approve or return</li>
                  <li>Forward to CDD</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          id: 2,
          title: 'Case Review Process',
          titleAr: 'عملية مراجعة الحالة',
          content: `
            <h3>Step-by-Step Case Review</h3>
            <div class="workflow-diagram">
              <div class="workflow-node">1️⃣ Open Case from Dashboard</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">2️⃣ Review Customer Profile (T24 Data)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">3️⃣ Check Risk Triggers (Why EDD?)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">4️⃣ Review Financial Profile</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">5️⃣ Contact Customer (if needed)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">6️⃣ Submit Recommendation</div>
            </div>
          `
        },
        {
          id: 3,
          title: 'Resolution Options',
          titleAr: 'خيارات الحل',
          content: `
            <h3>What Can You Do With a Case?</h3>
            <table class="presentation-table">
              <tr><th>Option</th><th>When to Use</th></tr>
              <tr><td style="color: #4CAF50;"><strong>Accept Current KYC</strong></td><td>Risk is only due to nationality/occupation - No additional docs needed</td></tr>
              <tr><td style="color: #00D4FF;"><strong>Request Documents</strong></td><td>Need source of funds, income proof, or other documents</td></tr>
              <tr><td style="color: #9C27B0;"><strong>Correct Customer Data</strong></td><td>Wrong occupation, salary, or employer (requires verification)</td></tr>
              <tr><td style="color: #FF9800;"><strong>Identity Verification</strong></td><td>Customer identity needs confirmation (Selfie/Video/Branch)</td></tr>
              <tr><td style="color: #F44336;"><strong>Escalate to Compliance</strong></td><td>PEP, sanctions, or complex high-risk cases</td></tr>
            </table>
            <div style="background: rgba(76,175,80,0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #4CAF50;"><strong>💡 Important:</strong> Not every EDD case requires additional documents!</p>
            </div>
          `
        },
        {
          id: 4,
          title: 'Customer Contact',
          titleAr: 'التواصل مع العميل',
          content: `
            <h3>How to Contact Customers</h3>
            <p>Use the <strong>Notification Center</strong> to track all customer communications.</p>
            <h3>Communication Channels</h3>
            <table class="presentation-table">
              <tr><th>Channel</th><th>Use For</th></tr>
              <tr><td>📱 SMS</td><td>Quick reminders, document requests</td></tr>
              <tr><td>📧 Email</td><td>Detailed requests, document links</td></tr>
              <tr><td>📞 Phone Call</td><td>Complex cases, urgent matters</td></tr>
              <tr><td>🔔 Push Notification</td><td>App users - instant alerts</td></tr>
            </table>
            <h3>SLA for Customer Response</h3>
            <ul>
              <li><strong>Day 7:</strong> First reminder sent</li>
              <li><strong>Day 14:</strong> Final notice sent</li>
              <li><strong>Day 21:</strong> Case escalated for account restriction</li>
            </ul>
          `
        },
        {
          id: 5,
          title: 'Document Collection',
          titleAr: 'جمع المستندات',
          content: `
            <h3>Required Documents by Risk Type</h3>
            <table class="presentation-table">
              <tr><th>Risk Type</th><th>Documents Needed</th></tr>
              <tr><td>High Income</td><td>Salary certificate, Bank statements</td></tr>
              <tr><td>Cash Business</td><td>Trade license, Source of funds, Invoices</td></tr>
              <tr><td>Property/Investment</td><td>Ownership deeds, Investment statements</td></tr>
              <tr><td>Inheritance</td><td>Court documents, Death certificate</td></tr>
              <tr><td>Foreign Income</td><td>Tax returns, Employment contracts</td></tr>
            </table>
            <h3>Document Upload</h3>
            <p>Use the <strong>Document Viewer</strong> to upload and manage customer documents.</p>
            <p>All documents are stored in DMS (FileNet) with audit trail.</p>
          `
        },
        {
          id: 6,
          title: 'KYC Data Correction',
          titleAr: 'تصحيح بيانات KYC',
          content: `
            <h3>When to Correct Data</h3>
            <p>If customer data in T24 is incorrect, you can request a correction.</p>
            <h3>Fields You Can Correct</h3>
            <ul>
              <li>Occupation / Job Title</li>
              <li>Salary / Monthly Income</li>
              <li>Employer Name</li>
              <li>Source of Income</li>
              <li>Expected Monthly Activity</li>
            </ul>
            <h3>Correction Process</h3>
            <div class="workflow-diagram" style="font-size: 12px;">
              <div class="workflow-node">Select Field to Correct</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Enter New Value + Verification Source</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Business Checker Approval</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">T24 Updated Automatically</div>
            </div>
          `
        },
        {
          id: 7,
          title: 'Maker Confirmation',
          titleAr: 'تأكيد المُنشئ',
          content: `
            <h3>Before Submitting a Case</h3>
            <p>Every submission requires your digital confirmation with:</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
              <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                <div style="color: #00D4FF;">👤 Your Identity</div>
                <ul style="font-size: 12px; margin-top: 8px;">
                  <li>Name (Arabic + English)</li>
                  <li>Employee ID</li>
                  <li>Department</li>
                  <li>Profile Photo</li>
                </ul>
              </div>
              <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 8px;">
                <div style="color: #4CAF50;">✅ Checklist</div>
                <ul style="font-size: 12px; margin-top: 8px;">
                  <li>Identity verified</li>
                  <li>Income verified</li>
                  <li>Risk reviewed</li>
                  <li>Documents complete</li>
                </ul>
              </div>
            </div>
            <p style="color: #FF9800;"><strong>🔐 4-Digit PIN Required</strong> for final submission</p>
          `
        },
        {
          id: 8,
          title: 'Your Dashboard',
          titleAr: 'لوحة التحكم الخاصة بك',
          content: `
            <h3>Understanding Your Dashboard</h3>
            <p>You see only cases assigned to you or your sector.</p>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 14px; color: #888; margin-bottom: 15px;">MY CASES</div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center;">
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #00D4FF;">3</div>
                  <div style="font-size: 11px; color: #888;">Pending Review</div>
                </div>
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #4CAF50;">2</div>
                  <div style="font-size: 11px; color: #888;">In Progress</div>
                </div>
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #F44336;">1</div>
                  <div style="font-size: 11px; color: #888;">Overdue</div>
                </div>
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #9C27B0;">8</div>
                  <div style="font-size: 11px; color: #888;">Completed</div>
                </div>
              </div>
            </div>
            <h3>Sector Dashboards</h3>
            <p>Mass | Tamayuz | Private - Each has its own view</p>
          `
        },
        {
          id: 9,
          title: 'Common Questions',
          titleAr: 'أسئلة شائعة',
          content: `
            <h3>Frequently Asked Questions</h3>
            <div style="margin: 20px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <strong style="color: #00D4FF;">Q: Do I need documents for every case?</strong>
                <p style="margin: 8px 0 0 0; font-size: 13px;">No. If risk is only due to nationality/occupation, you can close with justification.</p>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <strong style="color: #4CAF50;">Q: What if customer doesn't respond?</strong>
                <p style="margin: 8px 0 0 0; font-size: 13px;">System sends automatic reminders. After Day 21, escalate for account restriction.</p>
              </div>
              <div style="background: rgba(255,152,0,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <strong style="color: #FF9800;">Q: When should I escalate to Compliance?</strong>
                <p style="margin: 8px 0 0 0; font-size: 13px;">PEP customers, sanctions hits, or any case you're unsure about.</p>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 15px; border-radius: 8px;">
                <strong style="color: #9C27B0;">Q: Can I see other sectors' cases?</strong>
                <p style="margin: 8px 0 0 0; font-size: 13px;">No. You only see your assigned sector (Mass/Tamayuz/Private).</p>
              </div>
            </div>
          `
        },
        {
          id: 10,
          title: 'Support Contacts',
          titleAr: 'جهات الدعم',
          content: `
            <h3>Need Help?</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">🛠️</div>
                <div style="font-weight: 600; color: #00D4FF;">Technical Issues</div>
                <p style="font-size: 13px;">IT Service Desk: ext. 5000</p>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">📋</div>
                <div style="font-weight: 600; color: #4CAF50;">Process Questions</div>
                <p style="font-size: 13px;">CDD Operations: ext. 4100</p>
              </div>
              <div style="background: rgba(255,152,0,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">⚖️</div>
                <div style="font-weight: 600; color: #FF9800;">Compliance Queries</div>
                <p style="font-size: 13px;">Compliance Team: ext. 4200</p>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">👤</div>
                <div style="font-weight: 600; color: #9C27B0;">Your Manager</div>
                <p style="font-size: 13px;">For case assignment help</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #4CAF50;">
              <strong>You're ready to handle EDD cases!</strong>
            </div>
          `
        }
      ]
    },

    // ========== CDD TEAM PRESENTATION ==========
    cdd: {
      id: 'cdd',
      title: 'CDD Operations Training',
      titleAr: 'تدريب عمليات CDD',
      subtitle: 'Customer Due Diligence Team',
      icon: '📋',
      color: '#9C27B0',
      description: 'For CDD Makers and Checkers',
      descriptionAr: 'لفريق CDD - المُنشئين والمُدققين',
      slides: [
        {
          id: 1,
          title: 'CDD Role Overview',
          titleAr: 'نظرة عامة على دور CDD',
          content: `
            <h3>Customer Due Diligence Operations</h3>
            <p>CDD is the <strong>central review team</strong> responsible for comprehensive due diligence.</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">📋</div>
                <div style="font-weight: 600; color: #9C27B0;">CDD Maker</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Full case review</li>
                  <li>Risk assessment</li>
                  <li>Document verification</li>
                  <li>T24 data validation</li>
                </ul>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                <div style="font-weight: 600; color: #00D4FF;">CDD Checker</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Quality assurance</li>
                  <li>Final approval</li>
                  <li>T24 synchronization</li>
                  <li>Compliance escalation</li>
                </ul>
              </div>
            </div>
            <p style="text-align: center; color: #888;">Manager: Ghaleb Essam</p>
          `
        },
        {
          id: 2,
          title: 'Case Flow to CDD',
          titleAr: 'تدفق الحالات إلى CDD',
          content: `
            <h3>When Cases Come to CDD</h3>
            <div class="workflow-diagram">
              <div class="workflow-node" style="background: rgba(76,175,80,0.1); border-color: #4CAF50;">Business Recommendation Approved</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node" style="background: rgba(156,39,176,0.1); border-color: #9C27B0;">📥 Case Arrives in CDD Queue</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">CDD Maker Assigned</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Full Due Diligence Review</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">CDD Checker Validation</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">T24 Updated / Case Closed</div>
            </div>
          `
        },
        {
          id: 3,
          title: 'Full Due Diligence',
          titleAr: 'التحقق الكامل',
          content: `
            <h3>CDD Review Checklist</h3>
            <table class="presentation-table">
              <tr><th>Area</th><th>What to Review</th></tr>
              <tr><td>Customer Profile</td><td>Name, QID, DOB, Nationality, Residency</td></tr>
              <tr><td>Risk Classification</td><td>CRP score, Risk triggers, PEP status</td></tr>
              <tr><td>Financial Profile</td><td>Income, Assets, Expected activity</td></tr>
              <tr><td>Transaction History</td><td>Unusual patterns, Large transactions</td></tr>
              <tr><td>Documents</td><td>Completeness, Authenticity, Currency</td></tr>
              <tr><td>Business Decision</td><td>Recommendation validity, Justification</td></tr>
            </table>
            <h3>Key Questions to Answer</h3>
            <ul>
              <li>Is the customer's economic activity consistent with their profile?</li>
              <li>Are there any unexplained wealth or income sources?</li>
              <li>Do transactions match expected activity?</li>
            </ul>
          `
        },
        {
          id: 4,
          title: 'Risk Assessment',
          titleAr: 'تقييم المخاطر',
          content: `
            <h3>Risk Assessment Framework</h3>
            <table class="presentation-table">
              <tr><th>Risk Factor</th><th>Low</th><th>Medium</th><th>High</th></tr>
              <tr><td>Nationality</td><td>GCC, Europe</td><td>Asia, Americas</td><td>FATF High-Risk</td></tr>
              <tr><td>Occupation</td><td>Salaried</td><td>Self-employed</td><td>Cash business, PEP</td></tr>
              <tr><td>Transaction</td><td>Consistent</td><td>Occasional large</td><td>Unusual patterns</td></tr>
              <tr><td>Source of Funds</td><td>Salary</td><td>Business</td><td>Unknown</td></tr>
            </table>
            <h3>Final Risk Decision</h3>
            <ul>
              <li><strong style="color: #4CAF50;">Maintain:</strong> Risk acceptable, continue relationship</li>
              <li><strong style="color: #FF9800;">Enhanced Monitoring:</strong> Periodic review required</li>
              <li><strong style="color: #F44336;">Exit:</strong> Unacceptable risk, close relationship</li>
            </ul>
          `
        },
        {
          id: 5,
          title: 'T24 Integration',
          titleAr: 'التكامل مع T24',
          content: `
            <h3>T24 Data Points</h3>
            <p>CDD has access to comprehensive customer data from T24 Core Banking.</p>
            <table class="presentation-table">
              <tr><th>Data Category</th><th>Fields</th></tr>
              <tr><td>Customer Master</td><td>RIM, Name, QID, DOB, Nationality</td></tr>
              <tr><td>KYC Record</td><td>Occupation, Employer, Salary, SOI</td></tr>
              <tr><td>Accounts</td><td>All accounts, Balances, Status</td></tr>
              <tr><td>Relationships</td><td>Joint holders, Signatories, Companies</td></tr>
            </table>
            <h3>T24 Update on Completion</h3>
            <ul>
              <li>EDD Status: Completed</li>
              <li>Next Review Date: Auto-calculated</li>
              <li>Risk Classification: Updated if changed</li>
            </ul>
          `
        },
        {
          id: 6,
          title: 'Document Verification',
          titleAr: 'التحقق من المستندات',
          content: `
            <h3>Document Review Standards</h3>
            <table class="presentation-table">
              <tr><th>Check</th><th>Description</th></tr>
              <tr><td>Authenticity</td><td>Original or certified copy, no tampering</td></tr>
              <tr><td>Currency</td><td>Within validity period, recent dated</td></tr>
              <tr><td>Completeness</td><td>All pages present, readable</td></tr>
              <tr><td>Relevance</td><td>Matches risk trigger, supports SOF</td></tr>
              <tr><td>Consistency</td><td>Matches T24 data, no contradictions</td></tr>
            </table>
            <h3>Red Flags</h3>
            <ul style="color: #F44336;">
              <li>Documents from unverified sources</li>
              <li>Inconsistent dates or amounts</li>
              <li>Missing employer/issuer details</li>
              <li>Poor quality scans</li>
            </ul>
          `
        },
        {
          id: 7,
          title: 'Escalation Criteria',
          titleAr: 'معايير التصعيد',
          content: `
            <h3>When to Escalate to Compliance</h3>
            <div style="background: rgba(244,67,54,0.1); padding: 20px; border-radius: 12px; margin: 20px 0;">
              <h4 style="color: #F44336; margin-top: 0;">Mandatory Escalation</h4>
              <ul>
                <li>PEP customers (Politically Exposed Persons)</li>
                <li>Sanctions screening hits</li>
                <li>Negative news alerts</li>
                <li>Suspected money laundering</li>
                <li>Account restriction recommendations</li>
              </ul>
            </div>
            <div style="background: rgba(255,152,0,0.1); padding: 20px; border-radius: 12px;">
              <h4 style="color: #FF9800; margin-top: 0;">Discretionary Escalation</h4>
              <ul>
                <li>Complex cases requiring guidance</li>
                <li>Unusual transaction patterns</li>
                <li>Customer refusing cooperation</li>
                <li>Cases outside normal parameters</li>
              </ul>
            </div>
          `
        },
        {
          id: 8,
          title: 'Quality Standards',
          titleAr: 'معايير الجودة',
          content: `
            <h3>CDD Quality Metrics</h3>
            <table class="presentation-table">
              <tr><th>KPI</th><th>Target</th></tr>
              <tr><td>Case Completion Time</td><td>&lt; 1 Business Day</td></tr>
              <tr><td>First-Time Approval Rate</td><td>&gt; 90%</td></tr>
              <tr><td>Audit Findings</td><td>Zero critical findings</td></tr>
              <tr><td>Data Accuracy</td><td>100% T24 match</td></tr>
            </table>
            <h3>Checker Validation Points</h3>
            <ul>
              <li>All mandatory fields completed</li>
              <li>Risk assessment justified</li>
              <li>Documents verified</li>
              <li>Recommendation appropriate</li>
              <li>Audit trail complete</li>
            </ul>
          `
        },
        {
          id: 9,
          title: 'CDD Dashboard',
          titleAr: 'لوحة تحكم CDD',
          content: `
            <h3>Your CDD Dashboard</h3>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 14px; color: #9C27B0; margin-bottom: 15px; font-weight: 600;">CDD OPERATIONS</div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; text-align: center;">
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #00D4FF;">12</div>
                  <div style="font-size: 11px; color: #888;">Pending Review</div>
                </div>
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #9C27B0;">5</div>
                  <div style="font-size: 11px; color: #888;">In Progress</div>
                </div>
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #F44336;">2</div>
                  <div style="font-size: 11px; color: #888;">Overdue</div>
                </div>
                <div>
                  <div style="font-size: 28px; font-weight: bold; color: #4CAF50;">45</div>
                  <div style="font-size: 11px; color: #888;">Completed</div>
                </div>
              </div>
            </div>
            <h3>Priority Handling</h3>
            <ul>
              <li><strong style="color: #F44336;">Critical:</strong> PEP, Sanctions - Same day</li>
              <li><strong style="color: #FF9800;">High:</strong> Business priority - 4 hours</li>
              <li><strong style="color: #00D4FF;">Normal:</strong> Standard flow - 1 day</li>
            </ul>
          `
        },
        {
          id: 10,
          title: 'Support & Resources',
          titleAr: 'الدعم والموارد',
          content: `
            <h3>CDD Team Resources</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #9C27B0; margin-bottom: 10px;">📋 Team Manager</div>
                <p>Ghaleb Essam</p>
                <p style="font-size: 12px; color: #888;">Case escalation, workload</p>
              </div>
              <div style="background: rgba(255,152,0,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #FF9800; margin-bottom: 10px;">⚖️ Compliance</div>
                <p>Extension: 4200</p>
                <p style="font-size: 12px; color: #888;">Policy questions</p>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #00D4FF; margin-bottom: 10px;">🛠️ IT Support</div>
                <p>Extension: 5000</p>
                <p style="font-size: 12px; color: #888;">System issues</p>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #4CAF50; margin-bottom: 10px;">📚 Documentation</div>
                <p>BRD in SharePoint</p>
                <p style="font-size: 12px; color: #888;">Full procedures</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #9C27B0;">
              <strong>CDD: The Quality Gate for EDD</strong>
            </div>
          `
        }
      ]
    },

    // ========== COMPLIANCE TEAM PRESENTATION ==========
    compliance: {
      id: 'compliance',
      title: 'Compliance Team Training',
      titleAr: 'تدريب فريق الالتزام',
      subtitle: 'Regulatory Compliance & AML',
      icon: '⚖️',
      color: '#FF9800',
      description: 'For Compliance Officers and Checkers',
      descriptionAr: 'لضباط الالتزام والمدققين',
      slides: [
        {
          id: 1,
          title: 'Compliance Role',
          titleAr: 'دور الالتزام',
          content: `
            <h3>Compliance Department in EDD</h3>
            <p>Compliance provides <strong>independent oversight</strong> for high-risk cases and regulatory reporting.</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(255,152,0,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">⚖️</div>
                <div style="font-weight: 600; color: #FF9800;">Compliance Officer</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Review escalated cases</li>
                  <li>Risk analysis</li>
                  <li>Compliance opinion</li>
                  <li>Regulatory assessment</li>
                </ul>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✅</div>
                <div style="font-weight: 600; color: #00D4FF;">Compliance Checker</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Validate opinion</li>
                  <li>Approve decisions</li>
                  <li>QCB reporting</li>
                  <li>Policy compliance</li>
                </ul>
              </div>
            </div>
            <p style="text-align: center; color: #FF9800;"><strong>Four-Eyes Principle Required</strong></p>
          `
        },
        {
          id: 2,
          title: 'Escalation Types',
          titleAr: 'أنواع التصعيد',
          content: `
            <h3>Cases Received by Compliance</h3>
            <table class="presentation-table">
              <tr><th>Type</th><th>Source</th><th>Priority</th></tr>
              <tr><td style="color: #F44336;"><strong>PEP Cases</strong></td><td>CRP Trigger</td><td>Critical - 4 hours</td></tr>
              <tr><td style="color: #F44336;"><strong>Sanctions Hit</strong></td><td>Screening System</td><td>Critical - Immediate</td></tr>
              <tr><td style="color: #FF9800;"><strong>High Risk</strong></td><td>CDD Escalation</td><td>High - Same day</td></tr>
              <tr><td style="color: #FF9800;"><strong>Negative News</strong></td><td>Media Screening</td><td>High - Same day</td></tr>
              <tr><td style="color: #00D4FF;"><strong>Complex Cases</strong></td><td>Business/CDD</td><td>Normal - 1 day</td></tr>
              <tr><td style="color: #00D4FF;"><strong>Account Restriction</strong></td><td>CDD Request</td><td>Normal - 1 day</td></tr>
            </table>
          `
        },
        {
          id: 3,
          title: 'Compliance Review',
          titleAr: 'مراجعة الالتزام',
          content: `
            <h3>Compliance Review Framework</h3>
            <div class="workflow-diagram">
              <div class="workflow-node" style="background: rgba(255,152,0,0.1); border-color: #FF9800;">📥 Case Escalated to Compliance</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">🔍 Compliance Officer Review</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">📝 Compliance Opinion Drafted</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">✅ Compliance Checker Validation</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">📤 Decision Returned to Business</div>
            </div>
            <h3>Review Areas</h3>
            <ul>
              <li>Risk assessment accuracy</li>
              <li>Regulatory compliance</li>
              <li>AML/CFT considerations</li>
              <li>Policy alignment</li>
            </ul>
          `
        },
        {
          id: 4,
          title: 'Compliance Decisions',
          titleAr: 'قرارات الالتزام',
          content: `
            <h3>Decision Options</h3>
            <table class="presentation-table">
              <tr><th>Decision</th><th>Action Required</th></tr>
              <tr><td style="color: #4CAF50;">Approve</td><td>Return to Business/CDD for execution</td></tr>
              <tr><td style="color: #00D4FF;">Request Documents</td><td>Specific additional information needed</td></tr>
              <tr><td style="color: #FF9800;">Enhanced Monitoring</td><td>Set periodic review schedule</td></tr>
              <tr><td style="color: #F44336;">Account Restriction</td><td>Limit account functionality</td></tr>
              <tr><td style="color: #F44336;">Exit Relationship</td><td>Initiate account closure process</td></tr>
              <tr><td style="color: #9C27B0;">Report to QCB</td><td>File regulatory report</td></tr>
            </table>
            <h3>Compliance Decision Panel</h3>
            <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: monospace; font-size: 12px;">
              <div style="color: #FF9800;">Risk Assessment: HIGH</div>
              <div style="color: #00D4FF;">Recommended Action: Enhanced Monitoring</div>
              <div style="color: #888;">Regulatory Notes: QCB notification not required</div>
            </div>
          `
        },
        {
          id: 5,
          title: 'PEP Handling',
          titleAr: 'التعامل مع PEP',
          content: `
            <h3>Politically Exposed Persons</h3>
            <p>PEP cases require <strong>senior management approval</strong> in addition to Compliance review.</p>
            <h3>PEP Categories</h3>
            <table class="presentation-table">
              <tr><th>Category</th><th>Examples</th></tr>
              <tr><td>Foreign PEP</td><td>Foreign government officials, diplomats</td></tr>
              <tr><td>Domestic PEP</td><td>Local government officials, military</td></tr>
              <tr><td>International Org</td><td>UN, IMF, World Bank officials</td></tr>
              <tr><td>PEP Family</td><td>Immediate family members</td></tr>
              <tr><td>Close Associates</td><td>Business partners, known associates</td></tr>
            </table>
            <h3>Required Actions</h3>
            <ul>
              <li>Source of wealth verification</li>
              <li>Senior management approval</li>
              <li>Enhanced ongoing monitoring</li>
              <li>Annual review minimum</li>
            </ul>
          `
        },
        {
          id: 6,
          title: 'Sanctions Screening',
          titleAr: 'فحص العقوبات',
          content: `
            <h3>Sanctions Screening Process</h3>
            <p>All EDD cases are screened against sanctions lists.</p>
            <h3>Sanctions Lists</h3>
            <table class="presentation-table">
              <tr><th>List</th><th>Source</th></tr>
              <tr><td>UN Sanctions</td><td>United Nations Security Council</td></tr>
              <tr><td>OFAC</td><td>US Treasury</td></tr>
              <tr><td>EU Sanctions</td><td>European Union</td></tr>
              <tr><td>QCB List</td><td>Qatar Central Bank</td></tr>
              <tr><td>Local Watchlist</td><td>Internal QIB list</td></tr>
            </table>
            <h3>Hit Investigation</h3>
            <div style="background: rgba(244,67,54,0.1); padding: 15px; border-radius: 8px;">
              <p style="color: #F44336; margin: 0;"><strong>True Hit:</strong> Immediate escalation to MLRO + account freeze</p>
            </div>
            <div style="background: rgba(76,175,80,0.1); padding: 15px; border-radius: 8px; margin-top: 10px;">
              <p style="color: #4CAF50; margin: 0;"><strong>False Positive:</strong> Document clearance rationale</p>
            </div>
          `
        },
        {
          id: 7,
          title: 'Regulatory Reporting',
          titleAr: 'التقارير التنظيمية',
          content: `
            <h3>QCB Reporting Requirements</h3>
            <table class="presentation-table">
              <tr><th>Report Type</th><th>Trigger</th><th>Timeline</th></tr>
              <tr><td>STR</td><td>Suspicious transaction</td><td>Within 3 days</td></tr>
              <tr><td>CTR</td><td>Cash &gt; QAR 50,000</td><td>Within 15 days</td></tr>
              <tr><td>Sanctions Report</td><td>True hit confirmation</td><td>Immediate</td></tr>
              <tr><td>PEP Report</td><td>New PEP onboarding</td><td>Within 5 days</td></tr>
            </table>
            <h3>Documentation Standards</h3>
            <ul>
              <li>Complete case narrative</li>
              <li>Supporting documents</li>
              <li>Risk assessment rationale</li>
              <li>Decision justification</li>
            </ul>
          `
        },
        {
          id: 8,
          title: 'Risk Intelligence',
          titleAr: 'ذكاء المخاطر',
          content: `
            <h3>Compliance Risk Dashboard</h3>
            <p>Monitor risk patterns across the portfolio.</p>
            <h3>Key Risk Indicators</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
              <div style="background: rgba(244,67,54,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #F44336;">15%</div>
                <div style="font-size: 12px; color: #888;">High-Risk Nationality</div>
              </div>
              <div style="background: rgba(255,152,0,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #FF9800;">8%</div>
                <div style="font-size: 12px; color: #888;">Cash Business Occupation</div>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #9C27B0;">3</div>
                <div style="font-size: 12px; color: #888;">Active PEP Cases</div>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #00D4FF;">0</div>
                <div style="font-size: 12px; color: #888;">Pending QCB Reports</div>
              </div>
            </div>
          `
        },
        {
          id: 9,
          title: 'Audit Trail',
          titleAr: 'سجل التدقيق',
          content: `
            <h3>Compliance Audit Requirements</h3>
            <p>All compliance decisions must be fully documented.</p>
            <h3>Required Documentation</h3>
            <table class="presentation-table">
              <tr><th>Element</th><th>Details</th></tr>
              <tr><td>Officer Identity</td><td>Name, Employee ID, Department</td></tr>
              <tr><td>Timestamp</td><td>Date, Time of decision</td></tr>
              <tr><td>Case Summary</td><td>Risk factors, Key findings</td></tr>
              <tr><td>Analysis</td><td>Regulatory considerations</td></tr>
              <tr><td>Decision</td><td>Action taken, Rationale</td></tr>
              <tr><td>Checker Validation</td><td>Second review confirmation</td></tr>
            </table>
            <h3>Retention</h3>
            <p>All records retained for <strong>10 years</strong> per QCB requirements.</p>
          `
        },
        {
          id: 10,
          title: 'Contact & Escalation',
          titleAr: 'الاتصال والتصعيد',
          content: `
            <h3>Escalation Hierarchy</h3>
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 12px; font-family: monospace; font-size: 12px;">
<pre style="color: #FF9800; margin: 0;">
MLRO (Money Laundering Reporting Officer)
    ├── Senior Compliance Officer
    │       ├── Compliance Officer
    │       └── Compliance Checker
    └── Regulatory Reporting
</pre>
            </div>
            <h3>Contact Points</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
              <div style="background: rgba(255,152,0,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; color: #FF9800;">Compliance Head</div>
                <p style="font-size: 12px;">Extension: 4200</p>
              </div>
              <div style="background: rgba(244,67,54,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; color: #F44336;">MLRO Hotline</div>
                <p style="font-size: 12px;">Urgent escalations</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #FF9800;">
              <strong>Compliance: Protecting QIB from Regulatory Risk</strong>
            </div>
          `
        }
      ]
    },

    // ========== OPERATIONS TEAM PRESENTATION ==========
    operations: {
      id: 'operations',
      title: 'Operations Team Training',
      titleAr: 'تدريب فريق العمليات',
      subtitle: 'Execution & Support Teams',
      icon: '⚙️',
      color: '#607D8B',
      description: 'For Operations and Execution Staff',
      descriptionAr: 'لفريق العمليات والتنفيذ',
      slides: [
        {
          id: 1,
          title: 'Operations Role',
          titleAr: 'دور العمليات',
          content: `
            <h3>Operations in EDD Workflow</h3>
            <p>Operations teams <strong>execute decisions</strong> made by Business, CDD, and Compliance.</p>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(96,125,139,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">⚙️</div>
                <div style="font-weight: 600; color: #607D8B;">Execution Tasks</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Account restrictions</li>
                  <li>Account closures</li>
                  <li>T24 updates</li>
                  <li>Document archiving</li>
                </ul>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-size: 24px; margin-bottom: 10px;">📞</div>
                <div style="font-weight: 600; color: #00D4FF;">Support Tasks</div>
                <ul style="font-size: 13px; margin-top: 10px;">
                  <li>Customer follow-up</li>
                  <li>Document collection</li>
                  <li>Branch coordination</li>
                  <li>Query resolution</li>
                </ul>
              </div>
            </div>
          `
        },
        {
          id: 2,
          title: 'Case Lifecycle',
          titleAr: 'دورة حياة الحالة',
          content: `
            <h3>When Operations Gets Involved</h3>
            <div class="workflow-diagram">
              <div class="workflow-node" style="background: rgba(156,39,176,0.1); border-color: #9C27B0;">CDD Approval</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node" style="background: rgba(255,152,0,0.1); border-color: #FF9800;">Compliance Decision (if applicable)</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node" style="background: rgba(96,125,139,0.2); border-color: #607D8B;">📥 Operations Queue</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Execute Required Actions</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node">Update T24 / DMS</div>
              <div class="workflow-arrow">↓</div>
              <div class="workflow-node complete">Case Closed</div>
            </div>
          `
        },
        {
          id: 3,
          title: 'Account Actions',
          titleAr: 'إجراءات الحساب',
          content: `
            <h3>Account Restriction Actions</h3>
            <table class="presentation-table">
              <tr><th>Action</th><th>Effect</th><th>Authority</th></tr>
              <tr><td>Credit Freeze</td><td>Block incoming funds</td><td>Compliance</td></tr>
              <tr><td>Debit Freeze</td><td>Block outgoing funds</td><td>Compliance</td></tr>
              <tr><td>Full Freeze</td><td>No transactions allowed</td><td>Compliance/MLRO</td></tr>
              <tr><td>Closure</td><td>Close all accounts</td><td>Senior Compliance</td></tr>
            </table>
            <h3>T24 Update Process</h3>
            <ul>
              <li>Receive approved instruction</li>
              <li>Apply restriction code in T24</li>
              <li>Document in DMS</li>
              <li>Update EDD case status</li>
            </ul>
          `
        },
        {
          id: 4,
          title: 'Document Handling',
          titleAr: 'معالجة المستندات',
          content: `
            <h3>Document Management</h3>
            <p>Operations ensures all documents are properly archived.</p>
            <h3>Filing Requirements</h3>
            <table class="presentation-table">
              <tr><th>Document Type</th><th>Storage</th><th>Retention</th></tr>
              <tr><td>KYC Documents</td><td>DMS/FileNet</td><td>10 years</td></tr>
              <tr><td>EDD Case File</td><td>DMS/FileNet</td><td>7 years</td></tr>
              <tr><td>Compliance Decisions</td><td>DMS/FileNet</td><td>10 years</td></tr>
              <tr><td>Audit Trail</td><td>System Archive</td><td>10 years</td></tr>
            </table>
            <h3>Quality Checks</h3>
            <ul>
              <li>All documents scanned clearly</li>
              <li>Correct customer RIM linked</li>
              <li>Proper categorization</li>
              <li>Metadata complete</li>
            </ul>
          `
        },
        {
          id: 5,
          title: 'Call Center Support',
          titleAr: 'دعم مركز الاتصال',
          content: `
            <h3>Call Center Role in EDD</h3>
            <p>Call Center supports customer contact and document collection.</p>
            <h3>Responsibilities</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; color: #00D4FF;">Customer Contact</div>
                <ul style="font-size: 12px; margin-top: 8px;">
                  <li>Follow-up calls</li>
                  <li>Document reminders</li>
                  <li>Branch appointment</li>
                </ul>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; color: #4CAF50;">Information</div>
                <ul style="font-size: 12px; margin-top: 8px;">
                  <li>Explain requirements</li>
                  <li>Guide document submission</li>
                  <li>Update case notes</li>
                </ul>
              </div>
            </div>
            <h3>Scripts Available</h3>
            <p>Standard scripts for EDD calls available in the system.</p>
          `
        },
        {
          id: 6,
          title: 'SLA Management',
          titleAr: 'إدارة SLA',
          content: `
            <h3>Service Level Agreements</h3>
            <table class="presentation-table">
              <tr><th>Task</th><th>SLA</th></tr>
              <tr><td>Account Restriction</td><td>Same day (after approval)</td></tr>
              <tr><td>T24 Update</td><td>Within 4 hours</td></tr>
              <tr><td>Document Archiving</td><td>Within 1 business day</td></tr>
              <tr><td>Customer Call-back</td><td>Within 24 hours</td></tr>
            </table>
            <h3>Escalation</h3>
            <p>Overdue tasks automatically escalate to supervisor.</p>
            <div style="background: rgba(244,67,54,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
              <p style="margin: 0; color: #F44336;"><strong>Priority:</strong> Compliance-approved restrictions must be executed immediately.</p>
            </div>
          `
        },
        {
          id: 7,
          title: 'Quality Control',
          titleAr: 'ضبط الجودة',
          content: `
            <h3>Operations Quality Metrics</h3>
            <table class="presentation-table">
              <tr><th>KPI</th><th>Target</th></tr>
              <tr><td>SLA Compliance</td><td>&gt; 95%</td></tr>
              <tr><td>Data Entry Accuracy</td><td>100%</td></tr>
              <tr><td>Document Quality</td><td>&gt; 98% first-time pass</td></tr>
              <tr><td>Customer Satisfaction</td><td>&gt; 90%</td></tr>
            </table>
            <h3>Common Errors to Avoid</h3>
            <ul style="color: #F44336;">
              <li>Wrong restriction code applied</li>
              <li>Missing document metadata</li>
              <li>Incomplete case notes</li>
              <li>Delayed T24 updates</li>
            </ul>
          `
        },
        {
          id: 8,
          title: 'System Access',
            titleAr: 'الوصول للنظام',
          content: `
            <h3>Operations Access Rights</h3>
            <table class="presentation-table">
              <tr><th>System</th><th>Access Level</th></tr>
              <tr><td>EDD System</td><td>View cases in queue, Update status</td></tr>
              <tr><td>T24</td><td>Execute approved changes only</td></tr>
              <tr><td>DMS/FileNet</td><td>Upload and archive documents</td></tr>
              <tr><td>Notification System</td><td>Send customer communications</td></tr>
            </table>
            <h3>Restrictions</h3>
            <ul>
              <li>Cannot modify case decisions</li>
              <li>Cannot change risk classifications</li>
              <li>Read-only access to compliance notes</li>
            </ul>
          `
        },
        {
          id: 9,
          title: 'Reporting',
          titleAr: 'التقارير',
          content: `
            <h3>Operations Reports</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0;">
              <div style="background: rgba(0,212,255,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; color: #00D4FF;">Daily Report</div>
                <ul style="font-size: 12px; margin-top: 8px;">
                  <li>Tasks completed</li>
                  <li>Pending queue</li>
                  <li>SLA breaches</li>
                </ul>
              </div>
              <div style="background: rgba(76,175,80,0.1); padding: 15px; border-radius: 8px;">
                <div style="font-weight: 600; color: #4CAF50;">Weekly Report</div>
                <ul style="font-size: 12px; margin-top: 8px;">
                  <li>Volume trends</li>
                  <li>Quality metrics</li>
                  <li>Exception report</li>
                </ul>
              </div>
            </div>
            <h3>Management Dashboard</h3>
            <p>Real-time view of operations queue and performance.</p>
          `
        },
        {
          id: 10,
          title: 'Support Contacts',
          titleAr: 'جهات الدعم',
          content: `
            <h3>Operations Support</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0;">
              <div style="background: rgba(96,125,139,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #607D8B; margin-bottom: 10px;">👤 Operations Head</div>
                <p>Sayed ElMahdy</p>
                <p style="font-size: 12px; color: #888;">Head of Retail & Shared Services</p>
              </div>
              <div style="background: rgba(0,212,255,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #00D4FF; margin-bottom: 10px;">🛠️ IT Support</div>
                <p>Extension: 5000</p>
                <p style="font-size: 12px; color: #888;">System issues</p>
              </div>
              <div style="background: rgba(156,39,176,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #9C27B0; margin-bottom: 10px;">📋 CDD</div>
                <p>Extension: 4100</p>
                <p style="font-size: 12px; color: #888;">Case queries</p>
              </div>
              <div style="background: rgba(255,152,0,0.1); padding: 20px; border-radius: 12px;">
                <div style="font-weight: 600; color: #FF9800; margin-bottom: 10px;">⚖️ Compliance</div>
                <p>Extension: 4200</p>
                <p style="font-size: 12px; color: #888;">Decision clarification</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #607D8B;">
              <strong>Operations: Turning Decisions into Action</strong>
            </div>
          `
        }
      ]
    }
  },

  // Legacy compatibility - point to comprehensive presentation
  get systemPresentation() {
    return this.presentations.comprehensive;
  },

  // Get presentation by type
  getPresentation: function(type) {
    return this.presentations[type] || this.presentations.comprehensive;
  },

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================
  
  getFinancialProfile: function(rim) {
    return this.financialProfiles[rim] || null;
  },

  getExpectedActivity: function(rim) {
    return this.expectedActivityProfiles[rim] || null;
  },

  getRoleInfo: function(roleId) {
    return this.roles[roleId] || null;
  },

  getUserGuide: function(guideId) {
    return this.userGuides.find(g => g.id === guideId);
  },

  getPublishedGuides: function() {
    return this.userGuides.filter(g => g.status === 'Published');
  },

  // =====================================================
  // CUSTOMER RISK NETWORK GRAPH
  // =====================================================
  
  // Network graph node types
  nodeTypes: {
    CUSTOMER: { color: '#00D4FF', icon: '👤', size: 50 },
    JOINT_HOLDER: { color: '#9C27B0', icon: '👥', size: 45 },
    COMPANY: { color: '#FF9800', icon: '🏢', size: 55 },
    ACCOUNT: { color: '#4CAF50', icon: '💳', size: 40 },
    SIGNATORY: { color: '#E91E63', icon: '✍️', size: 40 },
    HIGH_RISK: { color: '#F44336', icon: '⚠️', size: 50 },
    PEP: { color: '#FF5722', icon: '🎖️', size: 50 }
  },

  // Edge types for relationships
  edgeTypes: {
    JOINT_ACCOUNT: { color: '#9C27B0', style: 'solid', label: 'Joint Account' },
    SIGNATORY: { color: '#E91E63', style: 'dashed', label: 'Signatory' },
    BENEFICIAL_OWNER: { color: '#FF9800', style: 'solid', label: 'Beneficial Owner' },
    DIRECTOR: { color: '#2196F3', style: 'solid', label: 'Director' },
    SHAREHOLDER: { color: '#4CAF50', style: 'solid', label: 'Shareholder' },
    FAMILY: { color: '#00BCD4', style: 'dotted', label: 'Family Relation' },
    EMPLOYER: { color: '#795548', style: 'solid', label: 'Employer' }
  },

  // Customer network data (simulates T24/ETL relationships)
  customerNetworks: {
    'RIM001234': {
      centerNode: {
        rim: 'RIM001234',
        name: 'Abdullah Mohammed Al-Kuwari',
        nameAr: 'عبدالله محمد الكواري',
        type: 'CUSTOMER',
        riskLevel: 'HIGH',
        isPEP: false,
        segment: 'Private Banking'
      },
      relatedNodes: [
        {
          rim: 'RIM005678',
          name: 'Mariam Hassan Al-Thani',
          nameAr: 'مريم حسن آل ثاني',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 40,
          accountNumber: '001-123456-001'
        },
        {
          rim: 'RIM003456',
          name: 'Khalid bin Hamad Al-Attiyah',
          nameAr: 'خالد بن حمد العطية',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 30,
          accountNumber: '001-234567-002',
          isPEP: true
        },
        {
          rim: 'RIM008901',
          name: 'Hassan Ali Al-Hajri',
          nameAr: 'حسن علي الهاجري',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 20,
          accountNumber: '001-234567-002'
        },
        {
          id: 'COMP001',
          name: 'Al-Kuwari Trading LLC',
          nameAr: 'الكواري للتجارة ذ.م.م',
          type: 'COMPANY',
          relationship: 'BENEFICIAL_OWNER',
          ownershipPct: 75,
          crNumber: 'CR-12345'
        },
        {
          id: 'COMP002',
          name: 'Gulf Investment Partners',
          nameAr: 'شركاء استثمار الخليج',
          type: 'COMPANY',
          relationship: 'DIRECTOR',
          position: 'Board Member',
          crNumber: 'CR-67890'
        },
        {
          rim: 'RIM007890',
          name: 'Fatima Nasser Al-Misnad',
          nameAr: 'فاطمة ناصر المسند',
          type: 'SIGNATORY',
          relationship: 'SIGNATORY',
          poaType: 'Limited POA',
          poaExpiry: '2025-12-31'
        }
      ],
      accounts: [
        { number: '001-123456-001', type: 'Savings', balance: 500000, status: 'Active' },
        { number: '001-234567-002', type: 'Current', balance: 1200000, status: 'Active' },
        { number: '002-345678-001', type: 'Investment', balance: 3500000, status: 'Active' }
      ],
      riskIndicators: [
        { type: 'HIGH_CASH', description: 'High cash transaction volume', severity: 'Medium' },
        { type: 'INTL_TRANSFERS', description: 'International transfers to high-risk jurisdictions', severity: 'High' },
        { type: 'PEP_CONNECTED', description: 'Connected to PEP individual', severity: 'High' }
      ]
    },
    'RIM005678': {
      centerNode: {
        rim: 'RIM005678',
        name: 'Mariam Hassan Al-Thani',
        nameAr: 'مريم حسن آل ثاني',
        type: 'CUSTOMER',
        riskLevel: 'MEDIUM',
        isPEP: false,
        segment: 'Tamayuz'
      },
      relatedNodes: [
        {
          rim: 'RIM001234',
          name: 'Abdullah Mohammed Al-Kuwari',
          nameAr: 'عبدالله محمد الكواري',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 60,
          accountNumber: '001-123456-001'
        },
        {
          rim: 'RIM007890',
          name: 'Fatima Nasser Al-Misnad',
          nameAr: 'فاطمة ناصر المسند',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 30,
          accountNumber: '001-345678-003'
        },
        {
          rim: 'RIM006789',
          name: 'Noura Ahmed Al-Ghanim',
          nameAr: 'نورة أحمد الغانم',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 33,
          accountNumber: '001-567890-005'
        },
        {
          id: 'COMP003',
          name: 'Thani Fashion House',
          nameAr: 'دار ثاني للأزياء',
          type: 'COMPANY',
          relationship: 'BENEFICIAL_OWNER',
          ownershipPct: 100,
          crNumber: 'CR-11111'
        }
      ],
      accounts: [
        { number: '001-123456-001', type: 'Savings', balance: 500000, status: 'Active' },
        { number: '001-345678-003', type: 'Investment', balance: 2500000, status: 'Active' },
        { number: '001-567890-005', type: 'Current', balance: 180000, status: 'Active' }
      ],
      riskIndicators: [
        { type: 'MULTI_JOINT', description: 'Multiple joint account relationships', severity: 'Low' }
      ]
    },
    'RIM003456': {
      centerNode: {
        rim: 'RIM003456',
        name: 'Khalid bin Hamad Al-Attiyah',
        nameAr: 'خالد بن حمد العطية',
        type: 'CUSTOMER',
        riskLevel: 'AUTO HIGH',
        isPEP: true,
        pepPosition: 'Former Minister',
        segment: 'Private Banking'
      },
      relatedNodes: [
        {
          rim: 'RIM001234',
          name: 'Abdullah Mohammed Al-Kuwari',
          nameAr: 'عبدالله محمد الكواري',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 30,
          accountNumber: '001-234567-002'
        },
        {
          rim: 'RIM008901',
          name: 'Hassan Ali Al-Hajri',
          nameAr: 'حسن علي الهاجري',
          type: 'JOINT_HOLDER',
          relationship: 'JOINT_ACCOUNT',
          ownershipPct: 20,
          accountNumber: '001-234567-002'
        },
        {
          id: 'COMP004',
          name: 'Attiyah Holdings',
          nameAr: 'مجموعة العطية القابضة',
          type: 'COMPANY',
          relationship: 'BENEFICIAL_OWNER',
          ownershipPct: 85,
          crNumber: 'CR-99999'
        },
        {
          id: 'COMP005',
          name: 'Qatar Media Group',
          nameAr: 'مجموعة قطر للإعلام',
          type: 'COMPANY',
          relationship: 'SHAREHOLDER',
          ownershipPct: 15,
          crNumber: 'CR-88888'
        }
      ],
      accounts: [
        { number: '001-234567-002', type: 'Current', balance: 1200000, status: 'Active' },
        { number: '003-456789-001', type: 'Investment', balance: 8500000, status: 'Active' }
      ],
      riskIndicators: [
        { type: 'PEP', description: 'Politically Exposed Person - Former Minister', severity: 'Critical' },
        { type: 'HIGH_VALUE', description: 'High value accounts (>5M QAR)', severity: 'Medium' },
        { type: 'COMPLEX_STRUCTURE', description: 'Complex corporate ownership structure', severity: 'High' }
      ]
    }
  },

  // Get network data for a customer
  getCustomerNetwork: function(rim) {
    return this.customerNetworks[rim] || null;
  },

  // Build network graph data structure
  buildNetworkGraph: function(rim) {
    const network = this.getCustomerNetwork(rim);
    if (!network) return null;

    const nodes = [];
    const edges = [];

    // Add center node
    const centerNode = {
      id: network.centerNode.rim,
      label: network.centerNode.name,
      labelAr: network.centerNode.nameAr,
      type: network.centerNode.isPEP ? 'PEP' : (network.centerNode.riskLevel === 'HIGH' || network.centerNode.riskLevel === 'AUTO HIGH' ? 'HIGH_RISK' : 'CUSTOMER'),
      x: 400,
      y: 300,
      isCenter: true,
      data: network.centerNode
    };
    nodes.push(centerNode);

    // Add related nodes in a circle around center
    const relatedCount = network.relatedNodes.length;
    const angleStep = (2 * Math.PI) / relatedCount;
    const radius = 200;

    network.relatedNodes.forEach((related, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);

      const relatedNode = {
        id: related.rim || related.id,
        label: related.name,
        labelAr: related.nameAr,
        type: related.isPEP ? 'PEP' : related.type,
        x: x,
        y: y,
        isCenter: false,
        data: related
      };
      nodes.push(relatedNode);

      // Add edge
      edges.push({
        from: network.centerNode.rim,
        to: related.rim || related.id,
        type: related.relationship,
        label: this.edgeTypes[related.relationship]?.label || related.relationship,
        ownershipPct: related.ownershipPct
      });
    });

    return { nodes, edges, accounts: network.accounts, riskIndicators: network.riskIndicators };
  }
};

// Make globally available
window.EnterpriseFeatures = EnterpriseFeatures;
