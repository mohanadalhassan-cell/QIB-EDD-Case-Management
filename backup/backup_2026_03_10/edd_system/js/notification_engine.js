// ============================================================================
// NOTIFICATION ENGINE - Real-time Alert & Communication System
// Handles Email, SMS, Mobile Push, Dashboard notifications
// ============================================================================

const DATABASE = require('./database_connection');
const EMAIL_SERVICE = require('./email_service'); // Nodemailer
const SMS_SERVICE = require('./sms_service');     // Twilio/AWS SNS
const LOGGER = require('./logger');

class NotificationEngine {
    
    /**
     * Main Entry Point: Send Notification to User
     */
    async sendNotification(notificationConfig) {
        try {
            // Get full recipient details
            const recipientDetails = await this.getRecipientDetails(
                notificationConfig.recipient_role || notificationConfig.recipient_user_id
            );
            
            if (!recipientDetails) {
                LOGGER.warn(`No recipient found for role: ${notificationConfig.recipient_role}`);
                return { status: 'SKIPPED', reason: 'No recipient' };
            }
            
            // Create notification record in database
            const notificationId = await this.createNotificationRecord(
                notificationConfig,
                recipientDetails
            );
            
            // Send via configured channels
            const results = {
                email: null,
                sms: null,
                dashboard: null,
                push: null
            };
            
            // Always create dashboard notification
            results.dashboard = await this.sendDashboardNotification(
                notificationId,
                recipientDetails,
                notificationConfig
            );
            
            // Send Email if enabled
            if (notificationConfig.notification_type === 'EMAIL' || !notificationConfig.notification_type) {
                results.email = await this.sendEmailNotification(
                    notificationId,
                    recipientDetails,
                    notificationConfig
                );
            }
            
            // Send SMS if marked URGENT
            if (notificationConfig.notification_type === 'SMS' || 
                (notificationConfig.event_type === 'URGENT_CASE' && recipientDetails.phone)) {
                results.sms = await this.sendSMSNotification(
                    notificationId,
                    recipientDetails,
                    notificationConfig
                );
            }
            
            // Send Mobile Push if available
            if (recipientDetails.mobile_device_token) {
                results.push = await this.sendMobilePushNotification(
                    notificationId,
                    recipientDetails,
                    notificationConfig
                );
            }
            
            return {
                status: 'SUCCESS',
                notification_id: notificationId,
                channels_sent: results
            };
            
        } catch (error) {
            LOGGER.error(`Error in sendNotification: ${error.message}`);
            throw error;
        }
    }

    // ========================================================================
    // EMAIL NOTIFICATIONS
    // ========================================================================
    
    async sendEmailNotification(notificationId, recipient, config) {
        try {
            const emailContent = this.formatEmailContent(config);
            
            const result = await EMAIL_SERVICE.sendEmail({
                to: recipient.email,
                subject: config.subject,
                html: emailContent.html,
                text: emailContent.text
            });
            
            // Update notification status
            await this.updateNotificationStatus(
                notificationId,
                'EMAIL',
                result.success ? 'SENT' : 'FAILED',
                result.messageId || result.error
            );
            
            if (result.success) {
                LOGGER.info(`Email sent successfully for notification ${notificationId}`);
            }
            
            return result;
            
        } catch (error) {
            LOGGER.error(`Email notification failed: ${error.message}`);
            await this.updateNotificationStatus(notificationId, 'EMAIL', 'FAILED', error.message);
            return { success: false, error: error.message };
        }
    }
    
    formatEmailContent(config) {
        const templates = {
            CASE_CREATED: {
                html: `
                    <h2>New EDD Case Created</h2>
                    <p>${config.message}</p>
                    <p><a href="https://edd-system.qib.local/dashboard">View Case</a></p>
                `,
                text: `New EDD Case Created\n${config.message}`
            },
            CASE_ASSIGNED: {
                html: `
                    <h2>Case Assigned to You</h2>
                    <p>${config.message}</p>
                    <p><a href="https://edd-system.qib.local/my-cases">View My Cases</a></p>
                `,
                text: `Case Assigned\n${config.message}`
            },
            DEADLINE_APPROACHING: {
                html: `
                    <h2 style="color: #ff9800;">⚠️ SLA Deadline Approaching</h2>
                    <p>${config.message}</p>
                    <p style="color: red;"><strong>Please complete your review immediately</strong></p>
                `,
                text: `SLA Deadline Approaching\n${config.message}`
            },
            ESCALATION: {
                html: `
                    <h2 style="color: #f44336;">🚨 ESCALATION ALERT</h2>
                    <p>${config.message}</p>
                    <p>This case requires immediate attention.</p>
                `,
                text: `Escalation Alert\n${config.message}`
            },
            DECISION_MADE: {
                html: `
                    <h2>✅ Decision Made</h2>
                    <p>${config.message}</p>
                `,
                text: `Decision Made\n${config.message}`
            }
        };
        
        return templates[config.event_type] || {
            html: `<p>${config.message}</p>`,
            text: config.message
        };
    }

