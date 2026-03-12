# DEMO SCENARIO EXAMPLES
## Five Realistic EDD Cases Showing Different Automation Outcomes

**Document Version:** 1.0  
**Effective Date:** March 12, 2026  
**Purpose:** Provide concrete examples for executive demo walkthroughs

---

## SCENARIO 1: STAGE C - AUTO-APPROVE (Qatari Employee)

### Case Overview
```
Case ID: EDD-2026-SC001
Customer: Abdullah Mohammed Al-Kuwari
Application Date: March 12, 2026
Processing Time: 18 minutes
Decision: AUTO-APPROVE (Stage C)
Confidence: 96%
```

### Customer Profile

| Field | Value |
|-------|-------|
| **Name** | Abdullah Mohammed Al-Kuwari |
| **Date of Birth** | May 15, 1988 (Age 37) |
| **Nationality** | Qatari |
| **National ID** | A-123456 (Valid until June 30, 2028) |
| **Mobile** | +974-5555-1001 |
| **Email** | abdalla.m@qib-private.qa |
| **Residence** | Doha, Qatar (Villa 42, Al-Waab) |

### Employment Profile

| Field | Value |
|-------|-------|
| **Employer** | Ministry of Finance |
| **Designation** | Senior Financial Analyst |
| **Employment Start** | January 2015 (11 years) |
| **Monthly Salary** | QAR 875,000 |
| **Salary Verified** | T24 (Government Transfer) |
| **Employment Letters** | Current, dated March 1, 2026 |

### Financial Profile

| Field | Value |
|-------|-------|
| **Primary Source of Funds** | Salary (Government) |
| **Expected Monthly Deposits** | QAR 875,000 (exact match) |
| **Expected Monthly Withdrawals** | QAR 400,000-600,000 (routine living) |
| **Net Worth Range** | QAR 2,000,000 - 6,000,000 |
| **Investment Accounts** | Fixed deposits, no active trading |
| **Loan History** | Auto loan (paid on time), home mortgage (current) |

### KYC Documentation

| Document | Status | Date |
|----------|--------|------|
| National ID Scan | ✅ Provided | March 10, 2026 |
| Salary Certificate | ✅ Provided | March 1, 2026 |
| Bank Statement (3 months) | ✅ Provided | March 12, 2026 |
| Employment Offer Letter | ✅ Provided | March 12, 2026 |
| Address Proof | ✅ Provided | March 5, 2026 |

### Compliance Checks

| Check | Result | Date |
|-------|--------|------|
| **OFAC/Sanctions** | ❌ No Match | March 12, 2026 14:23 |
| **PEP Check** | ❌ No Match | March 12, 2026 14:23 |
| **Adverse Media** | ❌ No Match | March 12, 2026 14:24 |
| **Fraud Alerts** | ❌ None | March 12, 2026 14:24 |
| **Transaction Monitoring** | ✅ No Alerts (30d) | Current |

### Risk Assessment Calculation

```
RISK SCORE BREAKDOWN:

Base: 0

Occupation Risk Factors:
  └─ Financial Analyst (Government) = +0 pts (standard occupation)

Geographic Risk Factors:
  └─ Qatari National = +0 pts (local residence)

Financial Risk Factors:
  └─ Monthly Income QAR 875K = +5 pts (comfortable range, public sector)

Source of Wealth Risk:
  └─ Government Salary = +0 pts (clear, verified source)

Compliance History:
  └─ No negative events (3+ years) = -5 pts (discount)

TOTAL RISK SCORE: 0/100
RISK BAND: LOW (0-35)
RISK ASSESSMENT: Very Low Risk
```

### System Decision Process

