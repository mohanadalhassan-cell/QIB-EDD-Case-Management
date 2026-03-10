// ============================================================================
// WEBSOCKET SERVER - Real-time Dashboard Updates & Live Notifications
// Enables live case status updates, KPI metrics, and instant alerts
// ============================================================================

const WS = require('ws');
const DATABASE = require('./database_connection');
const LOGGER = require('./logger');

class WebSocketServer {
    
    constructor(httpServer) {
        this.wss = new WS.Server({ server: httpServer });
        this.clients = new Map(); // user_id → ws connection
        this.subscriptions = new Map(); // case_id → [user_ids]
        
        this.setupConnections();
        this.startMetricsUpdater();
        this.startSLAMonitor();
    }
    
    /**
     * Handle WebSocket Connections
     */
    setupConnections() {
        this.wss.on('connection', (ws) => {
            LOGGER.info('New WebSocket connection established');
            
            let userId = null;
            
            // Expect authentication message first
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    
                    if (data.type === 'AUTHENTICATE') {
                        userId = data.user_id;
                        
                        // Register client
                        this.clients.set(userId, ws);
                        
                        // Send welcome message with current stats
                        const stats = await this.getCurrentUserStats(userId);
                        ws.send(JSON.stringify({
                            type: 'AUTH_SUCCESS',
                            user_id: userId,
                            stats: stats,
                            timestamp: new Date().toISOString()
                        }));
                        
                        LOGGER.info(`User ${userId} authenticated via WebSocket`);
                        
                    } else if (data.type === 'SUBSCRIBE_CASE') {
                        // User subscribes to case updates
                        const caseId = data.case_id;
                        
                        if (!this.subscriptions.has(caseId)) {
                            this.subscriptions.set(caseId, []);
                        }
                        this.subscriptions.get(caseId).push(userId);
                        
                        // Send current case status
                        const caseStatus = await this.getCaseStatus(caseId);
                        ws.send(JSON.stringify({
                            type: 'CASE_SUBSCRIBED',
                            case_id: caseId,
                            status: caseStatus,
                            timestamp: new Date().toISOString()
                        }));
                        
                    } else if (data.type === 'UNSUBSCRIBE_CASE') {
                        // User unsubscribes from case
                        const caseId = data.case_id;
                        const subscribers = this.subscriptions.get(caseId) || [];
                        const index = subscribers.indexOf(userId);
                        if (index > -1) {
                            subscribers.splice(index, 1);
                        }
                        
                    } else if (data.type === 'PING') {
                        // Keep-alive ping
                        ws.send(JSON.stringify({
                            type: 'PONG',
                            timestamp: new Date().toISOString()
                        }));
                    }
                    
                } catch (error) {
                    LOGGER.error(`WebSocket message error: ${error.message}`);
                }
            });
            
            // Handle disconnection
            ws.on('close', () => {
                if (userId) {
                    this.clients.delete(userId);
                    LOGGER.info(`User ${userId} disconnected from WebSocket`);
                }
            });
            
