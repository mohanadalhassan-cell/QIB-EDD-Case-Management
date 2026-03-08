/**
 * QIB EDD Case Management System — Login Controller
 * Enterprise Authentication Flow with OTP
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // DOM References
  const stepCredentials = document.getElementById('step-credentials');
  const stepOTP = document.getElementById('step-otp');
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
    'EMP001': { name: 'Ahmed Al-Thani', password: 'demo123', department: 'Mass Banking', allowedRoles: ['business', 'management'] },
    'EMP002': { name: 'Fatima Al-Mansoor', password: 'demo123', department: 'CDD Operations', allowedRoles: ['cdd', 'compliance'] },
    'EMP003': { name: 'Mohammed Al-Suwaidi', password: 'demo123', department: 'Compliance', allowedRoles: ['compliance', 'management'] },
    'EMP004': { name: 'Sara Al-Khalifa', password: 'demo123', department: 'Private Banking', allowedRoles: ['business'] },
    'EMP005': { name: 'Khalid Al-Dosari', password: 'demo123', department: 'Audit', allowedRoles: ['audit'] },
    'EMP006': { name: 'Admin User', password: 'demo123', department: 'IT', allowedRoles: ['it', 'audit', 'management'] },
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
    [stepCredentials, stepOTP, stepSuccess].forEach(s => s.classList.remove('active'));
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
    
    const employeeId = employeeIdInput.value.trim().toUpperCase();
    const password = passwordInput.value;

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

    // Check credentials
    const user = demoUsers[employeeId];
    
    if (!user || user.password !== password) {
      showStatus('error', 'Invalid Employee ID or Password');
      return;
    }

    // Check role access
    if (!user.allowedRoles.includes(selectedRole)) {
      showStatus('error', `Your account does not have access to ${roleLabels[selectedRole]}`);
      return;
    }

    currentUser = { ...user, employeeId, role: selectedRole };

    // Show loading
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="spinner"></span>';

    // Simulate authentication delay
    setTimeout(() => {
      btnLogin.disabled = false;
      btnLogin.innerHTML = '<span class="btn-text">Authenticate & Access</span><span class="btn-shimmer"></span>';
      
      showStep(stepOTP);
      startTimer();
      showStatus('info', `Demo OTP: ${demoOTP}`);
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
      
      // Show success
      showStep(stepSuccess);
      userDisplay.textContent = currentUser.name;
      roleDisplay.textContent = roleLabels[currentUser.role];

      // Store session (correct format for all views)
      const sessionData = {
        authenticated: true,
        user: currentUser,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem('edd_user', JSON.stringify(currentUser));
      sessionStorage.setItem('edd_session', JSON.stringify(sessionData));

      // Redirect after animation
      setTimeout(() => {
        window.location.href = getDashboardUrl(currentUser.role);
      }, 3000);
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
      it: 'dashboard.html'
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
  if (existingSessionData) {
    try {
      const session = JSON.parse(existingSessionData);
      // Check if session has authenticated flag
      if (session.authenticated && session.user && session.user.role) {
        window.location.href = getDashboardUrl(session.user.role);
        return;
      }
    } catch (e) {
      // Invalid session, clear it
      sessionStorage.removeItem('edd_user');
      sessionStorage.removeItem('edd_session');
    }
  }
});
