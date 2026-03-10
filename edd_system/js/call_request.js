/**
 * QIB Call Center Workflow Module
 * Regulatory Basis: QCB Banking Supervision, FATF Rec 10 & 11, Basel BCBS 239
 * Purpose: Manage customer contact requests with recorded statement capture
 * 
 * Key Features:
 * - Role-based call request creation (CDD, Compliance, Branch)
 * - CDD supervisor approval workflow
 * - Call Center queue management
 * - Restricted information display (hide AML/Risk data)
 * - Audit trail logging
 * - Recording reference linking to case
 */

const CallRequestManager = {
  /**
   * Create a customer contact request
   * Authorization: CDD Analyst, Compliance Officer, Branch Manager
   * For CDD: Requires supervisor approval before routing to call center
   */
  createContactRequest: function(caseId, requestData) {
    const currentUser = EDDMockData.currentUser;
    
    // Role validation
    const allowedRoles = ['cdd', 'compliance', 'business'];
    if (!allowedRoles.includes(currentUser.role)) {
      throw new Error('Only CDD, Compliance, or Branch can create contact requests');
    }

    // CDD requests require supervisor approval (not yet in queue)
    const requiresApproval = currentUser.role === 'cdd';
    const status = requiresApproval ? 'Pending Approval' : 'In Queue';

    const callRequest = {
      requestId: 'CR-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      caseId: caseId,
      status: status, // "Pending Approval", "In Queue", "In Progress", "Completed", "Cancelled"
      requestType: requestData.requestType || 'Customer Statement', // or Verification, Dispute Resolution, etc.
      requestedBy: currentUser.id,
      requestedByRole: currentUser.role,
      requestedByName: currentUser.name,
      requestedDate: new Date().toISOString(),
      
      // Approval workflow
      requiresApproval: requiresApproval,
      approvedBy: null,
      approvalDate: null,
      approvalNotes: null,
      
      // Call assignment
      assignedAgent: null,
      agentName: null,
      agentDepartment: null,
      
      // Call details
      callScheduledDate: requestData.callScheduledDate || null,
      callCompletedDate: null,
      callDuration: null, // in seconds
      callNotes: requestData.callNotes || '', // Initial notes about why call is needed
      
      // Customer statement capture
      customerStatement: '', // Statement captured during/after call
      statementType: requestData.statementType || 'Oral', // Oral, Written, Email
      statementLanguage: requestData.statementLanguage || 'EN', // EN, AR
      
      // Recording storage (compliant storage system reference)
      recordingReference: null, // Reference to external call recording system
      recordingStorageLocation: 'Call Recording System', // Regulated storage system
      recordingEncrypted: true, // Must be encrypted per security requirements
      recordingHashKey: null, // For integrity verification
      
      // Audit trail
      auditLog: [
        {
          action: 'REQUEST_CREATED',
          performedBy: currentUser.id,
          performedByName: currentUser.name,
          timestamp: new Date().toISOString(),
          details: `Contact request created by ${currentUser.name} (${currentUser.role})`
        }
      ]
    };

    // Add to case
    const caseObj = EDDMockData.cases.find(c => c.caseId === caseId);
    if (!caseObj) throw new Error('Case not found');

    if (!caseObj.callRequests) {
      caseObj.callRequests = [];
    }
    caseObj.callRequests.push(callRequest);

    // If CDD and doesn't require approval, add to queue immediately
    if (!requiresApproval) {
      this.addToCallQueue(callRequest);
    }

    return callRequest;
  },

  /**
   * Approve CDD contact request (only for CDD supervisor)
   */
  approveCDDRequest: function(requestId, approvalNotes) {
    const currentUser = EDDMockData.currentUser;
    
    // Only CDD supervisors can approve
    if (currentUser.role !== 'cdd_supervisor' && currentUser.role !== 'management') {
      throw new Error('Only CDD Supervisor or Management can approve requests');
    }

    const callRequest = this.findRequestById(requestId);
    if (!callRequest) throw new Error('Call request not found');

    if (callRequest.status !== 'Pending Approval') {
      throw new Error('Only pending requests can be approved');
    }

    callRequest.status = 'In Queue';
    callRequest.approvedBy = currentUser.id;
    callRequest.approvalDate = new Date().toISOString();
    callRequest.approvalNotes = approvalNotes;

    callRequest.auditLog.push({
      action: 'REQUEST_APPROVED',
      performedBy: currentUser.id,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Request approved by ${currentUser.name}. ${approvalNotes}`
    });

    // Add to call queue
    this.addToCallQueue(callRequest);

    return callRequest;
  },

  /**
   * Reject CDD contact request
   */
  rejectCDDRequest: function(requestId, rejectionReason) {
    const currentUser = EDDMockData.currentUser;
    
    if (currentUser.role !== 'cdd_supervisor' && currentUser.role !== 'management') {
      throw new Error('Only CDD Supervisor or Management can reject requests');
    }

    const callRequest = this.findRequestById(requestId);
    if (!callRequest) throw new Error('Call request not found');

    callRequest.status = 'Rejected';
    callRequest.auditLog.push({
      action: 'REQUEST_REJECTED',
      performedBy: currentUser.id,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Request rejected: ${rejectionReason}`
    });

    return callRequest;
  },

  /**
   * Add request to call center queue
   */
  addToCallQueue: function(callRequest) {
    if (!EDDMockData.callQueue) {
      EDDMockData.callQueue = [];
    }
    EDDMockData.callQueue.push(callRequest);
  },

  /**
   * Get call queue for call center agents
   * Returns ONLY information visible to call center (no AML/Risk data)
   */
  getCallQueue: function() {
    const currentUser = EDDMockData.currentUser;
    
    if (currentUser.role !== 'call_center') {
      throw new Error('Only call center agents can access call queue');
    }

    if (!EDDMockData.callQueue) return [];

    // Filter: only "In Progress" and "In Queue" requests
    return EDDMockData.callQueue
      .filter(r => ['In Queue', 'In Progress'].includes(r.status))
      .map(r => this.restrictCallCenterView(r));
  },

  /**
   * Get call requests for a specific case (role-aware)
   */
  getRequestsForCase: function(caseId) {
    const currentUser = EDDMockData.currentUser;
    const caseObj = EDDMockData.cases.find(c => c.caseId === caseId);
    
    if (!caseObj || !caseObj.callRequests) return [];

    // Case owner and CDD/Compliance can see full details
    if (currentUser.role === 'call_center') {
      return caseObj.callRequests.map(r => this.restrictCallCenterView(r));
    }

    return caseObj.callRequests;
  },

  /**
   * CRITICAL: Restrict call center view - hide AML/Risk data per regulatory requirement
   * Call Center sees ONLY: Customer name, case ref, request type, statement field
   */
  restrictCallCenterView: function(request) {
    return {
      requestId: request.requestId,
      caseId: request.caseId,
      status: request.status,
      requestType: request.requestType,
      requestedDate: request.requestedDate,
      callScheduledDate: request.callScheduledDate,
      customerStatement: request.customerStatement,
      statementType: request.statementType,
      callNotes: request.callNotes,
      // Call center can see customer name via case lookup (handled separately)
      // They CANNOT see: AML scores, risk ratings, any compliance flags
    };
  },

  /**
   * Assign call to agent
   */
  assignToAgent: function(requestId, agentId) {
    const currentUser = EDDMockData.currentUser;
    
    if (!['call_center_supervisor', 'call_center_manager'].includes(currentUser.role)) {
      throw new Error('Only call center supervisor can assign calls');
    }

    const callRequest = this.findRequestById(requestId);
    if (!callRequest) throw new Error('Call request not found');

    const agent = EDDMockData.users[agentId];
    if (!agent) throw new Error('Agent not found');

    callRequest.status = 'In Progress';
    callRequest.assignedAgent = agentId;
    callRequest.agentName = agent.name;
    callRequest.agentDepartment = agent.department;

    callRequest.auditLog.push({
      action: 'ASSIGNED_TO_AGENT',
      performedBy: currentUser.id,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Assigned to ${agent.name}`
    });

    return callRequest;
  },

  /**
   * Complete call and record statement
   */
  completeCall: function(requestId, statementData) {
    const currentUser = EDDMockData.currentUser;
    
    if (currentUser.role !== 'call_center') {
      throw new Error('Only call center agents can complete calls');
    }

    const callRequest = this.findRequestById(requestId);
    if (!callRequest) throw new Error('Call request not found');

    if (callRequest.assignedAgent !== currentUser.id) {
      throw new Error('You can only complete calls assigned to you');
    }

    callRequest.status = 'Completed';
    callRequest.callCompletedDate = new Date().toISOString();
    callRequest.callDuration = statementData.callDuration || 0;
    callRequest.customerStatement = statementData.statement || '';
    callRequest.recordingReference = statementData.recordingReference || null;
    callRequest.recordingHashKey = statementData.recordingHashKey || null;

    callRequest.auditLog.push({
      action: 'CALL_COMPLETED',
      performedBy: currentUser.id,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Call completed. Duration: ${callRequest.callDuration}s. Recording: ${callRequest.recordingReference}`
    });

    return callRequest;
  },

  /**
   * Log access to recording (compliance requirement)
   */
  logRecordingAccess: function(requestId, accessReason) {
    const currentUser = EDDMockData.currentUser;
    const callRequest = this.findRequestById(requestId);
    
    if (!callRequest) throw new Error('Call request not found');

    callRequest.auditLog.push({
      action: 'RECORDING_ACCESSED',
      performedBy: currentUser.id,
      performedByName: currentUser.name,
      timestamp: new Date().toISOString(),
      details: `Recording accessed. Reason: ${accessReason}`
    });

    return callRequest;
  },

  /**
   * Get audit trail for a call request
   */
  getAuditTrail: function(requestId) {
    const callRequest = this.findRequestById(requestId);
    if (!callRequest) throw new Error('Call request not found');
    
    return callRequest.auditLog;
  },

  /**
   * Find request by ID across all cases
   */
  findRequestById: function(requestId) {
    for (let caseObj of EDDMockData.cases) {
      if (caseObj.callRequests) {
        const request = caseObj.callRequests.find(r => r.requestId === requestId);
        if (request) return request;
      }
    }
    return null;
  },

  /**
   * Get call requests pending approval (for CDD supervisor)
   */
  getPendingApprovals: function() {
    const currentUser = EDDMockData.currentUser;
    
    if (currentUser.role !== 'cdd_supervisor' && currentUser.role !== 'management') {
      throw new Error('Only CDD Supervisor can view pending approvals');
    }

    const allRequests = [];
    for (let caseObj of EDDMockData.cases) {
      if (caseObj.callRequests) {
        allRequests.push(...caseObj.callRequests);
      }
    }

    return allRequests.filter(r => r.status === 'Pending Approval');
  },

  /**
   * Get compliance dashboard metrics for call requests
   */
  getMetrics: function() {
    const allRequests = [];
    for (let caseObj of EDDMockData.cases) {
      if (caseObj.callRequests) {
        allRequests.push(...caseObj.callRequests);
      }
    }

    return {
      total: allRequests.length,
      pendingApproval: allRequests.filter(r => r.status === 'Pending Approval').length,
      inQueue: allRequests.filter(r => r.status === 'In Queue').length,
      inProgress: allRequests.filter(r => r.status === 'In Progress').length,
      completed: allRequests.filter(r => r.status === 'Completed').length,
      rejected: allRequests.filter(r => r.status === 'Rejected').length,
      recordingsSecured: allRequests.filter(r => r.recordingReference && r.recordingEncrypted).length
    };
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CallRequestManager;
}
