/**
 * EDD_QIB SYSTEM - COMPREHENSIVE LANGUAGE PACK
 * Supports: English (en-GB) and Gulf Arabic (ar-QA)
 * 
 * Usage: 
 * - Set language with: setGlobalLanguage('en') or setGlobalLanguage('ar')
 * - Get translated text with: t('key')
 * - Applied automatically to page on language change
 */

const LANGUAGE_PACK = {
  'en-GB': {
    // ═══════════════════════════════════════════════════════════════
    // NAVIGATION & COMMON UI
    // ═══════════════════════════════════════════════════════════════
    'nav.dashboard': 'Dashboard',
    'nav.edd-cases': 'EDD Cases',
    'nav.kyc': 'KYC Form',
    'nav.organization': 'Organization',
    'nav.retail': 'Retail Banking',
    'nav.cdd': 'CDD Operations',
    'nav.compliance': 'Compliance',
    'nav.channels': 'Alt. Channels',
    'nav.risk': 'Risk Lists',
    'nav.management': 'Management',
    'nav.audit': 'Audit Console',
    'nav.documents': 'Documents',
    'nav.notifications': 'Notifications',
    'nav.logout': 'Logout',
    
    // Login Page
    'login.title': 'Financial Crime Investigation System',
    'login.subtitle': 'Enhanced Due Diligence Platform',
    'login.employee-id': 'Employee ID',
    'login.password': 'Password',
    'login.role': 'Select Role',
    'login.role.retail': 'Retail Banking Officer',
    'login.role.cdd': 'CDD Maker/Checker',
    'login.role.compliance': 'Compliance Officer',
    'login.role.manager': 'Operations Manager',
    'login.otp': '2FA Code',
    'login.signin': 'Sign In',
    'login.remember-me': 'Remember Me',
    'login.help': 'Need Help?',
    
    // Dashboard
    'dashboard.title': 'EDD Investigation Dashboard',
    'dashboard.welcome': 'Welcome back,',
    'dashboard.pending': 'Pending Review',
    'dashboard.in-progress': 'In Progress',
    'dashboard.overdue': 'Overdue (SLA)',
    'dashboard.completed': 'Completed',
    'dashboard.explain-page': 'Explain Page',
    
    // Business View
    'business.mass-banking': 'Mass Banking',
    'business.tamayuz': 'Tamayuz Banking',
    'business.private': 'Private Banking',
    'business.queue': 'Queue',
    'business.pending': 'Pending',
    'business.quick-actions': 'Quick Actions',
    'business.view-cases': 'View All Cases',
    'business.request-docs': 'Request Documents',
    'business.contact-customer': 'Contact Customer',
    'business.escalate-cdd': 'Escalate to CDD',
    
    // Case Management
    'case.title': 'EDD Case',
    'case.customer': 'Customer',
    'case.rim': 'RIM Number',
    'case.risk': 'Risk Level',
    'case.status': 'Status',
    'case.days-open': 'Days Open',
    'case.review': 'Review',
    'case.approve': 'Approve',
    'case.reject': 'Reject',
    'case.stages': 'Stages',
    'case.stage-1': 'Stage 1 - Creation',
    'case.stage-2': 'Stage 2 - Documentation',
    'case.stage-3': 'Stage 3 - Evidence Collection',
    'case.stage-4': 'Stage 4 - Final Decision',
    
    // Risk Levels
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',
    'risk.critical': 'Critical',
    
    // Status
    'status.pending': 'Pending Review',
    'status.in-progress': 'In Progress',
    'status.completed': 'Completed',
    'status.approved': 'Approved',
    'status.rejected': 'Rejected',
    'status.escalated': 'Escalated',
    
    // Accessibility
    'a11y.accessibility': 'Accessibility',
    'a11y.text-size': 'Text Size',
    'a11y.decrease': 'Decrease',
    'a11y.increase': 'Increase',
    'a11y.contrast': 'High Contrast',
    'a11y.dyslexia-font': 'Dyslexia Font',
    'a11y.colorblind': 'Color-blind Mode',
    'a11y.voice': 'Voice Guide',
    'a11y.keyboard-help': 'Keyboard Help',
    
    // Buttons
    'btn.close': 'Close',
    'btn.save': 'Save',
    'btn.cancel': 'Cancel',
    'btn.submit': 'Submit',
    'btn.next': 'Next',
    'btn.back': 'Back',
    'btn.refresh': 'Refresh',
    'btn.export': 'Export',
    'btn.print': 'Print',
    'btn.search': 'Search',
    'btn.filter': 'Filter',
    'btn.sort': 'Sort',
    
    // Status Messages
    'msg.loading': 'Loading...',
    'msg.success': 'Success!',
    'msg.error': 'An error occurred',
    'msg.warning': 'Warning',
    'msg.saved': 'Saved successfully',
    'msg.updated': 'Updated successfully',
    'msg.deleted': 'Deleted successfully',
    'msg.no-data': 'No data available',
    
    // Voice Assistant
    'voice.listening': 'Listening for voice command...',
    'voice.not-understood': 'Command not understood. Please try again.',
    'voice.not-supported': 'Voice commands not supported in your browser.',
    'voice.commands.dashboard': 'Open dashboard',
    'voice.commands.cases': 'Open EDD case',
    'voice.commands.investigation': 'Open investigation',
    'voice.commands.explain': 'Explain this page',
    'voice.commands.logout': 'Logout',
  },
  
  'ar-QA': {
    // ═══════════════════════════════════════════════════════════════
    // الملاحة والعناصر المشتركة
    // ═══════════════════════════════════════════════════════════════
    'nav.dashboard': 'لوحة التحكم',
    'nav.edd-cases': 'قضايا المراجعة المعززة',
    'nav.kyc': 'نموذج التحقق',
    'nav.organization': 'المنظمة',
    'nav.retail': 'الخدمات المصرفية للأفراد',
    'nav.cdd': 'عمليات العناية الواجبة',
    'nav.compliance': 'الامتثال',
    'nav.channels': 'القنوات البديلة',
    'nav.risk': 'قوائم المخاطر',
    'nav.management': 'الإدارة',
    'nav.audit': 'لوحة التدقيق',
    'nav.documents': 'الوثائق',
    'nav.notifications': 'الإشعارات',
    'nav.logout': 'تسجيل الخروج',
    
    // صفحة تسجيل الدخول
    'login.title': 'نظام التحقيق في الجرائم المالية',
    'login.subtitle': 'منصة العناية الواجبة المعززة',
    'login.employee-id': 'معرف الموظف',
    'login.password': 'كلمة المرور',
    'login.role': 'اختر الدور',
    'login.role.retail': 'موظف الخدمات المصرفية للأفراد',
    'login.role.cdd': 'موظف العناية الواجبة',
    'login.role.compliance': 'موظف الامتثال',
    'login.role.manager': 'مدير العمليات',
    'login.otp': 'رمز التحقق ثنائي العامل',
    'login.signin': 'دخول',
    'login.remember-me': 'تذكرني',
    'login.help': 'هل تحتاج إلى مساعدة؟',
    
    // لوحة التحكم
    'dashboard.title': 'لوحة تحكم التحقيق في الجرائم المالية',
    'dashboard.welcome': 'أهلاً بعودتك،',
    'dashboard.pending': 'في انتظار المراجعة',
    'dashboard.in-progress': 'قيد المعالجة',
    'dashboard.overdue': 'متأخر (اتفاقية مستوى الخدمة)',
    'dashboard.completed': 'مكتمل',
    'dashboard.explain-page': 'اشرح الصفحة',
    
    // عرض الأعمال
    'business.mass-banking': 'الخدمات المصرفية للعموم',
    'business.tamayuz': 'خدمات تميز المصرفية',
    'business.private': 'الخدمات المصرفية الخاصة',
    'business.queue': 'قائمة الانتظار',
    'business.pending': 'في الانتظار',
    'business.quick-actions': 'الإجراءات السريعة',
    'business.view-cases': 'عرض جميع القضايا',
    'business.request-docs': 'طلب المستندات',
    'business.contact-customer': 'الاتصال بالعميل',
    'business.escalate-cdd': 'تصعيد إلى العناية الواجبة',
    
    // إدارة الحالة
    'case.title': 'قضية المراجعة المعززة',
    'case.customer': 'العميل',
    'case.rim': 'رقم المعرف',
    'case.risk': 'مستوى المخاطرة',
    'case.status': 'الحالة',
    'case.days-open': 'الأيام المفتوحة',
    'case.review': 'مراجعة',
    'case.approve': 'الموافقة',
    'case.reject': 'رفض',
    'case.stages': 'المراحل',
    'case.stage-1': 'المرحلة 1 - الإنشاء',
    'case.stage-2': 'المرحلة 2 - التوثيق',
    'case.stage-3': 'المرحلة 3 - جمع الأدلة',
    'case.stage-4': 'المرحلة 4 - القرار النهائي',
    
    // مستويات المخاطرة
    'risk.low': 'منخفض',
    'risk.medium': 'متوسط',
    'risk.high': 'عالي',
    'risk.critical': 'حرج',
    
    // الحالات
    'status.pending': 'في انتظار المراجعة',
    'status.in-progress': 'قيد المعالجة',
    'status.completed': 'مكتمل',
    'status.approved': 'موافق عليه',
    'status.rejected': 'مرفوض',
    'status.escalated': 'مصعد',
    
    // إمكانية الوصول
    'a11y.accessibility': 'إمكانية الوصول',
    'a11y.text-size': 'حجم النص',
    'a11y.decrease': 'تقليل',
    'a11y.increase': 'زيادة',
    'a11y.contrast': 'تباين عالي',
    'a11y.dyslexia-font': 'خط خاص بعسر القراءة',
    'a11y.colorblind': 'وضع عمى الألوان',
    'a11y.voice': 'الدليل الصوتي',
    'a11y.keyboard-help': 'مساعدة لوحة المفاتيح',
    
    // الأزرار
    'btn.close': 'إغلاق',
    'btn.save': 'حفظ',
    'btn.cancel': 'إلغاء',
    'btn.submit': 'إرسال',
    'btn.next': 'التالي',
    'btn.back': 'السابق',
    'btn.refresh': 'تحديث',
    'btn.export': 'تصدير',
    'btn.print': 'طباعة',
    'btn.search': 'بحث',
    'btn.filter': 'تصفية',
    'btn.sort': 'ترتيب',
    
    // رسائل الحالة
    'msg.loading': 'جاري التحميل...',
    'msg.success': 'نجح!',
    'msg.error': 'حدث خطأ',
    'msg.warning': 'تحذير',
    'msg.saved': 'تم الحفظ بنجاح',
    'msg.updated': 'تم التحديث بنجاح',
    'msg.deleted': 'تم الحذف بنجاح',
    'msg.no-data': 'لا توجد بيانات متاحة',
    
    // مساعد صوتي
    'voice.listening': 'الاستماع إلى أوامر صوتية...',
    'voice.not-understood': 'لم أفهم الأمر. حاول مرة أخرى.',
    'voice.not-supported': 'الأوامر الصوتية غير مدعومة في متصفحك.',
    'voice.commands.dashboard': 'افتح لوحة التحكم',
    'voice.commands.cases': 'افتح قضية',
    'voice.commands.investigation': 'افتح التحقيق',
    'voice.commands.explain': 'اشرح هذه الصفحة',
    'voice.commands.logout': 'تسجيل الخروج',
  }
};