```
STAGE C ELIGIBILITY CHECK:

✅ DATA QUALITY: 98%
   - 13/13 mandatory fields populated
   - KYC refreshed 1 month ago (≤6 months required)
   - No missing data

✅ SOURCE SYSTEMS AVAILABLE
   - T24: Accessible ✓
   - KYC: Accessible ✓
   - AML Screen: Accessible ✓
   - CRM: Accessible ✓

✅ SANCTIONS & PEP VERIFICATION
   - Sanctions Check: CLEARED (negative result)
   - PEP Check: CLEARED (negative result)
   - Adverse Media: CLEARED (negative result)
   - All checks <30 days old

✅ RISK SCORE
   - Score: 0/100 (LOW RISK, Stage C threshold ≤35)

✅ DOCUMENT COMPLETENESS
   - 5/5 documents provided (100%)
   - All documents valid and not expired
   - All documents OCR-readable (95%+ quality)

✅ EMPLOYMENT VERIFICATION
   - Verified with T24 system
   - Government transfer visible
   - Employer confirms employment

✅ SOURCE OF WEALTH
   - Documented: Government salary
   - Explanation: Primary government employment income
   - Credible & verified

✅ NO FALLBACK TRIGGERS
   - No PEP match
   - No sanctions match
   - No fraud alerts
   - No data conflicts
   - No system issues

═══════════════════════════════════════════════════════════

STAGE C ELIGIBILITY: ✅ FULLY AUTOMATIC-ELIGIBLE

DECISION ENGINE RESULT: AUTO-APPROVE
DECISION CODE: AA-001
CONFIDENCE: 96% (Very High)

═══════════════════════════════════════════════════════════
```

### Decision Explanation (Plain Language)

**For System Log:**
> "This request meets all policy criteria for automated approval. Customer is Qatari national, public sector employee with verified income of QAR 875K/month from government transfer. All required documentation provided. Sanctions and PEP checks cleared. Risk profile very low (score 0). No exceptions or fallback triggers present. System has high confidence (96%) to AUTO-APPROVE."

**For Customer Email (Auto-sent):**
> "Dear Mr. Al-Kuwari,
> 
> Your Enhanced Due Diligence application has been processed and APPROVED.
> 
> We have completed our review of your application and are pleased to inform you that you have been approved for account activation. Your enhanced due diligence was processed automatically using our advanced risk assessment system, which verified:
> - Your identity (QAR National ID verified)
> - Your employment (Government sector confirmed)
> - Your income (QAR 875,000/month verified via government transfer)
> - All required supporting documents
> 
> Your account is now active and ready for use. You can access your account via our mobile app or online portal immediately.
> 
> If you have any questions, please contact us at +974-4489-1234."

### Outcome Timeline

```
2026-03-12 14:20:00 - Case created by customer (online portal)
2026-03-12 14:22:15 - Systems loaded data (T24, KYC, CRM, Documents)
2026-03-12 14:23:45 - Automated compliance checks (OFAC, PEP, Media)
2026-03-12 14:24:30 - Risk assessment calculated
2026-03-12 14:25:15 - Eligibility analysis completed (Stage C eligible)
2026-03-12 14:25:30 - AUTO-APPROVE decision made
2026-03-12 14:25:45 - Approval email sent to customer
2026-03-12 14:25:50 - SMS notification sent to customer
2026-03-12 14:26:00 - Account activated in T24 system
2026-03-12 14:26:30 - Branch notification sent (Downtown Branch)

TOTAL PROCESSING TIME: 6 minutes 30 seconds
(From case creation to full account activation)
```

### Demo Talking Points

1. **Speed**: "From submission to approval in 6.5 minutes - versus 2-3 days manual review"
2. **Consistency**: "Same criteria applied to every case - no human judgment variability"
3. **Completeness**: "System checks 20+ data points automatically - nothing is missed"
4. **Transparency**: "Full audit trail available - regulators can see exactly why we approved"
5. **Safety**: "Regulatory safeguards built in (PEP/sanctions hardstops) - never bypassed"

---

## SCENARIO 2: STAGE B - HUMAN-IN-LOOP (Business Owner)

### Case Overview
```
Case ID: EDD-2026-SB001
Customer: Fatima Ahmed Al-Marri
Application Date: March 12, 2026
Processing Time: 32 hours (1 day manual review)
Decision: APPROVED (After System Recommendation + Human Review)
Confidence: 82%
```

### Customer Profile

| Field | Value |
|-------|-------|
| **Name** | Fatima Ahmed Al-Marri |
| **Date of Birth** | March 8, 1982 (Age 44) |
| **Nationality** | Qatari |
| **National ID** | F-654321 (Valid until Dec 31, 2027) |
| **Mobile** | +974-5555-2002 |
| **Email** | fatima@almarri-consulting.qa |
| **Residence** | Doha, Qatar (Apartment 301, The Pearl) |

### Business Profile

