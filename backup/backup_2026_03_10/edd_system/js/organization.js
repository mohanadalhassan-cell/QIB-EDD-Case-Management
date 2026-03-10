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
  
  // Populate Strategy team
  populateStrategyTeam();
  
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
    // =====================================================
    // BOARD OF DIRECTORS
    // =====================================================
    'BOD-001': {
      id: 'BOD-001',
      name: 'Sheikh Jassim bin Hamad Al Thani',
      nameAr: 'الشيخ جاسم بن حمد آل ثاني',
      title: 'Chairman of the Board',
      department: 'Board of Directors',
      division: 'Governance',
      specialTag: 'CHAIRMAN',
      workflowGroups: ['Management']
    },
    'BOD-002': {
      id: 'BOD-002',
      name: 'Sheikh Abdulrahman bin Hamad Al Thani',
      nameAr: 'الشيخ عبدالرحمن بن حمد آل ثاني',
      title: 'Vice Chairman',
      department: 'Board of Directors',
      division: 'Governance',
      specialTag: 'VICE CHAIRMAN',
      workflowGroups: ['Management']
    },
    'BOD-003': {
      id: 'BOD-003',
      name: 'Mr. Khalid Al-Subeai',
      nameAr: 'السيد خالد السبيعي',
      title: 'Board Member',
      department: 'Board of Directors',
      division: 'Governance',
      workflowGroups: ['Management']
    },
    'BOD-004': {
      id: 'BOD-004',
      name: 'Mr. Fahad Al-Khalifa',
      nameAr: 'السيد فهد الخليفة',
      title: 'Board Member',
      department: 'Board of Directors',
      division: 'Governance',
      workflowGroups: ['Management']
    },
    'BOD-005': {
      id: 'BOD-005',
      name: 'Mr. Nasser Al-Misnad',
      nameAr: 'السيد ناصر المسند',
      title: 'Board Member',
      department: 'Board of Directors',
      division: 'Governance',
      workflowGroups: ['Management']
    },
    'BOD-006': {
      id: 'BOD-006',
      name: 'Mr. Ahmed Al-Asmakh',
      nameAr: 'السيد أحمد الأسمخ',
      title: 'Independent Board Member',
      department: 'Board of Directors',
      division: 'Governance',
      workflowGroups: ['Management']
    },
    'BOD-007': {
      id: 'BOD-007',
      name: 'Mr. Saad Al-Muhannadi',
      nameAr: 'السيد سعد المهندي',
      title: 'Independent Board Member',
      department: 'Board of Directors',
      division: 'Governance',
      workflowGroups: ['Management']
    },

    // =====================================================
    // GROUP CEO
    // =====================================================
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

    // =====================================================
    // GCEO DIRECT REPORTS (C-SUITE)
    // =====================================================
    'GM-001': {
      id: 'GM-001',
      name: 'Saleem Ulhaq',
      title: 'Chief Operating Officer',
      department: 'Operations & Technology',
      division: 'Operations',
      photo: 'assets/employees/Saleem.jpeg',
      specialTag: 'COO',
      reportsTo: 'GCEO - Bassel Gamal',
      workflowGroups: ['Management'],
      eddTasks: ['Ops Approval', 'IT Approval', 'Resource Allocation']
    },
    'GM-002': {
      id: 'GM-002',
      name: 'D. Anand',
      title: 'Chief Personal Banking Officer',
      department: 'Personal Banking',
      division: 'Retail',
      photo: 'assets/employees/Anand.jpeg',
      reportsTo: 'GCEO - Bassel Gamal',
      workflowGroups: ['Management'],
      eddTasks: ['Retail Approval', 'Customer Escalation']
    },
    'GM-003': {
      id: 'GM-003',
      name: 'Tarek Y. Fawzi',
      title: 'Chief Wholesale Banking Officer',
      department: 'Wholesale Banking',
      division: 'WBG',
      photo: 'assets/employees/Tariq.jpeg',
      reportsTo: 'GCEO - Bassel Gamal',
      workflowGroups: ['Management']
    },
    'GM-004': {
      id: 'GM-004',
      name: 'Gourang Hemani',
      title: 'Chief Finance Officer',
      department: 'Finance',
      division: 'Finance',
      photo: 'assets/employees/Gourang.jpeg',
      reportsTo: 'GCEO - Bassel Gamal'
    },
    'GM-005': {
      id: 'GM-005',
      name: 'Rakesh Sanghvi',
      title: 'Chief Risk Officer',
      department: 'Risk Management',
      division: 'Risk',
      photo: 'assets/employees/Rakesh.jpeg',
      reportsTo: 'GCEO - Bassel Gamal',
      workflowGroups: ['Compliance'],
      eddTasks: ['Risk Assessment', 'Compliance Review']
    },
    'GM-006': {
      id: 'GM-006',
      name: 'Constantinos Constantinides',
      title: 'Chief Strategy & Digital Officer',
      department: 'Strategy & Digital',
      division: 'Strategy',
      photo: 'assets/employees/DINOS.jpeg',
      specialTag: 'STRATEGY',
      reportsTo: 'GCEO - Bassel Gamal',
      workflowGroups: ['Management', 'Strategy'],
      eddTasks: ['Strategic Planning', 'Digital Transformation', 'Innovation']
    },
    'GM-007': {
      id: 'GM-007',
      name: 'Khalefa Al-Mesalam',
      title: 'Head of Human Capital Group',
      department: 'Human Resources',
      division: 'HR',
      photo: 'assets/employees/Khalifa.jpeg',
      reportsTo: 'GCEO - Bassel Gamal'
    },
    'EXE-002': {
      id: 'EXE-002',
      name: 'Raafat Alrantisi',
      title: 'Executive Manager – GCEO Office',
      department: 'GCEO Office',
      division: 'Executive',
      reportsTo: 'GCEO - Bassel Gamal',
      workflowGroups: ['Management']
    },
    'EXE-003': {
      id: 'EXE-003',
      name: 'Anjitha J. Menon',
      title: 'Executive Secretary – GCEO Office',
      department: 'GCEO Office',
      division: 'Executive',
      reportsTo: 'GCEO - Bassel Gamal'
    },

    // =====================================================
    // STRATEGY & DIGITAL OFFICE (Reports to Constantinos)
    // =====================================================
    'STR-001': {
      id: 'STR-001',
      name: 'Andonis Theodosiou',
      title: 'T24 Program Director',
      department: 'Strategy & Digital',
      division: 'Strategy',
      reportsTo: 'CSDO - Constantinos Constantinides',
      workflowGroups: ['Strategy', 'IT_Admin'],
      eddTasks: ['T24 Integration', 'Core Banking Projects']
    },
    'STR-002': {
      id: 'STR-002',
      name: 'Hussein Mokdad',
      nameAr: 'حسين مقداد',
      title: 'Head Marketing & Research / Digital Experience',
      department: 'Marketing & Digital',
      division: 'Strategy',
      reportsTo: 'CSDO - Constantinos Constantinides',
      workflowGroups: ['Strategy', 'Marketing_Templates'],
      eddTasks: ['Customer Experience', 'Digital Channels']
    },
    'STR-003': {
      id: 'STR-003',
      name: 'Imad Bourhfir',
      title: 'Head Strategy, Innovation & Data Science',
      department: 'Strategy & Innovation',
      division: 'Strategy',
      reportsTo: 'CSDO - Constantinos Constantinides',
      workflowGroups: ['Strategy'],
      eddTasks: ['Data Analytics', 'Innovation Projects']
    },
    'STR-004': {
      id: 'STR-004',
      name: 'Mashaal Alderham',
      title: 'Assistant General Manager – Communications',
      department: 'Communications',
      division: 'Strategy',
      reportsTo: 'CSDO - Constantinos Constantinides',
      workflowGroups: ['Marketing_Templates']
    },
    'STR-005': {
      id: 'STR-005',
      name: 'Suzan Chaker',
      title: 'Manager – Business Support',
      department: 'Strategy & Digital',
      division: 'Strategy',
      reportsTo: 'CSDO - Constantinos Constantinides'
    },

    // =====================================================
    // PERSONAL BANKING (Reports to D. Anand)
    // =====================================================
    'PB-001': {
      id: 'PB-001',
      name: 'Abdulrahman Alnabit',
      title: 'Head of Wealth Management',
      department: 'Wealth Management',
      division: 'Retail',
      reportsTo: 'CPBO - D. Anand',
      workflowGroups: ['Business_Private'],
      eddTasks: ['Wealth Customer Review', 'HNW Decisions']
    },
    'PB-002': {
      id: 'PB-002',
      name: 'Ali Younes',
      title: 'Senior Manager',
      department: 'Personal Banking',
      division: 'Retail',
      reportsTo: 'CPBO - D. Anand',
      workflowGroups: ['Business_Mass']
    },
    'PB-003': {
      id: 'PB-003',
      name: 'Ayman Zein',
      title: 'Head of Alternative Channels Division',
      department: 'Alternative Channels',
      division: 'Retail',
      reportsTo: 'CPBO - D. Anand',
      workflowGroups: ['Business_Mass'],
      eddTasks: ['Channel Management', 'Digital Services']
    },
    'PB-004': {
      id: 'PB-004',
      name: 'Faiza Saber',
      title: 'Admin Assistant',
      department: 'Personal Banking',
      division: 'Retail',
      reportsTo: 'CPBO - D. Anand'
    },
    'PB-005': {
      id: 'PB-005',
      name: 'Hassan Alnoaimi',
      title: 'Division Head – Branch & Sales',
      department: 'Branch Network',
      division: 'Retail',
      reportsTo: 'CPBO - D. Anand',
      workflowGroups: ['Business_Mass', 'Business_Tamayuz'],
      eddTasks: ['Branch Operations', 'Sales Management']
    },
    'PB-006': {
      id: 'PB-006',
      name: 'Saleh Anam',
      title: 'Head of Retail Products',
      department: 'Retail Products',
      division: 'Retail',
      reportsTo: 'CPBO - D. Anand',
      workflowGroups: ['Business_Mass']
    },

    // =====================================================
    // BRANCH & SALES (Reports to Hassan Alnoaimi)
    // =====================================================
    'BR-001': {
      id: 'BR-001',
      name: 'Abdulkader Al-Masri',
      title: 'Head of Branch Business Development',
      department: 'Branch Development',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi',
      workflowGroups: ['Business_Mass', 'Business_Tamayuz']
    },
    'BR-002': {
      id: 'BR-002',
      name: 'Khalid Alnaemi',
      title: 'Area Manager',
      department: 'Branch Network',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi',
      workflowGroups: ['Business_Mass']
    },
    'BR-003': {
      id: 'BR-003',
      name: 'Mahmoud Marzughi',
      title: 'Area Manager',
      department: 'Branch Network',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi',
      workflowGroups: ['Business_Mass']
    },
    'BR-004': {
      id: 'BR-004',
      name: 'Naela Aljabir',
      title: 'Branch Manager',
      department: 'Branch Network',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi',
      workflowGroups: ['Business_Mass']
    },
    'BR-005': {
      id: 'BR-005',
      name: 'Nasser Radhi',
      title: 'Senior Manager – Branch Analytics & Information',
      department: 'Branch Analytics',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi'
    },
    'BR-006': {
      id: 'BR-006',
      name: 'Shrooq Saleh',
      title: 'Supervisor – Customer Service',
      department: 'Customer Service',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi',
      workflowGroups: ['Business_Mass']
    },
    'BR-007': {
      id: 'BR-007',
      name: 'Tag Rahmtalla',
      title: 'Head of Sales & Service',
      department: 'Sales & Service',
      division: 'Retail',
      reportsTo: 'Division Head - Hassan Alnoaimi',
      workflowGroups: ['Business_Mass', 'Business_Tamayuz']
    },

    // =====================================================
    // OPERATIONS (Reports to COO - Saleem Ulhaq)
    // =====================================================
    'OPS-001': {
      id: 'OPS-001',
      name: 'Mr. Amit Malhotra',
      title: 'Head of Operations',
      department: 'Operations Division',
      division: 'Operations',
      photo: 'assets/employees/MR.Amit.png',
      reportsTo: 'COO - Saleem Ulhaq',
      workflowGroups: ['Management', 'CDD_Checker'],
      eddTasks: ['Operations Approval', 'Process Design', 'Team Management', 'Escalation Handling']
    },
    'OPS-002': {
      id: 'OPS-002',
      name: 'Abdulhadi Alshahwani',
      title: 'Assistant General Manager – Business Services',
      department: 'Business Services',
      division: 'Operations',
      reportsTo: 'COO - Saleem Ulhaq',
      workflowGroups: ['Management']
    },
    'OPS-003': {
      id: 'OPS-003',
      name: 'Ahmar Azmi',
      title: 'Senior Executive Manager – Internal Control Management',
      department: 'Internal Control',
      division: 'Operations',
      reportsTo: 'COO - Saleem Ulhaq',
      workflowGroups: ['Compliance', 'Audit']
    },
    'OPS-004': {
      id: 'OPS-004',
      name: 'Arslan Khan',
      title: 'Head of Change Management & Process Improvement',
      department: 'Change Management',
      division: 'Operations',
      reportsTo: 'COO - Saleem Ulhaq',
      workflowGroups: ['Management']
    },
    'OPS-005': {
      id: 'OPS-005',
      name: 'Bader Ba-Khamis',
      title: 'Senior Executive Manager – Service Delivery',
      department: 'Service Delivery',
      division: 'Operations',
      reportsTo: 'COO - Saleem Ulhaq'
    },
    'OPS-006': {
      id: 'OPS-006',
      name: 'Nadim Azar',
      title: 'Head of Premises & Projects',
      department: 'Premises & Projects',
      division: 'Operations',
      reportsTo: 'COO - Saleem Ulhaq'
    },
    'OPS-007': {
      id: 'OPS-007',
      name: 'Nourhen Mediouni',
      title: 'Admin Support',
      department: 'COO Office',
      division: 'Operations',
      reportsTo: 'COO - Saleem Ulhaq'
    },
    'IT-001': {
      id: 'IT-001',
      name: 'Khurram Qadir',
      title: 'Chief Information Officer',
      department: 'Information Technology',
      division: 'IT',
      reportsTo: 'COO - Saleem Ulhaq',
      workflowGroups: ['IT_Admin', 'Management'],
      eddTasks: ['System Administration', 'IT Strategy', 'Digital Infrastructure']
    },

    // =====================================================
    // OPERATIONS MANAGEMENT (Reports to Amit Malhotra)
    // =====================================================
    'MGR-001': {
      id: 'MGR-001',
      name: 'Mohanad Al Hassan',
      title: 'Manager - WPS & DBO',
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
      name: 'Adel Abusbeitan',
      title: 'Senior Executive Manager – Wholesale Banking Operations',
      department: 'Wholesale Operations',
      division: 'Operations',
      reportsTo: 'Head of Operations - Amit Malhotra',
      workflowGroups: ['CDD_Checker']
    },
    'MGR-003': {
      id: 'MGR-003',
      name: 'Sayed ElMahdy',
      nameAr: 'سيد المهدي',
      title: 'Head of Retail & Shared Services Operations',
      department: 'Retail Operations',
      division: 'Operations',
      photo: 'assets/employees/sayed elmahdy.jpeg',
      specialTag: 'DEVELOPER',
      reportsTo: 'Head of Operations - Amit Malhotra',
      workflowGroups: ['CDD_Maker', 'CDD_Checker', 'IT_Admin'],
      eddTasks: ['EDD System Design', 'Retail Operations', 'Process Automation']
    },
    'MGR-004': {
      id: 'MGR-004',
      name: 'Youssef Al-Khuzain',
      title: 'Manager - Special Services',
      department: 'Special Services',
      division: 'Operations',
      photo: 'assets/employees/Youssef.jpeg',
      reportsTo: 'Head of Operations - Amit Malhotra'
    },
    'MGR-005': {
      id: 'MGR-005',
      name: 'Ashraf',
      title: 'Manager - Main Vault',
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
    },

    // =====================================================
    // HUMAN CAPITAL (Reports to Khalefa Al-Mesalam)
    // =====================================================
    'HR-001': {
      id: 'HR-001',
      name: 'Khaja Mohammed',
      title: 'Head of Rewards, Performance & Operations',
      department: 'HR Operations',
      division: 'HR',
      reportsTo: 'Head of HC - Khalefa Al-Mesalam'
    },
    'HR-002': {
      id: 'HR-002',
      name: 'Muhammed Finos',
      title: 'Head of Talent Acquisition & Workforce Planning',
      department: 'Talent Acquisition',
      division: 'HR',
      reportsTo: 'Head of HC - Khalefa Al-Mesalam'
    },
    'HR-003': {
      id: 'HR-003',
      name: 'Rudraksh Shekhar',
      title: 'Head of Learning & Development',
      department: 'Learning & Development',
      division: 'HR',
      reportsTo: 'Head of HC - Khalefa Al-Mesalam'
    },
    'HR-004': {
      id: 'HR-004',
      name: 'Wadha Al-Marri',
      title: 'Senior Executive Manager – Government Affairs',
      department: 'Government Affairs',
      division: 'HR',
      reportsTo: 'Head of HC - Khalefa Al-Mesalam'
    },

    // =====================================================
    // IT TEAM (Reports to CIO - Khurram Qadir)
    // =====================================================
    'IT-002': {
      id: 'IT-002',
      name: 'Syed Shah',
      title: 'IT Manager',
      department: 'Information Technology',
      division: 'IT',
      photo: 'assets/employees/syed shah.jpeg',
      reportsTo: 'CIO - Khurram Qadir',
      workflowGroups: ['IT_Admin'],
      eddTasks: ['IT Management', 'System Administration']
    },
    'IT-003': {
      id: 'IT-003',
      name: 'Mohammed Khaja',
      title: 'Core Banking Lead',
      department: 'Information Technology',
      division: 'IT',
      photo: 'assets/employees/Mohammed_Khaja.jpeg',
      reportsTo: 'CIO - Khurram Qadir',
      workflowGroups: ['IT_Admin'],
      eddTasks: ['Core Banking Support', 'T24 Administration']
    },
    'IT-004': {
      id: 'IT-004',
      name: 'Nabit',
      title: 'Application Developer',
      department: 'Information Technology',
      division: 'IT',
      photo: 'assets/employees/NABIT.jpeg',
      reportsTo: 'CIO - Khurram Qadir',
      workflowGroups: ['IT_Admin']
    },
    'IT-005': {
      id: 'IT-005',
      name: 'Hassan',
      title: 'BO Reports Specialist',
      department: 'Information Technology',
      division: 'IT',
      photo: 'assets/employees/HASSAN.jpeg',
      reportsTo: 'CIO - Khurram Qadir'
    }
  };
  
  return employees[id] || null;
}