    // ========================================================================
    // SMS NOTIFICATIONS (For URGENT Cases)
    // ========================================================================
    
    async sendSMSNotification(notificationId, recipient, config) {
        try {
            // Only send SMS for urgent/critical events
            if (config.event_type !== 'URGENT_CASE' && config.event_type !== 'ESCALATION') {
                return null;
            }
            
            const smsMessage = this.formatSMSContent(config);
            
            const result = await SMS_SERVICE.sendSMS({
                phoneNumber: recipient.phone,
                message: smsMessage,
                priority: 'HIGH'
            });
            
            await this.updateNotificationStatus(
                notificationId,
                'SMS',
                result.success ? 'SENT' : 'FAILED',
                result.messageId || result.error
            );
            
            LOGGER.info(`SMS sent to ${recipient.phone} for notification ${notificationId}`);
            return result;
            
        } catch (error) {
            LOGGER.error(`SMS notification failed: ${error.message}`);
            await this.updateNotificationStatus(notificationId, 'SMS', 'FAILED', error.message);
            return { success: false, error: error.message };
        }
    }
    
    formatSMSContent(config) {
        // SMS has character limit (160 chars), so keep it short
        const templates = {
            URGENT_CASE: `QIB Alert: New urgent EDD case assigned. Log in to system.`,
            ESCALATION: `⚠️ Case escalated. Action required immediately.`,
            DEADLINE_APPROACHING: `⏰ SLA deadline in 1 hour. Please complete case review.`
        };
        
        return templates[config.event_type] || 'QIB: Action required on assigned case.';
    }

    // ========================================================================
    // MOBILE PUSH NOTIFICATIONS
    // ========================================================================
    
