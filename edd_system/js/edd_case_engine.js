// ============================================================================
// EDD CASE ENGINE - Core Workflow & Business Logic
// This is the main integration point between KYC and EDD Case Management
// ============================================================================

const DATABASE = require('./database_connection');
const NOTIFICATION_ENGINE = require('./notification_engine');
const WORKFLOW_ROUTER = require('./workflow_router');
const CONTACT_CENTER = require('./contact_center_integration');
const LOGGER = require('./logger');

class EDDCaseEngine {
    
    /**
     * MAIN ENTRY POINT: KYC Form Submission Creates EDD Case
     * Called when kyc_form.html is submitted
     */
    async submitKYCandCreateCase(kycData) {
        try {
            LOGGER.info(`KYC Submission received for RIM: ${kycData.rim_number}`);
            
            // Step 1: Validate KYC Data
            const validation = this.validateKYCData(kycData);
            if (!validation.valid) {
                return { status: 'ERROR', message: validation.errors };
            }
            
            // Step 2: Assess Risk from KYC Data
            const riskAssessment = await this.assessRiskFromKYC(kycData);
            
            // Step 3: Decide if EDD is Required
            const eddRequired = this.shouldTriggerEDD(riskAssessment);
            
            // Step 4: Create EDD Case (if required)
            let caseId = null;
            if (eddRequired) {
                caseId = await this.createEDDCase(kycData, riskAssessment);
                LOGGER.info(`EDD Case created: ${caseId}`);
            }
            
            // Step 5: Route Case to Correct Queue
            if (eddRequired) {
                await this.routeCase(caseId, riskAssessment);
            }
            
            // Step 6: Send Notifications
            if (eddRequired) {
                await this.sendNotifications(caseId, 'CASE_CREATED', kycData);
            }
            
            return {
                status: 'SUCCESS',
                kyc_id: kycData.kyc_id,
                edd_case_created: eddRequired,
                case_id: caseId,
                risk_decision: riskAssessment.overall_risk_rating,
                message: eddRequired ? 'Enhanced Due Diligence Required' : 'KYC Approved'
            };
            
        } catch (error) {
            LOGGER.error(`Error in submitKYCandCreateCase: ${error.message}`);
            throw error;
        }
    }

    // ========================================================================
    // RISK ASSESSMENT LOGIC
    // ========================================================================
    
    /**
     * Assess Risk from KYC Data
     */
    async assessRiskFromKYC(kycData) {
        const riskFactors = {};
        const riskReasons = [];
        let totalRiskScore = 0;
        
        // 1. Nationality Risk
        const sanctionedCountries = ['IRN', 'PRK', 'SYR'];
        if (sanctionedCountries.includes(kycData.nationality)) {
            riskFactors.nationality_risk = 'CRITICAL';
            riskReasons.push('Customer from sanctioned country');
            totalRiskScore += 100;
        }
        
        // 2. PEP Risk
        if (kycData.pep_status === 'YES' || kycData.pep_status === 'RELATIVE_OF_PEP') {
            riskFactors.pep_risk = 'HIGH';
            riskReasons.push(`PEP Status: ${kycData.pep_status}`);
            totalRiskScore += 40;
        }
        
        // 3. Occupation Risk
        const highRiskOccupations = ['LAWYER', 'ACCOUNTANT', 'POLITICIAN', 'DIPLOMAT'];
        if (highRiskOccupations.includes(kycData.job_title?.toUpperCase())) {
            riskFactors.occupation_risk = 'MEDIUM';
            riskReasons.push(`High-risk occupation: ${kycData.job_title}`);
            totalRiskScore += 30;
        }
        
        // 4. Financial Activity Risk (120% Rule)
        if (kycData.monthly_income && kycData.expected_deposits) {
            const ratio = parseInt(kycData.expected_deposits) / parseInt(kycData.monthly_income);
            if (ratio > 1.2) {
                riskFactors.activity_risk = 'MEDIUM';
                riskReasons.push(`Activity/Income Ratio: ${ratio.toFixed(2)} (Exceeds 120%)`);
                totalRiskScore += 25;
            }
        }
        
        // 5. Source of Funds Risk
        if (kycData.source_of_funds === 'OTHER' || kycData.source_of_funds === 'GIFT') {
            riskFactors.source_of_funds_risk = 'LOW';
            riskReasons.push(`Unclear source of funds: ${kycData.source_of_funds}`);
            totalRiskScore += 15;
        }
        
        // 6. US Person / FATCA Risk
        if (kycData.us_person === 'YES') {
            riskFactors.fatca_risk = 'LOW';
            riskReasons.push('US Person - FATCA Reporting Required');
            totalRiskScore += 10;
        }
        
        // Calculate Overall Risk
        let overallRiskRating = 'LOW';
        if (totalRiskScore >= 60) {
            overallRiskRating = 'CRITICAL';
        } else if (totalRiskScore >= 40) {
            overallRiskRating = 'HIGH';
        } else if (totalRiskScore >= 20) {
            overallRiskRating = 'MEDIUM';
        }
        
        return {
            risk_factors: riskFactors,
            risk_reasons: riskReasons,
            overall_risk_rating: overallRiskRating,
            risk_score: totalRiskScore,
            activity_ratio: kycData.expected_deposits && kycData.monthly_income ? 
                (parseInt(kycData.expected_deposits) / parseInt(kycData.monthly_income)).toFixed(2) : 0
        };
    }
    
