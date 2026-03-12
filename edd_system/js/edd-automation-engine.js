/**
 * EDD AUTOMATION DECISION ENGINE
 * ═══════════════════════════════════════════════════════════════
 * Core data model, rules engine, KPI engine, and simulation
 * for the QIB EDD Automation Demo Platform (Phase 5)
 *
 * Integrates with: StageEligibilityChecker, DecisionAnalyticsEngine
 * Referenced by: edd-automation-platform.html, executive-command-center.html
 */

// ═══════════════════════════════════════════════════════════════
// 1. DEMO CASE DATA — 5 scenarios, one per decision outcome
// ═══════════════════════════════════════════════════════════════

const EDD_DEMO_CASES = [
  {
    id: 'EDD-2026-1541',
    customer: 'Abdullah Nasser Al-Kuwari',
    nationality: 'Qatari',
    dob: '1988-05-15', age: 37,
    occupation: 'Senior Government Advisor',
    employer: 'Ministry of Finance — Qatar',
    segment: 'Premium',
    riskScore: 8, riskBand: 'LOW',
    dataCompleteness: 97,
    decisionConfidence: 96,
    automationScore: 92,
    eligibleStage: 'C',
    pepStatus: false, sanctionsStatus: false, adverseMedia: false,
    documentsComplete: true, documentCount: '12/12',
    employmentVerified: true,
    monthlyIncome: 875000, incomeSource: 'Salary (T24 verified)',
    sourceOfWealth: 'Employment',
    kycStatus: 'COMPLETE', lastKycUpdate: '2026-01-15',
    negativeEvents: 0, transactionAlerts: 0,
    decision: 'AUTO_APPROVED', decisionCode: 'AA-001',
    decisionLabel: 'Auto-Approved', decisionColor: 'green',
    processingTime: '22 min',
    sourceSystems: ['T24 Core Banking', 'CRM System', 'QCB AML API', 'Document DMS'],
    rules: [
      { rule: 'Identity Verification',        passed: true,  detail: 'QAR National ID valid — expiry 2027-06-30' },
      { rule: 'Age Eligibility (21–65)',       passed: true,  detail: 'Age: 37 — within policy range' },
      { rule: 'Nationality Assessment',        passed: true,  detail: 'Qatari national — standard risk (0 pts)' },
      { rule: 'Occupation Risk Band',          passed: true,  detail: 'Government Advisor — standard category (0 pts)' },
      { rule: 'Income Threshold (>QAR 300K)',  passed: true,  detail: 'QAR 875,000/mo confirmed via T24' },
      { rule: 'Income Source Verification',    passed: true,  detail: 'T24 salary consistent 12 months' },
      { rule: 'KYC Form Completeness',         passed: true,  detail: 'All 11 sections fully completed — Jan 2026' },
      { rule: 'Document Completeness (≥95%)', passed: true,  detail: '12/12 documents present — quality score 97%' },
      { rule: 'PEP Screening',                 passed: true,  detail: 'No PEP match — QCB/Refinitiv clear (12-Mar-2026)' },
      { rule: 'Sanctions Screening',           passed: true,  detail: 'OFAC / UN / EU screened — negative (12-Mar-2026)' },
      { rule: 'Adverse Media Check',           passed: true,  detail: 'No adverse media hits found' },
      { rule: 'Risk Score Band (Stage C: 0–35)', passed: true, detail: 'Score: 8 — LOW (threshold 35 met)' },
      { rule: 'No Negative Events (30 days)', passed: true,  detail: '0 alerts, 0 events in past 30 days' },
      { rule: 'Source of Wealth Clarity',     passed: true,  detail: 'Salary — fully documented and verified' }
    ],
    auditSteps: [
      { time: '14:03:12', step: 'Case Initiated',                result: 'PASS',     detail: 'EDD trigger from T24 — Customer ID 789456' },
      { time: '14:03:14', step: 'Source Systems Connected',       result: 'PASS',     detail: 'T24, CRM, AML Engine, DMS — all available' },
      { time: '14:03:16', step: 'Data Completeness Scan',         result: 'PASS',     detail: '97% — 12/12 mandatory fields verified' },
      { time: '14:03:18', step: 'Identity Validation',            result: 'PASS',     detail: 'National ID QAR-0012345 — valid, not expired' },
      { time: '14:03:21', step: 'Risk Engine Executed',           result: 'PASS',     detail: 'Risk score: 8 — LOW (Stage C threshold ≤35)' },
      { time: '14:03:25', step: 'Sanctions Screening',            result: 'PASS',     detail: 'OFAC, UN, EU — negative result confirmed' },
      { time: '14:03:27', step: 'PEP Screening',                  result: 'PASS',     detail: 'QCB/Refinitiv PEP list — no match found' },
      { time: '14:03:29', step: 'Stage C Eligibility Verified',   result: 'PASS',     detail: 'Risk 8 ≤ 35 — Stage C confirmed eligible' },
      { time: '14:03:30', step: 'Decision Rules: 14/14 Passed',   result: 'PASS',     detail: 'All policy rules evaluated and passed' },
      { time: '14:03:30', step: 'Auto-Approval Decision',         result: 'APPROVED', detail: 'AUTO-APPROVE (AA-001) — Confidence: 96%' },
      { time: '14:03:31', step: 'Audit Log Locked (Immutable)',   result: 'LOCKED',   detail: '7-year retention — read-only record created' },
      { time: '14:03:32', step: 'Customer Notified',              result: 'SENT',     detail: 'Approval email sent — account activated' }
    ]
  },
  {
    id: 'EDD-2026-1542',
    customer: 'Fatima Bint Hamad Al-Rashid',
    nationality: 'Qatari',
    dob: '1979-11-03', age: 46,
    occupation: 'Business Owner — Trading & Investments',
    employer: 'Al-Rashid Trading LLC (Sole Owner)',
    segment: 'Premium',
    riskScore: 48, riskBand: 'MEDIUM',
    dataCompleteness: 88,
    decisionConfidence: 71,
    automationScore: 53,
    eligibleStage: 'B',
    pepStatus: false, sanctionsStatus: false, adverseMedia: false,
    documentsComplete: false, documentCount: '9/12',
    employmentVerified: true,
    monthlyIncome: 2300000, incomeSource: 'Business Income (self-declared)',
    sourceOfWealth: 'Business Earnings + Investment Portfolio',
    kycStatus: 'PENDING_REVIEW', lastKycUpdate: '2025-11-20',
    negativeEvents: 0, transactionAlerts: 1,
    decision: 'HUMAN_REVIEW', decisionCode: 'HR-002',
    decisionLabel: 'Human Review Required', decisionColor: 'amber',
    processingTime: '1.2 days',
    sourceSystems: ['T24 Core Banking', 'CRM System', 'QCB AML API'],
    missingDocs: ['Audited Financials 2024', 'Investment Portfolio Statement', 'Source of Funds Declaration'],
    rules: [
      { rule: 'Identity Verification',        passed: true,  detail: 'QAR National ID valid' },
      { rule: 'Age Eligibility (21–65)',       passed: true,  detail: 'Age: 46 — within range' },
      { rule: 'Nationality Assessment',        passed: true,  detail: 'Qatari national' },
      { rule: 'Occupation Risk Band',          passed: false, detail: 'Business Owner (Trading) — elevated (+10 pts)' },
      { rule: 'Income Threshold (>QAR 300K)', passed: true,  detail: 'QAR 2.3M/mo declared (self-reported)' },
      { rule: 'Income Source Verification',    passed: false, detail: 'Business income not independently verified' },
      { rule: 'KYC Form Completeness',         passed: false, detail: 'KYC 88% — 3 key fields pending' },
      { rule: 'Document Completeness (≥95%)', passed: false, detail: '9/12 documents — 3 missing' },
      { rule: 'PEP Screening',                 passed: true,  detail: 'No PEP match — negative' },
      { rule: 'Sanctions Screening',           passed: true,  detail: 'Sanctions check clear' },
      { rule: 'Adverse Media Check',           passed: true,  detail: 'No adverse media found' },
      { rule: 'Risk Score Band (Stage C: 0–35)', passed: false, detail: 'Score: 48 — MEDIUM (exceeds Stage C threshold)' },
      { rule: 'No Negative Events (30 days)', passed: true,  detail: '1 minor alert cleared' },
      { rule: 'Source of Wealth Clarity',     passed: false, detail: 'Business + investment — requires detailed docs' }
    ],
    auditSteps: [
      { time: '09:15:04', step: 'Case Initiated',              result: 'PASS',     detail: 'EDD case opened — Customer ID 891223' },
      { time: '09:15:07', step: 'Source Systems Connected',     result: 'PARTIAL',  detail: 'T24 available — DMS documents incomplete (9/12)' },
      { time: '09:15:09', step: 'Data Completeness Scan',       result: 'WARNING',  detail: '88% completeness — below Stage C threshold (95%)' },
      { time: '09:15:11', step: 'Identity Validation',          result: 'PASS',     detail: 'National ID valid and verified' },
      { time: '09:15:14', step: 'Risk Engine Executed',         result: 'WARNING',  detail: 'Risk score: 48 — MEDIUM (Stage B band: 36–60)' },
      { time: '09:15:16', step: 'Occupation Risk Assessed',     result: 'ELEVATED', detail: 'Business Owner (Trading) — +10 points applied' },
      { time: '09:15:18', step: 'Sanctions Screening',          result: 'PASS',     detail: 'Sanctions screening clear' },
      { time: '09:15:20', step: 'PEP Screening',                result: 'PASS',     detail: 'No PEP match found' },
      { time: '09:15:22', step: 'Stage C Eligibility Check',    result: 'FAIL',     detail: 'Risk 48 > 35 — Stage C NOT eligible' },
      { time: '09:15:23', step: 'Stage B Eligibility Check',    result: 'PASS',     detail: 'Risk 48 ≤ 60 — Stage B eligible (human-in-loop)' },
      { time: '09:15:24', step: 'System Recommendation',        result: 'RECOMMEND',detail: 'Recommend: Request docs + senior analyst review' },
      { time: '09:15:24', step: 'Routed to Analyst Queue',      result: 'ROUTED',   detail: 'Senior Analyst queue — SLA: 1 business day' }
    ]
  },
  {
    id: 'EDD-2026-1543',
    customer: 'Nasser Abdul-Rahman Al-Thani',
    nationality: 'Qatari',
    dob: '1961-03-22', age: 65,
    occupation: 'Former Cabinet Minister / Senior Advisor',
    employer: 'Retired (Former Ministry of Interior)',
    segment: 'Private Banking',
    riskScore: null, riskBand: 'PEP — HARD STOP',
    dataCompleteness: 84,
    decisionConfidence: null,
    automationScore: 0,
    eligibleStage: 'ESCALATE',
    pepStatus: true, sanctionsStatus: false, adverseMedia: false,
    documentsComplete: false, documentCount: '7/12',
    employmentVerified: true,
    monthlyIncome: 5200000, incomeSource: 'Investment + Government Retirement',
    sourceOfWealth: 'Government + Investment Portfolio',
    kycStatus: 'ESCALATED', lastKycUpdate: '2025-08-10',
    negativeEvents: 0, transactionAlerts: 0,
    decision: 'ESCALATED_COMPLIANCE', decisionCode: 'EC-003',
    decisionLabel: 'Escalated → Compliance', decisionColor: 'red',
    processingTime: '5 business days',
    sourceSystems: ['T24 Core Banking', 'CRM System', 'QCB AML API', 'PEP DB'],
    rules: [
      { rule: 'Identity Verification',        passed: true,  detail: 'QAR National ID valid' },
      { rule: 'Age Eligibility (21–65)',       passed: true,  detail: 'Age: 65 — at upper boundary' },
      { rule: 'Nationality Assessment',        passed: true,  detail: 'Qatari national' },
      { rule: 'Occupation Risk Band',          passed: false, detail: 'Former Cabinet Minister — VERY HIGH RISK (+30)' },
      { rule: 'Income Threshold (>QAR 300K)', passed: true,  detail: 'QAR 5.2M/mo declared' },
      { rule: 'Income Source Verification',    passed: false, detail: 'Complex investment income — unverified sources' },
      { rule: 'KYC Form Completeness',         passed: false, detail: 'KYC 84% — key sections incomplete' },
      { rule: 'Document Completeness (≥95%)', passed: false, detail: '7/12 documents — significant gaps' },
      { rule: 'PEP Screening',                 passed: false, detail: '⛔ PEP MATCH — Former Minister of Interior, Category 1' },
      { rule: 'Sanctions Screening',           passed: true,  detail: 'Sanctions check clear — no match' },
      { rule: 'Adverse Media Check',           passed: true,  detail: 'No adverse media found' },
      { rule: 'Risk Score Band (Stage C: 0–35)', passed: false, detail: 'HARD STOP triggered before score calculation' },
      { rule: 'No Negative Events (30 days)', passed: true,  detail: '0 negative events' },
      { rule: 'Source of Wealth Clarity',     passed: false, detail: 'PEP — requires full Enhanced Due Diligence' }
    ],
    auditSteps: [
      { time: '11:27:03', step: 'Case Initiated',                  result: 'PASS',    detail: 'EDD case opened — Private Banking segment' },
      { time: '11:27:05', step: 'Source Systems Connected',         result: 'PASS',    detail: 'All systems available' },
      { time: '11:27:07', step: 'PEP Pre-Screen (Priority Check)',  result: 'BLOCKED', detail: '⛔ PEP MATCH — Former Cabinet Minister Category 1' },
      { time: '11:27:07', step: 'HARD STOP — Automation Blocked',  result: 'BLOCKED', detail: 'Policy hardstop: PEP = immediate escalation' },
      { time: '11:27:08', step: 'Compliance Officer Alerted',       result: 'ALERTED', detail: 'Compliance team notified — 4-hour SLA required' },
      { time: '11:27:08', step: 'Enhanced CDD Triggered',          result: 'TRIGGERED',detail: 'Full PEP Enhanced Due Diligence procedure initiated' },
      { time: '11:27:09', step: 'Escalated to Compliance Queue',   result: 'ESCALATED',detail: 'Priority: HIGH — Compliance Officer assigned' },
      { time: '11:27:10', step: 'Audit Log Locked (Immutable)',    result: 'LOCKED',   detail: 'Escalation event permanently recorded' }
    ]
  },
  {
    id: 'EDD-2026-1544',
    customer: 'Khalid Majed Al-Fadala',
    nationality: 'Qatari',
    dob: '1990-07-28', age: 35,
    occupation: 'Senior Finance Manager',
    employer: 'Al-Fardan Group',
    segment: 'Mass',
    riskScore: 18, riskBand: 'LOW',
    dataCompleteness: 72,
    decisionConfidence: 83,
    automationScore: 63,
    eligibleStage: 'B',
    pepStatus: false, sanctionsStatus: false, adverseMedia: false,
    documentsComplete: false, documentCount: '7/12',
    employmentVerified: false,
    monthlyIncome: 420000, incomeSource: 'Salary (unverified — docs pending)',
    sourceOfWealth: 'Employment',
    kycStatus: 'PENDING_DOCUMENTS', lastKycUpdate: '2026-02-28',
    negativeEvents: 0, transactionAlerts: 0,
    decision: 'DOCUMENTS_REQUESTED', decisionCode: 'DR-004',
    decisionLabel: 'Documents Requested', decisionColor: 'amber',
    processingTime: '30-day window',
    sourceSystems: ['T24 Core Banking', 'QCB AML API'],
    missingDocs: [
      'Employment Verification Letter (Employer Stamp)',
      'Bank Statement — Last 3 Months',
      'Salary Transfer Confirmation (T24)',
      'Source of Funds Declaration'
    ],
    rules: [
      { rule: 'Identity Verification',        passed: true,  detail: 'National ID valid' },
      { rule: 'Age Eligibility (21–65)',       passed: true,  detail: 'Age: 35' },
      { rule: 'Nationality Assessment',        passed: true,  detail: 'Qatari national' },
      { rule: 'Occupation Risk Band',          passed: true,  detail: 'Finance Manager — reasonable risk (+5)' },
      { rule: 'Income Threshold (>QAR 300K)', passed: true,  detail: 'QAR 420,000/mo declared' },
      { rule: 'Income Source Verification',    passed: false, detail: 'Employment letter not yet provided' },
      { rule: 'KYC Form Completeness',         passed: false, detail: 'KYC 72% — critical docs missing' },
      { rule: 'Document Completeness (≥95%)', passed: false, detail: '7/12 docs — 5 missing (see list)' },
      { rule: 'PEP Screening',                 passed: true,  detail: 'No PEP match' },
      { rule: 'Sanctions Screening',           passed: true,  detail: 'Sanctions clear' },
      { rule: 'Adverse Media Check',           passed: true,  detail: 'No adverse media' },
      { rule: 'Risk Score Band (Stage C: 0–35)', passed: true, detail: 'Score: 18 — LOW (eligible if docs provided)' },
      { rule: 'No Negative Events (30 days)', passed: true,  detail: '0 events' },
      { rule: 'Source of Wealth Clarity',     passed: false, detail: 'Needs bank statement + funds declaration' }
    ],
    auditSteps: [
      { time: '08:45:33', step: 'Case Initiated',              result: 'PASS',      detail: 'EDD case — online application' },
      { time: '08:45:35', step: 'Data Completeness Scan',       result: 'FAIL',      detail: '72% — 5 critical documents missing' },
      { time: '08:45:36', step: 'Risk Engine Executed',         result: 'PASS',      detail: 'Risk: 18 — LOW (cannot auto-decide without full data)' },
      { time: '08:45:37', step: 'Compliance Checks',            result: 'PASS',      detail: 'PEP / Sanctions clear — no issues' },
      { time: '08:45:38', step: 'Document Gap Analysis',        result: 'GAP_FOUND', detail: '5 required documents missing — resolvable' },
      { time: '08:45:39', step: 'Auto-Request Decision',        result: 'TRIGGERED', detail: 'Policy: missing required docs → auto-request' },
      { time: '08:45:40', step: 'Document Request Sent',        result: 'SENT',      detail: 'Itemized request email sent to customer' },
      { time: '08:45:40', step: 'Deadline Set: 30 Days',        result: 'SET',       detail: 'Deadline: 2026-04-11 — auto-reject if no response' },
      { time: '08:45:41', step: 'Audit Log Locked (Immutable)', result: 'LOCKED',    detail: 'Document request event recorded' }
    ]
  },
  {
    id: 'EDD-2026-1545',
    customer: 'Sarah Elizabeth Johnson',
    nationality: 'US National (Expat — Qatar Resident)',
    dob: '1982-09-14', age: 43,
    occupation: 'Chief Compliance Director',
    employer: 'International Financial Services LLC',
    segment: 'Premium',
    riskScore: 64, riskBand: 'MEDIUM-HIGH',
    dataCompleteness: 94,
    decisionConfidence: 68,
    automationScore: 34,
    eligibleStage: 'A',
    pepStatus: false, sanctionsStatus: false, adverseMedia: false,
    documentsComplete: true, documentCount: '11/12',
    employmentVerified: true,
    monthlyIncome: 1850000, incomeSource: 'Salary + Consulting Income (multi-source)',
    sourceOfWealth: 'Salary, Consulting, Prior Investments',
    kycStatus: 'FULL_MANUAL_REVIEW', lastKycUpdate: '2025-10-01',
    negativeEvents: 0, transactionAlerts: 2,
    decision: 'MANUAL_REVIEW', decisionCode: 'MR-005',
    decisionLabel: 'Manual Review Required', decisionColor: 'amber',
    processingTime: '3–5 business days',
    sourceSystems: ['T24 Core Banking', 'CRM System', 'QCB AML API', 'TM System'],
    rules: [
      { rule: 'Identity Verification',        passed: true,  detail: 'US Passport valid and verified' },
      { rule: 'Age Eligibility (21–65)',       passed: true,  detail: 'Age: 43' },
      { rule: 'Nationality Assessment',        passed: false, detail: 'Non-Qatari, US national — geographic risk (+10)' },
      { rule: 'Occupation Risk Band',          passed: false, detail: 'Compliance Director, Financial Services — professional risk (+20)' },
      { rule: 'Income Threshold (>QAR 300K)', passed: true,  detail: 'QAR 1.85M/mo (mixed sources)' },
      { rule: 'Income Source Verification',   passed: false, detail: 'Multi-source income — needs manual verification' },
      { rule: 'KYC Form Completeness',         passed: false, detail: 'KYC 94% — 1 document outstanding' },
      { rule: 'Document Completeness (≥95%)', passed: false, detail: '11/12 — one pending' },
      { rule: 'PEP Screening',                 passed: true,  detail: 'No PEP match' },
      { rule: 'Sanctions Screening',           passed: true,  detail: 'Sanctions clear' },
      { rule: 'Adverse Media Check',           passed: true,  detail: 'No adverse media' },
      { rule: 'Risk Score Band (Stage C: 0–35)', passed: false, detail: 'Score: 64 — MEDIUM-HIGH (exceeds Stage B threshold 60)' },
      { rule: 'No Negative Events (30 days)', passed: false, detail: '2 minor TM alerts — under review, not cleared' },
      { rule: 'Source of Wealth Clarity',     passed: false, detail: 'Multi-source income requires investigator assessment' }
    ],
    auditSteps: [
      { time: '10:12:44', step: 'Case Initiated',               result: 'PASS',   detail: 'EDD case — complex customer profile' },
      { time: '10:12:46', step: 'Data Completeness Scan',        result: 'WARNING',detail: '94% — close to threshold but not sufficient' },
      { time: '10:12:49', step: 'Risk Engine Executed',          result: 'HIGH',   detail: 'Risk score: 64 — MEDIUM-HIGH (exceeds B threshold 60)' },
      { time: '10:12:51', step: 'Occupation Risk Assessed',      result: 'ELEVATED',detail: 'Financial services professional + non-citizen' },
      { time: '10:12:53', step: 'Compliance Screens',            result: 'PASS',   detail: 'PEP / Sanctions clear' },
      { time: '10:12:54', step: 'TM Alerts Detected',            result: '2 ALERTS',detail: '2 minor TM alerts — not yet cleared' },
      { time: '10:12:55', step: 'Stage C Eligibility Check',     result: 'FAIL',   detail: 'Risk 64 > 35 — Stage C excluded' },
      { time: '10:12:55', step: 'Stage B Eligibility Check',     result: 'FAIL',   detail: 'Risk 64 > 60 — Stage B excluded' },
      { time: '10:12:56', step: 'Confidence Assessment',         result: 'LOW',    detail: 'Decision confidence: 68% — below 80% minimum' },
      { time: '10:12:56', step: 'Routed to Full Manual Review',  result: 'ROUTED', detail: 'Stage A — Investigator assigned, SLA 3–5 days' },
      { time: '10:12:57', step: 'Audit Log Locked (Immutable)',  result: 'LOCKED', detail: 'Manual routing event permanently recorded' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// 2. AUTOMATION DECISION ENGINE
// ═══════════════════════════════════════════════════════════════

const AutomationDecisionEngine = {

  processCase(caseData, targetStage) {
    const rules = caseData.rules;
    const passed = rules.filter(r => r.passed).length;
    const failed = rules.filter(r => !r.passed).length;
    return {
      caseId: caseData.id,
      targetStage,
      rulesEvaluated: rules.length, rulesPassed: passed, rulesFailed: failed,
      passRate: Math.round((passed / rules.length) * 100),
      eligible: this._isEligibleForStage(caseData, targetStage),
      decision: caseData.decision,
      confidence: caseData.decisionConfidence,
      automationScore: caseData.automationScore
    };
  },

  _isEligibleForStage(caseData, stage) {
    if (caseData.pepStatus || caseData.sanctionsStatus) return false;
    if (stage === 'C') return caseData.automationScore >= 70;
    if (stage === 'B') return caseData.automationScore >= 40;
    return true;
  },

  getEligibilityBadge(automationScore, pepStatus) {
    if (pepStatus) return { label: 'Compliance Escalation', color: 'red', icon: '⛔', stage: 'ESCALATE' };
    if (automationScore >= 70) return { label: 'Eligible — Stage C (Fully Automated)', color: 'green', icon: '✓', stage: 'C' };
    if (automationScore >= 40) return { label: 'Stage B — Human-in-Loop Required',     color: 'amber', icon: '⚡', stage: 'B' };
    return { label: 'Stage A — Manual Review Required', color: 'red', icon: '⚠', stage: 'A' };
  },

  getDecisionBadge(decision) {
    const map = {
      AUTO_APPROVED:         { label: 'AUTO-APPROVED',          color: 'green',  icon: '✓' },
      HUMAN_REVIEW:          { label: 'HUMAN REVIEW',           color: 'amber',  icon: '👤' },
      ESCALATED_COMPLIANCE:  { label: 'ESCALATED — COMPLIANCE', color: 'red',    icon: '⛔' },
      DOCUMENTS_REQUESTED:   { label: 'DOCUMENTS REQUESTED',    color: 'amber',  icon: '📋' },
      MANUAL_REVIEW:         { label: 'MANUAL REVIEW',          color: 'amber',  icon: '🔍' }
    };
    return map[decision] || { label: decision, color: 'blue', icon: '●' };
  },

  getKPIs() {
    return {
      casesProcessedToday: 847,
      automatedDecisions: 601,
      humanReviews: 154,
      escalations: 92,
      automationRate: 71,
      avgDecisionTime: '23 min',
      autoApprovalRate: 68,
      falsePositiveRate: 7.2,
      systemConfidence: 94,
      dataQualityAvg: 96,
      stageC: 601, stageB: 154, stageA: 92
    };
  },

  getSimulationSteps(caseData) {
    const isPEP    = caseData.pepStatus;
    const lowRisk  = caseData.riskScore !== null && caseData.riskScore <= 35;
    const hasData  = caseData.dataCompleteness >= 95;
    const hasDocs  = caseData.documentsComplete;

    return [
      { label: 'Connect Source Systems',        ms: 600,  result: 'PASS',
        detail: caseData.sourceSystems.join(', ') + ' — all systems reachable' },
      { label: 'Data Completeness Analysis',    ms: 900,  result: hasData ? 'PASS' : 'WARNING',
        detail: caseData.dataCompleteness + '% completeness — threshold: 95%' },
      { label: 'PEP & Sanctions Screening',     ms: 1100, result: isPEP ? 'BLOCKED' : 'PASS',
        detail: isPEP ? '⛔ PEP MATCH DETECTED — hard stop triggered' : 'PEP & Sanctions clear — no matches' },
      { label: 'Risk Scoring Engine',           ms: 800,  result: lowRisk ? 'PASS' : (isPEP ? 'BLOCKED' : 'WARNING'),
        detail: isPEP ? 'Risk score blocked — PEP escalation takes precedence' : 'Risk score: ' + (caseData.riskScore ?? 'N/A') + ' — Band: ' + caseData.riskBand },
      { label: 'Stage Eligibility Evaluation',  ms: 700,  result: caseData.automationScore >= 70 ? 'PASS' : (isPEP ? 'BLOCKED' : 'WARNING'),
        detail: 'Automation score: ' + caseData.automationScore + '% — Eligible stage: ' + caseData.eligibleStage },
      { label: 'Decision Generation',           ms: 500,  result: caseData.decision,
        detail: 'Final decision: ' + caseData.decisionLabel + ' (Code: ' + caseData.decisionCode + ')' }
    ];
  },

  // KPI for exec dashboard
  getExecKPIs() {
    return {
      automationRate: 71,
      casesByRisk: { low: 1537, medium: 892, high: 418 },
      decisionsToday: [
        { label: 'Auto- Approved',  value: 601, pct: 71 },
        { label: 'Human Review',    value: 154, pct: 18 },
        { label: 'Escalations',     value: 92,  pct: 11 }
      ],
      weeklyVolume: [742, 819, 803, 847, 891, 0, 0],
      maturityProgress: { stageA: 100, stageB: 65, stageC: 28 },
      efficiencyGain: { before: 2.8, after: 0.4, unit: 'days avg decision time' },
      falsePositiveRate: 7.2,
      overrideRate: 3.7,
      accuracy: 96.8
    };
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.EDD_DEMO_CASES = EDD_DEMO_CASES;
  window.AutomationDecisionEngine = AutomationDecisionEngine;
}
