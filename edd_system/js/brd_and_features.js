/**
 * BRD Reference, Voice Assistant, and Demo Walkthrough Features
 * Supports dashboard help and feature explanations
 */

// ═══════════════════════════════════════════════════════════════════════════
// BRD REFERENCE MODULE
// ═══════════════════════════════════════════════════════════════════════════

const BRDReference = {
  brdContent: {
    dashboard: {
      title: 'Dashboard - BRD Reference',
      sections: [
        '1. Dashboard provides real-time KYC/EDD monitoring',
        '2. Risk metrics show High/Medium/Low risk customers',
        '3. Case status tracking: Open, In Progress, Closed',
        '4. Customer 360 views integrated with T24',
        '5. Performance metrics by department and user',
        '6. Approval gates for Compliance and Head of Operations',
        '7. Audit trail for all customer actions'
      ]
    },
    edd_case: {
      title: 'EDD Case Management - BRD Reference',
      sections: [
        '1. EDD cases created only for High Risk customers',
        '2. Trigger: Next EDD Date in T24 or Risk Escalation',
        '3. Case Ownership: CDD manages from open to closure',
        '4. Digital form with mandatory field validation',
        '5. Document upload with verification',
        '6. Recommendation logic: Approve/Decline/Escalate',
        '7. Compliance approval gate before final closure'
      ]
    },
    kyc_form: {
      title: 'KYC Form - BRD Reference',
      sections: [
        '1. Customer personal information capture',
        '2. Source of income and wealth verification',
        '3. PEP screening and sanctions check',
        '4. Financial comparison engine',
        '5. Document upload for income verification',
        '6. Risk assessment trigger for EDD',
        '7. Re-KYC cycle monitoring'
      ]
    }
  },

  show(page) {
    const content = this.brdContent[page] || this.brdContent.dashboard;
    const html = `
      <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 9999; display: flex; align-items: center; justify-content: center;" id="brd-modal">
        <div style="background: #0a1f3d; border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; padding: 30px; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; color: white;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #00D4FF; font-size: 18px;">${content.title}</h2>
            <button onclick="document.getElementById('brd-modal').remove()" style="background: none; border: none; color: #00D4FF; font-size: 24px; cursor: pointer;">✕</button>
          </div>
          <div style="color: rgba(255,255,255,0.8); line-height: 1.8;">
            ${content.sections.map(s => `<p style="margin: 12px 0; font-size: 14px;">• ${s}</p>`).join('')}
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(0,212,255,0.2); text-align: center;">
            <button onclick="document.getElementById('brd-modal').remove()" style="padding: 10px 20px; background: rgba(0,212,255,0.2); border: 1px solid #00D4FF; color: #00D4FF; border-radius: 8px; cursor: pointer; font-weight: 600;">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// VOICE ASSISTANT MODULE
// ═══════════════════════════════════════════════════════════════════════════

const VOICE_ASSISTANT = {
  isSpeaking: false,

  speak(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        this.isSpeaking = true;
        console.log('🔊 Voice started');
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        console.log('🔊 Voice ended');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: show alert if speech synthesis not supported
      alert('🔊 Voice Assistant: ' + text);
    }
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// DEMO WALKTHROUGH MODULE
// ═══════════════════════════════════════════════════════════════════════════

const DemoWalkthrough = {
  steps: [
    {
      title: 'Welcome to EDD Dashboard',
      description: 'This system manages Enhanced Due Diligence for High Risk customers',
      highlight: null,
      action: 'View dashboard overview'
    },
    {
      title: 'Key Metrics',
      description: 'Monitor open cases, pending approvals, and customer risk levels in real-time',
      highlight: '.kpi-section',
      action: 'Check current metrics'
    },
    {
      title: 'Case Management',
      description: 'Each case is owned by CDD and tracked from creation to final closure',
      highlight: '[href*="edd_case"]',
      action: 'View EDD cases'
    },
    {
      title: 'Customer Information',
      description: 'Access customer 360 view with KYC, T24, and transaction data',
      highlight: '[href*="customer360"]',
      action: 'View customer details'
    },
    {
      title: 'Approvals & Governance',
      description: 'Compliance and Head of Operations approval gates ensure controlled workflows',
      highlight: '[class*="approval"]',
      action: 'Review approvals'
    },
    {
      title: 'Reports & Export',
      description: 'Generate Excel reports and monthly presentations for management review',
      highlight: '[class*="export"]',
      action: 'Export data'
    },
    {
      title: 'Tour Complete!',
      description: 'You are now familiar with the EDD system. Explore the dashboards and case management features.',
      highlight: null,
      action: 'Close tour'
    }
  ],
  currentStep: 0,

  start() {
    this.currentStep = 0;
    this.showStep();
  },

  showStep() {
    const step = this.steps[this.currentStep];
    
    // Highlight element if specified
    if (step.highlight && document.querySelector(step.highlight)) {
      document.querySelectorAll('[style*="box-shadow"]').forEach(el => {
        el.style.boxShadow = '';
      });
      document.querySelector(step.highlight).style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.5)';
    }

    const html = `
      <div style="position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #0a1f3d 0%, #0f2a4d 100%); border: 1px solid rgba(0,212,255,0.3); border-radius: 12px; padding: 20px; max-width: 350px; z-index: 9998; color: white; box-shadow: 0 8px 24px rgba(0,212,255,0.15);" id="walkthrough-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #00D4FF; font-size: 16px; font-weight: 700;">🎬 ${step.title}</h3>
          <span style="font-size: 12px; color: rgba(0,212,255,0.7);">${this.currentStep + 1} / ${this.steps.length}</span>
        </div>
        <p style="margin: 0 0 15px 0; font-size: 13px; color: rgba(255,255,255,0.8); line-height: 1.6;">${step.description}</p>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
          ${this.currentStep > 0 ? '<button onclick="DemoWalkthrough.prev()" style="flex: 1; padding: 8px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">← Back</button>' : ''}
          ${this.currentStep < this.steps.length - 1 ? '<button onclick="DemoWalkthrough.next()" style="flex: 1; padding: 8px 12px; background: rgba(0,212,255,0.2); border: 1px solid #00D4FF; color: #00D4FF; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Next →</button>' : '<button onclick="DemoWalkthrough.end()" style="flex: 1; padding: 8px 12px; background: rgba(76,175,80,0.2); border: 1px solid #4CAF50; color: #4CAF50; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">Done ✓</button>'}
          <button onclick="DemoWalkthrough.end()" style="padding: 8px 12px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 6px; cursor: pointer; font-size: 12px;">Skip</button>
        </div>
      </div>
    `;

    const existing = document.getElementById('walkthrough-card');
    if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
  },

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.showStep();
    }
  },

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.showStep();
    }
  },

  end() {
    const card = document.getElementById('walkthrough-card');
    if (card) card.remove();
    document.querySelectorAll('[style*="box-shadow"]').forEach(el => {
      el.style.boxShadow = '';
    });
    console.log('✓ Demo walkthrough ended');
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PRINT REPOSITORY MODULE
// ═══════════════════════════════════════════════════════════════════════════

const PrintRepository = {
  print(page) {
    const timestamp = new Date().toLocaleString();
    const user = sessionStorage.getItem('edd_user') ? JSON.parse(sessionStorage.getItem('edd_user')).name : 'Unknown User';
    
    const header = `
      <div style="page-break-after: always; padding: 20px; border-bottom: 2px solid #000; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #000; font-size: 20px;">QIB EDD System Report</h1>
        <p style="margin: 5px 0; font-size: 12px; color: #333;">
          <strong>Printed by:</strong> ${user}<br>
          <strong>Print Date/Time:</strong> ${timestamp}<br>
          <strong>Page:</strong> ${page}
        </p>
      </div>
    `;

    const mainContent = document.body.innerHTML;
    const printWindow = window.open('', '', 'width=900,height=700');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>QIB EDD - ${page}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
            .no-print { display: none !important; }
            * { page-break-inside: avoid; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
            th { background: #f5f5f5; font-weight: bold; }
          </style>
        </head>
        <body>
          ${header}
          <div>Content ready for printing. Use browser print dialog (Ctrl+P / Cmd+P) to complete.</div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
};

console.log('✓ BRD Reference, Voice Assistant, and Demo Features loaded');

// Make all functions globally accessible
window.BRDReference = BRDReference;
window.VOICE_ASSISTANT = VOICE_ASSISTANT;
window.DemoWalkthrough = DemoWalkthrough;
window.PrintRepository = PrintRepository;