// Get all employees for org structure audit
function getAllEmployees() {
  const empData = getEmployeeData;
  const ids = ['BOD-001','BOD-002','BOD-003','BOD-004','BOD-005','BOD-006','BOD-007',
    'EXE-001','EXE-002','EXE-003',
    'GM-001','GM-002','GM-003','GM-004','GM-005','GM-006','GM-007',
    'STR-001','STR-002','STR-003','STR-004','STR-005',
    'PB-001','PB-002','PB-003','PB-004','PB-005','PB-006',
    'BR-001','BR-002','BR-003','BR-004','BR-005','BR-006','BR-007',
    'OPS-001','OPS-002','OPS-003','OPS-004','OPS-005','OPS-006','OPS-007',
    'IT-001','IT-002','IT-003','IT-004','IT-005',
    'MGR-001','MGR-002','MGR-003','MGR-004','MGR-005','MGR-006',
    'HR-001','HR-002','HR-003','HR-004'];
  
  return ids.map(id => empData(id)).filter(e => e !== null);
}

// Organization Structure Audit Log
const orgAuditLog = {
  entries: [],
  log: function(action, employee, manager, status) {
    this.entries.push({
      timestamp: new Date().toISOString(),
      action: action,
      employee: employee,
      manager: manager,
      status: status
    });
  },
  getReport: function() {
    return {
      totalEntries: this.entries.length,
      lastUpdate: this.entries.length > 0 ? this.entries[this.entries.length - 1].timestamp : null,
      entries: this.entries
    };
  }
};

