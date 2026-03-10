// ============================================================================
// WORKFLOW ROUTER - Intelligent Case Routing & Assignment System
// Routes cases to correct team based on risk, priority, workload
// ============================================================================

const DATABASE = require('./database_connection');
const LOGGER = require('./logger');

class WorkflowRouter {
    
    /**
     * Smart Route Assignment Based on Multiple Factors
     */
    async assignCaseToQueue(caseId, riskRating, currentStage) {
        try {
            // Step 1: Determine team for this stage
            const team = this.getTeamForStage(currentStage);
            
            // Step 2: Calculate workload for each team member
            const assignee = await this.findBestAssignee(team, currentStage);
            
            if (!assignee) {
                LOGGER.warn(`No available assignee for ${team} at stage ${currentStage}`);
                // Escalate to manager
                return await this.escalateCase(caseId, `No available ${team} member`);
            }
            
            // Step 3: Update assignment
            const updateQuery = `
                UPDATE workflow_queue
                SET assigned_user = $1,
                    assigned_at = NOW(),
                    queue_status = 'IN_PROGRESS'
                WHERE case_id = $2 AND current_workflow_stage = $3
            `;
            
            await DATABASE.query(updateQuery, [assignee.user_id, caseId, currentStage]);
            
            LOGGER.info(`Case ${caseId} assigned to ${assignee.full_name} for ${currentStage}`);
            
            return {
                status: 'ASSIGNED',
                assignee_id: assignee.user_id,
                assignee_name: assignee.full_name,
                stage: currentStage
            };
            
        } catch (error) {
            LOGGER.error(`Error in assignCaseToQueue: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Determine Team Based on Workflow Stage
     */
    getTeamForStage(stage) {
        const stageToTeamMap = {
            'BUSINESS': 'BUSINESS_ANALYST',
            'CDD': 'CDD_OFFICER',
            'COMPLIANCE': 'COMPLIANCE_OFFICER',
            'DECISION': 'APPROVER'
        };
        
        return stageToTeamMap[stage] || 'ADMIN';
    }
    
    /**
     * Find Best Available Assignee for Team
     * Considers: workload, skills, case complexity, location
     */
    async findBestAssignee(team, stage) {
        // Query for available team members with lowest workload
        const query = `
            SELECT 
                u.user_id,
                u.full_name,
                u.email,
                COALESCE(uc.active_cases, 0) as active_cases,
                COALESCE(uc.avg_processing_hours, 0) as avg_processing_hours,
                CASE 
                    WHEN COALESCE(uc.active_cases, 0) <= 3 THEN 1
                    WHEN COALESCE(uc.active_cases, 0) <= 5 THEN 2
                    WHEN COALESCE(uc.active_cases, 0) <= 7 THEN 3
                    ELSE 4
                END as workload_priority
            FROM users u
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            LEFT JOIN (
                SELECT 
                    assigned_user,
                    COUNT(*) as active_cases,
                    AVG(EXTRACT(HOUR FROM (NOW() - created_at))) as avg_processing_hours
                FROM workflow_queue
                WHERE queue_status IN ('PENDING', 'IN_PROGRESS')
                GROUP BY assigned_user
            ) uc ON u.user_id = uc.assigned_user
            WHERE r.role_name = $1
              AND u.is_active = true
              AND u.is_on_leave = false
            ORDER BY workload_priority ASC,
                     active_cases ASC,
                     u.full_name ASC
            LIMIT 1
        `;
        
        const result = await DATABASE.query(query, [team]);
        
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        
        return null;
    }
    
    /**
     * Get Available User for Role (Generic)
     * Used by EDD Case Engine
     */
    async findAvailableUser(role) {
        const assignee = await this.findBestAssignee(role, null);
        return assignee ? assignee.user_id : 'SYSTEM_ADMIN';
    }
    
    /**
     * Re-route Case if Deadline Missed
     */
    async rerouteOnDeadlineMissed(caseId) {
        try {
            // Get case and current queue
            const caseQuery = `
                SELECT ec.*, wq.assigned_user, wq.current_workflow_stage, wq.due_date
                FROM edd_cases ec
                JOIN workflow_queue wq ON ec.case_id = wq.case_id
                WHERE ec.case_id = $1 AND wq.queue_status != 'COMPLETED'
                ORDER BY wq.queue_sequence_order DESC
                LIMIT 1
            `;
            
            const caseResult = await DATABASE.query(caseQuery, [caseId]);
            if (!caseResult.rows.length) return null;
            
            const currentQueue = caseResult.rows[0];
            
            // Find alternative assignee
            const newAssignee = await this.findBestAssignee(
                this.getTeamForStage(currentQueue.current_workflow_stage)
            );
            
            if (newAssignee && newAssignee.user_id !== currentQueue.assigned_user) {
                // Reassign
                const updateQuery = `
                    UPDATE workflow_queue
                    SET assigned_user = $1,
                        queue_status = 'IN_PROGRESS'
                    WHERE case_id = $2 AND current_workflow_stage = $3
                `;
                
                await DATABASE.query(updateQuery, [
                    newAssignee.user_id,
                    caseId,
                    currentQueue.current_workflow_stage
                ]);
                
                LOGGER.info(`Case ${caseId} re-routed to ${newAssignee.full_name} after deadline miss`);
                
                return {
                    action: 'REROUTED',
                    old_assignee: currentQueue.assigned_user,
                    new_assignee: newAssignee.user_id,
                    reason: 'SLA deadline missed'
                };
            }
            
            // If no alternative, escalate to manager
            return await this.escalateCase(caseId, 'SLA deadline missed - no alternative assignees');
            
        } catch (error) {
            LOGGER.error(`Error in rerouteOnDeadlineMissed: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Escalate Case to Manager
     */
    async escalateCase(caseId, reason) {
        try {
            // Find team manager
            const managerQuery = `
                SELECT u.user_id, u.full_name
                FROM users u
                WHERE u.role = 'TEAM_MANAGER' AND u.is_active = true
                LIMIT 1
            `;
            
            const managerResult = await DATABASE.query(managerQuery);
            const manager = managerResult.rows[0];
            
            if (!manager) {
                LOGGER.error(`No team manager found for escalation`);
                return null;
            }
            
            // Create escalation queue entry
            const escalationQuery = `
                INSERT INTO workflow_queue (
                    case_id, current_workflow_stage, assigned_user,
                    queue_status, assigned_role, notes
                ) VALUES (
                    $1, 'ESCALATION', $2, 'PENDING', 'MANAGER', $3
                )
            `;
            
            await DATABASE.query(escalationQuery, [caseId, manager.user_id, reason]);
            
            // Update case status
            const updateCaseQuery = `
                UPDATE edd_cases
                SET case_status = 'ESCALATED'
                WHERE case_id = $1
            `;
            
            await DATABASE.query(updateCaseQuery, [caseId]);
            
            LOGGER.info(`Case ${caseId} escalated to ${manager.full_name}: ${reason}`);
            
            return {
                status: 'ESCALATED',
                escalated_to: manager.full_name,
                reason: reason
            };
            
        } catch (error) {
            LOGGER.error(`Error in escalateCase: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Load Balancing: Get Team Workload Summary
     */
    async getTeamWorkloadSummary(team) {
        const query = `
            SELECT 
                u.user_id,
                u.full_name,
                COUNT(CASE WHEN wq.queue_status = 'IN_PROGRESS' THEN 1 END) as in_progress,
                COUNT(CASE WHEN wq.queue_status = 'PENDING' THEN 1 END) as pending,
                COUNT(CASE WHEN ec.case_priority = 'URGENT' THEN 1 END) as urgent_count,
                ROUND(AVG(EXTRACT(HOUR FROM (NOW() - wq.created_at)))::numeric, 2) as avg_hours_in_queue
            FROM users u
            LEFT JOIN workflow_queue wq ON u.user_id = wq.assigned_user 
                AND wq.queue_status IN ('PENDING', 'IN_PROGRESS')
            LEFT JOIN edd_cases ec ON wq.case_id = ec.case_id
            WHERE u.role = $1 AND u.is_active = true
            GROUP BY u.user_id, u.full_name
            ORDER BY in_progress ASC, pending ASC
        `;
        
        const result = await DATABASE.query(query, [team]);
        return result.rows;
    }
    
    /**
     * Priority-Based Routing for URGENT Cases
     */
    async routeUrgentCase(caseId, description) {
        try {
            // Get all managers (escalate directly to them)
            const managerQuery = `
                SELECT u.user_id, u.full_name, u.phone, u.email
                FROM users u
                WHERE u.role IN ('MANAGER', 'DIRECTOR') AND u.is_active = true
                ORDER BY u.role DESC
                LIMIT 3
            `;
            
            const managerResult = await DATABASE.query(managerQuery);
            const managers = managerResult.rows;
            
            // Assign to senior manager
            if (managers.length > 0) {
                const seniorManager = managers[0];
                
                const assignQuery = `
                    UPDATE edd_cases
                    SET case_priority = 'URGENT',
                        case_status = 'IN_PROGRESS',
                        assigned_to = $1
                    WHERE case_id = $2
                `;
                
                await DATABASE.query(assignQuery, [seniorManager.user_id, caseId]);
                
                // Also assign to workflow queue
                const queueQuery = `
                    INSERT INTO workflow_queue (
                        case_id, current_workflow_stage, assigned_user,
                        queue_status, assigned_role, sla_hours
                    ) VALUES (
                        $1, 'DECISION', $2, 'IN_PROGRESS', 'DIRECTOR', 4
                    )
                `;
                
                await DATABASE.query(queueQuery, [caseId, seniorManager.user_id]);
                
                LOGGER.warn(`URGENT Case ${caseId} assigned to ${seniorManager.full_name}`);
                
                return {
                    status: 'URGENT_ROUTED',
                    assigned_to: seniorManager.full_name,
                    sla_hours: 4
                };
            }
            
            return null;
            
        } catch (error) {
            LOGGER.error(`Error in routeUrgentCase: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Skill-Based Routing (if case requires special handling)
     */
    async routeBySkilla(caseId, specialization) {
        try {
            // Find users with required skill/specialization
            const skillQuery = `
                SELECT 
                    u.user_id,
                    u.full_name,
                    COUNT(wq.queue_id) as current_load
                FROM users u
                JOIN user_skills us ON u.user_id = us.user_id
                LEFT JOIN workflow_queue wq ON u.user_id = wq.assigned_user 
                    AND wq.queue_status IN ('PENDING', 'IN_PROGRESS')
                WHERE us.skill_name = $1 AND u.is_active = true
                GROUP BY u.user_id, u.full_name
                ORDER BY current_load ASC
                LIMIT 1
            `;
            
            const result = await DATABASE.query(skillQuery, [specialization]);
            
            if (result.rows.length > 0) {
                const specialist = result.rows[0];
                
                const assignQuery = `
                    UPDATE edd_cases
                    SET assigned_to = $1
                    WHERE case_id = $2
                `;
                
                await DATABASE.query(assignQuery, [specialist.user_id, caseId]);
                
                LOGGER.info(`Case ${caseId} routed to specialist: ${specialist.full_name}`);
                
                return specialist;
            }
            
            return null;
            
        } catch (error) {
            LOGGER.error(`Error in routeBySkill: ${error.message}`);
            return null;
        }
    }
    
    /**
     * Batch Re-balancing (Run Periodically)
     */
    async rebalanceWorkload() {
        try {
            LOGGER.info('Starting workload rebalancing...');
            
            const teams = ['BUSINESS_ANALYST', 'CDD_OFFICER', 'COMPLIANCE_OFFICER'];
            
            for (const team of teams) {
                const workload = await this.getTeamWorkloadSummary(team);
                
                // Find most overwhelmed user
                const overwhelmed = workload.find(w => w.in_progress + w.pending > 10);
                
                if (overwhelmed) {
                    // Find cases this person can reassign
                    const reassignQuery = `
                        SELECT wq.* FROM workflow_queue wq
                        WHERE wq.assigned_user = $1
                          AND wq.queue_status = 'PENDING'
                          AND wq.queue_sequence_order > 1
                        LIMIT 3
                    `;
                    
                    const casesToReassign = await DATABASE.query(reassignQuery, [overwhelmed.user_id]);
                    
                    for (const caseQueue of casesToReassign.rows) {
                        const result = await this.rerouteOnDeadlineMissed(caseQueue.case_id);
                        if (result) {
                            LOGGER.info(`Rebalanced: ${caseQueue.case_id}`);
                        }
                    }
                }
            }
            
            LOGGER.info('Workload rebalancing completed');
            
        } catch (error) {
            LOGGER.error(`Error in rebalanceWorkload: ${error.message}`);
        }
    }
}

module.exports = new WorkflowRouter();
