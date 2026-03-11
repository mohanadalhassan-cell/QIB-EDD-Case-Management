/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DEMO GUIDANCE SYSTEM - Auto-Guided Platform Walkthrough
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Purpose: Provide automated, step-by-step guidance through QIB EDD platform
 * Features: Demo mode, BRD references, highlighted workflow areas, guided navigation
 * 
 * Integration: Login page, dashboard, all primary pages
 */

// ═══════════════════════════════════════════════════════════════════════════
// DEMO CONFIGURATION & STATE
// ═══════════════════════════════════════════════════════════════════════════

const DEMO_CONFIG = {
  // Demo Roles and their paths
  roles: {
    'KYC Officer': {
      credential: 'ahmed.thani',
      password: 'password123',
      steps: ['login', 'dashboard', 'kyc_form', 'case_creation', 'monitoring', 'dashboard_view']
    },
    'Investigator': {
      credential: 'Demo-2030',
      password: 'Qib@2030',
      steps: ['login', 'dashboard', 'case_investigation', 'evidence_collection', 'risk_analysis', 'decision']
    },
    'Compliance Manager': {
      credential: 'QIB2030',
      password: 'QIB2030',
      steps: ['login', 'dashboard', 'case_monitoring', 'escalations', 'sar_filing', 'reporting']
    },
    'Admin': {
      credential: 'admin',
      password: 'admin123',
      steps: ['login', 'dashboard', 'organization', 'user_management', 'configuration', 'audit_log']
    }
  },

  // BRD Reference Mapping per Step
  brdReferences: {
    'login': {
      section: 'Section 11: Authentication & Security',
      brdPage: '450-460',
      requirement: '6-factor MFA with password, role, and OTP verification',
      features: ['MFA Implementation', 'Role-based Access Control', 'Session Management'],
      complianceStatus: '✅ ISO 27001 Compliant'
    },
    'dashboard': {
      section: 'Section 5: Risk Scoring Model',
      brdPage: '340-380',
      requirement: '6-factor risk scoring with real-time alert management',
      features: ['Risk Assessment Engine', 'Case SLA Monitoring', 'Performance KPIs'],
      complianceStatus: '✅ FATF 40 Compliant'
    },
    'kyc_form': {
      section: 'Section 4: Customer Journey - Step 1',
      brdPage: '310-325',
      requirement: 'Automated KYC onboarding with <5 minute completion',
      features: ['Customer Verification', 'Document Upload', 'Automated Scoring'],
      complianceStatus: '✅ CRS/FATCA Ready'
    },
    'case_creation': {
      section: 'Section 6: EDD Workflow - Phase 1',
      brdPage: '385-395',
      requirement: 'Automatic HIGH RISK case creation and assignment',
      features: ['Case Auto-creation', 'SLA Management', 'Team Assignment'],
      complianceStatus: '✅ OFAC Aligned'
    },
    'case_investigation': {
      section: 'Section 6: EDD Workflow - Phase 4',
      brdPage: '410-430',
      requirement: '7-day investigation with financial consistency analysis',
      features: ['Evidence Review', 'Transaction Analysis', 'Risk Factor Analysis'],
      complianceStatus: '✅ GDPR Compliant'
    },
    'evidence_collection': {
      section: 'Section 7: Investigation Platform',
      brdPage: '440-465',
      requirement: 'Document verification and evidence management system',
      features: ['Document Upload', 'Version Control', 'Audit Trail'],
      complianceStatus: '✅ Data Protection Verified'
    },
    'risk_analysis': {
      section: 'Section 2B: Financial Consistency Engine',
      brdPage: '280-310',
      requirement: 'Transaction pattern analysis with anomaly detection',
      features: ['Income Verification', 'Pattern Analysis', 'Threshold Alerts'],
      complianceStatus: '✅ ML-Ready'
    },
    'decision': {
      section: 'Section 6: EDD Workflow - Phase 5',
      brdPage: '420-430',
      requirement: 'Compliance decision with SAR/TAR filing capability',
      features: ['Case Decision', 'SAR Filing', 'Escalation Management'],
      complianceStatus: '✅ Regulatory Compliant'
    },
    'monitoring': {
      section: 'Section 4: Customer Journey - Step 4',
      brdPage: '330-345',
      requirement: 'Transaction monitoring with real-time alert generation',
      features: ['Alert Management', 'Threshold Configuration', 'Pattern Recognition'],
      complianceStatus: '✅ FATF 29 Compliant'
    },
    'dashboard_view': {
      section: 'Section 12: Analytics & Reporting',
      brdPage: '480-500',
      requirement: 'Executive dashboard with KPI tracking and trend analysis',
      features: ['Real-time KPIs', 'SLA Tracking', 'Compliance Metrics'],
      complianceStatus: '✅ Governance Ready'
    },
    'organization': {
      section: 'Section 11: User Roles & Permissions',
      brdPage: '460-475',
      requirement: '6-role RBAC matrix with 20+ permissions per role',
      features: ['User Management', 'Role Assignment', 'Permission Control'],
      complianceStatus: '✅ Access Control Verified'
    },
    'sar_filing': {
      section: 'Section 6: EDD Workflow - Phase 5',
      brdPage: '425-432',
      requirement: 'Suspicious Activity Report filing and submission tracking',
      features: ['SAR Creation', 'Submission Tracking', 'Regulatory Integration'],
      complianceStatus: '✅ Regulatory Ready'
    }
  },

  // Step-by-step Guidance Messages
  stepGuidance: {
    'login': {
      title: '🔐 Login & Authentication',
      description: 'Multi-Factor Authentication ensures secure access with password, role assignment, and one-time password verification.',
      duration: '2-3 minutes',
      highlights: [
        'Employee ID field (pre-filled for demo)',
        'Password verification',
        'Role selection (select role matching your profile)',
        'OTP verification (123456 for demo)'
      ],
      demo: true
    },
    'dashboard': {
      title: '📊 Executive Dashboard',
      description: 'Real-time overview of compliance metrics, case SLA status, and risk portfolio with 6-factor scoring visualization.',
      duration: '2-3 minutes',
      highlights: [
        'KPI Card: Cases Open (SLA status)',
        'KPI Card: At Risk Customers',
        'KPI Card: Avg Investigation Days',
        'Risk Portfolio Pie Chart (HIGH/MEDIUM/LOW)',
        'Case SLA Status Bar'
      ],
      demo: true
    },
    'kyc_form': {
      title: '📋 KYC Form - Customer Onboarding',
      description: 'Rapid customer data collection with automated risk scoring (<5 minutes), enabling immediate HIGH RISK detection.',
      duration: '3-4 minutes',
      highlights: [
        'Personal Information Section (Name, DOB)',
        'Nationality & Residency (OFAC screening)',
        'Professional Details (Occupation Risk)',
        'Document Upload (ID, Address Proof)',
        'Auto-calculated Risk Score',
        'Instant HIGH RISK Alert if triggered'
      ],
      demo: true
    },
    'case_creation': {
      title: '🚨 Auto-Case Creation (HIGH RISK)',
      description: 'System automatically creates EDD case when customer risk exceeds 65 points (HIGH threshold), triggering 14-21 day SLA.',
      duration: '2 minutes',
      highlights: [
        'Case ID auto-generated',
        'SLA Timer (21-day deadline)',
        'Risk Score Display (6-factor breakdown)',
        'Auto-assigned to Investigator',
        'Status: Ready for Investigation'
      ],
      demo: true
    },
    'case_investigation': {
      title: '🔍 Case Investigation (Phase 4)',
      description: 'Deep-dive investigation with 7-day phase including evidence review, transaction analysis, and financial consistency verification.',
      duration: '4-5 minutes',
      highlights: [
        'Case Header (ID, Risk Score, SLA Timer)',
        'Risk Factors Panel (6-factor breakdown)',
        'Evidence Manager (Document Upload)',
        'Transaction Analysis (12-month history)',
        'Financial Consistency Engine',
        'Investigation Decision Input'
      ],
      demo: true
    },
    'evidence_collection': {
      title: '📄 Document Verification System',
      description: 'Secure document management with version control, verification status tracking, and immutable audit trail for regulatory compliance.',
      duration: '2-3 minutes',
      highlights: [
        'Document Upload Interface',
        'File Type Validation (PDF, JPEG, PNG)',
        'Verification Status Tracking',
        'Comment & Annotation Tools',
        'Audit Trail (Creator, Time, Action)'
      ],
      demo: true
    },
    'risk_analysis': {
      title: '💰 Financial Consistency Analysis',
      description: 'Phase 2B feature: Automated income verification and transaction pattern analysis with anomaly detection and threshold alerts.',
      duration: '3 minutes',
      highlights: [
        'Customer Income Declaration',
        '12-Month Transaction History Graph',
        'Pattern Analysis (Income vs. Spending)',
        'Anomaly Detection Alerts',
        'Consistency Score (0-100%)',
        'Risk Adjustment Factors'
      ],
      demo: true
    },
    'decision': {
      title: '✋ Compliance Decision (Phase 5)',
      description: 'Final investigation decision with 4 outcomes: APPROVE (clear), CONDITIONAL (with restrictions), REJECT (decline), or SAR (report to authorities).',
      duration: '2-3 minutes',
      highlights: [
        'Investigation Summary View',
        'Risk Factor Assessment',
        '4 Decision Options (Approve/Conditional/Reject/SAR)',
        'Decision Rationale Fields',
        'SAR Filing Integration',
        'Submit & Auto-close Case'
      ],
      demo: true
    },
    'monitoring': {
      title: '⚠️ Transaction Monitoring (Ongoing)',
      description: 'Real-time monitoring with step 4 alerts: flagged transactions matching threshold rules, automatically escalated to Analyst for review.',
      duration: '2 minutes',
      highlights: [
        'Active Monitoring Alerts List',
        'Alert Severity (Critical/High/Medium)',
        'Transaction Details (Amount, Type, Party)',
        'Pattern Flags (Threshold Breaches)',
        'Alert Outcome (Approve/Investigate/Escalate)',
        'Alert Dashboard'
      ],
      demo: true
    },
    'dashboard_view': {
      title: '📈 Executive Analytics Dashboard',
      description: 'Strategic KPI dashboard for board-level reporting with trend analysis, compliance metrics, and risk portfolio view.',
      duration: '2 minutes',
      highlights: [
        'KPI Trend Charts (Cases Processed, SLA %)',
        'Risk Distribution (Sector, Nationality)',
        'Regulatory Compliance Status',
        'Team Performance Metrics',
        'Quarterly Reporting Views'
      ],
      demo: true
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

let demoState = {
  isEnabled: false,
  selectedRole: 'Investigator',
  currentStep: 0,
  totalSteps: 6,
  autoGuideActive: false,
  showBRDReferences: true
};

// ═══════════════════════════════════════════════════════════════════════════
// DEMO MODE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize demo mode on login page
 */
function initDemoMode() {
  // Check if demo mode button already exists
  if (document.getElementById('demoModeContainer')) return;

  // Add demo mode container to login page
  const loginCard = document.querySelector('.login-card');
  if (!loginCard) return;

  const demoContainer = document.createElement('div');
  demoContainer.id = 'demoModeContainer';
  demoContainer.innerHTML = `
    <div style="
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(92, 10, 40, 0.3);
      text-align: center;
    ">
      <p style="
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 12px;
        letter-spacing: 0.5px;
      ">🎬 DEMO MODE - Auto-Guided Walkthrough</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <button class="demo-role-btn" onclick="selectDemoRole('Investigator')" style="
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(92, 10, 40, 0.3), rgba(92, 10, 40, 0.1));
          border: 1px solid rgba(92, 10, 40, 0.5);
          color: #fff;
          font-size: 11px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        " title="Investigator: Case investigation workflow">👤 Investigator</button>
        <button class="demo-role-btn" onclick="selectDemoRole('KYC Officer')" style="
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(92, 10, 40, 0.2), rgba(92, 10, 40, 0.08));
          border: 1px solid rgba(92, 10, 40, 0.3);
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        " title="KYC Officer: Customer onboarding">📋 KYC Officer</button>
        <button class="demo-role-btn" onclick="selectDemoRole('Compliance Manager')" style="
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(92, 10, 40, 0.2), rgba(92, 10, 40, 0.08));
          border: 1px solid rgba(92, 10, 40, 0.3);
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        " title="Compliance Manager: Case oversight">✔️ Compliance Mgr</button>
        <button class="demo-role-btn" onclick="selectDemoRole('Admin')" style="
          padding: 8px 12px;
          background: linear-gradient(135deg, rgba(92, 10, 40, 0.2), rgba(92, 10, 40, 0.08));
          border: 1px solid rgba(92, 10, 40, 0.3);
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
        " title="Admin: System administration">🔧 Admin</button>
      </div>
      <button onclick="launchDemoMode()" style="
        width: 100%;
        padding: 10px;
        background: linear-gradient(135deg, #5C0A28, #8B1538);
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.6px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
      " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" class="btn-demo-launch">
        🚀 START DEMO WALKTHROUGH (15 min)
      </button>
    </div>
  `;

  loginCard.appendChild(demoContainer);
}

/**
 * Select demo role and highlight selection
 */
function selectDemoRole(role) {
  demoState.selectedRole = role;
  document.querySelectorAll('.demo-role-btn').forEach(btn => {
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  });

  event.target.style.backgroundColor = 'rgba(92, 10, 40, 0.4)';
  event.target.style.borderColor = '#5C0A28';
  event.target.style.color = '#ffffff';
}

/**
 * Launch demo mode - Auto-fill credentials and skip to dashboard guide
 */
function launchDemoMode() {
  const role = demoState.selectedRole;
  const roleConfig = DEMO_CONFIG.roles[role];

  if (!roleConfig) {
    alert('Invalid role selected.');
    return;
  }

  demoState.isEnabled = true;
  demoState.autoGuideActive = true;
  demoState.currentStep = 0;

  // Auto-fill credentials
  document.getElementById('employeeId').value = roleConfig.credential;
  document.getElementById('password').value = roleConfig.password;

  // Store demo state in session storage
  sessionStorage.setItem('demoMode', JSON.stringify({
    enabled: true,
    role: role,
    autoGuide: true
  }));

  // Skip role selection and OTP - auto-complete login
  setTimeout(() => {
    completeLoginAutomatically(role);
  }, 500);
}

/**
 * Auto-complete login flow for demo
 */
function completeLoginAutomatically(role) {
  // Skip to role selection
  currentStep = 1; // From Step 1
  nextStep(1); // Validate and proceed to Step 2

  // Select role
  selectedRole = role;
  const roleBtn = Array.from(document.querySelectorAll('.role-button')).find(
    btn => btn.textContent === role
  );
  if (roleBtn) roleBtn.click();

  // Proceed to OTP
  setTimeout(() => {
    nextStep(2);

    // Pre-fill OTP (123456)
    const otpInputs = document.querySelectorAll('.otp-digit-input');
    const otp = '123456';
    otpInputs.forEach((input, index) => {
      input.value = otp[index];
    });

    // Auto-verify OTP
    setTimeout(() => {
      verifyOTP();
      
      // Initialize guided tour after login
      setTimeout(() => {
        initializeDemoGuide(role);
      }, 1500);

    }, 500);
  }, 500);
}

// ═══════════════════════════════════════════════════════════════════════════
// DEMO GUIDE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Initialize guided tour with BRD references
 */
function initializeDemoGuide(role) {
  const roleConfig = DEMO_CONFIG.roles[role];
  demoState.totalSteps = roleConfig.steps.length;

  // Create guide overlay
  createDemoGuideOverlay();
  
  // Start first step
  advanceDemoStep(0);
}

/**
 * Create demo guide overlay with navigation
 */
function createDemoGuideOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'demoGuideOverlay';
  overlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      backdrop-filter: blur(3px);
    "></div>

    <div style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #0a1f3d, #0f2a4d);
      border: 2px solid #5C0A28;
      border-radius: 16px;
      padding: 40px;
      max-width: 600px;
      z-index: 1001;
      box-shadow: 0 20px 60px rgba(92, 10, 40, 0.4), 0 0 40px rgba(92, 10, 40, 0.2);
    " class="demo-guide-panel">
      <button onclick="closeDemoGuide()" style="
        position: absolute;
        top: 15px;
        right: 15px;
        background: transparent;
        border: none;
        color: rgba(255,255,255,0.7);
        font-size: 24px;
        cursor: pointer;
      ">×</button>

      <div style="
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 20px;
      ">
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #5C0A28, #8B1538);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        ">
          🎬
        </div>
        <div>
          <h3 style="
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            color: #fff;
          ">Demo Guided Tour</h3>
          <p style="
            margin: 4px 0 0;
            font-size: 12px;
            color: rgba(255,255,255,0.6);
          ">Auto-guided platform walkthrough</p>
        </div>
      </div>

      <div id="demoGuideContent" style="
        min-height: 200px;
        margin-bottom: 24px;
      "></div>

      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      ">
        <button onclick="previousDemoStep()" style="
          padding: 10px;
          background: rgba(92, 10, 40, 0.2);
          border: 1px solid rgba(92, 10, 40, 0.5);
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        " class="btn-demo-nav">← Back</button>
        <button onclick="nextDemoStep()" style="
          padding: 10px;
          background: linear-gradient(135deg, #5C0A28, #8B1538);
          border: none;
          color: #fff;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s ease;
        " class="btn-demo-nav">Next →</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

/**
 * Advance to next demo step
 */
function advanceDemoStep(stepIndex) {
  if (stepIndex >= demoState.totalSteps) {
    completeDemoTour();
    return;
  }

  demoState.currentStep = stepIndex;
  const roleConfig = DEMO_CONFIG.roles[demoState.selectedRole];
  const stepKey = roleConfig.steps[stepIndex];
  const guidance = DEMO_CONFIG.stepGuidance[stepKey];
  const brd = DEMO_CONFIG.brdReferences[stepKey];

  const content = document.getElementById('demoGuideContent');
  if (!content) return;

  content.innerHTML = `
    <div>
      <!-- Step Progress -->
      <div style="
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(92, 10, 40, 0.3);
      ">
        <div style="
          font-size: 11px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">Step ${stepIndex + 1} / ${demoState.totalSteps}</div>
        <div style="
          width: 100%;
          height: 4px;
          background: rgba(92, 10, 40, 0.2);
          border-radius: 2px;
          overflow: hidden;
        ">
          <div style="
            width: ${((stepIndex + 1) / demoState.totalSteps) * 100}%;
            height: 100%;
            background: linear-gradient(90deg, #5C0A28, #8B1538);
            transition: width 0.5s ease;
          "></div>
        </div>
      </div>

      <!-- Step Title & Description -->
      <div style="margin-bottom: 24px;">
        <h4 style="
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 800;
          color: #fff;
        ">${guidance.title}</h4>
        <p style="
          margin: 0;
          font-size: 13px;
          color: rgba(255,255,255,0.75);
          line-height: 1.6;
        ">${guidance.description}</p>
      </div>

      <!-- BRD Reference Card -->
      <div style="
        background: linear-gradient(135deg, rgba(92, 10, 40, 0.15), rgba(92, 10, 40, 0.08));
        border: 1px solid rgba(92, 10, 40, 0.3);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 16px;
      ">
        <div style="
          font-size: 11px;
          color: #5C0A28;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        ">📄 BRD REFERENCE</div>
        <div style="
          font-size: 12px;
          color: #fff;
          font-weight: 600;
          margin-bottom: 6px;
        ">${brd.section}</div>
        <div style="
          font-size: 11px;
          color: rgba(255,255,255,0.75);
          margin-bottom: 4px;
        ">${brd.requirement}</div>
        <div style="
          font-size: 10px;
          color: rgba(255,255,255,0.6);
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        ">
          ${brd.features.map(f => `<span style="background:rgba(92,10,40,0.3); padding:2px 6px; border-radius:3px;">${f}</span>`).join('')}
        </div>
      </div>

      <!-- Highlights -->
      <div>
        <div style="
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
          text-transform: uppercase;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        ">🎯 What to Look For:</div>
        <ul style="
          margin: 0;
          padding-left: 16px;
          list-style: none;
        ">
          ${guidance.highlights.map(h => `
            <li style="
              font-size: 12px;
              color: rgba(255,255,255,0.75);
              margin-bottom: 6px;
              padding-left: 8px;
              position: relative;
            ">
              <span style="
                position: absolute;
                left: -16px;
                color: #5C0A28;
              ">▸</span>
              ${h}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;

  // Update button states
  const prevBtn = document.querySelector('.btn-demo-nav');
  if (prevBtn && stepIndex === 0) {
    prevBtn.disabled = true;
    prevBtn.style.opacity = '0.5';
  }
}

/**
 * Next demo step
 */
function nextDemoStep() {
  demoState.currentStep++;
  advanceDemoStep(demoState.currentStep);
}

/**
 * Previous demo step
 */
function previousDemoStep() {
  if (demoState.currentStep > 0) {
    demoState.currentStep--;
    advanceDemoStep(demoState.currentStep);
  }
}

/**
 * Complete demo tour
 */
function completeDemoTour() {
  closeDemoGuide();
  
  // Show completion message
  alert(
    '🎉 Demo Walkthrough Complete!\n\n' +
    `Role: ${demoState.selectedRole}\n` +
    `Steps Completed: ${demoState.totalSteps}\n` +
    `Duration: ~15 minutes\n\n` +
    'You can now explore the system freely or restart the demo from the navigation menu.\n\n' +
    'For full BRD reference, see: COMPREHENSIVE_BRD_2026_FINAL.md'
  );

  // Clear demo mode flag
  sessionStorage.removeItem('demoMode');
}

/**
 * Close demo guide
 */
function closeDemoGuide() {
  const overlay = document.getElementById('demoGuideOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.3s ease';
    setTimeout(() => overlay.remove(), 300);
  }
  demoState.autoGuideActive = false;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE INTEGRATION - ADD BRD REFERENCE BUTTONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Add BRD reference panel to any page
 */
function addBRDReferencePanel(pageType) {
  const brd = DEMO_CONFIG.brdReferences[pageType];
  if (!brd) return;

  const panel = document.createElement('div');
  panel.className = 'brd-reference-panel';
  panel.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, rgba(92, 10, 40, 0.3), rgba(92, 10, 40, 0.1));
    border: 1px solid rgba(92, 10, 40, 0.5);
    border-radius: 12px;
    padding: 16px;
    max-width: 300px;
    z-index: 100;
    box-shadow: 0 8px 24px rgba(92, 10, 40, 0.2);
    font-size: 12px;
    color: rgba(255,255,255,0.9);
  `;

  panel.innerHTML = `
    <button onclick="this.parentElement.remove()" style="
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.7);
      font-size: 18px;
      cursor: pointer;
    ">×</button>

    <div style="
      font-size: 10px;
      color: #5C0A28;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 6px;
      letter-spacing: 0.5px;
    ">📄 BRD REFERENCE</div>

    <div style="
      font-weight: 700;
      margin-bottom: 6px;
      font-size: 11px;
    ">${brd.section}</div>

    <div style="
      font-size: 11px;
      color: rgba(255,255,255,0.8);
      margin-bottom: 8px;
      line-height: 1.5;
    ">${brd.requirement}</div>

    <div style="
      padding-top: 8px;
      border-top: 1px solid rgba(92, 10, 40, 0.4);
      font-size: 10px;
      color: rgba(255,255,255,0.6);
    ">
      ${brd.complianceStatus}
    </div>
  `;

  document.body.appendChild(panel);
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTO-INITIALIZATION ON PAGE LOAD
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on login page
  if (document.querySelector('.login-card')) {
    initDemoMode();
  }

  // Check if demo mode was active from previous page
  const demoData = sessionStorage.getItem('demoMode');
  if (demoData) {
    const demo = JSON.parse(demoData);
    if (demo.enabled && demo.autoGuide) {
      demoState.selectedRole = demo.role;
      setTimeout(() => initializeDemoGuide(demo.role), 1000);
    }
  }
});

// Export for external use
window.demoGuidance = {
  initDemoMode,
  launchDemoMode,
  selectDemoRole,
  initializeDemoGuide,
  advanceDemoStep,
  nextDemoStep,
  previousDemoStep,
  closeDemoGuide,
  addBRDReferencePanel
};
