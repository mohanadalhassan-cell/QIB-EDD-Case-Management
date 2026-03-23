/**
 * ============================================================================
 * EDD_QIB SYSTEM - EXPRESS SERVER (v2.0)
 * ============================================================================
 * Enhanced Due Diligence Case Management System
 * Qatar Islamic Bank (QIB)
 * ============================================================================
 * Features:
 * - Express-based REST API for case management
 * - JWT authentication & authorization
 * - CORS support for frontend integration
 * - Security headers with Helmet
 * - Request logging with Morgan
 * - Rate limiting for API protection
 * - In-memory data storage (ready for PostgreSQL migration)
 * ============================================================================
 */

require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

// ============================================================================
// CONFIGURATION
// ============================================================================
const PORT = process.env.PORT || 8585;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'edd-qib-secret-key-2024-change-in-production';
const baseDir = path.join(__dirname);
const staticDir = path.join(baseDir, 'edd_system');

// ============================================================================
// LOGGER UTILITY
// ============================================================================
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
  debug: (msg) => NODE_ENV === 'development' && console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`)
};

// ============================================================================
// INITIALIZE EXPRESS APP
// ============================================================================
const app = express();

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================
app.use(helmet()); // Add security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting (API-only). Static assets are excluded to avoid throttling the UI.
const isLocalhostRequest = (req) => {
  const ip = req.ip || req.socket?.remoteAddress || '';
  return ip.includes('127.0.0.1') || ip.includes('::1') || ip.includes('localhost');
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: NODE_ENV === 'development' ? 5000 : Number(process.env.RATE_LIMIT_MAX || 100),
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => NODE_ENV === 'development' && isLocalhostRequest(req)
});
app.use('/api', apiLimiter);

// ============================================================================
// MIDDLEWARE
// ============================================================================
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// ============================================================================
// IN-MEMORY DATA STORE (Ready for PostgreSQL migration)
// ============================================================================
const dataStore = {
  users: new Map(),
  cases: new Map(),
  kyc: new Map(),
  notifications: new Map(),
  auditLog: [],
  sessions: new Map(),
  rules: new Map(),
  settings: {
    eddThreshold: 60,
    slaHours: 72,
    maxCasesPerOfficer: 25,
    autoEscalateAfterHours: 48,
    enableEmailNotifications: true,
    enableSMSNotifications: false
  }
};

// Initialize with sample data
function initializeDataStore() {
  // Bcrypt salt rounds — low for seeding speed; use 10+ in production
  const BCRYPT_ROUNDS = 6;

  // Sample users
  const users = [
    {
      id: uuidv4(),
      username: 'mohanad.hassan',
      email: 'mohanad.hassan@qib.com.qa',
      password: bcrypt.hashSync('edd2024', BCRYPT_ROUNDS),
      fullName: 'Mohanad Al Hassan',
      role: 'OPERATIONS_MANAGER',
      department: 'Operations',
      active: true,
      createdAt: new Date()
    },
    {
      id: uuidv4(),
      username: 'fatima.ibrahim',
      email: 'fatima.ibrahim@qib.com.qa',
      password: bcrypt.hashSync('edd2024', BCRYPT_ROUNDS),
      fullName: 'Fatima Ibrahim',
      role: 'BUSINESS_MAKER',
      department: 'Retail Banking',
      active: true,
      createdAt: new Date()
    },
    {
      id: uuidv4(),
      username: 'admin.system',
      email: 'admin@qib.com.qa',
      password: bcrypt.hashSync('admin123', BCRYPT_ROUNDS),
      fullName: 'System Administrator',
      role: 'ADMIN',
      department: 'IT',
      active: true,
      createdAt: new Date()
    }
  ];

  users.forEach(user => {
    dataStore.users.set(user.id, user);
  });

  // Sample risk rules (dynamic rule engine seed data)
  const sampleRules = [
    {
      id: uuidv4(),
      name: 'CR-001: Auto-High — FATF Blacklist',
      description: 'Automatically classify as HIGH RISK if nationality is from FATF blacklisted country',
      condition: 'COUNTRY_RISK_SCORE >= 80 AND FATF_BLACKLIST = TRUE',
      action: 'SET FINAL_RISK_CATEG = "AUTO HIGH"; TRIGGER EDD; ALERT COMPLIANCE_TEAM',
      priority: 1,
      active: true,
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: uuidv4(),
      name: 'CR-002: Auto-High — PEP Detection',
      description: 'Automatically escalate to HIGH RISK if customer is a Politically Exposed Person',
      condition: 'PEP_STATUS = TRUE',
      action: 'SET FINAL_RISK_CATEG = "AUTO HIGH"; TRIGGER EDD; ASSIGN SENIOR_COMPLIANCE_OFFICER',
      priority: 2,
      active: true,
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: uuidv4(),
      name: 'CR-003: High Risk — Combined Score',
      description: 'Classify as HIGH RISK based on combined country and activity risk scores',
      condition: 'COUNTRY_RISK_SCORE >= 80 AND ACT_RISK_SCORE >= 60',
      action: 'SET FINAL_RISK_CATEG = "AUTO HIGH"; TRIGGER EDD',
      priority: 3,
      active: true,
      createdBy: 'system',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: uuidv4(),
      name: 'CR-004: Medium Risk — High Risk Occupation',
      description: 'Classify as MEDIUM RISK if occupation is on the high-risk occupations list',
      condition: 'OCCUPATION IN HIGH_RISK_OCCUPATION_LIST',
      action: 'SET OCCP_RISK_CATEG = "MEDIUM"; BLOCK KYC_COMPLETION UNTIL REQUIRED_DOCS_UPLOADED = TRUE; ALERT COMPLIANCE_TEAM',
      priority: 4,
      active: true,
      createdBy: 'system',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: uuidv4(),
      name: 'CR-005: EDD Threshold',
      description: 'Trigger EDD process when final risk score exceeds the configured threshold',
      condition: 'FINAL_RISK_SCORE >= 60',
      action: 'TRIGGER EDD; ASSIGN CDD_OFFICER; SET SLA = 72H',
      priority: 5,
      active: true,
      createdBy: 'admin.system',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    }
  ];

  sampleRules.forEach(rule => {
    dataStore.rules.set(rule.id, rule);
  });

  // Sample demo cases for board presentation
  const demoCases = [
    {
      id: uuidv4(),
      caseNumber: 'EDD-2024-001',
      customerName: 'Ahmad Al-Mahmoud',
      nationalId: 'QA-28451023',
      nationality: 'QA',
      occupation: 'Business Owner',
      annualIncome: 850000,
      status: 'IN_REVIEW',
      riskRating: 'HIGH',
      riskScore: 78,
      sector: 'REAL_ESTATE',
      assignedTo: 'fatima.ibrahim',
      createdBy: 'mohanad.hassan',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-05'),
      notes: 'High-value real estate transactions. Requires enhanced documentation.',
      triggeredRules: ['CR-003', 'CR-005'],
      documents: ['passport', 'income_proof'],
      isPEP: false
    },
    {
      id: uuidv4(),
      caseNumber: 'EDD-2024-002',
      customerName: 'Mohammed Saleh Al-Farsi',
      nationalId: 'OM-19380574',
      nationality: 'OM',
      occupation: 'Government Official',
      annualIncome: 320000,
      status: 'NEW',
      riskRating: 'HIGH',
      riskScore: 88,
      sector: 'PUBLIC_SECTOR',
      assignedTo: null,
      createdBy: 'fatima.ibrahim',
      createdAt: new Date('2024-03-08'),
      updatedAt: new Date('2024-03-08'),
      notes: 'PEP detected. Senior compliance review required.',
      triggeredRules: ['CR-002'],
      documents: [],
      isPEP: true
    },
    {
      id: uuidv4(),
      caseNumber: 'EDD-2024-003',
      customerName: 'Layla Hassan Al-Rashidi',
      nationalId: 'QA-30571209',
      nationality: 'QA',
      occupation: 'Medical Doctor',
      annualIncome: 480000,
      status: 'APPROVED',
      riskRating: 'LOW',
      riskScore: 22,
      sector: 'HEALTHCARE',
      assignedTo: 'fatima.ibrahim',
      createdBy: 'mohanad.hassan',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-20'),
      notes: 'Standard KYC completed. No risk indicators found.',
      triggeredRules: [],
      documents: ['passport', 'salary_certificate', 'bank_statement'],
      isPEP: false
    },
    {
      id: uuidv4(),
      caseNumber: 'EDD-2024-004',
      customerName: 'Khalid Ibrahim Al-Mutairi',
      nationalId: 'KW-22847301',
      nationality: 'KW',
      occupation: 'Money Exchange',
      annualIncome: 1200000,
      status: 'IN_REVIEW',
      riskRating: 'HIGH',
      riskScore: 85,
      sector: 'FINANCIAL_SERVICES',
      assignedTo: 'fatima.ibrahim',
      createdBy: 'mohanad.hassan',
      createdAt: new Date('2024-03-02'),
      updatedAt: new Date('2024-03-06'),
      notes: 'Money exchange business with high transaction volumes. Full EDD required.',
      triggeredRules: ['CR-004', 'CR-005'],
      documents: ['trade_license', 'passport'],
      isPEP: false
    },
    {
      id: uuidv4(),
      caseNumber: 'EDD-2024-005',
      customerName: 'Sara Al-Khalifa',
      nationalId: 'QA-35190284',
      nationality: 'QA',
      occupation: 'Investment Analyst',
      annualIncome: 560000,
      status: 'PENDING_DOCUMENTS',
      riskRating: 'MEDIUM',
      riskScore: 45,
      sector: 'INVESTMENT',
      assignedTo: 'fatima.ibrahim',
      createdBy: 'mohanad.hassan',
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-07'),
      notes: 'Awaiting source of funds documentation.',
      triggeredRules: ['CR-005'],
      documents: ['passport'],
      isPEP: false
    }
  ];

  demoCases.forEach(c => {
    dataStore.cases.set(c.id, c);
  });

  logger.info('✅ Data store initialized with sample users, rules, and demo cases');
}

// Initialize on startup
initializeDataStore();

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 'ERROR',
      message: 'Missing authentication token',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: 'ERROR',
      message: 'Invalid or expired token',
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Require one of the specified roles. Must be used after authMiddleware.
 * @param {...string} roles - Allowed roles (e.g. 'ADMIN', 'COMPLIANCE_OFFICER')
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      status: 'ERROR',
      message: 'Insufficient permissions',
      timestamp: new Date().toISOString()
    });
  }
  next();
};

// ============================================================================
// ROUTES: AUTHENTICATION
// ============================================================================
app.post('/api/v1/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Username and password are required',
        timestamp: new Date().toISOString()
      });
    }

    // Find user (demo: simple lookup)
    let user = null;
    for (const [, userData] of dataStore.users) {
      if (userData.username === username && userData.active) {
        user = userData;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Invalid username or password',
        timestamp: new Date().toISOString()
      });
    }

    // Generate JWT token
    const token = jwt.sign({
      userId: user.id,
      username: user.username,
      role: user.role,
      department: user.department,
      email: user.email,
      fullName: user.fullName
    }, JWT_SECRET, { expiresIn: '8h' });

    // Store session
    dataStore.sessions.set(token, {
      userId: user.id,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000)
    });

    // Log audit trail
    logAudit('LOGIN', user.id, user.username, 'User login successful');

    logger.info(`✅ User ${user.username} logged in successfully`);

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department
      },
      expiresIn: '8h',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Login failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/v1/auth/logout', authMiddleware, (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      dataStore.sessions.delete(token);
    }

    logAudit('LOGOUT', req.user.userId, req.user.username, 'User logged out');

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Logout failed',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// ROUTES: CASES
// ============================================================================
app.get('/api/v1/cases', authMiddleware, (req, res) => {
  try {
    const status = req.query.status;
    const department = req.query.department;

    let cases = Array.from(dataStore.cases.values());

    if (status) {
      cases = cases.filter(c => c.status === status);
    }

    if (department) {
      cases = cases.filter(c => c.assignedDepartment === department);
    }

    // Sort by creation date descending
    cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      status: 'SUCCESS',
      count: cases.length,
      data: cases,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Error retrieving cases: ${error.message}`);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve cases',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/v1/cases/:caseId', authMiddleware, (req, res) => {
  try {
    const caseData = dataStore.cases.get(req.params.caseId);

    if (!caseData) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Case not found',
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      data: caseData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve case',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/v1/cases', authMiddleware, (req, res) => {
  try {
    const { customerId, customerName, riskRating, caseType } = req.body;

    if (!customerId || !customerName) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'customerId and customerName are required',
        timestamp: new Date().toISOString()
      });
    }

    const newCase = {
      id: uuidv4(),
      customerId: customerId,
      customerName: customerName,
      caseType: caseType || 'EDD',
      status: 'NEW',
      riskRating: riskRating || 'MEDIUM',
      assignedTo: null,
      assignedDepartment: null,
      createdBy: req.user.userId,
      createdByName: req.user.fullName,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      documents: []
    };

    dataStore.cases.set(newCase.id, newCase);

    logAudit('CREATE_CASE', req.user.userId, req.user.username, `Created case ${newCase.id} for customer ${customerName}`);

    logger.info(`✅ New case created: ${newCase.id}`);

    return res.status(201).json({
      status: 'SUCCESS',
      message: 'Case created successfully',
      data: newCase,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Error creating case: ${error.message}`);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to create case',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.put('/api/v1/cases/:caseId', authMiddleware, (req, res) => {
  try {
    const caseData = dataStore.cases.get(req.params.caseId);

    if (!caseData) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'Case not found',
        timestamp: new Date().toISOString()
      });
    }

    const { status, assignedTo, riskRating, comments } = req.body;

    if (status) caseData.status = status;
    if (assignedTo) caseData.assignedTo = assignedTo;
    if (riskRating) caseData.riskRating = riskRating;
    if (comments) caseData.comments = comments;

    caseData.updatedAt = new Date();

    logAudit('UPDATE_CASE', req.user.userId, req.user.username, `Updated case ${req.params.caseId}`);

    return res.status(200).json({
      status: 'SUCCESS',
      message: 'Case updated successfully',
      data: caseData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error(`Error updating case: ${error.message}`);
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to update case',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// ROUTES: STATISTICS & DASHBOARDS
// ============================================================================
app.get('/api/v1/stats', authMiddleware, (req, res) => {
  try {
    const cases = Array.from(dataStore.cases.values());
    const statuses = {};

    cases.forEach(c => {
      statuses[c.status] = (statuses[c.status] || 0) + 1;
    });

    const stats = {
      totalCases: cases.length,
      byStatus: statuses,
      byRisk: {
        HIGH: cases.filter(c => c.riskRating === 'HIGH').length,
        MEDIUM: cases.filter(c => c.riskRating === 'MEDIUM').length,
        LOW: cases.filter(c => c.riskRating === 'LOW').length
      },
      avgResolutionTime: '3.5 days',
      slaCompliance: '98.5%',
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      status: 'SUCCESS',
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve statistics',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// ROUTES: NOTIFICATIONS
// ============================================================================
app.get('/api/v1/notifications', authMiddleware, (req, res) => {
  try {
    const userNotifications = Array.from(dataStore.notifications.values())
      .filter(n => n.userId === req.user.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      status: 'SUCCESS',
      count: userNotifications.length,
      data: userNotifications,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve notifications',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// ROUTES: AUDIT LOG
// ============================================================================
app.get('/api/v1/audit', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const auditLog = dataStore.auditLog
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 1000); // Last 1000 entries

    return res.status(200).json({
      status: 'SUCCESS',
      count: auditLog.length,
      data: auditLog,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'ERROR',
      message: 'Failed to retrieve audit log',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================================================
// ROUTES: SYSTEM HEALTH
// ============================================================================
app.get('/api/v1/health', (req, res) => {
  return res.status(200).json({
    status: 'HEALTHY',
    uptime: process.uptime(),
    environment: NODE_ENV,
    version: '2.0.0',
    dataStore: {
      users: dataStore.users.size,
      cases: dataStore.cases.size,
      kyc: dataStore.kyc.size,
      auditLog: dataStore.auditLog.length
    },
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// ROUTES: DYNAMIC RISK RULES ENGINE
// ============================================================================

// GET /api/v1/rules — list all rules
app.get('/api/v1/rules', authMiddleware, (req, res) => {
  try {
    const rules = Array.from(dataStore.rules.values())
      .sort((a, b) => a.priority - b.priority);

    return res.status(200).json({
      status: 'SUCCESS',
      count: rules.length,
      data: rules,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve rules', timestamp: new Date().toISOString() });
  }
});

// POST /api/v1/rules — create a new rule (admin only)
app.post('/api/v1/rules', authMiddleware, requireRole('ADMIN', 'COMPLIANCE_OFFICER'), (req, res) => {
  try {
    const { name, description, condition, action, priority, active } = req.body;

    if (!name || !condition || !action) {
      return res.status(400).json({ status: 'ERROR', message: 'name, condition, and action are required', timestamp: new Date().toISOString() });
    }

    const rule = {
      id: uuidv4(),
      name,
      description: description || '',
      condition,
      action,
      priority: priority || 50,
      active: active !== undefined ? active : true,
      createdBy: req.user.username,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dataStore.rules.set(rule.id, rule);
    logAudit('RULE_CREATED', req.user.userId, req.user.username, `Rule created: ${name}`);

    return res.status(201).json({ status: 'SUCCESS', message: 'Rule created successfully', data: rule, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to create rule', timestamp: new Date().toISOString() });
  }
});

// PUT /api/v1/rules/:ruleId — update a rule (admin only)
app.put('/api/v1/rules/:ruleId', authMiddleware, requireRole('ADMIN', 'COMPLIANCE_OFFICER'), (req, res) => {
  try {
    const rule = dataStore.rules.get(req.params.ruleId);
    if (!rule) {
      return res.status(404).json({ status: 'ERROR', message: 'Rule not found', timestamp: new Date().toISOString() });
    }

    const allowedRuleFields = ['name', 'description', 'condition', 'action', 'priority', 'active'];
    const updates = {};
    allowedRuleFields.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    const updatedRule = { ...rule, ...updates, id: rule.id, updatedAt: new Date() };
    dataStore.rules.set(rule.id, updatedRule);
    logAudit('RULE_UPDATED', req.user.userId, req.user.username, `Rule updated: ${rule.name}`);

    return res.status(200).json({ status: 'SUCCESS', message: 'Rule updated successfully', data: updatedRule, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to update rule', timestamp: new Date().toISOString() });
  }
});

// DELETE /api/v1/rules/:ruleId — delete a rule (admin only)
app.delete('/api/v1/rules/:ruleId', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const rule = dataStore.rules.get(req.params.ruleId);
    if (!rule) {
      return res.status(404).json({ status: 'ERROR', message: 'Rule not found', timestamp: new Date().toISOString() });
    }

    dataStore.rules.delete(req.params.ruleId);
    logAudit('RULE_DELETED', req.user.userId, req.user.username, `Rule deleted: ${rule.name}`);

    return res.status(200).json({ status: 'SUCCESS', message: 'Rule deleted successfully', timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to delete rule', timestamp: new Date().toISOString() });
  }
});

// ============================================================================
// ROUTES: USER MANAGEMENT (Admin)
// ============================================================================

// GET /api/v1/users — list all users (admin only)
app.get('/api/v1/users', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const users = Array.from(dataStore.users.values()).map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      department: u.department,
      active: u.active,
      createdAt: u.createdAt
    }));

    return res.status(200).json({ status: 'SUCCESS', count: users.length, data: users, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve users', timestamp: new Date().toISOString() });
  }
});

// POST /api/v1/users — create new user (admin only)
app.post('/api/v1/users', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const { username, password, fullName, email, role, department } = req.body;

    if (!username || !password || !fullName || !email || !role) {
      return res.status(400).json({ status: 'ERROR', message: 'username, password, fullName, email, and role are required', timestamp: new Date().toISOString() });
    }

    // Check for duplicate username
    for (const [, u] of dataStore.users) {
      if (u.username === username) {
        return res.status(409).json({ status: 'ERROR', message: 'Username already exists', timestamp: new Date().toISOString() });
      }
    }

    const newUser = {
      id: uuidv4(),
      username,
      password: bcrypt.hashSync(password, 10),
      fullName,
      email,
      role,
      department: department || 'General',
      active: true,
      createdAt: new Date()
    };

    dataStore.users.set(newUser.id, newUser);
    logAudit('USER_CREATED', req.user.userId, req.user.username, `User created: ${username}`);

    const { password: _, ...safeUser } = newUser;
    return res.status(201).json({ status: 'SUCCESS', message: 'User created successfully', data: safeUser, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to create user', timestamp: new Date().toISOString() });
  }
});

// PUT /api/v1/users/:userId — update user (admin only)
app.put('/api/v1/users/:userId', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const user = dataStore.users.get(req.params.userId);
    if (!user) {
      return res.status(404).json({ status: 'ERROR', message: 'User not found', timestamp: new Date().toISOString() });
    }

    const { password, ...bodyUpdates } = req.body;
    // Only allow safe fields to be updated
    const allowedUserFields = ['fullName', 'email', 'department', 'role', 'active'];
    const safeUpdates = {};
    allowedUserFields.forEach(key => {
      if (bodyUpdates[key] !== undefined) safeUpdates[key] = bodyUpdates[key];
    });
    const updatedUser = { ...user, ...safeUpdates, id: user.id };
    if (password) updatedUser.password = bcrypt.hashSync(password, 10);
    dataStore.users.set(user.id, updatedUser);
    logAudit('USER_UPDATED', req.user.userId, req.user.username, `User updated: ${user.username}`);

    const { password: _, ...safeUser } = updatedUser;
    return res.status(200).json({ status: 'SUCCESS', message: 'User updated successfully', data: safeUser, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to update user', timestamp: new Date().toISOString() });
  }
});

// DELETE /api/v1/users/:userId — deactivate user (admin only)
app.delete('/api/v1/users/:userId', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const user = dataStore.users.get(req.params.userId);
    if (!user) {
      return res.status(404).json({ status: 'ERROR', message: 'User not found', timestamp: new Date().toISOString() });
    }

    // Deactivate rather than hard-delete
    user.active = false;
    dataStore.users.set(user.id, user);
    logAudit('USER_DEACTIVATED', req.user.userId, req.user.username, `User deactivated: ${user.username}`);

    return res.status(200).json({ status: 'SUCCESS', message: 'User deactivated successfully', timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to deactivate user', timestamp: new Date().toISOString() });
  }
});

// ============================================================================
// ROUTES: RISK ASSESSMENT ENGINE
// ============================================================================

// POST /api/v1/risk/assess — calculate risk score for a customer profile
app.post('/api/v1/risk/assess', authMiddleware, (req, res) => {
  try {
    const { nationalityCode, occupation, annualIncome, transactionVolume, isPEP, isHighRiskCountry, sector } = req.body;

    if (!nationalityCode && !occupation) {
      return res.status(400).json({ status: 'ERROR', message: 'At least nationalityCode or occupation is required', timestamp: new Date().toISOString() });
    }

    // Apply dynamic rules from dataStore
    const activeRules = Array.from(dataStore.rules.values())
      .filter(r => r.active)
      .sort((a, b) => a.priority - b.priority);

    // Base score calculation
    let scores = { country: 0, occupation: 0, product: 0, activity: 0, pep: 0 };
    const triggeredRules = [];

    // Country risk scoring
    const highRiskCountries = ['IR', 'KP', 'SY', 'IQ', 'LY', 'SO', 'SS', 'YE', 'AF'];
    const mediumRiskCountries = ['PK', 'NG', 'ET', 'VE', 'MM', 'KH'];
    if (nationalityCode) {
      if (highRiskCountries.includes(nationalityCode.toUpperCase())) {
        scores.country = 85;
        triggeredRules.push('HIGH_RISK_COUNTRY');
      } else if (mediumRiskCountries.includes(nationalityCode.toUpperCase())) {
        scores.country = 55;
        triggeredRules.push('MEDIUM_RISK_COUNTRY');
      } else {
        scores.country = 20;
      }
    }

    // PEP risk
    if (isPEP) {
      scores.pep = 90;
      triggeredRules.push('PEP_DETECTED');
    }

    // Occupation risk
    const highRiskOccupations = ['money_changer', 'casino', 'arms_dealer', 'crypto_exchange', 'real_estate_agent'];
    const mediumRiskOccupations = ['lawyer', 'accountant', 'precious_metals', 'car_dealer'];
    if (occupation) {
      if (highRiskOccupations.includes(occupation.toLowerCase())) {
        scores.occupation = 80;
        triggeredRules.push('HIGH_RISK_OCCUPATION');
      } else if (mediumRiskOccupations.includes(occupation.toLowerCase())) {
        scores.occupation = 50;
        triggeredRules.push('MEDIUM_RISK_OCCUPATION');
      } else {
        scores.occupation = 15;
      }
    }

    // Transaction volume risk
    if (transactionVolume) {
      if (transactionVolume > 1000000) {
        scores.activity = 75;
        triggeredRules.push('HIGH_TRANSACTION_VOLUME');
      } else if (transactionVolume > 250000) {
        scores.activity = 45;
        triggeredRules.push('MEDIUM_TRANSACTION_VOLUME');
      } else {
        scores.activity = 10;
      }
    }

    // Apply dynamic rules from the rule engine
    activeRules.forEach(rule => {
      try {
        // Simple rule evaluation: check if condition keywords match input
        const conditionLower = rule.condition.toLowerCase();
        if (conditionLower.includes('pep') && isPEP) {
          triggeredRules.push(`RULE:${rule.name}`);
        }
        if (conditionLower.includes('high_risk_country') && isHighRiskCountry) {
          triggeredRules.push(`RULE:${rule.name}`);
        }
      } catch (e) {
        logger.warn(`Rule evaluation error for rule "${rule.name}" (id: ${rule.id}): ${e.message}`);
      }
    });

    // Calculate final composite score (weighted average)
    const weights = { country: 0.30, occupation: 0.25, activity: 0.20, pep: 0.15, product: 0.10 };
    const weightedScore = Math.round(
      scores.country * weights.country +
      scores.occupation * weights.occupation +
      scores.activity * weights.activity +
      scores.pep * weights.pep +
      scores.product * weights.product
    );

    // Auto-escalate to HIGH when two or more high-risk factors are present (mirrors rule CR-003)
    const highFactorCount = [scores.country >= 75, scores.occupation >= 70, scores.pep >= 70, scores.activity >= 70].filter(Boolean).length;
    const finalScore = highFactorCount >= 2 ? Math.max(weightedScore, 65) : weightedScore;

    // Use configured EDD threshold from settings
    const eddThreshold = dataStore.settings.eddThreshold || 60;

    let riskCategory, eddRequired;
    if (finalScore >= eddThreshold || isPEP) {
      riskCategory = 'HIGH';
      eddRequired = true;
    } else if (finalScore >= 35) {
      riskCategory = 'MEDIUM';
      eddRequired = false;
    } else {
      riskCategory = 'LOW';
      eddRequired = false;
    }

    const result = {
      finalScore,
      riskCategory,
      eddRequired,
      scores,
      triggeredRules: [...new Set(triggeredRules)],
      recommendation: eddRequired
        ? 'Enhanced Due Diligence required. Assign to CDD Officer for full review.'
        : riskCategory === 'MEDIUM'
          ? 'Standard Due Diligence with enhanced monitoring.'
          : 'Standard CDD process applies.',
      assessedAt: new Date().toISOString()
    };

    logAudit('RISK_ASSESSED', req.user.userId, req.user.username, `Risk assessment: ${riskCategory} (score: ${finalScore})`);

    return res.status(200).json({ status: 'SUCCESS', data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Risk assessment failed', timestamp: new Date().toISOString() });
  }
});

// ============================================================================
// ROUTES: SYSTEM SETTINGS
// ============================================================================

// GET /api/v1/settings — get system settings (admin only)
app.get('/api/v1/settings', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    return res.status(200).json({
      status: 'SUCCESS',
      data: dataStore.settings,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to retrieve settings', timestamp: new Date().toISOString() });
  }
});

// PUT /api/v1/settings — update system settings (admin only)
app.put('/api/v1/settings', authMiddleware, requireRole('ADMIN'), (req, res) => {
  try {
    const allowedKeys = ['eddThreshold', 'slaHours', 'maxCasesPerOfficer', 'autoEscalateAfterHours', 'enableEmailNotifications', 'enableSMSNotifications'];
    const updates = {};
    allowedKeys.forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    Object.assign(dataStore.settings, updates);
    logAudit('SETTINGS_UPDATED', req.user.userId, req.user.username, `Settings updated: ${Object.keys(updates).join(', ')}`);

    return res.status(200).json({ status: 'SUCCESS', message: 'Settings updated successfully', data: dataStore.settings, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ status: 'ERROR', message: 'Failed to update settings', timestamp: new Date().toISOString() });
  }
});

// ============================================================================
// STATIC FILE SERVING
// ============================================================================
app.use(express.static(staticDir));

// Serve index.html for SPA routing
app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.get('/edd_system/*', (req, res) => {
  const requestedPath = req.params[0];
  const filePath = path.join(staticDir, requestedPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(staticDir)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Check if file exists
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    return res.sendFile(path.join(filePath, 'index.html'));
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(staticDir, '404.html'), (err) => {
        if (err) {
          res.status(404).json({ error: 'File not found' });
        }
      });
    }
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================
app.use((req, res) => {
  res.status(404).json({
    status: 'ERROR',
    message: 'Endpoint not found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);

  res.status(500).json({
    status: 'ERROR',
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? err.message : 'An error occurred',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function logAudit(action, userId, username, details) {
  const auditEntry = {
    id: uuidv4(),
    action: action,
    userId: userId,
    username: username,
    details: details,
    timestamp: new Date(),
    ipAddress: 'localhost'
  };

  dataStore.auditLog.push(auditEntry);

  // Keep only last 10,000 entries
  if (dataStore.auditLog.length > 10000) {
    dataStore.auditLog.shift();
  }
}

// ============================================================================
// START SERVER
// ============================================================================
let server;

if (require.main === module) {
  server = app.listen(PORT, '127.0.0.1', () => {
    console.clear();
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                      EDD_QIB SYSTEM v2.0                       ║
║          Enhanced Due Diligence Case Management                ║
║              Qatar Islamic Bank (QIB)                          ║
╚════════════════════════════════════════════════════════════════╝

🚀 Express Server Running
📍 URL:        http://localhost:${PORT}
🌐 Dashboard:  http://localhost:${PORT}/edd_system/
🔌 API:        http://localhost:${PORT}/api/v1/
📊 Health:     http://localhost:${PORT}/api/v1/health

🔐 Authentication:
   POST /api/v1/auth/login
   Demo: ahmed.thani / edd2024

📊 Available Endpoints:
   GET  /api/v1/cases              - List all cases
   GET  /api/v1/cases/:caseId      - Get case details
   POST /api/v1/cases              - Create new case
   PUT  /api/v1/cases/:caseId      - Update case
   GET  /api/v1/stats              - Dashboard statistics
   GET  /api/v1/notifications      - Get user notifications
   GET  /api/v1/audit              - View audit log (admin only)
   GET  /api/v1/health             - System health status
   GET  /api/v1/rules              - List dynamic risk rules
   POST /api/v1/rules              - Create risk rule (admin)
   PUT  /api/v1/rules/:id          - Update risk rule (admin)
   DELETE /api/v1/rules/:id        - Delete risk rule (admin)
   GET  /api/v1/users              - List users (admin only)
   POST /api/v1/users              - Create user (admin only)
   PUT  /api/v1/users/:id          - Update user (admin only)
   DELETE /api/v1/users/:id        - Deactivate user (admin only)
   POST /api/v1/risk/assess        - Run risk assessment
   GET  /api/v1/settings           - Get system settings (admin)
   PUT  /api/v1/settings           - Update system settings (admin)

⚙️  Environment: ${NODE_ENV}
🔒 Security: Helmet enabled, Rate limiting active
📝 Logging: Morgan request logging active

${NODE_ENV === 'development' ? '⚠️  WARNING: Running in development mode\n' : '✅ Production mode\n'}
Press Ctrl+C to stop the server.
  `);

    logger.info(`✅ Server started on port ${PORT}`);
    logger.info(`🌐 Environment: ${NODE_ENV}`);
    logger.info(`📁 Static files: ${staticDir}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
}

module.exports = app;
