/**
 * EDD INVESTIGATION NOTES PANEL
 * 
 * Allows investigators to document their findings, analysis, and
 * decision rationale throughout the investigation process.
 * 
 * Features:
 * - Create investigation notes at any time
 * - Timestamp each note entry
 * - Organize by section or by type (Risk Analysis, Mitigating Factors, etc.)
 * - Full audit trail of all notes created
 * - Export notes as part of case file
 */

class InvestigationNotesPanel {
  constructor(caseId) {
    this.caseId = caseId;
    this.notes = [];
    this.categories = [
      'Risk Analysis',
      'Mitigating Factors',
      'Customer Clarification',
      'Additional Evidence',
      'Compliance Concern',
      'Escalation Note',
      'Manager Feedback',
      'General Note'
    ];
  }

  /**
   * Add a new investigation note
   */
  addNote(category, content, sectionReference = null) {
    if (!content || content.trim().length === 0) {
      throw new Error('Note content cannot be empty');
    }

    const note = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      caseId: this.caseId,
      category: category,
      content: content,
      sectionReference: sectionReference, // e.g., "section4", "section10"
      createdAt: new Date().toISOString(),
      createdBy: 'Current User', // In production: from session
      lastModified: new Date().toISOString(),
      linkedEvidence: [] // Array of evidence IDs
    };

    this.notes.push(note);
    this.logNoteCreation(note);
    return note;
  }

  /**
   * Get all notes for a section
   */
  getNotesBySection(sectionName) {
    return this.notes.filter(note => note.sectionReference === sectionName);
  }

  /**
   * Get all notes by category
   */
  getNotesByCategory(category) {
    return this.notes.filter(note => note.category === category);
  }

  /**
   * Get risk analysis notes
   */
  getRiskAnalysisNotes() {
    return this.getNotesByCategory('Risk Analysis');
  }

  /**
   * Get mitigating factor notes
   */
  getMitigatingFactorNotes() {
    return this.getNotesByCategory('Mitigating Factors');
  }

  /**
   * Get escalation notes
   */
  getEscalationNotes() {
    return this.getNotesByCategory('Escalation Note');
  }

  /**
   * Get all notes for display in timeline
   */
  getTimelineNotes() {
    return this.notes.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  /**
   * Generate summary for decision section
   */
  generateNoteSummary() {
    const riskNotes = this.getRiskAnalysisNotes();
    const mitigatingNotes = this.getMitigatingFactorNotes();
    const escalationNotes = this.getEscalationNotes();

    return {
      totalNotes: this.notes.length,
      riskAnalysisCount: riskNotes.length,
      mitigatingFactorsCount: mitigatingNotes.length,
      escalationsCount: escalationNotes.length,
      noteCategories: this.notes.map(n => n.category),
      lastNoteTime: this.notes.length > 0 ? this.notes[0].createdAt : null
    };
  }

  /**
   * Log note creation for audit trail
   */
  logNoteCreation(note) {
    console.log(`[NOTE CREATED] ${note.category}: ${note.content.substring(0, 50)}...`);
    // In production: POST to audit log endpoint
  }

  /**
   * Export all notes as JSON for case file
   */
  exportNotes() {
    return {
      caseId: this.caseId,
      notesCount: this.notes.length,
      notes: this.notes,
      exportedAt: new Date().toISOString()
    };
  }
}

/**
 * HTML Template for Investigation Notes Panel
 */
const investigationNotesPanelHTML = `
<div class="edd-investigation-notes-panel">
  <h3>📝 Investigation Notes</h3>
  
  <div class="notes-input-section">
    <label for="noteCategory">Category:</label>
    <select id="noteCategory">
      <option value="Risk Analysis">Risk Analysis</option>
      <option value="Mitigating Factors">Mitigating Factors</option>
      <option value="Customer Clarification">Customer Clarification</option>
      <option value="Additional Evidence">Additional Evidence</option>
      <option value="Compliance Concern">Compliance Concern</option>
      <option value="Escalation Note">Escalation Note</option>
      <option value="Manager Feedback">Manager Feedback</option>
      <option value="General Note">General Note</option>
    </select>

    <label for="noteContent">Note:</label>
    <textarea id="noteContent" rows="3" placeholder="Document your findings and analysis..."></textarea>

    <label for="noteSection">Link to Section (Optional):</label>
    <select id="noteSection">
      <option value="">General note (not linked)</option>
      <option value="section1">Section 1: Risk Classification</option>
      <option value="section2">Section 2: Customer Information</option>
      <option value="section3">Section 3: Purpose of Account</option>
      <option value="section4">Section 4: Source of Income</option>
      <option value="section5">Section 5: Initial Deposit</option>
      <option value="section6">Section 6: Expected Transactions</option>
      <option value="section7">Section 7: Bank Relations</option>
      <option value="section8">Section 8: Other Banks</option>
      <option value="section9">Section 9: Related Parties</option>
      <option value="section10">Section 10: PEP Information</option>
      <option value="section11">Section 11: Decision</option>
    </select>

    <button id="addNoteBtn">📌 Add Note</button>
  </div>

  <div class="notes-display-section">
    <h4>Notes Timeline</h4>
    <div id="notesTimeline" class="notes-timeline">
      <!-- Notes will be inserted here -->
    </div>
  </div>
</div>

<style>
  .edd-investigation-notes-panel {
    background: rgba(255, 193, 7, 0.05);
    border: 1px solid rgba(255, 193, 7, 0.2);
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
  }

  .edd-investigation-notes-panel h3 {
    margin: 0 0 16px 0;
    color: var(--text-primary);
    font-size: 16px;
  }

  .notes-input-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 193, 7, 0.1);
  }

  .notes-input-section > label {
    grid-column: 1;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    align-self: start;
    margin-top: 4px;
  }

  .notes-input-section > textarea,
  .notes-input-section > select {
    grid-column: span 2;
    padding: 10px;
    border: 1px solid var(--glass-border);
    border-radius: 6px;
    background: var(--glass-bg);
    color: var(--text-primary);
    font-family: inherit;
  }

  .notes-input-section > textarea:focus,
  .notes-input-section > select:focus {
    outline: none;
    border-color: #FFC107;
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
  }

  #addNoteBtn {
    grid-column: 1 / -1;
    padding: 10px 16px;
    background: linear-gradient(135deg, #FFC107, #FFB300);
    color: #333;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  #addNoteBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }

  .notes-timeline {
    max-height: 400px;
    overflow-y: auto;
  }

  .note-entry {
    background: rgba(255, 193, 7, 0.08);
    border-left: 3px solid #FFC107;
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 4px;
  }

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .note-category {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    background: rgba(255, 193, 7, 0.2);
    color: #FFC107;
  }

  .note-timestamp {
    font-size: 11px;
    color: var(--text-muted);
  }

  .note-content {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .note-section-link {
    display: inline-block;
    margin-top: 6px;
    padding: 4px 8px;
    background: rgba(33, 150, 243, 0.1);
    color: #2196F3;
    border-radius: 4px;
    font-size: 11px;
    text-decoration: none;
  }
</style>
`;

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InvestigationNotesPanel;
}