# 🎯 ORGANIZATION STRUCTURE - JAVASCRIPT ENHANCEMENTS

**System**: QIB Organization Visualization  
**Version**: 2.0  
**Purpose**: Interactive features, team expansion, search, and detail panels  

---

## OVERVIEW

This guide documents the JavaScript functionality that powers the interactive organization structure features including team expansion, search, detail panels, and animations.

---

# SECTION 1: CORE FUNCTIONS

## 1.1 Team Expansion Function

```javascript
function toggleTeam(teamId) {
  const teamExpand = document.getElementById(`team-${teamId}`);
  
  if (teamExpand) {
    teamExpand.classList.toggle('active');
    
    // Smooth scroll into view
    if (teamExpand.classList.contains('active')) {
      setTimeout(() => {
        teamExpand.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }, 200);
    }
  }
}
```

### Usage:
```html
<button onclick="toggleTeam('operations')">👥 View Team</button>
<div class="team-expand" id="team-operations">
  <!-- Team members load here -->
</div>
```

### Teams Available:
- `toggleTeam('ops')` - Operations team
- `toggleTeam('personal')` - Personal Banking team
- `toggleTeam('strategy')` - Strategy & Digital team
- `toggleTeam('hcg')` - Human Capital Group
- `toggleTeam('sayed')` - Sayed ElMahdy reports
- `toggleTeam('wps')` - WPS & Digital Back Office
- `toggleTeam('it')` - IT Department

---

## 1.2 Section Toggle Function

```javascript
function toggleSection(sectionId) {
  const section = document.getElementById(`section-${sectionId}`);
  const toggle = document.getElementById(`toggle-${sectionId}`);
  const content = document.getElementById(`content-${sectionId}`);
  
  if (!section) return;
  
  const isVisible = content.style.display !== 'none';
  
  content.style.display = isVisible ? 'none' : 'block';
  toggle.classList.toggle('collapsed');
  
  // Set global focus
  if (!isVisible) {
    currentFocusedSection = sectionId;
  }
}
```

### Sections:
- `toggleSection('board')` - Board of Directors
- `toggleSection('executive')` - Executive Management
- `toggleSection('personal')` - Personal Banking
- `toggleSection('branch')` - Branch & Sales
- `toggleSection('operations')` - Operations Division
- `toggleSection('strategy')` - Strategy & Digital

---

## 1.3 Section Focus Function

```javascript
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.hierarchy-section').forEach(section => {
    section.style.display = 'none';
  });
  
  // Show only selected section
  const selectedSection = document.getElementById(`section-${sectionId}`);
  if (selectedSection) {
    selectedSection.style.display = 'block';
    currentFocusedSection = sectionId;
    
    // Scroll to section
    setTimeout(() => {
      selectedSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
  
  // Show back button & breadcrumb
  updateBreadcrumb(sectionId);
}
```

### Feature: Mobile-Friendly Single Section View
- Isolates one department for focused viewing
- Reduces cognitive load
- Better for mobile displays

---

## 1.4 Show All Sections Function