| Field | Value |
|-------|-------|
| **Business Type** | Consulting (Management & Strategy) |
| **Business Name** | Al-Marri Consulting LLC |
| **Business Start** | January 2010 (16 years) |
| **Registration Number** | QA-CS-2010-0456 |
| **Expected Monthly Income** | QAR 500,000 - 750,000 (variable) |
| **Employees** | 12 staff members |
| **Major Clients** | QIB, Qatar Foundation, Private companies |

### Financial Profile (Complex)

| Field | Value |
|-------|-------|
| **Primary Income** | Business consulting fees |
| **Secondary Income** | Investment returns (~10% of total) |
| **Business Revenue (Annual)** | QAR 6,000,000 - 8,000,000 |
| **Net Profit Margin** | 35-40% |
| **Expected Monthly Deposits** | QAR 500,000 - 750,000 (variable) |
| **Expected Monthly Withdrawals** | QAR 300,000 - 500,000 (business + personal) |
| **Business Expenses** | Office rent, staff salary, consulting costs |
| **Net Worth Range** | QAR 4,000,000 - 8,000,000 |

### KYC Documentation (Incomplete Initially)

| Document | Status | Issue |
|----------|--------|-------|
| National ID Scan | ✅ Provided | Valid, not expired |
| Business Registration | ✅ Provided | Current registration |
| Tax Returns (2024) | ⏳ Provided | 2 months old, but acceptable |
| Business Bank Statements | ⏳ Provided (1 month) | Only 1 month provided, need 3 months |
| Employment Offer | N/A | Self-employed, not applicable |
| Address Proof | ✅ Provided | Recent utility bill |

### Compliance Checks

| Check | Result | Date |
|-------|--------|------|
| **OFAC/Sanctions** | ❌ No Match | March 12, 2026 14:45 |
| **PEP Check** | ❌ No Match | March 12, 2026 14:45 |
| **Adverse Media** | ❌ No Match | March 12, 2026 14:46 |
| **Fraud Alerts** | ❌ None | March 12, 2026 14:47 |
| **Business Verification** | ⚠️ Pending | In progress |

### Risk Assessment Calculation

```
RISK SCORE BREAKDOWN:

Base: 0

Occupation Risk Factors:
  └─ Business Owner/Consultant = +15 pts (unverified business income)

Geographic Risk Factors:
  └─ Qatari National = +0 pts (local residence)

Financial Risk Factors:
  └─ Monthly Income QAR 500-750K = +8 pts (variable, business-dependent)

Source of Wealth Risk:
  └─ Business earnings (partially verified) = +10 pts
     (Business is real, but income credibility needs more docs)

Compliance History:
  └─ No negative events (3+ years) = -5 pts (discount)

TOTAL RISK SCORE: 28/100
RISK BAND: LOW-MEDIUM BORDERLINE (approaching 35-36 threshold)
RISK ASSESSMENT: Low-Medium Risk
```

### System Decision Process

```
STAGE C ELIGIBILITY CHECK:

❌ DOCUMENT COMPLETENESS: 75% (Not enough for Stage C)
   - National ID: ✅
   - Business Reg: ✅
   - Tax Returns: ✅
   - Bank Statements: ⚠️ Only 1 month (need 3 months minimum)
   - Residence Proof: ✅
   Status: Document gap - missing 2 months of bank statements

❌ SOURCE OF WEALTH CLARITY: Partial
   - Business documented: ✅
   - Business income verified: ⚠️ Partial (tax returns show ~QAR 6M annual)
   - Expected deposits: ⏳ Need to verify 3-month average

❌ EMPLOYMENT VERIFICATION: N/A (Self-employed)
   - No employer to verify
   - Business income needs verification instead

FALLBACK TRIGGERS: Instead of auto (Stage C), recommend escalate to Stage B

═══════════════════════════════════════════════════════════

STAGE C ELIGIBILITY: ❌ NOT ELIGIBLE

STAGE B ELIGIBILITY: ✅ ELIGIBLE FOR HUMAN-IN-LOOP
   - Risk score 28 (below 36 threshold) ✓
   - Most documents provided (75%) ✓
   - Clear compliance (no PEP/sanctions) ✓
   - Fallback reason: Document gap (resolvable)

SYSTEM DECISION: AUTO-REQUEST DOCUMENTS + ROUTE TO HUMAN REVIEW
RECOMMENDATION: "Request 2 additional months of business bank statements.
                Once provided, case can auto-approve or human can review."
CONFIDENCE: 82% (moderate, conditional on documents)

═══════════════════════════════════════════════════════════
```

