/**
 * ═══════════════════════════════════════════════════════════════════════
 * ACCESSIBILITY CONTROLS - WCAG 2.1 AA COMPLIANCE
 * Global accessibility features for all pages
 * Import this script in every page: <script src="js/accessibility.js"></script>
 * ═══════════════════════════════════════════════════════════════════════
 */

class AccessibilityManager {
  constructor() {
    this.preferences = JSON.parse(localStorage.getItem('a11yPreferences') || '{}');
  }

  /**
   * Initialize accessibility controls and load saved preferences
   */
  init() {
    // Apply saved preferences on page load
    if (this.preferences.fontSize) this.setFontSize(this.preferences.fontSize);
    if (this.preferences.highContrast) this.setHighContrast(true, false);
    if (this.preferences.dyslexiaFont) this.setDyslexiaFont(true, false);
    if (this.preferences.colorblindMode) this.setColorblindMode(true, false);

    // Attach event listeners
    this.attachEventListeners();

    // Add keyboard shortcuts help
    this.addKeyboardShortcuts();
  }

  /**
   * Increase/Decrease font size with support for both directions
   */
  setFontSize(size = 'normal', update = true) {
    const html = document.documentElement;
    const btnIncrease = document.getElementById('btn-text-size');
    const btnDecrease = document.getElementById('btn-text-size-decrease');

    html.classList.remove('font-large', 'font-xlarge');

    if (size === 'xlarge') {
      html.classList.add('font-xlarge');
      if (btnIncrease) btnIncrease.classList.add('active');
      if (btnDecrease) btnDecrease.classList.remove('active');
      this.announce('Extra large text mode enabled');
    } else if (size === 'large') {
      html.classList.add('font-large');
      if (btnIncrease) btnIncrease.classList.add('active');
      if (btnDecrease) btnDecrease.classList.remove('active');
      this.announce('Large text mode enabled');
    } else {
      if (btnIncrease) btnIncrease.classList.remove('active');
      if (btnDecrease) btnDecrease.classList.add('active');
      this.announce('Normal text mode enabled');
    }

    if (update) {
      this.savePreference('fontSize', size);
    }
  }

  /**
   * High contrast mode
   */
  setHighContrast(enable = true, update = true) {
    const html = document.documentElement;
    const btn = document.getElementById('btn-contrast');

    if (enable) {
      html.style.setProperty('--prefers-contrast', 'more');
      if (btn) btn.classList.add('active');
      this.announce('High contrast mode enabled');
    } else {
      html.style.removeProperty('--prefers-contrast');
      if (btn) btn.classList.remove('active');
      this.announce('High contrast mode disabled');
    }

    if (update) {
      this.savePreference('highContrast', enable);
    }
  }

  /**
   * Dyslexia-friendly font
   */
  setDyslexiaFont(enable = true, update = true) {
    const html = document.documentElement;
    const btn = document.getElementById('btn-dyslexia');

    if (enable) {
      html.classList.add('dyslexia-font');
      if (btn) btn.classList.add('active');
      this.loadFont('https://fonts.googleapis.com/css2?family=Open+Dyslexic:wght@400;700&display=swap');
      this.announce('Dyslexia-friendly font enabled');
    } else {
      html.classList.remove('dyslexia-font');
      if (btn) btn.classList.remove('active');
      this.announce('Dyslexia-friendly font disabled');
    }

    if (update) {
      this.savePreference('dyslexiaFont', enable);
    }
  }

  /**
   * Color-blind friendly mode
   */
  setColorblindMode(enable = true, update = true) {
    const html = document.documentElement;
    const btn = document.getElementById('btn-colorblind');

    if (enable) {
      html.classList.add('colorblind-mode');
      if (btn) btn.classList.add('active');
      this.announce('Color-blind friendly mode enabled');
    } else {
      html.classList.remove('colorblind-mode');
      if (btn) btn.classList.remove('active');
      this.announce('Color-blind friendly mode disabled');
    }

    if (update) {
      this.savePreference('colorblindMode', enable);
    }
  }

  /**
   * Load external font
   */
  loadFont(fontUrl) {
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }

  /**
   * Save preference to localStorage
   */
  savePreference(key, value) {
    this.preferences[key] = value;
    localStorage.setItem('a11yPreferences', JSON.stringify(this.preferences));
  }

  /**
   * Attach event listeners to accessibility buttons
   */
  attachEventListeners() {
    const btnTextSize = document.getElementById('btn-text-size');
    const btnTextSizeDecrease = document.getElementById('btn-text-size-decrease');
    const btnContrast = document.getElementById('btn-contrast');
    const btnDyslexia = document.getElementById('btn-dyslexia');
    const btnColorblind = document.getElementById('btn-colorblind');

    if (btnTextSize) {
      btnTextSize.addEventListener('click', () => {
        const currentSize = this.preferences.fontSize || 'normal';
        const nextSize = currentSize === 'normal' ? 'large' : currentSize === 'large' ? 'xlarge' : 'normal';
        this.setFontSize(nextSize);
      });
    }

    if (btnTextSizeDecrease) {
      btnTextSizeDecrease.addEventListener('click', () => {
        const currentSize = this.preferences.fontSize || 'normal';
        const prevSize = currentSize === 'xlarge' ? 'large' : currentSize === 'large' ? 'normal' : 'normal';
        this.setFontSize(prevSize);
      });
    }

    if (btnContrast) {
      btnContrast.addEventListener('click', () => {
        const isActive = btnContrast.classList.contains('active');
        this.setHighContrast(!isActive);
      });
    }

    if (btnDyslexia) {
      btnDyslexia.addEventListener('click', () => {
        const isActive = btnDyslexia.classList.contains('active');
        this.setDyslexiaFont(!isActive);
      });
    }

    if (btnColorblind) {
      btnColorblind.addEventListener('click', () => {
        const isActive = btnColorblind.classList.contains('active');
        this.setColorblindMode(!isActive);
      });
    }
  }

  /**
   * Add keyboard shortcuts
   */
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + A: Focus accessibility controls
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        const btn = document.getElementById('btn-text-size');
        if (btn) {
          btn.focus();
          this.announce('Accessibility controls focused. Use Tab to navigate between controls.');
        }
      }

      // Alt + M: Skip to main content
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        const main = document.querySelector('[role="main"]') || document.querySelector('main');
        if (main) {
          main.focus();
          main.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Alt + H: Help
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        this.showAccessibilityHelp();
      }
    });
  }

  /**
   * Announce message for screen readers
   */
  announce(message) {
    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = message;
  }

  /**
   * Show accessibility help modal
   */
  showAccessibilityHelp() {
    const help = `
Accessibility Features:

Buttons:
• A+ : Increase text size
• ◐ : High contrast mode
• d : Dyslexia-friendly font
• ◉ : Color-blind mode

Keyboard Shortcuts:
• Alt + A : Focus accessibility controls
• Alt + M : Skip to main content
• Alt + H : Show this help
• Tab : Navigate through interactive elements
• Enter / Space : Activate buttons and links

For more accessibility support, contact: accessibility@qib.qa
    `;

    alert(help);
    this.announce('Accessibility help displayed');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const a11yManager = new AccessibilityManager();
    a11yManager.init();
    window.accessibilityManager = a11yManager;
  });
} else {
  const a11yManager = new AccessibilityManager();
  a11yManager.init();
  window.accessibilityManager = a11yManager;
}
