/* ═══════════════════════════════════════════════════════════════
   Settings Drawer Manager
   ═══════════════════════════════════════════════════════════════ */

const SettingsDrawer = {
  drawer: null,
  overlay: null,
  fontSizeValues: [90, 100, 110, 120, 130],
  currentFontSize: 100,
  
  init: function() {
    // Create drawer HTML
    this.createDrawer();
    
    // Get references
    this.drawer = document.getElementById('settings-drawer');
    this.overlay = document.getElementById('settings-drawer-overlay');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load saved preferences
    this.loadPreferences();
  },
  
  createDrawer: function() {
    if (document.getElementById('settings-drawer')) return;
    
    const drawerHTML = `
      <div id="settings-drawer-overlay" class="settings-drawer-overlay"></div>
      <div id="settings-drawer" class="settings-drawer">
        <div class="settings-drawer-header">
          <span class="settings-drawer-title">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.11.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.11.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.11-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            Settings
          </span>
          <button class="settings-drawer-close" id="settings-drawer-close">✕</button>
        </div>
        
        <div class="settings-drawer-content">
          <!-- Theme Section -->
          <div class="settings-section">
            <div class="settings-section-title">Display</div>
            <div class="color-mode-grid">
              <div class="color-mode-option active" data-theme="dark-mode">
                <div class="color-mode-icon">🌙</div>
                <div class="color-mode-name">Dark</div>
              </div>
              <div class="color-mode-option" data-theme="light-mode">
                <div class="color-mode-icon">☀️</div>
                <div class="color-mode-name">Light</div>
              </div>
            </div>
          </div>
          
          <!-- Font Size Section -->
          <div class="settings-section">
            <div class="settings-section-title">Font Size</div>
            <div class="font-size-controls">
              <button class="font-size-btn" data-size="90" title="Decrease Font Size">A-</button>
              <button class="font-size-btn active" data-size="100" title="Default Font Size">A</button>
              <button class="font-size-btn" data-size="110" title="Increase Font Size">A+</button>
              <button class="font-size-btn" data-size="120" title="Large Font Size">A++</button>
              <button class="font-size-btn" data-size="130" title="Extra Large Font Size">A+++</button>
            </div>
          </div>
          
          <!-- Color Vision Section -->
          <div class="settings-section">
            <div class="settings-section-title">Vision & Colors</div>
            <div class="settings-option" id="btn-colorblind" style="padding: 14px;">
              <div class="settings-option-label">
                <div class="settings-option-name">Color Blind Mode</div>
                <div class="settings-option-desc">Optimize for color blindness</div>
              </div>
              <div class="settings-option-value" style="width: auto; padding: 6px 10px;">◉</div>
            </div>
            <div class="settings-option" id="btn-contrast" style="padding: 14px;">
              <div class="settings-option-label">
                <div class="settings-option-name">High Contrast</div>
                <div class="settings-option-desc">Increase contrast levels</div>
              </div>
              <div class="settings-option-value" style="width: auto; padding: 6px 10px;">◐</div>
            </div>
            <div class="settings-option" id="btn-dyslexia" style="padding: 14px;">
              <div class="settings-option-label">
                <div class="settings-option-name">Dyslexia Font</div>
                <div class="settings-option-desc">Dyslexia-friendly typeface</div>
              </div>
              <div class="settings-option-value" style="width: auto; padding: 6px 10px;">d</div>
            </div>
          </div>
          
          <!-- Language Section -->
          <div class="settings-section">
            <div class="settings-section-title">Language</div>
            <div class="color-mode-grid">
              <div class="color-mode-option active" data-lang="en">
                <div class="color-mode-icon">🇬🇧</div>
                <div class="color-mode-name">English</div>
              </div>
              <div class="color-mode-option" data-lang="ar">
                <div class="color-mode-icon">🇶🇦</div>
                <div class="color-mode-name">العربية</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', drawerHTML);
  },
  
  setupEventListeners: function() {
    // Close button
    const closeBtn = document.getElementById('settings-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
    
    // Overlay click
    this.overlay?.addEventListener('click', () => this.close());
    
    // Theme options
    document.querySelectorAll('[data-theme]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const theme = btn.dataset.theme;
        ThemeManager.setTheme(theme === 'light-mode' ? ThemeManager.LIGHT_MODE : ThemeManager.DARK_MODE);
      });
    });
    
    // Font size buttons
    document.querySelectorAll('.font-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const size = parseInt(btn.dataset.size);
        this.setFontSize(size);
      });
    });
    
    // Language options
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lang = btn.dataset.lang;
        this.setLanguage(lang);
      });
    });
    
    // Accessibility button overrides - Make them clickable in drawer
    const accessibilityBtns = document.querySelectorAll('#btn-colorblind, #btn-contrast, #btn-dyslexia');
    accessibilityBtns.forEach(btn => {
      const originalBtn = document.querySelector(`[id="${btn.id}"]`);
      if (originalBtn && originalBtn !== btn) {
        btn.addEventListener('click', () => {
          originalBtn.click();
          this.updateAccessibilityUI();
        });
      }
    });
  },
  
  setFontSize: function(size) {
    this.currentFontSize = size;
    const factor = (size - 100) / 100;
    const zoomLevel = 1 + (factor * 0.3);
    
    document.documentElement.style.fontSize = (16 * zoomLevel / 100) + 'px';
    document.body.style.zoom = (size / 100) + '';
    
    localStorage.setItem('fontSize', size);
  },
  
  setLanguage: function(lang) {
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Trigger language change event for other scripts
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
  },
  
  loadPreferences: function() {
    // Load font size
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
      const btn = document.querySelector(`.font-size-btn[data-size="${savedFontSize}"]`);
      if (btn) {
        document.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setFontSize(parseInt(savedFontSize));
      }
    }
    
    // Load language
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    const langBtn = document.querySelector(`[data-lang="${savedLang}"]`);
    if (langBtn) {
      document.querySelectorAll('[data-lang]').forEach(b => b.classList.remove('active'));
      langBtn.classList.add('active');
      this.setLanguage(savedLang);
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('edd-theme-mode');
    if (savedTheme) {
      const themeBtn = document.querySelector(`[data-theme="${savedTheme}"]`);
      if (themeBtn) {
        document.querySelectorAll('[data-theme]').forEach(b => b.classList.remove('active'));
        themeBtn.classList.add('active');
      }
    }
  },
  
  updateAccessibilityUI: function() {
    const contrastBtn = document.querySelector('#btn-contrast');
    const dyslexiaBtn = document.querySelector('#btn-dyslexia');
    const colorblindBtn = document.querySelector('#btn-colorblind');
    
    const originalContrast = document.querySelector('.accessibility-controls #btn-contrast');
    const originalDyslexia = document.querySelector('.accessibility-controls #btn-dyslexia');
    const originalColorblind = document.querySelector('.accessibility-controls #btn-colorblind');
    
    if (originalContrast?.classList.contains('active')) {
      contrastBtn?.parentElement.querySelectorAll('[id="btn-contrast"]').forEach(b => b.parentElement.classList.add('active'));
    }
    if (originalDyslexia?.classList.contains('active')) {
      dyslexiaBtn?.parentElement.querySelectorAll('[id="btn-dyslexia"]').forEach(b => b.parentElement.classList.add('active'));
    }
    if (originalColorblind?.classList.contains('active')) {
      colorblindBtn?.parentElement.querySelectorAll('[id="btn-colorblind"]').forEach(b => b.parentElement.classList.add('active'));
    }
  },
  
  toggle: function() {
    if (this.drawer?.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  },
  
  open: function() {
    this.drawer?.classList.add('active');
    this.overlay?.classList.add('active');
  },
  
  close: function() {
    this.drawer?.classList.remove('active');
    this.overlay?.classList.remove('active');
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SettingsDrawer.init());
} else {
  SettingsDrawer.init();
}
