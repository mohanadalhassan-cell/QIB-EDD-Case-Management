# QIB EDD System - Complete System Architecture

---

## 1. System Overview

The QIB EDD (Enterprise Due Diligence) System is an integrated platform designed to manage Enhanced Due Diligence (EDD) cases, customer onboarding, KYC (Know Your Customer) monitoring, and organizational governance—including a new **Feedback & Change Management Module** to enable continuous system improvement and enterprise transformation tracking.

---

## 2. Core System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    QIB EDD SYSTEM ARCHITECTURE                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            USER INTERFACE LAYER (Frontend)                   │ │
│  │  ┌──────────────┬──────────────┬──────────────────────────┐  │ │
│  │  │  Dashboard   │  EDD Cases   │  Organization View       │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │  KYC Monitor │  Compliance  │  Audit Console           │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │  Business    │  CDD Ops     │  Management Dashboard    │  │ │
│  │  │              │              │  (NEW)                   │  │ │
│  │  └──────────────┴──────────────┴──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓ (APIs)                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │         APPLICATION LAYER (Business Logic)                   │ │
│  │  ┌──────────────┬──────────────┬──────────────────────────┐  │ │
│  │  │ EDD Case     │  KYC Risk    │  Document Management    │  │ │
│  │  │ Management   │  Engine      │                          │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │ Customer     │  Compliance  │  Feedback & Change       │  │ │
│  │  │ Onboarding   │  Tracking    │  Management (NEW)        │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │ Notification │  Audit Trail │  Maker-Checker          │  │ │
│  │  │ Engine       │  & Logging   │  Workflow (NEW)          │  │ │
│  │  └──────────────┴──────────────┴──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓ (Data Layer)                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            DATA PERSISTENCE LAYER (Backend)                  │ │
│  │  ┌──────────────┬──────────────┬──────────────────────────┐  │ │
│  │  │ Organization │  Case Data   │  Customer Database      │  │ │
│  │  │ Database     │  Repository  │                          │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │ Feedback DB  │  Document    │  Workflow & Process     │  │ │
│  │  │ (NEW)        │  Storage     │  History                │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │ User & Role  │  Audit Log   │  Configuration DB       │  │ │
│  │  │ Permissions  │  Database    │                          │  │ │
│  │  └──────────────┴──────────────┴──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                            ↓ (Integration)                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │          EXTERNAL INTEGRATION LAYER                          │ │
│  │  ┌──────────────┬──────────────┬──────────────────────────┐  │ │
│  │  │  Active Dir  │  Email Server│  Document Mgmt System   │  │ │
│  │  │  (AD)        │              │  (External)              │  │ │
│  │  ├──────────────┼──────────────┼──────────────────────────┤  │ │
│  │  │ Banking Core │  Reporting   │  API Gateway            │  │ │
│  │  │ System       │  Tools       │  (RESTful)               │  │
│  │  └──────────────┴──────────────┴──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Premium gradients, animations, responsive design
- **JavaScript (Vanilla)** - No frameworks, lightweight performance
- **Responsive Design** - Mobile-first, works on all devices

### Backend (Future Implementation)
- **Node.js/Express** or **Python/FastAPI** - RESTful APIs
- **Database** - PostgreSQL or MongoDB
- **Authentication** - OAuth 2.0 / AD Integration
- **Message Queue** - RabbitMQ for async operations

### Deployment
- **Docker** - Containerized deployment
- **Kubernetes** - Orchestration (optional)
- **Load Balancer** - Nginx/HAProxy
- **CDN** - Static file delivery

---

## 4. Module Architecture

### 4.1 Core Modules

#### **EDD Case Management Module**
- Create, assign, and track EDD cases
- Workflow automation
- Document attachment and versioning
- Status tracking (Draft, In Progress, Completed, Escalated)
- Risk scoring engine

#### **KYC (Know Your Customer) Monitoring Module**
- Customer risk profile assessment
- Transaction monitoring and alerts
- Customer lifecycle management
- Periodic review scheduling
- Regulatory compliance tracking

#### **Organization Management Module**
- Hierarchical organizational structure
- Employee profiles and roles
- Department organization
- Reporting relationships
- Role-based access control (RBAC)

#### **Compliance & Audit Module**
- Audit trail logging
- Compliance rule engine
- Risk assessment and scoring
- Report generation
- Evidence documentation

#### **NEW: Feedback & Change Management Module**
- Feedback submission portal
- Maker-Checker approval workflow
- Change tracking and approval
- Implementation monitoring
- Impact assessment
- Dashboard and reporting

---

## 5. Feedback & Change Management Module (NEW)

### 5.1 Module Architecture

