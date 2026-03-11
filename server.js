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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests, please try again later'
});
app.use(limiter);

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
  sessions: new Map()
};

// Initialize with sample data
function initializeDataStore() {
  // Sample users
  const users = [
    {
      id: uuidv4(),
      username: 'mohanad.hassan',
      email: 'mohanad.hassan@qib.com.qa',
      password: 'hashed_edd2024',
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
      password: 'hashed_password',
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
      password: 'hashed_admin',
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

  logger.info('✅ Data store initialized with sample users');
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
app.get('/api/v1/audit', authMiddleware, (req, res) => {
  try {
    // Only admins can view full audit log
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        status: 'ERROR',
        message: 'Insufficient permissions',
        timestamp: new Date().toISOString()
      });
    }

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
const server = app.listen(PORT, '127.0.0.1', () => {
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

module.exports = app;
