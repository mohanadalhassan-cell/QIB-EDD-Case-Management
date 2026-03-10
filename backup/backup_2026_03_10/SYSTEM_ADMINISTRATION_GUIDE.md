# 📋 SYSTEM ADMINISTRATION GUIDE
## Retail Risk Governance Platform (RRGP) — Qatar Islamic Bank
### Version 1.0 | March 2026 | IT Operations Manual

---

## 📑 TABLE OF CONTENTS

1. [Purpose & Scope](#1-purpose--scope)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Infrastructure Components](#3-infrastructure-components)
4. [Installation & Setup](#4-installation--setup)
5. [Configuration Management](#5-configuration-management)
6. [User & Access Management](#6-user--access-management)
7. [Database Administration](#7-database-administration)
8. [Application Server Management](#8-application-server-management)
9. [Integration Management](#9-integration-management)
10. [Monitoring & Alerting](#10-monitoring--alerting)
11. [Backup & Recovery](#11-backup--recovery)
12. [Security Administration](#12-security-administration)
13. [Troubleshooting Guide](#13-troubleshooting-guide)
14. [Maintenance Procedures](#14-maintenance-procedures)
15. [Disaster Recovery](#15-disaster-recovery)
16. [Appendix: Configuration Reference](#16-appendix-configuration-reference)

---

# 1. PURPOSE & SCOPE

## 1.1 Purpose

This guide provides IT Administrators with comprehensive procedures for installing, configuring, maintaining, monitoring, and troubleshooting the Retail Risk Governance Platform (RRGP). This is the primary operational reference for all infrastructure and application support activities.

## 1.2 Scope

```
This guide covers:
✅ System installation and initial setup
✅ Configuration management (all components)
✅ User management and RBAC administration
✅ Database administration (PostgreSQL 14)
✅ Application server management (Node.js)
✅ External integration management (T24, DMS, etc.)
✅ Monitoring, alerting, and health checks
✅ Backup and recovery procedures
✅ Security administration
✅ Troubleshooting common issues
✅ Maintenance windows and patching
✅ Disaster recovery procedures

This guide does NOT cover:
❌ Business process decisions (see department guides)
❌ End-user procedures (see user manuals)
❌ Architecture decisions (see Enterprise Architecture Document)
❌ Development procedures (see Developer Guide)
```

## 1.3 Audience

```
PRIMARY:
├─ IT System Administrators
├─ Database Administrators (DBA)
├─ Network Engineers
├─ DevOps Engineers
└─ IT Security Officers

SECONDARY:
├─ Application Support Team
├─ IT Management
└─ Compliance IT Auditors
```

---

# 2. SYSTEM ARCHITECTURE OVERVIEW

## 2.1 Technology Stack

```
┌──────────────────────────────────────────────────────────┐
│ COMPONENT          │ TECHNOLOGY            │ VERSION     │
├────────────────────┼───────────────────────┼─────────────┤
│ Runtime            │ Node.js               │ 18 LTS      │
│ Framework          │ Express.js            │ 4.x         │
│ Database           │ PostgreSQL            │ 14          │
│ Cache              │ Redis                 │ 7.x         │
│ Real-time          │ WebSocket (ws)        │ 8.x         │
│ API Docs           │ Swagger / OpenAPI     │ 3.0         │
│ Email              │ Nodemailer            │ 6.x         │
│ SMS                │ Twilio SDK            │ 4.x         │
│ Push               │ Firebase Admin SDK    │ 12.x        │
│ Auth               │ JWT (jsonwebtoken)    │ 9.x         │
│ Logging            │ Winston               │ 3.x         │
│ Process Manager    │ PM2                   │ 5.x         │
│ Load Balancer      │ Nginx / HAProxy       │ Latest      │
│ OS                 │ Ubuntu Server         │ 22.04 LTS   │
└──────────────────────────────────────────────────────────┘
```

## 2.2 Server Topology

```
PRODUCTION ENVIRONMENT:
┌──────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER (Nginx)                      │
│                    IP: 10.10.1.10                             │
│                    Port: 443 (HTTPS)                          │
└──────────────────┬──────────────────────┬────────────────────┘
                   ↓                      ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│ APP SERVER 1             │  │ APP SERVER 2             │
│ IP: 10.10.1.11           │  │ IP: 10.10.1.12           │
│ Components:              │  │ Components:              │
│ ├─ Node.js (PM2)        │  │ ├─ Node.js (PM2)        │
│ ├─ WebSocket Server     │  │ ├─ WebSocket Server     │
│ └─ Redis (Cache)        │  │ └─ Redis (Cache)        │
│ Port: 3000 (API)        │  │ Port: 3000 (API)        │
│ Port: 8080 (WebSocket)  │  │ Port: 8080 (WebSocket)  │
└──────────────────────────┘  └──────────────────────────┘
                   ↓                      ↓
┌──────────────────────────────────────────────────────────────┐
│                 DATABASE CLUSTER                              │
│  ┌────────────────────────┐  ┌────────────────────────┐     │
│  │ DB PRIMARY             │  │ DB REPLICA             │     │
│  │ IP: 10.10.2.10         │  │ IP: 10.10.2.11         │     │
│  │ Port: 5432             │  │ Port: 5432             │     │
│  │ Role: Read-Write       │  │ Role: Read-Only        │     │
│  │ Storage: 500 GB SSD    │  │ Storage: 500 GB SSD    │     │
│  └────────────────────────┘  └────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘

SUPPORTING SERVICES:
├─ Redis Server: 10.10.3.10 (Port 6379)
├─ Log Server (ELK): 10.10.4.10 (Port 5601 Kibana)
├─ Monitoring (Grafana): 10.10.4.11 (Port 3001)
└─ Backup Server: 10.10.5.10 (NFS mount)
```

## 2.3 Network Architecture

```
NETWORK ZONES:
├─ DMZ (10.10.0.0/24) — Load balancer, API gateway
├─ Application Zone (10.10.1.0/24) — App servers
├─ Database Zone (10.10.2.0/24) — PostgreSQL cluster
├─ Support Zone (10.10.3.0/24) — Redis, cache
├─ Management Zone (10.10.4.0/24) — Monitoring, logging
└─ Backup Zone (10.10.5.0/24) — Backup storage

FIREWALL RULES:
├─ Internet → DMZ: 443 only (HTTPS)
├─ DMZ → App Zone: 3000, 8080
├─ App Zone → DB Zone: 5432
├─ App Zone → Support Zone: 6379
├─ Management Zone → All: Monitoring ports
├─ All → Log Server: 514 (Syslog), 5044 (Filebeat)
└─ External APIs: Outbound 443 (T24, DMS, Twilio, Firebase)
```

---

# 3. INFRASTRUCTURE COMPONENTS

## 3.1 Server Specifications (Minimum)

```
APPLICATION SERVERS (x2):
├─ CPU: 8 cores (Intel Xeon or equivalent)
├─ RAM: 32 GB
├─ Disk: 100 GB SSD (OS + App)
├─ Network: 1 Gbps
├─ OS: Ubuntu Server 22.04 LTS
└─ Notes: Stateless, horizontally scalable

DATABASE SERVERS (x2):
├─ CPU: 16 cores
├─ RAM: 64 GB
├─ Disk: 500 GB SSD (RAID 10)
├─ Disk (WAL): 100 GB SSD (separate disk)
├─ Network: 10 Gbps (cluster replication)
├─ OS: Ubuntu Server 22.04 LTS
└─ Notes: Primary-Replica, streaming replication

REDIS SERVER:
├─ CPU: 4 cores
├─ RAM: 16 GB
├─ Disk: 50 GB SSD
├─ Network: 1 Gbps
└─ Notes: Session cache, dashboard metrics

LOAD BALANCER:
├─ CPU: 4 cores
├─ RAM: 8 GB
├─ Disk: 50 GB SSD
├─ Network: 10 Gbps
└─ Notes: SSL termination, health checks

MONITORING & LOGGING:
├─ CPU: 8 cores
├─ RAM: 32 GB
├─ Disk: 500 GB SSD (log storage)
├─ Network: 1 Gbps
└─ Notes: ELK stack, Grafana, Prometheus
```

## 3.2 Software Dependencies

```
REQUIRED PACKAGES:
├─ Node.js 18.x LTS (via nvm)
├─ npm 9.x (bundled with Node)
├─ PostgreSQL 14.x
├─ Redis 7.x
├─ Nginx 1.24.x (load balancer)
├─ PM2 5.x (process manager)
├─ Git 2.x (deployment)
├─ OpenSSL 3.x (certificates)
├─ Certbot (Let's Encrypt / internal CA)
├─ Filebeat (log shipping)
└─ Node Exporter (Prometheus metrics)

NPM PACKAGES (key):
├─ express (HTTP framework)
├─ pg (PostgreSQL client)
├─ ws (WebSocket)
├─ jsonwebtoken (JWT auth)
├─ bcryptjs (password hashing)
├─ nodemailer (email)
├─ twilio (SMS)
├─ firebase-admin (push notifications)
├─ winston (logging)
├─ helmet (security headers)
├─ cors (CORS handling)
├─ express-rate-limit (rate limiting)
├─ ioredis (Redis client)
└─ dotenv (environment config)
```

---

# 4. INSTALLATION & SETUP

## 4.1 Initial Server Setup

```bash
# ─────────────────────────────────────────────────────
# APPLICATION SERVER SETUP (repeat for each app server)
# ─────────────────────────────────────────────────────

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 18
nvm alias default 18
node --version  # Should show v18.x.x

# 3. Install PM2 globally
npm install -g pm2

# 4. Install Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server

# 5. Create application user
sudo useradd -m -s /bin/bash rrgp
sudo usermod -aG sudo rrgp

# 6. Create application directory
sudo mkdir -p /opt/rrgp
sudo chown rrgp:rrgp /opt/rrgp

# 7. Clone application
cd /opt/rrgp
git clone https://github.com/qib-internal/rrgp.git app
cd app

# 8. Install dependencies
npm install --production

# 9. Create environment configuration
cp .env.example .env
# Edit .env with production values (see Section 5)

# 10. Test startup
node server.js
# Should show: "RRGP Server started on port 3000"
# Ctrl+C to stop

# 11. Configure PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 4.2 Database Setup

```bash
# ─────────────────────────────────────────────────────
# DATABASE SERVER SETUP (Primary)
# ─────────────────────────────────────────────────────

# 1. Install PostgreSQL 14
sudo apt install postgresql-14 -y

# 2. Configure PostgreSQL
sudo -u postgres psql

-- Create database
CREATE DATABASE rrgp_production;

-- Create application user
CREATE USER rrgp_app WITH ENCRYPTED PASSWORD '<SECURE_PASSWORD>';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE rrgp_production TO rrgp_app;

-- Configure connection settings
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '16GB';
ALTER SYSTEM SET effective_cache_size = '48GB';
ALTER SYSTEM SET work_mem = '256MB';
ALTER SYSTEM SET maintenance_work_mem = '2GB';
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET max_wal_senders = 3;

-- Restart PostgreSQL
\q

# 3. Run database migrations
cd /opt/rrgp/app
node scripts/migrate.js

# 4. Verify tables created
sudo -u postgres psql -d rrgp_production -c "\\dt"
# Should show 14+ tables

# 5. Create indexes
node scripts/create_indexes.js

# 6. Seed initial data (RBAC matrix, SLA rules)
node scripts/seed_production.js
```

## 4.3 Load Balancer Setup

```nginx
# ─────────────────────────────────────────────────────
# NGINX LOAD BALANCER CONFIGURATION
# /etc/nginx/sites-available/rrgp
# ─────────────────────────────────────────────────────

upstream rrgp_api {
    least_conn;
    server 10.10.1.11:3000 weight=1;
    server 10.10.1.12:3000 weight=1;
}

upstream rrgp_websocket {
    ip_hash;
    server 10.10.1.11:8080;
    server 10.10.1.12:8080;
}

server {
    listen 443 ssl http2;
    server_name rrgp.qib.com.qa;

    ssl_certificate /etc/ssl/certs/rrgp.qib.com.qa.crt;
    ssl_certificate_key /etc/ssl/private/rrgp.qib.com.qa.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000";

    # API requests
    location /api/ {
        proxy_pass http://rrgp_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_connect_timeout 10s;
    }

    # WebSocket connections
    location /ws/ {
        proxy_pass http://rrgp_websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }

    # Static files
    location / {
        root /opt/rrgp/app/public;
        try_files $uri $uri/ /index.html;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    location /api/v1/kyc/submit {
        limit_req zone=api burst=20;
        proxy_pass http://rrgp_api;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name rrgp.qib.com.qa;
    return 301 https://$server_name$request_uri;
}
```

## 4.4 PM2 Ecosystem Configuration

```javascript
// ─────────────────────────────────────────────────────
// ecosystem.config.js
// ─────────────────────────────────────────────────────

module.exports = {
  apps: [
    {
      name: 'rrgp-api',
      script: './server.js',
      instances: 4,                // 4 worker processes
      exec_mode: 'cluster',        // Cluster mode for multi-core
      max_memory_restart: '1G',    // Restart at 1GB memory
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/rrgp/api-error.log',
      out_file: '/var/log/rrgp/api-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'rrgp-websocket',
      script: './websocket_server.js',
      instances: 1,                 // Single WebSocket instance
      exec_mode: 'fork',
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        WS_PORT: 8080
      },
      error_file: '/var/log/rrgp/ws-error.log',
      out_file: '/var/log/rrgp/ws-out.log'
    },
    {
      name: 'rrgp-sla-engine',
      script: './jobs/sla_checker.js',
      cron_restart: '*/5 * * * *', // Every 5 minutes
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/rrgp/sla-error.log',
      out_file: '/var/log/rrgp/sla-out.log'
    },
    {
      name: 'rrgp-notification-worker',
      script: './jobs/notification_worker.js',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/rrgp/notif-error.log',
      out_file: '/var/log/rrgp/notif-out.log'
    }
  ]
};
```

---

# 5. CONFIGURATION MANAGEMENT

## 5.1 Environment Variables

```bash
# ─────────────────────────────────────────────────────
# .env (Production Configuration)
# ─────────────────────────────────────────────────────

# ── Application ──
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
APP_NAME=RRGP
APP_VERSION=1.0.0
LOG_LEVEL=info

# ── Database ──
DB_HOST=10.10.2.10
DB_PORT=5432
DB_NAME=rrgp_production
DB_USER=rrgp_app
DB_PASSWORD=<ENCRYPTED_PASSWORD>
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000

# ── Database Replica (read-only queries) ──
DB_REPLICA_HOST=10.10.2.11
DB_REPLICA_PORT=5432

# ── Redis ──
REDIS_HOST=10.10.3.10
REDIS_PORT=6379
REDIS_PASSWORD=<ENCRYPTED_PASSWORD>
REDIS_DB=0

# ── JWT Authentication ──
JWT_SECRET=<ENCRYPTED_SECRET_KEY>
JWT_EXPIRY=3600
JWT_REFRESH_EXPIRY=86400
JWT_ALGORITHM=HS256

# ── WebSocket ──
WS_PORT=8080
WS_HEARTBEAT_INTERVAL=30000

# ── Email (Nodemailer) ──
SMTP_HOST=mail.qib.com.qa
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=rrgp-notify@qib.com.qa
SMTP_PASSWORD=<ENCRYPTED_PASSWORD>
SMTP_FROM=noreply@qib.com.qa

# ── SMS (Twilio) ──
TWILIO_ACCOUNT_SID=<ENCRYPTED_SID>
TWILIO_AUTH_TOKEN=<ENCRYPTED_TOKEN>
TWILIO_PHONE_NUMBER=+974XXXXXXXX

# ── Push Notifications (Firebase) ──
FIREBASE_PROJECT_ID=qib-rrgp-production
FIREBASE_SERVICE_ACCOUNT=/opt/rrgp/config/firebase-sa.json

# ── External Integrations ──
T24_API_URL=https://t24-api.qib.internal/v1
T24_API_KEY=<ENCRYPTED_KEY>
T24_TIMEOUT=30000

CRP_API_URL=https://crp-api.qib.internal/v1
CRP_API_KEY=<ENCRYPTED_KEY>

DMS_API_URL=https://dms-api.qib.internal/v1
DMS_API_KEY=<ENCRYPTED_KEY>

QCB_API_URL=https://qcb-verify.qib.internal/v1
QCB_API_KEY=<ENCRYPTED_KEY>

# ── SLA Configuration ──
SLA_BUSINESS_REVIEW_HOURS=24
SLA_CDD_REVIEW_HOURS=24
SLA_CDD_DEEPDIVE_HOURS=48
SLA_COMPLIANCE_REVIEW_HOURS=24
SLA_DECISION_HOURS=8
SLA_CUSTOMER_ACTION_DAYS=7
SLA_CHECK_INTERVAL_MINUTES=5

# ── Risk Engine ──
RISK_EDD_THRESHOLD=60
RISK_MAX_SCORE=240

# ── Security ──
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ALLOWED_ORIGINS=https://rrgp.qib.com.qa
HELMET_ENABLED=true

# ── Encryption ──
ENCRYPTION_KEY=<ENCRYPTED_KEY>
ENCRYPTION_ALGORITHM=aes-256-gcm
```

## 5.2 System Configuration Table

```
RRGP stores runtime configuration in the system_configuration table:

┌──────────────────────────┬──────────────┬─────────────────────────┐
│ config_key               │ config_value │ description             │
├──────────────────────────┼──────────────┼─────────────────────────┤
│ risk.edd_threshold       │ 60           │ EDD trigger score       │
│ risk.max_score           │ 240          │ Maximum risk score      │
│ sla.business_hours       │ 24           │ Business stage SLA      │
│ sla.cdd_hours            │ 24           │ CDD stage SLA           │
│ sla.cdd_deepdive_hours   │ 48           │ CDD deep-dive SLA      │
│ sla.compliance_hours     │ 24           │ Compliance stage SLA    │
│ sla.decision_hours       │ 8            │ Decision stage SLA      │
│ sla.customer_action_days │ 7            │ Customer response SLA   │
│ notification.email_on    │ true         │ Enable email notifs     │
│ notification.sms_on      │ true         │ Enable SMS notifs       │
│ notification.push_on     │ true         │ Enable push notifs      │
│ notification.ws_on       │ true         │ Enable WebSocket        │
│ auto_reject_on_sla       │ true         │ Auto-reject expired     │
│ maker_checker_enabled    │ true         │ Enforce Maker/Checker   │
│ max_rework_cycles        │ 3            │ Max Checker reworks     │
│ workload_balance_enabled │ true         │ Auto workload balance   │
│ workload_balance_interval│ 3600         │ Balance interval (sec)  │
│ maintenance_mode         │ false        │ System maintenance flag │
│ audit_retention_years    │ 7            │ Audit log retention     │
└──────────────────────────┴──────────────┴─────────────────────────┘

TO UPDATE CONFIGURATION:
UPDATE system_configuration SET config_value = 'new_value',
  updated_at = NOW() WHERE config_key = 'key_name';

IMPORTANT: Configuration changes take effect after application restart
or within 5 minutes (config polling interval).
```

---

# 6. USER & ACCESS MANAGEMENT

## 6.1 User Creation

```sql
-- Create a new user in RRGP system
INSERT INTO users (
  user_id, employee_id, full_name, email, department,
  role, segment, is_active, password_hash, created_at
) VALUES (
  'user_' || gen_random_uuid(),
  'EMP-XXXXX',
  'Full Name',
  'name@qib.com.qa',
  'CDD_OPERATIONS',
  'CDD_OFFICER',
  'MASS',
  true,
  crypt('temporary_password', gen_salt('bf', 12)),
  NOW()
);

-- User must change password on first login
UPDATE users SET must_change_password = true
  WHERE employee_id = 'EMP-XXXXX';
```

## 6.2 RBAC Role Assignment

```
AVAILABLE ROLES:
├─ RELATIONSHIP_MANAGER    — RM / Branch Officer
├─ BRANCH_OFFICER          — Branch Officer
├─ BUSINESS_ANALYST        — Business Team
├─ CDD_OFFICER             — CDD Operations (Maker)
├─ CDD_CHECKER             — CDD Operations (Checker/Senior)
├─ CDD_MANAGER             — CDD Operations Manager
├─ COMPLIANCE_OFFICER      — Compliance (Maker)
├─ COMPLIANCE_MANAGER      — Compliance (Checker)
├─ COMPLIANCE_HEAD         — Compliance Head
├─ APPROVER                — Final Approver (Manager/Director)
├─ OPERATIONS              — Operations Monitor
├─ CONTACT_CENTER_AGENT    — Call Center
├─ AUDITOR                 — Compliance Auditor
└─ SYSTEM_ADMIN            — IT Administrator

ROLE ASSIGNMENT:
-- Assign a role to a user
INSERT INTO user_roles (user_id, role_name, granted_at, granted_by)
VALUES ('user_xxx', 'CDD_OFFICER', NOW(), 'admin_user_id');

-- Revoke a role
UPDATE user_roles SET revoked_at = NOW(), revoked_by = 'admin_user_id'
  WHERE user_id = 'user_xxx' AND role_name = 'CDD_OFFICER';

-- View user's current roles
SELECT ur.role_name, ur.granted_at, u2.full_name as granted_by
FROM user_roles ur
JOIN users u2 ON ur.granted_by = u2.user_id
WHERE ur.user_id = 'user_xxx' AND ur.revoked_at IS NULL;
```

## 6.3 User Deactivation

```sql
-- Deactivate a user (do NOT delete — audit trail requirement)
UPDATE users SET
  is_active = false,
  deactivated_at = NOW(),
  deactivated_by = 'admin_user_id',
  deactivation_reason = 'Employee left QIB'
WHERE employee_id = 'EMP-XXXXX';

-- Reassign active cases from deactivated user
UPDATE workflow_queue SET
  assigned_user = NULL,
  queue_status = 'PENDING',
  reassigned_at = NOW(),
  reassignment_reason = 'User deactivated'
WHERE assigned_user = 'deactivated_user_id'
  AND queue_status IN ('PENDING', 'IN_PROGRESS');

-- IMPORTANT: Never DELETE user records. Deactivate only.
-- User data must be retained for audit trail compliance (7 years).
```

## 6.4 Password Policy

```
PASSWORD REQUIREMENTS:
├─ Minimum 12 characters
├─ At least 1 uppercase letter
├─ At least 1 lowercase letter
├─ At least 1 number
├─ At least 1 special character (!@#$%^&*)
├─ Cannot reuse last 5 passwords
├─ Expires every 90 days
├─ Locked after 5 failed attempts (30-minute lockout)
└─ MFA required for all users

PASSWORD RESET (by admin):
UPDATE users SET
  password_hash = crypt('new_temporary_password', gen_salt('bf', 12)),
  must_change_password = true,
  password_updated_at = NOW()
WHERE employee_id = 'EMP-XXXXX';

ACCOUNT UNLOCK (after lockout):
UPDATE users SET
  failed_login_attempts = 0,
  locked_until = NULL
WHERE employee_id = 'EMP-XXXXX';
```

---

# 7. DATABASE ADMINISTRATION

## 7.1 Database Health Checks

```sql
-- Daily health check queries:

-- 1. Check database size
SELECT pg_size_pretty(pg_database_size('rrgp_production'));

-- 2. Check table sizes
SELECT
  schemaname || '.' || tablename AS table_name,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname || '.' || tablename)) AS data_size,
  pg_size_pretty(pg_indexes_size(schemaname || '.' || tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;

-- 3. Check active connections
SELECT count(*) as active_connections,
  max_conn as max_connections,
  count(*) * 100 / max_conn as percent_used
FROM pg_stat_activity
CROSS JOIN (SELECT setting::int AS max_conn FROM pg_settings
  WHERE name = 'max_connections') mc
WHERE state IS NOT NULL;

-- 4. Check long-running queries (> 5 minutes)
SELECT pid, age(clock_timestamp(), query_start), usename, query, state
FROM pg_stat_activity
WHERE state != 'idle'
  AND query NOT ILIKE '%pg_stat_activity%'
  AND age(clock_timestamp(), query_start) > interval '5 minutes'
ORDER BY query_start;

-- 5. Check replication lag (on replica)
SELECT
  CASE WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn()
    THEN 0
    ELSE EXTRACT(EPOCH FROM NOW() - pg_last_xact_replay_timestamp())
  END AS replication_lag_seconds;

-- 6. Check table bloat (vacuum needed?)
SELECT
  schemaname, tablename,
  n_dead_tup AS dead_tuples,
  n_live_tup AS live_tuples,
  round(n_dead_tup::numeric / NULLIF(n_live_tup, 0) * 100, 2) AS dead_percent,
  last_vacuum, last_autovacuum
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC
LIMIT 20;

-- 7. Check index usage
SELECT
  schemaname, tablename, indexname,
  idx_scan AS times_used,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC
LIMIT 20;
```

## 7.2 Performance Tuning

```
POSTGRESQL.CONF OPTIMIZATIONS:

# ── Memory ──
shared_buffers = 16GB              # 25% of RAM
effective_cache_size = 48GB        # 75% of RAM
work_mem = 256MB                   # Per-sort memory
maintenance_work_mem = 2GB         # For VACUUM, CREATE INDEX

# ── WAL & Replication ──
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB
synchronous_commit = on
checkpoint_completion_target = 0.9
max_wal_size = 4GB
min_wal_size = 1GB

# ── Query Planner ──
random_page_cost = 1.1             # SSD optimization
effective_io_concurrency = 200     # SSD optimization
default_statistics_target = 200

# ── Connections ──
max_connections = 200
idle_in_transaction_session_timeout = 300000  # 5 minutes

# ── Logging ──
log_min_duration_statement = 1000  # Log queries > 1 second
log_line_prefix = '%t [%p] %u@%d '
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0

# ── Autovacuum ──
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 60
autovacuum_vacuum_threshold = 50
autovacuum_analyze_threshold = 50
```

## 7.3 Event Store Maintenance

```sql
-- The edd_case_events table is IMMUTABLE. Never DELETE records.
-- Only maintenance operations allowed:

-- 1. Partition table by month (for performance)
CREATE TABLE edd_case_events_2026_03 PARTITION OF edd_case_events
  FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- 2. Archive old events (> 2 years) to cold storage
-- Export to CSV, then move to archive schema
COPY (SELECT * FROM edd_case_events
  WHERE created_at < '2024-03-01')
TO '/backup/archive/events_before_2024_03.csv' CSV HEADER;

-- Move to archive schema (NOT delete)
INSERT INTO archive.edd_case_events
SELECT * FROM public.edd_case_events
WHERE created_at < '2024-03-01';

-- CRITICAL: event_store records must be retained for 7 YEARS
-- per QCB regulation. Never delete before retention period.
```

---

# 8. APPLICATION SERVER MANAGEMENT

## 8.1 PM2 Operations

```bash
# ── Process Management ──
pm2 list                        # List all processes
pm2 status                      # Detailed status
pm2 show rrgp-api               # Show specific process details
pm2 restart rrgp-api            # Restart API (zero-downtime in cluster)
pm2 reload rrgp-api             # Graceful reload (preferred)
pm2 stop rrgp-api               # Stop API
pm2 delete rrgp-api             # Remove from PM2

# ── Monitoring ──
pm2 monit                       # Real-time monitoring
pm2 logs                        # Stream all logs
pm2 logs rrgp-api --lines 100   # Last 100 lines of API logs
pm2 logs rrgp-api --err         # Error logs only

# ── Deployment ──
pm2 deploy production           # Deploy to production
pm2 deploy production revert 1  # Rollback

# ── Health Check ──
pm2 ping rrgp-api               # Check process health

# ── Scaling ──
pm2 scale rrgp-api +2           # Add 2 more instances
pm2 scale rrgp-api 6            # Set exact 6 instances
```

## 8.2 Application Updates (Zero-Downtime)

```bash
# ─────────────────────────────────────────────────────
# APPLICATION UPDATE PROCEDURE
# ─────────────────────────────────────────────────────

# 1. Pre-update checks
pm2 list                    # All processes running
pm2 status                  # No errors
curl -s https://rrgp.qib.com.qa/api/v1/health  # Health check OK

# 2. Pull latest code
cd /opt/rrgp/app
git fetch origin
git checkout release/v1.x.x

# 3. Install any new dependencies
npm install --production

# 4. Run database migrations (if any)
node scripts/migrate.js --dry-run  # Preview changes
node scripts/migrate.js            # Apply changes

# 5. Reload application (zero-downtime)
pm2 reload ecosystem.config.js

# 6. Post-update verification
pm2 list                    # All processes UP
curl -s https://rrgp.qib.com.qa/api/v1/health  # Health check OK
pm2 logs --lines 20         # Check for errors

# 7. If issues detected, rollback:
git checkout release/v1.x-1.x
npm install --production
pm2 reload ecosystem.config.js
# Revert migration if needed:
node scripts/migrate.js --rollback
```

## 8.3 Log Management

```
LOG FILES LOCATION:
├─ /var/log/rrgp/api-out.log         — API stdout logs
├─ /var/log/rrgp/api-error.log       — API error logs
├─ /var/log/rrgp/ws-out.log          — WebSocket logs
├─ /var/log/rrgp/ws-error.log        — WebSocket errors
├─ /var/log/rrgp/sla-out.log         — SLA engine logs
├─ /var/log/rrgp/notif-out.log       — Notification worker logs
├─ /var/log/rrgp/application.log     — Winston structured logs
└─ /var/log/rrgp/audit.log           — Audit-specific events

LOG ROTATION (logrotate):
/var/log/rrgp/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0640 rrgp rrgp
    postrotate
        pm2 reloadLogs
    endscript
}

LOG LEVELS:
├─ ERROR — System errors, exceptions
├─ WARN — Warnings, SLA approaching
├─ INFO — Normal operations, case events
├─ DEBUG — Detailed debugging (not in production)
└─ AUDIT — Immutable audit actions
```

---

# 9. INTEGRATION MANAGEMENT

## 9.1 External System Health Checks

```bash
# ─────────────────────────────────────────────────────
# Run integration health checks (schedule daily)
# ─────────────────────────────────────────────────────

# T24 Core Banking
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $T24_API_KEY" \
  "$T24_API_URL/health"
# Expected: 200

# CRP
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $CRP_API_KEY" \
  "$CRP_API_URL/health"
# Expected: 200

# DMS
curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $DMS_API_KEY" \
  "$DMS_API_URL/health"
# Expected: 200

# Twilio (SMS)
curl -s -o /dev/null -w "%{http_code}" \
  -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
  "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID.json"
# Expected: 200

# SMTP (Email)
echo "Health Check" | mail -s "RRGP Health Check" rrgp-test@qib.com.qa
# Check delivery
```

## 9.2 Integration Error Handling

```
IF T24 IS UNAVAILABLE:
├─ Queue account creation requests
├─ Retry every 30 minutes (max 24 hours)
├─ Alert operations team after 3 failures
├─ Case status remains CLOSED_APPROVED (account creation pending)
└─ Log all retry attempts

IF DMS IS UNAVAILABLE:
├─ Document uploads queued locally (temp storage)
├─ Retry upload every 15 minutes
├─ Users notified: "Documents saved, syncing to DMS"
├─ Alert IT after 1 hour of outage
└─ Resume sync when DMS recovers

IF EMAIL/SMS SERVICE IS DOWN:
├─ Notifications queued in database
├─ Retry every 5 minutes
├─ Dashboard notifications still work (WebSocket)
├─ Alert operations after 30 minutes
└─ No business impact (dashboard still updates)

CIRCUIT BREAKER PATTERN:
├─ After 5 consecutive failures → OPEN circuit
├─ All requests fail-fast (no waiting)
├─ After 60 seconds → HALF-OPEN (test request)
├─ If test succeeds → CLOSE circuit (resume)
├─ If test fails → OPEN again for 120 seconds
└─ All circuit state changes logged
```

---

# 10. MONITORING & ALERTING

## 10.1 Key Metrics to Monitor

```
APPLICATION METRICS:
├─ API response time (p50, p95, p99)
├─ Request rate (requests/second)
├─ Error rate (4xx, 5xx per minute)
├─ Active WebSocket connections
├─ Queue depth (pending cases per stage)
├─ Notification delivery rate
├─ SLA compliance percentage
└─ Active user sessions

INFRASTRUCTURE METRICS:
├─ CPU utilization (per server)
├─ Memory usage (per server)
├─ Disk usage (per server, per mount)
├─ Network I/O (bandwidth, errors)
├─ Database connections (active/idle/max)
├─ Database replication lag (seconds)
├─ Redis memory usage
└─ Load balancer health

BUSINESS METRICS:
├─ Cases created today
├─ Cases completed today
├─ Average processing time
├─ SLA breaches (count per stage)
├─ High-risk cases in queue
├─ Pending customer responses
├─ Notification delivery success rate
└─ System uptime percentage
```

## 10.2 Alerting Thresholds

```
┌────────────────────────────────┬───────────┬────────────────────┐
│ Metric                         │ Threshold │ Action             │
├────────────────────────────────┼───────────┼────────────────────┤
│ API response time (p95)        │ > 2 sec   │ WARN → investigate │
│ API response time (p99)        │ > 5 sec   │ CRIT → immediate   │
│ Error rate (5xx)               │ > 1%      │ WARN → check logs  │
│ Error rate (5xx)               │ > 5%      │ CRIT → immediate   │
│ CPU usage                      │ > 70%     │ WARN → scale       │
│ CPU usage                      │ > 90%     │ CRIT → immediate   │
│ Memory usage                   │ > 80%     │ WARN → investigate │
│ Memory usage                   │ > 95%     │ CRIT → immediate   │
│ Disk usage                     │ > 75%     │ WARN → plan        │
│ Disk usage                     │ > 90%     │ CRIT → immediate   │
│ DB connections                 │ > 80%     │ WARN → check pools │
│ DB replication lag             │ > 10 sec  │ WARN → check       │
│ DB replication lag             │ > 60 sec  │ CRIT → failover?   │
│ WebSocket connections          │ > 90%     │ WARN → check       │
│ Redis memory                   │ > 80%     │ WARN → eviction    │
│ PM2 process restarts           │ > 3/hour  │ CRIT → investigate │
│ External API failure rate      │ > 10%     │ WARN → check       │
│ SLA breach count (daily)       │ > 5       │ WARN → ops team    │
│ Zero active processes          │ any server│ CRIT → immediate   │
└────────────────────────────────┴───────────┴────────────────────┘
```

## 10.3 Health Check Endpoint

```
API HEALTH CHECK:
GET /api/v1/health

Response (200 OK):
{
  "status": "healthy",
  "timestamp": "2026-03-10T09:00:00Z",
  "version": "1.0.0",
  "uptime": "72 hours",
  "components": {
    "database": { "status": "up", "latency_ms": 5 },
    "redis": { "status": "up", "latency_ms": 1 },
    "websocket": { "status": "up", "connections": 32 },
    "email": { "status": "up" },
    "sms": { "status": "up" },
    "t24": { "status": "up", "latency_ms": 120 },
    "dms": { "status": "up", "latency_ms": 85 }
  },
  "metrics": {
    "active_cases": 156,
    "pending_notifications": 3,
    "sla_compliance": 98.5
  }
}

AUTOMATED HEALTH CHECK (every 60 seconds):
*/1 * * * * curl -sf https://rrgp.qib.com.qa/api/v1/health || \
  /opt/rrgp/scripts/alert.sh "HEALTH CHECK FAILED"
```

---

# 11. BACKUP & RECOVERY

## 11.1 Backup Strategy

```
BACKUP SCHEDULE:
├─ Full database backup: Daily at 02:00 AM
├─ WAL archiving: Continuous (point-in-time recovery)
├─ Application config: Daily at 01:00 AM
├─ Document storage (DMS): Separate DMS backup schedule
├─ Redis snapshot: Every 6 hours
└─ Log backup: Daily rotation + archive

RETENTION:
├─ Daily backups: 30 days
├─ Weekly backups: 12 weeks
├─ Monthly backups: 12 months
├─ Annual backups: 7 years (compliance)
├─ WAL archives: 7 days
└─ Event store: NEVER deleted (immutable, 7-year retention)

BACKUP STORAGE:
├─ Primary: NFS mount (10.10.5.10:/backup/rrgp)
├─ Secondary: Tape backup (weekly)
├─ Tertiary: Cloud storage (encrypted, monthly)
└─ All backups: AES-256 encrypted
```

## 11.2 Backup Procedures

```bash
# ─────────────────────────────────────────────────────
# DAILY DATABASE BACKUP (cron job)
# ─────────────────────────────────────────────────────

#!/bin/bash
# /opt/rrgp/scripts/backup_database.sh

BACKUP_DIR="/backup/rrgp/database"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/rrgp_production_$DATE.sql.gz"

# Create backup
pg_dump -h 10.10.2.10 -U rrgp_backup -d rrgp_production \
  --format=custom --compress=9 \
  --file="$BACKUP_FILE"

# Verify backup
pg_restore --list "$BACKUP_FILE" > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "Backup successful: $BACKUP_FILE"
  # Encrypt backup
  gpg --encrypt --recipient backup@qib.com.qa "$BACKUP_FILE"
  # Remove unencrypted version
  rm "$BACKUP_FILE"
  # Clean old backups (> 30 days)
  find "$BACKUP_DIR" -name "*.gpg" -mtime +30 -delete
else
  echo "BACKUP FAILED!" | mail -s "RRGP Backup Failure" it-alerts@qib.com.qa
  exit 1
fi

# ─────────────────────────────────────────────────────
# APPLICATION CONFIG BACKUP
# ─────────────────────────────────────────────────────

#!/bin/bash
# /opt/rrgp/scripts/backup_config.sh

BACKUP_DIR="/backup/rrgp/config"
DATE=$(date +%Y%m%d)

tar czf "$BACKUP_DIR/rrgp_config_$DATE.tar.gz" \
  /opt/rrgp/app/.env \
  /opt/rrgp/app/ecosystem.config.js \
  /etc/nginx/sites-available/rrgp \
  /etc/postgresql/14/main/postgresql.conf \
  /opt/rrgp/config/
```

## 11.3 Recovery Procedures

```bash
# ─────────────────────────────────────────────────────
# DATABASE RECOVERY (full restore)
# ─────────────────────────────────────────────────────

# 1. Stop application servers
ssh 10.10.1.11 "pm2 stop all"
ssh 10.10.1.12 "pm2 stop all"

# 2. Decrypt backup
gpg --decrypt rrgp_production_20260310.sql.gz.gpg > rrgp_production_20260310.sql.gz

# 3. Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE rrgp_production;"
sudo -u postgres psql -c "CREATE DATABASE rrgp_production OWNER rrgp_app;"

# 4. Restore from backup
pg_restore -h 10.10.2.10 -U rrgp_app -d rrgp_production \
  --clean --if-exists rrgp_production_20260310.sql.gz

# 5. Verify restore
sudo -u postgres psql -d rrgp_production -c "SELECT count(*) FROM edd_cases;"

# 6. Restart application servers
ssh 10.10.1.11 "pm2 start all"
ssh 10.10.1.12 "pm2 start all"

# 7. Verify application
curl -s https://rrgp.qib.com.qa/api/v1/health

# ─────────────────────────────────────────────────────
# POINT-IN-TIME RECOVERY (to specific timestamp)
# ─────────────────────────────────────────────────────

# 1. Stop PostgreSQL
sudo systemctl stop postgresql

# 2. Restore base backup
# 3. Configure recovery.conf
recovery_target_time = '2026-03-10 14:30:00'
restore_command = 'cp /backup/rrgp/wal/%f %p'

# 4. Start PostgreSQL (recovery mode)
sudo systemctl start postgresql
# PostgreSQL will replay WAL logs up to target time
```

---

# 12. SECURITY ADMINISTRATION

## 12.1 SSL/TLS Certificate Management

```
CERTIFICATE LOCATIONS:
├─ /etc/ssl/certs/rrgp.qib.com.qa.crt          — Server certificate
├─ /etc/ssl/private/rrgp.qib.com.qa.key         — Private key
├─ /etc/ssl/certs/qib-ca-chain.crt              — CA chain
└─ /etc/ssl/certs/qib-root-ca.crt               — Root CA

CERTIFICATE RENEWAL (90 days before expiry):
1. Generate CSR
2. Submit to QIB CA Team
3. Receive new certificate
4. Replace files in /etc/ssl/
5. Reload Nginx: sudo nginx -s reload
6. Verify: openssl s_client -connect rrgp.qib.com.qa:443

CERTIFICATE MONITORING:
# Check certificate expiry
openssl x509 -enddate -noout -in /etc/ssl/certs/rrgp.qib.com.qa.crt
# Alert 30 days before expiry
```

## 12.2 Encryption Key Management

```
ENCRYPTION KEYS:
├─ JWT_SECRET — Signs authentication tokens
│  ├─ Rotation: Every 90 days
│  ├─ Storage: HashiCorp Vault / AWS KMS
│  └─ Fallback: Environment variable (encrypted)
│
├─ ENCRYPTION_KEY — Encrypts PII fields in database
│  ├─ Rotation: Every 180 days
│  ├─ Algorithm: AES-256-GCM
│  ├─ Key derivation: PBKDF2 with random salt
│  └─ Re-encryption job required on rotation
│
├─ DB_PASSWORD — Database access
│  ├─ Rotation: Every 90 days
│  ├─ Update in: .env + connection strings
│  └─ Restart required: Yes
│
└─ API_KEYS — External integrations (T24, DMS, etc.)
   ├─ Rotation: Per integration partner agreement
   ├─ Update in: .env
   └─ Restart required: Yes (or config reload)

KEY ROTATION PROCEDURE:
1. Generate new key
2. Update in secret management system (Vault)
3. Update .env on all app servers
4. Reload applications: pm2 reload all
5. Verify: No authentication errors in logs
6. Revoke old key after 24 hours grace period
```

## 12.3 Security Audit Checklist (Monthly)

```
MONTHLY SECURITY REVIEW:
□ All SSL certificates valid (> 30 days to expiry)
□ No unauthorized users in RBAC matrix
□ All deactivated users still deactivated
□ Password policy enforced (check for non-compliant accounts)
□ Failed login attempts reviewed (check for brute force)
□ API rate limiting functioning
□ Firewall rules reviewed (no unauthorized changes)
□ No open ports beyond approved list
□ Log files reviewed for security events
□ Encryption keys not expired
□ Database access logs reviewed
□ Backup encryption verified
□ Vulnerability scan completed
□ No outdated dependencies (npm audit)
□ Security patches applied
```

## 12.4 Incident Response

```
SECURITY INCIDENT RESPONSE:

SEVERITY 1 — DATA BREACH / UNAUTHORIZED ACCESS:
├─ Step 1: ISOLATE — Disable affected user/IP immediately
├─ Step 2: CONTAIN — Block network access if needed
├─ Step 3: PRESERVE — Capture logs before rotation
├─ Step 4: NOTIFY — IT Security + Compliance + Management
├─ Step 5: INVESTIGATE — Full audit trail review
├─ Step 6: REMEDIATE — Fix vulnerability
├─ Step 7: REPORT — QCB notification if customer data affected
└─ Step 8: REVIEW — Post-incident review + policy update

SEVERITY 2 — SUSPICIOUS ACTIVITY:
├─ Step 1: INVESTIGATE — Review logs and access patterns
├─ Step 2: ASSESS — Determine if legitimate or threat
├─ Step 3: MITIGATE — Block if threat confirmed
├─ Step 4: DOCUMENT — Log findings in incident register
└─ Step 5: MONITOR — Enhanced monitoring for 30 days

SEVERITY 3 — POLICY VIOLATION:
├─ Step 1: DOCUMENT — Record violation details
├─ Step 2: REMEDIATE — Correct the violation
├─ Step 3: NOTIFY — Inform HR/Management if staff-related
└─ Step 4: REVIEW — Update policy if gap identified

CONTACTS:
├─ IT Security Lead: [Name / Ext]
├─ CISO: [Name / Ext]
├─ Compliance Head: [Name / Ext]
├─ QCB Security Hotline: [Number]
└─ External Forensics: [Vendor / Contact]
```

---

# 13. TROUBLESHOOTING GUIDE

## 13.1 Application Issues

```
PROBLEM: API returns 502 Bad Gateway
├─ CHECK: pm2 list → Are all processes 'online'?
├─ CHECK: pm2 logs rrgp-api --err --lines 50
├─ CHECK: Nginx upstream servers reachable
├─ FIX: pm2 restart rrgp-api
├─ FIX: Check .env configuration
└─ ESCALATE: If persists after restart → check server resources

PROBLEM: Slow API responses (> 2 seconds)
├─ CHECK: Database connections → SELECT count(*) FROM pg_stat_activity
├─ CHECK: Long-running queries → See Section 7.1, query #4
├─ CHECK: CPU/Memory on app servers
├─ CHECK: Redis connection (cache miss?)
├─ FIX: Kill long-running queries → SELECT pg_terminate_backend(pid)
├─ FIX: Scale app instances → pm2 scale rrgp-api +2
└─ FIX: Run VACUUM ANALYZE on busy tables

PROBLEM: WebSocket connections dropping
├─ CHECK: pm2 show rrgp-websocket (is it running?)
├─ CHECK: Nginx WebSocket proxy configuration
├─ CHECK: WS_HEARTBEAT_INTERVAL setting
├─ FIX: Ensure Nginx proxy_read_timeout is > heartbeat
├─ FIX: Restart WebSocket server → pm2 restart rrgp-websocket
└─ FIX: Check load balancer sticky sessions for WS

PROBLEM: Notifications not sending
├─ CHECK: pm2 logs rrgp-notification-worker --err
├─ CHECK: SMTP connectivity → telnet $SMTP_HOST $SMTP_PORT
├─ CHECK: Twilio balance and status
├─ CHECK: Firebase credentials valid
├─ FIX: Restart notification worker → pm2 restart rrgp-notification-worker
├─ FIX: Check notification queue → SELECT count(*) FROM notifications WHERE status='PENDING'
└─ FIX: Process stuck notifications manually

PROBLEM: SLA engine not escalating
├─ CHECK: pm2 show rrgp-sla-engine (is it running?)
├─ CHECK: pm2 logs rrgp-sla-engine --lines 50
├─ CHECK: Cron schedule in ecosystem.config.js
├─ FIX: Restart SLA engine → pm2 restart rrgp-sla-engine
├─ FIX: Run manual check: node jobs/sla_checker.js --run-once
└─ FIX: Check sla_escalation_rules table for valid rules
```

## 13.2 Database Issues

```
PROBLEM: "Too many connections" error
├─ CHECK: SELECT count(*) FROM pg_stat_activity
├─ CHECK: DB_POOL_MAX in .env (should be 20 per app server)
├─ CHECK: For leaked connections (idle in transaction > 5 min)
├─ FIX: Kill idle connections:
│  SELECT pg_terminate_backend(pid) FROM pg_stat_activity
│  WHERE state = 'idle in transaction'
│  AND state_change < NOW() - interval '10 minutes';
├─ FIX: Increase max_connections (temporary)
└─ PERMANENT: Review connection pooling settings

PROBLEM: Database running out of disk space
├─ CHECK: df -h (check disk usage)
├─ CHECK: Top 10 largest tables (Section 7.1, query #2)
├─ FIX: Run VACUUM FULL on bloated tables (requires downtime)
├─ FIX: Archive old events to cold storage
├─ FIX: Truncate log tables if applicable
├─ FIX: Expand disk (SAN/cloud)
└─ PREVENT: Set disk alerts at 75% threshold

PROBLEM: Replication lag > 60 seconds
├─ CHECK: Network between primary and replica
├─ CHECK: Replica server load (CPU, I/O)
├─ CHECK: WAL files pending on primary
├─ FIX: Restart replication
├─ FIX: Check max_wal_senders and wal_keep_size
└─ ESCALATE: If lag > 5 minutes → consider failover

PROBLEM: Slow queries
├─ CHECK: EXPLAIN ANALYZE on slow query
├─ CHECK: Index usage (Section 7.1, query #7)
├─ FIX: Add missing indexes
├─ FIX: Update statistics → ANALYZE [table_name]
├─ FIX: Optimize query (rewrite joins, add WHERE clauses)
└─ FIX: Increase work_mem for complex sorts
```

## 13.3 Integration Issues

```
PROBLEM: T24 API timeout
├─ CHECK: T24 system status (contact T24 team)
├─ CHECK: Network connectivity to T24 server
├─ CHECK: T24_TIMEOUT setting (default 30s)
├─ FIX: Increase timeout if T24 is slow
├─ FIX: Queue request for retry
└─ FALLBACK: Cases continue processing, T24 sync deferred

PROBLEM: DMS upload failures
├─ CHECK: DMS API status
├─ CHECK: File size limits (DMS_MAX_FILE_SIZE)
├─ CHECK: Disk space on DMS
├─ FIX: Queue uploads for retry
├─ FIX: Store documents temporarily on app server
└─ NOTIFY: Users → "Documents saved locally, syncing to DMS"

PROBLEM: Email delivery failures
├─ CHECK: SMTP connectivity
├─ CHECK: SMTP credentials valid
├─ CHECK: Email queue in database
├─ CHECK: Sender email not blacklisted
├─ FIX: Check SMTP logs on mail server
├─ FIX: Test with simple email: echo "test" | mail -s "test" admin@qib.com.qa
└─ FIX: Use backup SMTP if primary down
```

---

# 14. MAINTENANCE PROCEDURES

## 14.1 Maintenance Window

```
REGULAR MAINTENANCE SCHEDULE:
├─ Weekly: Sunday 02:00 - 04:00 AM (2 hours)
│  ├─ Database VACUUM ANALYZE
│  ├─ Log rotation
│  ├─ Performance metrics review
│  └─ Security patch assessment
│
├─ Monthly: First Sunday 00:00 - 06:00 AM (6 hours)
│  ├─ OS security patches
│  ├─ Node.js minor updates
│  ├─ npm dependency updates (non-breaking)
│  ├─ PostgreSQL minor updates
│  ├─ Redis updates
│  ├─ Nginx updates
│  ├─ SSL certificate check
│  └─ Full backup verification (test restore)
│
├─ Quarterly: As scheduled (8 hours max)
│  ├─ Major version updates (if approved)
│  ├─ Database performance optimization
│  ├─ Infrastructure capacity review
│  ├─ Disaster recovery drill
│  └─ Security penetration test

MAINTENANCE NOTIFICATION:
├─ 7 days before: Email to all stakeholders
├─ 24 hours before: Reminder + system banner
├─ During maintenance: Maintenance page displayed
└─ After maintenance: All-clear notification
```

## 14.2 Pre-Maintenance Checklist

```
BEFORE STARTING ANY MAINTENANCE:

□ Maintenance window approved by IT Management
□ All stakeholders notified (7 days + 24 hours)
□ Change request submitted and approved
□ Rollback plan documented
□ Full database backup completed (success verified)
□ Application backup completed
□ Configuration backup completed
□ On-call team identified and available
□ Communication channel established (Teams/Slack)
□ Monitoring dashboards open
□ Previous maintenance issues reviewed
```

## 14.3 Post-Maintenance Checklist

```
AFTER COMPLETING MAINTENANCE:

□ All PM2 processes running (pm2 list)
□ Health check endpoint returning 200
□ Database connections working
□ WebSocket connections working
□ Login test successful (all roles)
□ Case creation test successful
□ Notification delivery test successful
□ External integrations responding
□ No errors in logs (pm2 logs --lines 50)
□ Dashboard loading correctly
□ SLA engine running on schedule
□ Monitoring alerts cleared
□ Documentation updated (if changes made)
□ All-clear notification sent to stakeholders
```

---

# 15. DISASTER RECOVERY

## 15.1 Recovery Objectives

```
┌──────────────────────────────────────────────────────────────┐
│                 DISASTER RECOVERY TARGETS                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Recovery Time Objective (RTO):  1 hour                      │
│  Recovery Point Objective (RPO): 1 hour                      │
│                                                              │
│  Tier 1 (Critical — must restore first):                     │
│  ├─ Database (PostgreSQL)                                   │
│  ├─ API Servers (Node.js)                                   │
│  └─ Load Balancer                                           │
│                                                              │
│  Tier 2 (Important — restore within 2 hours):                │
│  ├─ WebSocket Server                                        │
│  ├─ Redis Cache                                             │
│  ├─ Notification Workers                                    │
│  └─ SLA Engine                                              │
│                                                              │
│  Tier 3 (Supportive — restore within 4 hours):               │
│  ├─ Monitoring (Grafana/Prometheus)                         │
│  ├─ Log Server (ELK)                                        │
│  └─ Reporting                                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 15.2 DR Scenarios

```
SCENARIO 1: Single App Server Failure
├─ Impact: 50% reduced capacity (load balancer routes to surviving)
├─ Detection: Health check fails, Nginx marks server down
├─ Recovery: Provision replacement server (< 30 minutes)
│  ├─ Clone from server image
│  ├─ Configure identical to failed server
│  ├─ pm2 start ecosystem.config.js
│  ├─ Add to Nginx upstream
│  └─ Verify health check
└─ Data loss: NONE (stateless servers)

SCENARIO 2: Database Primary Failure
├─ Impact: Write operations fail, read operations continue (replica)
├─ Detection: pg_is_in_recovery() returns unexpected result
├─ Recovery: Promote replica to primary (< 15 minutes)
│  ├─ Run: pg_ctl promote on replica server
│  ├─ Update DB_HOST in .env on all app servers
│  ├─ Reload apps: pm2 reload all
│  ├─ Verify write operations working
│  ├─ Build new replica from promoted primary
│  └─ Update monitoring
└─ Data loss: Up to seconds (streaming replication lag)

SCENARIO 3: Full Data Center Failure
├─ Impact: Complete system outage
├─ Detection: All health checks fail, monitoring alerts
├─ Recovery: Activate DR site (< 1 hour)
│  ├─ DNS failover to DR site
│  ├─ Start DR database from latest backup
│  ├─ Start DR application servers
│  ├─ Update external integration endpoints
│  ├─ Verify basic functionality
│  └─ Notify users: "System available at DR site"
└─ Data loss: Up to RPO (1 hour)

SCENARIO 4: Ransomware / Data Corruption
├─ Impact: Data integrity compromised
├─ Detection: Data anomalies, file encryption, alerts
├─ Recovery: Clean restore from verified backup
│  ├─ ISOLATE: Disconnect all affected servers
│  ├─ ASSESS: Determine scope of corruption
│  ├─ CLEAN: Wipe affected systems
│  ├─ RESTORE: From last known-good backup
│  ├─ VERIFY: Data integrity checks
│  ├─ SECURE: Patch vulnerability that was exploited
│  └─ REPORT: QCB notification if customer data affected
└─ Data loss: Depends on backup frequency and detection time
```

## 15.3 DR Testing Schedule

```
QUARTERLY DR DRILL:
├─ Scenario: Random selection from 4 scenarios
├─ Duration: 4 hours (scheduled maintenance window)
├─ Participants: IT team + Operations representative
├─ Procedure:
│  ├─ 1. Simulate failure
│  ├─ 2. Execute recovery procedures
│  ├─ 3. Measure recovery time
│  ├─ 4. Verify data integrity
│  ├─ 5. Test basic operations
│  └─ 6. Return to primary site
├─ Documentation:
│  ├─ Recovery time achieved
│  ├─ Issues encountered
│  ├─ Procedure updates needed
│  └─ Lessons learned
└─ Sign-off: IT Manager + Compliance
```

---

# 16. APPENDIX: CONFIGURATION REFERENCE

## A. Important File Locations

```
APPLICATION:
├─ /opt/rrgp/app/                    — Application root
├─ /opt/rrgp/app/.env                — Environment config
├─ /opt/rrgp/app/ecosystem.config.js — PM2 config
├─ /opt/rrgp/app/server.js           — Main entry point
├─ /opt/rrgp/config/                 — Config files
├─ /opt/rrgp/config/firebase-sa.json — Firebase service account
└─ /opt/rrgp/scripts/               — Admin scripts

NGINX:
├─ /etc/nginx/nginx.conf             — Main config
├─ /etc/nginx/sites-available/rrgp   — RRGP site config
└─ /etc/nginx/sites-enabled/rrgp    — Symlink (active)

POSTGRESQL:
├─ /etc/postgresql/14/main/postgresql.conf  — DB config
├─ /etc/postgresql/14/main/pg_hba.conf      — Host auth
└─ /var/lib/postgresql/14/main/             — Data directory

LOGS:
├─ /var/log/rrgp/                    — Application logs
├─ /var/log/nginx/                   — Nginx logs
├─ /var/log/postgresql/              — Database logs
└─ /var/log/redis/                   — Redis logs

BACKUPS:
├─ /backup/rrgp/database/           — Database backups
├─ /backup/rrgp/config/             — Config backups
├─ /backup/rrgp/wal/                — WAL archives
└─ /backup/rrgp/archive/            — Cold storage archive

SSL:
├─ /etc/ssl/certs/                   — Certificates
└─ /etc/ssl/private/                 — Private keys
```

## B. Cron Jobs

```
# /etc/crontab — RRGP scheduled tasks

# Database backup (daily 2:00 AM)
0 2 * * * rrgp /opt/rrgp/scripts/backup_database.sh

# Config backup (daily 1:00 AM)
0 1 * * * rrgp /opt/rrgp/scripts/backup_config.sh

# Health check (every minute)
* * * * * rrgp /opt/rrgp/scripts/health_check.sh

# Integration health check (every 15 minutes)
*/15 * * * * rrgp /opt/rrgp/scripts/integration_check.sh

# Log cleanup (weekly Sunday 3:00 AM)
0 3 * * 0 rrgp /opt/rrgp/scripts/cleanup_logs.sh

# Database VACUUM (weekly Sunday 2:30 AM)
30 2 * * 0 postgres vacuumdb -U postgres -d rrgp_production -z

# SSL certificate expiry check (daily)
0 8 * * * rrgp /opt/rrgp/scripts/check_ssl_expiry.sh

# Metric export (every 5 minutes)
*/5 * * * * rrgp /opt/rrgp/scripts/export_metrics.sh
```

## C. Emergency Contacts

```
┌─────────────────────────────────────────────────────────────┐
│                    EMERGENCY CONTACTS                        │
├─────────────────────────────────────────────────────────────┤
│ IT System Admin (Primary)    │ [Name] │ [Phone] │ [Email]  │
│ IT System Admin (Backup)     │ [Name] │ [Phone] │ [Email]  │
│ DBA (Primary)                │ [Name] │ [Phone] │ [Email]  │
│ DBA (Backup)                 │ [Name] │ [Phone] │ [Email]  │
│ Network Engineer             │ [Name] │ [Phone] │ [Email]  │
│ IT Security Lead             │ [Name] │ [Phone] │ [Email]  │
│ IT Manager                   │ [Name] │ [Phone] │ [Email]  │
│ Compliance IT Liaison        │ [Name] │ [Phone] │ [Email]  │
│ Vendor: T24 Support          │        │ [Phone] │ [Email]  │
│ Vendor: Twilio Support       │        │ [Phone] │ [Email]  │
│ Vendor: Firebase Support     │        │         │ [Email]  │
│ QCB IT Hotline               │        │ [Phone] │          │
└─────────────────────────────────────────────────────────────┘
```

## D. Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│           SYSTEM ADMIN — QUICK REFERENCE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  START SYSTEM:    pm2 start ecosystem.config.js              │
│  STOP SYSTEM:     pm2 stop all                               │
│  RESTART:         pm2 reload all (zero downtime)             │
│  STATUS:          pm2 list                                   │
│  LOGS:            pm2 logs --lines 50                        │
│  HEALTH:          curl rrgp.qib.com.qa/api/v1/health        │
│                                                              │
│  DB CONNECT:      psql -h 10.10.2.10 -U rrgp_app -d rrgp_production │
│  DB BACKUP:       /opt/rrgp/scripts/backup_database.sh      │
│  DB RESTORE:      See Section 11.3                           │
│                                                              │
│  NGINX:           sudo nginx -t; sudo nginx -s reload       │
│  SSL CHECK:       openssl x509 -enddate -noout -in cert.crt │
│                                                              │
│  EMERGENCY:       See Section C above                        │
│  DR FAILOVER:     See Section 15.2                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

# DOCUMENT GOVERNANCE & RISK APPROVAL

## Controlled Document Notice

This document is a **controlled operational document** under the RRGP Operational Documentation Governance framework (Enterprise Architecture Document, Section 18). Any updates to this guide must follow the Document Control Workflow and receive **Risk Management Group approval** before becoming effective.

## Risk Governance Approval

```
APPROVAL AUTHORITY:
├─ Document Owner: IT Infrastructure & Operations
├─ Review Authority: Risk Management Group
├─ Final Approval: Mr. Rakesh — Head of Risk Governance
├─ Technical Review: IT Manager
└─ No update is effective until Risk Management approval is granted

DOCUMENT UPDATE WORKFLOW:
  Update Proposed → Internal Review (IT Operations) → Risk Group Review
       → Approval by Mr. Rakesh → Version Update → Distribution to IT Team

CHANGE REQUEST:
  All updates must be submitted through the Change Management Framework
  (Enterprise Architecture Document, Section 19) with CR ID: CR-RRGP-YYYY-XXXX
```

## Version History

```
┌─────────┬────────────┬──────────────────────────┬──────────────────────────┐
│ Version │ Date       │ Change Summary           │ Approved By              │
├─────────┼────────────┼──────────────────────────┼──────────────────────────┤
│ 1.0     │ 2026-03-10 │ Initial release          │ Mr. Rakesh (Risk Head)   │
└─────────┴────────────┴──────────────────────────┴──────────────────────────┘
```

---

**Document ID:** DOC-RRGP-005  
**Document Status:** ✅ APPROVED FOR OPERATIONAL USE  
**Version:** 1.0  
**Effective Date:** March 2026  
**Next Review:** September 2026  
**Owner:** IT Infrastructure & Operations  
**Risk Approval:** Mr. Rakesh — Head of Risk Governance  
**Classification:** INTERNAL — QIB RESTRICTED — IT OPERATIONS