    async sendMobilePushNotification(notificationId, recipient, config) {
        try {
            if (!recipient.mobile_device_token) {
                return null;
            }
            
            // Get FCM or APN configuration
            const pushMessage = {
                notification: {
                    title: config.subject,
                    body: config.message,
                    icon: 'https://edd-system.qib.local/icon.png'
                },
                data: {
                    case_id: config.case_id,
                    event_type: config.event_type,
                    notification_id: notificationId,
                    action_url: 'app://case/' + config.case_id
                }
            };
            
            // Send via Firebase Cloud Messaging or APNs
            const result = await this.sendToMobileDevice(
                recipient.mobile_device_token,
                pushMessage
            );
            
            await this.updateNotificationStatus(
                notificationId,
                'MOBILE_PUSH',
                result.success ? 'SENT' : 'FAILED',
                result.messageId || result.error
            );
            
            return result;
            
        } catch (error) {
            LOGGER.error(`Mobile push failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // ========================================================================
    // DASHBOARD NOTIFICATIONS (Always Sent)
    // ========================================================================
    
    async sendDashboardNotification(notificationId, recipient, config) {
        try {
            const badgeCount = await this.getUnreadNotificationCount(recipient.user_id);
            
            // Store in notifications table (already done in createNotificationRecord)
            // This is for real-time push to connected browsers via WebSocket
            
            const dashboardUpdate = {
                notification_id: notificationId,
                type: config.event_type,
                message: config.subject,
                timestamp: new Date(),
                badge_count: badgeCount + 1,
                action_url: `/dashboard/case/${config.case_id}`
            };
            
            // Push via WebSocket to user's connected sessions
            await this.broadcastToDashboard(recipient.user_id, dashboardUpdate);
            
            return { success: true, method: 'WebSocket' };
            
        } catch (error) {
            LOGGER.error(`Dashboard notification failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    // ========================================================================
    // DATABASE OPERATIONS
    // ========================================================================
    
    /**
     * Create Notification Record in Database
     */
    async createNotificationRecord(config, recipient) {
        const query = `
            INSERT INTO notifications (
                case_id, event_type, event_timestamp,
                recipient_user_id, recipient_email, recipient_phone,
                notification_type, subject, message,
                notification_status,
                created_by
            ) VALUES (
                $1, $2, NOW(),
                $3, $4, $5,
                $6, $7, $8,
                'PENDING',
                $9
            )
            RETURNING notification_id
        `;
        
        const values = [
            config.case_id,
            config.event_type,
            recipient.user_id,
            recipient.email,
            recipient.phone,
            config.notification_type || 'EMAIL',
            config.subject,
            config.message,
            'NOTIFICATION_ENGINE'
        ];
        
        const result = await DATABASE.query(query, values);
        return result.rows[0].notification_id;
    }
    
    /**
     * Update Notification Status After Sending
     */
    async updateNotificationStatus(notificationId, channel, status, details) {
        const query = `
            UPDATE notifications
            SET notification_status = $1,
                send_channel = $2,
                delivery_status = $3,
                delivery_message = $4,
                sent_at = NOW()
            WHERE notification_id = $5
        `;
        
        await DATABASE.query(query, [status, channel, status, details, notificationId]);
    }
    
    /**
     * Get Unread Notification Count
     */
    async getUnreadNotificationCount(userId) {
        const query = `
            SELECT COUNT(*) as count
            FROM notifications
            WHERE recipient_user_id = $1 AND notification_status = 'PENDING'
        `;
        
        const result = await DATABASE.query(query, [userId]);
        return result.rows[0].count || 0;
    }
    
    /**
     * Mark Notification as Read
     */
    async markAsRead(notificationId) {
        const query = `
            UPDATE notifications
            SET notification_status = 'READ',
                read_at = NOW()
            WHERE notification_id = $1
        `;
        
        await DATABASE.query(query, [notificationId]);
    }

    // ========================================================================
    // RECIPIENT RESOLUTION
    // ========================================================================
    
    /**
     * Get Recipient Details by Role or User ID
     */
    async getRecipientDetails(roleOrUserId) {
        let query;
        let params;
        
        if (roleOrUserId.startsWith('ROLE_')) {
            // Find by role
            query = `
                SELECT 
                    u.user_id, u.full_name, u.email, u.phone,
                    u.mobile_device_token
                FROM users u
                JOIN user_roles ur ON u.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
                WHERE r.role_name = $1 AND u.is_active = true
                LIMIT 1
            `;
            params = [roleOrUserId];
        } else {
            // Find by user ID
            query = `
                SELECT user_id, full_name, email, phone, mobile_device_token
                FROM users
                WHERE user_id = $1
            `;
            params = [roleOrUserId];
        }
        
        const result = await DATABASE.query(query, params);
        return result.rows[0] || null;
    }

    // ========================================================================
    // SCHEDULED NOTIFICATIONS (SLA Reminders)
    // ========================================================================
    
    /**
     * Send SLA Deadline Reminders (runs every hour)
     */
    async sendSLAReminders() {
        try {
            const query = `
                SELECT 
                    wq.queue_id,
                    ec.case_id,
                    wq.assigned_user,
                    wq.due_date,
                    EXTRACT(HOUR FROM (wq.due_date - NOW())) as hours_remaining
                FROM workflow_queue wq
                JOIN edd_cases ec ON wq.case_id = ec.case_id
                WHERE wq.queue_status IN ('PENDING', 'IN_PROGRESS')
                  AND wq.due_date BETWEEN NOW() AND NOW() + INTERVAL '1 hour'
            `;
            
            const result = await DATABASE.query(query);
            
            for (const row of result.rows) {
                if (row.hours_remaining <= 1) {
                    await this.sendNotification({
                        case_id: row.case_id,
                        event_type: 'DEADLINE_APPROACHING',
                        recipient_user_id: row.assigned_user,
                        subject: `⏰ SLA Deadline in ${Math.round(row.hours_remaining)} hours`,
                        message: `Case ${row.case_id} deadline: ${row.due_date}. Please complete review.`,
                        notification_type: 'EMAIL'
                    });
                }
            }
            
            LOGGER.info(`SLA reminders sent for ${result.rows.length} cases`);
            
        } catch (error) {
            LOGGER.error(`Error sending SLA reminders: ${error.message}`);
        }
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================
    
    /**
     * Broadcast to Connected WebSocket Sessions
     */
    async broadcastToDashboard(userId, update) {
        // This would be integrated with WebSocket server
        // For now, just log it
        LOGGER.info(`Dashboard update queued for user ${userId}: ${update.type}`);
        
        // In production:
        // const wsServer = require('./websocket_server');
        // wsServer.broadcastToUser(userId, update);
    }
    
    /**
     * Send to Mobile Device via FCM/APNs
     */
    async sendToMobileDevice(deviceToken, message) {
        try {
            // This would call Firebase Cloud Messaging
            // For now, just simulate
            return { success: true, messageId: 'msg_' + Date.now() };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = new NotificationEngine();