```javascript
function showAllSections() {
  // Show all hierarchy sections
  document.querySelectorAll('.hierarchy-section').forEach(section => {
    section.style.display = 'block';
  });
  
  // Reset focus & breadcrumb
  currentFocusedSection = null;
  updateBreadcrumb(null);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

### Trigger:
- ESC key
- "← Back to All" button in breadcrumb
- User clicks background

---

# SECTION 2: DETAIL PANEL SYSTEM

## 2.1 Show Detail Panel

```javascript
function showDetail(employeeId) {
  // Employee data map
  const employeeData = {
    'BOD-001': {
      name: 'Sheikh Jassim bin Hamad bin Jassim bin Jaber Al Thani',
      title: 'Chairman of the Board',
      department: 'Board of Directors',
      email: 'chairman@qib.com.qa',
      phone: '+974 4402 3100 ext. 0001',
      office: 'Executive Floor, HQ - Doha',
      directReports: 1,
      supervisor: 'N/A',
      bio: 'Chairman provides strategic vision and governance oversight to the bank...'
    },
    'EXE-001': {
      name: 'Mr. Bassel Gamal',
      title: 'Group Chief Executive Officer',
      department: 'Executive Management',
      email: 'bassel.gamal@qib.com.qa',
      phone: '+974 4402 3100 ext. 1001',
      office: 'GCEO Office, Executive Floor',
      directReports: 7,
      supervisor: 'Chairman (Board)',
      bio: 'GCEO drives overall strategy, performance, and culture...'
    },
    'OPS-001': {
      name: 'Mr. Amit Malhotra',
      title: 'Head of Operations',
      department: 'Operations Division',
      email: 'amit.malhotra@qib.com.qa',
      phone: '+974 4402 3100 ext. 2010',
      office: 'Operations Center, HQ',
      directReports: 2,
      supervisor: 'Chief Operating Officer (COO)',
      bio: 'Amit leads all operational processes and teams...'
    }
    // ... more employees
  };
  
  const employee = employeeData[employeeId];
  
  if (!employee) {
    console.warn(`Employee ${employeeId} not found`);
    return;
  }
  
  // Show overlay
  const overlay = document.getElementById('detail-overlay');
  overlay.style.display = 'block';
  
  // Populate panel
  const detailBody = document.getElementById('detail-body');
  detailBody.innerHTML = `
    <div class="detail-content">
      <div class="detail-photo" style="background-image: url('assets/employees/${employee.id}.jpeg')"></div>
      <div class="detail-info">
        <h3>${employee.name}</h3>
        <p class="title">${employee.title}</p>
        <p class="dept">${employee.department}</p>
        <div class="contact">
          <p><strong>Email:</strong> ${employee.email}</p>
          <p><strong>Phone:</strong> ${employee.phone}</p>
          <p><strong>Office:</strong> ${employee.office}</p>
        </div>
        <div class="reporting">
          <p><strong>Direct Reports:</strong> ${employee.directReports}</p>
          <p><strong>Supervisor:</strong> ${employee.supervisor}</p>
        </div>
        <div class="bio">
          <p>${employee.bio}</p>
        </div>
      </div>
    </div>
  `;
  
  // Animate appearance
  document.querySelector('.detail-panel').classList.add('active');
}
```

### Data Structure:

Each employee ID maps to an object:

```javascript
{
  name: "Full Name",
  title: "Job Title",
  department: "Department",
  email: "email@qib.com.qa",
  phone: "+974 XXXX",
  office: "Location",
  directReports: N,
  supervisor: "Boss Name",
  bio: "Professional biography"
}
```

---

## 2.2 Close Detail Panel

```javascript
function closeDetail() {
  const overlay = document.getElementById('detail-overlay');
  const panel = document.querySelector('.detail-panel');
  
  overlay.style.display = 'none';
  panel.classList.remove('active');
  
  // Clear timeout if exists
  if (window.detailTimeout) {
    clearTimeout(window.detailTimeout);
  }
}
```

### Trigger:
- Click X button
- Click overlay background
- ESC key (if enabled)

---

# SECTION 3: SEARCH FUNCTIONALITY

## 3.1 Search Handler

```javascript
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  const employeeCards = document.querySelectorAll('[data-searchable]');
  
  let matchCount = 0;
  
  employeeCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    const matches = text.includes(searchTerm);
    
    card.style.display = matches ? 'block' : 'none';
    
    if (matches && searchTerm) {
      matchCount++;
      // Highlight animation
      card.classList.add('search-highlight');
    } else {
      card.classList.remove('search-highlight');
    }
  });
  
  // Show no results message
  showSearchStatus(matchCount, searchTerm);
}

// Initialize search
document.getElementById('org-search')?.addEventListener('input', handleSearch);
```

### HTML Data Attribute:

```html
<div class="team-member" data-searchable="true">
  <h5>John Smith</h5>
  <p>Manager - Operations</p>
  <!-- Searchable by: "John", "Smith", "Manager", "Operations" -->
</div>
```

### Search Examples:

| Query | Results |
|-------|---------|
| "Bassel" | GCEO |
| "Operations" | All Operations staff |
| "Khurram" | CIO |
| "Ahmed" | All employees named Ahmed |
| "Manager" | All managers |
| "Doha" | All HQ-based staff |

---

## 3.2 Search Highlight CSS

```css
.search-highlight {
  animation: searchPulse 0.6s ease-out;
}

