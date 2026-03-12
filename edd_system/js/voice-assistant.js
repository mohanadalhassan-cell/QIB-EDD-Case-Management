/**
 * EDD_QIB ENHANCED VOICE ASSISTANT MODULE
 * Features:
 * - Gulf Arabic (ar-QA) female voice with configurable dialect
 * - English voice commands with fallback
 * - Page explanations in Arabic and English
 * - Voice command recognition and execution
 * - Auto-detects current page for explanations
 * 
 * Usage:
 * - Start listening: VoiceAssistant.startListening()
 * - Speak text: VoiceAssistant.speak('أهلا')
 * - Explain page: VoiceAssistant.explainCurrentPage()
 * - Stop listening: VoiceAssistant.stopListening()
 */

const VoiceAssistant = {
  // ═══════════════════════════════════════════════════════════════
  // VOICE CONFIGURATION
  // ═══════════════════════════════════════════════════════════════
  config: {
    language: 'ar-QA', // Gulf Arabic (Qatar)
    rate: 0.95, // Slightly slower for clarity
    pitch: 1.3, // Female voice (higher pitch)
    volume: 1.0,
    enableArabic: true,
    enableEnglish: true,
    debug: true // Console logging
  },

  // Voice synthesis attributes
  synthConfig: {
    // Gulf Arabic female voice settings
    arabic: {
      language: 'ar-QA', // Qatar Arabic
      rate: 0.95,
      pitch: 1.3, // Female (higher pitch)
      volume: 1.0
    },
    // English fallback
    english: {
      language: 'en-GB',
      rate: 1.0,
      pitch: 1.2, // Female
      volume: 1.0
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // PAGE EXPLANATIONS
  // ═══════════════════════════════════════════════════════════════
  pageExplanations: {
    'login': {
      ar: 'أهلاً بك في منصة التحقيق في الجرائم المالية. هذه صفحة تسجيل الدخول الآمنة. أدخل معرف الموظف وكلمة المرور واختر دورك ثم أدخل رمز التحقق ثنائي العامل.',
      en: 'Welcome to the Financial Crime Investigation System. This is the secure login page. Enter your employee ID, password, select your role, and enter the two-factor authentication code.'
    },
    'dashboard': {
      ar: 'لوحة التحكم تعرض ملخص النشاط اليومي. تشمل عدد القضايا المفتوحة، عدد العملاء ذوي المخاطر العالية، والحالات المتأخرة. يمكنك الوصول إلى جميع الأقسام من الشريط الجانبي.',
      en: 'The Dashboard displays a summary of daily activity. It shows the number of open cases, high-risk customers, overdue investigations, and completed reviews. Access all departments from the left sidebar.'
    },
    'business_view': {
      ar: 'عرض الأعمال يوضح قضايا المراجعة المعززة حسب القطاع المصرفي. اختر بين الخدمات المصرفية للعموم والخدمات المتخصصة والخدمات الخاصة. كل قضية تحتاج مراجعة من قبل موظف الخدمات المصرفية.',
      en: 'The Business View shows EDD cases by banking segment. Choose between Mass Banking, Tamayuz, and Private Banking. Each case requires review by a retail banking officer.'
    },
    'edd_case': {
      ar: 'قضية التحقيق المعزز تُنسخ تلقائياً عندما تتجاوز درجة مخاطر العميل 65 نقطة. تتضمن أربع مراحل: الإنشاء والتوثيق وجمع الأدلة والقرار النهائي. ستة معايير تؤثر على تقدير المخاطر.',
      en: 'The EDD Case is automatically created when customer risk exceeds 65 points. It includes four stages: Creation, Documentation, Evidence Collection, and Final Decision. Six criteria determine the risk assessment.'
    },
    'cdd_view': {
      ar: 'لوحة العناية الواجبة تُظهر القضايا المحالة من موظفي الخدمات المصرفية. يقوم موظف العناية الواجبة بالمراجعة الشاملة والتحليل والتوصية بقبول العميل أو رفضه أو تقديم بلاغ للجهات المختصة.',
      en: 'The CDD Operations panel shows cases referred from retail officers. CDD staff conduct comprehensive reviews, analysis, and recommend acceptance, rejection, or regulatory reporting.'
    },
    'compliance_view': {
      ar: 'لوحة الامتثال تتولى مراجعة القضايا المصعدة والتأكد من الامتثال للتنظيمات. تشمل فحص قوائم الأشخاص ذوي الصلة السياسية والعقوبات والممنوعات.',
      en: 'The Compliance panel manages escalated cases and ensures regulatory compliance. It includes PEP screening, sanctions checks, and restricted parties lists.'
    },
    'audit_console': {
      ar: 'لوحة التدقيق توفر تقارير شاملة عن جميع القضايا والمستخدمين والأنشطة. يمكن عرض الإحصائيات والأداء والالتزام بمؤشرات الأداء الرئيسية.',
      en: 'The Audit Console provides comprehensive reports on all cases, users, and activities. View statistics, performance metrics, and KPI compliance.'
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // VOICE COMMANDS
  // ═══════════════════════════════════════════════════════════════
  commands: {
    // Arabic commands
    'افتح لوحة التحكم': () => navigateToPage('dashboard.html'),
    'اذهب إلى لوحة التحكم': () => navigateToPage('dashboard.html'),
    'لوحة التحكم': () => navigateToPage('dashboard.html'),
    
    'افتح قضية': () => navigateToPage('edd_case.html'),
    'قضية': () => navigateToPage('edd_case.html'),
    'المراجعة المعززة': () => navigateToPage('edd_case.html'),
    
    'افتح التحقيق': () => navigateToPage('cdd_view.html'),
    'عناية واجبة': () => navigateToPage('cdd_view.html'),
    'العناية الواجبة': () => navigateToPage('cdd_view.html'),
    
    'افتح نموذج التحقق': () => navigateToPage('kyc_form.html'),
    'نموذج التحقق': () => navigateToPage('kyc_form.html'),
    
    'افتح الامتثال': () => navigateToPage('compliance_view.html'),
    'الامتثال': () => navigateToPage('compliance_view.html'),
    
    'افتح التدقيق': () => navigateToPage('audit_console.html'),
    'التدقيق': () => navigateToPage('audit_console.html'),
    
    'اشرح الصفحة': () => VoiceAssistant.explainCurrentPage(),
    'اشرح': () => VoiceAssistant.explainCurrentPage(),
    'شرح': () => VoiceAssistant.explainCurrentPage(),
    
    'تسجيل الخروج': () => logout(),
    'خروج': () => logout(),
    
    'تحديث': () => location.reload(),
    'أعد التحميل': () => location.reload(),
    
    // English commands
    'open dashboard': () => navigateToPage('dashboard.html'),
    'go to dashboard': () => navigateToPage('dashboard.html'),
    
    'open case': () => navigateToPage('edd_case.html'),
    'open investigation': () => navigateToPage('cdd_view.html'),
    'open form': () => navigateToPage('kyc_form.html'),
    
    'explain page': () => VoiceAssistant.explainCurrentPage(),
    'explain this': () => VoiceAssistant.explainCurrentPage(),
    
    'logout': () => logout(),
    'sign out': () => logout(),
    
    'refresh': () => location.reload(),
    'reload': () => location.reload()
  },

  // ═══════════════════════════════════════════════════════════════
  // API METHODS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Speak text using Web Speech API
   * @param {string} text - Text to speak
   * @param {string} language - Language code ('ar' or 'en'), defaults to configured language
   */
  speak(text, language = null) {
    if (!('speechSynthesis' in window)) {
      console.warn('❌ Speech Synthesis not supported in this browser');
      return false;
    }

    // Determine language
    if (!language) {
      language = this.config.enableArabic ? 'ar' : 'en';
    }

    const config = language.startsWith('ar') ? this.synthConfig.arabic : this.synthConfig.english;

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.language = config.language;
      utterance.rate = config.rate;
      utterance.pitch = config.pitch;
      utterance.volume = config.volume;

      // Add event listeners
      utterance.onstart = () => {
        if (this.config.debug) console.log('🔊 Speaking:', text.substring(0, 50) + '...');
      };

      utterance.onend = () => {
        if (this.config.debug) console.log('✓ Speech completed');
      };

      utterance.onerror = (e) => {
        console.error('❌ Speech error:', e.error);
      };

      // Speak
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      console.error('❌ Error speaking:', error);
      return false;
    }
  },

  /**
   * Explain the current page based on detected page
   */
  explainCurrentPage() {
    const pageName = this.detectCurrentPage();
    const explanation = this.pageExplanations[pageName];

    if (!explanation) {
      this.speak('لا توجد شرح متوفر لهذه الصفحة');
      return;
    }

    // Get explanation in current language
    const language = CURRENT_LANGUAGE || 'en-GB';
    const text = language.startsWith('ar') ? explanation.ar : explanation.en;

    if (this.config.debug) console.log('📖 Explaining page:', pageName);
    this.speak(text);
  },

  /**
   * Detect current page from URL or document
   * @returns {string} Page name
   */
  detectCurrentPage() {
    const path = window.location.pathname.toLowerCase();
    
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('business')) return 'business_view';
    if (path.includes('edd_case') || path.includes('case')) return 'edd_case';
    if (path.includes('cdd')) return 'cdd_view';
    if (path.includes('compliance')) return 'compliance_view';
    if (path.includes('audit')) return 'audit_console';
    if (path.includes('kyc')) return 'kyc';
    if (path.includes('login')) return 'login';
    
    return 'unknown';
  },

  /**
   * Start listening for voice commands
   * Supports both Arabic and English recognition
   */
  startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('❌ Voice commands not supported in your browser. Use Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    // Try Arabic first
    recognition.language = 'ar-QA';

    recognition.onstart = () => {
      console.log('🎤 Listening for voice commands...');
      this.speak('أنا مستمعة، تفضل بأمرك');
    };

    recognition.onresult = (event) => {
      let transcript = '';
      
      // Get best match from results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript = event.results[i][0].transcript;
        console.log(`Recognized (${event.results[i].isFinal ? 'final' : 'interim'})`, transcript);
        
        // Try to match command
        const command = this.findMatchingCommand(transcript);
        if (command) {
          if (this.config.debug) console.log('✓ Matched command:', command);
          this.speak('تم تنفيذ الأمر');
          this.commands[command]();
          return;
        }
      }
      
      // No match found
      this.speak('لم أفهم الأمر. حاول مرة أخرى.');
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        this.speak('لم أسمع صوتك. حاول مرة أخرى...');
      }
    };

    recognition.onend = () => {
      console.log('🎤 Stopped listening');
    };

    recognition.start();
    return recognition;
  },

  /**
   * Stop listening for voice commands
   */
  stopListening() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    console.log('Voice assistant stopped');
  },

  /**
   * Find matching command from transcript
   * @param {string} transcript - Spoken text
   * @returns {string|null} Matched command or null
   */
  findMatchingCommand(transcript) {
    transcript = transcript.toLowerCase().trim();
    
    // Exact match
    if (this.commands[transcript]) return transcript;
    
    // Partial match - find best match
    let bestMatch = null;
    let bestScore = 0;
    
    for (const cmd of Object.keys(this.commands)) {
      const score = this.calculateSimilarity(transcript, cmd);
      if (score > bestScore && score > 0.6) { // 60% similarity threshold
        bestScore = score;
        bestMatch = cmd;
      }
    }
    
    return bestMatch;
  },

  /**
   * Calculate similarity between two strings (Levenshtein distance)
   * @param {string} str1
   * @param {string} str2
   * @returns {number} Similarity score 0-1
   */
  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  },

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  },

  /**
   * Initialize voice assistant
   */
  init() {
    console.log('🎯 Voice Assistant initialized');
    console.log('Language:', this.config.language);
    console.log('Arabic enabled:', this.config.enableArabic);
    console.log('English enabled:', this.config.enableEnglish);
    
    // Make globally accessible
    window.VoiceAssistant = this;
  }
};

// Helper function to navigate to page
function navigateToPage(page) {
  const baseUrl = '/edd_system/';
  window.location.href = baseUrl + page;
}

// Helper function to logout
function logout() {
  localStorage.removeItem('qibEddSession');
  sessionStorage.removeItem('edd_session');
  window.location.href = '/edd_system/login.html';
}

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => VoiceAssistant.init());
  } else {
    VoiceAssistant.init();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VoiceAssistant;
}
