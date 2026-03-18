/**
 * QIB EDD Case Management System — Login Controller
 * Enterprise Authentication Flow with OTP
 */

document.addEventListener('DOMContentLoaded', () => {
    // Language labels
    const labels = {
      en: {
        employeeId: 'Employee ID',
        employeeIdPlaceholder: 'Enter your Employee ID',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        selectRole: 'Select Your Role',
        authenticate: 'Authenticate & Access',
        otp: 'Enter Verification Code',
        verify: 'Verify & Access Platform',
        back: '← Back',
        resend: 'Resend Code',
        roles: {
          business: 'Business',
          cdd: 'Operations',
          compliance: 'Compliance',
          management: 'Management',
          audit: 'Audit',
          it: 'IT'
        }
      },
      ar: {
        employeeId: 'رقم الموظف',
        employeeIdPlaceholder: 'أدخل رقم الموظف',
        password: 'كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة المرور',
        selectRole: 'اختر الدور',
        authenticate: 'تسجيل الدخول',
        otp: 'أدخل رمز التحقق',
        verify: 'تحقق وادخل المنصة',
        back: 'عودة',
        resend: 'إعادة إرسال الرمز',
        roles: {
          business: 'الموظف',
          cdd: 'العمليات',
          compliance: 'الامتثال',
          management: 'الإدارة',
          audit: 'التدقيق',
          it: 'تقنية المعلومات'
        }
      }
    };

    function updateUILanguage(lang) {
      // Labels and placeholders (robust for all DOM states)
      // Employee ID
      document.querySelectorAll('label[for="employee-id"]').forEach(l => l.textContent = labels[lang].employeeId);
      document.querySelectorAll('#employee-id').forEach(inp => inp.placeholder = labels[lang].employeeIdPlaceholder);
      // Password
      document.querySelectorAll('label[for="password"]').forEach(l => l.textContent = labels[lang].password);
      document.querySelectorAll('#password').forEach(inp => inp.placeholder = labels[lang].passwordPlaceholder);
      // Select Role (only the first one in credentials step)
      const roleLabel = document.querySelector('#step-credentials .form-group label:not([for])');
      if (roleLabel) roleLabel.textContent = labels[lang].selectRole;
      // Login button
      document.querySelectorAll('#btn-login .btn-text').forEach(b => b.textContent = labels[lang].authenticate);
      // Role names
      document.querySelectorAll('.role-option').forEach(opt => {
        const val = opt.querySelector('input').value;
        opt.querySelector('.role-card span').textContent = labels[lang].roles[val];
      });
      // OTP step
      const otpLabel = document.querySelector('#step-otp label');
      if (otpLabel) otpLabel.textContent = labels[lang].otp;
      document.querySelectorAll('#btn-verify-otp .btn-text').forEach(b => b.textContent = labels[lang].verify);
      document.querySelectorAll('#btn-back').forEach(b => b.textContent = labels[lang].back);
      document.querySelectorAll('#btn-resend').forEach(b => b.textContent = labels[lang].resend);
      // Direction
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
    }

    // Listen to language toggle
    window.setLanguage = function(lang) {
      document.documentElement.lang = lang;
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('preferredLanguage', lang);
      // Update button states
      document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'transparent';
        btn.style.color = 'rgba(0, 212, 255, 0.6)';
      });
      const activeBtn = document.getElementById(`lang-${lang}`);
      if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = 'rgba(0, 212, 255, 0.15)';
        activeBtn.style.color = '#00D4FF';
      }
      updateUILanguage(lang);
    };

    // On load, set language
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    updateUILanguage(savedLang);
  'use strict';

  // DOM References
  const stepCredentials = document.getElementById('step-credentials');
  const stepOTP = document.getElementById('step-otp');
  const stepQibAnimation = document.getElementById('step-qib-animation');
  const stepSuccess = document.getElementById('step-success');
  const loginForm = document.getElementById('login-form');
  const otpForm = document.getElementById('otp-form');
  const employeeIdInput = document.getElementById('employee-id');
  const passwordInput = document.getElementById('password');
  const otpInputs = document.querySelectorAll('.otp-input');
  const statusEl = document.getElementById('status-message');
  const btnLogin = document.getElementById('btn-login');
  const btnVerify = document.getElementById('btn-verify-otp');
  const btnBack = document.getElementById('btn-back');
  const btnResend = document.getElementById('btn-resend');
  const timerEl = document.getElementById('otp-timer');
  const userDisplay = document.getElementById('user-display');
  const roleDisplay = document.getElementById('role-display');

  let currentUser = null;
  let selectedRole = 'business';
  let timerInterval = null;
  let demoOTP = '123456';

  // Demo Users Database
  const demoUsers = {
    'Qib@2030': { name: 'QIB Admin', password: 'Qib@2030', department: 'All Access', allowedRoles: ['business', 'cdd', 'compliance', 'management', 'audit', 'it'] },
    'EMP001': { name: 'العمليات', password: 'demo123', department: 'Operations', allowedRoles: ['business', 'management'] },
    'EMP002': { name: 'Fatima Al-Mansoor', password: 'demo123', department: 'CDD Operations', allowedRoles: ['cdd', 'compliance'] },
    'EMP003': { name: 'Mohammed Al-Suwaidi', password: 'demo123', department: 'Compliance', allowedRoles: ['compliance', 'management'] },
    'EMP004': { name: 'Sara Al-Khalifa', password: 'demo123', department: 'Private Banking', allowedRoles: ['business'] },
    'EMP005': { name: 'Khalid Al-Dosari', password: 'demo123', department: 'Audit', allowedRoles: ['audit'] },
    'EMP006': { name: 'Admin User', password: 'demo123', department: 'IT', allowedRoles: ['it', 'audit', 'management'] },
    'RAAFAT': { name: 'العمليات', password: 'raafat2030', department: 'Operations', allowedRoles: ['management', 'business', 'audit'] },
    'ARSLAN': { name: 'Operations Manager', password: 'Arslan@2030', department: 'WPS & Digital Back Office', allowedRoles: ['business', 'cdd', 'compliance', 'management', 'audit', 'it'] },
    'DEMO': { name: 'Demo User', password: 'demo', department: 'All Access', allowedRoles: ['business', 'cdd', 'compliance', 'management', 'audit', 'it'] }
  };

  const roleLabels = {
    business: 'Business Department',
    cdd: 'CDD Operations',
    compliance: 'Compliance',
    management: 'Management',
    audit: 'Audit',
    it: 'IT Administration'
  };

  // Step Management
  function showStep(step) {
    [stepCredentials, stepOTP, stepQibAnimation, stepSuccess].forEach(s => s.classList.remove('active'));
    step.classList.add('active');
    clearStatus();
  }

  // Status Messages
  function showStatus(type, message) {
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    statusEl.className = `status-message visible ${type}`;
    statusEl.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  }

  function clearStatus() {
    statusEl.className = 'status-message';
    statusEl.innerHTML = '';
  }

  // Role Selection Handler
  document.querySelectorAll('input[name="role"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      selectedRole = e.target.value;
    });
  });

  // Login Form Submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const employeeIdRaw = employeeIdInput.value.trim();
    const employeeId = employeeIdRaw.toUpperCase();
    const password = passwordInput.value;
    const selectedRoleRadio = document.querySelector('input[name="role"]:checked');

    // Validation
    if (!employeeId) {
      showStatus('error', 'Please enter your Employee ID');
      employeeIdInput.focus();
      return;
    }

    if (!password) {
      showStatus('error', 'Please enter your password');
      passwordInput.focus();
      return;
    }

    if (!selectedRoleRadio) {
      showStatus('error', 'Please select a role');
      return;
    }

    selectedRole = selectedRoleRadio.value;


    // Case-insensitive user lookup
    let user = demoUsers[employeeId];
    if (!user) {
      // Try to find by lower/upper/mixed case
      const foundKey = Object.keys(demoUsers).find(k => k.toLowerCase() === employeeIdRaw.toLowerCase());
      if (foundKey) user = demoUsers[foundKey];
    }
    if (!user) {
      showStatus('error', `Employee ID "${employeeIdRaw}" not found. Please try: DEMO, EMP001, EMP002, etc.`);
      employeeIdInput.focus();
      return;
    }

    if (user.password !== password) {
      showStatus('error', 'Invalid password. Please try again.');
      passwordInput.focus();
      return;
    }


    // Restrict access: Only allow management role with department 'Operations' or 'Head of Retail and Shared Service'
    if (selectedRole !== 'management' || !(
      user.department === 'Operations' ||
      user.department === 'Head of Retail and Shared Service'
    )) {
      showStatus('error', 'Access restricted: Only مدير العمليات (Operations Manager) or Head of Retail and Shared Service may log in.');
      return;
    }

    currentUser = { ...user, employeeId, role: selectedRole };

    // Show loading
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="btn-icon">⟳</span>';

    // Simulate authentication delay
    setTimeout(() => {
      btnLogin.disabled = false;
      btnLogin.innerHTML = '<span class="btn-label">Authenticate • Access Platform</span><span class="btn-icon">→</span><span class="btn-shimmer"></span>';
      
      showStep(stepOTP);
      startTimer();
      showStatus('info', `🔑 Demo OTP: ${demoOTP}`);
      // Reveal bank name after authentication
      const bankReveal = document.getElementById('bank-name-reveal');
      if (bankReveal) {
        bankReveal.style.display = 'block';
        bankReveal.style.animation = 'fadeStep 0.8s ease forwards';
      }
      otpInputs[0].focus();
    }, 1500);
  });

  // OTP Input Behavior
  otpInputs.forEach((input, idx) => {
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      input.classList.toggle('filled', val.length > 0);

      if (val.length === 1 && idx < otpInputs.length - 1) {
        otpInputs[idx + 1].focus();
      }

      // Auto-submit when all filled
      if (idx === otpInputs.length - 1 && val.length === 1) {
        const full = Array.from(otpInputs).map(i => i.value).join('');
        if (full.length === 6) {
          otpForm.dispatchEvent(new Event('submit'));
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && idx > 0) {
        otpInputs[idx - 1].focus();
        otpInputs[idx].classList.remove('filled');
      }
    });

    input.addEventListener('focus', () => input.select());

    // Handle paste
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').trim();
      if (/^\d{6}$/.test(pasted)) {
        otpInputs.forEach((inp, i) => {
          inp.value = pasted[i];
          inp.classList.add('filled');
        });
        otpInputs[5].focus();
        setTimeout(() => otpForm.dispatchEvent(new Event('submit')), 200);
      }
    });
  });

  // OTP Form Submit
  otpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const otp = Array.from(otpInputs).map(i => i.value).join('');

    if (otp.length !== 6) {
      showStatus('error', 'Please enter the complete 6-digit code');
      return;
    }

    if (otp !== demoOTP) {
      showStatus('error', 'Invalid verification code');
      otpInputs.forEach(i => { 
        i.value = ''; 
        i.classList.remove('filled'); 
        i.classList.add('error'); 
      });
      otpInputs[0].focus();
      setTimeout(() => otpInputs.forEach(i => i.classList.remove('error')), 2000);
      return;
    }

    // Show loading
    btnVerify.disabled = true;
    btnVerify.innerHTML = '<span class="spinner"></span>';

    clearTimer();
    
    setTimeout(() => {
      otpInputs.forEach(i => i.classList.add('success'));
      
      // Show QIB Digital Animation
      showStep(stepQibAnimation);

      // Store session (correct format for all views)
      const sessionData = {
        authenticated: true,
        user: currentUser,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem('edd_user', JSON.stringify(currentUser));
      sessionStorage.setItem('edd_session', JSON.stringify(sessionData));

      // Show success after animation
      setTimeout(() => {
        showStep(stepSuccess);
        userDisplay.textContent = currentUser.name;
        roleDisplay.textContent = roleLabels[currentUser.role];

        // Redirect after success
        setTimeout(() => {
          window.location.href = getDashboardUrl(currentUser.role);
        }, 3000);
      }, 2500);
    }, 1000);
  });

  // Get Dashboard URL based on role
  function getDashboardUrl(role) {
    const dashboards = {
      business: 'business_view.html',
      cdd: 'cdd_view.html',
      compliance: 'compliance_view.html',
      management: 'management_dashboard.html',
      audit: 'audit_console.html',
      it: 'admin_dashboard.html'
    };
    return dashboards[role] || 'dashboard.html';
  }

  // Back Button
  btnBack.addEventListener('click', () => {
    clearTimer();
    otpInputs.forEach(i => { 
      i.value = ''; 
      i.classList.remove('filled'); 
    });
    showStep(stepCredentials);
  });

  // Resend OTP
  btnResend.addEventListener('click', () => {
    demoOTP = String(Math.floor(100000 + Math.random() * 900000));
    showStatus('info', `New Demo OTP: ${demoOTP}`);
    startTimer();
  });

  // Timer
  function startTimer() {
    let seconds = 300; // 5 minutes
    clearTimer();
    
    updateTimerDisplay(seconds);
    
    timerInterval = setInterval(() => {
      seconds--;
      updateTimerDisplay(seconds);
      
      if (seconds <= 0) {
        clearTimer();
        showStatus('error', 'OTP expired. Please request a new code.');
      }
    }, 1000);
  }

  function updateTimerDisplay(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    timerEl.querySelector('.time').textContent = `${mins}:${secs}`;
    
    if (seconds <= 60) {
      timerEl.classList.add('expiring');
    }
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerEl.classList.remove('expiring');
  }

  // Check existing session
  const existingSessionData = sessionStorage.getItem('edd_session');
  console.log('Login page - checking session:', existingSessionData);
  if (existingSessionData) {
    try {
      const session = JSON.parse(existingSessionData);
      console.log('Parsed session:', session);
      // Check if session has authenticated flag
      if (session.authenticated && session.user && session.user.role) {
        console.log('Valid session found, redirecting to:', getDashboardUrl(session.user.role));
        window.location.replace(getDashboardUrl(session.user.role));
        return;
      } else {
        console.log('Session invalid - clearing');
        sessionStorage.removeItem('edd_user');
        sessionStorage.removeItem('edd_session');
      }
    } catch (e) {
      console.log('Session parse error:', e);
      // Invalid session, clear it
      sessionStorage.removeItem('edd_user');
      sessionStorage.removeItem('edd_session');
    }
  }
});