// Validate Organization Structure
function validateOrgStructure() {
  const employees = getAllEmployees();
  const report = {
    totalEmployees: employees.length,
    byDivision: {},
    reportingIssues: [],
    validated: new Date().toISOString()
  };
  
  employees.forEach(emp => {
    // Count by division
    if (!report.byDivision[emp.division]) {
      report.byDivision[emp.division] = 0;
    }
    report.byDivision[emp.division]++;
    
    // Log validation
    orgAuditLog.log('VALIDATED', emp.name, emp.reportsTo || 'Board', 'SUCCESS');
  });
  
  console.log('Organization Structure Validated:', report);
  return report;
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
    'VICE CHAIRMAN': 'linear-gradient(135deg, rgba(192, 160, 48, 0.2), rgba(138, 107, 10, 0.2))',
    'GCEO': 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2))',
    'COO': 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',

    'PILOT': 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2))',
    'CDD/EDD': 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2))',
    'DEVELOPER': 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))',
    'STRATEGY': 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))'
  };
  return colors[tag] || 'rgba(255,255,255,0.1)';
}

// Get tag description
function getTagDescription(tag) {
  const descriptions = {
    'CHAIRMAN': 'Board Leadership & Governance',
    'VICE CHAIRMAN': 'Deputy Board Leadership',
    'GCEO': 'Group Chief Executive Officer',
    'COO': 'Chief Operating Officer - Operations & IT',

    'PILOT': 'WPS & Digital Transformation Lead',
    'CDD/EDD': 'Customer Due Diligence & Enhanced Due Diligence',
    'DEVELOPER': 'EDD System Development & Enhancement',
    'STRATEGY': 'Strategic Planning & Project Management'
  };
  return descriptions[tag] || '';
}

