/**
 * ============================================================================
 * KYC FORM ENHANCEMENT UTILITIES
 * ============================================================================
 * Enhances KYC form user experience with:
 * - Auto-save functionality
 * - Draft recovery
 * - Real-time validation
 * - Smart hints
 * - Progress tracking
 * - Form state persistence
 * ============================================================================
 */

class KYCFormEnhancer {
  constructor() {
    this.formData = {};
    this.isDirty = false;
    this.currentSection = 1;
    this.totalSections = 6;
    this.autoSaveInterval = 30000; // AutoSave every 30 seconds
    this.storageKey = 'kyc_form_draft_' + new Date().toISOString().split('T')[0];
    this.init();
  }

  /**
   * Initialize the enhancer
   */
  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupEnhancer());
    } else {
      this.setupEnhancer();
    }
  }

  /**
   * Setup all enhancements
   */
  setupEnhancer() {
    this.loadDraft();
    this.setupAutoSave();
    this.setupFormValidation();
    this.setupProgressBar();
    this.setupKeyboardNavigation();
    this.updateProgressUI();
    console.log('✅ KYC Form Enhancer initialized');
  }

  /**
   * Load previously saved draft
   */
  loadDraft() {
    const draft = sessionStorage.getItem(this.storageKey);
    if (draft) {
      try {
        this.formData = JSON.parse(draft);
        this.populateForm(this.formData);
        this.showNotification(
          'Draft recovered! Your progress has been restored.',
          'info'
        );
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }

  /**
   * Setup auto-save functionality
   */
  setupAutoSave() {
    // Save on form input
    document.addEventListener('change', (e) => {
      if (e.target.closest('.form-section.active')) {
        this.isDirty = true;
        this.scheduleAutoSave();
      }
    });

    // Auto-save interval
    setInterval(() => {
      if (this.isDirty) {
        this.saveDraft();
      }
    }, this.autoSaveInterval);

    // Save before leaving page
    window.addEventListener('beforeunload', (e) => {
      if (this.isDirty) {
        this.saveDraft();
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  /**
   * Save form as draft
   */
  saveDraft() {
    try {
      const formInputs = document.querySelectorAll(
        'input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="number"], select, textarea'
      );

      const data = {};
      formInputs.forEach((input) => {
        if (input.id && !input.disabled) {
          data[input.id] = input.value;
        }
      });

      sessionStorage.setItem(this.storageKey, JSON.stringify(data));
      this.isDirty = false;

      // Show subtle save indicator
      this.showSaveIndicator();
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
  }

  /**
   * Populate form with saved data
   */
  populateForm(data) {
    Object.keys(data).forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (element) {
        element.value = data[fieldId];
        // Trigger change event for any dependent fields
        element.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }

  /**
   * Show auto-save indicator
   */
  showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator') ||
      this.createSaveIndicator();
    indicator.style.opacity = '1';
    setTimeout(() => {
      indicator.style.opacity = '0';
    }, 2000);
  }

  /**
   * Create save indicator element
   */
  createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'saveIndicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 13px;
      z-index: 1001;
      opacity: 0;
      transition: opacity 0.3s;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    `;
    indicator.textContent = '💾 Draft saved';
    document.body.appendChild(indicator);
    return indicator;
  }

  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Real-time email validation
    const emailField = document.getElementById('email');
    if (emailField) {
      emailField.addEventListener('change', () => {
        this.validateEmail(emailField);
      });
    }

    // Real-time mobile validation
    const mobileField = document.getElementById('mobileNumber');
    if (mobileField) {
      mobileField.addEventListener('change', () => {
        this.validateMobile(mobileField);
      });
    }

    // Real-time income validation
    const incomeField = document.getElementById('monthlyIncome');
    if (incomeField) {
      incomeField.addEventListener('input', () => {
        this.validateIncome(incomeField);
      });
    }
  }

  /**
   * Validate email format
   */
  validateEmail(field) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    const errorDiv = document.getElementById('emailError');
    if (!isValid && field.value) {
      field.style.borderColor = '#ef4444';
      if (errorDiv) errorDiv.textContent = 'Please enter a valid email address';
    } else {
      field.style.borderColor = '#e5e7eb';
      if (errorDiv) errorDiv.textContent = '';
    }
    return isValid;
  }

  /**
   * Validate mobile number (Qatar format)
   */
  validateMobile(field) {
    // Accept various formats: +974XXXX, 974XXXX, 00974XXXX, +974 XXXX XXXX
    const isValid = /^(\+974|00974|974)[\d\s\-]{8,11}$/.test(
      field.value.replace(/\s/g, '')
    );
    const errorDiv = document.getElementById('mobileError');
    if (!isValid && field.value) {
      field.style.borderColor = '#ef4444';
      if (errorDiv) errorDiv.textContent = 'Please enter a valid Qatar mobile number';
    } else {
      field.style.borderColor = '#e5e7eb';
      if (errorDiv) errorDiv.textContent = '';
    }
    return isValid;
  }

  /**
   * Validate income amount
   */
  validateIncome(field) {
    const amount = parseFloat(field.value);
    const isValid = amount > 0 && amount <= 1000000;
    if (!isValid && field.value) {
      field.style.borderColor = '#ef4444';
      this.showNotification('Monthly income should be between 1 and 1,000,000 QAR', 'warning');
    } else {
      field.style.borderColor = '#e5e7eb';
    }
    return isValid;
  }

  /**
   * Setup enhanced progress bar
   */
  setupProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step) => {
      step.addEventListener('click', (e) => {
        e.preventDefault();
        const stepNum = parseInt(step.getAttribute('data-step'));
        if (this.validateCurrentSection()) {
          this.goToSection(stepNum);
        }
      });
    });
  }

  /**
   * Validate current section before moving
   */
  validateCurrentSection() {
    const requiredFields = document.querySelectorAll(
      `.form-section.active input[required], .form-section.active select[required]`
    );

    let isValid = true;
    requiredFields.forEach((field) => {
      if (!field.value || field.value.trim() === '') {
        field.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        field.style.borderColor = '#e5e7eb';
      }
    });

    if (!isValid) {
      this.showNotification('Please fill all required fields before continuing', 'error');
    }

    return isValid;
  }

  /**
   * Go to specific section
   */
  goToSection(sectionNum) {
    const currentSection = document.getElementById(`section${this.currentSection}`);
    if (currentSection) {
      currentSection.classList.remove('active');
    }

    const newSection = document.getElementById(`section${sectionNum}`);
    if (newSection) {
      newSection.classList.add('active');
      this.currentSection = sectionNum;
      this.updateProgressUI();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Update progress UI
   */
  updateProgressUI() {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step) => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      step.classList.remove('active', 'completed');

      if (stepNum < this.currentSection) {
        step.classList.add('completed');
      } else if (stepNum === this.currentSection) {
        step.classList.add('active');
      }
    });

    // Update progress bar
    const percentage = (this.currentSection / this.totalSections) * 100;
    this.updateProgressBar(percentage);
  }

  /**
   * Update visual progress bar
   */
  updateProgressBar(percentage) {
    let progressBar = document.getElementById('progressBar');
    if (!progressBar) {
      progressBar = this.createProgressBar();
    }
    progressBar.style.width = percentage + '%';
  }

  /**
   * Create progress bar element
   */
  createProgressBar() {
    const barContainer = document.createElement('div');
    barContainer.id = 'progressBarContainer';
    barContainer.style.cssText = `
      width: 100%;
      height: 4px;
      background: #e5e7eb;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    `;

    const bar = document.createElement('div');
    bar.id = 'progressBar';
    bar.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, #1a4d7a 0%, #2a7ba8 100%);
      width: 0%;
      transition: width 0.3s ease;
    `;

    barContainer.appendChild(bar);
    document.body.insertBefore(barContainer, document.body.firstChild);
    return bar;
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.nextSection();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.prevSection();
        }
      }
    });
  }

  /**
   * Move to next section
   */
  nextSection() {
    if (this.currentSection < this.totalSections) {
      if (this.validateCurrentSection()) {
        this.goToSection(this.currentSection + 1);
      }
    }
  }

  /**
   * Move to previous section
   */
  prevSection() {
    if (this.currentSection > 1) {
      this.goToSection(this.currentSection - 1);
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${colors[type]};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      z-index: 1002;
      max-width: 500px;
      animation: slideDown 0.3s ease;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  /**
   * Get form summary
   */
  getSummary() {
    const formInputs = document.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="tel"], input[type="date"], input[type="number"], select'
    );

    const summary = {};
    formInputs.forEach((input) => {
      if (input.id && input.value && !input.disabled) {
        const label = document.querySelector(`label[for="${input.id}"]`)?.textContent || input.id;
        summary[label.trim()] = input.value;
      }
    });

    return summary;
  }

  /**
   * Clear all saved data
   */
  clearDraft() {
    sessionStorage.removeItem(this.storageKey);
    location.reload();
  }

  /**
   * Export form as JSON
   */
  exportFormData() {
    const data = this.getSummary();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kyc_form_' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
  }
}

// Initialize automatically on page load
const kycEnhancer = new KYCFormEnhancer();

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }

  .form-group input:invalid:not(:placeholder-shown),
  .form-group select:invalid:not([value=""]) {
    border-color: #ef4444;
  }
`;
document.head.appendChild(style);
