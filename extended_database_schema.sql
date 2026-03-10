-- ============================================================================
-- EXTENDED DATABASE SCHEMA - INTEGRATED RETAIL RISK GOVERNANCE PLATFORM
-- Adds missing tables for real-time workflow, routing, notifications
-- ============================================================================

-- ============================================================================
-- 1. EDD_CASES - Main EDD Case Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS edd_cases (
    case_id VARCHAR(30) PRIMARY KEY,
    kyc_id VARCHAR(30) NOT NULL,
    customer_id VARCHAR(20) NOT NULL,
    rim_number VARCHAR(20) NOT NULL,
    
    -- Case Details
    case_type VARCHAR(50) NOT NULL, -- INITIAL_KYC, EDD, RKYC, ESCALATION
    case_status VARCHAR(30) DEFAULT 'PENDING',
    case_priority VARCHAR(20) DEFAULT 'NORMAL', -- LOW, NORMAL, HIGH, URGENT
    
    -- Risk Assessment
    trigger_reason TEXT,
    risk_rating VARCHAR(20),
    risk_score NUMERIC(3,0),
    
    -- Routing & Assignment
    assigned_to VARCHAR(50),
    assigned_team VARCHAR(50),
    assigned_at TIMESTAMP,
    
    -- Workflow Status
    business_assessment_status VARCHAR(30),
    cdd_assessment_status VARCHAR(30),
    compliance_review_status VARCHAR(30),
    final_decision VARCHAR(30), -- APPROVED, REJECTED, ESCALATED, PENDING
    final_decision_date TIMESTAMP,
    final_decision_by VARCHAR(50),
    
    -- Dates
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    sla_due_date TIMESTAMP,
    
    -- Contact Center Integration
    contact_center_case_id VARCHAR(30),
    call_recording_id VARCHAR(50),
    
    -- Audit
    created_by VARCHAR(50),
    last_updated_by VARCHAR(50),
    last_updated_at TIMESTAMP,
    
    CONSTRAINT fk_kyc_case FOREIGN KEY (kyc_id) REFERENCES KYC_MASTER_DATA_MODEL(kyc_id),
    CONSTRAINT fk_customer_case FOREIGN KEY (customer_id) REFERENCES KYC_CUSTOMER_PROFILE(customer_id),
    CONSTRAINT ck_case_type CHECK (case_type IN ('INITIAL_KYC', 'EDD', 'RKYC', 'ESCALATION')),
    CONSTRAINT ck_case_status CHECK (case_status IN ('PENDING', 'IN_PROGRESS', 'AWAITING_INFO', 'UNDER_REVIEW', 'COMPLETED', 'REJECTED', 'ESCALATED')),
    CONSTRAINT ck_priority CHECK (case_priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT'))
);

CREATE INDEX idx_edd_customer ON edd_cases(customer_id);
CREATE INDEX idx_edd_status ON edd_cases(case_status);
CREATE INDEX idx_edd_assigned ON edd_cases(assigned_to);
CREATE INDEX idx_edd_priority ON edd_cases(case_priority);
CREATE INDEX idx_edd_created ON edd_cases(created_at DESC);

-- ============================================================================
-- 2. WORKFLOW_QUEUE - Real-time Workflow Routing
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflow_queue (
    queue_id SERIAL PRIMARY KEY,
    case_id VARCHAR(30) NOT NULL,
    
    -- Queue Details
    current_workflow_stage VARCHAR(50) NOT NULL, -- BUSINESS, CDD, COMPLIANCE, DECISION
    workflow_sequence INT,
    
    -- Assignment
    assigned_role VARCHAR(50),
    assigned_user VARCHAR(50),
    assigned_team VARCHAR(50),
    
    -- Status
    queue_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, BLOCKED
    queue_sequence_order INT,
    
    -- SLA
    sla_hours INT DEFAULT 24,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Audit
    notes TEXT,
    created_by VARCHAR(50),
    
    CONSTRAINT fk_case_queue FOREIGN KEY (case_id) REFERENCES edd_cases(case_id),
    CONSTRAINT ck_workflow_stage CHECK (current_workflow_stage IN ('BUSINESS', 'CDD', 'COMPLIANCE', 'DECISION')),
    CONSTRAINT ck_queue_status CHECK (queue_status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'ESCALATED'))
);