/**
 * Global translation system
 * Uses stored language preference or browser language
 */
let CURRENT_LANGUAGE = localStorage.getItem('eddLanguage') || 'en-GB';

/**
 * Get translated text
 * @param {string} key - Translation key (e.g., 'nav.dashboard')
 * @param {string} defaultText - Fallback text if key not found
 * @returns {string} Translated text
 */
function t(key, defaultText = key) {
  const lang = LANGUAGE_PACK[CURRENT_LANGUAGE];
  if (!lang) return defaultText;
  
  // Support nested keys like 'nav.dashboard'
  const keys = key.split('.');
  let value = lang;
  for (const k of keys) {
    value = value[k];
    if (!value) return defaultText;
  }
  return value || defaultText;
}

/**
 * Set global language and apply to document
 * @param {string} lang - Language code ('en-GB' or 'ar-QA')
 */
function setGlobalLanguage(lang) {
  if (!LANGUAGE_PACK[lang]) {
    console.warn(`Language ${lang} not supported`);
    return;
  }
  
  CURRENT_LANGUAGE = lang;
  localStorage.setItem('eddLanguage', lang);
  
  // Update HTML language attribute
  document.documentElement.lang = lang;
  
  // Update text direction
  document.dir = lang.startsWith('ar') ? 'rtl' : 'ltr';
  
  // Dispatch event for UI updates
  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  
  // Update all translated elements
  applyTranslations();
}

/**
 * Apply translations to all page elements with data-i18n attribute
 */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr') || 'textContent';
    
    if (attr === 'textContent' || attr === 'innerText') {
      el.textContent = t(key);
    } else {
      el.setAttribute(attr, t(key));
    }
  });
  
  // Update title
  const titleEl = document.querySelector('[data-i18n="page.title"]');
  if (titleEl) {
    document.title = t(`page.title`, 'EDD System');
  }
}

/**
 * Initialize language system on page load
 */
function initLanguageSystem() {
  // Load saved language preference
  const savedLanguage = localStorage.getItem('eddLanguage') || 'en-GB';
  
  // Apply to document
  document.documentElement.lang = savedLanguage;
  document.dir = savedLanguage.startsWith('ar') ? 'rtl' : 'ltr';
  CURRENT_LANGUAGE = savedLanguage;
  
  // Listen for language change events
  document.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
    applyTranslations();
  });
  
  // Initial translation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
  } else {
    applyTranslations();
  }
}

// Auto-initialize on script load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initLanguageSystem);
  // Also initialize immediately in case script loads late
  if (document.readyState !== 'loading') {
    initLanguageSystem();
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LANGUAGE_PACK, t, setGlobalLanguage, applyTranslations };
}
