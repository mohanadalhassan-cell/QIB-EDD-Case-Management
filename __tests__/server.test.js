/**
 * ============================================================================
 * EDD_QIB SYSTEM — API Test Suite
 * ============================================================================
 * Tests for all REST API endpoints including:
 *   - Authentication (login / logout)
 *   - Case management (CRUD)
 *   - Dynamic rule engine (CRUD)
 *   - User management (admin)
 *   - Risk assessment engine
 *   - System settings
 *   - Statistics and audit log
 * ============================================================================
 */

const request = require('supertest');
const app = require('../server');

// ============================================================================
// HELPERS
// ============================================================================
let adminToken = '';
let nonAdminToken = '';

const loginAs = async (username, password = 'any') => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ username, password });
  return res.body.token || '';
};

// ============================================================================
// SETUP
// ============================================================================
beforeAll(async () => {
  adminToken = await loginAs('admin.system');
  nonAdminToken = await loginAs('mohanad.hassan');
});

// ============================================================================
// HEALTH CHECK
// ============================================================================
describe('GET /api/v1/health', () => {
  it('returns HEALTHY status without authentication', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('HEALTHY');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('version');
    expect(res.body.dataStore).toHaveProperty('cases');
    expect(res.body.dataStore).toHaveProperty('users');
  });
});

// ============================================================================
// AUTHENTICATION
// ============================================================================
describe('POST /api/v1/auth/login', () => {
  it('authenticates admin user and returns a JWT token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin.system', password: 'admin' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('ADMIN');
  });

  it('returns 400 when username or password is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'admin.system' });
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('returns 401 for unknown username', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'nonexistent', password: 'pass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('POST /api/v1/auth/logout', () => {
  it('logs out an authenticated user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).post('/api/v1/auth/logout');
    expect(res.statusCode).toBe(401);
  });
});

// ============================================================================
// CASES
// ============================================================================
describe('GET /api/v1/cases', () => {
  it('returns list of cases for authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/cases')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(5);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).get('/api/v1/cases');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/v1/cases', () => {
  it('creates a new case with required fields', async () => {
    const res = await request(app)
      .post('/api/v1/cases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        customerId: 'CUST-TEST-001',
        customerName: 'Test Customer',
        riskRating: 'MEDIUM',
        caseType: 'EDD'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.customerName).toBe('Test Customer');
    expect(res.body.data.status).toBe('NEW');
  });

  it('returns 400 when customerName is missing', async () => {
    const res = await request(app)
      .post('/api/v1/cases')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nationalId: 'QA-000' });
    expect(res.statusCode).toBe(400);
  });
});