CREATE INDEX idx_workflow_case ON workflow_queue(case_id);
CREATE INDEX idx_workflow_stage ON workflow_queue(current_workflow_stage);
CREATE INDEX idx_workflow_user ON workflow_queue(assigned_user);
CREATE INDEX idx_workflow_status ON workflow_queue(queue_status);

-- ============================================================================
-- 3. CASE_RISK_ASSESSMENT - Detailed Risk Analysis
-- ============================================================================

CREATE TABLE IF NOT EXISTS case_risk_assessment (
    assessment_id VARCHAR(30) PRIMARY KEY,
    case_id VARCHAR(30) NOT NULL,
    
    -- Risk Categories
    nationality_risk VARCHAR(20),
    occupation_risk VARCHAR(20),
    product_risk VARCHAR(20),
    channel_risk VARCHAR(20),
    source_of_funds_risk VARCHAR(20),
    pep_risk VARCHAR(20),
    sanctions_risk VARCHAR(20),
    fatca_crs_risk VARCHAR(20),
    
    -- Overall Risk
    cumulative_risk_score NUMERIC(5,2),
    overall_risk_rating VARCHAR(20),
    
    -- Risk Reasons (Multiple)
    risk_reason_1 TEXT,
    risk_reason_2 TEXT,
    risk_reason_3 TEXT,
    risk_reason_4 TEXT,
    
    -- Documentation
    required_documents TEXT[],
    obtained_documents TEXT[],
    documentation_complete BOOLEAN DEFAULT FALSE,
    
    -- Assessment Details
    assessed_by VARCHAR(50),
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    review_notes TEXT,
    
    CONSTRAINT fk_assessment_case FOREIGN KEY (case_id) REFERENCES edd_cases(case_id)
);

CREATE INDEX idx_assessment_case ON case_risk_assessment(case_id);
CREATE INDEX idx_assessment_risk ON case_risk_assessment(overall_risk_rating);

-- ============================================================================
-- 4. NOTIFICATIONS - Real-time Notification Engine
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Trigger
    case_id VARCHAR(30),
    event_type VARCHAR(50), -- CASE_CREATED, CASE_ASSIGNED, EDD_TRIGGERED, ESCALATION, DEADLINE_APPROACHING
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Recipient
    recipient_user_id VARCHAR(50),
    recipient_email VARCHAR(100),
    recipient_phone VARCHAR(15),
    
    -- Message
    notification_type VARCHAR(30), -- EMAIL, SMS, MOBILE_PUSH, DASHBOARD
    subject VARCHAR(200),
    message TEXT,
    
    -- Status
    notification_status VARCHAR(30) DEFAULT 'PENDING', -- PENDING, SENT, FAILED, READ
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    
    -- Delivery
    send_channel VARCHAR(30),
    delivery_status VARCHAR(30),
    delivery_message TEXT,
    retry_count INT DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    
    CONSTRAINT fk_notif_case FOREIGN KEY (case_id) REFERENCES edd_cases(case_id),
    CONSTRAINT ck_event_type CHECK (event_type IN (
        'CASE_CREATED', 'CASE_ASSIGNED', 'EDD_TRIGGERED', 'ESCALATION', 
        'DEADLINE_APPROACHING', 'AWAITING_INFO', 'DECISION_MADE', 'APPROVAL_REQUIRED'
    )),
    CONSTRAINT ck_notif_type CHECK (notification_type IN (
        'EMAIL', 'SMS', 'MOBILE_PUSH', 'DASHBOARD', 'CALL_REQUEST'
    ))
);

