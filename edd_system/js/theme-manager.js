/* ═══════════════════════════════════════════════════════════════
   Theme Toggle Manager — Light/Dark Mode Switching
   ═══════════════════════════════════════════════════════════════ */

const ThemeManager = {
  STORAGE_KEY: 'edd-theme-mode',
  DARK_MODE: 'dark-mode',
  LIGHT_MODE: 'light-mode',
  
  /**
   * Initialize theme manager
   */
  init: function() {
    // Apply saved preference or system preference
    const savedTheme = this.getSavedTheme();
    const systemTheme = this.getSystemTheme();
    const themeToApply = savedTheme || systemTheme;
    
    this.setTheme(themeToApply);
    
    // Set up event listeners for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
        if (!this.getSavedTheme()) {
          this.setTheme(e.matches ? this.DARK_MODE : this.LIGHT_MODE);
        }
      });
    }
    
    // Initialize toggle button
    this.setupToggleButton();
  },
  
  /**
   * Get saved theme preference from localStorage
   */
  getSavedTheme: function() {
    return localStorage.getItem(this.STORAGE_KEY);
  },
  
  /**
   * Get system theme preference
   */
  getSystemTheme: function() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.DARK_MODE;
    }
    return this.DARK_MODE; // Default to dark mode
  },
  
  /**
   * Set and apply theme
   */
  setTheme: function(theme) {
    const body = document.body;
    
    if (theme === this.LIGHT_MODE) {
      body.classList.add(this.LIGHT_MODE);
      body.classList.remove(this.DARK_MODE);
    } else {
      body.classList.remove(this.LIGHT_MODE);
      body.classList.add(this.DARK_MODE);
    }
    
    // Save preference
    localStorage.setItem(this.STORAGE_KEY, theme);
    
    // Update button icon
    this.updateToggleButtonIcon();
  },
  
  /**
   * Toggle between light and dark modes
   */
  toggle: function() {
    const currentTheme = document.body.classList.contains(this.LIGHT_MODE) ? this.LIGHT_MODE : this.DARK_MODE;
    const newTheme = currentTheme === this.LIGHT_MODE ? this.DARK_MODE : this.LIGHT_MODE;
    this.setTheme(newTheme);
  },
  
  /**
   * Setup toggle button
   */
  setupToggleButton: function() {
    const button = document.getElementById('theme-toggle-btn');
    if (button) {
      button.addEventListener('click', () => this.toggle());
    }
  },
  
  /**
   * Update toggle button icon based on current theme
   */
  updateToggleButtonIcon: function() {
    const button = document.getElementById('theme-toggle-btn');
    if (button) {
      const isLightMode = document.body.classList.contains(this.LIGHT_MODE);
      button.title = isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      button.innerHTML = isLightMode ? '🌙' : '☀️';
    }
  },
  
  /**
   * Get current theme
   */
  getCurrentTheme: function() {
    return document.body.classList.contains(this.LIGHT_MODE) ? this.LIGHT_MODE : this.DARK_MODE;
  },
  
  /**
   * Check if light mode is active
   */
  isLightMode: function() {
    return document.body.classList.contains(this.LIGHT_MODE);
  }
};

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}
