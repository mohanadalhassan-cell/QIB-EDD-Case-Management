// Organization Controller for QIB EDD System
// Handles org tree visualization, search, and employee details

document.addEventListener('DOMContentLoaded', function() {
  initOrganization();
});

// Current view state
let currentView = 'tree';
let currentTab = 'full';

function initOrganization() {
  // Check auth - use sessionStorage like other views
  const sessionData = sessionStorage.getItem('edd_session');
  if (!sessionData) {
    window.location.replace('login.html');
    return;
  }
  
  let session;
  try {
    session = JSON.parse(sessionData);
    if (!session.authenticated || !session.user) {
      window.location.replace('login.html');
      return;
    }
  } catch (e) {
    window.location.replace('login.html');
    return;
  }
  
  const currentUser = session.user;
  
  // Set user info
  document.getElementById('user-name').textContent = currentUser.name || 'User';
  document.getElementById('user-role').textContent = currentUser.role || 'Staff';
  
  // Init search
  const searchInput = document.getElementById('org-search');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }
  
  // Populate IT team
  populateITTeam();
  
  // Populate WPS team
  populateWPSTeam();
  
  // Populate workflow groups
  populateWorkflowGroups();
  
  // Logout handler
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    sessionStorage.removeItem('edd_session');
    sessionStorage.removeItem('edd_user');
    window.location.replace('login.html');
  });
}

// View switching
function setView(view) {
  currentView = view;
  
  // Update buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  // Show/hide content
  document.getElementById('tab-full').style.display = view === 'tree' ? 'block' : 'none';
  document.getElementById('view-groups').style.display = view === 'groups' ? 'block' : 'none';
  
  // List view converts to card list
  if (view === 'list') {
    document.getElementById('tab-full').style.display = 'block';
    document.getElementById('org-tree').style.flexDirection = 'column';
    document.querySelectorAll('.org-level').forEach(el => {
      el.style.justifyContent = 'flex-start';
    });
  } else if (view === 'tree') {
    document.getElementById('org-tree').style.flexDirection = 'column';
    document.querySelectorAll('.org-level').forEach(el => {
      el.style.justifyContent = 'center';
    });
  }
}

// Tab switching
function setTab(tab) {
  currentTab = tab;
  
  document.querySelectorAll('.org-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  
  // Filter by department
  const allCards = document.querySelectorAll('.emp-card');
  allCards.forEach(card => {
    card.style.display = 'block';
  });
  
  if (tab === 'operations') {
    // Show only operations related
    filterByDepartment(['Operations', 'COO', 'WPS', 'CDD', 'Vault', 'Special']);
  } else if (tab === 'retail') {
    filterByDepartment(['Retail', 'Mass', 'Tamayuz', 'Private']);
  } else if (tab === 'it') {
    filterByDepartment(['IT', 'Technology', 'Core Banking', 'App Dev']);
  }
}

function filterByDepartment(keywords) {
  const allCards = document.querySelectorAll('.emp-card');
  allCards.forEach(card => {
    const dept = card.querySelector('.emp-dept')?.textContent || '';
    const title = card.querySelector('.emp-title')?.textContent || '';
    const combined = (dept + ' ' + title).toLowerCase();
    
    const matches = keywords.some(kw => combined.includes(kw.toLowerCase()));
    card.style.display = matches ? 'block' : 'none';
  });
}

// Search handling
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    // Show all
    document.querySelectorAll('.emp-card, .team-member').forEach(el => {
      el.style.display = '';
    });
    return;
  }
  
  // Search cards
  document.querySelectorAll('.emp-card').forEach(card => {
    const name = card.querySelector('.emp-name')?.textContent.toLowerCase() || '';
    const title = card.querySelector('.emp-title')?.textContent.toLowerCase() || '';
    const dept = card.querySelector('.emp-dept')?.textContent.toLowerCase() || '';
    
    const matches = name.includes(query) || title.includes(query) || dept.includes(query);
    card.style.display = matches ? '' : 'none';
  });
  
  // Search team members
  document.querySelectorAll('.team-member').forEach(member => {
    const name = member.querySelector('h4')?.textContent.toLowerCase() || '';
    const title = member.querySelector('p')?.textContent.toLowerCase() || '';
    
    const matches = name.includes(query) || title.includes(query);
    member.style.display = matches ? '' : 'none';
  });
}

// Expand/collapse team sections
function toggleTeam(teamId) {
  const section = document.getElementById('team-' + teamId);
  if (section) {
    section.classList.toggle('expanded');
  }
}

