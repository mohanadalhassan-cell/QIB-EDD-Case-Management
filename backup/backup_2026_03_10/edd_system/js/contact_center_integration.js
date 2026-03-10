// ============================================================================
// CONTACT CENTER INTEGRATION - Call Management & Recording System
// Handles inbound/outbound calls, SMS, emails linked to EDD cases
// ============================================================================

const DATABASE = require('./database_connection');
const LOGGER = require('./logger');

class ContactCenterIntegration {
    
    /**
     * Create Call Request for Customer Verification
     * Triggers contact center to make outbound call
     */
    async createCallRequest(caseId, callDetails) {
        try {
            // Get case and customer info
            const caseQuery = `
                SELECT ec.*, c.customer_name, c.phone_number, c.phone_number_mobile
                FROM edd_cases ec
                JOIN customers c ON ec.customer_id = c.customer_id
                WHERE ec.case_id = $1
            `;
            
            const caseResult = await DATABASE.query(caseQuery, [caseId]);
            if (!caseResult.rows.length) {
                throw new Error(`Case ${caseId} not found`);
            }
            
            const caseData = caseResult.rows[0];
            
            // Determine phone number
            const phoneNumber = callDetails.phone_number || 
                              caseData.phone_number_mobile || 
                              caseData.phone_number;
            
            if (!phoneNumber) {
                throw new Error('No valid phone number for customer');
            }
            
            // Create interaction record
            const insertQuery = `
                INSERT INTO contact_center_interaction (
                    case_id,
                    customer_id,
                    interaction_type,
                    interaction_subtype,
                    initiated_by,
                    customer_phone,
                    agent_name,
                    call_purpose,
                    scheduled_at,
                    interaction_status,
                    required_action,
                    created_at
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, 'TBD', $7, 
                    CASE WHEN $8::BOOLEAN THEN NOW() + INTERVAL '30 minutes' ELSE NULL END,
                    'SCHEDULED',
                    $9,
                    NOW()
                )
                RETURNING interaction_id, case_id
            `;
            
            const insertResult = await DATABASE.query(insertQuery, [
                caseId,
                caseData.customer_id,
                'OUTBOUND_CALL',
                callDetails.call_type || 'VERIFICATION',
                callDetails.initiated_by || 'SYSTEM',
                phoneNumber,
                callDetails.purpose || 'Customer verification for EDD',
                callDetails.schedule_immediate || false,
                callDetails.required_action || 'VERIFY_SOURCE_OF_FUNDS'
            ]);
            
            const interactionId = insertResult.rows[0].interaction_id;
            
            LOGGER.info(`Call request created: ${interactionId} for case ${caseId}`);
            
            // Trigger contact center queue (would integrate with actual contact center)
            await this.queueForContactCenter(interactionId, phoneNumber, callDetails);
            
            return {
                interaction_id: interactionId,
                case_id: caseId,
                phone_number: phoneNumber,
                status: 'SCHEDULED',
                message: `Call request scheduled for ${caseData.customer_name}`
            };
            
        } catch (error) {
            LOGGER.error(`Error in createCallRequest: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Queue Interaction for Contact Center Agent
     */
    async queueForContactCenter(interactionId, phoneNumber, callDetails) {
        try {
            // This would integrate with actual contact center API (e.g., Genesys, NICE)
            const apiPayload = {
                interaction_id: interactionId,
                phone_number: phoneNumber,
                call_type: callDetails.call_type || 'OUTBOUND',
                script: this.getCallScript(callDetails.call_type),
                notes: callDetails.purpose,
                priority: callDetails.urgent ? 'HIGH' : 'NORMAL'
            };
            
            // TODO: Send to contact center via REST API or message queue
            // Example: await CONTACT_CENTER_API.queueOutboundCall(apiPayload);
            
            LOGGER.info(`Interaction ${interactionId} queued for contact center`);
            
        } catch (error) {
            LOGGER.error(`Error queuing to contact center: ${error.message}`);
        }
    }
    
    /**
     * Update Interaction with Call Results
     */
    async updateInteraction(interactionId, callResult) {
        try {
            const updateQuery = `
                UPDATE contact_center_interaction
                SET 
                    interaction_status = $1,
                    agent_name = $2,
                    call_duration_seconds = $3,
                    recording_link = $4,
                    call_outcome = $5,
                    outcome_notes = $6,
                    call_completion_time = NOW(),
                    next_follow_up_date = CASE 
                        WHEN $7::BOOLEAN THEN NOW() + INTERVAL '7 days'
                        ELSE NULL
                    END
                WHERE interaction_id = $8
                RETURNING *
            `;
            
            const result = await DATABASE.query(updateQuery, [
                callResult.status || 'COMPLETED',
                callResult.agent_name,
                callResult.call_duration_seconds || 0,
                callResult.recording_link,
                callResult.outcome || 'INFORMATION_GATHERED',
                callResult.notes,
                callResult.requires_followup || false,
                interactionId
            ]);
            
            const interaction = result.rows[0];
            
            // Update case based on call outcome
            await this.updateCaseBasedOnCall(interaction);
            
            LOGGER.info(`Interaction ${interactionId} updated with outcome: ${callResult.outcome}`);
            
            return interaction;
            
        } catch (error) {
            LOGGER.error(`Error in updateInteraction: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Update EDD Case Based on Call Outcome
     */
    async updateCaseBasedOnCall(interaction) {
        try {
            const caseQuery = `
                SELECT * FROM edd_cases WHERE case_id = $1
            `;
            
            const caseResult = await DATABASE.query(caseQuery, [interaction.case_id]);
            if (!caseResult.rows.length) return;
            
            // Determine if more information needed
            let updatedRiskRating = null;
            let notes = `Call ${interaction.call_outcome}: ${interaction.outcome_notes}`;
            
            if (interaction.call_outcome === 'CUSTOMER_UNAVAILABLE') {
                notes += ' - Retry scheduled for follow-up';
            } else if (interaction.call_outcome === 'HIGH_RISK_CONFIRMED') {
                updatedRiskRating = 'CRITICAL';
                notes += ' - Escalating to compliance team';
            } else if (interaction.call_outcome === 'LOW_RISK_CONFIRMED') {
                updatedRiskRating = 'LOW';
                notes += ' - Case can proceed to decision stage';
            }
            
            // Update case with call findings
            const updateQuery = `
                UPDATE edd_cases
                SET 
                    case_status = CASE 
                        WHEN $1 IS NOT NULL THEN 'IN_REVIEW'
                        ELSE case_status
                    END,
                    risk_rating = COALESCE($1, risk_rating),
                    call_interaction_id = $2,
                    last_contact_date = NOW(),
                    notes = notes || E'\\n' || $3
                WHERE case_id = $4
            `;
            
            await DATABASE.query(updateQuery, [
                updatedRiskRating,
                interaction.interaction_id,
                notes,
                interaction.case_id
            ]);
            
            LOGGER.info(`Case ${interaction.case_id} updated based on call outcome`);
            
        } catch (error) {
            LOGGER.error(`Error updating case: ${error.message}`);
        }
    }
    
    /**
     * Attach Call Recording to Case
     */
    async attachRecording(interactionId, recordingUrl) {
        try {
            const updateQuery = `
                UPDATE contact_center_interaction
                SET recording_link = $1
                WHERE interaction_id = $2
            `;
            
            await DATABASE.query(updateQuery, [recordingUrl, interactionId]);
            
            LOGGER.info(`Recording attached to interaction: ${interactionId}`);
            
            return {
                status: 'RECORDING_ATTACHED',
                recording_url: recordingUrl
            };
            
        } catch (error) {
            LOGGER.error(`Error attaching recording: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Create Email Interaction
     */
    async sendEmail(caseId, recipient, emailSubject, emailBody, attachments = []) {
        try {
            // Get case info
            const caseQuery = `
                SELECT * FROM edd_cases WHERE case_id = $1
            `;
            
            const caseResult = await DATABASE.query(caseQuery, [caseId]);
            if (!caseResult.rows.length) {
                throw new Error(`Case ${caseId} not found`);
            }
            
            // Create interaction record
            const insertQuery = `
                INSERT INTO contact_center_interaction (
                    case_id,
                    customer_id,
                    interaction_type,
                    interaction_subtype,
                    initiated_by,
                    customer_email,
                    call_purpose,
                    interaction_status,
                    additional_data,
                    created_at
                ) VALUES (
                    $1, $2, 'EMAIL', 'OUTBOUND', 'SYSTEM', $3, $4, 'SENT',
                    jsonb_build_object(
                        'subject', $5,
                        'body_preview', LEFT($6, 200),
                        'attachments', $7::jsonb
                    ),
                    NOW()
                )
                RETURNING interaction_id
            `;
            
            const result = await DATABASE.query(insertQuery, [
                caseId,
                caseResult.rows[0].customer_id,
                recipient,
                emailSubject,
                emailSubject,
                emailBody,
                JSON.stringify(attachments)
            ]);
            
            const interactionId = result.rows[0].interaction_id;
            
            // TODO: Send email via email service
            // await EMAIL_SERVICE.send({
            //     to: recipient,
            //     subject: emailSubject,
            //     html: emailBody,
            //     attachments: attachments
            // });
            
            LOGGER.info(`Email interaction created: ${interactionId} for case ${caseId}`);
            
            return {
                interaction_id: interactionId,
                case_id: caseId,
                recipient: recipient,
                status: 'SENT'
            };
            
        } catch (error) {
            LOGGER.error(`Error sending email: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Create SMS Interaction
     */
    async sendSMS(caseId, phoneNumber, messageBody) {
        try {
            const caseQuery = `
                SELECT * FROM edd_cases WHERE case_id = $1
            `;
            
            const caseResult = await DATABASE.query(caseQuery, [caseId]);
            if (!caseResult.rows.length) {
                throw new Error(`Case ${caseId} not found`);
            }
            
            // Create interaction record
            const insertQuery = `
                INSERT INTO contact_center_interaction (
                    case_id,
                    customer_id,
                    interaction_type,
                    interaction_subtype,
                    initiated_by,
                    customer_phone,
                    call_purpose,
                    interaction_status,
                    additional_data,
                    created_at
                ) VALUES (
                    $1, $2, 'SMS', 'OUTBOUND', 'SYSTEM', $3, $4, 'SENT',
                    jsonb_build_object('message', $5),
                    NOW()
                )
                RETURNING interaction_id
            `;
            
            const result = await DATABASE.query(insertQuery, [
                caseId,
                caseResult.rows[0].customer_id,
                phoneNumber,
                'Customer notification',
                messageBody
            ]);
            
            const interactionId = result.rows[0].interaction_id;
            
            // TODO: Send SMS via SMS gateway (Twilio, etc)
            // await SMS_SERVICE.send({
            //     to: phoneNumber,
            //     message: messageBody
            // });
            
            LOGGER.info(`SMS interaction created: ${interactionId} for case ${caseId}`);
            
            return {
                interaction_id: interactionId,
                case_id: caseId,
                phone_number: phoneNumber,
                status: 'SENT'
            };
            
        } catch (error) {
            LOGGER.error(`Error sending SMS: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Get Call Script for Agent
     */
    getCallScript(callType) {
        const scripts = {
            'VERIFICATION': `
                Good day, I'm calling from [Bank Name] regarding your recent account opening.
                May I speak with [customer_name]?
                
                I need to verify some information for compliance purposes:
                1. Can you confirm the source of funds for this account?
                2. What is the primary purpose of this account?
                3. Do you have any business interests or political affiliations?
                
                Thank you for your cooperation. We will process your account shortly.
            `,
            'HIGH_RISK_ALERT': `
                Good day, I'm calling from [Bank Name] regarding your account.
                Due to our compliance procedures, we need your cooperation.
                
                Sir/Madam, I must ask:
                1. Are you politically exposed or related to someone politically exposed?
                2. Have you had any sanctions enforcement issues?
                3. Can you provide detailed business information?
                
                Your responses will determine account continuity. Please be honest.
            `,
            'ADDITIONAL_DOCUMENTS': `
                Good day, this is a courtesy call regarding documentation.
                We need additional information to complete your account setup.
                
                Please provide:
                1. Proof of employment (letter on company letterhead)
                2. Bank statements for past 3 months
                3. Explanation of transaction patterns
                
                Please send these within 5 business days.
            `,
            'ACCOUNT_FREEZE_NOTICE': `
                IMPORTANT: Account Pending Review
                
                Your account has been placed under compliance review.
                Reason: Enhanced due diligence required.
                
                We may temporarily restrict access pending investigation.
                Please contact us if you have questions.
                
                Reference: [case_id]
            `
        };
        
        return scripts[callType] || scripts['VERIFICATION'];
    }
    
    /**
     * Get Interaction History for Case
     */
    async getInteractionHistory(caseId) {
        try {
            const query = `
                SELECT 
                    interaction_id,
                    interaction_type,
                    interaction_subtype,
                    initiated_by,
                    agent_name,
                    interaction_status,
                    call_outcome,
                    outcome_notes,
                    call_duration_seconds,
                    recording_link,
                    created_at,
                    call_completion_time
                FROM contact_center_interaction
                WHERE case_id = $1
                ORDER BY created_at DESC
            `;
            
            const result = await DATABASE.query(query, [caseId]);
            return result.rows;
            
        } catch (error) {
            LOGGER.error(`Error getting interaction history: ${error.message}`);
            return [];
        }
    }
    
    /**
     * Schedule Follow-Up Call
     */
    async scheduleFollowUp(caseId, followUpDate, reason) {
        try {
            const insertQuery = `
                INSERT INTO contact_center_interaction (
                    case_id,
                    interaction_type,
                    interaction_subtype,
                    initiated_by,
                    call_purpose,
                    scheduled_at,
                    interaction_status,
                    required_action,
                    created_at
                ) VALUES (
                    $1, 'OUTBOUND_CALL', 'FOLLOW_UP', 'SYSTEM',
                    $2, $3, 'SCHEDULED', 'CALL_CUSTOMER', NOW()
                )
                RETURNING interaction_id, scheduled_at
            `;
            
            const result = await DATABASE.query(insertQuery, [
                caseId,
                reason,
                followUpDate
            ]);
            
            LOGGER.info(`Follow-up call scheduled for case ${caseId}`);
            
            return result.rows[0];
            
        } catch (error) {
            LOGGER.error(`Error scheduling follow-up: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new ContactCenterIntegration();
