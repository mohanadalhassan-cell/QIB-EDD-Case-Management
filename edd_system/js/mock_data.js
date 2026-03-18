/**
 * QIB EDD Case Management System — Mock Data
 * Simulated T24, QCB API, SnapView, and DMS Data
 * Includes Risk Classification Model (ETL from Risk Engine)
 */

const EDDMockData = {
  // Current logged user (set on login)
  currentUser: null,

  // Sector Analysis Fields Configuration
  sectorAnalysisFields: {
    'PB': {
      code: 'PB',
      name: 'Private Banking',
      keyAnalysis: [
        'Wealth Source Verification',
        'Investment Activity & Trading Patterns',
        'High Value Transfer Justification',
        'PEP Status & Family Connections',
        'Beneficial Ownership & Complex Structures',
        'Cross-Border Holdings Analysis',
        'Trust & Foundation Arrangements',
        'Banking Relationship Overview'
      ],
      riskIndicators: [
        'PEP Status',
        'High Net Worth Threshold (>$1M)',
        'Private Banking Product Utilization',
        'Multiple Account Structures',
        'Frequent High-Value Transfers',
        'Complex Trust Arrangements',
        'Non-Resident Accounts',
        'Advisor/POA Arrangements'
      ],
      documents: ['Source of Wealth Statement', 'Beneficial Ownership Declaration', 'Trust Documents', 'Investment Account Statements'],
      frequency: 'Annual'
    },
    'TZ': {
      code: 'TZ',
      name: 'Tamayuz Elite',
      keyAnalysis: [
        'Employment Verification & Confirmation',
        'Salary Deposit Consistency Analysis',
        'Income vs. Expense Ratio Assessment',
        'Travel & International Activity Monitoring',
        'Credit History & Financial Stability',
        'Spending Behavior Trend Analysis',
        'Account Activity Pattern Review',
        'Professional Background Verification'
      ],
      riskIndicators: [
        'Government Employee Status',
        'Large Salary Variations',
        'Multiple Account Activity',
        'Employment-based Income Source',
        'Periodic Large Transactions',
        'Cross-Border Travel Activity',
        'Third-Party Payment Activity',
        'Investment Account Activity'
      ],
      documents: ['Employment Verification Letter', 'Salary Certificate (6 months)', 'Tax Return (Last Year)', 'Professional License/Registration'],
      frequency: 'Semi-Annual'
    },
    'MS': {
      code: 'MS',
      name: 'Mass Banking',
      keyAnalysis: [
        'Card Transaction Frequency & Amount',
        'Salary Deposit Pattern & Regularity',
        'Cash Withdrawal Behavior Assessment',
        'Domestic vs. Cross-Border Activity Ratio',
        'Account Dormancy & Active Use Patterns',
        'Biometric & KYC Data Verification',
        'Transaction Purpose & Justification',
        'Source of Large Deposits Analysis'
      ],
      riskIndicators: [
        'Cash Intensive Business Operations',
        'Non-Resident Account Status',
        'High-Risk Country Exposure',
        'Large Deposit Without Source Documentation',
        'Unusual Transaction Frequency or Amount',
        'Rapid Fund Movement',
        'Third-Party Account Access',
        'Prepaid Card Usage'
      ],
      documents: ['KYC Form (Updated)', 'ID Copy (Valid)', 'Address Proof (Recent)', 'Employment Verification'],
      frequency: 'Quarterly'
    }
  },

  // Users Database
  users: {
    'EMP001': { id: 'EMP001', name: 'العمليات', email: 'mohanad.hassan@qib.com.qa', department: 'Operations', role: 'business', segment: 'Mass' },
    'EMP002': { id: 'EMP002', name: 'Fatima Al-Mansoor', email: 'fatima.almansoor@qib.com.qa', department: 'CDD Operations', role: 'cdd', segment: null },
    'EMP003': { id: 'EMP003', name: 'Mohammed Al-Suwaidi', email: 'mohammed.alsuwaidi@qib.com.qa', department: 'Compliance', role: 'compliance', segment: null },
    'EMP004': { id: 'EMP004', name: 'Sara Al-Khalifa', email: 'sara.alkhalifa@qib.com.qa', department: 'Private Banking', role: 'business', segment: 'Private' },
    'EMP005': { id: 'EMP005', name: 'Khalid Al-Dosari', email: 'khalid.aldosari@qib.com.qa', department: 'Tamayuz Banking', role: 'business', segment: 'Tamayuz' },
    'EMP006': { id: 'EMP006', name: 'Noor Al-Mahmoud', email: 'noor.almahmoud@qib.com.qa', department: 'Audit', role: 'audit', segment: null },
    'EMP007': { id: 'EMP007', name: 'Hassan Al-Naimi', email: 'hassan.alnaimi@qib.com.qa', department: 'Management', role: 'management', segment: null },
    'EMP008': { id: 'EMP008', name: 'Layla Al-Karmi', email: 'layla.alkarmi@qib.com.qa', department: 'Call Center Operations', role: 'call_center', segment: null },
    'EMP009': { id: 'EMP009', name: 'Rashid Al-Marri', email: 'rashid.almarri@qib.com.qa', department: 'Call Center Operations', role: 'call_center', segment: null },
    'EMP010': { id: 'EMP010', name: 'Samira Al-Shammari', email: 'samira.alshammari@qib.com.qa', department: 'Call Center Management', role: 'call_center_supervisor', segment: null },
    'EMP002-SUP': { id: 'EMP002-SUP', name: 'Ghaleb Essam', email: 'ghaleb.essam@qib.com.qa', department: 'CDD/EDD Management', role: 'cdd_supervisor', segment: null }
  },

  // Customers from T24 with Risk Scores (from ETL/SnapView)
  customers: [
    {
      rim: 'RIM001234',
      name: 'Abdullah Mohammed Al-Kuwari',
      nameAr: 'عبدالله محمد الكواري',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1975-03-15',
      gender: 'Male',
      segment: 'Private',
      riskClassification: 'High',
      accountOpenDate: '2018-06-20',
      lastKYCDate: '2023-06-20',
      nextEDDDueDate: '2024-06-20',
      occupation: 'Business Owner',
      employer: 'Al-Kuwari Trading Group',
      monthlyIncome: 450000,
      email: 'abdullah.alkuwari@email.com',
      mobile: '+974 5555 1234',
      address: 'West Bay, Doha, Qatar',
      isPEP: true,
      pepDetails: { type: 'Domestic PEP', position: 'Former Minister of Commerce', country: 'Qatar' },
      isNonResident: false,
      consentQCB: true,
      triggers: ['PEP', 'Private Banking', 'High Net Worth', 'Business Owner'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK001234',
        PROD_RISK_SCORE: 90,
        PROD_RISK_CATEG: 'MEDIUM',
        ACT_RISK_SCORE: 160,
        ACT_RISK_CATEG: 'HIGH',
        OCCP_RISK_SCORE: 80,
        OCCP_RISK_CATEG: 'MEDIUM',
        COUNTRY_RISK_SCORE: 40,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 370,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Private Banking Individual',
        SECTOR: 'PB',
        SECTOR_DESC: 'Private Family',
        INDUSTRY: 'Trading',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'Private Banking Client'
      }
    },
    {
      rim: 'RIM005678',
      name: 'Mariam Hassan Al-Thani',
      nameAr: 'مريم حسن آل ثاني',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1982-08-22',
      gender: 'Female',
      segment: 'Tamayuz',
      riskClassification: 'High',
      accountOpenDate: '2019-02-10',
      lastKYCDate: '2023-08-15',
      nextEDDDueDate: '2024-08-15',
      occupation: 'Investment Manager',
      employer: 'Qatar Investment Authority',
      monthlyIncome: 85000,
      email: 'mariam.althani@qia.qa',
      mobile: '+974 5555 5678',
      address: 'The Pearl, Doha, Qatar',
      isPEP: true,
      pepDetails: { type: 'Government Official', position: 'Senior Investment Director', country: 'Qatar' },
      isNonResident: false,
      consentQCB: true,
      triggers: ['PEP', 'Source of Wealth Sensitivity', 'Large Investments'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK005678',
        PROD_RISK_SCORE: 80,
        PROD_RISK_CATEG: 'MEDIUM',
        ACT_RISK_SCORE: 120,
        ACT_RISK_CATEG: 'MEDIUM',
        OCCP_RISK_SCORE: 90,
        OCCP_RISK_CATEG: 'MEDIUM',
        COUNTRY_RISK_SCORE: 40,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 330,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Tamayuz Individual',
        SECTOR: 'TZ',
        SECTOR_DESC: 'Tamayuz Salaried',
        INDUSTRY: 'Investment',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'PEP Status'
      }
    },
    {
      rim: 'RIM009012',
      name: 'Ali Reza Mohammadi',
      nameAr: 'علي رضا محمدي',
      nationality: 'Iranian',
      nationalityCode: 'IR',
      dateOfBirth: '1968-11-05',
      gender: 'Male',
      segment: 'Mass',
      riskClassification: 'High',
      accountOpenDate: '2020-04-18',
      lastKYCDate: '2023-04-18',
      nextEDDDueDate: '2024-04-18',
      occupation: 'Import/Export Trader',
      employer: 'Self-Employed',
      monthlyIncome: 35000,
      email: 'ali.mohammadi@email.com',
      mobile: '+974 6666 9012',
      address: 'Al Sadd, Doha, Qatar',
      isPEP: false,
      pepDetails: null,
      isNonResident: true,
      consentQCB: true,
      triggers: ['High Risk Nationality', 'Non-Resident', 'Cash Intensive Business', 'Sanctioned Country Exposure'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK009012',
        PROD_RISK_SCORE: 70,
        PROD_RISK_CATEG: 'MEDIUM',
        ACT_RISK_SCORE: 180,
        ACT_RISK_CATEG: 'HIGH',
        OCCP_RISK_SCORE: 90,
        OCCP_RISK_CATEG: 'MEDIUM',
        COUNTRY_RISK_SCORE: 150,
        COUNTRY_RISK_CATEG: 'HIGH',
        FINAL_RISK_SCORE: 490,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Mass Individual',
        SECTOR: 'MS',
        SECTOR_DESC: 'Mass General',
        INDUSTRY: 'Trading',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'High Risk Nationality'
      }
    },
    {
      rim: 'RIM003456',
      name: 'Khalid bin Hamad Al-Attiyah',
      nameAr: 'خالد بن حمد العطية',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1970-05-28',
      gender: 'Male',
      segment: 'Private',
      riskClassification: 'High',
      accountOpenDate: '2015-09-12',
      lastKYCDate: '2023-09-12',
      nextEDDDueDate: '2024-09-12',
      occupation: 'Chairman',
      employer: 'Al-Attiyah Holdings',
      monthlyIncome: 800000,
      email: 'khalid.alattiyah@holdings.qa',
      mobile: '+974 5555 3456',
      address: 'Lusail City, Qatar',
      isPEP: true,
      pepDetails: { type: 'Close Associate of PEP', position: 'Business Partner of Royal Family', country: 'Qatar' },
      isNonResident: false,
      consentQCB: true,
      triggers: ['PEP', 'Private Banking', 'High Net Worth', 'Multiple Banking Relationships', 'Complex Structures'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK003456',
        PROD_RISK_SCORE: 100,
        PROD_RISK_CATEG: 'HIGH',
        ACT_RISK_SCORE: 140,
        ACT_RISK_CATEG: 'MEDIUM',
        OCCP_RISK_SCORE: 80,
        OCCP_RISK_CATEG: 'MEDIUM',
        COUNTRY_RISK_SCORE: 40,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 360,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Private Banking VIP',
        SECTOR: 'PB',
        SECTOR_DESC: 'Private (VIP-Restricted Access)',
        INDUSTRY: 'Conglomerate',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'Private Banking Client'
      }
    },
    {
      rim: 'RIM007890',
      name: 'Fatima Nasser Al-Misnad',
      nameAr: 'فاطمة ناصر المسند',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1985-12-10',
      gender: 'Female',
      segment: 'Tamayuz',
      riskClassification: 'High',
      accountOpenDate: '2021-01-25',
      lastKYCDate: '2024-01-25',
      nextEDDDueDate: '2025-01-25',
      occupation: 'Medical Doctor',
      employer: 'Hamad Medical Corporation',
      monthlyIncome: 65000,
      email: 'fatima.almisnad@hmc.qa',
      mobile: '+974 5555 7890',
      address: 'Al Dafna, Doha, Qatar',
      isPEP: false,
      pepDetails: null,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Large Initial Deposit', 'Source of Wealth - Inheritance', 'Property Investments'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK007890',
        PROD_RISK_SCORE: 60,
        PROD_RISK_CATEG: 'LOW',
        ACT_RISK_SCORE: 90,
        ACT_RISK_CATEG: 'LOW',
        OCCP_RISK_SCORE: 40,
        OCCP_RISK_CATEG: 'LOW',
        COUNTRY_RISK_SCORE: 40,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 230,
        FINAL_RISK_CATEG: 'MEDIUM',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Tamayuz Individual',
        SECTOR: 'TZ',
        SECTOR_DESC: 'Tamayuz Salaried',
        INDUSTRY: 'Healthcare',
        AUTO_HIGH_TRIGGER: false,
        TRIGGER_REASON: null
      }
    },
    {
      rim: 'RIM002345',
      name: 'Omar Saeed bin Rashid',
      nameAr: 'عمر سعيد بن راشد',
      nationality: 'Emirati',
      nationalityCode: 'AE',
      dateOfBirth: '1978-07-03',
      gender: 'Male',
      segment: 'Mass',
      riskClassification: 'High',
      accountOpenDate: '2022-03-08',
      lastKYCDate: '2023-03-08',
      nextEDDDueDate: '2024-03-08',
      occupation: 'Real Estate Developer',
      employer: 'Rashid Properties LLC',
      monthlyIncome: 150000,
      email: 'omar.rashid@rashidprop.ae',
      mobile: '+974 6666 2345',
      address: 'Al Rayyan, Qatar',
      isPEP: false,
      pepDetails: null,
      isNonResident: true,
      consentQCB: false,
      triggers: ['Non-Resident', 'High Value Transactions', 'Cross-Border Activity', 'Real Estate'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK002345',
        PROD_RISK_SCORE: 80,
        PROD_RISK_CATEG: 'MEDIUM',
        ACT_RISK_SCORE: 170,
        ACT_RISK_CATEG: 'HIGH',
        OCCP_RISK_SCORE: 70,
        OCCP_RISK_CATEG: 'MEDIUM',
        COUNTRY_RISK_SCORE: 60,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 380,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Mass Non-Resident',
        SECTOR: 'MS',
        SECTOR_DESC: 'Mass General',
        INDUSTRY: 'Real Estate',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'Non-Resident Status'
      }
    },
    {
      rim: 'RIM006789',
      name: 'Noura Ahmed Al-Ghanim',
      nameAr: 'نورة أحمد الغانم',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1990-02-14',
      gender: 'Female',
      segment: 'Mass',
      riskClassification: 'High',
      accountOpenDate: '2023-06-01',
      lastKYCDate: '2023-06-01',
      nextEDDDueDate: '2024-06-01',
      occupation: 'Entrepreneur',
      employer: 'Self-Employed',
      monthlyIncome: 45000,
      email: 'noura.alghanim@email.com',
      mobile: '+974 5555 6789',
      address: 'Msheireb, Doha, Qatar',
      isPEP: false,
      pepDetails: null,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Management Referral', 'Unusual Transaction Pattern', 'Cash Intensive'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK006789',
        PROD_RISK_SCORE: 70,
        PROD_RISK_CATEG: 'MEDIUM',
        ACT_RISK_SCORE: 190,
        ACT_RISK_CATEG: 'HIGH',
        OCCP_RISK_SCORE: 60,
        OCCP_RISK_CATEG: 'LOW',
        COUNTRY_RISK_SCORE: 40,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 360,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Mass Individual',
        SECTOR: 'MS',
        SECTOR_DESC: 'Mass General',
        INDUSTRY: 'Entrepreneurship',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'Online Account Opening'
      }
    },
    {
      rim: 'RIM008901',
      name: 'Hassan Ali Al-Hajri',
      nameAr: 'حسن علي الهاجري',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1965-09-20',
      gender: 'Male',
      segment: 'Private',
      riskClassification: 'High',
      accountOpenDate: '2010-11-15',
      lastKYCDate: '2023-11-15',
      nextEDDDueDate: '2024-11-15',
      occupation: 'Retired Government Official',
      employer: 'Retired',
      monthlyIncome: 120000,
      email: 'hassan.alhajri@email.com',
      mobile: '+974 5555 8901',
      address: 'Al Khor, Qatar',
      isPEP: true,
      pepDetails: { type: 'Former PEP', position: 'Former Undersecretary of Finance', country: 'Qatar', cessationYear: 2020 },
      isNonResident: false,
      consentQCB: true,
      triggers: ['Former PEP', 'Private Banking', 'Multiple Accounts', 'Guardian/POA'],
      // Risk Classification Model (ETL/SnapView - Exact Field Names)
      riskScores: {
        RECORD_ID: 'RSK008901',
        PROD_RISK_SCORE: 90,
        PROD_RISK_CATEG: 'MEDIUM',
        ACT_RISK_SCORE: 120,
        ACT_RISK_CATEG: 'MEDIUM',
        OCCP_RISK_SCORE: 180,
        OCCP_RISK_CATEG: 'HIGH',
        COUNTRY_RISK_SCORE: 40,
        COUNTRY_RISK_CATEG: 'LOW',
        FINAL_RISK_SCORE: 430,
        FINAL_RISK_CATEG: 'AUTO HIGH',
        LAST_SCORE_DATE: '2024-02-15',
        TARGET_DESC: 'Private Banking Individual',
        SECTOR: 'PB',
        SECTOR_DESC: 'Private Status',
        INDUSTRY: 'Government (Former)',
        AUTO_HIGH_TRIGGER: true,
        TRIGGER_REASON: 'Former PEP Status'
      }
    },
    // Additional Customers for New Cases
    {
      rim: 'RIM010234',
      name: 'Khalid Abdullah Al-Marri',
      nameAr: 'خالد عبدالله المري',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1972-06-10',
      gender: 'Male',
      segment: 'Tamayuz',
      riskClassification: 'High',
      accountOpenDate: '2019-03-15',
      lastKYCDate: '2023-03-15',
      nextEDDDueDate: '2024-03-15',
      occupation: 'Import/Export Business Owner',
      employer: 'Al-Marri Trading LLC',
      monthlyIncome: 180000,
      email: 'khalid.almarri@email.com',
      mobile: '+974 5555 0234',
      address: 'Industrial Area, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['High Value Account', 'Cross-Border Transfers', 'Correspondent Banking'],
      riskScores: { FINAL_RISK_SCORE: 320, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM011345',
      name: 'Ahmed Youssef Al-Dosari',
      nameAr: 'أحمد يوسف الدوسري',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1968-12-05',
      gender: 'Male',
      segment: 'Mass',
      riskClassification: 'High',
      accountOpenDate: '2015-07-20',
      lastKYCDate: '2023-07-20',
      nextEDDDueDate: '2024-07-20',
      occupation: 'Money Exchange Owner',
      employer: 'Al-Dosari Exchange',
      monthlyIncome: 95000,
      email: 'ahmed.dosari@email.com',
      mobile: '+974 5555 1345',
      address: 'Souq Waqif, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Sanctioned Country Adjacent', 'Cash Intensive Business', 'Third Party Payments'],
      riskScores: { FINAL_RISK_SCORE: 380, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM012456',
      name: 'Sultan Mohammed Al-Kubaisi',
      nameAr: 'سلطان محمد الكبيسي',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1975-04-18',
      gender: 'Male',
      segment: 'Private',
      riskClassification: 'Medium',
      accountOpenDate: '2017-09-10',
      lastKYCDate: '2023-09-10',
      nextEDDDueDate: '2024-09-10',
      occupation: 'Board Director',
      employer: 'Qatar National Cement Co.',
      monthlyIncome: 250000,
      email: 'sultan.kubaisi@email.com',
      mobile: '+974 5555 2456',
      address: 'West Bay, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['KYC Renewal', 'Change in Risk Profile'],
      riskScores: { FINAL_RISK_SCORE: 280, FINAL_RISK_CATEG: 'MEDIUM' }
    },
    {
      rim: 'RIM013567',
      name: 'Nasser Hamad Al-Naimi',
      nameAr: 'ناصر حمد النعيمي',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1970-08-25',
      gender: 'Male',
      segment: 'Tamayuz',
      riskClassification: 'High',
      accountOpenDate: '2016-05-12',
      lastKYCDate: '2023-05-12',
      nextEDDDueDate: '2024-05-12',
      occupation: 'Real Estate Developer',
      employer: 'Al-Naimi Properties',
      monthlyIncome: 320000,
      email: 'nasser.naimi@email.com',
      mobile: '+974 5555 3567',
      address: 'Lusail City, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Real Estate Investment', 'Large Cash Deposits', 'Multiple Accounts'],
      riskScores: { FINAL_RISK_SCORE: 340, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM014678',
      name: 'H.E. Ambassador Robert Chen',
      nameAr: 'سعادة السفير روبرت تشين',
      nationality: 'Singaporean',
      nationalityCode: 'SG',
      dateOfBirth: '1960-02-14',
      gender: 'Male',
      segment: 'Private',
      riskClassification: 'High',
      accountOpenDate: '2022-01-15',
      lastKYCDate: '2024-01-15',
      nextEDDDueDate: '2024-06-15',
      occupation: 'Diplomat',
      employer: 'Singapore Embassy Qatar',
      monthlyIncome: 150000,
      email: 'r.chen@diplomatic.sg',
      mobile: '+974 5555 4678',
      address: 'Diplomatic Area, Doha, Qatar',
      isPEP: true,
      pepDetails: { type: 'Foreign PEP', position: 'Ambassador', country: 'Singapore' },
      isNonResident: false,
      consentQCB: true,
      triggers: ['Diplomatic Status', 'Foreign Government Official', 'High Value Transfers'],
      riskScores: { FINAL_RISK_SCORE: 410, FINAL_RISK_CATEG: 'AUTO HIGH' }
    },
    {
      rim: 'RIM015789',
      name: 'Faisal Ibrahim Al-Mannai',
      nameAr: 'فيصل ابراهيم المناعي',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1965-11-30',
      gender: 'Male',
      segment: 'Private',
      riskClassification: 'High',
      accountOpenDate: '2014-04-20',
      lastKYCDate: '2023-04-20',
      nextEDDDueDate: '2024-04-20',
      occupation: 'Business Consultant',
      employer: 'Al-Mannai Consulting',
      monthlyIncome: 280000,
      email: 'faisal.mannai@email.com',
      mobile: '+974 5555 5789',
      address: 'The Pearl, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Adverse Media', 'Legal Proceedings', 'Regulatory Inquiry'],
      riskScores: { FINAL_RISK_SCORE: 450, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM016890',
      name: 'Mehdi Hassan Shirazi',
      nameAr: 'مهدي حسن شيرازي',
      nationality: 'Iranian',
      nationalityCode: 'IR',
      dateOfBirth: '1973-07-22',
      gender: 'Male',
      segment: 'Mass',
      riskClassification: 'Critical',
      accountOpenDate: '2018-10-05',
      lastKYCDate: '2023-10-05',
      nextEDDDueDate: '2024-04-05',
      occupation: 'Trade Finance Specialist',
      employer: 'Shirazi Trading Co.',
      monthlyIncome: 65000,
      email: 'mehdi.shirazi@email.com',
      mobile: '+974 5555 6890',
      address: 'Old Airport Area, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Partial Name Match - Sanctions', 'Iranian Business Partner', 'Trade Finance'],
      riskScores: { FINAL_RISK_SCORE: 520, FINAL_RISK_CATEG: 'CRITICAL' }
    },
    {
      rim: 'RIM017901',
      name: 'Saeed Abdullah Al-Malki',
      nameAr: 'سعيد عبدالله المالكي',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1980-03-08',
      gender: 'Male',
      segment: 'Mass',
      riskClassification: 'High',
      accountOpenDate: '2020-06-15',
      lastKYCDate: '2023-06-15',
      nextEDDDueDate: '2024-06-15',
      occupation: 'Retail Shop Owner',
      employer: 'Al-Malki General Trading',
      monthlyIncome: 45000,
      email: 'saeed.malki@email.com',
      mobile: '+974 5555 7901',
      address: 'Al Wakrah, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Unusual Transaction Pattern', 'Structuring Suspicion', 'Multiple Cash Deposits'],
      riskScores: { FINAL_RISK_SCORE: 380, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM018012',
      name: 'Hamza Rashid Al-Sulaiti',
      nameAr: 'حمزة راشد السليطي',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1978-09-15',
      gender: 'Male',
      segment: 'Tamayuz',
      riskClassification: 'High',
      accountOpenDate: '2024-02-10',
      lastKYCDate: '2024-02-10',
      nextEDDDueDate: '2024-08-10',
      occupation: 'Restaurant Chain Owner',
      employer: 'Al-Sulaiti Food Group',
      monthlyIncome: 200000,
      email: 'hamza.sulaiti@email.com',
      mobile: '+974 5555 8012',
      address: 'Msheireb, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['New Account High Value', 'Business Owner', 'Multiple Signatories'],
      riskScores: { FINAL_RISK_SCORE: 310, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM019123',
      name: 'Omar Saleh Al-Muhannadi',
      nameAr: 'عمر صالح المهندي',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: '1985-05-20',
      gender: 'Male',
      segment: 'Mass',
      riskClassification: 'Medium',
      accountOpenDate: '2019-08-12',
      lastKYCDate: '2023-08-12',
      nextEDDDueDate: '2024-08-12',
      occupation: 'IT Consultant',
      employer: 'Q-Tech Solutions',
      monthlyIncome: 55000,
      email: 'omar.muhannadi@email.com',
      mobile: '+974 5555 9123',
      address: 'Al Sadd, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Profession Change', 'Income Increase', 'New Property Purchase'],
      riskScores: { FINAL_RISK_SCORE: 220, FINAL_RISK_CATEG: 'MEDIUM' }
    },
    {
      rim: 'RIM020234',
      name: 'Al-Rayyan Construction Co. WLL',
      nameAr: 'شركة الريان للمقاولات ذ.م.م',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: null,
      gender: null,
      segment: 'Tamayuz',
      riskClassification: 'High',
      accountOpenDate: '2021-04-18',
      lastKYCDate: '2023-04-18',
      nextEDDDueDate: '2024-04-18',
      occupation: 'Corporate',
      employer: null,
      monthlyIncome: 850000,
      email: 'finance@alrayyan-const.qa',
      mobile: '+974 4444 0234',
      address: 'Industrial Area, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Corporate Account', 'Government Contract', 'High Monthly Turnover'],
      riskScores: { FINAL_RISK_SCORE: 340, FINAL_RISK_CATEG: 'HIGH' }
    },
    {
      rim: 'RIM021345',
      name: 'Qatar Humanitarian Foundation',
      nameAr: 'مؤسسة قطر الإنسانية',
      nationality: 'Qatari',
      nationalityCode: 'QA',
      dateOfBirth: null,
      gender: null,
      segment: 'Private',
      riskClassification: 'High',
      accountOpenDate: '2018-12-01',
      lastKYCDate: '2023-12-01',
      nextEDDDueDate: '2024-06-01',
      occupation: 'Non-Profit Organization',
      employer: null,
      monthlyIncome: 1500000,
      email: 'admin@qhf.qa',
      mobile: '+974 4444 1345',
      address: 'Al Dafna, Doha, Qatar',
      isPEP: false,
      isNonResident: false,
      consentQCB: true,
      triggers: ['Charity Organization', 'International Transfers', 'Donor Funds'],
      riskScores: { FINAL_RISK_SCORE: 360, FINAL_RISK_CATEG: 'HIGH' }
    }
  ],

  // CDD Cases - NEW Dynamic Case Management Structure
  cdd_cases: [
    // PENDING_CDD Cases
    {
      case_id: 'EDD-2026-001000',
      customer_id: 'RIM001234',
      rim: 'RIM001234',
      sector: 'PB',
      risk_level: 'HIGH',
      case_status: 'PENDING_CDD',
      created_date: '2026-02-20',
      last_updated: '2026-03-10',
      assigned_user: 'EMP002',
      maker_user: null,
      checker_user: null,
      escalated_to: null,
      case_notes: 'Initial CDD review pending. Customer profile: Private Banking VIP with PEP designation.',
      document_count: 3,
      review_frequency: 'Annual',
      customer_name: 'Abdullah Mohammed Al-Kuwari',
      triggers: ['PEP', 'Private Banking', 'High Net Worth', 'Business Owner']
    },
    {
      case_id: 'EDD-2026-001001',
      customer_id: 'RIM005678',
      rim: 'RIM005678',
      sector: 'TZ',
      risk_level: 'HIGH',
      case_status: 'PENDING_CDD',
      created_date: '2026-02-18',
      last_updated: '2026-03-09',
      assigned_user: 'EMP003',
      maker_user: null,
      checker_user: null,
      escalated_to: null,
      case_notes: 'Tamayuz segment PEP customer. Awaiting CDD review.',
      document_count: 2,
      review_frequency: 'Semi-Annual',
      customer_name: 'Mariam Hassan Al-Thani',
      triggers: ['PEP', 'Source of Wealth Sensitivity', 'Large Investments']
    },
    {
      case_id: 'EDD-2026-001002',
      customer_id: 'RIM009012',
      rim: 'RIM009012',
      sector: 'MS',
      risk_level: 'HIGH',
      case_status: 'PENDING_CDD',
      created_date: '2026-02-15',
      last_updated: '2026-03-08',
      assigned_user: 'EMP006',
      maker_user: null,
      checker_user: null,
      escalated_to: null,
      case_notes: 'High-risk nationality Non-Resident. Cash intensive business. Requires thorough CDD.',
      document_count: 4,
      review_frequency: 'Quarterly',
      customer_name: 'Ali Reza Mohammadi',
      triggers: ['High Risk Nationality', 'Non-Resident', 'Cash Intensive Business']
    },
    {
      case_id: 'EDD-2026-001003',
      customer_id: 'RIM003456',
      rim: 'RIM003456',
      sector: 'PB',
      risk_level: 'HIGH',
      case_status: 'PENDING_CDD',
      created_date: '2026-02-12',
      last_updated: '2026-03-07',
      assigned_user: 'EMP002',
      maker_user: null,
      checker_user: null,
      escalated_to: null,
      case_notes: 'PEP Close Associate. Multiple banking relationships. Complex structures.',
      document_count: 5,
      review_frequency: 'Annual',
      customer_name: 'Khalid bin Hamad Al-Attiyah',
      triggers: ['PEP', 'Private Banking', 'High Net Worth', 'Multiple Banking Relationships']
    },
    // MAKER_REVIEW Cases
    {
      case_id: 'EDD-2026-001004',
      customer_id: 'RIM007890',
      rim: 'RIM007890',
      sector: 'TZ',
      risk_level: 'MEDIUM',
      case_status: 'MAKER_REVIEW',
      created_date: '2026-02-10',
      last_updated: '2026-03-05',
      assigned_user: 'EMP003',
      maker_user: 'EMP003',
      checker_user: null,
      escalated_to: null,
      case_notes: 'Initial CDD review completed. Submitted to Maker for approval.',
      document_count: 3,
      review_frequency: 'Annual',
      customer_name: 'Fatima Nasser Al-Misnad',
      triggers: ['Government Employee', 'Sector Lead', 'Significant Assets']
    },
    // CHECKER_REVIEW Cases
    {
      case_id: 'EDD-2026-001005',
      customer_id: 'RIM008901',
      rim: 'RIM008901',
      sector: 'MS',
      risk_level: 'MEDIUM',
      case_status: 'CHECKER_REVIEW',
      created_date: '2026-02-05',
      last_updated: '2026-03-02',
      assigned_user: 'EMP002',
      maker_user: 'EMP003',
      checker_user: null,
      escalated_to: null,
      case_notes: 'Maker approved. Awaiting Checker final review and approval.',
      document_count: 4,
      review_frequency: 'Semi-Annual',
      customer_name: 'Ibrahim Mohammed Al-Shammari',
      triggers: ['Real Estate Transactions', 'Business Owner']
    },
    // COMPLETED Cases
    {
      case_id: 'EDD-2026-000999',
      customer_id: 'RIM010111',
      rim: 'RIM010111',
      sector: 'PB',
      risk_level: 'LOW',
      case_status: 'COMPLETED',
      created_date: '2026-01-15',
      last_updated: '2026-02-28',
      assigned_user: 'EMP002',
      maker_user: 'EMP002',
      checker_user: 'EMP006',
      escalated_to: null,
      case_notes: 'CDD review completed successfully. No escalation required.',
      document_count: 5,
      review_frequency: 'Annual',
      customer_name: 'Saleh Abdullah Al-Suwaidi',
      triggers: ['Low-Risk Profile']
    },
    {
      case_id: 'EDD-2026-000998',
      customer_id: 'RIM012131',
      rim: 'RIM012131',
      sector: 'TZ',
      risk_level: 'LOW',
      case_status: 'COMPLETED',
      created_date: '2026-01-10',
      last_updated: '2026-02-25',
      assigned_user: 'EMP003',
      maker_user: 'EMP003',
      checker_user: 'EMP006',
      escalated_to: null,
      case_notes: 'Routine annual CDD completed. Standard review profile.',
      document_count: 3,
      review_frequency: 'Annual',
      customer_name: 'Noor Hassan Al-Mahmoud',
      triggers: ['Standard Risk']
    }
  ],

  // EDD Cases (with organization structure integration)
  cases: [
    {
      caseId: 'EDD-2024-001234',
      rim: 'RIM001234',
      status: 'Business Review',
      stage: 'business',
      priority: 'High',
      createdDate: '2024-02-15T09:30:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['PEP', 'Private Banking', 'High Net Worth'],
      assignedTo: 'EMP004',
      assignedSegment: 'Private',
      // Organization Structure Fields
      workflowGroup: 'Business_Private',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-003', // Head of Private Banking Segment
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'], // D. Anand -> Saleem Ulhiq -> GCEO
      businessMaker: null,
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-22T09:30:00',
      slaBreach: false,
      comments: [],
      documents: ['DOC001', 'DOC002', 'DOC003'],
      recommendation: null,
      lastUpdated: '2024-02-15T09:30:00'
    },
    {
      caseId: 'EDD-2024-001235',
      rim: 'RIM005678',
      status: 'Business Maker Approved',
      stage: 'business_checker',
      priority: 'High',
      createdDate: '2024-02-10T14:20:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['PEP', 'Source of Wealth Sensitivity'],
      assignedTo: 'EMP005',
      assignedSegment: 'Tamayuz',
      // Organization Structure Fields
      workflowGroup: 'Business_Tamayuz',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-002', // Head of Tamayuz Segment
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'],
      businessMaker: { userId: 'EMP005', date: '2024-02-12T10:15:00', decision: 'Approve' },
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-17T14:20:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP005', date: '2024-02-12T10:15:00', text: 'All documents verified. PEP status confirmed. Recommend proceed to CDD.' }
      ],
      documents: ['DOC004', 'DOC005', 'DOC006'],
      recommendation: 'Proceed to CDD',
      lastUpdated: '2024-02-12T10:15:00',
      // Call Center Workflow - Sample Call Request
      callRequests: [
        {
          requestId: 'CR-1710246000123-abc1234567',
          caseId: 'EDD-2024-001235',
          status: 'In Queue',
          requestType: 'Customer Statement',
          requestedBy: 'EMP002',
          requestedByRole: 'cdd',
          requestedByName: 'Fatima Al-Mansoor',
          requestedDate: '2024-02-20T10:30:00',
          requiresApproval: false,
          approvedBy: 'EMP002-SUP',
          approvalDate: '2024-02-20T11:00:00',
          approvalNotes: 'Approved - customer clarification required on PEP source of income',
          assignedAgent: null,
          agentName: null,
          agentDepartment: null,
          callScheduledDate: '2024-02-21T14:00:00',
          callCompletedDate: null,
          callDuration: null,
          callNotes: 'Need to clarify customer\'s business structure and income sources related to PEP designation',
          customerStatement: '',
          statementType: 'Oral',
          statementLanguage: 'EN',
          recordingReference: null,
          recordingEncrypted: true,
          recordingHashKey: null,
          auditLog: [
            { action: 'REQUEST_CREATED', performedBy: 'EMP002', performedByName: 'Fatima Al-Mansoor', timestamp: '2024-02-20T10:30:00', details: 'Contact request created by Fatima Al-Mansoor (cdd)' },
            { action: 'REQUEST_APPROVED', performedBy: 'EMP002-SUP', performedByName: 'Ghaleb Essam', timestamp: '2024-02-20T11:00:00', details: 'Request approved by Ghaleb Essam. Approved - customer clarification required on PEP source of income' }
          ]
        }
      ]
    },
    {
      caseId: 'EDD-2024-001236',
      rim: 'RIM009012',
      status: 'CDD Review',
      stage: 'cdd_maker',
      priority: 'Critical',
      createdDate: '2024-02-05T08:45:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['High Risk Nationality', 'Non-Resident', 'Cash Intensive', 'Sanctioned Country'],
      assignedTo: 'EMP002',
      assignedSegment: 'Mass',
      // Organization Structure Fields
      workflowGroup: 'CDD_Maker',
      departmentId: 'OPS',
      sectorSupervisor: 'MGR-006', // Ghaleb Essam - CDD/EDD Manager
      escalationPath: ['OPS-001', 'GM-001', 'EXE-001'], // Amit Malhotra -> Saleem Ulhiq -> GCEO
      businessMaker: { userId: 'EMP001', date: '2024-02-07T11:30:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-08T09:00:00', decision: 'Approve' },
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-12T08:45:00',
      slaBreach: true,
      comments: [
        { userId: 'EMP001', date: '2024-02-07T11:30:00', text: 'Customer has Iranian nationality. Verified identity documents.' },
        { userId: 'EMP007', date: '2024-02-08T09:00:00', text: 'Business checker approved. Additional scrutiny recommended due to sanctions exposure.' }
      ],
      documents: ['DOC007', 'DOC008', 'DOC009', 'DOC010'],
      recommendation: 'Enhanced Monitoring Required',
      lastUpdated: '2024-02-08T09:00:00'
    },
    {
      caseId: 'EDD-2024-001237',
      rim: 'RIM003456',
      status: 'Pending Documents',
      stage: 'business',
      priority: 'High',
      createdDate: '2024-02-01T16:00:00',
      createdBy: 'System',
      triggerSource: 'Management Referral',
      triggers: ['PEP', 'Complex Structures', 'Multiple Banking Relationships'],
      assignedTo: 'EMP004',
      assignedSegment: 'Private',
      // Organization Structure Fields
      workflowGroup: 'Business_Private',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-003', // Head of Private Banking Segment
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'],
      businessMaker: null,
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-08T16:00:00',
      slaBreach: true,
      comments: [
        { userId: 'EMP004', date: '2024-02-03T14:20:00', text: 'Requested additional source of wealth documentation from client.' }
      ],
      documents: ['DOC011', 'DOC012'],
      recommendation: null,
      pendingDocuments: ['Source of Wealth Statement', 'Company Structure Chart'],
      lastUpdated: '2024-02-03T14:20:00'
    },
    {
      caseId: 'EDD-2024-001238',
      rim: 'RIM007890',
      status: 'Completed',
      stage: 'completed',
      priority: 'Medium',
      createdDate: '2024-01-20T10:00:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Large Initial Deposit', 'Source of Wealth - Inheritance'],
      assignedTo: 'EMP005',
      assignedSegment: 'Tamayuz',
      businessMaker: { userId: 'EMP005', date: '2024-01-22T09:30:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-01-23T11:00:00', decision: 'Approve' },
      cddMaker: { userId: 'EMP002', date: '2024-01-25T14:00:00', decision: 'Approve' },
      cddChecker: { userId: 'EMP003', date: '2024-01-26T10:30:00', decision: 'Approve' },
      slaDeadline: '2024-01-27T10:00:00',
      slaBreach: false,
      completedDate: '2024-01-26T10:30:00',
      comments: [
        { userId: 'EMP005', date: '2024-01-22T09:30:00', text: 'Inheritance documentation verified. Source of wealth confirmed.' },
        { userId: 'EMP002', date: '2024-01-25T14:00:00', text: 'EDD review complete. No adverse findings.' },
        { userId: 'EMP003', date: '2024-01-26T10:30:00', text: 'Final approval granted. Case closed.' }
      ],
      documents: ['DOC013', 'DOC014', 'DOC015', 'DOC016'],
      recommendation: 'Approved - Standard Monitoring',
      lastUpdated: '2024-01-26T10:30:00'
    },
    {
      caseId: 'EDD-2024-001239',
      rim: 'RIM002345',
      status: 'Escalated to Compliance',
      stage: 'compliance',
      priority: 'Critical',
      createdDate: '2024-02-08T11:15:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Non-Resident', 'High Value Transactions', 'Cross-Border Activity'],
      assignedTo: 'EMP003',
      assignedSegment: 'Mass',
      businessMaker: { userId: 'EMP001', date: '2024-02-10T13:45:00', decision: 'Escalate' },
      businessChecker: { userId: 'EMP007', date: '2024-02-11T09:30:00', decision: 'Escalate' },
      cddMaker: { userId: 'EMP002', date: '2024-02-13T15:00:00', decision: 'Escalate' },
      cddChecker: null,
      slaDeadline: '2024-02-15T11:15:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP001', date: '2024-02-10T13:45:00', text: 'Customer declined to provide QCB consent. Unable to verify source of funds.' },
        { userId: 'EMP002', date: '2024-02-13T15:00:00', text: 'Escalating to Compliance due to incomplete documentation and cross-border concerns.' }
      ],
      documents: ['DOC017', 'DOC018'],
      recommendation: 'Temporary Account Restriction Pending Compliance Review',
      lastUpdated: '2024-02-13T15:00:00'
    },
    {
      caseId: 'EDD-2024-001240',
      rim: 'RIM006789',
      status: 'Business Review',
      stage: 'business',
      priority: 'Medium',
      createdDate: '2024-02-14T08:00:00',
      createdBy: 'EMP007',
      triggerSource: 'Management Referral',
      triggers: ['Management Referral', 'Unusual Transaction Pattern'],
      assignedTo: 'EMP001',
      assignedSegment: 'Mass',
      businessMaker: null,
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-21T08:00:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP007', date: '2024-02-14T08:00:00', text: 'Referred by management for review of unusual cash deposit patterns.' }
      ],
      documents: ['DOC019', 'DOC020'],
      recommendation: null,
      lastUpdated: '2024-02-14T08:00:00'
    },
    {
      caseId: 'EDD-2024-001241',
      rim: 'RIM008901',
      status: 'CDD Checker Review',
      stage: 'cdd_checker',
      priority: 'High',
      createdDate: '2024-02-03T12:30:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Former PEP', 'Private Banking', 'Guardian/POA'],
      assignedTo: 'EMP003',
      assignedSegment: 'Private',
      businessMaker: { userId: 'EMP004', date: '2024-02-05T10:00:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-06T14:30:00', decision: 'Approve' },
      cddMaker: { userId: 'EMP002', date: '2024-02-10T11:00:00', decision: 'Approve' },
      cddChecker: null,
      slaDeadline: '2024-02-10T12:30:00',
      slaBreach: true,
      comments: [
        { userId: 'EMP004', date: '2024-02-05T10:00:00', text: 'Former PEP status verified. Cessation year 2020.' },
        { userId: 'EMP002', date: '2024-02-10T11:00:00', text: 'POA arrangement reviewed. Recommend approval with enhanced monitoring.' }
      ],
      documents: ['DOC021', 'DOC022', 'DOC023', 'DOC024'],
      recommendation: 'Approve with Enhanced Monitoring',
      lastUpdated: '2024-02-10T11:00:00'
    },
    // Additional CDD Pending Cases
    {
      caseId: 'EDD-2024-001242',
      rim: 'RIM010234',
      status: 'Pending CDD Review',
      stage: 'cdd_maker',
      priority: 'High',
      createdDate: '2024-02-16T10:00:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['High Value Account', 'Cross-Border Transfers', 'Correspondent Banking'],
      assignedTo: 'EMP002',
      assignedSegment: 'Tamayuz',
      workflowGroup: 'CDD_Maker',
      departmentId: 'OPS',
      sectorSupervisor: 'MGR-006',
      escalationPath: ['OPS-001', 'GM-001', 'EXE-001'],
      businessMaker: { userId: 'EMP005', date: '2024-02-17T11:30:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-18T09:00:00', decision: 'Approve' },
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-23T10:00:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP005', date: '2024-02-17T11:30:00', text: 'Customer operates import/export business with UAE and Kuwait.' }
      ],
      documents: ['DOC025', 'DOC026'],
      recommendation: null,
      lastUpdated: '2024-02-18T09:00:00'
    },
    {
      caseId: 'EDD-2024-001243',
      rim: 'RIM011345',
      status: 'Pending CDD Review',
      stage: 'cdd_maker',
      priority: 'Critical',
      createdDate: '2024-02-14T14:30:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Sanctioned Country Adjacent', 'Cash Intensive Business', 'Third Party Payments'],
      assignedTo: 'EMP002',
      assignedSegment: 'Mass',
      workflowGroup: 'CDD_Maker',
      departmentId: 'OPS',
      sectorSupervisor: 'MGR-006',
      escalationPath: ['OPS-001', 'GM-001', 'EXE-001'],
      businessMaker: { userId: 'EMP001', date: '2024-02-15T10:00:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-16T14:00:00', decision: 'Approve' },
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-21T14:30:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP001', date: '2024-02-15T10:00:00', text: 'Money exchange business with high cash volume. Documentation verified.' }
      ],
      documents: ['DOC027', 'DOC028', 'DOC029'],
      recommendation: null,
      lastUpdated: '2024-02-16T14:00:00'
    },
    {
      caseId: 'EDD-2024-001244',
      rim: 'RIM012456',
      status: 'Pending CDD Review',
      stage: 'cdd_maker',
      priority: 'Medium',
      createdDate: '2024-02-12T09:15:00',
      createdBy: 'System',
      triggerSource: 'Re-KYC Trigger',
      triggers: ['KYC Renewal', 'Change in Risk Profile'],
      assignedTo: 'EMP002',
      assignedSegment: 'Private',
      workflowGroup: 'CDD_Maker',
      departmentId: 'OPS',
      sectorSupervisor: 'MGR-006',
      escalationPath: ['OPS-001', 'GM-001', 'EXE-001'],
      businessMaker: { userId: 'EMP004', date: '2024-02-13T11:00:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-14T10:30:00', decision: 'Approve' },
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-19T09:15:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP004', date: '2024-02-13T11:00:00', text: 'Annual Re-KYC review. Customer now holds board position in listed company.' }
      ],
      documents: ['DOC030', 'DOC031'],
      recommendation: null,
      lastUpdated: '2024-02-14T10:30:00'
    },
    // Additional CDD Checker Cases
    {
      caseId: 'EDD-2024-001245',
      rim: 'RIM013567',
      status: 'CDD Checker Review',
      stage: 'cdd_checker',
      priority: 'High',
      createdDate: '2024-02-11T08:00:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Real Estate Investment', 'Large Cash Deposits', 'Multiple Accounts'],
      assignedTo: 'EMP003',
      assignedSegment: 'Tamayuz',
      businessMaker: { userId: 'EMP005', date: '2024-02-12T09:30:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-13T11:00:00', decision: 'Approve' },
      cddMaker: { userId: 'EMP002', date: '2024-02-15T14:00:00', decision: 'Approve' },
      cddChecker: null,
      slaDeadline: '2024-02-18T08:00:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP005', date: '2024-02-12T09:30:00', text: 'Real estate developer with multiple property projects.' },
        { userId: 'EMP002', date: '2024-02-15T14:00:00', text: 'Source of funds verified through property sale records.' }
      ],
      documents: ['DOC032', 'DOC033', 'DOC034'],
      recommendation: 'Approve - Enhanced Transaction Monitoring',
      lastUpdated: '2024-02-15T14:00:00'
    },
    {
      caseId: 'EDD-2024-001246',
      rim: 'RIM014678',
      status: 'CDD Checker Review',
      stage: 'cdd_checker',
      priority: 'Critical',
      createdDate: '2024-02-09T15:45:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Diplomatic Status', 'Foreign Government Official', 'High Value Transfers'],
      assignedTo: 'EMP003',
      assignedSegment: 'Private',
      businessMaker: { userId: 'EMP004', date: '2024-02-10T10:00:00', decision: 'Approve' },
      businessChecker: { userId: 'EMP007', date: '2024-02-11T09:00:00', decision: 'Approve' },
      cddMaker: { userId: 'EMP002', date: '2024-02-13T16:30:00', decision: 'Approve' },
      cddChecker: null,
      slaDeadline: '2024-02-16T15:45:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP004', date: '2024-02-10T10:00:00', text: 'Ambassador from friendly nation. Diplomatic credentials verified.' },
        { userId: 'EMP002', date: '2024-02-13T16:30:00', text: 'All PEP protocols followed. Recommend approval with senior oversight.' }
      ],
      documents: ['DOC035', 'DOC036', 'DOC037'],
      recommendation: 'Approve with Senior Management Oversight',
      lastUpdated: '2024-02-13T16:30:00'
    },
    // Additional Compliance Escalation Cases
    {
      caseId: 'EDD-2024-001247',
      rim: 'RIM015789',
      status: 'Escalated to Compliance',
      stage: 'compliance',
      priority: 'Critical',
      createdDate: '2024-02-07T11:00:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Adverse Media', 'Legal Proceedings', 'Regulatory Inquiry'],
      assignedTo: 'EMP003',
      assignedSegment: 'Private',
      businessMaker: { userId: 'EMP004', date: '2024-02-08T14:00:00', decision: 'Escalate' },
      businessChecker: { userId: 'EMP007', date: '2024-02-09T10:30:00', decision: 'Escalate' },
      cddMaker: { userId: 'EMP002', date: '2024-02-11T09:00:00', decision: 'Escalate' },
      cddChecker: null,
      slaDeadline: '2024-02-14T11:00:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP004', date: '2024-02-08T14:00:00', text: 'Customer mentioned in recent press regarding business dispute.' },
        { userId: 'EMP002', date: '2024-02-11T09:00:00', text: 'Escalating due to adverse media findings. Requires compliance assessment.' }
      ],
      documents: ['DOC038', 'DOC039', 'DOC040'],
      recommendation: 'Compliance Review Required - Adverse Media',
      lastUpdated: '2024-02-11T09:00:00'
    },
    {
      caseId: 'EDD-2024-001248',
      rim: 'RIM016890',
      status: 'Escalated to Compliance',
      stage: 'compliance',
      priority: 'Critical',
      createdDate: '2024-02-06T09:30:00',
      createdBy: 'System',
      triggerSource: 'Sanctions Alert',
      triggers: ['Partial Name Match - Sanctions', 'Iranian Business Partner', 'Trade Finance'],
      assignedTo: 'EMP003',
      assignedSegment: 'Mass',
      businessMaker: { userId: 'EMP001', date: '2024-02-07T11:00:00', decision: 'Escalate' },
      businessChecker: { userId: 'EMP007', date: '2024-02-08T10:00:00', decision: 'Escalate' },
      cddMaker: { userId: 'EMP002', date: '2024-02-10T14:00:00', decision: 'Escalate' },
      cddChecker: null,
      slaDeadline: '2024-02-13T09:30:00',
      slaBreach: true,
      comments: [
        { userId: 'EMP001', date: '2024-02-07T11:00:00', text: 'Name similarity with sanctioned individual. Requires compliance clearance.' },
        { userId: 'EMP002', date: '2024-02-10T14:00:00', text: 'Customer has business dealings with Iranian company. Immediate compliance review needed.' }
      ],
      documents: ['DOC041', 'DOC042', 'DOC043'],
      recommendation: 'Urgent Compliance Review - Sanctions Concern',
      lastUpdated: '2024-02-10T14:00:00'
    },
    {
      caseId: 'EDD-2024-001249',
      rim: 'RIM017901',
      status: 'Escalated to Compliance',
      stage: 'compliance',
      priority: 'High',
      createdDate: '2024-02-05T14:00:00',
      createdBy: 'EMP007',
      triggerSource: 'Management Referral',
      triggers: ['Unusual Transaction Pattern', 'Structuring Suspicion', 'Multiple Cash Deposits'],
      assignedTo: 'EMP003',
      assignedSegment: 'Mass',
      businessMaker: { userId: 'EMP001', date: '2024-02-06T10:30:00', decision: 'Escalate' },
      businessChecker: { userId: 'EMP007', date: '2024-02-07T09:00:00', decision: 'Escalate' },
      cddMaker: { userId: 'EMP002', date: '2024-02-09T15:00:00', decision: 'Escalate' },
      cddChecker: null,
      slaDeadline: '2024-02-12T14:00:00',
      slaBreach: true,
      comments: [
        { userId: 'EMP007', date: '2024-02-05T14:00:00', text: 'Branch reported suspicious pattern of deposits just below reporting threshold.' },
        { userId: 'EMP002', date: '2024-02-09T15:00:00', text: 'Pattern suggests potential structuring. Requires STR assessment.' }
      ],
      documents: ['DOC044', 'DOC045'],
      recommendation: 'Compliance Review - Potential STR Filing',
      lastUpdated: '2024-02-09T15:00:00'
    },
    // Additional Business Review Cases
    {
      caseId: 'EDD-2024-001250',
      rim: 'RIM018012',
      status: 'Business Review',
      stage: 'business',
      priority: 'High',
      createdDate: '2024-02-17T08:30:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['New Account High Value', 'Business Owner', 'Multiple Signatories'],
      assignedTo: 'EMP005',
      assignedSegment: 'Tamayuz',
      workflowGroup: 'Business_Tamayuz',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-002',
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'],
      businessMaker: null,
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-24T08:30:00',
      slaBreach: false,
      comments: [],
      documents: ['DOC046', 'DOC047'],
      recommendation: null,
      lastUpdated: '2024-02-17T08:30:00'
    },
    {
      caseId: 'EDD-2024-001251',
      rim: 'RIM019123',
      status: 'Business Review',
      stage: 'business',
      priority: 'Medium',
      createdDate: '2024-02-16T11:00:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Profession Change', 'Income Increase', 'New Property Purchase'],
      assignedTo: 'EMP001',
      assignedSegment: 'Mass',
      workflowGroup: 'Business_Mass',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-001',
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'],
      businessMaker: null,
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-23T11:00:00',
      slaBreach: false,
      comments: [],
      documents: ['DOC048', 'DOC049'],
      recommendation: null,
      lastUpdated: '2024-02-16T11:00:00'
    },
    {
      caseId: 'EDD-2024-001252',
      rim: 'RIM020234',
      status: 'Business Maker Approved',
      stage: 'business_checker',
      priority: 'High',
      createdDate: '2024-02-13T09:00:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Corporate Account', 'Government Contract', 'High Monthly Turnover'],
      assignedTo: 'EMP005',
      assignedSegment: 'Tamayuz',
      workflowGroup: 'Business_Tamayuz',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-002',
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'],
      businessMaker: { userId: 'EMP005', date: '2024-02-14T14:30:00', decision: 'Approve' },
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-20T09:00:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP005', date: '2024-02-14T14:30:00', text: 'Construction company with valid government contract. All documents verified.' }
      ],
      documents: ['DOC050', 'DOC051', 'DOC052'],
      recommendation: 'Proceed to Business Checker',
      lastUpdated: '2024-02-14T14:30:00'
    },
    {
      caseId: 'EDD-2024-001253',
      rim: 'RIM021345',
      status: 'Business Maker Approved',
      stage: 'business_checker',
      priority: 'Critical',
      createdDate: '2024-02-12T15:30:00',
      createdBy: 'System',
      triggerSource: 'T24/CRP',
      triggers: ['Charity Organization', 'International Transfers', 'Donor Funds'],
      assignedTo: 'EMP004',
      assignedSegment: 'Private',
      workflowGroup: 'Business_Private',
      departmentId: 'RETAIL',
      sectorSupervisor: 'RTL-003',
      escalationPath: ['GM-002', 'GM-001', 'EXE-001'],
      businessMaker: { userId: 'EMP004', date: '2024-02-13T16:00:00', decision: 'Approve' },
      businessChecker: null,
      cddMaker: null,
      cddChecker: null,
      slaDeadline: '2024-02-19T15:30:00',
      slaBreach: false,
      comments: [
        { userId: 'EMP004', date: '2024-02-13T16:00:00', text: 'Licensed charity with Qatar Red Crescent partnership. International transfers for humanitarian aid.' }
      ],
      documents: ['DOC053', 'DOC054', 'DOC055'],
      recommendation: 'Proceed to Checker - Enhanced Due Diligence Complete',
      lastUpdated: '2024-02-13T16:00:00'
    }
  ],

  // Documents (DMS/QCB)
  documents: {
    'DOC001': { id: 'DOC001', type: 'Passport', source: 'DMS', filename: 'passport_alkuwari.pdf', uploadDate: '2023-06-20', status: 'Valid', expiryDate: '2028-03-15' },
    'DOC002': { id: 'DOC002', type: 'National ID', source: 'QCB', filename: 'qid_alkuwari.pdf', uploadDate: '2023-06-20', status: 'Valid', expiryDate: '2030-03-15' },
    'DOC003': { id: 'DOC003', type: 'Company Registration', source: 'DMS', filename: 'cr_alkuwari_trading.pdf', uploadDate: '2023-06-20', status: 'Valid' },
    'DOC004': { id: 'DOC004', type: 'Passport', source: 'QCB', filename: 'passport_althani.pdf', uploadDate: '2023-08-15', status: 'Valid', expiryDate: '2029-08-22' },
    'DOC005': { id: 'DOC005', type: 'Employment Letter', source: 'DMS', filename: 'employment_qia.pdf', uploadDate: '2023-08-15', status: 'Valid' },
    'DOC006': { id: 'DOC006', type: 'Salary Certificate', source: 'QCB', filename: 'salary_althani.pdf', uploadDate: '2023-08-15', status: 'Valid' },
    'DOC007': { id: 'DOC007', type: 'Passport', source: 'DMS', filename: 'passport_mohammadi.pdf', uploadDate: '2023-04-18', status: 'Valid', expiryDate: '2026-11-05' },
    'DOC008': { id: 'DOC008', type: 'Residence Permit', source: 'DMS', filename: 'rp_mohammadi.pdf', uploadDate: '2023-04-18', status: 'Valid', expiryDate: '2025-04-18' },
    'DOC009': { id: 'DOC009', type: 'Trade License', source: 'DMS', filename: 'trade_license_mohammadi.pdf', uploadDate: '2023-04-18', status: 'Valid' },
    'DOC010': { id: 'DOC010', type: 'Bank Statement', source: 'Manual', filename: 'bank_stmt_mohammadi.pdf', uploadDate: '2024-02-05', status: 'Under Review' },
    'DOC011': { id: 'DOC011', type: 'Passport', source: 'QCB', filename: 'passport_alattiyah.pdf', uploadDate: '2023-09-12', status: 'Valid', expiryDate: '2031-05-28' },
    'DOC012': { id: 'DOC012', type: 'National ID', source: 'QCB', filename: 'qid_alattiyah.pdf', uploadDate: '2023-09-12', status: 'Valid' },
    'DOC013': { id: 'DOC013', type: 'Passport', source: 'QCB', filename: 'passport_almisnad.pdf', uploadDate: '2024-01-25', status: 'Valid' },
    'DOC014': { id: 'DOC014', type: 'Inheritance Certificate', source: 'DMS', filename: 'inheritance_almisnad.pdf', uploadDate: '2024-01-22', status: 'Valid' },
    'DOC015': { id: 'DOC015', type: 'Employment Letter', source: 'DMS', filename: 'employment_hmc.pdf', uploadDate: '2024-01-22', status: 'Valid' },
    'DOC016': { id: 'DOC016', type: 'Property Deed', source: 'DMS', filename: 'property_almisnad.pdf', uploadDate: '2024-01-22', status: 'Valid' },
    'DOC017': { id: 'DOC017', type: 'Passport', source: 'DMS', filename: 'passport_rashid.pdf', uploadDate: '2023-03-08', status: 'Valid' },
    'DOC018': { id: 'DOC018', type: 'Trade License', source: 'DMS', filename: 'trade_rashid_properties.pdf', uploadDate: '2023-03-08', status: 'Valid' },
    'DOC019': { id: 'DOC019', type: 'Passport', source: 'QCB', filename: 'passport_alghanim.pdf', uploadDate: '2023-06-01', status: 'Valid' },
    'DOC020': { id: 'DOC020', type: 'National ID', source: 'QCB', filename: 'qid_alghanim.pdf', uploadDate: '2023-06-01', status: 'Valid' },
    'DOC021': { id: 'DOC021', type: 'Passport', source: 'QCB', filename: 'passport_alhajri.pdf', uploadDate: '2023-11-15', status: 'Valid' },
    'DOC022': { id: 'DOC022', type: 'POA Document', source: 'DMS', filename: 'poa_alhajri.pdf', uploadDate: '2023-11-15', status: 'Valid' },
    'DOC023': { id: 'DOC023', type: 'Retirement Letter', source: 'DMS', filename: 'retirement_alhajri.pdf', uploadDate: '2023-11-15', status: 'Valid' },
    'DOC024': { id: 'DOC024', type: 'Investment Statement', source: 'DMS', filename: 'investment_alhajri.pdf', uploadDate: '2024-02-05', status: 'Valid' }
  },

  // Data Mismatches (T24 vs QCB)
  mismatches: {
    'RIM002345': [
      { field: 'Employer Name', t24Value: 'Rashid Properties LLC', qcbValue: 'Rashid Real Estate LLC', severity: 'Medium' },
      { field: 'Monthly Income', t24Value: 'QAR 150,000', qcbValue: 'QAR 180,000', severity: 'High' }
    ],
    'RIM009012': [
      { field: 'Address', t24Value: 'Al Sadd, Doha', qcbValue: 'Al Sadd Area, Block 24, Doha', severity: 'Low' },
      { field: 'Occupation', t24Value: 'Import/Export Trader', qcbValue: 'General Trading', severity: 'Medium' }
    ]
  },

  // Notification Templates
  notificationTemplates: [
    { id: 'TPL001', name: 'Document Request - General', channel: ['SMS', 'App'], text: 'Dear {customer_name}, QIB requires additional documents for your account. Reference: {ref_number}. Please visit any branch or upload via QIB Mobile App.' },
    { id: 'TPL002', name: 'Document Request - Urgent', channel: ['SMS', 'App'], text: 'URGENT: Dear {customer_name}, your account requires immediate document submission. Reference: {ref_number}. Failure to respond may result in account restrictions.' },
    { id: 'TPL003', name: 'Reminder - First', channel: ['SMS'], text: 'Reminder: Dear {customer_name}, pending documents for reference {ref_number}. Please submit within 7 days.' },
    { id: 'TPL004', name: 'Reminder - Final', channel: ['SMS', 'App'], text: 'FINAL REMINDER: Dear {customer_name}, your account may be restricted if documents for {ref_number} are not received within 48 hours.' },
    { id: 'TPL005', name: 'Account Restriction Notice', channel: ['SMS', 'App', 'Email'], text: 'Dear {customer_name}, your account has been temporarily restricted pending EDD review. Reference: {ref_number}. Contact your RM or visit any branch.' }
  ],

  // Sent Notifications
  sentNotifications: [
    { id: 'NOT001', caseId: 'EDD-2024-001237', rim: 'RIM003456', templateId: 'TPL001', sentDate: '2024-02-03T14:25:00', channel: 'SMS', status: 'Delivered', response: null },
    { id: 'NOT002', caseId: 'EDD-2024-001237', rim: 'RIM003456', templateId: 'TPL003', sentDate: '2024-02-10T09:00:00', channel: 'SMS', status: 'Delivered', response: null },
    { id: 'NOT003', caseId: 'EDD-2024-001239', rim: 'RIM002345', templateId: 'TPL005', sentDate: '2024-02-13T15:30:00', channel: 'SMS', status: 'Delivered', response: null },
    { id: 'NOT004', caseId: 'EDD-2024-001239', rim: 'RIM002345', templateId: 'TPL005', sentDate: '2024-02-13T15:30:00', channel: 'App', status: 'Read', response: null }
  ],

  // Audit Log
  auditLog: [
    { id: 'AUD001', timestamp: '2024-02-15T09:30:00', action: 'Case Created', caseId: 'EDD-2024-001234', userId: 'System', details: 'EDD case auto-created from T24 high-risk trigger' },
    { id: 'AUD002', timestamp: '2024-02-15T09:31:00', action: 'Case Assigned', caseId: 'EDD-2024-001234', userId: 'System', details: 'Assigned to Private Banking segment, RM: Sara Al-Khalifa' },
    { id: 'AUD003', timestamp: '2024-02-12T10:15:00', action: 'Maker Approval', caseId: 'EDD-2024-001235', userId: 'EMP005', details: 'Business maker approved case with recommendation to proceed' },
    { id: 'AUD004', timestamp: '2024-02-07T11:30:00', action: 'Maker Approval', caseId: 'EDD-2024-001236', userId: 'EMP001', details: 'Business maker approved with enhanced monitoring note' },
    { id: 'AUD005', timestamp: '2024-02-08T09:00:00', action: 'Checker Approval', caseId: 'EDD-2024-001236', userId: 'EMP007', details: 'Business checker approved, forwarded to CDD' },
    { id: 'AUD006', timestamp: '2024-02-03T14:20:00', action: 'Document Request', caseId: 'EDD-2024-001237', userId: 'EMP004', details: 'Requested Source of Wealth documentation from client' },
    { id: 'AUD007', timestamp: '2024-02-03T14:25:00', action: 'Notification Sent', caseId: 'EDD-2024-001237', userId: 'System', details: 'SMS notification sent to customer mobile' },
    { id: 'AUD008', timestamp: '2024-01-26T10:30:00', action: 'Case Completed', caseId: 'EDD-2024-001238', userId: 'EMP003', details: 'EDD case completed and closed with approval' },
    { id: 'AUD009', timestamp: '2024-02-13T15:00:00', action: 'Case Escalated', caseId: 'EDD-2024-001239', userId: 'EMP002', details: 'Escalated to Compliance due to incomplete documentation' },
    { id: 'AUD010', timestamp: '2024-02-13T15:30:00', action: 'Account Restricted', caseId: 'EDD-2024-001239', userId: 'EMP003', details: 'Temporary restriction applied pending compliance review' },
    { id: 'AUD011', timestamp: '2024-02-14T08:00:00', action: 'Case Created', caseId: 'EDD-2024-001240', userId: 'EMP007', details: 'Management referral case created for unusual activity' },
    { id: 'AUD012', timestamp: '2024-02-10T11:00:00', action: 'CDD Maker Approval', caseId: 'EDD-2024-001241', userId: 'EMP002', details: 'CDD maker approved with enhanced monitoring recommendation' }
  ],

  // =====================================================
  // JOINT ACCOUNTS DATA (Source: T24 via ETL/SnapView)
  // Exact Field Names as per ETL Header
  // =====================================================
  jointAccounts: [
    {
      ACCOUNT_NUMBER: '001-123456-001',
      ACCOUNT_TYPE: 'Savings',
      ACCOUNT_STATUS: 'Active',
      ACCOUNT_BALANCE: 500000,
      CURRENCY: 'QAR',
      BRANCH: 'West Bay',
      OPEN_DATE: '2020-03-15',
      // Joint Holders (up to 5)
      JOINT_RIM_1: 'RIM001234',      // Abdullah Mohammed Al-Kuwari (Primary)
      JOINT_RIM_2: 'RIM005678',      // Mariam Hassan Al-Thani
      JOINT_RIM_3: null,
      JOINT_RIM_4: null,
      JOINT_RIM_5: null,
      // Ownership Percentages
      JOINT_RIM_PERC: 60,
      JOINT_RIM_PERC_2: 40,
      JOINT_RIM_PERC_3: null,
      JOINT_RIM_PERC_4: null,
      JOINT_RIM_PERC_5: null
    },
    {
      ACCOUNT_NUMBER: '001-234567-002',
      ACCOUNT_TYPE: 'Current',
      ACCOUNT_STATUS: 'Active',
      ACCOUNT_BALANCE: 1200000,
      CURRENCY: 'QAR',
      BRANCH: 'The Pearl',
      OPEN_DATE: '2019-08-22',
      // Joint Holders
      JOINT_RIM_1: 'RIM003456',      // Khalid bin Hamad Al-Attiyah (Primary)
      JOINT_RIM_2: 'RIM001234',      // Abdullah Mohammed Al-Kuwari
      JOINT_RIM_3: 'RIM008901',      // Hassan Ali Al-Hajri
      JOINT_RIM_4: null,
      JOINT_RIM_5: null,
      // Ownership Percentages
      JOINT_RIM_PERC: 50,
      JOINT_RIM_PERC_2: 30,
      JOINT_RIM_PERC_3: 20,
      JOINT_RIM_PERC_4: null,
      JOINT_RIM_PERC_5: null
    },
    {
      ACCOUNT_NUMBER: '001-345678-003',
      ACCOUNT_TYPE: 'Investment',
      ACCOUNT_STATUS: 'Active',
      ACCOUNT_BALANCE: 2500000,
      CURRENCY: 'QAR',
      BRANCH: 'Lusail',
      OPEN_DATE: '2021-05-10',
      // Joint Holders
      JOINT_RIM_1: 'RIM005678',      // Mariam Hassan Al-Thani (Primary)
      JOINT_RIM_2: 'RIM007890',      // Fatima Nasser Al-Misnad
      JOINT_RIM_3: null,
      JOINT_RIM_4: null,
      JOINT_RIM_5: null,
      // Ownership Percentages
      JOINT_RIM_PERC: 70,
      JOINT_RIM_PERC_2: 30,
      JOINT_RIM_PERC_3: null,
      JOINT_RIM_PERC_4: null,
      JOINT_RIM_PERC_5: null
    },
    {
      ACCOUNT_NUMBER: '001-456789-004',
      ACCOUNT_TYPE: 'Savings',
      ACCOUNT_STATUS: 'Active',
      ACCOUNT_BALANCE: 350000,
      CURRENCY: 'QAR',
      BRANCH: 'Al Sadd',
      OPEN_DATE: '2022-01-18',
      // Joint Holders
      JOINT_RIM_1: 'RIM009012',      // Ali Reza Mohammadi (Primary)
      JOINT_RIM_2: 'RIM002345',      // Omar Saeed bin Rashid
      JOINT_RIM_3: null,
      JOINT_RIM_4: null,
      JOINT_RIM_5: null,
      // Ownership Percentages
      JOINT_RIM_PERC: 50,
      JOINT_RIM_PERC_2: 50,
      JOINT_RIM_PERC_3: null,
      JOINT_RIM_PERC_4: null,
      JOINT_RIM_PERC_5: null
    },
    {
      ACCOUNT_NUMBER: '001-567890-005',
      ACCOUNT_TYPE: 'Current',
      ACCOUNT_STATUS: 'Active',
      ACCOUNT_BALANCE: 180000,
      CURRENCY: 'QAR',
      BRANCH: 'Msheireb',
      OPEN_DATE: '2023-07-05',
      // Joint Holders
      JOINT_RIM_1: 'RIM006789',      // Noura Ahmed Al-Ghanim (Primary)
      JOINT_RIM_2: 'RIM007890',      // Fatima Nasser Al-Misnad
      JOINT_RIM_3: 'RIM005678',      // Mariam Hassan Al-Thani
      JOINT_RIM_4: null,
      JOINT_RIM_5: null,
      // Ownership Percentages
      JOINT_RIM_PERC: 40,
      JOINT_RIM_PERC_2: 35,
      JOINT_RIM_PERC_3: 25,
      JOINT_RIM_PERC_4: null,
      JOINT_RIM_PERC_5: null
    },
    {
      ACCOUNT_NUMBER: '001-678901-006',
      ACCOUNT_TYPE: 'Business',
      ACCOUNT_STATUS: 'Active',
      ACCOUNT_BALANCE: 4500000,
      CURRENCY: 'QAR',
      BRANCH: 'Lusail',
      OPEN_DATE: '2018-11-20',
      // Joint Holders (Complex Structure - 5 parties)
      JOINT_RIM_1: 'RIM003456',      // Khalid bin Hamad Al-Attiyah (Primary)
      JOINT_RIM_2: 'RIM001234',      // Abdullah Mohammed Al-Kuwari
      JOINT_RIM_3: 'RIM008901',      // Hassan Ali Al-Hajri
      JOINT_RIM_4: 'RIM005678',      // Mariam Hassan Al-Thani
      JOINT_RIM_5: 'RIM002345',      // Omar Saeed bin Rashid
      // Ownership Percentages
      JOINT_RIM_PERC: 40,
      JOINT_RIM_PERC_2: 25,
      JOINT_RIM_PERC_3: 15,
      JOINT_RIM_PERC_4: 12,
      JOINT_RIM_PERC_5: 8
    }
  ],

  // =====================================================
  // TRANSACTION ACTIVITY DATA (Source: T24/TM via ETL)
  // For EDD Review - Transaction Behavior Analysis
  // =====================================================
  transactionActivity: {
    // Customer RIM001234 - Abdullah Mohammed Al-Kuwari (High Activity)
    'RIM001234': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 450000,
      
      // Cash Activity Summary
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 2850000,
        CASH_DEPOSIT_COUNT: 45,
        AVG_CASH_DEPOSIT: 63333,
        MAX_CASH_DEPOSIT: 180000,
        MAX_CASH_DEPOSIT_DATE: '2026-01-15',
        TOTAL_CASH_WITHDRAWALS: 420000,
        CASH_WITHDRAWAL_COUNT: 18,
        AVG_CASH_WITHDRAWAL: 23333,
        CASH_INTENSIVE_FLAG: true,
        STRUCTURING_ALERT: true,
        STRUCTURING_DETAILS: '5 deposits of 45,000-49,000 QAR within 3 days'
      },
      
      // Wire Transfer Summary
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 5200000,
        INBOUND_COUNT: 28,
        INBOUND_COUNTRIES: ['UAE', 'UK', 'Turkey', 'USA', 'Switzerland'],
        INBOUND_HIGH_RISK_COUNTRIES: ['Turkey'],
        OUTBOUND_TOTAL: 3800000,
        OUTBOUND_COUNT: 15,
        OUTBOUND_COUNTRIES: ['Singapore', 'Lebanon', 'UAE', 'Switzerland'],
        OUTBOUND_HIGH_RISK_COUNTRIES: ['Lebanon'],
        HIGH_RISK_WIRE_FLAG: true,
        HIGH_RISK_WIRE_DETAILS: 'Wire to Lebanon: 450,000 QAR (Jan 2026)'
      },
      
      // Transaction Velocity
      VELOCITY: {
        CURRENT_6M_AVG: 850000,
        PREVIOUS_6M_AVG: 280000,
        VELOCITY_CHANGE_PCT: 203,
        VELOCITY_ALERT: true,
        VELOCITY_ALERT_REASON: '203% increase in transaction volume'
      },
      
      // Top Transaction Categories
      CATEGORIES: [
        { category: 'Wire Transfers', amount: 9000000, percentage: 58 },
        { category: 'Cash Deposits', amount: 2850000, percentage: 18 },
        { category: 'POS/Merchant', amount: 1200000, percentage: 8 },
        { category: 'Salary Credits', amount: 1350000, percentage: 9 },
        { category: 'Other', amount: 1100000, percentage: 7 }
      ],
      
      // Country Exposure
      COUNTRY_EXPOSURE: [
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 2500000, direction: 'BOTH' },
        { country: 'United Kingdom', code: 'GB', risk: 'LOW', amount: 1800000, direction: 'INBOUND' },
        { country: 'Turkey', code: 'TR', risk: 'MEDIUM', amount: 900000, direction: 'INBOUND' },
        { country: 'Lebanon', code: 'LB', risk: 'HIGH', amount: 450000, direction: 'OUTBOUND' },
        { country: 'Singapore', code: 'SG', risk: 'LOW', amount: 1200000, direction: 'OUTBOUND' }
      ],
      
      // Active Alerts from TM (Transaction Monitoring)
      TM_ALERTS: [
        { ALERT_ID: 'TM-2026-00145', DATE: '2026-01-15', TYPE: 'Large Cash Deposit', AMOUNT: 180000, STATUS: 'OPEN', SEVERITY: 'HIGH' },
        { ALERT_ID: 'TM-2026-00089', DATE: '2026-01-08', TYPE: 'Structuring Pattern', AMOUNT: 195000, STATUS: 'OPEN', SEVERITY: 'HIGH' },
        { ALERT_ID: 'TM-2026-00023', DATE: '2025-12-20', TYPE: 'High-Risk Country Wire', AMOUNT: 450000, STATUS: 'INVESTIGATING', SEVERITY: 'CRITICAL' },
        { ALERT_ID: 'TM-2025-01892', DATE: '2025-11-05', TYPE: 'Velocity Spike', AMOUNT: null, STATUS: 'CLOSED', SEVERITY: 'MEDIUM' }
      ],
      
      // Recent Large Transactions (> 100,000 QAR)
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-20', TYPE: 'Wire Out', AMOUNT: 280000, COUNTRY: 'Singapore', NARRATIVE: 'Investment Transfer' },
        { DATE: '2026-02-15', TYPE: 'Wire In', AMOUNT: 450000, COUNTRY: 'UAE', NARRATIVE: 'Business Payment' },
        { DATE: '2026-01-15', TYPE: 'Cash Deposit', AMOUNT: 180000, COUNTRY: 'Qatar', NARRATIVE: 'Cash Deposit - Business' },
        { DATE: '2026-01-05', TYPE: 'Wire Out', AMOUNT: 450000, COUNTRY: 'Lebanon', NARRATIVE: 'Family Support' },
        { DATE: '2025-12-28', TYPE: 'Wire In', AMOUNT: 320000, COUNTRY: 'UK', NARRATIVE: 'Property Sale Proceeds' }
      ]
    },
    
    // Customer RIM005678 - Mariam Hassan Al-Thani (PEP - Moderate Activity)
    'RIM005678': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 85000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 120000,
        CASH_DEPOSIT_COUNT: 8,
        AVG_CASH_DEPOSIT: 15000,
        MAX_CASH_DEPOSIT: 35000,
        MAX_CASH_DEPOSIT_DATE: '2025-10-12',
        TOTAL_CASH_WITHDRAWALS: 95000,
        CASH_WITHDRAWAL_COUNT: 22,
        AVG_CASH_WITHDRAWAL: 4318,
        CASH_INTENSIVE_FLAG: false,
        STRUCTURING_ALERT: false,
        STRUCTURING_DETAILS: null
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 1800000,
        INBOUND_COUNT: 12,
        INBOUND_COUNTRIES: ['UAE', 'UK', 'USA'],
        INBOUND_HIGH_RISK_COUNTRIES: [],
        OUTBOUND_TOTAL: 950000,
        OUTBOUND_COUNT: 8,
        OUTBOUND_COUNTRIES: ['UK', 'France', 'Switzerland'],
        OUTBOUND_HIGH_RISK_COUNTRIES: [],
        HIGH_RISK_WIRE_FLAG: false,
        HIGH_RISK_WIRE_DETAILS: null
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 320000,
        PREVIOUS_6M_AVG: 290000,
        VELOCITY_CHANGE_PCT: 10,
        VELOCITY_ALERT: false,
        VELOCITY_ALERT_REASON: null
      },
      
      CATEGORIES: [
        { category: 'Wire Transfers', amount: 2750000, percentage: 65 },
        { category: 'Salary Credits', amount: 1020000, percentage: 24 },
        { category: 'POS/Merchant', amount: 280000, percentage: 7 },
        { category: 'Cash', amount: 215000, percentage: 4 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 800000, direction: 'INBOUND' },
        { country: 'United Kingdom', code: 'GB', risk: 'LOW', amount: 1200000, direction: 'BOTH' },
        { country: 'France', code: 'FR', risk: 'LOW', amount: 350000, direction: 'OUTBOUND' }
      ],
      
      TM_ALERTS: [
        { ALERT_ID: 'TM-2025-01456', DATE: '2025-09-15', TYPE: 'PEP Transaction Review', AMOUNT: 250000, STATUS: 'CLOSED', SEVERITY: 'MEDIUM' }
      ],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-10', TYPE: 'Wire In', AMOUNT: 250000, COUNTRY: 'UAE', NARRATIVE: 'Investment Return' },
        { DATE: '2026-01-20', TYPE: 'Wire Out', AMOUNT: 180000, COUNTRY: 'UK', NARRATIVE: 'Property Investment' },
        { DATE: '2025-11-15', TYPE: 'Wire In', AMOUNT: 350000, COUNTRY: 'UK', NARRATIVE: 'Bonus Payment' }
      ]
    },
    
    // Customer RIM009012 - Ali Reza Mohammadi (Iranian - High Risk)
    'RIM009012': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 35000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 1450000,
        CASH_DEPOSIT_COUNT: 89,
        AVG_CASH_DEPOSIT: 16292,
        MAX_CASH_DEPOSIT: 48000,
        MAX_CASH_DEPOSIT_DATE: '2026-02-05',
        TOTAL_CASH_WITHDRAWALS: 280000,
        CASH_WITHDRAWAL_COUNT: 35,
        AVG_CASH_WITHDRAWAL: 8000,
        CASH_INTENSIVE_FLAG: true,
        STRUCTURING_ALERT: true,
        STRUCTURING_DETAILS: 'Multiple deposits just under 50,000 QAR threshold'
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 890000,
        INBOUND_COUNT: 18,
        INBOUND_COUNTRIES: ['UAE', 'Turkey', 'Oman'],
        INBOUND_HIGH_RISK_COUNTRIES: ['Turkey'],
        OUTBOUND_TOTAL: 650000,
        OUTBOUND_COUNT: 12,
        OUTBOUND_COUNTRIES: ['Turkey', 'UAE', 'Iraq'],
        OUTBOUND_HIGH_RISK_COUNTRIES: ['Turkey', 'Iraq'],
        HIGH_RISK_WIRE_FLAG: true,
        HIGH_RISK_WIRE_DETAILS: 'Multiple wires to Turkey and Iraq totaling 480,000 QAR'
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 420000,
        PREVIOUS_6M_AVG: 180000,
        VELOCITY_CHANGE_PCT: 133,
        VELOCITY_ALERT: true,
        VELOCITY_ALERT_REASON: '133% increase - Unexplained activity surge'
      },
      
      CATEGORIES: [
        { category: 'Cash Deposits', amount: 1450000, percentage: 42 },
        { category: 'Wire Transfers', amount: 1540000, percentage: 45 },
        { category: 'Salary Credits', amount: 420000, percentage: 12 },
        { category: 'Other', amount: 35000, percentage: 1 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'Turkey', code: 'TR', risk: 'MEDIUM', amount: 580000, direction: 'BOTH' },
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 450000, direction: 'BOTH' },
        { country: 'Iraq', code: 'IQ', risk: 'HIGH', amount: 180000, direction: 'OUTBOUND' },
        { country: 'Oman', code: 'OM', risk: 'LOW', amount: 120000, direction: 'INBOUND' }
      ],
      
      TM_ALERTS: [
        { ALERT_ID: 'TM-2026-00198', DATE: '2026-02-05', TYPE: 'Structuring - Cash', AMOUNT: 145000, STATUS: 'OPEN', SEVERITY: 'HIGH' },
        { ALERT_ID: 'TM-2026-00156', DATE: '2026-01-22', TYPE: 'High-Risk Country Wire', AMOUNT: 85000, STATUS: 'OPEN', SEVERITY: 'CRITICAL' },
        { ALERT_ID: 'TM-2026-00112', DATE: '2026-01-10', TYPE: 'Cash Intensive Business', AMOUNT: null, STATUS: 'INVESTIGATING', SEVERITY: 'HIGH' },
        { ALERT_ID: 'TM-2025-02234', DATE: '2025-12-15', TYPE: 'Velocity Anomaly', AMOUNT: null, STATUS: 'OPEN', SEVERITY: 'MEDIUM' },
        { ALERT_ID: 'TM-2025-02001', DATE: '2025-11-28', TYPE: 'Trade-Based Suspicion', AMOUNT: 280000, STATUS: 'ESCALATED', SEVERITY: 'CRITICAL' }
      ],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-18', TYPE: 'Wire Out', AMOUNT: 85000, COUNTRY: 'Iraq', NARRATIVE: 'Trade Payment' },
        { DATE: '2026-02-05', TYPE: 'Cash Deposit', AMOUNT: 48000, COUNTRY: 'Qatar', NARRATIVE: 'Business Cash' },
        { DATE: '2026-01-22', TYPE: 'Wire Out', AMOUNT: 120000, COUNTRY: 'Turkey', NARRATIVE: 'Supplier Payment' },
        { DATE: '2026-01-10', TYPE: 'Wire In', AMOUNT: 180000, COUNTRY: 'UAE', NARRATIVE: 'Trade Receivable' }
      ]
    },
    
    // Customer RIM003456 - Khalid bin Hamad Al-Attiyah (VIP - Private Banking)
    'RIM003456': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 800000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 350000,
        CASH_DEPOSIT_COUNT: 12,
        AVG_CASH_DEPOSIT: 29167,
        MAX_CASH_DEPOSIT: 85000,
        MAX_CASH_DEPOSIT_DATE: '2025-12-20',
        TOTAL_CASH_WITHDRAWALS: 580000,
        CASH_WITHDRAWAL_COUNT: 28,
        AVG_CASH_WITHDRAWAL: 20714,
        CASH_INTENSIVE_FLAG: false,
        STRUCTURING_ALERT: false,
        STRUCTURING_DETAILS: null
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 12500000,
        INBOUND_COUNT: 45,
        INBOUND_COUNTRIES: ['UAE', 'UK', 'USA', 'Switzerland', 'Singapore', 'Luxembourg'],
        INBOUND_HIGH_RISK_COUNTRIES: [],
        OUTBOUND_TOTAL: 8900000,
        OUTBOUND_COUNT: 32,
        OUTBOUND_COUNTRIES: ['UK', 'USA', 'Switzerland', 'Monaco', 'France'],
        OUTBOUND_HIGH_RISK_COUNTRIES: [],
        HIGH_RISK_WIRE_FLAG: false,
        HIGH_RISK_WIRE_DETAILS: null
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 2100000,
        PREVIOUS_6M_AVG: 1850000,
        VELOCITY_CHANGE_PCT: 14,
        VELOCITY_ALERT: false,
        VELOCITY_ALERT_REASON: null
      },
      
      CATEGORIES: [
        { category: 'Wire Transfers', amount: 21400000, percentage: 88 },
        { category: 'Investment Transactions', amount: 1800000, percentage: 7 },
        { category: 'POS/Merchant', amount: 650000, percentage: 3 },
        { category: 'Cash', amount: 930000, percentage: 2 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'United Kingdom', code: 'GB', risk: 'LOW', amount: 5200000, direction: 'BOTH' },
        { country: 'Switzerland', code: 'CH', risk: 'LOW', amount: 4800000, direction: 'BOTH' },
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 3500000, direction: 'INBOUND' },
        { country: 'USA', code: 'US', risk: 'LOW', amount: 2800000, direction: 'BOTH' },
        { country: 'Monaco', code: 'MC', risk: 'LOW', amount: 1200000, direction: 'OUTBOUND' }
      ],
      
      TM_ALERTS: [
        { ALERT_ID: 'TM-2025-00892', DATE: '2025-08-10', TYPE: 'Large Value Transfer', AMOUNT: 2500000, STATUS: 'CLOSED', SEVERITY: 'LOW' }
      ],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-25', TYPE: 'Wire Out', AMOUNT: 1500000, COUNTRY: 'Switzerland', NARRATIVE: 'Investment Fund' },
        { DATE: '2026-02-18', TYPE: 'Wire In', AMOUNT: 2200000, COUNTRY: 'UAE', NARRATIVE: 'Business Dividend' },
        { DATE: '2026-02-05', TYPE: 'Wire Out', AMOUNT: 850000, COUNTRY: 'UK', NARRATIVE: 'Property Payment' },
        { DATE: '2026-01-22', TYPE: 'Wire In', AMOUNT: 1800000, COUNTRY: 'UK', NARRATIVE: 'Sale Proceeds' }
      ]
    },
    
    // Customer RIM007890 - Fatima Nasser Al-Misnad (Low Activity - Normal)
    'RIM007890': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 65000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 45000,
        CASH_DEPOSIT_COUNT: 5,
        AVG_CASH_DEPOSIT: 9000,
        MAX_CASH_DEPOSIT: 18000,
        MAX_CASH_DEPOSIT_DATE: '2025-11-05',
        TOTAL_CASH_WITHDRAWALS: 125000,
        CASH_WITHDRAWAL_COUNT: 45,
        AVG_CASH_WITHDRAWAL: 2778,
        CASH_INTENSIVE_FLAG: false,
        STRUCTURING_ALERT: false,
        STRUCTURING_DETAILS: null
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 280000,
        INBOUND_COUNT: 5,
        INBOUND_COUNTRIES: ['UK', 'USA'],
        INBOUND_HIGH_RISK_COUNTRIES: [],
        OUTBOUND_TOTAL: 185000,
        OUTBOUND_COUNT: 8,
        OUTBOUND_COUNTRIES: ['UK', 'UAE'],
        OUTBOUND_HIGH_RISK_COUNTRIES: [],
        HIGH_RISK_WIRE_FLAG: false,
        HIGH_RISK_WIRE_DETAILS: null
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 95000,
        PREVIOUS_6M_AVG: 88000,
        VELOCITY_CHANGE_PCT: 8,
        VELOCITY_ALERT: false,
        VELOCITY_ALERT_REASON: null
      },
      
      CATEGORIES: [
        { category: 'Salary Credits', amount: 780000, percentage: 58 },
        { category: 'Wire Transfers', amount: 465000, percentage: 35 },
        { category: 'POS/Merchant', amount: 65000, percentage: 5 },
        { category: 'Cash', amount: 170000, percentage: 2 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'United Kingdom', code: 'GB', risk: 'LOW', amount: 320000, direction: 'BOTH' },
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 85000, direction: 'OUTBOUND' }
      ],
      
      TM_ALERTS: [],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-01-15', TYPE: 'Wire In', AMOUNT: 120000, COUNTRY: 'UK', NARRATIVE: 'Inheritance' }
      ]
    },
    
    // Customer RIM002345 - Omar Saeed bin Rashid (Non-Resident - Real Estate)
    'RIM002345': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 150000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 580000,
        CASH_DEPOSIT_COUNT: 22,
        AVG_CASH_DEPOSIT: 26364,
        MAX_CASH_DEPOSIT: 95000,
        MAX_CASH_DEPOSIT_DATE: '2026-01-28',
        TOTAL_CASH_WITHDRAWALS: 220000,
        CASH_WITHDRAWAL_COUNT: 15,
        AVG_CASH_WITHDRAWAL: 14667,
        CASH_INTENSIVE_FLAG: false,
        STRUCTURING_ALERT: false,
        STRUCTURING_DETAILS: null
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 4200000,
        INBOUND_COUNT: 18,
        INBOUND_COUNTRIES: ['UAE', 'Bahrain', 'KSA'],
        INBOUND_HIGH_RISK_COUNTRIES: [],
        OUTBOUND_TOTAL: 2800000,
        OUTBOUND_COUNT: 12,
        OUTBOUND_COUNTRIES: ['UAE', 'Qatar', 'Oman'],
        OUTBOUND_HIGH_RISK_COUNTRIES: [],
        HIGH_RISK_WIRE_FLAG: false,
        HIGH_RISK_WIRE_DETAILS: null
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 680000,
        PREVIOUS_6M_AVG: 420000,
        VELOCITY_CHANGE_PCT: 62,
        VELOCITY_ALERT: true,
        VELOCITY_ALERT_REASON: '62% increase - Real estate activity'
      },
      
      CATEGORIES: [
        { category: 'Wire Transfers', amount: 7000000, percentage: 82 },
        { category: 'Cash Deposits', amount: 580000, percentage: 7 },
        { category: 'Real Estate Related', amount: 650000, percentage: 8 },
        { category: 'Other', amount: 270000, percentage: 3 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 4500000, direction: 'BOTH' },
        { country: 'Bahrain', code: 'BH', risk: 'LOW', amount: 1200000, direction: 'INBOUND' },
        { country: 'KSA', code: 'SA', risk: 'LOW', amount: 800000, direction: 'INBOUND' }
      ],
      
      TM_ALERTS: [
        { ALERT_ID: 'TM-2026-00078', DATE: '2026-01-28', TYPE: 'Large Cash Deposit', AMOUNT: 95000, STATUS: 'CLOSED', SEVERITY: 'LOW' },
        { ALERT_ID: 'TM-2025-01789', DATE: '2025-10-15', TYPE: 'Cross-Border Pattern', AMOUNT: null, STATUS: 'CLOSED', SEVERITY: 'MEDIUM' }
      ],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-22', TYPE: 'Wire In', AMOUNT: 850000, COUNTRY: 'UAE', NARRATIVE: 'Property Sale' },
        { DATE: '2026-02-10', TYPE: 'Wire Out', AMOUNT: 650000, COUNTRY: 'Qatar', NARRATIVE: 'Property Purchase' },
        { DATE: '2026-01-28', TYPE: 'Cash Deposit', AMOUNT: 95000, COUNTRY: 'Qatar', NARRATIVE: 'Rental Income' }
      ]
    },
    
    // Customer RIM006789 - Noura Ahmed Al-Ghanim (Unusual Pattern)
    'RIM006789': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 45000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 890000,
        CASH_DEPOSIT_COUNT: 68,
        AVG_CASH_DEPOSIT: 13088,
        MAX_CASH_DEPOSIT: 49500,
        MAX_CASH_DEPOSIT_DATE: '2026-02-12',
        TOTAL_CASH_WITHDRAWALS: 180000,
        CASH_WITHDRAWAL_COUNT: 25,
        AVG_CASH_WITHDRAWAL: 7200,
        CASH_INTENSIVE_FLAG: true,
        STRUCTURING_ALERT: true,
        STRUCTURING_DETAILS: 'Regular deposits just under 50,000 QAR reporting threshold'
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 420000,
        INBOUND_COUNT: 8,
        INBOUND_COUNTRIES: ['UAE', 'Kuwait'],
        INBOUND_HIGH_RISK_COUNTRIES: [],
        OUTBOUND_TOTAL: 380000,
        OUTBOUND_COUNT: 12,
        OUTBOUND_COUNTRIES: ['UAE', 'Turkey', 'Egypt'],
        OUTBOUND_HIGH_RISK_COUNTRIES: ['Turkey'],
        HIGH_RISK_WIRE_FLAG: true,
        HIGH_RISK_WIRE_DETAILS: 'Wire to Turkey: 85,000 QAR'
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 285000,
        PREVIOUS_6M_AVG: 68000,
        VELOCITY_CHANGE_PCT: 319,
        VELOCITY_ALERT: true,
        VELOCITY_ALERT_REASON: '319% increase - Requires immediate investigation'
      },
      
      CATEGORIES: [
        { category: 'Cash Deposits', amount: 890000, percentage: 47 },
        { category: 'Wire Transfers', amount: 800000, percentage: 42 },
        { category: 'Salary Credits', amount: 180000, percentage: 10 },
        { category: 'Other', amount: 20000, percentage: 1 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 520000, direction: 'BOTH' },
        { country: 'Turkey', code: 'TR', risk: 'MEDIUM', amount: 85000, direction: 'OUTBOUND' },
        { country: 'Kuwait', code: 'KW', risk: 'LOW', amount: 120000, direction: 'INBOUND' },
        { country: 'Egypt', code: 'EG', risk: 'LOW', amount: 95000, direction: 'OUTBOUND' }
      ],
      
      TM_ALERTS: [
        { ALERT_ID: 'TM-2026-00212', DATE: '2026-02-12', TYPE: 'Structuring - Cash', AMOUNT: 148500, STATUS: 'OPEN', SEVERITY: 'HIGH' },
        { ALERT_ID: 'TM-2026-00178', DATE: '2026-02-01', TYPE: 'Velocity Anomaly', AMOUNT: null, STATUS: 'OPEN', SEVERITY: 'CRITICAL' },
        { ALERT_ID: 'TM-2026-00145', DATE: '2026-01-18', TYPE: 'Income Mismatch', AMOUNT: null, STATUS: 'INVESTIGATING', SEVERITY: 'HIGH' },
        { ALERT_ID: 'TM-2026-00098', DATE: '2026-01-05', TYPE: 'Unusual Activity', AMOUNT: null, STATUS: 'OPEN', SEVERITY: 'MEDIUM' }
      ],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-12', TYPE: 'Cash Deposit', AMOUNT: 49500, COUNTRY: 'Qatar', NARRATIVE: 'Business Cash' },
        { DATE: '2026-02-08', TYPE: 'Cash Deposit', AMOUNT: 49000, COUNTRY: 'Qatar', NARRATIVE: 'Business Cash' },
        { DATE: '2026-02-05', TYPE: 'Cash Deposit', AMOUNT: 50000, COUNTRY: 'Qatar', NARRATIVE: 'Business Cash' },
        { DATE: '2026-01-25', TYPE: 'Wire Out', AMOUNT: 85000, COUNTRY: 'Turkey', NARRATIVE: 'Investment' }
      ]
    },
    
    // Customer RIM008901 - Hassan Ali Al-Hajri (Former PEP - Stable)
    'RIM008901': {
      PERIOD_START: '2025-03-01',
      PERIOD_END: '2026-02-28',
      ANALYSIS_PERIOD_MONTHS: 12,
      DECLARED_MONTHLY_INCOME: 120000,
      
      CASH_ACTIVITY: {
        TOTAL_CASH_DEPOSITS: 180000,
        CASH_DEPOSIT_COUNT: 10,
        AVG_CASH_DEPOSIT: 18000,
        MAX_CASH_DEPOSIT: 45000,
        MAX_CASH_DEPOSIT_DATE: '2025-09-15',
        TOTAL_CASH_WITHDRAWALS: 320000,
        CASH_WITHDRAWAL_COUNT: 35,
        AVG_CASH_WITHDRAWAL: 9143,
        CASH_INTENSIVE_FLAG: false,
        STRUCTURING_ALERT: false,
        STRUCTURING_DETAILS: null
      },
      
      WIRE_TRANSFERS: {
        INBOUND_TOTAL: 1650000,
        INBOUND_COUNT: 18,
        INBOUND_COUNTRIES: ['UAE', 'UK', 'Jordan'],
        INBOUND_HIGH_RISK_COUNTRIES: [],
        OUTBOUND_TOTAL: 980000,
        OUTBOUND_COUNT: 12,
        OUTBOUND_COUNTRIES: ['UK', 'UAE', 'Egypt'],
        OUTBOUND_HIGH_RISK_COUNTRIES: [],
        HIGH_RISK_WIRE_FLAG: false,
        HIGH_RISK_WIRE_DETAILS: null
      },
      
      VELOCITY: {
        CURRENT_6M_AVG: 280000,
        PREVIOUS_6M_AVG: 265000,
        VELOCITY_CHANGE_PCT: 6,
        VELOCITY_ALERT: false,
        VELOCITY_ALERT_REASON: null
      },
      
      CATEGORIES: [
        { category: 'Wire Transfers', amount: 2630000, percentage: 68 },
        { category: 'Salary/Pension', amount: 720000, percentage: 19 },
        { category: 'POS/Merchant', amount: 280000, percentage: 7 },
        { category: 'Cash', amount: 500000, percentage: 6 }
      ],
      
      COUNTRY_EXPOSURE: [
        { country: 'UAE', code: 'AE', risk: 'LOW', amount: 1100000, direction: 'BOTH' },
        { country: 'United Kingdom', code: 'GB', risk: 'LOW', amount: 850000, direction: 'BOTH' },
        { country: 'Jordan', code: 'JO', risk: 'LOW', amount: 350000, direction: 'INBOUND' }
      ],
      
      TM_ALERTS: [
        { ALERT_ID: 'TM-2025-00456', DATE: '2025-06-20', TYPE: 'Former PEP Review', AMOUNT: null, STATUS: 'CLOSED', SEVERITY: 'LOW' }
      ],
      
      LARGE_TRANSACTIONS: [
        { DATE: '2026-02-15', TYPE: 'Wire In', AMOUNT: 280000, COUNTRY: 'UAE', NARRATIVE: 'Investment Return' },
        { DATE: '2026-01-08', TYPE: 'Wire Out', AMOUNT: 150000, COUNTRY: 'UK', NARRATIVE: 'Family Support' },
        { DATE: '2025-12-20', TYPE: 'Wire In', AMOUNT: 185000, COUNTRY: 'UK', NARRATIVE: 'Consultancy Fee' }
      ]
    }
  },

  // Dashboard Statistics
  getStatistics: function() {
    const cases = this.cases;
    return {
      totalCases: cases.length,
      newCases: cases.filter(c => c.status === 'Business Review').length,
      inProgress: cases.filter(c => !['Completed', 'Business Review'].includes(c.status)).length,
      completed: cases.filter(c => c.status === 'Completed').length,
      escalated: cases.filter(c => c.status.includes('Escalated')).length,
      slaBreach: cases.filter(c => c.slaBreach).length,
      bySegment: {
        Mass: cases.filter(c => c.assignedSegment === 'Mass').length,
        Tamayuz: cases.filter(c => c.assignedSegment === 'Tamayuz').length,
        Private: cases.filter(c => c.assignedSegment === 'Private').length
      },
      byPriority: {
        Critical: cases.filter(c => c.priority === 'Critical').length,
        High: cases.filter(c => c.priority === 'High').length,
        Medium: cases.filter(c => c.priority === 'Medium').length
      },
      pepCases: cases.filter(c => c.triggers.some(t => t.includes('PEP'))).length
    };
  },

  // Helper Functions
  getCustomerByRIM: function(rim) {
    return this.customers.find(c => c.rim === rim);
  },

  getCaseById: function(caseId) {
    return this.cases.find(c => c.caseId === caseId);
  },

  getCasesBySegment: function(segment) {
    return this.cases.filter(c => c.assignedSegment === segment);
  },

  getCasesByUser: function(userId) {
    return this.cases.filter(c => c.assignedTo === userId);
  },

  getCasesByStage: function(stage) {
    return this.cases.filter(c => c.stage === stage);
  },

  // =====================================================
  // JOINT ACCOUNT HELPER FUNCTIONS
  // =====================================================
  
  // Get all joint accounts where customer RIM appears
  getJointAccountsByRIM: function(rim) {
    return this.jointAccounts.filter(acc => 
      acc.JOINT_RIM_1 === rim ||
      acc.JOINT_RIM_2 === rim ||
      acc.JOINT_RIM_3 === rim ||
      acc.JOINT_RIM_4 === rim ||
      acc.JOINT_RIM_5 === rim
    );
  },

  // Get customer's role and ownership in a joint account
  getJointAccountRole: function(account, rim) {
    if (account.JOINT_RIM_1 === rim) {
      return { role: 'Primary Holder', position: 1, percentage: account.JOINT_RIM_PERC };
    } else if (account.JOINT_RIM_2 === rim) {
      return { role: 'Joint Holder', position: 2, percentage: account.JOINT_RIM_PERC_2 };
    } else if (account.JOINT_RIM_3 === rim) {
      return { role: 'Joint Holder', position: 3, percentage: account.JOINT_RIM_PERC_3 };
    } else if (account.JOINT_RIM_4 === rim) {
      return { role: 'Joint Holder', position: 4, percentage: account.JOINT_RIM_PERC_4 };
    } else if (account.JOINT_RIM_5 === rim) {
      return { role: 'Joint Holder', position: 5, percentage: account.JOINT_RIM_PERC_5 };
    }
    return null;
  },

  // Calculate total joint account exposure for a customer
  getJointExposure: function(rim) {
    const jointAccounts = this.getJointAccountsByRIM(rim);
    let totalExposure = 0;
    const details = [];

    jointAccounts.forEach(acc => {
      const roleInfo = this.getJointAccountRole(acc, rim);
      if (roleInfo && roleInfo.percentage) {
        const exposure = (acc.ACCOUNT_BALANCE * roleInfo.percentage) / 100;
        totalExposure += exposure;
        details.push({
          ACCOUNT_NUMBER: acc.ACCOUNT_NUMBER,
          ACCOUNT_TYPE: acc.ACCOUNT_TYPE,
          ACCOUNT_STATUS: acc.ACCOUNT_STATUS,
          ACCOUNT_BALANCE: acc.ACCOUNT_BALANCE,
          CURRENCY: acc.CURRENCY,
          BRANCH: acc.BRANCH,
          OPEN_DATE: acc.OPEN_DATE,
          CUSTOMER_ROLE: roleInfo.role,
          CUSTOMER_POSITION: roleInfo.position,
          OWNERSHIP_PERCENTAGE: roleInfo.percentage,
          CUSTOMER_EXPOSURE: exposure,
          // Include all joint holders info
          JOINT_RIM_1: acc.JOINT_RIM_1,
          JOINT_RIM_2: acc.JOINT_RIM_2,
          JOINT_RIM_3: acc.JOINT_RIM_3,
          JOINT_RIM_4: acc.JOINT_RIM_4,
          JOINT_RIM_5: acc.JOINT_RIM_5,
          JOINT_RIM_PERC: acc.JOINT_RIM_PERC,
          JOINT_RIM_PERC_2: acc.JOINT_RIM_PERC_2,
          JOINT_RIM_PERC_3: acc.JOINT_RIM_PERC_3,
          JOINT_RIM_PERC_4: acc.JOINT_RIM_PERC_4,
          JOINT_RIM_PERC_5: acc.JOINT_RIM_PERC_5
        });
      }
    });

    return {
      TOTAL_JOINT_ACCOUNTS: jointAccounts.length,
      TOTAL_EXPOSURE: totalExposure,
      ACCOUNTS: details
    };
  },

  // Get name for a RIM (for display purposes)
  getCustomerNameByRIM: function(rim) {
    const customer = this.getCustomerByRIM(rim);
    return customer ? customer.name : rim;
  },

  // =====================================================
  // TRANSACTION ACTIVITY HELPER FUNCTIONS
  // =====================================================
  
  // Get transaction activity for a customer
  getTransactionActivity: function(rim) {
    return this.transactionActivity[rim] || null;
  },

  // Get transaction summary with alerts
  getTransactionSummary: function(rim) {
    const activity = this.getTransactionActivity(rim);
    const customer = this.getCustomerByRIM(rim);
    
    if (!activity) {
      return {
        hasData: false,
        message: 'No transaction data available'
      };
    }

    // Calculate totals
    const totalInflow = activity.CASH_ACTIVITY.TOTAL_CASH_DEPOSITS + activity.WIRE_TRANSFERS.INBOUND_TOTAL;
    const totalOutflow = activity.CASH_ACTIVITY.TOTAL_CASH_WITHDRAWALS + activity.WIRE_TRANSFERS.OUTBOUND_TOTAL;
    const declaredAnnualIncome = activity.DECLARED_MONTHLY_INCOME * 12;
    
    // Build summary
    const summary = {
      hasData: true,
      PERIOD_START: activity.PERIOD_START,
      PERIOD_END: activity.PERIOD_END,
      DECLARED_MONTHLY_INCOME: activity.DECLARED_MONTHLY_INCOME,
      DECLARED_ANNUAL_INCOME: declaredAnnualIncome,
      
      // Totals
      TOTAL_INFLOW: totalInflow,
      TOTAL_OUTFLOW: totalOutflow,
      NET_FLOW: totalInflow - totalOutflow,
      
      // Cash Activity
      CASH_ACTIVITY: activity.CASH_ACTIVITY,
      
      // Wire Transfers
      WIRE_TRANSFERS: activity.WIRE_TRANSFERS,
      
      // Velocity
      VELOCITY: activity.VELOCITY,
      
      // Categories
      CATEGORIES: activity.CATEGORIES,
      
      // Country Exposure
      COUNTRY_EXPOSURE: activity.COUNTRY_EXPOSURE,
      
      // Alerts
      TM_ALERTS: activity.TM_ALERTS,
      OPEN_ALERTS_COUNT: activity.TM_ALERTS.filter(a => a.STATUS === 'OPEN' || a.STATUS === 'INVESTIGATING').length,
      CRITICAL_ALERTS_COUNT: activity.TM_ALERTS.filter(a => a.SEVERITY === 'CRITICAL' && a.STATUS !== 'CLOSED').length,
      
      // Large Transactions
      LARGE_TRANSACTIONS: activity.LARGE_TRANSACTIONS,
      
      // Risk Flags
      FLAGS: []
    };
    
    // Add risk flags
    if (activity.CASH_ACTIVITY.CASH_INTENSIVE_FLAG) {
      summary.FLAGS.push({ type: 'warning', code: 'CASH_INTENSIVE', message: 'Cash Intensive Activity Detected' });
    }
    if (activity.CASH_ACTIVITY.STRUCTURING_ALERT) {
      summary.FLAGS.push({ type: 'critical', code: 'STRUCTURING', message: 'Structuring Pattern Detected: ' + activity.CASH_ACTIVITY.STRUCTURING_DETAILS });
    }
    if (activity.WIRE_TRANSFERS.HIGH_RISK_WIRE_FLAG) {
      summary.FLAGS.push({ type: 'critical', code: 'HIGH_RISK_COUNTRY', message: 'High-Risk Country Wire: ' + activity.WIRE_TRANSFERS.HIGH_RISK_WIRE_DETAILS });
    }
    if (activity.VELOCITY.VELOCITY_ALERT) {
      summary.FLAGS.push({ type: 'warning', code: 'VELOCITY', message: activity.VELOCITY.VELOCITY_ALERT_REASON });
    }
    if (totalInflow > declaredAnnualIncome * 2) {
      summary.FLAGS.push({ type: 'critical', code: 'INCOME_MISMATCH', message: 'Total inflow (' + totalInflow.toLocaleString() + ' QAR) exceeds 2x declared annual income' });
    }
    
    return summary;
  },

  // Organization Integration Methods
  getCasesByWorkflowGroup: function(groupName) {
    return this.cases.filter(c => c.workflowGroup === groupName);
  },

  getCasesByDepartment: function(deptId) {
    return this.cases.filter(c => c.departmentId === deptId);
  },

  getCasesBySupervisor: function(supervisorId) {
    return this.cases.filter(c => c.sectorSupervisor === supervisorId);
  },

  // Enrich case with organization data if not present
  enrichCaseWithOrg: function(caseObj) {
    if (!caseObj) return caseObj;
    
    // Auto-assign workflow group based on segment and stage
    if (!caseObj.workflowGroup) {
      if (caseObj.stage === 'business' || caseObj.stage === 'business_checker') {
        caseObj.workflowGroup = 'Business_' + (caseObj.assignedSegment || 'Mass');
      } else if (caseObj.stage === 'cdd_maker') {
        caseObj.workflowGroup = 'CDD_Maker';
      } else if (caseObj.stage === 'cdd_checker') {
        caseObj.workflowGroup = 'CDD_Checker';
      } else if (caseObj.stage === 'compliance') {
        caseObj.workflowGroup = 'Compliance';
      } else if (caseObj.stage === 'completed') {
        caseObj.workflowGroup = 'Management';
      }
    }
    
    // Auto-assign department
    if (!caseObj.departmentId) {
      if (['business', 'business_checker'].includes(caseObj.stage)) {
        caseObj.departmentId = 'RETAIL';
      } else if (['cdd_maker', 'cdd_checker', 'compliance'].includes(caseObj.stage)) {
        caseObj.departmentId = 'OPS';
      }
    }
    
    // Auto-assign supervisor based on segment
    if (!caseObj.sectorSupervisor) {
      const supervisorMap = {
        'Mass': 'RTL-001',
        'Tamayuz': 'RTL-002',
        'Private': 'RTL-003'
      };
      caseObj.sectorSupervisor = supervisorMap[caseObj.assignedSegment] || 'OPS-001';
    }
    
    // Auto-assign escalation path
    if (!caseObj.escalationPath) {
      if (caseObj.departmentId === 'RETAIL') {
        caseObj.escalationPath = ['GM-002', 'GM-001', 'EXE-001']; // GM Retail -> COO -> GCEO
      } else {
        caseObj.escalationPath = ['OPS-001', 'GM-001', 'EXE-001']; // Head Ops -> COO -> GCEO
      }
    }
    
    return caseObj;
  },

  // Get all cases enriched with organization data
  getEnrichedCases: function() {
    return this.cases.map(c => this.enrichCaseWithOrg({...c}));
  },

  getDocumentById: function(docId) {
    return this.documents[docId];
  },

  getMismatchesByRIM: function(rim) {
    return this.mismatches[rim] || [];
  },

  getAuditLogByCase: function(caseId) {
    return this.auditLog.filter(a => a.caseId === caseId);
  },

  // Alias for eddCases (legacy compatibility)
  get eddCases() {
    return this.cases;
  }
};

// Alias for global access
const MockData = EDDMockData;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EDDMockData;
}