@keyframes searchPulse {
  0% {
    background-color: rgba(34, 197, 94, 0.3);
    transform: scale(1.02);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
  }
}
```

---

## 3.3 Search Status Display

```javascript
function showSearchStatus(count, term) {
  const status = document.getElementById('search-status');
  
  if (!term) {
    status.textContent = '';
    return;
  }
  
  if (count === 0) {
    status.textContent = `❌ No employees found for "${term}"`;
    status.style.color = '#EF4444';
  } else {
    status.textContent = `✅ Found ${count} match${count !== 1 ? 'es' : ''} for "${term}"`;
    status.style.color = '#22C55E';
  }
}
```

---

# SECTION 4: KEYBOARD NAVIGATION

## 4.1 Keyboard Event Handler

```javascript
document.addEventListener('keydown', (e) => {
  // ESC - Go back to all sections
  if (e.key === 'Escape' && currentFocusedSection) {
    showAllSections();
  }
  
  // ESC - Close detail panel
  if (e.key === 'Escape') {
    closeDetail();
  }
  
  // CTRL/CMD + F - Focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
    e.preventDefault();
    document.getElementById('org-search')?.focus();
  }
  
  // Tab - Navigate through cards
  if (e.key === 'Tab') {
    // Native browser handling
  }
  
  // Enter - Open detail panel for focused card
  if (e.key === 'Enter') {
    const focused = document.activeElement;
    if (focused?.onclick) {
      focused.onclick();
    }
  }
});
```

### Keyboard Shortcuts:

| Key | Action |
|-----|--------|
| ESC | Go back / Close panel |
| CTRL+F | Focus search box |
| TAB | Navigate cards |
| ENTER | Open detail panel |
| CLICK | Show detail panel |

---

# SECTION 5: SESSION & AUTHENTICATION

## 5.1 Session Check

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // Check if user has valid session
  const sessionData = sessionStorage.getItem('edd_session');
  
  if (!sessionData) {
    window.location.replace('login.html');
    return;
  }
  
  try {
    const session = JSON.parse(sessionData);
    
    // Validate session structure
    if (!session.authenticated || !session.user) {
      window.location.replace('login.html');
      return;
    }
    
    // Load user info
    const currentUser = session.user;
    document.getElementById('user-name').textContent = 
      currentUser.name || 'User';
    document.getElementById('user-role').textContent = 
      currentUser.role || 'Staff';
    document.getElementById('user-avatar').textContent = 
      getInitials(currentUser.name);
      
  } catch (e) {
    console.error('Session parse error:', e);
    window.location.replace('login.html');
  }
});
```

### Session Storage Format:

```javascript
{
  authenticated: true,
  user: {
    id: "EMP-00123",
    name: "Ahmed Al-Kubaisi",
    email: "ahmed.alkubaisi@qib.com.qa",
    role: "Business Analyst",
    department: "Operations",
    avatar: "AK"
  },
  loginTime: "2026-03-09T10:00:00Z",
  expiresAt: "2026-03-09T18:00:00Z"
}
```

---

## 5.2 Logout Handler

```javascript
function logoutUser() {
  // Clear session data
  sessionStorage.removeItem('edd_session');
  sessionStorage.removeItem('edd_user');
  sessionStorage.removeItem('edd_preferences');
  
  // Clear any timers
  if (window.inactivityTimer) {
    clearTimeout(window.inactivityTimer);
  }
  
  // Redirect to login
  window.location.replace('login.html');
}

// Hook logout button
document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
```

---

# SECTION 6: HELPER UTILITIES

## 6.1 Get Initials

```javascript
function getInitials(name) {
  if (!name) return '??';
  
  // Remove titles (Mr., Mrs., Ms., Dr., etc.)
  const cleanName = name.replace(/Mr\.|Mrs\.|Ms\.|Dr\./gi, '').trim();
  
  // Split by spaces
  const parts = cleanName.split(' ');
  
  if (parts.length >= 2) {
    // First letter of first name + first letter of last name
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length > 0) {
    // Just one name - use first two letters
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return '??';
}
```

### Examples:

```javascript
getInitials("Mr. Ahmed Al-Kubaisi") → "AK"
getInitials("Bassel Gamal") → "BG"
getInitials("Khurram Qadir") → "KQ"
getInitials("Khaja") → "KH"
getInitials("") → "??"
```

---

## 6.2 Show Team Detail

```javascript
function showTeamDetail(name, title, photoUrl, arabicName) {
  // Open detail panel with quick info
  const detailBody = document.getElementById('detail-body');
  
  detailBody.innerHTML = `
    <div class="detail-content">
      <div class="detail-photo" style="background-image: url('${photoUrl}')"></div>
      <div class="detail-info">
        <h3>${name}</h3>
        ${arabicName ? `<p class="arabic">${arabicName}</p>` : ''}
        <p class="title">${title}</p>
      </div>
    </div>
  `;
  
  // Show panel
  document.getElementById('detail-overlay').style.display = 'block';
  document.querySelector('.detail-panel').classList.add('active');
}
```