### System Recommendation to Human Analyst

**Auto-Generated Recommendation:**
> "This moderate-risk business owner case is eligible for Stage B (human-in-loop) review. Customer has low risk score (28/100) and clean compliance history. Main Gap: Need 3 recent months of business bank statements to verify stated monthly income (customer provided only 1 month). Recommendation: Request the 2 missing months from customer. If provided: Can auto-approve. If not provided within 30 days: Can auto-reject as incomplete."

### Customer Document Request (Auto-Sent)

**Email to Customer:**
> "Dear Ms. Al-Marri,
> 
> Thank you for submitting your Enhanced Due Diligence application. We have reviewed your initial submission and are pleased with the progress.
> 
> To complete our review, we need one additional document:
> 
> **REQUIRED: Business Bank Statements (3 months)**
> We received your January 2026 statement. Please also provide:
> - December 2025 statement
> - February 2026 statement
> 
> This will help us verify your stated monthly business income (QAR 500-750K).
> 
> **Deadline:** 30 days (April 11, 2026)
> **How to Submit:** Upload via QIB customer portal or bring to any branch
> 
> Once received, we can complete your application within 1-2 business days.
> 
> Questions? Call us at +974-4489-1234."

### After-Documents Received (Human Analyst Review)

**Analyst Sees (Day 2):**
- Original application + all initial documents
- System analysis showing risk score 28, eligible for auto-approval if docs complete
- New: 3 complete months of business account statements (Jan, Feb, Mar 2026)
- Bank statements show: ~QAR 475K (Jan), ~QAR 620K (Feb), ~QAR 750K (Mar)
- Average monthly deposits: QAR 615K (within stated range)

**Analyst Decision (Same Day):**
> "Documents received and verified. Business income confirmed:
> - 3-month average deposits: QAR 615K (matches stated range of 500-750K)
> - All deposits are consulting fees from registered clients
> - No unusual patterns or red flags
> - All documents provided and verified
>  
> ANALYST DECISION: ✅ APPROVE
> 
> Reason: Customer meets all criteria. Business is legitimate (16-year history),
> income is verifiable from bank statements, compliance is clear, risk score
> is acceptable. Proceeding with account approval."

### Outcome Timeline

```
2026-03-12 10:00:00 - Case created by customer
2026-03-12 14:47:00 - System analysis complete (Stage B eligible)
2026-03-12 14:48:00 - Auto-request email sent to customer
2026-03-13 09:30:00 - Customer uploads 2 additional bank statements
2026-03-13 10:15:00 - Documents received and validated by system
2026-03-13 14:30:00 - Human analyst reviews (automated routing)
2026-03-13 15:45:00 - Analyst approves (documents verified)
2026-03-13 16:00:00 - Approval email sent to customer
2026-03-13 16:15:00 - Account activated
2026-03-13 16:30:00 - Branch notification sent

TOTAL PROCESSING TIME: 1 day 6 hours 30 minutes
(From submission to approval, including 20+ hour waiting for customer to provide docs)
HUMAN REVIEW TIME: 1 hour 15 minutes (analyst work only)
```

### Demo Talking Points

1. **Hybrid Model**: "System recommends, human decides - balancing speed with expertise"
2. **Smart Routing**: "System identifies exactly what's needed - don't ask for unnecessary documents"
3. **Analyst Empowerment**: "Analysts focus on judgment calls, not routine data checking"
4. **Time Efficiency**: "Instead of 2-3 day review, unblocked to 1-2 hours once documents provided"
5. **Customer Service**: "Clear guidance on what's needed & deadline - better customer experience"

---

## SCENARIO 3: FALLBACK - PEP FLAG (Escalation)

### Case Overview
```
Case ID: EDD-2026-SF001
Customer: Samir Khalil Al-Ajmi
Application Date: March 12, 2026
Processing Time: ESCALATED (no auto)
Decision: ESCALATION → Compliance Officer (Enhanced CDD)
Confidence: N/A (Fallback Trigger: Regulatory Requirement)
```

### Customer Profile

| Field | Value |
|-------|-------|
| **Name** | Samir Khalil Al-Ajmi |
| **Date of Birth** | September 20, 1975 (Age 50) |
| **Nationality** | Qatari |
| **National ID** | S-789012 (Valid until Sept 30, 2027) |
| **Mobile** | +974-5555-3003 |
| **Email** | s.alajmi@example.qa |
| **Residence** | Doha, Qatar |