    /**
     * Should This Customer Trigger EDD?
     */
    shouldTriggerEDD(riskAssessment) {
        const THRESHOLD = 60; // Configurable in database
        return riskAssessment.risk_score >= THRESHOLD || 
               riskAssessment.overall_risk_rating === 'HIGH' ||
               riskAssessment.overall_risk_rating === 'CRITICAL';
    }

    // ========================================================================
    // CASE CREATION
    // ========================================================================
    
    /**
     * Create EDD Case in Database
     */
    async createEDDCase(kycData, riskAssessment) {
        const caseId = this.generateCaseId();
        
        const query = `
            INSERT INTO edd_cases (
                case_id, kyc_id, customer_id, rim_number,
                case_type, case_status, case_priority,
                trigger_reason, risk_rating, risk_score,
                created_by, created_at
            ) VALUES (
                $1, $2, $3, $4,
                $5, $6, $7,
                $8, $9, $10,
                $11, NOW()
            )
            RETURNING case_id
        `;
        
        const values = [
            caseId,
            kycData.kyc_id,
            kycData.customer_id,
            kycData.rim_number,
            'EDD',
            'PENDING',
            riskAssessment.overall_risk_rating === 'CRITICAL' ? 'URGENT' : 'NORMAL',
            riskAssessment.risk_reasons.join('; '),
            riskAssessment.overall_risk_rating,
            riskAssessment.risk_score,
            'SYSTEM'
        ];
        
        const result = await DATABASE.query(query, values);
        
        // Also insert risk assessment
        await this.insertRiskAssessment(caseId, riskAssessment);
        
        return caseId;
    }
    
    /**
     * Insert Detailed Risk Assessment
     */
    async insertRiskAssessment(caseId, riskAssessment) {
        const assessmentId = `RISK_${caseId}`;
        
        const query = `
            INSERT INTO case_risk_assessment (
                assessment_id, case_id,
                nationality_risk, occupation_risk, source_of_funds_risk,
                pep_risk, fatca_crs_risk,
                cumulative_risk_score, overall_risk_rating,
                risk_reason_1, risk_reason_2, risk_reason_3, risk_reason_4,
                assessed_by, assessed_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
            )
        `;
        
        const reasons = riskAssessment.risk_reasons;
        const values = [
            assessmentId,
            caseId,
            riskAssessment.risk_factors.nationality_risk || null,
            riskAssessment.risk_factors.occupation_risk || null,
            riskAssessment.risk_factors.source_of_funds_risk || null,
            riskAssessment.risk_factors.pep_risk || null,
            riskAssessment.risk_factors.fatca_risk || null,
            riskAssessment.risk_score,
            riskAssessment.overall_risk_rating,
            reasons[0] || null,
            reasons[1] || null,
            reasons[2] || null,
            reasons[3] || null,
            'SYSTEM'
        ];
        
        await DATABASE.query(query, values);
    }