// Show employee detail panel
function showDetail(empId) {
  const panel = document.getElementById('detail-panel');
  const overlay = document.getElementById('detail-overlay');
  const body = document.getElementById('detail-body');
  
  // Find employee data
  const emp = getEmployeeData(empId);
  
  if (!emp) {
    body.innerHTML = `<p style="color: var(--text-muted);">Employee not found</p>`;
  } else {
    body.innerHTML = `
      ${emp.photo ? 
        `<img src="${emp.photo}" class="detail-photo" alt="${emp.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="emp-initials" style="width:120px;height:120px;font-size:36px;margin:0 auto 16px;display:none;">${getInitials(emp.name)}</div>` :
        `<div class="emp-initials" style="width:120px;height:120px;font-size:36px;margin:0 auto 16px;">${getInitials(emp.name)}</div>`
      }
      <div class="detail-name">${emp.name}</div>
      <div class="detail-title">${emp.title}</div>
      
      <div class="detail-section">
        <h4>Employee Information</h4>
        <div class="detail-row">
          <span class="detail-label">Employee ID</span>
          <span class="detail-value">${emp.id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Department</span>
          <span class="detail-value">${emp.department}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Division</span>
          <span class="detail-value">${emp.division || 'N/A'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Reports To</span>
          <span class="detail-value">${emp.reportsTo || 'Board of Directors'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email</span>
          <span class="detail-value">${emp.email || emp.name.split(' ')[0].toLowerCase() + '@qib.com.qa'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Location</span>
          <span class="detail-value">${emp.location || 'QIB Head Office, Doha'}</span>
        </div>
      </div>
      
      ${emp.specialTag ? `
        <div class="detail-section">
          <h4>Special Designation</h4>
          <div style="padding: 12px; border-radius: 8px; background: ${getTagBackground(emp.specialTag)}; text-align: center;">
            <span style="font-weight: 700; font-size: 14px;">${emp.specialTag}</span>
            <p style="font-size: 12px; margin-top: 4px; opacity: 0.8;">${getTagDescription(emp.specialTag)}</p>
          </div>
        </div>
      ` : ''}
      
      ${emp.workflowGroups && emp.workflowGroups.length > 0 ? `
        <div class="detail-section">
          <h4>EDD Workflow Groups</h4>
          <div class="permission-tags">
            ${emp.workflowGroups.map(g => `<span class="permission-tag">${g}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      ${emp.eddTasks && emp.eddTasks.length > 0 ? `
        <div class="detail-section">
          <h4>EDD Task Permissions</h4>
          <div class="permission-tags">
            ${emp.eddTasks.map(t => `<span class="permission-tag" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">${t}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="detail-section">
        <h4>Case Statistics</h4>
        <div class="detail-row">
          <span class="detail-label">Active Cases</span>
          <span class="detail-value" style="color: var(--accent);">${emp.activeCases || Math.floor(Math.random() * 10)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Completed This Month</span>
          <span class="detail-value" style="color: #22c55e;">${emp.completedCases || Math.floor(Math.random() * 25)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Avg Processing Time</span>
          <span class="detail-value">${emp.avgProcessingTime || (Math.floor(Math.random() * 3) + 1) + ' days'}</span>
        </div>
      </div>
    `;
  }
  
  panel.classList.add('open');
  overlay.classList.add('visible');
}

// Close detail panel
function closeDetail() {
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('detail-overlay').classList.remove('visible');
}

// Get employee data by ID
function getEmployeeData(id) {
  const employees = {
    'BOD-001': {
      id: 'BOD-001',
      name: 'Sheikh Jassim bin Hamad Al Thani',
      title: 'Chairman of the Board',
      department: 'Board of Directors',
      division: 'Governance',
      specialTag: 'CHAIRMAN',
      workflowGroups: ['Management']
    },
    'EXE-001': {
      id: 'EXE-001',
      name: 'Mr. Bassel Gamal',
      title: 'Group Chief Executive Officer',
      department: 'Executive Leadership',
      division: 'Executive',
      photo: 'assets/employees/GCEO.jpeg',
      specialTag: 'GCEO',
      reportsTo: 'Board of Directors',
      workflowGroups: ['Management'],
      eddTasks: ['Final Approval', 'Escalation Review', 'Policy Override']
    },
    'GM-001': {
      id: 'GM-001',
      name: 'Saleem Ulhiq',
      title: 'Chief Operating Officer',
      department: 'Operations & Technology',
      division: 'Operations',
      photo: 'assets/employees/Saleem.jpeg',
      specialTag: 'COO',
      reportsTo: 'GCEO',
      workflowGroups: ['Management'],
      eddTasks: ['Ops Approval', 'IT Approval', 'Resource Allocation']
    },
    'GM-002': {
      id: 'GM-002',
      name: 'D. Anand',
      title: 'General Manager - Retail Banking',
      department: 'Retail Banking',
      division: 'Retail',
      photo: 'assets/employees/Anand.jpeg',
      reportsTo: 'GCEO',
      workflowGroups: ['Management'],
      eddTasks: ['Retail Approval', 'Customer Escalation']
    },
    'GM-003': {
      id: 'GM-003',
      name: 'Tariq Fawzi',
      title: 'General Manager - Wholesale Banking',
      department: 'Wholesale Banking',
      division: 'WBG',
      photo: 'assets/employees/Tariq.jpeg',
      reportsTo: 'GCEO',
      workflowGroups: ['Management']
    },
    'GM-004': {
      id: 'GM-004',
      name: 'Gourang',
      title: 'General Manager - Finance',
      department: 'Finance',
      division: 'Finance',
      photo: 'assets/employees/Gourang.jpeg',
      reportsTo: 'GCEO'
    },
    'GM-005': {
      id: 'GM-005',
      name: 'Rakesh',
      title: 'General Manager - Risk',
      department: 'Risk Management',
      division: 'Risk',
      photo: 'assets/employees/Rakesh.jpeg',
      reportsTo: 'GCEO',
      workflowGroups: ['Compliance'],
      eddTasks: ['Risk Assessment', 'Compliance Review']
    },
    'GM-006': {
      id: 'GM-006',
      name: 'Dinos',
      title: 'General Manager - Strategy & Projects',
      department: 'Strategy & Projects',
      division: 'Strategy',
      photo: 'assets/employees/DINOS.jpeg',
      reportsTo: 'GCEO'
    },
    'GM-007': {
      id: 'GM-007',
      name: 'Khalifa Al-Muslim',
      title: 'Head of HR Group',
      department: 'Human Resources',
      division: 'HR',
      photo: 'assets/employees/Khalifa.jpeg',
      reportsTo: 'GCEO'
    },
    'OPS-001': {
      id: 'OPS-001',
      name: 'Mr. Amit Malhotra',
      title: 'Head of Operations',
      department: 'Operations Division',
      division: 'Operations',
      photo: 'assets/employees/MR.Amit.png',
      specialTag: 'THE VISION',
      reportsTo: 'COO - Saleem Ulhiq',
      workflowGroups: ['Management', 'CDD_Checker'],
      eddTasks: ['Operations Approval', 'Process Design', 'Team Management', 'Escalation Handling']
    },
    'IT-001': {
      id: 'IT-001',
      name: 'Khurram',
      title: 'Head of IT',
      department: 'Information Technology',
      division: 'IT',
      reportsTo: 'COO - Saleem Ulhiq',
      workflowGroups: ['IT_Admin'],
      eddTasks: ['System Administration', 'IT Support', 'Access Management']
    },
    'MGR-001': {
      id: 'MGR-001',
      name: 'Mohanad Al Hassan',
      title: 'Department Manager - WPS & DBO',
      department: 'WPS & Digital Back Office',
      division: 'Operations',
      photo: 'assets/employees/MR.MOHANAD ALHASSAM.jpeg',
      specialTag: 'PILOT',
      reportsTo: 'Head of Operations - Amit Malhotra',
      workflowGroups: ['CDD_Maker', 'CDD_Checker'],
      eddTasks: ['Case Creation', 'Data Entry', 'Quality Check', 'WPS Processing']
    },
    'MGR-002': {
      id: 'MGR-002',
      name: 'Youssef Al-Khuzain',
      title: 'Department Manager - Special Services',
      department: 'Special Services',
      division: 'Operations',
      photo: 'assets/employees/Youssef.jpeg',
      reportsTo: 'Head of Operations - Amit Malhotra'
    },
    'MGR-004': {
      id: 'MGR-004',
      name: 'Ashraf',
      title: 'Department Manager - Main Vault',
      department: 'Main Vault',
      division: 'Operations',
      photo: 'assets/employees/Ashraf.jpeg',
      reportsTo: 'Head of Operations - Amit Malhotra'
    },
    'MGR-006': {
      id: 'MGR-006',
      name: 'Ghaleb Essam',
      title: 'Manager - CDD & EDD Operations',
      department: 'CDD & EDD Operations',
      division: 'Operations',
      specialTag: 'CDD/EDD',
      reportsTo: 'Head of Operations - Amit Malhotra',
      workflowGroups: ['CDD_Maker', 'CDD_Checker', 'Compliance'],
      eddTasks: ['EDD Case Management', 'CDD Review', 'Compliance Check', 'AML Screening']
    }
  };
  
  return employees[id] || null;
}

// Get initials from name
function getInitials(name) {
  if (!name) return '??';
  const parts = name.replace(/Mr\.|Mrs\.|Ms\.|Dr\./gi, '').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
}

// Get tag background color
function getTagBackground(tag) {
  const colors = {
    'CHAIRMAN': 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(154, 123, 10, 0.2))',
    'GCEO': 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2))',
    'COO': 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
    'THE VISION': 'linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(124, 58, 237, 0.2))',
    'PILOT': 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
    'CDD/EDD': 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))'
  };
  return colors[tag] || 'rgba(255,255,255,0.1)';
}

// Get tag description
function getTagDescription(tag) {
  const descriptions = {
    'CHAIRMAN': 'Board Leadership & Governance',
    'GCEO': 'Group Chief Executive Officer',
    'COO': 'Chief Operating Officer - Operations & IT',
    'THE VISION': 'Operations Leader & Innovator',
    'PILOT': 'WPS & Digital Transformation Lead',
    'CDD/EDD': 'Customer Due Diligence & Enhanced Due Diligence'
  };
  return descriptions[tag] || '';
}

// Populate IT Team section
function populateITTeam() {
  const grid = document.getElementById('it-team-grid');
  if (!grid) return;
  
  const itTeam = [
    { name: 'Syed Shah', title: 'IT Manager', photo: 'assets/employees/syed shah.jpeg' },
    { name: 'Sayed ElMahdy', title: 'Senior Developer', photo: 'assets/employees/sayed elmahdy.jpeg' },
    { name: 'Mohammed Khaja', title: 'Core Banking Lead', photo: 'assets/employees/Mohammed_Khaja.jpeg' },
    { name: 'Nabit', title: 'Application Developer', photo: 'assets/employees/NABIT.jpeg' },
    { name: 'Ayman Zain', title: 'Service Desk Lead', photo: 'assets/employees/AYMAN_ZAIN.jpeg' },
    { name: 'Hassan', title: 'BO Reports Specialist', photo: 'assets/employees/HASSAN.jpeg' },
    { name: 'Ahmad', title: 'Network Administrator', photo: null },
    { name: 'Ravi Kumar', title: 'Database Admin', photo: null },
    { name: 'Mohamed Ali', title: 'Security Analyst', photo: null },
    { name: 'Fahad', title: 'IT Support', photo: null }
  ];
  
  grid.innerHTML = itTeam.map(member => `
    <div class="team-member" onclick="showTeamMemberDetail('${member.name}', '${member.title}', '${member.photo || ''}')">
      ${member.photo ? 
        `<img src="${member.photo}" class="team-member-photo" alt="${member.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
         <div class="team-member-initials" style="display:none;">${getInitials(member.name)}</div>` :
        `<div class="team-member-initials">${getInitials(member.name)}</div>`
      }
      <div class="team-member-info">
        <h4>${member.name}</h4>
        <p>${member.title}</p>
      </div>
    </div>
  `).join('');
}

// Populate WPS Team section
function populateWPSTeam() {
  const grid = document.getElementById('wps-team-grid');
  if (!grid) return;
  
  const wpsTeam = [
    { name: 'Fatima Al-Rashid', title: 'WPS Senior Officer', photo: null },
    { name: 'Sara Mohamed', title: 'WPS Officer', photo: null },
    { name: 'Ahmed Hassan', title: 'DBO Specialist', photo: null },
    { name: 'Noor Al-Din', title: 'Data Entry Operator', photo: null }
  ];
  
  grid.innerHTML = wpsTeam.map(member => `
    <div class="team-member" onclick="showTeamMemberDetail('${member.name}', '${member.title}', '')">
      <div class="team-member-initials">${getInitials(member.name)}</div>
      <div class="team-member-info">
        <h4>${member.name}</h4>
        <p>${member.title}</p>
      </div>
    </div>
  `).join('');
}

// Show team member detail (simplified)
function showTeamMemberDetail(name, title, photo) {
  const panel = document.getElementById('detail-panel');
  const overlay = document.getElementById('detail-overlay');
  const body = document.getElementById('detail-body');
  
  body.innerHTML = `
    ${photo ? 
      `<img src="${photo}" class="detail-photo" alt="${name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="emp-initials" style="width:120px;height:120px;font-size:36px;margin:0 auto 16px;display:none;">${getInitials(name)}</div>` :
      `<div class="emp-initials" style="width:120px;height:120px;font-size:36px;margin:0 auto 16px;">${getInitials(name)}</div>`
    }
    <div class="detail-name">${name}</div>
    <div class="detail-title">${title}</div>
    
    <div class="detail-section">
      <h4>Employee Information</h4>
      <div class="detail-row">
        <span class="detail-label">Department</span>
        <span class="detail-value">${title.includes('IT') || title.includes('Developer') || title.includes('Admin') || title.includes('Service Desk') ? 'Information Technology' : 'WPS & DBO'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email</span>
        <span class="detail-value">${name.toLowerCase().replace(/ /g, '.').replace(/[^a-z.]/g, '')}@qib.com.qa</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Location</span>
        <span class="detail-value">QIB Head Office, Doha</span>
      </div>
    </div>
    
    <div class="detail-section">
      <h4>Case Statistics</h4>
      <div class="detail-row">
        <span class="detail-label">Active Tasks</span>
        <span class="detail-value" style="color: var(--accent);">${Math.floor(Math.random() * 8) + 1}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Completed This Month</span>
        <span class="detail-value" style="color: #22c55e;">${Math.floor(Math.random() * 30) + 5}</span>
      </div>
    </div>
  `;
  
  panel.classList.add('open');
  overlay.classList.add('visible');
}

// Populate workflow groups
function populateWorkflowGroups() {
  const container = document.getElementById('workflow-groups-container');
  if (!container) return;
  
  // Use data from organization_data.js if available
  const groups = typeof WorkflowGroups !== 'undefined' ? WorkflowGroups : {
    Business_Mass: {
      name: 'Business - Mass Segment',
      description: 'Retail Business team for Mass segment customers',
      tasks: ['Create EDD Request', 'Customer Contact', 'Document Collection']
    },
    Business_Tamayuz: {
      name: 'Business - Tamayuz Segment',
      description: 'Retail Business team for Tamayuz segment customers',
      tasks: ['Create EDD Request', 'Premium Customer Contact', 'Document Collection']
    },
    Business_Private: {
      name: 'Business - Private Banking',
      description: 'Private Banking team for high-net-worth customers',
      tasks: ['Create EDD Request', 'VIP Customer Contact', 'Document Collection', 'Wealth Review']
    },
    CDD_Maker: {
      name: 'CDD Maker',
      description: 'CDD team members who create and input case data',
      tasks: ['Data Entry', 'Document Upload', 'Initial Screening', 'Case Creation']
    },
    CDD_Checker: {
      name: 'CDD Checker',
      description: 'CDD team members who review and verify case data',
      tasks: ['Data Verification', 'Document Review', 'Quality Check', 'Case Approval']
    },
    Compliance: {
      name: 'Compliance Team',
      description: 'Compliance officers for regulatory review',
      tasks: ['AML Review', 'Sanctions Check', 'Risk Assessment', 'Final Decision', 'Regulatory Reporting']
    },
    Management: {
      name: 'Management',
      description: 'Senior management for escalations and approvals',
      tasks: ['Escalation Review', 'Final Approval', 'Policy Decisions', 'Exception Handling']
    },
    Audit: {
      name: 'Audit Team',
      description: 'Internal audit for case review and compliance',
      tasks: ['Audit Review', 'Compliance Check', 'Documentation Audit', 'Process Review']
    },
    IT_Admin: {
      name: 'IT Administration',
      description: 'IT team for system administration and support',
      tasks: ['User Management', 'System Configuration', 'Access Control', 'Technical Support']
    },
    Marketing_Templates: {
      name: 'Marketing Templates',
      description: 'Marketing team for communication templates',
      tasks: ['Template Design', 'Customer Communication', 'Brand Compliance']
    }
  };
  
  const icons = {
    Business_Mass: '👥',
    Business_Tamayuz: '⭐',
    Business_Private: '💎',
    CDD_Maker: '✏️',
    CDD_Checker: '✅',
    Compliance: '🛡️',
    Management: '👑',
    Audit: '📋',
    IT_Admin: '💻',
    Marketing_Templates: '📢'
  };
  
  container.innerHTML = Object.entries(groups).map(([key, group]) => `
    <div class="workflow-group-card">
      <h3>${icons[key] || '📁'} ${group.name}</h3>
      <p>${group.description}</p>
      <div class="group-tasks">
        ${group.tasks.map(t => `<span class="group-task">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetail();
  }
});
