/**
 * ============================================================================
 * SAMPLE DATA GENERATOR - منشئ بيانات العينة
 * ============================================================================
 * ينشئ 120+ حالات KYC واقعية مع بيانات متنوعة وواقعية لـ Qatar Islamic Bank
 * ============================================================================
 */

const SAMPLE_DATA_GENERATOR = (() => {
  // أسماء قطرية واقعية
  const qatariFirstNames = [
    'أحمد', 'محمد', 'علي', 'خليفة', 'حمد', 'عبدالله', 'فوزي', 'سلطان',
    'عمر', 'إبراهيم', 'يوسف', 'صالح', 'إسماعيل', 'حسن', 'حسين', 'جاسم',
    'راشد', 'ناصر', 'سيف', 'نايف', 'عائشة', 'فاطمة', 'نورا', 'مريم',
    'وداد', 'هيا', 'لولوة', 'شيخة', 'جار الله', 'الدوسري', 'الكواري',
    'القحطاني', 'الماجد', 'الشرقي'
  ];

  const qatariLastNames = [
    'الثاني', 'الحمادي', 'الحويلة', 'الكواري', 'الماجد', 'الشرقي',
    'الدوسري', 'القحطاني', 'العنزي', 'الرشيدي', 'الهاجري', 'الجراح',
    'السليطي', 'الكثيري', 'الرميحي', 'الزغبي', 'الدعيع', 'الغانم'
  ];

  const sectors = [
    'BANKING', 'ENERGY', 'RETAIL', 'TECHNOLOGY', 'REAL_ESTATE',
    'HEALTHCARE', 'EDUCATION', 'CONSTRUCTION', 'TOURISM', 'LOGISTICS',
    'MANUFACTURING', 'TELECOMMUNICATIONS', 'FOOD_BEVERAGE', 'INSURANCE',
    'INVESTMENT', 'LEGAL', 'CONSULTING', 'HOSPITALITY'
  ];

  const nationalities = [
    'QA', 'SA', 'AE', 'KW', 'BH', 'OM', 'EG', 'JO', 'LB', 'PS',
    'US', 'GB', 'AE', 'IN', 'PK', 'PH', 'SG', 'MY', 'TH', 'VN'
  ];

  const riskRatings = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
  const statuses = ['NEW', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PENDING_DOCUMENTS'];
  const kycStatuses = ['PENDING', 'SUBMITTED', 'VERIFIED', 'APPROVED', 'REJECTED'];

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateQatariName() {
    return `${randomItem(qatariFirstNames)} ${randomItem(qatariLastNames)}`;
  }

  function generateId(prefix) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
  }

  function generatePhoneNumber() {
    // Qatar phone numbers start with +974
    const operators = ['30', '31', '33', '40', '44', '50', '55', '60', '66', '74', '77'];
    const operator = randomItem(operators);
    const number = randomNumber(100000, 999999);
    return `+974${operator}${number}`;
  }

  function generateEmail(name) {
    const domain = ['qib.com.qa', 'qatar-bank.qa', 'qnb.qa', 'doha.qa', 'gmail.com'];
    const emailName = name.split(' ')[0].toLowerCase();
    return `${emailName}${randomNumber(100, 999)}@${randomItem(domain)}`;
  }

  function generateIncome() {
    // Income range in QAR (Qatar Riyal)
    return randomNumber(50000, 500000);
  }

  function generateDate(daysAgo = 365) {
    const date = new Date();
    date.setDate(date.getDate() - randomNumber(0, daysAgo));
    return date.toISOString().split('T')[0];
  }

  function generateNIN() {
    // Qatar National ID format: 3 digits + 6 digits
    return `${randomNumber(100, 999)}${randomNumber(100000, 999999)}`;
  }

  function generatePassport() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let passport = '';
    for (let i = 0; i < 2; i++) {
      passport += chars[Math.floor(Math.random() * chars.length)];
    }
    passport += randomNumber(1000000, 9999999);
    return passport;
  }

  // ============================================================================
  // CASE GENERATOR
  // ============================================================================

  function generateCase(index) {
    const name = generateQatariName();
    const status = randomItem(statuses);
    const riskRating = randomItem(riskRatings);
    const nationality = randomItem(nationalities);

    // Activity codes from risk_datasets
    const activities = ['BANKING', 'TRADING', 'HAWALA', 'GAMBLING', 'IMPORT_EXPORT', 'MANUFACTURING'];
    // Product codes from risk_datasets
    const products = ['CHECKING', 'SAVINGS', 'WIRE_TRANSFER', 'CRYPTO_WALLET', 'CORRESPONDENT_BANK'];
    // Occupation codes from risk_datasets
    const occupations = ['ENGINEER', 'DOCTOR', 'TEACHER', 'MERCHANT', 'GOVT_OFFICIAL', 'STUDENT'];

    return {
      id: generateId('CASE'),
      customerId: generateId('CUST'),
      customerName: name,
      customer_name: name,  // For risk engine compatibility
      email: generateEmail(name),
      phoneNumber: generatePhoneNumber(),
      nationality: nationality,
      nationalityCode: nationality,  // Added for risk engine
      country: nationality,  // Added for risk engine
      sector: randomItem(sectors),
      activity: randomItem(activities),  // ✨ NEW - For risk calculation
      product: randomItem(products),     // ✨ NEW - For risk calculation
      occupation: randomItem(occupations), // ✨ NEW - For risk calculation
      income: generateIncome(),
      nin: nationality === 'QA' ? generateNIN() : null,
      passport: nationality !== 'QA' ? generatePassport() : null,
      documentType: nationality === 'QA' ? 'NATIONAL_ID' : 'PASSPORT',
      riskRating: riskRating,
      status: status,
      kycStatus: randomItem(kycStatuses),
      createdDate: generateDate(),
      createdBy: 'system@qib.qa',
      lastUpdated: generateDate(30),
      updatedBy: randomItem(['ahmed.thani@qib.qa', 'fatima.altiwari@qib.qa', 'system@qib.qa']),
      department: randomItem(['CDD', 'KYC', 'COMPLIANCE', 'OPERATIONS']),
      assignedTo: randomItem(['Mohanad Al Hassan', 'Fatima Al-Tiwari', 'Mohammed Al-Kaabi']),
      documentRef: `DOC-${generateId('REF')}`,
      notes: generateNotes(),
      complianceChecks: {
        pep: Math.random() > 0.9,
        sanctions: Math.random() > 0.95,
        aml: Math.random() > 0.85,
        sanctions_screening: Math.random() > 0.92,
        adverse_media: Math.random() > 0.88
      },
      businessDetails: {
        entityType: randomItem(['INDIVIDUAL', 'COMPANY', 'TRUST', 'PARTNERSHIP']),
        yearsInBusiness: randomNumber(1, 50),
        employees: randomNumber(1, 5000),
        annualTurnover: randomNumber(500000, 10000000),
        principalActivity: randomItem(['Manufacturing', 'Trading', 'Services', 'Finance', 'Real Estate'])
      },
      sourceOfFunds: randomItem(['Business', 'Investment', 'Savings', 'Inheritance', 'Employment']),
      expectedMonthlyTransactions: randomNumber(10, 1000),
      expectedAnnualValue: randomNumber(1000000, 100000000),
      purpose: randomItem(['General Banking', 'Trade Finance', 'Investment', 'Personal Use']),
      beneficiaries: generateBeneficiaries(),
      fatcaInfo: {
        usTaxpayer: Math.random() > 0.9,
        w9Provided: Math.random() > 0.85,
        w8bStatus: 'PENDING'
      }
    };
  }

  function generateNotes() {
    const notes = [
      'Case requires additional documentation review',
      'Awaiting customer response on compliance questions',
      'Document verification in progress',
      'Scheduled for final approval review',
      'Risk assessment completed - medium priority',
      'Customer submitted all required documents',
      'Pending PEP screening results',
      'Under sanction list verification',
      'Ready for final approval',
      'Returned for additional information'
    ];
    return randomItem(notes);
  }

  function generateBeneficiaries() {
    const count = randomNumber(1, 3);
    const beneficiaries = [];
    for (let i = 0; i < count; i++) {
      beneficiaries.push({
        name: generateQatariName(),
        ownership: randomNumber(10, 100),
        nationality: randomItem(nationalities),
        isPEP: Math.random() > 0.95
      });
    }
    return beneficiaries;
  }

  // ============================================================================
  // BULK GENERATOR
  // ============================================================================

  function generateCases(count = 120) {
    const cases = [];
    for (let i = 1; i <= count; i++) {
      cases.push(generateCase(i));
    }
    return cases;
  }

  function generateUsers() {
    return [
      {
        id: 'USER-001',
        username: 'mohanad.hassan',
        password: 'hash_abc123', // Hash in production
        fullName: 'Mohanad Al Hassan',
        email: 'mohanad.hassan@qib.qa',
        role: 'OPERATIONS_MANAGER',
        department: 'Operations',
        status: 'ACTIVE',
        createdDate: '2025-01-01'
      },
      {
        id: 'USER-002',
        username: 'fatima.altiwari',
        password: 'hash_def456',
        fullName: 'Fatima Al-Tiwari',
        email: 'fatima.altiwari@qib.qa',
        role: 'COMPLIANCE_OFFICER',
        department: 'COMPLIANCE',
        status: 'ACTIVE',
        createdDate: '2025-01-05'
      },
      {
        id: 'USER-003',
        username: 'mohammed.kaabi',
        password: 'hash_ghi789',
        fullName: 'Mohammed Al-Kaabi',
        email: 'mohammed.kaabi@qib.qa',
        role: 'CDD_OFFICER',
        department: 'CDD',
        status: 'ACTIVE',
        createdDate: '2025-01-10'
      },
      {
        id: 'USER-004',
        username: 'admin',
        password: 'hash_admin',
        fullName: 'System Administrator',
        email: 'admin@qib.qa',
        role: 'ADMIN',
        department: 'IT',
        status: 'ACTIVE',
        createdDate: '2025-01-01'
      }
    ];
  }

  // ============================================================================
  // EXPORT
  // ============================================================================

  return {
    generateCases,
    generateUsers,
    generateCase,
    generateQatariName,
    generatePhoneNumber,
    generateEmail,
    generateIncome,
    generateDate,
    generateNIN,
    generatePassport,
    generateId
  };
})();

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
// Generate 120 cases
const _120Cases = SAMPLE_DATA_GENERATOR.generateCases(120);

// Generate users
const users = SAMPLE_DATA_GENERATOR.generateUsers();

// Use in EDDDataModel
window.eddDataModel.importData({
  cases: _120Cases,
  users: users,
  // ... other data
});

// Generate single case
const newCase = SAMPLE_DATA_GENERATOR.generateCase(121);
*/

// For Node.js modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SAMPLE_DATA_GENERATOR;
}
