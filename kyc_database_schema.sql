-- ============================================================================
-- QIB EDD/KYC ENTERPRISE DATABASE SCHEMA
-- System: Qatar Islamic Bank - Enhanced Due Diligence Platform
-- Version: 1.0
-- Created: March 9, 2026
-- Target: PostgreSQL 12+
-- ============================================================================

-- Pre-implementation checks
-- DROP TABLE IF EXISTS KYC_CONSENT_AUDIT CASCADE;
-- DROP TABLE IF EXISTS KYC_RISK_INDICATORS CASCADE;
-- DROP TABLE IF EXISTS KYC_FINANCIAL_PROFILE CASCADE;
-- DROP TABLE IF EXISTS KYC_EMPLOYMENT CASCADE;
-- DROP TABLE IF EXISTS KYC_CONTACT_INFO CASCADE;
-- DROP TABLE IF EXISTS KYC_CUSTOMER_PROFILE CASCADE;

-- ============================================================================
-- 1. KYC_CUSTOMER_PROFILE - Main Customer Master Record
-- ============================================================================

CREATE TABLE KYC_CUSTOMER_PROFILE (
    -- Primary Identifiers
    customer_id VARCHAR(20) PRIMARY KEY,
    rim_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Golden Source: Identity from MOI/QCB (READ-ONLY)
    full_name_en VARCHAR(200) NOT NULL,
    full_name_ar VARCHAR(200) NOT NULL,
    qid_number VARCHAR(11) UNIQUE NOT NULL,
    qid_issue_date DATE,
    qid_expiry DATE NOT NULL,
    qid_status VARCHAR(20) DEFAULT 'VALID',
    
    -- Passport Details
    passport_number VARCHAR(20),
    passport_issue_date DATE,
    passport_expiry DATE,
    passport_country VARCHAR(100),
    
    -- Personal Information
    date_of_birth DATE NOT NULL,
    gender CHAR(1) NOT NULL,
    nationality VARCHAR(3) NOT NULL,
    marital_status VARCHAR(20) DEFAULT 'SINGLE',
    place_of_birth VARCHAR(100),
    
    -- Visa/Residency (from MOI)
    visa_status VARCHAR(20) DEFAULT 'VALID',
    visa_expiry DATE,
    residence_status VARCHAR(20),
    
    -- Risk Assessment (from CRP)
    risk_rating VARCHAR(20) DEFAULT 'MEDIUM',
    risk_score INTEGER DEFAULT 0,
    
    -- System Status
    is_active BOOLEAN DEFAULT TRUE,
    kyc_version INTEGER DEFAULT 1,
    kyc_last_updated DATE,
    
    -- Audit Trail
    created_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    updated_at TIMESTAMP,
    last_reviewed_by VARCHAR(50),
    last_reviewed_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT ck_age CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) >= 18),
    CONSTRAINT ck_qid_format CHECK (qid_number ~ '^\d{11}$'),
    CONSTRAINT ck_risk_rating CHECK (risk_rating IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT ck_gender CHECK (gender IN ('M', 'F', 'O'))
);

CREATE INDEX idx_kyc_rim ON KYC_CUSTOMER_PROFILE(rim_number);
CREATE INDEX idx_kyc_qid ON KYC_CUSTOMER_PROFILE(qid_number);
CREATE INDEX idx_kyc_active ON KYC_CUSTOMER_PROFILE(is_active);
CREATE INDEX idx_kyc_risk ON KYC_CUSTOMER_PROFILE(risk_rating);

-- ============================================================================
-- 2. KYC_CONTACT_INFO - Contact and Address Information
-- ============================================================================

