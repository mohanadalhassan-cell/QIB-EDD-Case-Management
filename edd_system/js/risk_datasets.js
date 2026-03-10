/**
 * ============================================================================
 * RISK DATASETS - AML/EDD Platform
 * ============================================================================
 * Contains all risk scoring tables for automated risk assessment
 * Includes: Country, Activity, Product, Occupation, PEP datasets
 */

window.RISK_DATASETS = {
  // ═══════════════════════════════════════════════════════════════
  // COUNTRY RISK TABLE
  // ═══════════════════════════════════════════════════════════════
  country_risk: [
    { code: 'QA', name: 'Qatar', score: 40, category: 'LOW' },
    { code: 'SA', name: 'Saudi Arabia', score: 50, category: 'LOW' },
    { code: 'AE', name: 'UAE', score: 45, category: 'LOW' },
    { code: 'KW', name: 'Kuwait', score: 55, category: 'LOW' },
    { code: 'BH', name: 'Bahrain', score: 45, category: 'LOW' },
    { code: 'OM', name: 'Oman', score: 50, category: 'LOW' },
    
    { code: 'US', name: 'United States', score: 60, category: 'LOW' },
    { code: 'GB', name: 'United Kingdom', score: 55, category: 'LOW' },
    { code: 'DE', name: 'Germany', score: 50, category: 'LOW' },
    { code: 'FR', name: 'France', score: 55, category: 'LOW' },
    { code: 'SG', name: 'Singapore', score: 45, category: 'LOW' },
    { code: 'HK', name: 'Hong Kong', score: 50, category: 'LOW' },
    
    { code: 'CN', name: 'China', score: 100, category: 'MEDIUM' },
    { code: 'RU', name: 'Russia', score: 120, category: 'MEDIUM' },
    { code: 'IN', name: 'India', score: 85, category: 'MEDIUM' },
    { code: 'BR', name: 'Brazil', score: 90, category: 'MEDIUM' },
    { code: 'MX', name: 'Mexico', score: 110, category: 'MEDIUM' },
    { code: 'TH', name: 'Thailand', score: 95, category: 'MEDIUM' },
    { code: 'TR', name: 'Turkey', score: 100, category: 'MEDIUM' },
    { code: 'PK', name: 'Pakistan', score: 115, category: 'MEDIUM' },
    
    { code: 'IR', name: 'Iran', score: 160, category: 'HIGH' },
    { code: 'SY', name: 'Syria', score: 165, category: 'HIGH' },
    { code: 'KP', name: 'North Korea', score: 170, category: 'HIGH' },
    { code: 'LB', name: 'Lebanon', score: 145, category: 'HIGH' },
    { code: 'YE', name: 'Yemen', score: 155, category: 'HIGH' },
    { code: 'IQ', name: 'Iraq', score: 140, category: 'HIGH' },
    { code: 'AF', name: 'Afghanistan', score: 150, category: 'HIGH' },
    { code: 'SO', name: 'Somalia', score: 160, category: 'HIGH' },
    { code: 'SD', name: 'Sudan', score: 130, category: 'HIGH' },
    { code: 'ZW', name: 'Zimbabwe', score: 125, category: 'HIGH' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // ACTIVITY RISK TABLE
  // ═══════════════════════════════════════════════════════════════
  activity_risk: [
    { code: 'BANKING', name: 'Banking & Finance', score: 30, category: 'LOW' },
    { code: 'MANUFACTURING', name: 'Manufacturing', score: 35, category: 'LOW' },
    { code: 'RETAIL', name: 'Retail Trade', score: 40, category: 'LOW' },
    { code: 'HEALTHCARE', name: 'Healthcare', score: 25, category: 'LOW' },
    { code: 'EDUCATION', name: 'Education', score: 20, category: 'LOW' },
    { code: 'PROFESSIONAL', name: 'Professional Services', score: 40, category: 'LOW' },
    
    { code: 'TRADING', name: 'Import/Export Trading', score: 65, category: 'MEDIUM' },
    { code: 'MINING', name: 'Mining & Resources', score: 75, category: 'MEDIUM' },
    { code: 'CONSTRUCTION', name: 'Construction', score: 60, category: 'MEDIUM' },
    { code: 'REAL_ESTATE', name: 'Real Estate', score: 70, category: 'MEDIUM' },
    { code: 'TELECOM', name: 'Telecommunications', score: 55, category: 'MEDIUM' },
    { code: 'TRANSPORT', name: 'Transport & Logistics', score: 65, category: 'MEDIUM' },
    
    { code: 'HAWALA', name: 'Hawala / Money Transfer', score: 155, category: 'HIGH' },
    { code: 'GAMBLING', name: 'Gambling / Casinos', score: 140, category: 'HIGH' },
    { code: 'PRECIOUS_METALS', name: 'Precious Metals & Stones', score: 135, category: 'HIGH' },
    { code: 'ARMS', name: 'Arms & Defense', score: 160, category: 'HIGH' },
    { code: 'DRUGS', name: 'Pharmaceuticals (Suspicious)', score: 150, category: 'HIGH' },
    { code: 'SHELL_COMPANY', name: 'Shell Company / Dormant', score: 145, category: 'HIGH' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // PRODUCT RISK TABLE
  // ═══════════════════════════════════════════════════════════════
  product_risk: [
    { code: 'SAVINGS', name: 'Savings Account', score: 25, category: 'LOW' },
    { code: 'CHECKING', name: 'Checking Account', score: 30, category: 'LOW' },
    { code: 'FIXED_DEPOSIT', name: 'Fixed Deposit', score: 35, category: 'LOW' },
    { code: 'INSURANCE', name: 'Insurance Products', score: 40, category: 'LOW' },
    
    { code: 'CREDIT_CARD', name: 'Credit Card', score: 50, category: 'MEDIUM' },
    { code: 'PERSONAL_LOAN', name: 'Personal Loan', score: 55, category: 'MEDIUM' },
    { code: 'BUSINESS_LOAN', name: 'Business Loan', score: 65, category: 'MEDIUM' },
    { code: 'INVESTMENT', name: 'Investment Account', score: 70, category: 'MEDIUM' },
    { code: 'TRADE_FINANCE', name: 'Trade Finance', score: 75, category: 'MEDIUM' },
    
    { code: 'CRYPTO_WALLET', name: 'Cryptocurrency Wallet', score: 145, category: 'HIGH' },
    { code: 'INTERNATIONAL_WIRE', name: 'International Wire Transfer', score: 140, category: 'HIGH' },
    { code: 'CORRESPONDENT', name: 'Correspondent Banking', score: 135, category: 'HIGH' },
    { code: 'STRUCTURED_DEPOSITS', name: 'Structured Deposits', score: 130, category: 'HIGH' },
    { code: 'TRADE_BASED_ML', name: 'Trade-Based Money Laundering', score: 155, category: 'HIGH' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // OCCUPATION RISK TABLE
  // ═══════════════════════════════════════════════════════════════
  occupation_risk: [
    { code: 'ENGINEER', name: 'Engineer', score: 20, category: 'LOW' },
    { code: 'TEACHER', name: 'Teacher', score: 15, category: 'LOW' },
    { code: 'DOCTOR', name: 'Doctor/Physician', score: 25, category: 'LOW' },
    { code: 'ACCOUNTANT', name: 'Accountant', score: 30, category: 'LOW' },
    { code: 'NURSE', name: 'Nurse', score: 20, category: 'LOW' },
    { code: 'MECHANIC', name: 'Mechanic/Technician', score: 25, category: 'LOW' },
    
    { code: 'MERCHANT', name: 'Merchant/Trader', score: 60, category: 'MEDIUM' },
    { code: 'BUSINESSMAN', name: 'Businessman/Entrepreneur', score: 65, category: 'MEDIUM' },
    { code: 'LAWYER', name: 'Lawyer/Attorney', score: 50, category: 'MEDIUM' },
    { code: 'ACCOUNTANT_FIRM', name: 'Chartered Accountant', score: 55, category: 'MEDIUM' },
    { code: 'CONSULTANT', name: 'Management Consultant', score: 60, category: 'MEDIUM' },
    { code: 'REAL_ESTATE_AGENT', name: 'Real Estate Agent', score: 70, category: 'MEDIUM' },
    
    { code: 'PUBLIC_OFFICIAL', name: 'Government Official', score: 135, category: 'HIGH' },
    { code: 'POLITICIAN', name: 'Politician / MP', score: 145, category: 'HIGH' },
    { code: 'MILITARY', name: 'Military / Defense Personnel', score: 140, category: 'HIGH' },
    { code: 'POLICE_CHIEF', name: 'Police / Law Enforcement Chief', score: 135, category: 'HIGH' },
    { code: 'JUDGE', name: 'Judge / Judicial Officer', score: 130, category: 'HIGH' },
    { code: 'DIPLOMAT', name: 'Diplomat / Embassy Official', score: 125, category: 'HIGH' },
    { code: 'STATE_ENTERPRISE_CEO', name: 'State Enterprise CEO', score: 140, category: 'HIGH' },
  ],

  // ═══════════════════════════════════════════════════════════════
  // PEP REGISTRY
  // ═══════════════════════════════════════════════════════════════
  pep_registry: [
    { name: 'Mohammed bin Zayed Al Nahyan', country: 'AE', category: 'HEAD_OF_STATE', score: 160 },
    { name: 'Mohammed bin Salman', country: 'SA', category: 'CROWN_PRINCE', score: 155 },
    { name: 'Tamim bin Hamad Al Thani', country: 'QA', category: 'HEAD_OF_STATE', score: 155 },
    { name: 'Bashar al-Assad', country: 'SY', category: 'HEAD_OF_STATE', score: 165 },
    { name: 'Vladimir Putin', country: 'RU', category: 'HEAD_OF_STATE', score: 160 },
    { name: 'Kim Jong-un', country: 'KP', category: 'HEAD_OF_STATE', score: 170 },
    { name: 'Xi Jinping', country: 'CN', category: 'HEAD_OF_STATE', score: 150 },
  ],

  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  getCountryRisk: function(countryCode) {
    const country = this.country_risk.find(c => c.code === countryCode);
    return country || { code: countryCode, name: 'Unknown', score: 60, category: 'MEDIUM' };
  },

  getActivityRisk: function(activityCode) {
    const activity = this.activity_risk.find(a => a.code === activityCode);
    return activity || { code: activityCode, name: 'Unknown', score: 50, category: 'MEDIUM' };
  },

  getProductRisk: function(productCode) {
    const product = this.product_risk.find(p => p.code === productCode);
    return product || { code: productCode, name: 'Unknown', score: 50, category: 'MEDIUM' };
  },

  getOccupationRisk: function(occupationCode) {
    const occupat = this.occupation_risk.find(o => o.code === occupationCode);
    return occupat || { code: occupationCode, name: 'Unknown', score: 40, category: 'MEDIUM' };
  },

  isPEP: function(name) {
    return this.pep_registry.some(p => p.name.toLowerCase().includes(name.toLowerCase()));
  },

  getPEPData: function(name) {
    return this.pep_registry.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
  },

  // Get dataset summary
  getSummary: function() {
    return {
      countries: this.country_risk.length,
      activities: this.activity_risk.length,
      products: this.product_risk.length,
      occupations: this.occupation_risk.length,
      peps: this.pep_registry.length,
    };
  }
};

console.log('[RISK DATASETS] Loaded:', window.RISK_DATASETS.getSummary());