// Populate IT Team section
function populateITTeam() {
  const grid = document.getElementById('it-team-grid');
  if (!grid) return;
  
  const itTeam = [
    { name: 'Syed Shah', title: 'IT Manager', photo: 'assets/employees/syed shah.jpeg', special: false },
    { name: 'Sayed ElMahdy', nameAr: 'سيد المهدي', title: 'Senior Developer', subtitle: 'EDD System Developer', photo: 'assets/employees/sayed elmahdy.jpeg', special: true, tag: 'DEVELOPER' },
    { name: 'Mohammed Khaja', title: 'Core Banking Lead', photo: 'assets/employees/Mohammed_Khaja.jpeg', special: false },
    { name: 'Nabit', title: 'Application Developer', photo: 'assets/employees/NABIT.jpeg', special: false },
    { name: 'Ayman Zain', title: 'Service Desk Lead', photo: 'assets/employees/AYMAN_ZAIN.jpeg', special: false },
    { name: 'Hassan', title: 'BO Reports Specialist', photo: 'assets/employees/HASSAN.jpeg', special: false },
    { name: 'Ahmad', title: 'Network Administrator', photo: null, special: false },
    { name: 'Ravi Kumar', title: 'Database Admin', photo: null, special: false },
    { name: 'Mohamed Ali', title: 'Security Analyst', photo: null, special: false },
    { name: 'Fahad', title: 'IT Support', photo: null, special: false }
  ];
  
  grid.innerHTML = itTeam.map(member => `
    <div class="team-member ${member.special ? 'special-member' : ''}" onclick="showTeamMemberDetail('${member.name}', '${member.title}', '${member.photo || ''}', '${member.nameAr || ''}', '${member.subtitle || ''}')">
      ${member.special ? `<span class="member-tag" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:linear-gradient(135deg, #3b82f6, #2563eb);border-radius:12px;font-size:9px;color:white;font-weight:600;">⚡ ${member.tag}</span>` : ''}
      ${member.photo ? 
        `<img src="${member.photo}" class="team-member-photo" alt="${member.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" style="${member.special ? 'border: 2px solid #3b82f6;' : ''}">
         <div class="team-member-initials" style="display:none;">${getInitials(member.name)}</div>` :
        `<div class="team-member-initials">${getInitials(member.name)}</div>`
      }
      <div class="team-member-info">
        <h4>${member.name}</h4>
        ${member.nameAr ? `<p style="font-size:11px;color:#9E9E9E;margin-bottom:2px;">${member.nameAr}</p>` : ''}
        <p>${member.title}</p>
        ${member.subtitle ? `<p style="font-size:10px;color:var(--accent);">${member.subtitle}</p>` : ''}
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

// Populate Strategy Team section
function populateStrategyTeam() {
  const grid = document.getElementById('strategy-team-grid');
  if (!grid) return;
  
  const strategyTeam = [
    { name: 'Hussein Meqdad', nameAr: 'حسين مقداد', title: 'Strategy Analyst', photo: null, special: true },
    { name: 'Ahmad Mahmoud', nameAr: 'أحمد محمود', title: 'Project Manager', photo: null },
    { name: 'Sara Al-Abdullah', title: 'Business Analyst', photo: null },
    { name: 'Omar Nasser', title: 'Strategy Coordinator', photo: null }
  ];
  
  grid.innerHTML = strategyTeam.map(member => `
    <div class="team-member ${member.special ? 'special-member' : ''}" onclick="showTeamMemberDetail('${member.name}', '${member.title}', '${member.photo || ''}', '${member.nameAr || ''}', '')" style="${member.special ? 'border: 2px solid #f59e0b;' : ''}">
      ${member.special ? `<span class="member-tag" style="position:absolute;top:8px;right:8px;padding:4px 10px;background:linear-gradient(135deg, #f59e0b, #d97706);border-radius:12px;font-size:9px;color:white;font-weight:600;">⭐ KEY</span>` : ''}
      <div class="team-member-initials" style="${member.special ? 'background: linear-gradient(135deg, #f59e0b, #d97706);' : ''}">${getInitials(member.name)}</div>
      <div class="team-member-info">
        <h4 ${member.special ? 'style="color: #f59e0b;"' : ''}>${member.name}</h4>
        ${member.nameAr ? `<p style="font-size:11px;color:#9E9E9E;margin-bottom:2px;direction:rtl;">${member.nameAr}</p>` : ''}
        <p>${member.title}</p>
      </div>
    </div>
  `).join('');
}

// Show team member detail (simplified)
function showTeamMemberDetail(name, title, photo, nameAr, subtitle) {
  const panel = document.getElementById('detail-panel');
  const overlay = document.getElementById('detail-overlay');
  const body = document.getElementById('detail-body');
  
  const isITDeveloper = title.includes('Developer') || title.includes('Lead') || title.includes('Admin') || title.includes('Manager');
  const isDeveloper = name === 'Sayed ElMahdy';
  const isStrategy = title.includes('Strategy') || title.includes('Project') || title.includes('Analyst') || name === 'Hussein Meqdad';
  const isHussein = name === 'Hussein Meqdad';
  
  // Determine department
  let department = 'WPS & DBO';
  if (isITDeveloper) department = 'Information Technology';
  if (isStrategy) department = 'Strategy & Projects';
  
  body.innerHTML = `
    ${photo ? 
      `<img src="${photo}" class="detail-photo" alt="${name}" style="${isDeveloper ? 'border: 3px solid #3b82f6;' : (isHussein ? 'border: 3px solid #f59e0b;' : '')}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
       <div class="emp-initials" style="width:120px;height:120px;font-size:36px;margin:0 auto 16px;display:none;${isHussein ? 'background: linear-gradient(135deg, #f59e0b, #d97706);' : ''}">${getInitials(name)}</div>` :
      `<div class="emp-initials" style="width:120px;height:120px;font-size:36px;margin:0 auto 16px;${isHussein ? 'background: linear-gradient(135deg, #f59e0b, #d97706);' : ''}">${getInitials(name)}</div>`
    }
    ${isDeveloper ? `<div style="text-align:center;margin-bottom:8px;"><span style="padding:6px 16px;background:linear-gradient(135deg, #3b82f6, #2563eb);border-radius:20px;font-size:11px;color:white;font-weight:600;">⚡ EDD SYSTEM DEVELOPER</span></div>` : ''}
    ${isHussein ? `<div style="text-align:center;margin-bottom:8px;"><span style="padding:6px 16px;background:linear-gradient(135deg, #f59e0b, #d97706);border-radius:20px;font-size:11px;color:white;font-weight:600;">⭐ STRATEGY TEAM</span></div>` : ''}
    <div class="detail-name" ${isHussein ? 'style="color: #f59e0b;"' : ''}>${name}</div>
    ${nameAr ? `<div style="text-align:center;font-size:16px;color:#9E9E9E;margin-bottom:4px;direction:rtl;">${nameAr}</div>` : ''}
    <div class="detail-title">${title}</div>
    ${subtitle ? `<div style="text-align:center;font-size:13px;color:var(--accent);margin-top:4px;">${subtitle}</div>` : ''}
    
    <div class="detail-section">
      <h4>Employee Information</h4>
      <div class="detail-row">
        <span class="detail-label">Department</span>
        <span class="detail-value">${department}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Reports To</span>
        <span class="detail-value">${isStrategy ? 'Dinos - GM Strategy' : (isITDeveloper ? 'Khurram - Head of IT' : 'Mohanad - Dept Manager')}</span>
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
    
    ${isDeveloper ? `
    <div class="detail-section">
      <h4>🚀 Key Projects</h4>
      <div class="detail-row">
        <span class="detail-label">Primary Project</span>
        <span class="detail-value" style="color: var(--accent);">EDD Case Management System</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Technologies</span>
        <span class="detail-value">JavaScript, HTML5, CSS3, Chart.js</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Responsibilities</span>
        <span class="detail-value">Full-Stack Development, UI/UX Design</span>
      </div>
    </div>
    ` : `
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
    `}
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