---

## 6.3 Breadcrumb Navigation

```javascript
function updateBreadcrumb(sectionId) {
  const breadcrumb = document.getElementById('breadcrumb');
  
  if (!sectionId) {
    breadcrumb.innerHTML = '🏢 All Departments';
    return;
  }
  
  const sectionNames = {
    'board': '👑 Board of Directors',
    'executive': '👔 Executive Management',
    'personal': '💼 Personal Banking',
    'branch': '🏪 Branch & Sales',
    'operations': '⚙️ Operations Division'
  };
  
  breadcrumb.innerHTML = `
    <span onclick="showAllSections()" style="cursor: pointer;">← Back to All</span>
    <span class="separator">></span>
    <span>${sectionNames[sectionId] || sectionId}</span>
  `;
}
```

---

# SECTION 7: PERFORMANCE OPTIMIZATION

## 7.1 Lazy Loading Teams

```javascript
function lazyLoadTeamMembers(teamId) {
  const teamContainer = document.getElementById(`team-${teamId}`);
  
  if (!teamContainer.dataset.loaded) {
    // Load team data asynchronously
    fetch(`/api/v1/organization/teams/${teamId}`)
      .then(r => r.json())
      .then(team => {
        // Render team members
        teamContainer.innerHTML = renderTeamGrid(team.members);
        teamContainer.dataset.loaded = 'true';
      })
      .catch(e => console.error('Team load error:', e));
  }
}
```

---

## 7.2 Debounce Search

```javascript
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Apply debounce to search
const debouncedSearch = debounce(handleSearch, 300);
document.getElementById('org-search')?.addEventListener('input', debouncedSearch);
```

### Benefit: Reduces DOM updates when typing quickly

---

# SECTION 8: TESTING

## 8.1 Unit Test Examples

```javascript
// Test: Get Initials
console.assert(
  getInitials("Ahmed Mohammed") === "AM",
  "getInitials should return AM for Ahmed Mohammed"
);

// Test: Toggle Team
toggleTeam('operations');
console.assert(
  document.getElementById('team-operations').classList.contains('active'),
  "Team should be marked as active after toggle"
);

// Test: Close Detail
closeDetail();
console.assert(
  document.getElementById('detail-overlay').style.display === 'none',
  "Overlay should be hidden after closeDetail"
);
```

---

## 8.2 Manual Testing Checklist

- [ ] Load page - session check works
- [ ] Search - finds employee by name
- [ ] Click card - detail panel opens
- [ ] Close panel - overlay disappears
- [ ] Toggle team - members expand/collapse
- [ ] Toggle section - department shows/hides
- [ ] ESC key - goes back/closes panel
- [ ] Mobile - responsive layout
- [ ] No photos - fallback initials show
- [ ] Logout - clears session, redirects

---

# SECTION 9: ERROR HANDLING

## 9.1 Try-Catch Pattern

```javascript
try {
  const session = JSON.parse(sessionData);
  if (!session.authenticated) {
    throw new Error('Session not authenticated');
  }
  loadUserInfo(session.user);
} catch (error) {
  console.error('Session error:', error);
  window.location.replace('login.html');
}
```

---

## 9.2 Null Safety

```javascript
function toggleTeam(teamId) {
  const teamExpand = document.getElementById(`team-${teamId}`);
  
  // Check if element exists before using
  if (!teamExpand) {
    console.warn(`Team element ${teamId} not found`);
    return;
  }
  
  teamExpand.classList.toggle('active');
}
```

---

# SECTION 10: INTEGRATION WITH OTHER SYSTEMS

## 10.1 EDD Case Management Integration

```javascript
// When opening a case, auto-focus employee
function openCaseEmployee(employeeId) {
  // Show the employee detail
  showDetail(employeeId);
  
  // Highlight in org structure
  const card = document.querySelector(`[data-employee-id="${employeeId}"]`);
  if (card) {
    card.classList.add('highlighted');
    card.scrollIntoView({ behavior: 'smooth' });
  }
}
```

---

## 10.2 Update Employee from External System

```javascript
async function syncEmployeeData() {
  try {
    const response = await fetch('/api/v1/employees/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      location.reload(); // Refresh org structure
    } else {
      console.error('Sync failed');
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}
```

---

**Document Version**: 2.0  
**Last Updated**: March 9, 2026  
**Status**: Production Ready  

---

This JavaScript guide enables a fully interactive, responsive, and user-friendly organization structure visualization system.
