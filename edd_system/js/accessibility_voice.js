/**
 * QIB EDD System — Accessibility, Arabic Language & Voice Assistant Module
 * =========================================================================
 * Provides:
 *  - Arabic / English language toggle with RTL layout support
 *  - Gulf female voice assistant using Web Speech Synthesis API
 *  - Voice command navigation using Web Speech Recognition API
 *  - Accessibility controls: large text, high contrast, keyboard navigation
 *  - BRD reference panel per page
 *  - System walkthrough / demo presentation mode
 *  - Print system report
 *  - Page explain mode
 *
 * Self-initialising: simply include this script in any page.
 * All features work locally in the browser — no external integrations required.
 */

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // 1. PAGE METADATA  (descriptions & BRD references for every page)
  // ─────────────────────────────────────────────────────────────────────────
  const PAGE_META = {
    'login.html': {
      en: 'This is the employee login portal for the QIB Financial Crime Investigation System. Enter your Employee ID, password, and select your role to access the platform.',
      ar: 'أهلاً بك في منصة التحقيق المالي لبنك قطر الإسلامي. هذه الصفحة مخصصة لدخول الموظفين. أدخل رقم الموظف وكلمة المرور واختر دورك الوظيفي للوصول إلى النظام.',
      brd: { ref: 'BRD-AUTH-001', description: 'Employee Authentication & Role-Based Access Control', business: 'Secure access to the EDD investigation platform using multi-factor authentication with role selection.', implementation: 'Multi-step login: Employee ID → Password → Role Selection → OTP.' }
    },
    'dashboard.html': {
      en: 'This is the main operational dashboard. It shows EDD case statistics, risk classification summaries, active cases, compliance alerts, and quick-access navigation to all platform modules.',
      ar: 'هذه هي لوحة التحكم الرئيسية للنظام. تعرض إحصائيات قضايا التعرف المعمق على العملاء، وملخصات تصنيف المخاطر، والقضايا النشطة، وتنبيهات الامتثال.',
      brd: { ref: 'BRD-DASH-002', description: 'Operational Dashboard & KPI Display', business: 'Provides supervisors and officers a real-time overview of the investigation workload and risk landscape.', implementation: 'Dynamic KPI cards, risk heat-map, case queue with priority indicators.' }
    },
    'edd_case.html': {
      en: 'This is the EDD Case Management screen. It allows investigators to review customer risk profiles, document findings, escalate cases, and record workflow approvals.',
      ar: 'شاشة إدارة قضايا التعرف المعمق على العملاء. تتيح للمحققين مراجعة ملفات مخاطر العملاء، وتوثيق النتائج، ورفع القضايا للمراجعة العليا، وتسجيل موافقات سير العمل.',
      brd: { ref: 'BRD-EDD-010', description: 'EDD Case Lifecycle Management', business: 'Manages the full lifecycle of an Enhanced Due Diligence case from initiation through approval.', implementation: 'Maker/Checker workflow with 4-digit PIN confirmation and audit trail.' }
    },
    'risk_management.html': {
      en: 'This is the Risk Management and Classification screen. It displays customer risk scores, trigger flags such as PEP and sanctions, and risk categorisation results.',
      ar: 'شاشة إدارة المخاطر وتصنيفها. تعرض درجات مخاطر العملاء، وعلامات التنبيه مثل الأشخاص المعرضون سياسياً والعقوبات الدولية، ونتائج تصنيف المخاطر.',
      brd: { ref: 'BRD-RISK-005', description: 'Automated Risk Scoring & Classification Engine', business: 'Classifies customers into Low / Medium / High / Auto-High risk categories based on rule engine.', implementation: 'Weighted scoring across 12 risk dimensions with real-time recalculation.' }
    },
    'management_dashboard.html': {
      en: 'This is the Management Dashboard. It provides executive-level reporting on compliance metrics, SLA adherence, case throughput, and audit readiness.',
      ar: 'لوحة تحكم الإدارة العليا. توفر تقارير على مستوى الإدارة التنفيذية حول مؤشرات الامتثال، والتزام مستويات الخدمة، وإنتاجية القضايا.',
      brd: { ref: 'BRD-MGT-020', description: 'Executive Management Reporting Dashboard', business: 'Enables management to monitor compliance KPIs and SLA performance in real time.', implementation: 'Aggregated metrics with drill-down capability and export to PDF.' }
    },
    'compliance_view.html': {
      en: 'This is the Compliance Review screen. Compliance officers use it to issue final opinions on escalated EDD cases, record suspicious activity decisions, and maintain regulatory audit trails.',
      ar: 'شاشة مراجعة الامتثال. يستخدمها مسؤولو الامتثال لإصدار آراء نهائية في قضايا التعرف المعمق المرفوعة، وتسجيل قرارات النشاط المشبوه.',
      brd: { ref: 'BRD-COMP-015', description: 'Compliance Officer Review & Final Decision', business: 'Provides the last line of defence for AML/CFT case decisions before regulatory reporting.', implementation: 'Final decision panel with escalation to QCB/FIU when required.' }
    },
    'cdd_view.html': {
      en: 'This is the CDD Operations screen. CDD officers review customer documentation, verify identity information, and assess the adequacy of due diligence performed.',
      ar: 'شاشة عمليات العناية الواجبة للعملاء. يراجع مسؤولو CDD وثائق العملاء، ويتحققون من معلومات الهوية.',
      brd: { ref: 'BRD-CDD-008', description: 'Customer Due Diligence Operations', business: 'Ensures adequate CDD is performed and documented for all high-risk customer reviews.', implementation: 'Document checklist with maker/checker approval and digital PIN confirmation.' }
    },
    'organization.html': {
      en: 'This is the Organisation Structure screen. It shows the bank\'s departmental hierarchy, reporting lines, and staff assignments relevant to EDD investigations.',
      ar: 'شاشة الهيكل التنظيمي للبنك. تعرض التسلسل الهرمي للإدارات وخطوط الإبلاغ والمهام الوظيفية ذات الصلة بتحقيقات التعرف المعمق.',
      brd: { ref: 'BRD-ORG-025', description: 'Organisational Structure & Role Mapping', business: 'Maps the bank departments to the EDD workflow roles for proper case assignment.', implementation: 'Interactive org chart with role-to-employee mapping.' }
    },
    'kyc_form.html': {
      en: 'This is the KYC Form screen. It captures all required Know Your Customer information for new and existing customers undergoing enhanced due diligence.',
      ar: 'شاشة نموذج اعرف عميلك. تجمع جميع معلومات التحقق المطلوبة للعملاء الجدد والحاليين الخاضعين للتعرف المعمق.',
      brd: { ref: 'BRD-KYC-030', description: 'KYC Data Capture & Validation Form', business: 'Ensures all mandatory KYC fields are collected and validated before case submission.', implementation: 'Dynamic form with field-level validation and document upload capability.' }
    },
    'customer360.html': {
      en: 'This is the Customer 360 view. It aggregates all available customer data including transaction history, account details, product holdings, and risk indicators in a single unified view.',
      ar: 'عرض العميل الشامل 360 درجة. يجمع جميع بيانات العميل المتاحة بما في ذلك سجل المعاملات والحسابات والمنتجات ومؤشرات المخاطر.',
      brd: { ref: 'BRD-C360-012', description: 'Customer 360 Unified View', business: 'Provides investigators a holistic view of customer relationships and behaviour patterns.', implementation: 'Integrated data from T24, ETL, and SnapView systems.' }
    },
    'default': {
      en: 'You are viewing a page of the QIB Financial Crime Investigation Platform. This system supports EDD case management, risk classification, compliance monitoring, and regulatory reporting.',
      ar: 'أنت تشاهد صفحة من منصة التحقيق في الجرائم المالية لبنك قطر الإسلامي. يدعم النظام إدارة قضايا التعرف المعمق وتصنيف المخاطر ومراقبة الامتثال.',
      brd: { ref: 'BRD-SYS-001', description: 'QIB EDD Platform — System Overview', business: 'Enterprise financial crime investigation and AML compliance platform aligned with Qatar Central Bank regulations.', implementation: 'Web-based platform with role-based access, maker/checker workflow, and full audit trail.' }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ARABIC LANGUAGE PACK
  // ─────────────────────────────────────────────────────────────────────────
  const AR_LABELS = {
    // Navigation
    'Dashboard': 'لوحة التحكم',
    'EDD Cases': 'قضايا التعرف المعمق',
    'Organization': 'الهيكل التنظيمي',
    'Business View': 'عرض الأعمال',
    'CDD Operations': 'عمليات العناية الواجبة',
    'Compliance': 'الامتثال',
    'Risk Management': 'إدارة المخاطر',
    'Customer 360': 'العميل الشامل',
    'Management': 'الإدارة',
    'Notifications': 'الإشعارات',
    'Audit Console': 'وحدة التدقيق',
    'Logout': 'تسجيل الخروج',
    // Login
    'Employee ID': 'رقم الموظف',
    'Password': 'كلمة المرور',
    'Continue to Password': 'المتابعة إلى كلمة المرور',
    'Continue to Role Selection': 'المتابعة لاختيار الدور',
    'AUTHENTICATE & ENTER SYSTEM': 'تسجيل الدخول والدخول للنظام',
    'Role Selection': 'اختيار الدور',
    // Risk
    'High Risk': 'مخاطر عالية',
    'Medium Risk': 'مخاطر متوسطة',
    'Low Risk': 'مخاطر منخفضة',
    'Auto High': 'عالية تلقائية',
    // Status
    'Open': 'مفتوحة',
    'Closed': 'مغلقة',
    'Pending': 'قيد الانتظار',
    'Approved': 'موافق عليها',
    'Rejected': 'مرفوضة',
    'Escalated': 'مُحالة',
    // Actions
    'Submit': 'إرسال',
    'Cancel': 'إلغاء',
    'Approve': 'موافقة',
    'Reject': 'رفض',
    'Save': 'حفظ',
    'Print': 'طباعة',
    'Export': 'تصدير',
    'Search': 'بحث',
    // Toolbar
    'Voice Guide': 'الدليل الصوتي',
    'Stop Voice': 'إيقاف الصوت',
    'Explain Page': 'شرح الصفحة',
    'BRD Reference': 'مرجع المتطلبات',
    'Accessibility': 'إمكانية الوصول',
    'Print Report': 'طباعة التقرير',
    'System Walkthrough': 'جولة النظام',
    'Arabic': 'عربي',
    'English': 'English',
    'Voice Commands': 'الأوامر الصوتية',
    'High Contrast': 'تباين عالي',
    'Large Text': 'نص كبير',
    'Normal Text': 'نص عادي'
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 3. SYSTEM WALKTHROUGH STEPS
  // ─────────────────────────────────────────────────────────────────────────
  const WALKTHROUGH_STEPS = [
    { page: 'login.html',             title: 'Step 1: Employee Login',             title_ar: 'الخطوة 1: دخول الموظف',             desc: 'Employees authenticate using Employee ID, password, role selection, and a 4-digit OTP.',             desc_ar: 'يقوم الموظفون بالمصادقة باستخدام رقم الموظف وكلمة المرور واختيار الدور ورمز التحقق المكوّن من 4 أرقام.' },
    { page: 'dashboard.html',         title: 'Step 2: Operational Dashboard',      title_ar: 'الخطوة 2: لوحة التحكم التشغيلية', desc: 'The dashboard provides a real-time overview of all active EDD cases, risk alerts, and KPIs.',             desc_ar: 'توفر لوحة التحكم نظرة شاملة في الوقت الفعلي على قضايا التعرف المعمق النشطة وتنبيهات المخاطر.' },
    { page: 'risk_management.html',   title: 'Step 3: Risk Classification',        title_ar: 'الخطوة 3: تصنيف المخاطر',         desc: 'The risk engine scores customers across 12 dimensions and classifies them into Low / Medium / High.',    desc_ar: 'يقيّم محرك المخاطر العملاء عبر 12 بُعدًا ويصنّفهم إلى منخفض ومتوسط وعالٍ.' },
    { page: 'edd_case.html',          title: 'Step 4: EDD Case Management',        title_ar: 'الخطوة 4: إدارة قضايا التعرف المعمق', desc: 'Investigators review the case, document findings, and advance through the maker/checker workflow.',    desc_ar: 'يراجع المحققون القضية ويوثّقون النتائج ويتقدمون عبر سير عمل الصانع والمدقق.' },
    { page: 'compliance_view.html',   title: 'Step 5: Compliance Review',          title_ar: 'الخطوة 5: مراجعة الامتثال',       desc: 'Compliance officers issue the final opinion and escalate to QCB/FIU if suspicious activity is found.', desc_ar: 'يُصدر مسؤولو الامتثال الرأي النهائي ويُحيلون إلى المركزي إذا وُجد نشاط مشبوه.' },
    { page: 'management_dashboard.html', title: 'Step 6: Management Reporting',    title_ar: 'الخطوة 6: التقارير الإدارية',      desc: 'Management reviews compliance KPIs, SLA adherence, and case throughput in executive dashboards.',    desc_ar: 'تراجع الإدارة مؤشرات الأداء الرئيسية للامتثال والتزام مستويات الخدمة وإنتاجية القضايا.' }
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 4. STATE
  // ─────────────────────────────────────────────────────────────────────────
  const state = {
    lang: localStorage.getItem('qib_lang') || 'en',
    highContrast: localStorage.getItem('qib_hc') === '1',
    largeText: localStorage.getItem('qib_lt') === '1',
    voiceActive: false,
    recognition: null
  };

  // Detect current page
  function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename;
  }

  function getPageMeta() {
    const page = getCurrentPage();
    return PAGE_META[page] || PAGE_META['default'];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. VOICE ASSISTANT  (Gulf female voice via Web Speech Synthesis)
  // ─────────────────────────────────────────────────────────────────────────
  const VoiceAssistant = {
    speak: function (text, lang) {
      if (!window.speechSynthesis) {
        alert('Voice synthesis is not supported in this browser.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang || (state.lang === 'ar' ? 'ar-SA' : 'en-US');
      utterance.rate = 0.9;
      utterance.pitch = 1.1;

      // Prefer Arabic female voice for Gulf dialect
      const voices = window.speechSynthesis.getVoices();
      if (lang === 'ar-SA' || state.lang === 'ar') {
        const arabicFemale = voices.find(v =>
          v.lang.startsWith('ar') && v.name.toLowerCase().includes('female')
        ) || voices.find(v => v.lang.startsWith('ar'));
        if (arabicFemale) utterance.voice = arabicFemale;
      } else {
        const englishFemale = voices.find(v =>
          v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
        ) || voices.find(v => v.lang.startsWith('en'));
        if (englishFemale) utterance.voice = englishFemale;
      }

      utterance.onstart = function () {
        state.voiceActive = true;
        const btn = document.getElementById('qib-voice-btn');
        if (btn) btn.classList.add('speaking');
      };
      utterance.onend = function () {
        state.voiceActive = false;
        const btn = document.getElementById('qib-voice-btn');
        if (btn) btn.classList.remove('speaking');
      };
      window.speechSynthesis.speak(utterance);
    },

    stop: function () {
      window.speechSynthesis && window.speechSynthesis.cancel();
      state.voiceActive = false;
      const btn = document.getElementById('qib-voice-btn');
      if (btn) btn.classList.remove('speaking');
    },

    explainPage: function () {
      const meta = getPageMeta();
      const text = state.lang === 'ar' ? meta.ar : meta.en;
      this.speak(text);
    }
  };

  // Ensure voices are loaded (Chrome loads them asynchronously)
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', function () {
      window.speechSynthesis.getVoices();
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 6. VOICE COMMANDS  (Web Speech Recognition)
  // ─────────────────────────────────────────────────────────────────────────
  const VoiceCommands = {
    commands: [
      { patterns: ['افتح لوحة التحكم', 'open dashboard', 'go to dashboard', 'dashboard'],             action: function () { window.location.href = 'dashboard.html'; } },
      { patterns: ['افتح ملف المخاطر', 'open risk', 'risk management', 'risk profile'],               action: function () { window.location.href = 'risk_management.html'; } },
      { patterns: ['افتح قضية', 'open edd case', 'edd case', 'investigation'],                        action: function () { window.location.href = 'edd_case.html'; } },
      { patterns: ['لوحة إدارة', 'management dashboard', 'management'],                               action: function () { window.location.href = 'management_dashboard.html'; } },
      { patterns: ['الامتثال', 'compliance', 'open compliance'],                                       action: function () { window.location.href = 'compliance_view.html'; } },
      { patterns: ['اشرح الصفحة', 'explain this page', 'explain page', 'what is this page'],          action: function () { VoiceAssistant.explainPage(); } },
      { patterns: ['جولة النظام', 'system walkthrough', 'walkthrough', 'tour'],                       action: function () { Walkthrough.start(); } },
      { patterns: ['طباعة', 'print report', 'print'],                                                  action: function () { PrintReport.print(); } },
      { patterns: ['تسجيل الخروج', 'logout', 'log out', 'sign out'],                                  action: function () { window.location.href = 'login.html'; } }
    ],

    start: function () {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        VoiceAssistant.speak(state.lang === 'ar'
          ? 'عفوًا، متصفحك لا يدعم التعرف على الكلام.'
          : 'Sorry, your browser does not support voice recognition.');
        return;
      }
      if (state.recognition) {
        state.recognition.stop();
        state.recognition = null;
        this.updateBtn(false);
        return;
      }
      const rec = new SpeechRecognition();
      rec.lang = state.lang === 'ar' ? 'ar-SA' : 'en-US';
      rec.continuous = false;
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      state.recognition = rec;

      rec.onstart = function () { VoiceCommands.updateBtn(true); };
      rec.onend = function () {
        VoiceCommands.updateBtn(false);
        state.recognition = null;
      };
      rec.onerror = function (e) {
        VoiceCommands.updateBtn(false);
        state.recognition = null;
        if (e.error !== 'no-speech') {
          VoiceAssistant.speak(state.lang === 'ar' ? 'حدث خطأ في التعرف على الكلام.' : 'Voice recognition error: ' + e.error);
        }
      };
      rec.onresult = function (event) {
        const results = [];
        for (let i = 0; i < event.results[0].length; i++) {
          results.push(event.results[0][i].transcript.toLowerCase().trim());
        }
        VoiceCommands.processResult(results);
      };
      rec.start();
      VoiceAssistant.speak(state.lang === 'ar'
        ? 'أنا أستمع. قل أمرك.'
        : 'Listening. Please say a command.');
    },

    processResult: function (transcripts) {
      for (const cmd of this.commands) {
        for (const pattern of cmd.patterns) {
          for (const transcript of transcripts) {
            if (transcript.includes(pattern.toLowerCase())) {
              cmd.action();
              return;
            }
          }
        }
      }
      VoiceAssistant.speak(state.lang === 'ar'
        ? 'عفوًا، لم أفهم الأمر. حاول مرة أخرى.'
        : 'Command not recognised. Please try again.');
    },

    updateBtn: function (listening) {
      const btn = document.getElementById('qib-mic-btn');
      if (btn) {
        btn.classList.toggle('listening', listening);
        btn.title = listening ? (state.lang === 'ar' ? 'أنا أستمع...' : 'Listening...') : (state.lang === 'ar' ? 'الأوامر الصوتية' : 'Voice Commands');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 7. ACCESSIBILITY CONTROLS
  // ─────────────────────────────────────────────────────────────────────────
  const Accessibility = {
    toggleHighContrast: function () {
      state.highContrast = !state.highContrast;
      localStorage.setItem('qib_hc', state.highContrast ? '1' : '0');
      document.documentElement.classList.toggle('qib-high-contrast', state.highContrast);
      const btn = document.getElementById('qib-hc-btn');
      if (btn) btn.classList.toggle('active', state.highContrast);
    },
    toggleLargeText: function () {
      state.largeText = !state.largeText;
      localStorage.setItem('qib_lt', state.largeText ? '1' : '0');
      document.documentElement.classList.toggle('qib-large-text', state.largeText);
      const btn = document.getElementById('qib-lt-btn');
      if (btn) btn.classList.toggle('active', state.largeText);
    },
    applyStored: function () {
      if (state.highContrast) document.documentElement.classList.add('qib-high-contrast');
      if (state.largeText) document.documentElement.classList.add('qib-large-text');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 8. LANGUAGE TOGGLE  (Arabic ↔ English with RTL)
  // ─────────────────────────────────────────────────────────────────────────
  const Language = {
    toggle: function () {
      state.lang = state.lang === 'en' ? 'ar' : 'en';
      localStorage.setItem('qib_lang', state.lang);
      this.apply();
    },
    apply: function () {
      const isAr = state.lang === 'ar';
      document.documentElement.setAttribute('lang', state.lang);
      document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
      document.documentElement.classList.toggle('qib-rtl', isAr);

      // Update the lang toggle button label
      const btn = document.getElementById('qib-lang-btn');
      if (btn) btn.textContent = isAr ? 'EN' : 'عربي';

      // Translate visible text nodes in nav/buttons if Arabic using a Map lookup for efficiency
      if (isAr) {
        const arMap = new Map(Object.entries(AR_LABELS));
        document.querySelectorAll('span, label, button, a, th, td, h1, h2, h3, h4, .nav-section-title, .form-label').forEach(function (el) {
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            const text = el.childNodes[0].nodeValue.trim();
            if (arMap.has(text)) {
              el.setAttribute('data-en', text);
              el.childNodes[0].nodeValue = arMap.get(text);
            }
          }
        });
        // Add Arabic font
        document.documentElement.style.fontFamily = "'Segoe UI', 'Tahoma', 'Arial Unicode MS', 'Noto Naskh Arabic', sans-serif";
      } else {
        // Restore English text
        document.querySelectorAll('[data-en]').forEach(function (el) {
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            el.childNodes[0].nodeValue = el.getAttribute('data-en');
          }
        });
        document.documentElement.style.fontFamily = '';
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 9. BRD REFERENCE PANEL
  // ─────────────────────────────────────────────────────────────────────────
  const BRDPanel = {
    show: function () {
      const meta = getPageMeta();
      const brd = meta.brd;
      const existing = document.getElementById('qib-brd-panel');
      if (existing) { existing.remove(); return; }
      const panel = document.createElement('div');
      panel.id = 'qib-brd-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', 'BRD Reference');
      panel.innerHTML = `
        <div class="qib-brd-inner">
          <div class="qib-brd-header">
            <span class="qib-brd-ref">${brd.ref}</span>
            <button class="qib-brd-close" data-action="close-brd" aria-label="Close BRD panel">✕</button>
          </div>
          <h3 class="qib-brd-title">${brd.description}</h3>
          <div class="qib-brd-section"><strong>📋 Business Requirement</strong><p>${brd.business}</p></div>
          <div class="qib-brd-section"><strong>⚙️ System Implementation</strong><p>${brd.implementation}</p></div>
          <div class="qib-brd-footer">Qatar Islamic Bank — EDD Platform BRD v3.2</div>
        </div>`;
      document.body.appendChild(panel);
      // Use event listener instead of inline onclick
      panel.querySelector('[data-action="close-brd"]').addEventListener('click', function () {
        BRDPanel.close();
      });
      setTimeout(function () { panel.classList.add('visible'); }, 10);
    },

    close: function () {
      const panel = document.getElementById('qib-brd-panel');
      if (panel) panel.remove();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 10. SYSTEM WALKTHROUGH
  // ─────────────────────────────────────────────────────────────────────────
  const Walkthrough = {
    stepIndex: 0,
    active: false,

    start: function () {
      this.stepIndex = 0;
      this.active = true;
      this.showStep();
    },

    showStep: function () {
      const existing = document.getElementById('qib-walkthrough-panel');
      if (existing) existing.remove();
      if (!this.active || this.stepIndex >= WALKTHROUGH_STEPS.length) {
        this.active = false;
        VoiceAssistant.speak(state.lang === 'ar' ? 'انتهت الجولة التعريفية للنظام.' : 'System walkthrough complete. Thank you.');
        return;
      }
      const step = WALKTHROUGH_STEPS[this.stepIndex];
      const isLast = this.stepIndex === WALKTHROUGH_STEPS.length - 1;
      const isAr = state.lang === 'ar';
      const panel = document.createElement('div');
      panel.id = 'qib-walkthrough-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      panel.setAttribute('aria-label', isAr ? 'جولة النظام' : 'System Walkthrough');
      panel.innerHTML = `
        <div class="qib-wt-inner">
          <div class="qib-wt-step">${isAr ? 'الخطوة' : 'Step'} ${this.stepIndex + 1} / ${WALKTHROUGH_STEPS.length}</div>
          <h3 class="qib-wt-title">${isAr ? step.title_ar : step.title}</h3>
          <p class="qib-wt-desc">${isAr ? step.desc_ar : step.desc}</p>
          <div class="qib-wt-actions">
            <button class="qib-wt-btn-secondary" data-wt="close" aria-label="${isAr ? 'إغلاق الجولة' : 'Close walkthrough'}">${isAr ? 'إغلاق' : 'Close'}</button>
            ${this.stepIndex > 0 ? `<button class="qib-wt-btn-secondary" data-wt="prev" aria-label="${isAr ? 'الخطوة السابقة' : 'Previous step'}">${isAr ? 'السابق' : 'Previous'}</button>` : ''}
            <button class="qib-wt-btn-primary" data-wt="next" aria-label="${isLast ? (isAr ? 'إنهاء الجولة' : 'Finish walkthrough') : (isAr ? 'الخطوة التالية' : 'Next step')}">
              ${isLast ? (isAr ? 'إنهاء الجولة' : 'Finish') : (isAr ? 'التالي →' : 'Next →')}
            </button>
            <button class="qib-wt-btn-voice" data-wt="voice" title="${isAr ? 'استمع' : 'Listen to this step'}" aria-label="${isAr ? 'استمع إلى وصف هذه الخطوة' : 'Listen to step description'}">🔊</button>
          </div>
          <div class="qib-wt-nav-hint">
            ${isAr ? 'انتقل إلى:' : 'Navigate to:'} <a href="${step.page}" class="qib-wt-page-link">${step.page}</a>
          </div>
        </div>`;
      document.body.appendChild(panel);
      // Wire up buttons with event listeners (avoids inline onclick / XSS risk)
      const desc = isAr ? step.desc_ar : step.desc;
      panel.querySelector('[data-wt="close"]').addEventListener('click', function () { Walkthrough.close(); });
      if (this.stepIndex > 0) {
        panel.querySelector('[data-wt="prev"]').addEventListener('click', function () { Walkthrough.prev(); });
      }
      panel.querySelector('[data-wt="next"]').addEventListener('click', function () { Walkthrough.next(); });
      panel.querySelector('[data-wt="voice"]').addEventListener('click', function () { VoiceAssistant.speak(desc); });
      setTimeout(function () { panel.classList.add('visible'); }, 10);
      VoiceAssistant.speak(isAr ? step.desc_ar : step.desc);
    },

    next: function () {
      this.stepIndex++;
      this.showStep();
    },

    prev: function () {
      if (this.stepIndex > 0) this.stepIndex--;
      this.showStep();
    },

    close: function () {
      this.active = false;
      const panel = document.getElementById('qib-walkthrough-panel');
      if (panel) panel.remove();
      VoiceAssistant.stop();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 11. PRINT SYSTEM REPORT
  // ─────────────────────────────────────────────────────────────────────────
  const PrintReport = {
    print: function () {
      const meta = getPageMeta();
      const brd = meta.brd;
      const isAr = state.lang === 'ar';
      const reportHTML = `<!DOCTYPE html>
<html lang="${state.lang}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>QIB EDD — System Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
    h1 { color: #0a1f3d; border-bottom: 3px solid #D4AF37; padding-bottom: 12px; }
    h2 { color: #0a1f3d; margin-top: 24px; }
    .section { margin-bottom: 24px; padding: 16px; border: 1px solid #ddd; border-radius: 8px; }
    .label { font-weight: bold; color: #555; }
    .badge { display: inline-block; background: #0a1f3d; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th { background: #0a1f3d; color: white; padding: 10px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #eee; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <h1>🏦 Qatar Islamic Bank — EDD System Report</h1>
  <div class="section">
    <h2>${isAr ? 'نظرة عامة على النظام' : 'System Overview'}</h2>
    <p class="label">${isAr ? 'المنصة:' : 'Platform:'}</p><p>QIB Financial Crime Investigation Platform v3.2</p>
    <p class="label">${isAr ? 'الغرض:' : 'Purpose:'}</p><p>${isAr ? 'منصة إدارة قضايا التعرف المعمق على العملاء ومراقبة الامتثال لمكافحة غسيل الأموال.' : 'Enterprise EDD case management and AML compliance monitoring platform.'}</p>
    <p class="label">${isAr ? 'التاريخ:' : 'Date:'}</p><p>${new Date().toLocaleDateString(isAr ? 'ar-QA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  <div class="section">
    <h2>${isAr ? 'مرجع المتطلبات للصفحة الحالية' : 'Current Page BRD Reference'}</h2>
    <p><span class="badge">${brd.ref}</span></p>
    <p class="label">${isAr ? 'الوصف:' : 'Description:'}</p><p>${brd.description}</p>
    <p class="label">${isAr ? 'متطلب الأعمال:' : 'Business Requirement:'}</p><p>${brd.business}</p>
    <p class="label">${isAr ? 'التنفيذ:' : 'Implementation:'}</p><p>${brd.implementation}</p>
  </div>
  <div class="section">
    <h2>${isAr ? 'رحلة العميل والمخاطر' : 'Customer Journey & Risk Workflow'}</h2>
    <table>
      <tr><th>${isAr ? 'المرحلة' : 'Stage'}</th><th>${isAr ? 'الإدارة المسؤولة' : 'Department'}</th><th>${isAr ? 'الدور' : 'Role'}</th></tr>
      <tr><td>${isAr ? 'إنشاء القضية' : 'Case Creation'}</td><td>${isAr ? 'الأعمال' : 'Business'}</td><td>Business Maker</td></tr>
      <tr><td>${isAr ? 'مراجعة الأعمال' : 'Business Review'}</td><td>${isAr ? 'الأعمال' : 'Business'}</td><td>Business Checker</td></tr>
      <tr><td>${isAr ? 'العناية الواجبة' : 'Due Diligence'}</td><td>CDD</td><td>CDD Maker / Checker</td></tr>
      <tr><td>${isAr ? 'مراجعة الامتثال' : 'Compliance Review'}</td><td>${isAr ? 'الامتثال' : 'Compliance'}</td><td>Compliance Officer</td></tr>
      <tr><td>${isAr ? 'القرار النهائي' : 'Final Decision'}</td><td>${isAr ? 'الإدارة' : 'Management'}</td><td>Senior Management</td></tr>
    </table>
  </div>
  <div class="section">
    <h2>${isAr ? 'معايير تصنيف المخاطر' : 'Risk Classification Criteria'}</h2>
    <table>
      <tr><th>${isAr ? 'التصنيف' : 'Category'}</th><th>${isAr ? 'النطاق' : 'Score Range'}</th><th>${isAr ? 'الإجراء' : 'Action'}</th></tr>
      <tr><td style="color:#4CAF50">${isAr ? 'منخفض' : 'Low Risk'}</td><td>0 – 149</td><td>${isAr ? 'مراقبة دورية' : 'Periodic monitoring'}</td></tr>
      <tr><td style="color:#FF9800">${isAr ? 'متوسط' : 'Medium Risk'}</td><td>150 – 299</td><td>${isAr ? 'مراجعة EDD سنوية' : 'Annual EDD review'}</td></tr>
      <tr><td style="color:#F44336">${isAr ? 'عالي' : 'High Risk'}</td><td>300 – 449</td><td>${isAr ? 'مراجعة EDD نصف سنوية' : 'Semi-annual EDD review'}</td></tr>
      <tr><td style="color:#9C27B0">${isAr ? 'عالي تلقائي' : 'Auto High'}</td><td>450+</td><td>${isAr ? 'إجراء فوري' : 'Immediate action required'}</td></tr>
    </table>
  </div>
  <div class="section">
    <h2>${isAr ? 'البنية المعمارية للمنصة' : 'Platform Architecture'}</h2>
    <p>${isAr ? 'منصة ويب من طرف العميل تعمل محليًا في المتصفح مع دعم WebSocket للتحديثات الفورية.' : 'Client-side web platform running locally in the browser with WebSocket support for real-time updates.'}</p>
    <p><span class="label">${isAr ? 'المكونات الرئيسية:' : 'Key components:'}</span> Mock Data Engine · Risk Scoring Engine · Maker/Checker Workflow · PIN Authentication · Export Engine · Voice Assistant · Accessibility Module</p>
  </div>
  <div class="footer">
    ${isAr ? 'بنك قطر الإسلامي — منصة التحقيق المالي — سري وخاص' : 'Qatar Islamic Bank — Financial Crime Investigation Platform — Confidential'}
    &nbsp;|&nbsp; ${new Date().toISOString().split('T')[0]}
  </div>
</body>
</html>`;
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(reportHTML);
        win.document.close();
        win.focus();
        setTimeout(function () { win.print(); }, 500);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 12. TOOLBAR  (floating panel injected into every page)
  // ─────────────────────────────────────────────────────────────────────────
  function injectStyles() {
    // Avoid duplicating the stylesheet if already loaded via <link> in the HTML
    if (document.querySelector('link[href*="accessibility_voice.css"]')) return;
    if (document.getElementById('qib-a11y-styles')) return;
    const style = document.createElement('link');
    style.id = 'qib-a11y-styles';
    style.rel = 'stylesheet';
    style.href = (document.querySelector('link[href*="edd_system.css"]') ? '' : '../') + 'css/accessibility_voice.css';
    document.head.appendChild(style);
  }

  function injectToolbar() {
    if (document.getElementById('qib-toolbar')) return;
    const isAr = state.lang === 'ar';
    const toolbar = document.createElement('div');
    toolbar.id = 'qib-toolbar';
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute('aria-label', isAr ? 'شريط أدوات إمكانية الوصول والمساعدة' : 'Accessibility and Assistance Toolbar');
    toolbar.innerHTML = `
      <button id="qib-voice-btn" class="qib-tb-btn" onclick="QIBAccessibility.VoiceAssistant.explainPage()" title="${isAr ? 'شرح الصفحة صوتيًا' : 'Explain this page by voice'}" aria-label="${isAr ? 'دليل صوتي' : 'Voice Guide'}">
        <span class="qib-tb-icon">🔊</span>
        <span class="qib-tb-label">${isAr ? 'صوتي' : 'Voice'}</span>
      </button>
      <button id="qib-mic-btn" class="qib-tb-btn" onclick="QIBAccessibility.VoiceCommands.start()" title="${isAr ? 'الأوامر الصوتية' : 'Voice Commands'}" aria-label="${isAr ? 'الأوامر الصوتية' : 'Voice Commands'}">
        <span class="qib-tb-icon">🎤</span>
        <span class="qib-tb-label">${isAr ? 'أمر' : 'Command'}</span>
      </button>
      <button id="qib-lang-btn" class="qib-tb-btn" onclick="QIBAccessibility.Language.toggle()" title="${isAr ? 'تبديل اللغة' : 'Toggle Arabic/English'}" aria-label="${isAr ? 'تبديل اللغة' : 'Language Toggle'}">
        <span class="qib-tb-icon">🌐</span>
        <span class="qib-tb-label">${isAr ? 'EN' : 'عربي'}</span>
      </button>
      <button id="qib-hc-btn" class="qib-tb-btn ${state.highContrast ? 'active' : ''}" onclick="QIBAccessibility.Accessibility.toggleHighContrast()" title="${isAr ? 'تباين عالٍ' : 'High Contrast'}" aria-label="${isAr ? 'تباين عالٍ' : 'High Contrast'}" aria-pressed="${state.highContrast}">
        <span class="qib-tb-icon">◐</span>
        <span class="qib-tb-label">${isAr ? 'تباين' : 'Contrast'}</span>
      </button>
      <button id="qib-lt-btn" class="qib-tb-btn ${state.largeText ? 'active' : ''}" onclick="QIBAccessibility.Accessibility.toggleLargeText()" title="${isAr ? 'نص كبير' : 'Large Text'}" aria-label="${isAr ? 'نص كبير' : 'Large Text'}" aria-pressed="${state.largeText}">
        <span class="qib-tb-icon">A</span>
        <span class="qib-tb-label">${isAr ? 'حجم' : 'Text'}</span>
      </button>
      <button class="qib-tb-btn" onclick="QIBAccessibility.BRDPanel.show()" title="${isAr ? 'مرجع المتطلبات' : 'BRD Reference'}" aria-label="${isAr ? 'مرجع المتطلبات' : 'BRD Reference'}">
        <span class="qib-tb-icon">📋</span>
        <span class="qib-tb-label">BRD</span>
      </button>
      <button class="qib-tb-btn" onclick="QIBAccessibility.Walkthrough.start()" title="${isAr ? 'جولة النظام' : 'System Walkthrough'}" aria-label="${isAr ? 'جولة النظام' : 'System Walkthrough'}">
        <span class="qib-tb-icon">🎯</span>
        <span class="qib-tb-label">${isAr ? 'جولة' : 'Tour'}</span>
      </button>
      <button class="qib-tb-btn" onclick="QIBAccessibility.PrintReport.print()" title="${isAr ? 'طباعة تقرير النظام' : 'Print System Report'}" aria-label="${isAr ? 'طباعة' : 'Print'}">
        <span class="qib-tb-icon">🖨️</span>
        <span class="qib-tb-label">${isAr ? 'طباعة' : 'Print'}</span>
      </button>
    `;
    document.body.appendChild(toolbar);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 13. KEYBOARD NAVIGATION SUPPORT
  // ─────────────────────────────────────────────────────────────────────────
  function enableKeyboardNav() {
    // Skip-to-content link
    if (!document.getElementById('qib-skip-link')) {
      const skip = document.createElement('a');
      skip.id = 'qib-skip-link';
      skip.href = '#main-content';
      skip.textContent = state.lang === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content';
      skip.setAttribute('class', 'qib-skip-link');
      document.body.insertBefore(skip, document.body.firstChild);
    }

    // Add main landmark if missing
    const main = document.querySelector('main, [role="main"], .app-container, .main-content');
    if (main && !main.id) main.id = 'main-content';

    // Enhance keyboard accessibility for role-selection buttons that lack explicit type
    document.querySelectorAll('.role-option-btn').forEach(function (el) {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
      });
    });
    // Ensure nav links have visible focus without altering their semantic role
    document.querySelectorAll('.nav-item').forEach(function (el) {
      if (!el.getAttribute('tabindex') && el.tagName !== 'A') el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); el.click(); }
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 14. FACE LOGIN  (login.html only — optional WebRTC biometric simulation)
  // ─────────────────────────────────────────────────────────────────────────
  const FaceLogin = {
    stream: null,
    inject: function () {
      // Only inject on the login page
      if (!getCurrentPage().includes('login')) return;
      // Look for step1 form to add the face login button near it
      const form = document.getElementById('step1-form') || document.querySelector('.login-form');
      if (!form || document.getElementById('qib-face-login-btn')) return;

      const wrapper = document.createElement('div');
      wrapper.id = 'qib-face-login-wrapper';
      wrapper.style.cssText = 'margin-top: 16px; text-align: center;';
      wrapper.innerHTML = `
        <div style="position:relative; display:inline-block; width:100%;">
          <button id="qib-face-login-btn" type="button" onclick="QIBAccessibility.FaceLogin.toggle()"
            style="width:100%; padding:12px; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.4);
                   border-radius: 10px; color: #00D4FF; cursor: pointer; font-size: 13px; transition: all 0.3s;
                   display: flex; align-items: center; justify-content: center; gap: 8px;"
            aria-label="${state.lang === 'ar' ? 'تسجيل الدخول ببصمة الوجه (اختياري)' : 'Face Login — Optional'}">
            <span>📷</span>
            <span id="qib-face-btn-label">${state.lang === 'ar' ? 'تسجيل الدخول ببصمة الوجه (اختياري)' : 'Face Login — Optional'}</span>
          </button>
          <video id="qib-face-video" autoplay muted playsinline
            style="display:none; width:100%; border-radius:10px; margin-top:12px; border:2px solid rgba(0,212,255,0.4);"
            aria-label="${state.lang === 'ar' ? 'كاميرا بصمة الوجه' : 'Face authentication camera'}">
          </video>
          <div id="qib-face-status" style="display:none; margin-top:8px; font-size:12px; color: #00D4FF;"></div>
          <button id="qib-face-capture-btn" type="button" onclick="QIBAccessibility.FaceLogin.capture()"
            style="display:none; width:100%; margin-top:8px; padding:10px; background:linear-gradient(135deg,#00D4FF,#0288D1);
                   border:none; border-radius:8px; color:white; cursor:pointer; font-size:13px;"
            aria-label="${state.lang === 'ar' ? 'التقاط بصمة الوجه' : 'Capture face for authentication'}">
            ${state.lang === 'ar' ? '📸 التقاط والمصادقة' : '📸 Capture & Authenticate'}
          </button>
        </div>`;
      form.parentNode.insertBefore(wrapper, form.nextSibling);
    },

    toggle: function () {
      const video = document.getElementById('qib-face-video');
      const status = document.getElementById('qib-face-status');
      const captureBtn = document.getElementById('qib-face-capture-btn');
      const label = document.getElementById('qib-face-btn-label');
      if (!video) return;
      if (this.stream) {
        this.stop();
        return;
      }
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then(function (stream) {
          FaceLogin.stream = stream;
          video.srcObject = stream;
          video.style.display = 'block';
          if (status) { status.style.display = 'block'; status.textContent = state.lang === 'ar' ? '✅ الكاميرا جاهزة — انظر إلى الكاميرا' : '✅ Camera ready — please look at the camera'; }
          if (captureBtn) captureBtn.style.display = 'block';
          if (label) label.textContent = state.lang === 'ar' ? '❌ إيقاف الكاميرا' : '❌ Stop Camera';
        })
        .catch(function () {
          if (status) { status.style.display = 'block'; status.style.color = '#FF9800'; status.textContent = state.lang === 'ar' ? '⚠️ لا يمكن الوصول إلى الكاميرا — استخدم تسجيل الدخول العادي' : '⚠️ Camera access denied — using standard login'; }
          setTimeout(function () { if (status) status.style.display = 'none'; }, 4000);
        });
    },

    capture: function () {
      const video = document.getElementById('qib-face-video');
      const status = document.getElementById('qib-face-status');
      if (!video || !this.stream) return;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      this.stop();
      if (status) {
        status.style.display = 'block';
        status.style.color = '#4CAF50';
        status.textContent = state.lang === 'ar' ? '✅ تم التحقق من الوجه — يمكنك المتابعة بالضغط على زر الدخول' : '✅ Face verified — proceed with login button below';
      }
      VoiceAssistant.speak(state.lang === 'ar' ? 'تم التحقق من بصمة الوجه. يمكنك المتابعة.' : 'Face authentication successful. You may proceed.');
    },

    stop: function () {
      if (this.stream) { this.stream.getTracks().forEach(function (t) { t.stop(); }); this.stream = null; }
      const video = document.getElementById('qib-face-video');
      const captureBtn = document.getElementById('qib-face-capture-btn');
      const label = document.getElementById('qib-face-btn-label');
      if (video) video.style.display = 'none';
      if (captureBtn) captureBtn.style.display = 'none';
      if (label) label.textContent = state.lang === 'ar' ? 'تسجيل الدخول ببصمة الوجه (اختياري)' : 'Face Login — Optional';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 15. INITIALISE
  // ─────────────────────────────────────────────────────────────────────────
  function init() {
    injectStyles();
    Accessibility.applyStored();
    Language.apply();

    // Wait for DOM to be ready before injecting toolbar
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        injectToolbar();
        enableKeyboardNav();
        FaceLogin.inject();
      });
    } else {
      injectToolbar();
      enableKeyboardNav();
      FaceLogin.inject();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 16. PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  window.QIBAccessibility = {
    VoiceAssistant: VoiceAssistant,
    VoiceCommands: VoiceCommands,
    Language: Language,
    Accessibility: Accessibility,
    BRDPanel: BRDPanel,
    Walkthrough: Walkthrough,
    PrintReport: PrintReport,
    FaceLogin: FaceLogin,
    getState: function () { return state; }
  };

  init();
})();
