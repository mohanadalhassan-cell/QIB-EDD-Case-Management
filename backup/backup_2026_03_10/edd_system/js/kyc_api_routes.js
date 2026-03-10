// ============================================================================
// KYC API ROUTES - Endpoint handlers for KYC form submission
// Routes incoming KYC form data to EDD Case Engine
// ============================================================================

const EXPRESS = require('express');
const LOGGER = require('./logger');
const EDD_CASE_ENGINE = require('./edd_case_engine');
const NOTIFICATION_ENGINE = require('./notification_engine');
const CONTACT_CENTER = require('./contact_center_integration');

class KYCAPIRoutes {
    
    /**
     * Initialize Express router for KYC endpoints
     */
    static initializeRouter() {
        const router = EXPRESS.Router();

        // POST: Submit KYC form and create EDD case if needed
        router.post('/v1/kyc/submit', KYCAPIRoutes.submitKYCForm);

        // GET: Retrieve KYC status
        router.get('/v1/kyc/:kyc_id/status', KYCAPIRoutes.getKYCStatus);

        // GET: Retrieve EDD case details
        router.get('/v1/kyc/:kyc_id/case', KYCAPIRoutes.getEDDCaseDetails);

        // POST: Update KYC with additional documents
        router.post('/v1/kyc/:kyc_id/documents', KYCAPIRoutes.uploadDocuments);

        // POST: Respond to document request
        router.post('/v1/kyc/:kyc_id/document-response', KYCAPIRoutes.submitDocumentResponse);

        return router;
    }

    /**
     * POST /api/v1/kyc/submit
     * Main endpoint for KYC form submission
     */
    static async submitKYCForm(req, res) {
        try {
            const kycData = req.body;

            // Validate required fields
            const validation = KYCAPIRoutes.validateKYCData(kycData);
            if (!validation.valid) {
                return res.status(400).json({
                    status: 'VALIDATION_FAILED',
                    errors: validation.errors
                });
            }

            LOGGER.info(`KYC form submitted: ${kycData.email}`);

            // Submit to EDD Case Engine
            const result = await EDD_CASE_ENGINE.submitKYCandCreateCase(kycData);

            LOGGER.info(`EDD Case created: ${result.case_id}`);

            // Send success response
            return res.status(201).json({
                status: 'SUCCESS',
                kyc_id: result.kyc_id,
                case_id: result.case_id,
                edd_triggered: result.edd_triggered,
                risk_rating: result.risk_rating,
                message: result.message,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            LOGGER.error(`Error in submitKYCForm: ${error.message}`);

            return res.status(500).json({
                status: 'ERROR',
                message: 'Failed to process KYC submission',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * GET /api/v1/kyc/:kyc_id/status
     * Get status of KYC application
     */
    static async getKYCStatus(req, res) {
        try {
            const { kyc_id } = req.params;

            const query = `
                SELECT 
                    kyc_id,
                    customer_id,
                    kyc_status,
                    created_at,
                    updated_at,
                    case_id,
                    edd_required
                FROM kyc_applications
                WHERE kyc_id = $1
            `;

            const DATABASE = require('./database_connection');
            const result = await DATABASE.query(query, [kyc_id]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: `KYC ID ${kyc_id} not found`
                });
            }

            const kycRecord = result.rows[0];

            return res.status(200).json({
                status: 'SUCCESS',
                kyc_id: kycRecord.kyc_id,
                kyc_status: kycRecord.kyc_status,
                edd_required: kycRecord.edd_required,
                case_id: kycRecord.case_id,
                created_at: kycRecord.created_at,
                updated_at: kycRecord.updated_at
            });

        } catch (error) {
            LOGGER.error(`Error in getKYCStatus: ${error.message}`);
            return res.status(500).json({
                status: 'ERROR',
                message: 'Failed to retrieve KYC status'
            });
        }
    }

    /**
     * GET /api/v1/kyc/:kyc_id/case
     * Get EDD case details
     */
    static async getEDDCaseDetails(req, res) {
        try {
            const { kyc_id } = req.params;

            // First get case_id from kyc_id
            const kycQuery = `
                SELECT case_id FROM kyc_applications WHERE kyc_id = $1
            `;

            const DATABASE = require('./database_connection');
            const kycResult = await DATABASE.query(kycQuery, [kyc_id]);

            if (kycResult.rows.length === 0) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: 'KYC application not found'
                });
            }

            const caseId = kycResult.rows[0].case_id;

            // Get case details
            const caseQuery = `
                SELECT 
                    ec.case_id,
                    ec.kyc_id,
                    ec.customer_id,
                    ec.case_type,
                    ec.case_status,
                    ec.case_priority,
                    ec.risk_rating,
                    ec.assigned_to,
                    ec.created_at,
                    ec.updated_at,
                    ec.final_decision,
                    c.customer_name,
                    c.email,
                    c.phone_number_mobile
                FROM edd_cases ec
                JOIN customers c ON ec.customer_id = c.customer_id
                WHERE ec.case_id = $1
            `;

            const caseResult = await DATABASE.query(caseQuery, [caseId]);

            if (caseResult.rows.length === 0) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: 'EDD case not found'
                });
            }