### Key Profile Information

| Field | Value |
|-------|-------|
| **Current Position** | Advisor (Senior Government) |
| **Years in Position** | 8 years |
| **Monthly Income** | QAR 1,200,000 |
| **Net Worth** | QAR 15,000,000+ |
| **Employment** | Government Ministry |

### Compliance Checks - PEP MATCH DETECTED

| Check | Result | Details |
|-------|--------|---------|
| **OFAC/Sanctions** | ❌ No Match | Clear |
| **PEP Check** | ⚠️ **MATCH DETECTED** | State Database - Senior Advisor Position |
| **Adverse Media** | ❌ No Match | Clear |
| **Family PEP Check** | ⏳ **PENDING** | Checking family connections |

### PEP Match Details

```
PEP DATABASE HIT:

Database: Qatar Central Bank (QCB) - Politically Exposed Persons List
Match Type: DIRECT PEP (Customer is the PEP)
Name Match: Samir Khalil Al-Ajmi
Position: Senior Advisor, Government Ministry
Category: Government Officials (Domestic)
Appointment Date: 2018-03-15
Match Confidence: 99.2% (name, DOB, position match)

Status: ACTIVE - Currently in position

Regulatory Requirement: Enhanced Due Diligence MANDATORY
```

### System Decision Process

```
FALLBACK TRIGGER DETECTED: PEP_MATCH

═══════════════════════════════════════════════════════════

AUTOMATIC DECISION PATH STOPS IMMEDIATELY

Stage C Check Result: ❌ CANNOT PROCEED
Reason: PEP flag is non-negotiable fallback trigger
        (Regulatory requirement - cannot auto-approve)

Stage B Check Result: ❌ CANNOT PROCEED
Reason: PEP flag requires escalation regardless of risk profile

Stage A Action: ✅ MANUAL REVIEW REQUIRED

ESCALATION: MANDATORY TO COMPLIANCE OFFICER
Queue: Compliance & CDD Team
SLA: 4 business hours (urgent escalation)

DECISION: IMMEDIATE ESCALATION (Case Code: ESCALATE_PEP_IMMEDIATE)

═══════════════════════════════════════════════════════════
```

### Escalation Notice (System Generated)

**Internal Case Alert to Compliance Officer:**
> "🚨 PEP ESCALATION ALERT
> 
> Case ID: EDD-2026-SF001
> Customer: Samir Khalil Al-Ajmi
> Alert Type: PEP Direct Match (Active)
> 
> PEP Status: Government Official
> Risk Level: HIGH (PEP = Enhanced CDD Required)
> 
> AUTOMATED WORKFLOW STOPPED
> Reason: PEP match is fallback trigger - cannot auto-process
> 
> ACTION REQUIRED: Enhanced Due Diligence (CDD) Review
> SLA: 4 business hours
> 
> Next Steps:
> 1. Contact customer - Explain CDD requirement (NOT accusatory)
> 2. Request Enhanced CDD documents (source of wealth, business interests, etc)
> 3. Investigate any family/connected persons PEP status
> 4. Document all findings
> 5. Make approval/rejection decision based on CDD findings
> 
> Assigned to: Compliance Officer (On Duty)
> Due: March 12, 2026 18:30 (4 hours)"

### Customer Notification (Tactful)

**Email Sent Automatically:**
> "Dear Mr. Al-Ajmi,
> 
> Thank you for your Enhanced Due Diligence application. Your application is now under professional review by our senior compliance team.
> 
> As part of our standard procedures for customers in senior positions, we conduct additional verification to ensure we meet international regulatory standards. This is a routine requirement and does not indicate any concern about your integrity.
> 
> Our compliance team will contact you within 1-2 business days to discuss the additional information needed to complete your review. This typically includes documentation of your business interests and source of wealth.
> 
> Expected timeline for completion: 5-7 business days
> 
> If you have any questions in the meantime, please contact our customer service team at +974-4489-1234.
> 
> Best regards,
> QIB Customer Service"

### Enhanced CDD Process

**What Compliance Officer Must Verify:**

1. **Source of Wealth Documentation**
   - Government salary: QAR 1,200,000/month (primary income)
   - Investment portfolio: Real estate holdings, securities
   - Business interests: Any directorship or business ownership
   - Family wealth: Sources of family wealth

