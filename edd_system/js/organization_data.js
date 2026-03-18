// ═══════════════════════════════════════════════════════════════════════════
// QIB ORGANIZATION STRUCTURE - Complete Enterprise Model
// Integrated with EDD Case Management System
// ═══════════════════════════════════════════════════════════════════════════

const QIBOrganization = {
  
  // ═══════════════════════════════════════════════════════════════
  // BOARD OF DIRECTORS
  // ═══════════════════════════════════════════════════════════════
  board_of_directors: {
    chairman: {
      id: 'BOD-001',
      name: 'Sheikh Jassim bin Hamad Al Thani',
      name_ar: 'الشيخ جاسم بن حمد آل ثاني',
      title: 'Chairman of the Board',
      title_ar: 'رئيس مجلس الإدارة',
      department: 'Board of Directors',
      photo: 'assets/employees/chairman.jpeg',
      permissions: ['full_authority', 'board_approval'],
      email: 'chairman@qib.com.qa'
    },
    members: [
      // Board members would be listed here
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // EXECUTIVE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════
  executive_management: {
    gceo: {
      id: 'EXE-001',
      name: 'Mr. Bassel Gamal',
      name_ar: 'السيد باسل جمال',
      title: 'Group Chief Executive Officer',
      title_ar: 'الرئيس التنفيذي للمجموعة',
      department: 'Executive Leadership',
      photo: 'assets/employees/GCEO.jpeg',
      permissions: ['full_authority', 'executive_approval', 'policy_override'],
      email: 'gceo@qib.com.qa',
      reports_to: 'BOD-001'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // GENERAL MANAGERS (Report to GCEO)
  // ═══════════════════════════════════════════════════════════════
  general_managers: [
    {
      id: 'GM-001',
      name: 'Saleem Ulhiq',
      name_ar: 'سليم الحق',
      title: 'COO - Operations & IT',
      title_ar: 'المدير التنفيذي للعمليات وتقنية المعلومات',
      department: 'Operations & Technology',
      dept_code: 'OPS_IT',
      photo: 'assets/employees/Saleem.jpeg',
      permissions: ['ops_admin', 'it_admin', 'executive_approval'],
      email: 'saleem.ulhiq@qib.com.qa',
      reports_to: 'EXE-001'
    },
    {
      id: 'GM-002',
      name: 'D. Anand',
      name_ar: 'دي. أناند',
      title: 'GM Retail Banking',
      title_ar: 'المدير العام للخدمات المصرفية للأفراد',
      department: 'Retail Banking',
      dept_code: 'RETAIL',
      photo: 'assets/employees/Anand.jpeg',
      permissions: ['retail_approval', 'process_owner'],
      email: 'd.anand@qib.com.qa',
      reports_to: 'EXE-001',
      direct_reports: ['HD-RET-001', 'HD-RET-002', 'HD-RET-003', 'HD-RET-004']
    },
    {
      id: 'GM-003',
      name: 'Tariq Fawzi',
      name_ar: 'طارق فوزي',
      title: 'GM Wholesale Banking',
      title_ar: 'المدير العام للخدمات المصرفية للشركات',
      department: 'Wholesale Banking',
      dept_code: 'WBG',
      photo: 'assets/employees/Tariq.jpeg',
      permissions: ['wbg_approval', 'corporate_authority'],
      email: 'tariq.fawzi@qib.com.qa',
      reports_to: 'EXE-001'
    },
    {
      id: 'GM-004',
      name: 'Gourang',
      name_ar: 'جورانج',
      title: 'GM Finance',
      title_ar: 'المدير العام للمالية',
      department: 'Finance',
      dept_code: 'FINANCE',
      photo: 'assets/employees/Gourang.jpeg',
      permissions: ['finance_approval', 'budget_authority'],
      email: 'gourang@qib.com.qa',
      reports_to: 'EXE-001'
    },
    {
      id: 'GM-005',
      name: 'Rakesh',
      name_ar: 'راكيش',
      title: 'GM Risk',
      title_ar: 'المدير العام للمخاطر',
      department: 'Risk Management',
      dept_code: 'RISK',
      photo: 'assets/employees/Rakesh.jpeg',
      permissions: ['risk_approval', 'risk_override', 'compliance_escalation'],
      email: 'rakesh@qib.com.qa',
      reports_to: 'EXE-001'
    },
    {
      id: 'GM-006',
      name: 'Dinos',
      name_ar: 'دينوس',
      title: 'GM Strategy & Projects',
      title_ar: 'المدير العام للاستراتيجية والمشاريع',
      department: 'Strategy & Projects',
      dept_code: 'STRATEGY',
      photo: 'assets/employees/DINOS.jpeg',
      permissions: ['project_owner', 'view_only'],
      email: 'dinos@qib.com.qa',
      reports_to: 'EXE-001'
    },
    {
      id: 'GM-007',
      name: 'Khalifa Al-Muslim',
      name_ar: 'خليفة المسلم',
      title: 'Head of HR Group',
      title_ar: 'رئيس مجموعة الموارد البشرية',
      department: 'Human Resources',
      dept_code: 'HR',
      photo: 'assets/employees/Khalifa.jpeg',
      permissions: ['hr_approval', 'process_owner'],
      email: 'khalifa.almuslim@qib.com.qa',
      reports_to: 'EXE-001'
    }
  ],

  // ═══════════════════════════════════════════════════════════════
  // OPERATIONS DIVISION (Under COO)
  // ═══════════════════════════════════════════════════════════════
  operations: {
    head_of_operations: {
      id: 'OPS-001',
      name: 'Mr. Amit Malhotra',
      name_ar: 'السيد أميت مالهوترا',
      title: 'Head of Operations',
      title_ar: 'رئيس العمليات',
      department: 'Operations Division',
      dept_code: 'OPS',
      photo: 'assets/employees/MR.Amit.png',
      permissions: ['full_ops_admin', 'process_owner', 'approval_authority'],
      email: 'amit.malhotra@qib.com.qa',
      reports_to: 'GM-001',
      vision_quote: 'What gets measured gets managed'
    },
    head_of_it: {
      id: 'IT-001',
      name: 'Khurram',
      name_ar: 'خرم',
      title: 'Head of IT',
      title_ar: 'رئيس تقنية المعلومات',
      department: 'Information Technology',
      dept_code: 'IT',
      photo: 'assets/employees/Khurram.jpeg',
      permissions: ['it_admin', 'process_owner', 'system_access'],
      email: 'khurram@qib.com.qa',
      reports_to: 'GM-001'
    },
    head_of_change_management: {
      id: 'CHG-001',
      name: 'Arslan',
      name_ar: 'أرسلان',
      title: 'Head of Change Management',
      title_ar: 'رئيس إدارة التغيير',
      department: 'Change Management',
      dept_code: 'CHG_MGMT',
      photo: 'assets/employees/Arslan.jpeg',
      permissions: ['change_owner', 'process_owner', 'change_approval'],
      email: 'arslan@qib.com.qa',
      reports_to: 'GM-001',
      vision_quote: 'Change is the only constant - let\'s lead it'
    },
    
    // Heads under Operations
    heads: [
      {
        id: 'OPS-HEAD-001',
        name: 'Sayed Elmahday',
        name_ar: 'سيد المهدي',
        title: 'Head of Retail & Shared Services',
        title_ar: 'رئيس خدمات الأفراد والخدمات المشتركة',
        department: 'Retail & Shared Services',
        dept_code: 'RETAIL_SVC',
        photo: 'assets/employees/sayed elmahdy.jpeg',
        permissions: ['retail_approval', 'process_owner'],
        email: 'sayed.elmahday@qib.com.qa',
        reports_to: 'OPS-001'
      },
      {
        id: 'OPS-HEAD-002',
        name: 'Adel Abu Espitan',
        name_ar: 'عادل أبو إسبيتان',
        title: 'Head of WBG Operations',
        title_ar: 'رئيس عمليات الخدمات المصرفية للشركات',
        department: 'WBG Operations',
        dept_code: 'WBG_OPS',
        photo: 'assets/employees/Adel.jpeg',
        permissions: ['wbg_approval', 'process_owner'],
        email: 'adel.abuespitan@qib.com.qa',
        reports_to: 'OPS-001'
      }
    ],
    
    // Department Managers
    managers: [
      {
        id: 'MGR-001',
        name: 'العمليات',
        name_ar: 'العمليات',
        title: 'Department Manager - WPS & DBO',
        title_ar: 'مدير إدارة - WPS والعمليات الرقمية',
        department: 'WPS & Digital Back Office',
        dept_code: 'WPS_DBO',
        photo: 'assets/employees/MR.MOHANAD ALHASSAM.jpeg',
        permissions: ['wps_owner', 'view_execute'],
        email: '',
        reports_to: 'OPS-HEAD-001',
        is_pilot: true
      },
      {
        id: 'MGR-002',
        name: 'Youssef Al-Khuzain',
        name_ar: 'يوسف الخزين',
        title: 'Department Manager - Special Services',
        title_ar: 'مدير إدارة - الخدمات الخاصة',
        department: 'Special Services',
        dept_code: 'SPECIAL_SVC',
        photo: 'assets/employees/Youssef.jpeg',
        permissions: ['view_execute'],
        email: 'youssef.alkhuzain@qib.com.qa',
        reports_to: 'OPS-HEAD-001'
      },
      {
        id: 'MGR-003',
        name: 'Qader Abdulwahab',
        name_ar: 'قادر عبدالوهاب',
        title: 'Manager - Remittance & Cheques',
        title_ar: 'مدير - التحويلات والشيكات',
        department: 'Remittance & Cheques',
        dept_code: 'REMITTANCE',
        photo: 'assets/employees/Kader.jpeg',
        permissions: ['view_execute'],
        email: 'qader.abdulwahab@qib.com.qa',
        reports_to: 'OPS-HEAD-001'
      },
      {
        id: 'MGR-004',
        name: 'Ashraf',
        name_ar: 'أشرف',
        title: 'Department Manager - Main Vault',
        title_ar: 'مدير إدارة - الخزينة الرئيسية',
        department: 'Main Vault',
        dept_code: 'VAULT',
        photo: 'assets/employees/Ashraf.jpeg',
        permissions: ['view_execute', 'vault_access'],
        email: 'ashraf@qib.com.qa',
        reports_to: 'OPS-HEAD-001'
      },
      {
        id: 'MGR-005',
        name: 'Hanaa Al-Khazai',
        name_ar: 'هناء الخزاعي',
        title: 'Manager - Cards, Government Salaries & Shareholders Dividends',
        title_ar: 'مديرة - البطاقات ورواتب الحكومة وأرباح المساهمين',
        department: 'Cards & Government Services',
        dept_code: 'CARDS',
        photo: 'assets/employees/Hanaa.jpeg',
        permissions: ['view_execute'],
        email: 'hanaa.alkhazai@qib.com.qa',
        reports_to: 'OPS-HEAD-001'
      },
      {
        id: 'MGR-006',
        name: 'Ghaleb Essam',
        name_ar: 'غالب عصام',
        title: 'Manager - CDD & EDD Operations',
        title_ar: 'مدير - عمليات CDD و EDD',
        department: 'CDD & EDD Operations',
        dept_code: 'CDD_EDD',
        photo: 'assets/employees/Ghaleb.jpeg',
        permissions: ['cdd_maker', 'cdd_checker', 'edd_operations'],
        email: 'ghaleb.essam@qib.com.qa',
        reports_to: 'OPS-HEAD-001'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // RETAIL BANKING DIVISION (Under GM Retail)
  // ═══════════════════════════════════════════════════════════════
  retail_banking: {
    segments: {
      mass: {
        id: 'SEG-MASS',
        name: 'Mass Banking',
        name_ar: 'الخدمات المصرفية العامة',
        supervisor: null, // To be assigned
        dept_code: 'MASS'
      },
      tamayuz: {
        id: 'SEG-TAMZ',
        name: 'Tamayuz Banking',
        name_ar: 'الخدمات المصرفية تميز',
        supervisor: null,
        dept_code: 'TAMAYUZ'
      },
      private: {
        id: 'SEG-PRIV',
        name: 'Private Banking',
        name_ar: 'الخدمات المصرفية الخاصة',
        supervisor: null,
        dept_code: 'PRIVATE'
      }
    },
    heads: [
      {
        id: 'HD-RET-001',
        name: 'Ayman Zain',
        name_ar: 'أيمن زين',
        title: 'Head of Division - Alternative Channels',
        title_ar: 'رئيس قسم - القنوات البديلة',
        department: 'Alternative Channels',
        dept_code: 'ALT_CHANNELS',
        photo: 'assets/employees/AYMAN_ZAIN.jpeg',
        permissions: ['channel_approval'],
        email: 'ayman.zain@qib.com.qa',
        reports_to: 'GM-002'
      },
      {
        id: 'HD-RET-002',
        name: 'Saleh',
        name_ar: 'صالح',
        title: 'Head of Division - Products',
        title_ar: 'رئيس قسم - المنتجات',
        department: 'Products',
        dept_code: 'PRODUCTS',
        photo: 'assets/employees/Saleh.jpeg',
        permissions: ['product_approval'],
        email: 'saleh@qib.com.qa',
        reports_to: 'GM-002'
      },
      {
        id: 'HD-RET-003',
        name: 'Hassan Al-Jafali',
        name_ar: 'حسن الجفالي',
        title: 'Head of Division - Branches',
        title_ar: 'رئيس قسم - الفروع',
        department: 'Branches',
        dept_code: 'BRANCHES',
        photo: 'assets/employees/HASSAN.jpeg',
        permissions: ['branch_approval'],
        email: 'hassan.aljafali@qib.com.qa',
        reports_to: 'GM-002'
      },
      {
        id: 'HD-RET-004',
        name: 'Abdulrahman Al-Nabet',
        name_ar: 'عبدالرحمن النابت',
        title: 'Head of Division - Special Services',
        title_ar: 'رئيس قسم - الخدمات الخاصة',
        department: 'Special Services',
        dept_code: 'RETAIL_SPECIAL',
        photo: 'assets/employees/NABIT.jpeg',
        permissions: ['special_services_approval'],
        email: 'abdulrahman.alnabet@qib.com.qa',
        reports_to: 'GM-002'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // IT DEPARTMENT (Under Head of IT)
  // ═══════════════════════════════════════════════════════════════
  it_department: {
    teams: [
      {
        id: 'IT-TEAM-001',
        name: 'IT Management',
        members: [
          {
            id: 'IT-002',
            name: 'Aseel',
            title: 'IT Manager',
            dept_code: 'IT_MGT',
            permissions: ['it_management'],
            email: 'aseel@qib.com.qa',
            reports_to: 'IT-001'
          }
        ]
      },
      {
        id: 'IT-TEAM-002',
        name: 'App Development',
        members: [
          {
            id: 'IT-003',
            name: 'Ashir',
            title: 'Manager App Developer',
            dept_code: 'APP_DEV',
            permissions: ['app_development'],
            email: 'ashir@qib.com.qa',
            reports_to: 'IT-001'
          },
          {
            id: 'IT-004',
            name: 'Suhail',
            title: 'WPS Support Developer',
            dept_code: 'WPS_DEV',
            permissions: ['wps_support'],
            email: 'suhail@qib.com.qa',
            reports_to: 'IT-003'
          }
        ]
      },
      {
        id: 'IT-TEAM-003',
        name: 'Core Banking (T24)',
        members: [
          {
            id: 'IT-005',
            name: 'Kaushik',
            title: 'COR System',
            dept_code: 'T24',
            permissions: ['core_banking_support'],
            email: 'kaushik@qib.com.qa',
            reports_to: 'IT-002'
          },
          {
            id: 'IT-006',
            name: 'Murali',
            title: 'COR System',
            dept_code: 'T24',
            permissions: ['core_banking_support'],
            email: 'murali@qib.com.qa',
            reports_to: 'IT-002'
          }
        ]
      },
      {
        id: 'IT-TEAM-004',
        name: 'IT Service Desk',
        members: [
          {
            id: 'IT-007',
            name: 'Sam',
            title: 'Manager IT Service Desk',
            dept_code: 'IT_SD',
            permissions: ['service_desk_management'],
            email: 'sam@qib.com.qa',
            phone: '40334444',
            reports_to: 'IT-001'
          }
        ]
      },
      {
        id: 'IT-TEAM-005',
        name: 'BO Reports & ETL',
        members: [
          {
            id: 'IT-008',
            name: 'Anees',
            title: 'Manager BO Reports & ETL',
            dept_code: 'BO_REPORTS',
            permissions: ['reports_management'],
            email: 'anees@qib.com.qa',
            reports_to: 'IT-001'
          },
          {
            id: 'IT-009',
            name: 'Miras',
            title: 'BO Reports & ETL',
            dept_code: 'BO_REPORTS',
            permissions: ['reports_analyst'],
            email: 'miras@qib.com.qa',
            reports_to: 'IT-008'
          },
          {
            id: 'IT-010',
            name: 'Ranandra',
            title: 'BO Reports',
            dept_code: 'BO_REPORTS',
            permissions: ['reports_analyst'],
            email: 'ranandra@qib.com.qa',
            reports_to: 'IT-008'
          },
          {
            id: 'IT-011',
            name: 'Sapna',
            title: 'BO Reports',
            dept_code: 'BO_REPORTS',
            permissions: ['reports_analyst'],
            email: 'sapna@qib.com.qa',
            reports_to: 'IT-008'
          }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // WPS & DBO TEAM (Under Mohanad)
  // ═══════════════════════════════════════════════════════════════
  wps_dbo_team: {
    manager: 'MGR-001',
    members: [
      {
        id: 'WPS-001',
        name: 'Syed Shah',
        name_ar: 'سيد شاه',
        title: 'Auditor',
        title_ar: 'مدقق',
        department: 'WPS & DBO',
        dept_code: 'WPS_DBO',
        photo: 'assets/employees/syed shah.jpeg',
        permissions: ['audit_view', 'wps_execute'],
        email: 'syed.shah@qib.com.qa',
        reports_to: 'MGR-001'
      },
      {
        id: 'WPS-002',
        name: 'Ahmed Zaghmout',
        name_ar: 'أحمد زغموت',
        title: 'Auditor',
        title_ar: 'مدقق',
        department: 'WPS & DBO',
        dept_code: 'WPS_DBO',
        photo: 'assets/employees/Ahmed.jpeg',
        permissions: ['audit_view', 'wps_execute'],
        email: 'ahmed.zaghmout@qib.com.qa',
        reports_to: 'MGR-001'
      },
      {
        id: 'WPS-003',
        name: 'Amer',
        name_ar: 'عامر',
        title: 'Customer Service',
        title_ar: 'خدمة العملاء',
        department: 'WPS & DBO',
        dept_code: 'WPS_DBO',
        photo: 'assets/employees/Amer.jpeg',
        permissions: ['customer_service', 'wps_execute'],
        email: 'amer@qib.com.qa',
        reports_to: 'MGR-001'
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // HR TEAM (Under Khalifa)
  // ═══════════════════════════════════════════════════════════════
  hr_team: {
    head: 'GM-007',
    members: [
      {
        id: 'HR-001',
        name: 'Mohammed Khaja',
        name_ar: 'محمد خواجة',
        title: 'Operations Manager - Rewards',
        title_ar: 'مدير عمليات - المكافآت',
        department: 'HR - Compensation & Benefits',
        dept_code: 'HR_REWARDS',
        photo: 'assets/employees/Mohammed_Khaja.jpeg',
        permissions: ['hr_rewards'],
        email: 'mohammed.khaja@qib.com.qa',
        reports_to: 'GM-007'
      },
      {
        id: 'HR-002',
        name: 'Mohammed Finos',
        title: 'Manager - Recruitment',
        department: 'HR - Talent Acquisition',
        dept_code: 'HR_RECRUIT',
        permissions: ['hr_recruitment'],
        email: 'mohammed.finos@qib.com.qa',
        reports_to: 'GM-007'
      },
      {
        id: 'HR-003',
        name: 'Rudraksh',
        title: 'Manager - Training',
        department: 'HR - Learning & Development',
        dept_code: 'HR_TRAINING',
        permissions: ['hr_training'],
        email: 'rudraksh@qib.com.qa',
        reports_to: 'GM-007'
      }
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// WORKFLOW GROUPS - For EDD Case Routing
// ═══════════════════════════════════════════════════════════════════════════

const WorkflowGroups = {
  
  // Business Groups (Segment-based)
  Business_Mass: {
    id: 'GRP-BUS-MASS',
    name: 'Business - Mass Banking',
    name_ar: 'الأعمال - الخدمات المصرفية العامة',
    type: 'business',
    segment: 'mass',
    permissions: ['edd_initiate', 'business_review'],
    tasks: ['Create EDD Case', 'Business Review', 'RM Assignment'],
    supervisor: null, // Sector Supervisor Mass
    members: [] // RMs in Mass segment
  },
  
  Business_Tamayuz: {
    id: 'GRP-BUS-TAMZ',
    name: 'Business - Tamayuz Banking',
    name_ar: 'الأعمال - تميز',
    type: 'business',
    segment: 'tamayuz',
    permissions: ['edd_initiate', 'business_review'],
    tasks: ['Create EDD Case', 'Business Review', 'RM Assignment'],
    supervisor: null,
    members: []
  },
  
  Business_Private: {
    id: 'GRP-BUS-PRIV',
    name: 'Business - Private Banking',
    name_ar: 'الأعمال - الخدمات المصرفية الخاصة',
    type: 'business',
    segment: 'private',
    permissions: ['edd_initiate', 'business_review', 'high_value_access'],
    tasks: ['Create EDD Case', 'Business Review', 'RM Assignment', 'VIP Handling'],
    supervisor: null,
    members: []
  },

  // CDD Operations Groups
  CDD_Maker: {
    id: 'GRP-CDD-MKR',
    name: 'CDD Maker',
    name_ar: 'منشئ CDD',
    type: 'cdd',
    permissions: ['cdd_create', 'cdd_edit', 'document_verification'],
    tasks: ['Document Collection', 'Data Entry', 'Initial Verification', 'Risk Assessment'],
    supervisor: 'MGR-006', // Ghaleb Essam
    members: []
  },
  
  CDD_Checker: {
    id: 'GRP-CDD-CHK',
    name: 'CDD Checker',
    name_ar: 'مدقق CDD',
    type: 'cdd',
    permissions: ['cdd_approve', 'cdd_reject', 'cdd_escalate'],
    tasks: ['Review CDD', 'Approve/Reject', 'Escalate to Compliance'],
    supervisor: 'MGR-006',
    members: []
  },

  // Compliance Group
  Compliance: {
    id: 'GRP-COMP',
    name: 'Compliance',
    name_ar: 'الامتثال',
    type: 'compliance',
    permissions: ['compliance_review', 'pep_check', 'sanctions_check', 'final_approval', 'case_escalate'],
    tasks: ['Compliance Review', 'PEP Verification', 'Sanctions Screening', 'Final Decision'],
    supervisor: 'GM-005', // GM Risk
    members: []
  },

  // Management Group
  Management: {
    id: 'GRP-MGT',
    name: 'Management',
    name_ar: 'الإدارة',
    type: 'management',
    permissions: ['dashboard_view', 'kpi_access', 'override_authority', 'case_reassign'],
    tasks: ['KPI Monitoring', 'Exception Handling', 'Resource Allocation'],
    supervisor: 'OPS-001', // Head of Operations
    members: ['OPS-001', 'OPS-HEAD-001', 'OPS-HEAD-002']
  },

  // Audit Group
  Audit: {
    id: 'GRP-AUDIT',
    name: 'Audit',
    name_ar: 'التدقيق',
    type: 'audit',
    permissions: ['audit_view', 'audit_report', 'read_only'],
    tasks: ['Audit Trail Review', 'Compliance Audit', 'Process Audit'],
    members: []
  },

  // IT Admin Group
  IT_Admin: {
    id: 'GRP-IT-ADM',
    name: 'IT Admin',
    name_ar: 'مسؤول تقنية المعلومات',
    type: 'it',
    permissions: ['system_admin', 'user_management', 'config_access'],
    tasks: ['System Configuration', 'User Access Management', 'Integration Support'],
    supervisor: 'IT-001', // Head of IT
    members: ['IT-001', 'IT-002', 'IT-003']
  },

  // Marketing Templates Group
  Marketing_Templates: {
    id: 'GRP-MKT-TPL',
    name: 'Marketing Templates',
    name_ar: 'قوالب التسويق',
    type: 'marketing',
    permissions: ['template_edit', 'notification_manage'],
    tasks: ['SMS Templates', 'Email Templates', 'Notification Management'],
    members: []
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EDD WORKFLOW ROUTING
// ═══════════════════════════════════════════════════════════════════════════

const EDDWorkflowRouting = {
  
  // Stage 1: Case Creation
  CASE_CREATED: {
    next_stages: ['BUSINESS_REVIEW'],
    routing: function(eddCase) {
      // Route to appropriate Business group based on segment
      const segment = eddCase.customer_segment;
      if (segment === 'mass') return 'Business_Mass';
      if (segment === 'tamayuz') return 'Business_Tamayuz';
      if (segment === 'private') return 'Business_Private';
      return 'Business_Mass'; // Default
    }
  },

  // Stage 2: Business Review
  BUSINESS_REVIEW: {
    maker: 'Business_*', // Segment-based
    checker: 'Business_*_Supervisor',
    next_stages: ['CDD_REVIEW'],
    on_complete: 'CDD_Maker'
  },

  // Stage 3: CDD Review
  CDD_REVIEW: {
    maker: 'CDD_Maker',
    checker: 'CDD_Checker',
    next_stages: ['COMPLIANCE_REVIEW', 'BUSINESS_REVIEW'], // Can go back
    on_approve: 'Compliance',
    on_reject: 'Business_*'
  },

  // Stage 4: Compliance Review
  COMPLIANCE_REVIEW: {
    group: 'Compliance',
    next_stages: ['APPROVED', 'REJECTED', 'ESCALATED'],
    requires_pep_check: true,
    requires_sanctions_check: true
  },

  // Stage 5: Escalation (if needed)
  ESCALATED: {
    group: 'Management',
    requires_override: true,
    next_stages: ['APPROVED', 'REJECTED']
  },

  // Final Stages
  APPROVED: {
    is_final: true,
    notify_groups: ['Business_*', 'CDD_Maker', 'Compliance']
  },
  
  REJECTED: {
    is_final: true,
    notify_groups: ['Business_*', 'CDD_Maker']
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

const OrganizationHelper = {
  
  // Get employee by ID
  getEmployeeById: function(id) {
    // Search through all organization levels
    const allEmployees = this.getAllEmployees();
    return allEmployees.find(emp => emp.id === id);
  },

  // Get all employees flat list
  getAllEmployees: function() {
    const employees = [];
    
    // Add GCEO
    employees.push(QIBOrganization.executive_management.gceo);
    
    // Add GMs
    employees.push(...QIBOrganization.general_managers);
    
    // Add Operations heads and managers
    employees.push(QIBOrganization.operations.head_of_operations);
    employees.push(QIBOrganization.operations.head_of_it);
    employees.push(...QIBOrganization.operations.heads);
    employees.push(...QIBOrganization.operations.managers);
    
    // Add Retail heads
    employees.push(...QIBOrganization.retail_banking.heads);
    
    // Add IT team
    QIBOrganization.it_department.teams.forEach(team => {
      employees.push(...team.members);
    });
    
    // Add WPS team
    employees.push(...QIBOrganization.wps_dbo_team.members);
    
    // Add HR team
    employees.push(...QIBOrganization.hr_team.members);
    
    return employees;
  },

  // Get employees by department
  getEmployeesByDepartment: function(deptCode) {
    const allEmployees = this.getAllEmployees();
    return allEmployees.filter(emp => emp.dept_code === deptCode);
  },

  // Get employees by group
  getEmployeesByGroup: function(groupId) {
    const group = WorkflowGroups[groupId];
    if (!group) return [];
    return group.members.map(id => this.getEmployeeById(id)).filter(Boolean);
  },

  // Get supervisor for employee
  getSupervisor: function(employeeId) {
    const employee = this.getEmployeeById(employeeId);
    if (!employee || !employee.reports_to) return null;
    return this.getEmployeeById(employee.reports_to);
  },

  // Get direct reports
  getDirectReports: function(supervisorId) {
    const allEmployees = this.getAllEmployees();
    return allEmployees.filter(emp => emp.reports_to === supervisorId);
  },

  // Route EDD case to appropriate group
  routeEDDCase: function(eddCase, currentStage) {
    const routing = EDDWorkflowRouting[currentStage];
    if (!routing) return null;
    
    if (typeof routing.routing === 'function') {
      return routing.routing(eddCase);
    }
    
    return routing.group || routing.maker;
  },

  // Get organization tree for visualization
  getOrganizationTree: function() {
    return {
      board: QIBOrganization.board_of_directors,
      executive: QIBOrganization.executive_management,
      gms: QIBOrganization.general_managers,
      operations: {
        head: QIBOrganization.operations.head_of_operations,
        it_head: QIBOrganization.operations.head_of_it,
        heads: QIBOrganization.operations.heads,
        managers: QIBOrganization.operations.managers
      },
      retail: QIBOrganization.retail_banking,
      it: QIBOrganization.it_department,
      wps_dbo: QIBOrganization.wps_dbo_team,
      hr: QIBOrganization.hr_team
    };
  }
};

// Export for use
if (typeof window !== 'undefined') {
  window.QIBOrganization = QIBOrganization;
  window.WorkflowGroups = WorkflowGroups;
  window.EDDWorkflowRouting = EDDWorkflowRouting;
  window.OrganizationHelper = OrganizationHelper;
}