```
┌─────────────────────────────────────────────────────┐
│     FEEDBACK & CHANGE MANAGEMENT MODULE              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  Feedback Submission Interface (All Users)   │  │
│  │  • Submit Feedback                           │  │
│  │  • Select Module & Category                  │  │
│  │  • Attach Documents                          │  │
│  │  • Priority Assignment                       │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  MAKER REVIEW (Karan)                       │  │
│  │  • Validate feedback completeness            │  │
│  │  • Initial assessment                        │  │
│  │  • Forward to Checker or Reject              │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  CHECKER REVIEW (Mohammed Ibrahim)          │  │
│  │  • Technical feasibility assessment           │  │
│  │  • Impact analysis                           │  │
│  │  • Approve or Send back                      │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  Head of Change Management Dashboard (Arslan)  │
│  │  • View approved feedback items              │  │
│  │  • Create change initiatives                 │  │
│  │  • Track implementation status               │  │
│  │  • Generate reports                          │  │
│  └──────────────────────────────────────────────┘  │
│                       ↓                             │
│  ┌──────────────────────────────────────────────┐  │
│  │  COO Dashboard (Saleem)                      │  │
│  │  • Executive overview                        │  │
│  │  • Change impact assessment                  │  │
│  │  • Approval of major initiatives             │  │
│  │  • Reports to Board/Management               │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5.2 Data Flow

```
User Submits Feedback
    ↓
Store in Feedback DB with ID (FBK-XXXX)
    ↓
Notify Maker (Karan)
    ↓
Maker Reviews & Assigns Status
    ↓
If Rejected: Send back to User
If Approved: Forward to Checker
    ↓
Notify Checker (Mohammed Ibrahim)
    ↓
Checker Reviews & Assigns Status
    ↓
If Rejected: Send back to Maker
If Approved: Forward to Head of Change Management
    ↓
Notify Arslan (Head of Change Management)
    ↓
Arslan Reviews, Creates Change Initiative (CHG-XXXX)
    ↓
Assign Implementation Team & Timeline
    ↓
Track Implementation Status
    ↓
Generate Change Report & Submit to COO (Saleem)
    ↓
COO Reviews & Approves/Escalates
    ↓
Update Board/Executive Summary
```

---

## 6. Database Schema (Key Tables)

### Feedback Table
```sql
CREATE TABLE feedback (
  id VARCHAR(20) PRIMARY KEY,      -- FBK-0001, FBK-0002, ...
  submitted_by INT,                 -- Employee ID
  module VARCHAR(50),               -- EDD Cases, Dashboard, etc.
  category VARCHAR(20),             -- Bug, Enhancement, Suggestion
  description TEXT,
  priority VARCHAR(10),             -- Low, Medium, High
  status VARCHAR(20),               -- New, Under Review, Approved, Rejected, Implemented
  maker_id INT,                     -- Karan's ID
  maker_review_date TIMESTAMP,
  maker_comment TEXT,
  checker_id INT,                   -- Mohammed Ibrahim's ID
  checker_review_date TIMESTAMP,
  checker_comment TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Change Initiative Table
```sql
CREATE TABLE change_initiatives (
  id VARCHAR(20) PRIMARY KEY,       -- CHG-0001, CHG-0002, ...
  feedback_id VARCHAR(20),          -- Link to feedback
  created_by INT,                   -- Arslan's ID
  title VARCHAR(200),
  description TEXT,
  impact_assessment TEXT,
  start_date DATE,
  end_date DATE,
  status VARCHAR(20),               -- Planned, In Progress, Completed, On Hold
  owner_id INT,
  assigned_team TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Audit Log Table
```sql
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100),
  module VARCHAR(50),
  timestamp TIMESTAMP,
  ip_address VARCHAR(50),
  details LONGTEXT
);
```

---

## 7. User Roles & Permissions

| Role                    | Permissions     | Dashboard Access |
| ----------------------- | --------------- | ----------------  |
| **General Employee**     | View own data, Submit feedback | Basic Dashboard |
| **Department Manager**   | View team data, Approve requests | Operations Dashboard |
| **Maker (Karan)**       | Review feedback, Initial assessment | Feedback Review |
| **Checker (Mohammed I.)** | Validate feedback, Technical assessment | Feedback Checker |
| **Head of Change Mgmt** | Approve changes, Track implementation | Change Management Dashboard |
| **COO (Saleem)**        | Executive overview, Final approval | Executive Dashboard |
| **System Admin**        | All permissions, User management | Admin Console |

---

## 8. Security & Compliance

### Authentication
- Active Directory (AD) integration
- Single Sign-On (SSO)
- Role-based access control (RBAC)
- Session management with timeouts

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.2+)
- Data masking for sensitive information
- Regular backups with versioning

### Audit & Compliance
- Comprehensive audit logging
- Non-repudiation through digital signatures
- Compliance with regulatory requirements
- Regular security audits and penetration testing

---

## 9. Integration Points

### Active Directory (AD)
- Employee data synchronization
- User authentication
- Group policy management
- Organizational hierarchy sync

### Email System
- Notification delivery
- Feedback submission confirmation
- Workflow alerts
- Report distribution

### External Document Management
- Document storage and retrieval
- Version control
- Archive management

### Banking Core System
- Customer information lookup
- Transaction history
- Account details
- Risk scoring data

---

## 10. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│          DEPLOYMENT ENVIRONMENT                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐      ┌──────────────┐        │
│  │ Load Balancer│ ──── │   Nginx      │        │
│  │ (Redundant)  │      │  Reverse Proxy       │
│  └──────────────┘      └──────────────┘        │
│                              ↓                  │
│  ┌─────────────────────────────────────────┐   │
│  │      Docker Container Cluster            │   │
│  │  ┌────────────┬────────────────────┐     │   │
│  │  │ Frontend   │  API Server 1      │     │   │
│  │  │ Container  │  Container         │     │   │
│  │  ├────────────┼────────────────────┤     │   │
│  │  │ API Server 2 │ Job Queue       │     │   │
│  │  │ Container     │ Container       │     │   │
│  │  └────────────┴────────────────────┘     │   │
│  └─────────────────────────────────────────┘   │
│                  ↓         ↓        ↓           │
│  ┌────────────────────────────────────────┐    │
│  │    Kubernetes Orchestration (Optional)  │    │
│  │    • Auto-scaling                      │    │
│  │    • Self-healing                      │    │
│  │    • Rolling updates                   │    │
│  └────────────────────────────────────────┘    │
│                  ↓                              │
│  ┌──────────────────────────────────────────┐  │
│  │      Persistent Storage Layer             │  │
│  │  ┌────────────┬────────────────────┐     │  │
│  │  │Database    │  Document Storage  │     │  │
│  │  │(PostgreSQL)│  (Shared Drive)    │     │  │
│  │  │            │                    │     │  │
│  │  │Backup &    │ Archive System     │     │  │
│  │  │Recovery    │                    │     │  │
│  │  └────────────┴────────────────────┘     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 11. API Endpoints (RESTful)

### Feedback Management
```
POST   /api/feedback                 - Submit new feedback
GET    /api/feedback                 - List all feedback
GET    /api/feedback/{id}            - Get feedback details
PUT    /api/feedback/{id}            - Update feedback
DELETE /api/feedback/{id}            - Delete feedback