CREATE INDEX idx_notif_user ON notifications(recipient_user_id);
CREATE INDEX idx_notif_case ON notifications(case_id);
CREATE INDEX idx_notif_status ON notifications(notification_status);
CREATE INDEX idx_notif_created ON notifications(created_at DESC);

-- ============================================================================
-- 5. CONTACT_CENTER_INTERACTION - Call Center Integration
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_center_interaction (
    interaction_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(30),
    customer_id VARCHAR(20),
    
    -- Interaction Details
    interaction_type VARCHAR(50), -- OUTBOUND_CALL, INBOUND_CALL, EMAIL, MSG
    interaction_status VARCHAR(30), -- PENDING, COMPLETED, FAILED, NO_ANSWER
    
    -- Call Details
    caller_id VARCHAR(50),
    call_duration_seconds INT,
    recording_link VARCHAR(255),
    recording_id VARCHAR(50),
    
    -- Call Outcome
    call_outcome TEXT,
    customer_response VARCHAR(30),
    action_required BOOLEAN DEFAULT FALSE,
    action_description TEXT,
    
    -- Dates
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Attachment to Case
    attached_to_case_at TIMESTAMP,
    attached_by VARCHAR(50),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    notes TEXT,
    
    CONSTRAINT fk_interaction_case FOREIGN KEY (case_id) REFERENCES edd_cases(case_id),
    CONSTRAINT fk_interaction_customer FOREIGN KEY (customer_id) REFERENCES KYC_CUSTOMER_PROFILE(customer_id),
    CONSTRAINT ck_interaction_type CHECK (interaction_type IN (
        'OUTBOUND_CALL', 'INBOUND_CALL', 'EMAIL', 'SMS', 'VISIT', 'VIDEO_CALL'
    ))
);

CREATE INDEX idx_interaction_case ON contact_center_interaction(case_id);
CREATE INDEX idx_interaction_customer ON contact_center_interaction(customer_id);
CREATE INDEX idx_interaction_status ON contact_center_interaction(interaction_status);
CREATE INDEX idx_interaction_date ON contact_center_interaction(created_at DESC);

-- ============================================================================
-- 6. CHANGE_MANAGEMENT_WORKFLOW - Change Management Integration (Arslan's Team)
-- ============================================================================

CREATE TABLE IF NOT EXISTS change_management_workflow (
    change_id VARCHAR(30) PRIMARY KEY,
    case_id VARCHAR(30),
    
    -- Change Type
    change_type VARCHAR(50), -- PROCESS_CHANGE, POLICY_CHANGE, THRESHOLD_CHANGE
    change_description TEXT,
    
    -- Status
    change_status VARCHAR(30) DEFAULT 'PROPOSED', -- PROPOSED, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, IMPLEMENTED
    change_priority VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL
    
    -- Approval Chain
    submitted_by VARCHAR(50),
    submitted_at TIMESTAMP,
    
    -- Maker (First Approver)
    maker_id VARCHAR(50),
    maker_approval_status VARCHAR(30),
    maker_approved_at TIMESTAMP,
    maker_notes TEXT,
    
    -- Checker (Arslan - Head of Change Management)
    checker_id VARCHAR(50) DEFAULT 'CHG-001', -- Arslan
    checker_approval_status VARCHAR(30),
    checker_approved_at TIMESTAMP,
    checker_notes TEXT,
    
    -- Final Decision
    final_status VARCHAR(30),
    final_decision_by VARCHAR(50),
    final_decision_at TIMESTAMP,
    implementation_date DATE,
    
    -- Impact Analysis
    affected_systems TEXT[],
    risk_assessment TEXT,
    rollback_plan TEXT,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_change_case FOREIGN KEY (case_id) REFERENCES edd_cases(case_id),
    CONSTRAINT ck_change_status CHECK (change_status IN (
        'PROPOSED', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'IMPLEMENTED'
    ))
);

CREATE INDEX idx_change_case ON change_management_workflow(case_id);
CREATE INDEX idx_change_status ON change_management_workflow(change_status);
CREATE INDEX idx_change_submitted ON change_management_workflow(submitted_at DESC);

-- ============================================================================
-- 7. DASHBOARD_METRICS - Real-time Dashboard Data
-- ============================================================================

CREATE TABLE IF NOT EXISTS dashboard_metrics (
    metric_id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100),
    metric_date DATE DEFAULT CURRENT_DATE,
    metric_hour SMALLINT DEFAULT 0,
    
    -- KYC Metrics
    kyc_today INT DEFAULT 0,
    kyc_approved INT DEFAULT 0,
    kyc_rejected INT DEFAULT 0,
    kyc_pending INT DEFAULT 0,
    kyc_avg_processing_hours NUMERIC(5,2),
    
    -- EDD Metrics
    edd_cases_created INT DEFAULT 0,
    edd_cases_completed INT DEFAULT 0,
    edd_cases_pending INT DEFAULT 0,
    edd_cases_escalated INT DEFAULT 0,
    
    -- Risk Metrics
    high_risk_count INT DEFAULT 0,
    critical_risk_count INT DEFAULT 0,
    pep_detected INT DEFAULT 0,
    sanctions_detected INT DEFAULT 0,
    
    -- Performance Metrics
    avg_case_duration_hours NUMERIC(5,2),
    sla_compliance_percent NUMERIC(5,2),
    staff_utilization_percent NUMERIC(5,2),
    
    -- Contact Center Metrics
    calls_today INT DEFAULT 0,
    calls_completed INT DEFAULT 0,
    avg_call_duration_minutes NUMERIC(5,2),
    
    -- Change Management
    pending_changes INT DEFAULT 0,
    approved_changes INT DEFAULT 0,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    
    UNIQUE (metric_name, metric_date, metric_hour)
);