CREATE TABLE KYC_CONTACT_INFO (
    contact_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL REFERENCES KYC_CUSTOMER_PROFILE(customer_id) ON DELETE CASCADE,
    
    -- Primary Contact
    mobile_number VARCHAR(15) NOT NULL,
    mobile_verified BOOLEAN DEFAULT FALSE,
    mobile_verified_at TIMESTAMP,
    mobile_verified_by VARCHAR(50),
    
    email VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    
    -- Alternate Contact
    alternate_phone VARCHAR(15),
    
    -- Address Information
    street_name VARCHAR(100) NOT NULL,
    building_number VARCHAR(10) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    po_box VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    
    -- Additional Address
    address_line_1 VARCHAR(200),
    address_line_2 VARCHAR(200),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    
    -- Constraints
    CONSTRAINT ck_mobile_format CHECK (mobile_number ~ '^\+?[0-9\s\-()]{7,20}$'),
    CONSTRAINT ck_email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_contact_customer ON KYC_CONTACT_INFO(customer_id);
CREATE INDEX idx_contact_mobile ON KYC_CONTACT_INFO(mobile_number);
CREATE INDEX idx_contact_email ON KYC_CONTACT_INFO(email);

-- ============================================================================
-- 3. KYC_EMPLOYMENT - Employment and Occupation Details
-- ============================================================================

CREATE TABLE KYC_EMPLOYMENT (
    employment_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL REFERENCES KYC_CUSTOMER_PROFILE(customer_id) ON DELETE CASCADE,
    
    -- Employment Status
    employment_status VARCHAR(30) NOT NULL,
    
    -- Employer Information
    employer_name VARCHAR(200),
    employer_cr VARCHAR(20),
    employer_country VARCHAR(100),
    
    -- Job Details
    occupation VARCHAR(100),
    job_title VARCHAR(100),
    industry VARCHAR(100),
    
    -- Employment Dates
    employment_start_date DATE,
    employment_end_date DATE,
    years_of_experience INTEGER,
    
    -- Verification (GOSI)
    gosi_verified BOOLEAN DEFAULT FALSE,
    gosi_verified_at TIMESTAMP,
    gosi_reference VARCHAR(50),
    gosi_status VARCHAR(20),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    
    -- Constraints
    CONSTRAINT ck_employment_status CHECK (employment_status IN (
        'EMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'UNEMPLOYED', 'HOMEMAKER'
    )),
    CONSTRAINT ck_employment_dates CHECK (employment_end_date IS NULL OR employment_start_date <= employment_end_date)
);

CREATE INDEX idx_employment_customer ON KYC_EMPLOYMENT(customer_id);
CREATE INDEX idx_employment_status ON KYC_EMPLOYMENT(employment_status);
CREATE INDEX idx_gosi_verified ON KYC_EMPLOYMENT(gosi_verified);

-- ============================================================================
-- 4. KYC_FINANCIAL_PROFILE - Financial Information and Income
-- ============================================================================

CREATE TABLE KYC_FINANCIAL_PROFILE (
    financial_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL REFERENCES KYC_CUSTOMER_PROFILE(customer_id) ON DELETE CASCADE,
    
    -- Income Information
    monthly_income NUMERIC(15,2) NOT NULL,
    annual_income NUMERIC(15,2),
    income_source VARCHAR(100) NOT NULL,
    income_source_description TEXT,
    income_documentation_id VARCHAR(50),
    
    -- Expected Transaction Activity
    expected_monthly_deposits VARCHAR(100),
    expected_monthly_withdrawals VARCHAR(100),
    expected_intl_transfers_in VARCHAR(100),
    expected_intl_transfers_out VARCHAR(100),
    expected_monthly_transactions NUMERIC(10,0),
    
    -- Calculated Metrics
    activity_income_ratio NUMERIC(5,2) GENERATED ALWAYS AS (
        COALESCE(CAST(NULLIF(expected_monthly_deposits, '') AS NUMERIC), 0)::NUMERIC / 
        NULLIF(monthly_income, 0)
    ) STORED,
    stp_eligible BOOLEAN GENERATED ALWAYS AS (
        COALESCE(CAST(NULLIF(expected_monthly_deposits, '') AS NUMERIC), 0)::NUMERIC / 
        NULLIF(monthly_income, 0) <= 1.2
    ) STORED,
    
    -- Source of Funds
    source_of_funds VARCHAR(50) NOT NULL,
    source_of_wealth TEXT,
    source_documentation_id VARCHAR(50),
    
    -- Additional Income (if 120% ratio exceeded)
    additional_income_source VARCHAR(100),
    additional_income_amount NUMERIC(15,2),
    additional_documentation_id VARCHAR(50),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    
    -- Constraints
    CONSTRAINT ck_income_positive CHECK (monthly_income > 0),
    CONSTRAINT ck_source_of_funds CHECK (source_of_funds IN (
        'SALARY', 'BUSINESS', 'INVESTMENT', 'INHERITANCE', 'SAVINGS', 'GIFT', 'PENSION', 'OTHER'
    )),
    CONSTRAINT ck_activity_ratio CHECK (activity_income_ratio <= 1.5)
);

CREATE INDEX idx_financial_customer ON KYC_FINANCIAL_PROFILE(customer_id);
CREATE INDEX idx_stp_eligible ON KYC_FINANCIAL_PROFILE(stp_eligible);
CREATE INDEX idx_activity_ratio ON KYC_FINANCIAL_PROFILE(activity_income_ratio);

-- ============================================================================
-- 5. KYC_RISK_INDICATORS - Risk Assessment and Compliance Flags
-- ============================================================================

CREATE TABLE KYC_RISK_INDICATORS (
    risk_id VARCHAR(30) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL REFERENCES KYC_CUSTOMER_PROFILE(customer_id) ON DELETE CASCADE,
    edd_case_id VARCHAR(20),
    
    -- PEP Status
    pep_status VARCHAR(30) DEFAULT 'NO',
    pep_relationship VARCHAR(200),
    pep_source VARCHAR(50),
    pep_check_date TIMESTAMP,
    
    -- Sanctions Screening
    sanctions_list_hit BOOLEAN DEFAULT FALSE,
    sanctions_reason TEXT,
    sanctions_check_date TIMESTAMP,
    sanctions_list_used VARCHAR(100),
    sanctions_match_score NUMERIC(5,2),
    
    -- Occupation Risk
    occupation_risk_category VARCHAR(20) DEFAULT 'MEDIUM',
    occupation_risk_score NUMERIC(3,0) DEFAULT 50,
    high_risk_occupation BOOLEAN DEFAULT FALSE,
    
    -- Risk Reasons (Multiple)
    risk_reason_1 VARCHAR(300),
    risk_reason_2 VARCHAR(300),
    risk_reason_3 VARCHAR(300),
    risk_reason_4 VARCHAR(300),
    
    -- Tax Compliance (FATCA/CRS)
    us_person BOOLEAN DEFAULT FALSE,
    tax_residency_country VARCHAR(3),
    tax_identification_number VARCHAR(30),
    fatca_compliant BOOLEAN,
    crs_compliant BOOLEAN,
    tax_exemption_code VARCHAR(10),
    
    -- Overall Risk Assessment
    overall_risk_rating VARCHAR(20) DEFAULT 'MEDIUM',
    risk_decision VARCHAR(30) DEFAULT 'APPROVED',
    risk_decision_date TIMESTAMP,
    risk_decision_by VARCHAR(50),
    
    -- EDD Trigger Flags
    edd_trigger_reason VARCHAR(300),
    edd_escalated BOOLEAN DEFAULT FALSE,
    edd_escalated_to VARCHAR(50),
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by VARCHAR(50),
    reviewed_by VARCHAR(50),
    reviewed_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT ck_pep_status CHECK (pep_status IN (
        'YES', 'NO', 'RELATIVE_OF_PEP', 'FORMER_PEP', 'UNKNOWN'
    )),
    CONSTRAINT ck_risk_category CHECK (occupation_risk_category IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT ck_overall_risk CHECK (overall_risk_rating IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    CONSTRAINT ck_risk_decision CHECK (risk_decision IN ('APPROVED', 'ESCALATED_TO_EDD', 'REJECTED', 'PENDING'))
);

CREATE INDEX idx_risk_customer ON KYC_RISK_INDICATORS(customer_id);
CREATE INDEX idx_risk_pep ON KYC_RISK_INDICATORS(pep_status);
CREATE INDEX idx_risk_sanctions ON KYC_RISK_INDICATORS(sanctions_list_hit);
CREATE INDEX idx_risk_rating ON KYC_RISK_INDICATORS(overall_risk_rating);
CREATE INDEX idx_edd_trigger ON KYC_RISK_INDICATORS(edd_trigger_reason) WHERE edd_escalated = TRUE;

-- ============================================================================
-- 6. KYC_CONSENT_AUDIT - Consent and Compliance Audit Trail
-- ============================================================================

CREATE TABLE KYC_CONSENT_AUDIT (
    consent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR(20) NOT NULL REFERENCES KYC_CUSTOMER_PROFILE(customer_id) ON DELETE CASCADE,
    
    -- Consent Details
    consent_type VARCHAR(100) NOT NULL,
    consent_version INTEGER DEFAULT 1,
    consent_text TEXT,
    
    -- Acceptance
    consent_given_at TIMESTAMP NOT NULL,
    consent_accepted_by VARCHAR(50) NOT NULL,
    consent_acceptance_method VARCHAR(50),
    consent_ip_address VARCHAR(15),
    consent_user_agent TEXT,
    
    -- Expiry and Withdrawal
    consent_expiry_at TIMESTAMP,
    consent_withdrawn_at TIMESTAMP,
    consent_withdrawal_reason VARCHAR(200),
    
    -- Document Handling Consent
    document_retention_months INTEGER DEFAULT 7,
    
    -- Audit Hash for Non-Repudiation
    audit_hash VARCHAR(256),
    audit_hash_algorithm VARCHAR(20) DEFAULT 'SHA256',
    
    -- System Fields
    record_created_by VARCHAR(50) NOT NULL,
    record_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    record_modified_by VARCHAR(50),
    record_modified_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT ck_consent_type CHECK (consent_type IN (
        'KYC_SUBMISSION', 'DATA_PROCESSING', 'DOCUMENT_UPLOAD', 'FATCA_DECLARATION'
    ))
);

CREATE INDEX idx_consent_customer ON KYC_CONSENT_AUDIT(customer_id);
CREATE INDEX idx_consent_date ON KYC_CONSENT_AUDIT(consent_given_at);
CREATE INDEX idx_consent_withdrawn ON KYC_CONSENT_AUDIT(consent_withdrawn_at) WHERE consent_withdrawn_at IS NOT NULL;

-- ============================================================================
-- 7. AUDIT VIEWS - Read-only views for reporting
-- ============================================================================

CREATE VIEW VW_KYC_CUSTOMER_360_VIEW AS
SELECT 
    p.customer_id,
    p.rim_number,
    p.full_name_en,
    p.full_name_ar,
    p.qid_number,
    p.nationality,
    p.date_of_birth,
    p.risk_rating,
    c.mobile_number,
    c.email,
    e.employer_name,
    e.occupation,
    f.monthly_income,
    f.source_of_funds,
    r.pep_status,
    r.sanctions_list_hit,
    r.overall_risk_rating,
    r.edd_trigger_reason,
    p.kyc_version,
    p.kyc_last_updated
FROM KYC_CUSTOMER_PROFILE p
LEFT JOIN KYC_CONTACT_INFO c ON p.customer_id = c.customer_id
LEFT JOIN KYC_EMPLOYMENT e ON p.customer_id = e.customer_id
LEFT JOIN KYC_FINANCIAL_PROFILE f ON p.customer_id = f.customer_id
LEFT JOIN KYC_RISK_INDICATORS r ON p.customer_id = r.customer_id;

CREATE VIEW VW_KYC_EDD_TRIGGERS AS
SELECT 
    ri.risk_id,
    kcp.customer_id,
    kcp.rim_number,
    kcp.full_name_en,
    ri.edd_trigger_reason,
    ri.overall_risk_rating,
    ri.risk_decision,
    kcp.risk_rating,
    fi.activity_income_ratio,
    ri.pep_status,
    ri.sanctions_list_hit,
    ri.created_at as trigger_date
FROM KYC_RISK_INDICATORS ri
JOIN KYC_CUSTOMER_PROFILE kcp ON ri.customer_id = kcp.customer_id
LEFT JOIN KYC_FINANCIAL_PROFILE fi ON kcp.customer_id = fi.customer_id
WHERE ri.edd_escalated = TRUE
ORDER BY ri.created_at DESC;

CREATE VIEW VW_KYC_RISK_SUMMARY AS
SELECT 
    overall_risk_rating,
    COUNT(*) as customer_count,
    COUNT(CASE WHEN pep_status IN ('YES', 'RELATIVE_OF_PEP') THEN 1 END) as pep_count,
    COUNT(CASE WHEN sanctions_list_hit = TRUE THEN 1 END) as sanctions_count,
    COUNT(CASE WHEN edd_escalated = TRUE THEN 1 END) as edd_escalated_count
FROM KYC_RISK_INDICATORS
GROUP BY overall_risk_rating;

-- ============================================================================
-- 8. STORED PROCEDURES - Business Logic
-- ============================================================================

-- Function: Calculate Activity to Income Ratio
CREATE OR REPLACE FUNCTION fn_calculate_activity_ratio(
    p_deposits VARCHAR,
    p_income NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
    v_deposits NUMERIC;
BEGIN
    IF p_deposits IS NULL OR p_deposits = '' THEN
        RETURN 0;
    END IF;
    
    v_deposits := NULLIF(p_deposits, '')::NUMERIC;
    
    IF v_deposits IS NULL OR p_income <= 0 THEN
        RETURN 0;
    END IF;
    
    RETURN ROUND(v_deposits / p_income, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Determine STP Eligibility
CREATE OR REPLACE FUNCTION fn_check_stp_eligibility(
    p_customer_id VARCHAR
) RETURNS RECORD AS $$
DECLARE
    v_result RECORD;
BEGIN
    SELECT 
        activity_income_ratio <= 1.2 as eligible,
        CASE 
            WHEN activity_income_ratio > 1.2 THEN 'Additional documentation required'
            WHEN (SELECT sanctions_list_hit FROM KYC_RISK_INDICATORS WHERE customer_id = p_customer_id) THEN 'Sanctions hit'
            WHEN (SELECT pep_status FROM KYC_RISK_INDICATORS WHERE customer_id = p_customer_id) IN ('YES', 'RELATIVE_OF_PEP') THEN 'PEP status detected'
            ELSE 'Eligible for STP'
        END as reason
    INTO v_result
    FROM KYC_FINANCIAL_PROFILE
    WHERE customer_id = p_customer_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Procedure: Create KYC Record with Risk Assessment
CREATE OR REPLACE PROCEDURE sp_create_kyc_with_risk(
    p_customer_id VARCHAR,
    p_full_name_en VARCHAR,
    p_full_name_ar VARCHAR,
    p_qid_number VARCHAR,
    p_created_by VARCHAR
) AS $$
DECLARE
    v_risk_rating VARCHAR;
BEGIN
    -- Insert customer profile
    INSERT INTO KYC_CUSTOMER_PROFILE (
        customer_id, full_name_en, full_name_ar, qid_number, 
        created_by, created_at
    ) VALUES (
        p_customer_id, p_full_name_en, p_full_name_ar, p_qid_number,
        p_created_by, CURRENT_TIMESTAMP
    );
    
    -- Create risk indicators record
    INSERT INTO KYC_RISK_INDICATORS (
        risk_id, customer_id, created_at, updated_by
    ) VALUES (
        'RISK_' || p_customer_id, p_customer_id, CURRENT_TIMESTAMP, p_created_by
    );
    
    COMMIT;
    
EXCEPTION WHEN OTHERS THEN
    ROLLBACK;
    RAISE EXCEPTION 'Error creating KYC: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. TRIGGERS - Automatic Actions
-- ============================================================================

-- Trigger: Auto-update timestamp on modification
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_kyc_customer_update
BEFORE UPDATE ON KYC_CUSTOMER_PROFILE
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_kyc_contact_update
BEFORE UPDATE ON KYC_CONTACT_INFO
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_kyc_employment_update
BEFORE UPDATE ON KYC_EMPLOYMENT
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_kyc_financial_update
BEFORE UPDATE ON KYC_FINANCIAL_PROFILE
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_kyc_risk_update
BEFORE UPDATE ON KYC_RISK_INDICATORS
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

-- ============================================================================
-- 10. SAMPLE DATA - For Testing
-- ============================================================================

-- Sample 1: Low Risk Customer
INSERT INTO KYC_CUSTOMER_PROFILE (
    customer_id, rim_number, full_name_en, full_name_ar, 
    qid_number, qid_expiry, date_of_birth, gender, nationality,
    risk_rating, created_by
) VALUES (
    'CUST001', 'RIM001001', 'Ahmed Mohammed Al-Thani', 'أحمد محمد الثاني',
    '11234567890', '2028-06-15', '1985-03-20', 'M', 'QAT',
    'LOW', 'SYSTEM'
);

INSERT INTO KYC_CONTACT_INFO (
    contact_id, customer_id, mobile_number, email, street_name, 
    building_number, zone, city, postal_code, country
) VALUES (
    'CT001', 'CUST001', '+974 4444 1234', 'ahmed@example.qa',
    'Al-Corniche Road', '123', 'Doha', 'Doha', '22001', 'Qatar'
);

INSERT INTO KYC_EMPLOYMENT (
    employment_id, customer_id, employment_status, employer_name,
    occupation, industry, gosi_verified
) VALUES (
    'EMP001', 'CUST001', 'EMPLOYED', 'QIB - Qatar Islamic Bank',
    'Senior Manager', 'Banking', TRUE
);

INSERT INTO KYC_FINANCIAL_PROFILE (
    financial_id, customer_id, monthly_income, income_source,
    source_of_funds, expected_monthly_deposits, expected_monthly_withdrawals
) VALUES (
    'FIN001', 'CUST001', 15000.00, 'Employment',
    'SALARY', '15000', '10000'
);

INSERT INTO KYC_RISK_INDICATORS (
    risk_id, customer_id, overall_risk_rating, pep_status,
    sanctions_list_hit, risk_decision, updated_by
) VALUES (
    'RISK001', 'CUST001', 'LOW', 'NO', FALSE, 'APPROVED', 'SYSTEM'
);

-- ============================================================================
-- PERMISSIONS (Example - Adjust per your security model)
-- ============================================================================

-- Grant SELECT on views to read-only users
-- GRANT SELECT ON VW_KYC_CUSTOMER_360_VIEW TO "kyc_reader";
-- GRANT SELECT ON VW_KYC_EDD_TRIGGERS TO "kyc_reader";
-- GRANT SELECT ON VW_KYC_RISK_SUMMARY TO "kyc_reader";

-- Grant full access to admin users
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO "kyc_admin";
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO "kyc_admin";

-- ============================================================================
-- POST-IMPLEMENTATION CHECKLIST
-- ============================================================================
/*

1. VERIFY TABLE CREATION:
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' AND table_name LIKE 'KYC_%';

2. VERIFY INDEXES:
   SELECT tablename, indexname FROM pg_indexes 
   WHERE tablename LIKE 'KYC_%';

3. VERIFY VIEWS:
   SELECT viewname FROM pg_views 
   WHERE viewname LIKE 'VW_KYC_%';

4. VERIFY FUNCTIONS:
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name LIKE 'fn_%' OR routine_name LIKE 'sp_%';

5. TEST SAMPLE DATA:
   SELECT * FROM VW_KYC_CUSTOMER_360_VIEW;

6. BACKUP DATABASE:
   pg_dump -U postgres edd_qib_db > edd_qib_db_backup_20260309.sql

7. GENERATE DOCUMENTATION:
   \dt+ KYC_* (in psql)
   \d KYC_CUSTOMER_PROFILE (schema detail)

*/

-- ============================================================================
-- END OF SCHEMA DEFINITION
-- ============================================================================