POST   /api/feedback/{id}/maker-review    - Maker review
POST   /api/feedback/{id}/checker-review  - Checker review
```

### Change Management
```
GET    /api/changes                 - List all changes
POST   /api/changes                 - Create new change
GET    /api/changes/{id}            - Get change details
PUT    /api/changes/{id}            - Update change
PATCH  /api/changes/{id}/status     - Update change status
```

### Organization
```
GET    /api/organization            - Get org structure
GET    /api/employees               - List employees
GET    /api/employees/{id}          - Get employee details
GET    /api/roles                   - List roles
GET    /api/permissions             - Get user permissions
```

### Reporting
```
GET    /api/reports/feedback        - Feedback report
GET    /api/reports/changes         - Change report
GET    /api/reports/dashboard       - Executive summary
GET    /api/reports/audit           - Audit log report
```

---

## 12. Performance & Scalability

### Caching Strategy
- Redis for session and frequently accessed data
- Browser caching for static assets
- CDN for global content distribution

### Database Optimization
- Query indexing on key fields
- Pagination for large datasets
- Archive old records automatically

### Load Balancing
- Round-robin distribution
- Health checks and failover
- Geographic distribution (if multi-region)

---

## 13. Future Enhancements

1. **Machine Learning Integration** - Predictive analytics for feedback categorization
2. **Mobile Application** - Native iOS/Android apps
3. **Advanced Analytics** - BI dashboards with predictive insights
4. **Workflow Automation** - RPA for routine tasks
5. **API Marketplace** - Third-party integrations
6. **Blockchain Audit Trail** - Immutable record keeping

---

## 14. Support & Maintenance

### Development Environment
- Git-based version control
- Continuous Integration/Continuous Deployment (CI/CD)
- Automated testing framework
- Development, UAT, and Production environments

### Monitoring & Alerting
- Application Performance Monitoring (APM)
- Real-time alerting
- Log aggregation and analysis
- Error tracking and reporting

### Support Structure
- 24/7 L1 helpdesk
- L2 technical support
- L3 engineering team
- Escalation procedures

---

**Document Version:** 1.0  
**Last Updated:** March 9, 2026  
**Created for:** QIB IT Technical Team