            ws.on('error', (error) => {
                LOGGER.error(`WebSocket error: ${error.message}`);
            });
        });
    }
    
    /**
     * Broadcast Case Update to All Subscribers
     */
    broadcastCaseUpdate(caseId, update) {
        const subscribers = this.subscriptions.get(caseId) || [];
        
        const message = JSON.stringify({
            type: 'CASE_UPDATE',
            case_id: caseId,
            update: update,
            timestamp: new Date().toISOString()
        });
        
        for (const userId of subscribers) {
            const ws = this.clients.get(userId);
            if (ws && ws.readyState === WS.OPEN) {
                ws.send(message);
            }
        }
        
        LOGGER.info(`Broadcast case ${caseId} update to ${subscribers.length} subscribers`);
    }
    
    /**
     * Broadcast Notification to Specific User
     */
    notifyUser(userId, notification) {
        const ws = this.clients.get(userId);
        
        if (ws && ws.readyState === WS.OPEN) {
            ws.send(JSON.stringify({
                type: 'NOTIFICATION',
                notification: notification,
                timestamp: new Date().toISOString()
            }));
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Broadcast Dashboard Metrics to All Connected Users
     */
    broadcastMetrics(metrics) {
        const message = JSON.stringify({
            type: 'METRICS_UPDATE',
            metrics: metrics,
            timestamp: new Date().toISOString()
        });
        
        for (const [userId, ws] of this.clients) {
            if (ws.readyState === WS.OPEN) {
                ws.send(message);
            }
        }
        
        LOGGER.info(`Broadcasted metrics to ${this.clients.size} connected users`);
    }
    
    /**
     * Get Current User Statistics
     */
    async getCurrentUserStats(userId) {
        try {
            const query = `
                SELECT 
                    COUNT(*) FILTER (WHERE queue_status = 'PENDING') as pending_count,
                    COUNT(*) FILTER (WHERE queue_status = 'IN_PROGRESS') as in_progress_count,
                    COUNT(*) FILTER (WHERE due_date < NOW() AND queue_status != 'COMPLETED') as overdue_count,
                    COUNT(*) FILTER (WHERE due_date BETWEEN NOW() AND NOW() + INTERVAL '1 hour' AND queue_status IN ('PENDING', 'IN_PROGRESS')) as due_soon_count
                FROM workflow_queue
                WHERE assigned_user = $1
            `;
            
            const result = await DATABASE.query(query, [userId]);
            return result.rows[0] || {};
            
        } catch (error) {
            LOGGER.error(`Error getting user stats: ${error.message}`);
            return {};
        }
    }
    
    /**
     * Get Case Status (for subscribed users)
     */
    async getCaseStatus(caseId) {
        try {
            const query = `
                SELECT 
                    ec.case_id,
                    ec.case_status,
                    ec.case_priority,
                    ec.risk_rating,
                    ec.assigned_to,
                    wq.current_workflow_stage,
                    wq.queue_status,
                    wq.due_date,
                    c.customer_name
                FROM edd_cases ec
                LEFT JOIN workflow_queue wq ON ec.case_id = wq.case_id AND wq.queue_status != 'COMPLETED'
                LEFT JOIN customers c ON ec.customer_id = c.customer_id
                WHERE ec.case_id = $1
                LIMIT 1
            `;
            
            const result = await DATABASE.query(query, [caseId]);
            return result.rows[0] || null;
            
        } catch (error) {
            LOGGER.error(`Error getting case status: ${error.message}`);
            return null;
        }
    }
    
    /**
     * Push Real-time Metrics to Dashboard
     * Runs every 30 seconds
     */
    startMetricsUpdater() {
        setInterval(async () => {
            try {
                const metrics = await this.aggregateDashboardMetrics();
                this.broadcastMetrics(metrics);
                
            } catch (error) {
                LOGGER.error(`Error updating metrics: ${error.message}`);
            }
        }, 30000); // 30 seconds
    }
    
    /**
     * Monitor SLA Deadlines
     * Runs every 5 minutes
     */
    startSLAMonitor() {
        setInterval(async () => {
            try {
                await this.checkSLADeadlines();
            } catch (error) {
                LOGGER.error(`Error checking SLA deadlines: ${error.message}`);
            }
        }, 300000); // 5 minutes
    }
    
    /**
     * Aggregate Real-time Dashboard Metrics
     */
    async aggregateDashboardMetrics() {
        try {
            const query = `
                SELECT 
                    (SELECT COUNT(*) FROM edd_cases WHERE case_status != 'COMPLETED' AND created_at >= NOW() - INTERVAL '24 hours') as kyc_today,
                    (SELECT COUNT(*) FROM edd_cases WHERE case_status = 'CREATED') as cases_created,
                    (SELECT COUNT(*) FROM edd_cases WHERE risk_rating IN ('CRITICAL', 'HIGH')) as high_risk_count,
                    (SELECT COUNT(*) FROM edd_cases WHERE case_priority = 'URGENT') as urgent_cases,
                    (SELECT COUNT(*) FROM case_risk_assessment WHERE pep_status != 'NO') as pep_detected,
                    (SELECT ROUND(AVG(EXTRACT(HOUR FROM (NOW() - created_at)))::numeric, 1) FROM workflow_queue WHERE queue_status = 'COMPLETED') as avg_case_duration_hours,
                    (SELECT COUNT(*) FROM workflow_queue WHERE due_date < NOW() AND queue_status != 'COMPLETED') as sla_breaches,
                    (SELECT COUNT(*) FROM workflow_queue WHERE due_date < NOW() AND queue_status != 'COMPLETED')::float / 
                     (SELECT COUNT(*) FROM workflow_queue WHERE queue_status != 'COMPLETED')::float * 100 as sla_compliance_percent
            `;
            
            const result = await DATABASE.query(query);
            return result.rows[0] || {};
            
        } catch (error) {
            LOGGER.error(`Error aggregating metrics: ${error.message}`);
            return {};
        }
    }
    
    /**
     * Check for Upcoming SLA Deadlines
     */
    async checkSLADeadlines() {
        try {
            const query = `
                SELECT 
                    wq.queue_id,
                    wq.case_id,
                    wq.assigned_user,
                    ec.customer_name,
                    wq.current_workflow_stage,
                    wq.due_date,
                    EXTRACT(HOUR FROM (wq.due_date - NOW())) as hours_remaining
                FROM workflow_queue wq
                JOIN edd_cases ec ON wq.case_id = ec.case_id
                WHERE wq.queue_status IN ('PENDING', 'IN_PROGRESS')
                  AND wq.due_date BETWEEN NOW() AND NOW() + INTERVAL '2 hours'
                  AND wq.due_date > NOW()
            `;
            
            const result = await DATABASE.query(query);
            
            for (const row of result.rows) {
                // Send alert to assigned user
                const alert = {
                    type: 'SLA_DEADLINE_APPROACHING',
                    case_id: row.case_id,
                    stage: row.current_workflow_stage,
                    customer: row.customer_name,
                    hours_remaining: row.hours_remaining,
                    due_date: row.due_date
                };
                
                this.notifyUser(row.assigned_user, alert);
                
                // Also broadcast to all managers
                const managerQuery = `
                    SELECT u.user_id FROM users u
                    WHERE u.role IN ('MANAGER', 'DIRECTOR') AND u.is_active = true
                `;
                
                const managers = await DATABASE.query(managerQuery);
                for (const manager of managers.rows) {
                    this.notifyUser(manager.user_id, alert);
                }
            }
            
        } catch (error) {
            LOGGER.error(`Error checking SLA deadlines: ${error.message}`);
        }
    }
    
    /**
     * Handle Case Status Change
     */
    onCaseStatusChange(caseId, oldStatus, newStatus, changedBy) {
        this.broadcastCaseUpdate(caseId, {
            status_changed: true,
            old_status: oldStatus,
            new_status: newStatus,
            changed_by: changedBy,
            changed_at: new Date().toISOString()
        });
    }
    
    /**
     * Handle Workflow Stage Completion
     */
    onWorkflowStageComplete(caseId, stage, completedBy, decision) {
        this.broadcastCaseUpdate(caseId, {
            stage_completed: true,
            completed_stage: stage,
            completed_by: completedBy,
            decision: decision,
            completed_at: new Date().toISOString()
        });
    }
    
    /**
     * Handle Notification Event
     */
    onNotificationEvent(caseId, userId, eventType, message) {
        const notification = {
            case_id: caseId,
            event_type: eventType,
            message: message,
            created_at: new Date().toISOString()
        };
        
        this.notifyUser(userId, notification);
    }
    
    /**
     * Broadcast Alert to All Managers
     */
    async broadcastManagerAlert(alertType, details) {
        try {
            const query = `
                SELECT u.user_id FROM users u
                WHERE u.role IN ('MANAGER', 'DIRECTOR') AND u.is_active = true
            `;
            
            const result = await DATABASE.query(query);
            
            const alert = {
                type: alertType,
                details: details,
                created_at: new Date().toISOString()
            };
            
            for (const row of result.rows) {
                this.notifyUser(row.user_id, alert);
            }
            
            LOGGER.info(`Manager alert sent: ${alertType}`);
            
        } catch (error) {
            LOGGER.error(`Error broadcasting manager alert: ${error.message}`);
        }
    }
    
    /**
     * Get Connected Users Count
     */
    getConnectedUsersCount() {
        return this.clients.size;
    }
}

module.exports = WebSocketServer;
