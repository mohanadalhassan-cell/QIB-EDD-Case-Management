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
  // SYSTEM PRESENTATION
  // =====================================================
  
  systemPresentation: {
    title: 'Operations Digital Investigation Platform',
    titleAr: 'منصة التحقيق الرقمي للعمليات',
    subtitle: 'QIB Enhanced Due Diligence System',
    version: '2026.3',
    slides: [
      {
        id: 1,
        title: 'System Overview',
        titleAr: 'نظرة عامة على النظام',
        content: `
          <h3>Purpose</h3>
          <p>The EDD System is QIB's internal platform for managing Enhanced Due Diligence cases, ensuring regulatory compliance with QCB AML Guidelines and FATF Recommendations.</p>
          <h3>Key Features</h3>
          <ul>
            <li>Automated case creation from T24/CRP triggers</li>
            <li>Risk-based workflow routing (40+ trigger categories)</li>
            <li>Multi-level Maker/Checker approval process</li>
            <li>Real-time data integration (T24, QCB API, CRP, ETL, DMS)</li>
            <li>Customer Identity Re-Verification (Selfie/Video/Branch)</li>
            <li>KYC Data Correction capability</li>
            <li>Complete audit trail for regulatory compliance</li>
          </ul>
        `
      },
      {
        id: 2,
        title: 'Department Responsibilities',
        titleAr: 'مسؤوليات الأقسام',
        content: `
          <h3>Business Teams (Mass / Tamayuz / Private)</h3>
          <ul>
            <li>Initial case review and customer contact</li>
            <li>Document collection and verification</li>
            <li>KYC data correction (with verification)</li>
            <li>Business recommendation (Maintain/Exit)</li>
          </ul>
          <h3>CDD Operations</h3>
          <ul>
            <li>Detailed due diligence review</li>
            <li>Risk assessment documentation</li>
            <li>Maker/Checker approval workflow</li>
            <li>T24 data synchronization</li>
          </ul>
          <h3>Compliance</h3>
          <ul>
            <li>Review escalated/high-risk cases</li>
            <li>PEP and sanctions decisions</li>
            <li>Account restriction approvals</li>
            <li>Regulatory reporting (QCB)</li>
          </ul>
        `
      },
      {
        id: 3,
        title: 'Case Workflow',
        titleAr: 'سير عمل الحالة',
        content: `
          <div class="workflow-diagram">
            <div class="workflow-node">📥 Case Created (Auto from CRP/T24)</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node">👤 Business Maker (Review + Decision)</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node">✅ Business Checker</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node">📋 CDD Maker (Full Review)</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node">✅ CDD Checker (Approve/Reject)</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node conditional">⚠️ Compliance (if High Risk/PEP)</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node">🔄 T24 Update (EDD Status + Next Review)</div>
            <div class="workflow-arrow">↓</div>
            <div class="workflow-node complete">✔️ Case Complete + Archived</div>
          </div>
        `
      },
      {
        id: 4,
        title: 'EDD Resolution Options',
        titleAr: 'خيارات حل حالة EDD',
        content: `
          <h3>Available Resolution Paths</h3>
          <table class="presentation-table">
            <tr><th>Option</th><th>Description</th><th>When to Use</th></tr>
            <tr><td>Request Documents</td><td>Request additional documentation</td><td>Source of funds, income proof needed</td></tr>
            <tr><td>Accept Current KYC</td><td>No additional docs required</td><td>Risk due to nationality/occupation only</td></tr>
            <tr><td>Correct Customer Data</td><td>Update incorrect KYC info</td><td>Data entry errors, outdated info</td></tr>
            <tr><td>Identity Verification</td><td>Selfie/Video/Branch verification</td><td>Identity confirmation needed</td></tr>
            <tr><td>Escalate to Compliance</td><td>Transfer for high-risk review</td><td>PEP, sanctions, complex cases</td></tr>
          </table>
          <h3>KYC Data Correction</h3>
          <p>Business can update: Occupation, Salary, Employer, Source of Income</p>
          <p>Requires: Verification source + Maker/Checker approval + T24 sync</p>
        `
      },
      {
        id: 5,
        title: 'Customer Identity Verification',
        titleAr: 'التحقق من هوية العميل',
        content: `
          <h3>Verification Methods</h3>
          <table class="presentation-table">
            <tr><th>Method</th><th>Channel</th><th>Features</th></tr>
            <tr><td>📷 Live Selfie</td><td>Mobile/QIB Lite/Microsite</td><td>Liveness detection, Anti-spoofing</td></tr>
            <tr><td>🎥 Video KYC</td><td>Video Call</td><td>Employee verification, Recorded</td></tr>
            <tr><td>🏦 Branch Visit</td><td>Physical Branch</td><td>In-person photo capture</td></tr>
          </table>
          <h3>Liveness Detection</h3>
          <ul>
            <li>Blink detection</li>
            <li>Head movement</li>
            <li>Smile detection</li>
            <li>Deepfake/Anti-spoofing protection</li>
          </ul>
          <h3>SLA Tracking</h3>
          <p>Day 7: Reminder → Day 14: Final Notice → Day 21: Account Restriction</p>
        `
      },
      {
        id: 6,
        title: 'Enterprise Integration',
        titleAr: 'التكامل المؤسسي',
        content: `
          <h3>System Integrations via ESB</h3>
          <table class="presentation-table">
            <tr><th>System</th><th>Data Type</th><th>Integration</th></tr>
            <tr><td>T24</td><td>Customer, Accounts, KYC</td><td>Real-time SOAP/REST</td></tr>
            <tr><td>QCB API</td><td>Identity, Employment</td><td>REST (with consent)</td></tr>
            <tr><td>CRP Engine</td><td>Risk Scores</td><td>Real-time trigger</td></tr>
            <tr><td>ETL/SnapView</td><td>Financial Profile</td><td>Daily Batch</td></tr>
            <tr><td>DMS (FileNet)</td><td>Documents, Photos</td><td>On-demand API</td></tr>
            <tr><td>Notification GW</td><td>SMS/Email/Push</td><td>Event-driven</td></tr>
            <tr><td>HR/LDAP</td><td>Employee Identity</td><td>SSO Integration</td></tr>
          </table>
        `
      },
      {
        id: 7,
        title: 'Data Governance',
        titleAr: 'حوكمة البيانات',
        content: `
          <h3>Data Classification</h3>
          <table class="presentation-table">
            <tr><th>Level</th><th>Examples</th><th>Protection</th></tr>
            <tr><td>Highly Restricted</td><td>Risk scores, PEP status</td><td>Encrypted + Role-based</td></tr>
            <tr><td>Restricted</td><td>QID, Financial data</td><td>Encrypted</td></tr>
            <tr><td>Confidential</td><td>Customer name, RIM</td><td>Need-to-know</td></tr>
          </table>
          <h3>Retention Policy</h3>
          <ul>
            <li>EDD Cases: 7 years after closure</li>
            <li>KYC Documents: 10 years</li>
            <li>Audit Logs: 10 years</li>
          </ul>
          <h3>Access Control</h3>
          <p>Role-based access (RBAC) with segment restrictions for Business users</p>
        `
      },
      {
        id: 8,
        title: 'EDD Trigger Categories',
        titleAr: 'فئات تنبيه EDD',
        content: `
          <h3>Why EDD Cases are Triggered</h3>
          <table class="presentation-table">
            <tr><th>Category</th><th>Examples</th></tr>
            <tr><td>Nationality Risk</td><td>High-risk country, Sanctioned, Tax haven</td></tr>
            <tr><td>Occupation Risk</td><td>PEP, Cash business, Money service</td></tr>
            <tr><td>Transaction Risk</td><td>Large cash, Unusual patterns, Rapid movement</td></tr>
            <tr><td>AML Alert</td><td>Sanctions hit, Negative news, Watchlist</td></tr>
            <tr><td>KYC Gap</td><td>Missing/Expired documents</td></tr>
            <tr><td>Account Risk</td><td>Dormant reactivation, Multiple accounts</td></tr>
          </table>
          <p><strong>Not every EDD case requires additional documents!</strong></p>
          <p>Business can close with justification if risk is only due to nationality/occupation.</p>
        `
      },
      {
        id: 9,
        title: 'Officer Confirmation',
        titleAr: 'تأكيد الموظف',
        content: `
          <h3>Digital Confirmation Process</h3>
          <p>Every approval requires officer confirmation with:</p>
          <ul>
            <li>Employee Name & ID (Arabic + English)</li>
            <li>Department & Job Title</li>
            <li>Profile Photo</li>
            <li>4-Digit PIN</li>
            <li>Checklist Completion</li>
          </ul>
          <h3>Checklist Items</h3>
          <ul>
            <li>✓ Customer Identity Verified</li>
            <li>✓ Salary/Income Verified</li>
            <li>✓ Expected Activity Verified</li>
            <li>✓ Risk Classification Reviewed</li>
            <li>✓ All Required Documents Complete</li>
            <li>✓ No Pending AML Alerts</li>
          </ul>
        `
      },
      {
        id: 10,
        title: 'Contact & Support',
        titleAr: 'الاتصال والدعم',
        content: `
          <h3>System Support</h3>
          <p><strong>IT Service Desk:</strong> ext. 5000</p>
          <p><strong>Email:</strong> edd.support@qib.com.qa</p>
          
          <h3>Process Questions</h3>
          <p><strong>CDD Operations:</strong> ext. 4100</p>
          <p><strong>Compliance:</strong> ext. 4200</p>
          <p><strong>Operations Head:</strong> Amit Malhotra</p>
          
          <h3>Documentation</h3>
          <p>User guides available in Help menu</p>
          <p>Full BRD (2,700+ lines) available in SharePoint</p>
          <p>Covers: Workflow, Integration, Governance, Identity Verification</p>
          
          <h3 style="color: #00D4FF;">Developed by Operations Division</h3>
          <p>Sayed ElMahdy - System Design & BRD</p>
        `
      }
    ]
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