    // ========================================================================
    // WORKFLOW ROUTING
    // ========================================================================
    
    /**
     * Route Case to Correct Team Based on Risk
     */
    async routeCase(caseId, riskAssessment) {
        const workflowStages = [
            { stage: 'BUSINESS', role: 'BUSINESS_ANALYST', sla_hours: 24 },
            { stage: 'CDD', role: 'CDD_OFFICER', sla_hours: 24 },
            { stage: 'COMPLIANCE', role: 'COMPLIANCE_OFFICER', sla_hours: 24 },
            { stage: 'DECISION', role: 'APPROVER', sla_hours: 8 }
        ];
        
        for (let i = 0; i < workflowStages.length; i++) {
            const stage = workflowStages[i];
            
            // Find available user in role
            const assignedUser = await WORKFLOW_ROUTER.findAvailableUser(stage.role);
            
            const query = `
                INSERT INTO workflow_queue (
                    case_id, current_workflow_stage, workflow_sequence,
                    assigned_role, assigned_user,
                    queue_status, queue_sequence_order,
                    sla_hours, due_date, created_by
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, 
                    NOW() + INTERVAL '1 hour' * $8,
                    'SYSTEM'
                )
            `;
            
            const values = [
                caseId,
                stage.stage,
                i + 1,
                stage.role,
                assignedUser,
                'PENDING',
                i + 1,
                stage.sla_hours
            ];
            
            await DATABASE.query(query, values);
        }
        
        LOGGER.info(`Case ${caseId} routed through all workflow stages`);
    }

    // ========================================================================
    // NOTIFICATIONS
    // ========================================================================
    
    /**
     * Send Notifications to Relevant Parties
     */
    async sendNotifications(caseId, eventType, kycData) {
        // Get case details
        const caseQuery = `
            SELECT ec.*, kcp.full_name_en, kcp.email
            FROM edd_cases ec
            JOIN KYC_CUSTOMER_PROFILE kcp ON ec.customer_id = kcp.customer_id
            WHERE ec.case_id = $1
        `;
        
        const caseResult = await DATABASE.query(caseQuery, [caseId]);
        const eddCase = caseResult.rows[0];
        
        // Notify Managers
        await NOTIFICATION_ENGINE.sendNotification({
            case_id: caseId,
            event_type: eventType,
            recipient_role: 'MANAGER',
            subject: `New EDD Case Created: ${kycData.full_name_en}`,
            message: `High-risk customer detected. Case: ${caseId}. Risk: ${eddCase.risk_rating}`,
            notification_type: 'EMAIL'
        });
        
        // Notify Business Analyst
        await NOTIFICATION_ENGINE.sendNotification({
            case_id: caseId,
            event_type: eventType,
            recipient_role: 'BUSINESS_ANALYST',
            subject: `New Case Assigned: ${kycData.full_name_en}`,
            message: `You have a new EDD case assigned. Customer: ${kycData.full_name_en}. RIM: ${kycData.rim_number}`,
            notification_type: 'EMAIL'
        });
        
        // Send SMS Alert for URGENT cases
        if (eddCase.case_priority === 'URGENT') {
            await NOTIFICATION_ENGINE.sendNotification({
                case_id: caseId,
                event_type: 'URGENT_CASE',
                recipient_role: 'MANAGER',
                message: `URGENT: High-risk customer case ${caseId} created`,
                notification_type: 'SMS'
            });
        }
    }

    // ========================================================================
    // CONTACT CENTER TRIGGER
    // ========================================================================
    