// ============================================================================
// DYNAMIC RISK RULES ENGINE
// ============================================================================
describe('GET /api/v1/rules', () => {
  it('returns seeded risk rules for any authenticated user', async () => {
    const res = await request(app)
      .get('/api/v1/rules')
      .set('Authorization', `Bearer ${nonAdminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.count).toBeGreaterThanOrEqual(5);
    expect(res.body.data[0]).toHaveProperty('name');
    expect(res.body.data[0]).toHaveProperty('condition');
    expect(res.body.data[0]).toHaveProperty('action');
    expect(res.body.data[0]).toHaveProperty('priority');
  });

  it('returns 401 without a token', async () => {
    const res = await request(app).get('/api/v1/rules');
    expect(res.statusCode).toBe(401);
  });
});

describe('POST /api/v1/rules', () => {
  let createdRuleId = '';

  it('creates a new rule when called by admin', async () => {
    const res = await request(app)
      .post('/api/v1/rules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'TEST-RULE: High Sanctions Exposure',
        description: 'Test rule for sanctions screening',
        condition: 'SANCTIONS_MATCH = TRUE',
        action: 'BLOCK_ACCOUNT; ALERT COMPLIANCE_TEAM',
        priority: 10,
        active: true
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe('TEST-RULE: High Sanctions Exposure');
    createdRuleId = res.body.data.id;
  });

  it('returns 403 when non-admin tries to create a rule', async () => {
    const res = await request(app)
      .post('/api/v1/rules')
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({ name: 'Illegal Rule', condition: 'X', action: 'Y' });
    expect(res.statusCode).toBe(403);
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/rules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Incomplete Rule' });
    expect(res.statusCode).toBe(400);
  });

  it('updates a rule by id', async () => {
    // Re-create the rule since each test gets a fresh data store
    const createRes = await request(app)
      .post('/api/v1/rules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'RULE-TO-UPDATE', condition: 'X=1', action: 'Y', priority: 99 });
    const ruleId = createRes.body.data.id;

    const res = await request(app)
      .put(`/api/v1/rules/${ruleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ active: false, priority: 88 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.active).toBe(false);
    expect(res.body.data.priority).toBe(88);
  });

  it('deletes a rule by id', async () => {
    const createRes = await request(app)
      .post('/api/v1/rules')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'RULE-TO-DELETE', condition: 'X=1', action: 'Y' });
    const ruleId = createRes.body.data.id;

    const delRes = await request(app)
      .delete(`/api/v1/rules/${ruleId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(delRes.statusCode).toBe(200);
    expect(delRes.body.status).toBe('SUCCESS');
  });

  it('returns 404 when deleting a non-existent rule', async () => {
    const res = await request(app)
      .delete('/api/v1/rules/nonexistent-id')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });
});

// ============================================================================
// RISK ASSESSMENT ENGINE
// ============================================================================
describe('POST /api/v1/risk/assess', () => {
  it('classifies Iran + money_changer as HIGH RISK', async () => {
    const res = await request(app)
      .post('/api/v1/risk/assess')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nationalityCode: 'IR',
        occupation: 'money_changer',
        transactionVolume: 500000,
        isPEP: false
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.riskCategory).toBe('HIGH');
    expect(res.body.data.eddRequired).toBe(true);
    expect(res.body.data.triggeredRules).toContain('HIGH_RISK_COUNTRY');
    expect(res.body.data.triggeredRules).toContain('HIGH_RISK_OCCUPATION');
  });

  it('classifies PEP regardless of country as HIGH RISK', async () => {
    const res = await request(app)
      .post('/api/v1/risk/assess')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nationalityCode: 'QA',
        occupation: 'government_official',
        isPEP: true
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.riskCategory).toBe('HIGH');
    expect(res.body.data.eddRequired).toBe(true);
    expect(res.body.data.triggeredRules).toContain('PEP_DETECTED');
  });

  it('classifies low-risk Qatari doctor as LOW RISK', async () => {
    const res = await request(app)
      .post('/api/v1/risk/assess')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nationalityCode: 'QA',
        occupation: 'doctor',
        transactionVolume: 50000,
        isPEP: false
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.riskCategory).toBe('LOW');
    expect(res.body.data.eddRequired).toBe(false);
  });

  it('returns 400 when no meaningful input is provided', async () => {
    const res = await request(app)
      .post('/api/v1/risk/assess')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app)
      .post('/api/v1/risk/assess')
      .send({ nationalityCode: 'QA' });
    expect(res.statusCode).toBe(401);
  });
});

// ============================================================================
// USER MANAGEMENT (Admin)
// ============================================================================
describe('GET /api/v1/users', () => {
  it('returns user list for admin', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.count).toBeGreaterThanOrEqual(3);
    // Passwords must not be exposed
    res.body.data.forEach(user => expect(user).not.toHaveProperty('password'));
  });

  it('returns 403 for non-admin', async () => {
    const res = await request(app)
      .get('/api/v1/users')
      .set('Authorization', `Bearer ${nonAdminToken}`);
    expect(res.statusCode).toBe(403);
  });
});

describe('POST /api/v1/users', () => {
  it('creates a new user as admin', async () => {
    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'new.testuser',
        password: 'secure123',
        fullName: 'New Test User',
        email: 'newtest@qib.com.qa',
        role: 'BUSINESS_MAKER',
        department: 'Retail Banking'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data.username).toBe('new.testuser');
    expect(res.body.data).not.toHaveProperty('password');
  });

  it('returns 409 on duplicate username', async () => {
    await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'dup.user', password: 'p', fullName: 'D', email: 'd@qib.com.qa', role: 'ADMIN' });

    const res = await request(app)
      .post('/api/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ username: 'dup.user', password: 'p', fullName: 'D', email: 'd@qib.com.qa', role: 'ADMIN' });
    expect(res.statusCode).toBe(409);
  });
});

// ============================================================================
// SYSTEM SETTINGS
// ============================================================================
describe('GET /api/v1/settings', () => {
  it('returns settings for admin', async () => {
    const res = await request(app)
      .get('/api/v1/settings')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('eddThreshold');
    expect(res.body.data).toHaveProperty('slaHours');
    expect(res.body.data).toHaveProperty('maxCasesPerOfficer');
  });

  it('returns 403 for non-admin', async () => {
    const res = await request(app)
      .get('/api/v1/settings')
      .set('Authorization', `Bearer ${nonAdminToken}`);
    expect(res.statusCode).toBe(403);
  });
});

describe('PUT /api/v1/settings', () => {
  it('updates allowed setting keys for admin', async () => {
    const res = await request(app)
      .put('/api/v1/settings')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ eddThreshold: 55, slaHours: 48 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.eddThreshold).toBe(55);
    expect(res.body.data.slaHours).toBe(48);
  });
});

// ============================================================================
// STATISTICS
// ============================================================================
describe('GET /api/v1/stats', () => {
  it('returns dashboard statistics', async () => {
    const res = await request(app)
      .get('/api/v1/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toHaveProperty('totalCases');
    expect(res.body.data).toHaveProperty('byRisk');
    expect(res.body.data.byRisk).toHaveProperty('HIGH');
  });
});

// ============================================================================
// AUDIT LOG
// ============================================================================
describe('GET /api/v1/audit', () => {
  it('returns audit log for admin', async () => {
    const res = await request(app)
      .get('/api/v1/audit')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('returns 403 for non-admin', async () => {
    const res = await request(app)
      .get('/api/v1/audit')
      .set('Authorization', `Bearer ${nonAdminToken}`);
    expect(res.statusCode).toBe(403);
  });
});