CREATE INDEX idx_metrics_date ON dashboard_metrics(metric_date DESC);
CREATE INDEX idx_metrics_name ON dashboard_metrics(metric_name);

-- ============================================================================
-- 8. SYSTEM_CONFIGURATION - System Settings & Rules
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_configuration (
    config_id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE,
    config_value TEXT,
    config_type VARCHAR(30), -- STRING, NUMBER, BOOLEAN, JSON
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Insert default configurations
INSERT INTO system_configuration (config_key, config_value, config_type, description) VALUES
('RISK_SCORE_THRESHOLD_EDD', '60', 'NUMBER', 'Risk score threshold for EDD trigger'),
('ACTIVITY_RATIO_THRESHOLD', '1.2', 'NUMBER', '120% activity to income ratio'),
('SLA_BUSINESS_HOURS', '24', 'NUMBER', 'SLA for business assessment team'),
('SLA_CDD_HOURS', '24', 'NUMBER', 'SLA for CDD assessment team'),
('SLA_COMPLIANCE_HOURS', '24', 'NUMBER', 'SLA for compliance review'),
('PEP_AUTO_ESCALATE', 'true', 'BOOLEAN', 'Auto-escalate if PEP detected'),
('SANCTIONS_AUTO_REJECT', 'true', 'BOOLEAN', 'Auto-reject if sanctions hit'),
('NOTIFICATION_EMAIL_ENABLED', 'true', 'BOOLEAN', 'Enable email notifications'),
('NOTIFICATION_SMS_ENABLED', 'true', 'BOOLEAN', 'Enable SMS notifications'),
('AUTO_ASSIGN_BUSINESS_TEAM', 'true', 'BOOLEAN', 'Auto-assign to business analyst');

-- ============================================================================
-- 9. VIEWS - Integrated Dashboards
-- ============================================================================

-- Business Analyst View
CREATE OR REPLACE VIEW VW_BUSINESS_ANALYST_QUEUE AS
SELECT 
    wq.queue_id,
    ec.case_id,
    ec.customer_id,
    kcp.full_name_en,
    kcp.full_name_ar,
    ec.case_priority,
    ec.risk_rating,
    wq.assigned_user,
    wq.due_date,
    EXTRACT(HOUR FROM (wq.due_date - CURRENT_TIMESTAMP)) as hours_remaining,
    ec.trigger_reason,
    wq.queue_status
FROM workflow_queue wq
JOIN edd_cases ec ON wq.case_id = ec.case_id
JOIN KYC_CUSTOMER_PROFILE kcp ON ec.customer_id = kcp.customer_id
WHERE wq.current_workflow_stage = 'BUSINESS'
  AND wq.queue_status IN ('PENDING', 'IN_PROGRESS')
ORDER BY wq.due_date ASC;

-- Compliance View
CREATE OR REPLACE VIEW VW_COMPLIANCE_QUEUE AS
SELECT 
    wq.queue_id,
    ec.case_id,
    ec.customer_id,
    kcp.full_name_en,
    cra.overall_risk_rating,
    cra.risk_reason_1,
    cra.risk_reason_2,
    wq.assigned_user,
    wq.due_date,
    ec.case_priority,
    wq.queue_status
FROM workflow_queue wq
JOIN edd_cases ec ON wq.case_id = ec.case_id
JOIN KYC_CUSTOMER_PROFILE kcp ON ec.customer_id = kcp.customer_id
LEFT JOIN case_risk_assessment cra ON ec.case_id = cra.case_id
WHERE wq.current_workflow_stage = 'COMPLIANCE'
  AND wq.queue_status IN ('PENDING', 'IN_PROGRESS')
ORDER BY ec.case_priority DESC, wq.due_date ASC;

-- Manager Dashboard
CREATE OR REPLACE VIEW VW_MANAGER_DASHBOARD AS
SELECT 
    CURRENT_DATE as dashboard_date,
    (SELECT COUNT(*) FROM edd_cases WHERE DATE(created_at) = CURRENT_DATE) as cases_created_today,
    (SELECT COUNT(*) FROM edd_cases WHERE case_status = 'COMPLETED' AND DATE(completed_at) = CURRENT_DATE) as cases_completed_today,
    (SELECT COUNT(*) FROM edd_cases WHERE case_status IN ('PENDING', 'IN_PROGRESS')) as cases_in_progress,
    (SELECT COUNT(*) FROM edd_cases WHERE case_priority = 'URGENT') as urgent_cases,
    (SELECT COUNT(*) FROM notifications WHERE notification_status = 'PENDING') as pending_notifications,
    (SELECT AVG(EXTRACT(HOUR FROM (completed_at - created_at))) FROM edd_cases WHERE completed_at IS NOT NULL) as avg_case_hours;

-- EDD Trigger Monitoring
CREATE OR REPLACE VIEW VW_EDD_TRIGGER_SUMMARY AS
SELECT 
    ec.case_id,
    ec.customer_id,
    kcp.full_name_en,
    kcp.risk_rating as kyc_risk_rating,
    cra.overall_risk_rating as edd_risk_rating,
    ec.trigger_reason,
    ec.case_status,
    ec.assigned_to,
    ec.created_at,
    ec.completed_at
FROM edd_cases ec
JOIN KYC_CUSTOMER_PROFILE kcp ON ec.customer_id = kcp.customer_id
LEFT JOIN case_risk_assessment cra ON ec.case_id = cra.case_id
WHERE ec.case_status NOT IN ('REJECTED')
ORDER BY ec.created_at DESC;

-- ============================================================================
-- POST-DEPLOYMENT VERIFICATION
-- ============================================================================

/*

Verify all tables created:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name LIKE '%edd%' OR table_name LIKE '%workflow%' OR table_name LIKE '%notification%';

Verify views created:
SELECT viewname FROM pg_views 
WHERE viewname LIKE 'VW_%';

Test workflow queue:
SELECT * FROM workflow_queue LIMIT 5;

Test notifications:
SELECT * FROM notifications WHERE notification_status = 'PENDING';

Test dashboard metrics:
SELECT * FROM dashboard_metrics ORDER BY created_at DESC LIMIT 10;

*/
