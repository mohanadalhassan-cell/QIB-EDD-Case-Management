/**
 * QIB EDD Case Management System — Sector Configuration
 * Defines sector metadata, analysis fields, and visual styling
 * Professional banking sector taxonomy
 */

const SectorsConfig = {
  'PB': {
    code: 'PB',
    name: 'Private Banking',
    fullName: 'Private Banking & Family Offices',
    icon: '👔',
    iconEmoji: '👔',
    description: 'High Net Worth Individuals & Family Offices',
    subDescription: 'Wealth Management & Premium Banking Services',
    riskProfile: 'High',
    color: '#0066CC',
    borderColor: '#003D8C',
    lightColor: 'rgba(0, 102, 204, 0.1)',
    lightBorder: 'rgba(0, 102, 204, 0.2)',
    gradient: 'linear-gradient(135deg, #0066CC, #003D8C)',
    textColor: '#0066CC',
    badgeBackground: 'rgba(0, 102, 204, 0.15)',
    analysisFields: [
      'Wealth Source Analysis',
      'Investment Activity Patterns',
      'High Value Transfer Frequency',
      'PEP Status & Risk Assessment',
      'Beneficial Ownership Structure',
      'Cross-Border Holdings',
      'Complex Trust Arrangements'
    ],
    riskFactors: [
      'PEP Status',
      'High Net Worth',
      'Private Banking Product Usage',
      'Complex Account Structures',
      'Significant Wealth Transfer Activity'
    ],
    typicalCustomers: 'Private individuals, family offices, high-net-worth families',
    sectorSize: 450
  },
  'TZ': {
    code: 'TZ',
    name: 'Tamayuz Elite',
    fullName: 'Tamayuz Premium Salaried Banking',
    icon: '⭐',
    iconEmoji: '⭐',
    description: 'Salaried Premium Customers & Senior Professionals',
    subDescription: 'Employment-based Premium Banking Program',
    riskProfile: 'Medium',
    color: '#7C3AED',
    borderColor: '#5B21B6',
    lightColor: 'rgba(124, 58, 237, 0.1)',
    lightBorder: 'rgba(124, 58, 237, 0.2)',
    gradient: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
    textColor: '#7C3AED',
    badgeBackground: 'rgba(124, 58, 237, 0.15)',
    analysisFields: [
      'Employment Verification Status',
      'Salary Pattern & Consistency',
      'Income vs. Expense Analysis',
      'Travel & Cross-Border Activity',
      'Credit History Assessment',
      'Spending Behavior Analysis'
    ],
    riskFactors: [
      'Government Employee Status',
      'Large Salary Deposits',
      'Multiple Account Activity',
      'Source of Wealth (Employment)',
      'Periodic Large Transactions'
    ],
    typicalCustomers: 'Senior professionals, government employees, corporate executives',
    sectorSize: 280
  },
  'MS': {
    code: 'MS',
    name: 'Mass Banking',
    fullName: 'Mass Banking & Retail Customer Segment',
    icon: '🏦',
    iconEmoji: '🏦',
    description: 'Retail Banking & General Mass Market Clients',
    subDescription: 'Standard Banking Services for General Population',
    riskProfile: 'Medium-Low',
    color: '#059669',
    borderColor: '#047857',
    lightColor: 'rgba(5, 150, 105, 0.1)',
    lightBorder: 'rgba(5, 150, 105, 0.2)',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    textColor: '#059669',
    badgeBackground: 'rgba(5, 150, 105, 0.15)',
    analysisFields: [
      'Card Transaction Frequency',
      'Salary Deposit Pattern',
      'Cash Behavior & Withdrawal Patterns',
      'Domestic Vs. Cross-Border Activity',
      'Account Dormancy Analysis',
      'Biometric & KYC Verification'
    ],
    riskFactors: [
      'Cash Intensive Activity',
      'Non-Resident Status',
      'Risk Country Exposure',
      'Source of Wealth Sensitivity',
      'Transaction Frequency Anomalies'
    ],
    typicalCustomers: 'Retail customers, employed individuals, small business owners',
    sectorSize: 580
  }
};

/**
 * Helper function to get sector by code
 */
function getSectorConfig(code) {
  return SectorsConfig[code] || null;
}

/**
 * Helper function to get all sectors
 */
function getAllSectors() {
  return Object.values(SectorsConfig);
}

/**
 * Helper function to get sector color by risk level
 */
function getRiskColor(riskLevel) {
  const riskColorMap = {
    'High': '#EF4444',
    'Medium': '#F59E0B',
    'Low': '#10B981',
    'Medium-Low': '#34D399',
    'Critical': '#DC2626'
  };
  return riskColorMap[riskLevel] || '#9CA3AF';
}

/**
 * Helper function to get sector icon HTML
 */
function getSectorIconHTML(sectorCode) {
  const sector = getSectorConfig(sectorCode);
  if (!sector) return '';
  return `<span style="font-size: 24px; display: inline-block;">${sector.iconEmoji}</span>`;
}

/**
 * Helper function to get sector badge HTML
 */
function getSectorBadgeHTML(sectorCode) {
  const sector = getSectorConfig(sectorCode);
  if (!sector) return '';
  return `<span style="
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: ${sector.badgeBackground};
    color: ${sector.textColor};
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid ${sector.lightBorder};
  ">
    ${sector.iconEmoji} ${sector.name}
  </span>`;
}

/**
 * Risk Color Definitions for Badges
 */
const RiskColorScheme = {
  'HIGH': {
    background: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
    text: '#EF4444',
    lightText: '#DC2626'
  },
  'MEDIUM': {
    background: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: '#F59E0B',
    lightText: '#D97706'
  },
  'LOW': {
    background: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
    text: '#10B981',
    lightText: '#059669'
  },
  'Medium-Low': {
    background: 'rgba(52, 211, 153, 0.15)',
    border: 'rgba(52, 211, 153, 0.3)',
    text: '#34D399',
    lightText: '#10B981'
  },
  'CRITICAL': {
    background: 'rgba(220, 38, 38, 0.15)',
    border: 'rgba(220, 38, 38, 0.3)',
    text: '#DC2626',
    lightText: '#991B1B'
  }
};

/**
 * Case Status Styling
 */
const CaseStatusStyle = {
  'Business Review': {
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    text: '#3B82F6',
    badge: '🔵'
  },
  'Business Maker Approved': {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    text: '#22C55E',
    badge: '✅'
  },
  'CDD Review': {
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    text: '#F59E0B',
    badge: '⏳'
  },
  'Completed': {
    background: 'rgba(34, 197, 94, 0.15)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    text: '#22C55E',
    badge: '✓'
  },
  'Pending Documents': {
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    text: '#F59E0B',
    badge: '📄'
  },
  'Escalated to Compliance': {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    text: '#EF4444',
    badge: '🚨'
  }
};