            const caseRecord = caseResult.rows[0];

            // Get workflow status
            const workflowQuery = `
                SELECT 
                    current_workflow_stage,
                    queue_status,
                    assigned_user,
                    due_date,
                    queue_sequence_order
                FROM workflow_queue
                WHERE case_id = $1
                ORDER BY queue_sequence_order ASC
            `;

            const workflowResult = await DATABASE.query(workflowQuery, [caseId]);

            return res.status(200).json({
                status: 'SUCCESS',
                case: {
                    case_id: caseRecord.case_id,
                    kyc_id: caseRecord.kyc_id,
                    customer_name: caseRecord.customer_name,
                    customer_email: caseRecord.email,
                    case_status: caseRecord.case_status,
                    case_priority: caseRecord.case_priority,
                    risk_rating: caseRecord.risk_rating,
                    assigned_to: caseRecord.assigned_to,
                    final_decision: caseRecord.final_decision,
                    created_at: caseRecord.created_at,
                    updated_at: caseRecord.updated_at
                },
                workflow_status: workflowResult.rows.map(row => ({
                    stage: row.current_workflow_stage,
                    status: row.queue_status,
                    assigned_user: row.assigned_user,
                    due_date: row.due_date
                }))
            });

        } catch (error) {
            LOGGER.error(`Error in getEDDCaseDetails: ${error.message}`);
            return res.status(500).json({
                status: 'ERROR',
                message: 'Failed to retrieve case details'
            });
        }
    }

    /**
     * POST /api/v1/kyc/:kyc_id/documents
     * Upload supporting documents
     */
    static async uploadDocuments(req, res) {
        try {
            const { kyc_id } = req.params;
            const { documents } = req.body;

            if (!documents || documents.length === 0) {
                return res.status(400).json({
                    status: 'VALIDATION_FAILED',
                    message: 'No documents provided'
                });
            }

            const DATABASE = require('./database_connection');

            // Get case_id
            const caseQuery = `
                SELECT case_id FROM kyc_applications WHERE kyc_id = $1
            `;

            const caseResult = await DATABASE.query(caseQuery, [kyc_id]);
            if (caseResult.rows.length === 0) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: 'KYC application not found'
                });
            }

            const caseId = caseResult.rows[0].case_id;

            // Insert document records
            for (const doc of documents) {
                const insertQuery = `
                    INSERT INTO case_documents (
                        case_id,
                        document_type,
                        document_name,
                        document_url,
                        file_size,
                        upload_date
                    ) VALUES ($1, $2, $3, $4, $5, NOW())
                `;

                await DATABASE.query(insertQuery, [
                    caseId,
                    doc.document_type,
                    doc.document_name,
                    doc.document_url,
                    doc.file_size
                ]);
            }

            LOGGER.info(`${documents.length} documents uploaded for case ${caseId}`);

            return res.status(200).json({
                status: 'SUCCESS',
                message: `${documents.length} documents uploaded successfully`,
                case_id: caseId
            });

        } catch (error) {
            LOGGER.error(`Error in uploadDocuments: ${error.message}`);
            return res.status(500).json({
                status: 'ERROR',
                message: 'Failed to upload documents'
            });
        }
    }

    /**
     * POST /api/v1/kyc/:kyc_id/document-response
     * Submit response to document request from compliance team
     */
    static async submitDocumentResponse(req, res) {
        try {
            const { kyc_id } = req.params;
            const { request_id, documents, notes } = req.body;

            const DATABASE = require('./database_connection');

            // Get case_id
            const caseQuery = `
                SELECT case_id FROM kyc_applications WHERE kyc_id = $1
            `;

            const caseResult = await DATABASE.query(caseQuery, [kyc_id]);
            if (caseResult.rows.length === 0) {
                return res.status(404).json({
                    status: 'NOT_FOUND',
                    message: 'KYC application not found'
                });
            }

            const caseId = caseResult.rows[0].case_id;

            // Update document request status
            const updateQuery = `
                UPDATE document_requests
                SET status = 'SUBMITTED',
                    submitted_at = NOW(),
                    submission_notes = $1
                WHERE request_id = $2
            `;

            await DATABASE.query(updateQuery, [notes, request_id]);

            // Insert submitted documents
            for (const doc of documents) {
                const insertQuery = `
                    INSERT INTO case_documents (
                        case_id,
                        document_type,
                        document_name,
                        document_url,
                        request_id,
                        upload_date
                    ) VALUES ($1, $2, $3, $4, $5, NOW())
                `;

                await DATABASE.query(insertQuery, [
                    caseId,
                    doc.document_type,
                    doc.document_name,
                    doc.document_url,
                    request_id
                ]);
            }

            // Send notification to compliance officer
            await NOTIFICATION_ENGINE.sendNotification({
                case_id: caseId,
                event_type: 'DOCUMENT_SUBMISSION',
                recipient_role: 'COMPLIANCE_OFFICER',
                subject: `Document Response Received - Case ${caseId}`,
                message: `Customer has submitted ${documents.length} documents in response to your request.`,
                notification_type: 'EMAIL'
            });

            LOGGER.info(`Document response received for case ${caseId}`);

            return res.status(200).json({
                status: 'SUCCESS',
                message: 'Document response submitted successfully',
                case_id: caseId
            });

        } catch (error) {
            LOGGER.error(`Error in submitDocumentResponse: ${error.message}`);
            return res.status(500).json({
                status: 'ERROR',
                message: 'Failed to submit document response'
            });
        }
    }

    /**
     * Validate KYC form data
     */
    static validateKYCData(data) {
        const errors = [];

        // Required fields
        const requiredFields = [
            'firstName', 'lastName', 'dateOfBirth', 'nationality',
            'mobileNumber', 'email', 'address', 'city',
            'employmentStatus', 'monthlyIncome', 'sourceOfFunds'
        ];

        for (const field of requiredFields) {
            if (!data[field]) {
                errors.push(`${field} is required`);
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push('Invalid email address');
        }

        // Phone validation (basic)
        if (data.mobileNumber && data.mobileNumber.length < 7) {
            errors.push('Invalid phone number');
        }

        // Age validation (must be 18+)
        if (data.dateOfBirth) {
            const dob = new Date(data.dateOfBirth);
            const age = new Date().getFullYear() - dob.getFullYear();
            if (age < 18) {
                errors.push('Customer must be at least 18 years old');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

module.exports = KYCAPIRoutes;