2. **Beneficial Ownership Check**
   - Any companies where customer is shareholder >25%
   - Family business interests
   - Trust arrangements

3. **Conflicts of Interest Check**
   - Business dealings with customers
   - Personal financial interests related to government role
   - Regulatory restrictions on customer type

4. **Enhanced Documentation**
   - 2-year tax returns
   - Business registration documents
   - Real estate deed (wealth verification)
   - Bank statements (6 months - verify sources)

### Approval Decision (After CDD)

**Compliance Officer Final Assessment:**
> "ENHANCED DUE DILIGENCE COMPLETED
> 
> Findings:
> - Source of wealth: Confirmed government salary + family investments
> - Government role: Senior Advisor (legitimate position)
> - Conflict check: No conflicts identified with QIB operations
> - Beneficial ownership: No shell companies or hidden interests
> - Risk profile: Medium (due to PEP status, but legitimate wealth source)
> 
> CDD CONCLUSION: ACCEPTABLE
> 
> DECISION: ✅ APPROVE (with Enhanced Monitoring)
> 
> Conditions:
> - Account flagged for quarterly CDD refresh (PEP must be re-verified)
> - Transaction monitoring alert thresholds: Standard + Enhanced
> - Unusual activity alert: Lowered threshold (more aggressive monitoring)
> - Annual CDD review required
> 
> Status: APPROVED with Enhanced Ongoing Monitoring"

### Outcome Timeline

```
2026-03-12 14:47:00 - Case created by customer
2026-03-12 14:49:00 - AML screening: PEP match detected
2026-03-12 14:49:30 - AUTOMATED ESCALATION: Compliance Officer queue
2026-03-12 14:50:00 - Customer notification email sent
2026-03-12 15:30:00 - Compliance officer assigned
2026-03-12 15:45:00 - Compliance officer contacts customer (phone call)
2026-03-12 16:00:00 - Customer agrees to provide CDD documents
2026-03-13 11:00:00 - Customer uploads CDD documents (real estate, tax returns)
2026-03-13 14:00:00 - Compliance officer reviews documents
2026-03-13 16:30:00 - CDD investigation completed - APPROVED (with monitoring)
2026-03-14 09:00:00 - Account activated with enhanced monitoring flag
2026-03-14 09:30:00 - Customer notification of approval

TOTAL PROCESSING TIME: 1 day 19 hours
(From submission to final approval, including CDD investigation)
```

### Demo Talking Points

1. **Regulatory Safeguards**: "Automation stops immediately when regulations require it - hardcoded, not negotiable"
2. **Human Judgment**: "Complex cases escalate to compliance experts - they make the judgment call"
3. **Transparency**: "Customer knows why extended review is needed - we're not hiding the process"
4. **Ongoing Monitoring**: "Even after approval, PEP accounts get enhanced monitoring - continuous oversight"
5. **Risk Instead of Rejection**: "We don't automatically reject PEPs - we add extra controls and monitor more closely"

---

## SCENARIO 4: AUTO-REQUEST DOCUMENTS (Data Gap + Re-evaluation)

### Case Overview
```
Case ID: EDD-2026-SD001
Customer: Layla Hassan Al-Marri
Application Date: March 11, 2026
First Decision: AUTO-REQUEST DOCUMENTS
After Documents: AUTO-APPROVE (Stage C)
Total Processing: 3 days (1 day manual + 2 days customer response)
```

### Initial Risk Issue

**Missing Document:** Employment Verification
**Problem:** Customer claims employed, but no employment letter provided

**System Action:** Auto-request employment verification letter
**Customer Window:** 30 days to provide documents
**Result:** Customer provides within 2 days → Case re-evaluated → Auto-approved

### Customer Journey Flow