    /**
     * Request Contact Center Call for Customer Verification
     */
    async requestContactCenterCall(caseId, callType = 'VERIFICATION') {
        const caseQuery = `
            SELECT ec.*, kcp.mobile_number
            FROM edd_cases ec
            JOIN KYC_CUSTOMER_PROFILE kcp ON ec.customer_id = kcp.customer_id
            WHERE ec.case_id = $1
        `;
        
        const caseResult = await DATABASE.query(caseQuery, [caseId]);
        const eddCase = caseResult.rows[0];
        
        // Create contact center interaction request
        const interaction = await CONTACT_CENTER.createCallRequest({
            case_id: caseId,
            customer_id: eddCase.customer_id,
            phone_number: eddCase.mobile_number,
            call_type: callType,
            priority: eddCase.case_priority === 'URGENT' ? 'HIGH' : 'NORMAL'
        });
        
        // Update EDD case with contact center reference
        const updateQuery = `
            UPDATE edd_cases
            SET contact_center_case_id = $1
            WHERE case_id = $2
        `;
        
        await DATABASE.query(updateQuery, [interaction.interaction_id, caseId]);
        
        LOGGER.info(`Contact center call requested for case ${caseId}`);
        return interaction;
    }

    // ========================================================================
    // WORKFLOW PROGRESSION
    // ========================================================================
    
    /**
     * Complete Current Workflow Stage and Move to Next
     */
    async completeWorkflowStage(caseId, currentStage, decision, notes) {
        
        // Update current queue item
        const updateQuery = `
            UPDATE workflow_queue
            SET queue_status = 'COMPLETED',
                completed_at = NOW()
            WHERE case_id = $1 AND current_workflow_stage = $2
        `;
        
        await DATABASE.query(updateQuery, [caseId, currentStage]);
        
        // Get next stage
        const nextStageQuery = `
            SELECT current_workflow_stage, queue_sequence_order
            FROM workflow_queue
            WHERE case_id = $1 AND queue_sequence_order > (
                SELECT queue_sequence_order FROM workflow_queue 
                WHERE case_id = $1 AND current_workflow_stage = $2
            )
            ORDER BY queue_sequence_order ASC
            LIMIT 1
        `;
        
        const nextStageResult = await DATABASE.query(nextStageQuery, [caseId, currentStage]);
        
        if (nextStageResult.rows.length > 0) {
            // Move to next stage
            const nextStage = nextStageResult.rows[0];
            const moveQuery = `
                UPDATE workflow_queue
                SET queue_status = 'IN_PROGRESS'
                WHERE case_id = $1 AND current_workflow_stage = $2
            `;
            
            await DATABASE.query(moveQuery, [caseId, nextStage.current_workflow_stage]);
            
            LOGGER.info(`Case ${caseId} moved to ${nextStage.current_workflow_stage}`);
        } else {
            // All stages completed - make final decision
            await this.makeFinalDecision(caseId, decision, notes);
        }
    }
    
    /**
     * Make Final Decision on Case
     */
    async makeFinalDecision(caseId, finalDecision, notes) {
        const updateQuery = `
            UPDATE edd_cases
            SET final_decision = $1,
                final_decision_date = NOW(),
                final_decision_by = $2,
                case_status = 'COMPLETED',
                completed_at = NOW()
            WHERE case_id = $3
        `;
        
        const values = [finalDecision, 'APPROVAL_SYSTEM', caseId];
        await DATABASE.query(updateQuery, values);
        
        // Send final notification
        await NOTIFICATION_ENGINE.sendNotification({
            case_id: caseId,
            event_type: 'DECISION_MADE',
            recipient_role: 'MANAGER',
            subject: `EDD Case Decision: ${finalDecision}`,
            message: `Final decision on case ${caseId}: ${finalDecision}. Notes: ${notes}`,
            notification_type: 'EMAIL'
        });
        
        LOGGER.info(`Case ${caseId} finalized with decision: ${finalDecision}`);
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    generateCaseId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 10000);
        return `CHG${timestamp}${random}`.substring(0, 20);
    }
    
    validateKYCData(data) {
        const required = ['kyc_id', 'customer_id', 'rim_number', 'full_name_en', 'monthly_income'];
        const errors = [];
        
        for (const field of required) {
            if (!data[field]) {
                errors.push(`Missing required field: ${field}`);
            }
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    }
}

module.exports = new EDDCaseEngine();