```
Day 1 - March 11, 2026:
  14:00 - Case submitted (incomplete - missing employment letter)
  14:30 - System analysis: Risk score 45 (MEDIUM, employment unverified)
  14:31 - System decision: AUTO-REQUEST-DOCUMENTS
  14:32 - Email sent to customer: "Please provide employment letter"
  
Day 2-3 - March 12-13, 2026:
  10:30 - Customer receives email
  14:00 - Customer logs in to portal
  14:15 - Customer uploads employment letter (dated March 1, 2026)
  14:20 - System validates document (readable, authentic, not expired)
  14:25 - System re-runs case analysis (all data now complete)
  14:26 - Risk score recalculated: 8 (LOW)
  14:27 - Stage C eligibility reassessed: NOW ELIGIBLE
  14:28 - System decision: AUTO-APPROVE
  14:30 - Approval email sent to customer
  14:35 - Account activated

TOTAL TIME: 2 days 30 minutes (including customer delay)
SYSTEM PROCESSING: <2 minutes
CUSTOMER ACTION TIME: 30 minutes (upload document)
```

### Demo Talking Points

1. **Smart Escalation**: "Instead of rejecting, system identifies what's missing and asks for it"
2. **Automation Resumption**: "When customer provides missing document, automation resumes automatically"
3. **Reduced Rejections**: "Fewer cases rejected outright - more get second chance"
4. **Customer Service**: "Clear communication on what's needed & timeline"
5. **Higher Approval Rate**: "Document-request path has 75%+ completion rate once docs provided"

---

## SCENARIO 5: STAGE A - MANUAL REVIEW (Complex High-Risk)

### Case Overview
```
Case ID: EDD-2026-SM001
Customer: Mohammed Saeed Al-Subaie
Application Date: March 10, 2026
Decision Authority: Manual Review by Senior Analyst
Status: Under Investigation
Expected Decision: March 17, 2026 (5-7 days)
Risk Indicators: Multiple
Automation Eligible: NO
```

### Case Complexity

**Why Not Automated:**
- Risk Score: 78/100 (HIGH - exceeds Stage C & Stage B thresholds)
- Multiple Risk Factors:
  - High-risk occupation (Legal profession)
  - Complex business structure
  - Offshore investment accounts
  - Occupation requires CDD

**System Assessment:**
```
Fallback Triggers Present:
❌ Risk Score >60 (exceeds Stage B threshold)
❌ High-risk occupation requires CDD (Lawyer)
⚠️ Complex source of wealth (multiple countries)
⚠️ Offshore accounts require investigation
```

### Analyst Review

**Assigned to:** Senior Compliance Analyst
**Review Time:** Investment of 4-6 hours
**Documents Reviewed:** 30+ pages of supporting docs

**Key Analyst Decision Points:**
1. Is the business structure legitimate?
2. Are offshore accounts compliant with regulations?
3. Is source of wealth properly explained?
4. Are there business conflicts with serving as lawyer?
5. Does this customer present elevated AML/CFT risk?

**Analyst Final Decision:** ✅ APPROVE (with Conditions)
- Higher ongoing monitoring due to high-risk occupation
- Quarterly CDD refresh (not annual)
- Real-time transaction alerts for suspicious patterns
- Annual compliance certification from law firm

### Demo Talking Points

1. **Complexity Handling**: "System recognizes when cases are too complex for automation - routes to experts"
2. **Analyst Expertise**: "Skilled analysts can make judgment calls that systems can't"
3. **Risk Management**: "Complex cases get more scrutiny, not less"
4. **Time Investment**: "We spend more time on high-risk cases - worth it for proper controls"
5. **Controlled Approval**: "Even high-risk approvals come with enhanced monitoring - never blind"

---

## SUMMARY: FIVE DEMO SCENARIOS

| Scenario | Stage | Automation | Time | Key Message |
|----------|-------|-----------|------|-------------|
| 1. Qatari Employee | C | AUTO-APPROVE | 6.5 min | Speed & Consistency |
| 2. Business Owner | B | System→Human | 1 day | Hybrid Model |
| 3. PEP Flag | Escalate | STOP | 1 day | Regulatory Safeguards |
| 4. Missing Docs | C | REQUEST→APPROVE | 3 days | Smart Routing |
| 5. Complex Case | A | MANUAL | 5-7 days | Expert Judgment |

---

**END OF DEMO SCENARIO EXAMPLES**

These five scenarios provide:
- ✅ Realistic customer profiles & data
- ✅ Complete decision workflows
- ✅ Actual timelines & outcomes
- ✅ Clear demo talking points for each stage
- ✅ Variety showing all automation paths (auto-approve, auto-request, human-review, escalation, manual)

**Ready for:** Executive presentations, regulatory briefings, staff training, system validation

---

**Document Version:** 1.0  
**Status:** Ready for Demo Use  
**Last Updated:** March 12, 2026
