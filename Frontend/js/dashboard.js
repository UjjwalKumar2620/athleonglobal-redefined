// ═══════════════════════════════════════════
// ATHLEON GLOBAL — DASHBOARD JS
// ═══════════════════════════════════════════

(function () {
  'use strict';

  // ─── Load user from localStorage ───
  const user = JSON.parse(localStorage.getItem('athleon_user') || '{"name":"Athlete","email":""}');
  const name = user.name || 'Athlete';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // Populate name everywhere
  const welcomeName = document.getElementById('welcome-name');
  const sidebarUsername = document.getElementById('sidebar-username');
  const sidebarAvatar = document.getElementById('sidebar-avatar');
  const topbarAvatar = document.getElementById('topbar-avatar');
  const profileAvatarLg = document.getElementById('profile-avatar-lg');
  const profileNameLg = document.getElementById('profile-name-lg');
  const pfName = document.getElementById('pf-name');
  const pfEmail = document.getElementById('pf-email');

  if (welcomeName) welcomeName.textContent = name.split(' ')[0];
  if (sidebarUsername) sidebarUsername.textContent = name;
  if (sidebarAvatar) sidebarAvatar.textContent = initials;
  if (topbarAvatar) topbarAvatar.textContent = initials;
  if (profileAvatarLg) profileAvatarLg.textContent = initials;
  if (profileNameLg) profileNameLg.textContent = name;
  if (pfName) pfName.value = name;
  if (pfEmail) pfEmail.value = user.email || '';

  // ─── Configuration ───
  // Set this to your Vercel URL when deploying (e.g., https://your-project.vercel.app)
  const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:3001' 
    : ''; // Let the user fill this or use a default if known

  // 📝 Helper for relative/absolute API calls
  const getApiUrl = (path) => path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  // ─── Page Navigation ───
  const navItems = document.querySelectorAll('.nav-item');
  const pageViews = document.querySelectorAll('.page-view');

  function showPage(pageId) {
    pageViews.forEach(v => v.classList.remove('active'));
    navItems.forEach(n => n.classList.remove('active'));

    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) targetPage.classList.add('active');

    const targetNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (targetNav) targetNav.classList.add('active');

    // Close mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      if (page) showPage(page);
    });
  });

  // ─── Quick Actions → navigate to pages ───
  const qaMap = {
    'qa-upload-video': 'videos',
    'qa-ai-analysis': 'analytics',
    'lib-upload-btn': 'videos', // New button on Video page
  };

  Object.entries(qaMap).forEach(([btnId, page]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        if (btnId === 'qa-upload-video' || btnId === 'lib-upload-btn') {
          // Both can trigger a common upload page or modal
          showPage('videos');
        } else {
          showPage(page);
        }
      });
    }
  });

  // ─── Video Page specific logic ───
  const libUploadBtn = document.getElementById('lib-upload-btn');
  if (libUploadBtn) {
    libUploadBtn.addEventListener('click', () => {
      // Optional: Open modal directly or just show the upload zone
      const uploadZone = document.getElementById('upload-zone');
      if (uploadZone) uploadZone.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ─── Sidebar Toggle Logic ───
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // ─── Theme Toggle Logic ───
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
      themeToggle.textContent = isLight ? '🌙' : '☀️';
    });
  }

  // ─── Upload Zone ───
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('browse-btn');

  if (browseBtn) browseBtn.addEventListener('click', () => fileInput && fileInput.click());

  if (uploadZone) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleFileUpload(fileInput.files[0]);
    });
  }

  function handleFileUpload(file) {
    const zone = document.getElementById('upload-zone');
    if (zone) {
      zone.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
        <p class="upload-title" style="color:var(--green)">File selected: ${file.name}</p>
        <p class="upload-sub">${(file.size / 1024 / 1024).toFixed(2)} MB</p>
      `;
    }
  }

  // ─── Content Tabs (My Content) ───
  const ctabs = document.querySelectorAll('.ctab');
  ctabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ctabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // ─── Mock Data for Performance ───
  const mockVideos = [
    { id: 1, title: 'Sprint Drill Final', date: '2 hours ago', views: '420', thumb: 'linear-gradient(135deg, #1a1a2e, #7c3aed)' },
    { id: 2, title: 'Left Foot Precision', date: '1 day ago', views: '1.2k', thumb: 'linear-gradient(135deg, #1a2e1a, #10b981)' },
    { id: 3, title: 'Vertical Jump Test', date: '3 days ago', views: '850', thumb: 'linear-gradient(135deg, #2e1a1a, #ef4444)' },
    { id: 4, title: 'Agility Ladder #3', date: '5 days ago', views: '310', thumb: 'linear-gradient(135deg, #1a1a1a, #f59e0b)' }
  ];

  const mockAchievements = [
    { id: 1, name: 'Season MVP', date: 'Oct 2025', icon: '🏆' },
    { id: 2, name: 'Top Scorer', date: 'Aug 2025', icon: '⚽' },
    { id: 3, name: 'Speed Demon', date: 'July 2025', icon: '⚡' },
    { id: 4, name: 'Iron Lungs', date: 'June 2025', icon: '🫁' }
  ];

  function renderRecentVideos() {
    const container = document.getElementById('recent-videos-list');
    const fullGrid = document.getElementById('videos-grid-full');

    if (container) {
      container.innerHTML = '';
      mockVideos.slice(0, 4).forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card-mini';
        card.innerHTML = `
          <div class="video-thumb-mini" style="background: ${v.thumb}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
          <div class="video-info-mini">
            <div class="video-title-mini">${v.title}</div>
            <div style="font-size: 0.65rem; color: var(--text-muted); margin-top:2px;">${v.date} • ${v.views} views</div>
          </div>
        `;
        card.addEventListener('click', () => {
          showToast('Loading AI analysis for this video...');
          showPage('analytics');
        });
        container.appendChild(card);
      });
    }

    if (fullGrid) {
      fullGrid.innerHTML = '';
      mockVideos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'card video-card-full';
        card.style.cssText = 'padding:0; overflow:hidden; border:1px solid var(--border); transition:all 0.3s; cursor:pointer;';
        card.innerHTML = `
          <div style="width:100%; aspect-ratio:16/9; background:${v.thumb}; display:flex; align-items:center; justify-content:center; color:#fff;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));"><polygon points="10 8 16 12 10 16 10 8"/></svg>
          </div>
          <div style="padding:1rem;">
            <h3 style="font-size:1rem; font-weight:700; color:#fff; margin-bottom:0.4rem;">${v.title}</h3>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:0.75rem; color:var(--text-muted);">${v.date}</span>
              <span style="font-size:0.75rem; color:var(--accent); font-weight:700;">${v.views} Views</span>
            </div>
          </div>
        `;
        card.onmouseover = () => { card.style.borderColor = 'var(--accent)'; card.style.transform = 'translateY(-4px)'; };
        card.onmouseout = () => { card.style.borderColor = 'var(--border)'; card.style.transform = 'translateY(0)'; };
        card.addEventListener('click', () => showPage('analytics'));
        fullGrid.appendChild(card);
      });
    }
  }

  function initAICredits() {
    const creditsEl = document.getElementById('ai-credits-value');
    if (creditsEl) {
      creditsEl.textContent = '120'; // Mock initialization
    }
  }

  function renderAchievements() {
    const dashList = document.getElementById('dashboard-achievements-list');
    const fullGrid = document.getElementById('achievements-grid');

    if (dashList) {
      dashList.innerHTML = '';
      mockAchievements.forEach(a => {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.style.cssText = 'display:flex; align-items:center; gap:1rem; padding:0.75rem 0; border-bottom:1px solid rgba(255,255,255,0.05);';
        item.innerHTML = `
          <span style="font-size:1.5rem">${a.icon}</span>
          <div style="flex:1">
            <div style="font-weight:700; font-size:0.9rem; color:#fff;">${a.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${a.date}</div>
          </div>
        `;
        dashList.appendChild(item);
      });
    }

    if (fullGrid) {
      fullGrid.innerHTML = '';
      mockAchievements.forEach(a => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cssText = 'text-align:center; padding:2rem; border:1px solid var(--border);';
        card.innerHTML = `
          <div style="font-size:3rem; margin-bottom:1rem;">${a.icon}</div>
          <h3 style="font-size:1.1rem; font-weight:800; color:#fff; margin-bottom:0.5rem;">${a.name}</h3>
          <div style="font-size:0.8rem; color:var(--text-muted);">${a.date}</div>
        `;
        fullGrid.appendChild(card);
      });
    }
  }

  // Initial render
  initAICredits();
  renderRecentVideos();
  renderAchievements();

  // ─── Create Post Form (Removed) ───
  // (Logic removed to match request)

  // ─── AI Chatbot Logic ───
  let chatSessionId = 'session_' + Date.now();
  let chatHistory = JSON.parse(localStorage.getItem('athleon_chat_history')) || [];
  
  const chatHistoryList = document.getElementById('chat-history-list');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const newChatBtn = document.getElementById('new-chat-btn');

  function renderChatHistorySidebar() {
    if (!chatHistoryList) return;
    chatHistoryList.innerHTML = '';
    // Group by session or just show recent
    const sessions = {};
    chatHistory.forEach(msg => {
      if (!sessions[msg.sessionId]) sessions[msg.sessionId] = [];
      sessions[msg.sessionId].push(msg);
    });

    Object.keys(sessions).reverse().slice(0, 5).forEach(sid => {
      const firstUserMsg = sessions[sid].find(m => m.role === 'user');
      const title = firstUserMsg ? firstUserMsg.content.substring(0, 25) + '...' : 'Chat Session';
      
      const item = document.createElement('div');
      item.className = 'msg-item';
      item.innerHTML = `
        <div class="msg-avatar" style="background:#7c3aed; width: 30px; height: 30px; font-size: 0.7rem;">💬</div>
        <div class="msg-info">
          <div class="msg-name" style="font-size: 0.85rem;">${title}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        chatSessionId = sid;
        loadChatSession(sid);
      });
      chatHistoryList.appendChild(item);
    });
  }

  function loadChatSession(sid) {
    if (!chatBody) return;
    chatBody.innerHTML = '';
    const sessionMsgs = chatHistory.filter(m => m.sessionId === sid);
    if (sessionMsgs.length === 0) {
      appendChatMessage('Hello! I am AthleonAI. How can I help you improve your game today?', 'received');
      return;
    }
    sessionMsgs.forEach(msg => {
      appendChatMessage(msg.content, msg.role === 'user' ? 'sent' : 'received', false);
    });
    chatBody.scrollTo(0, chatBody.scrollHeight);
  }

  function appendChatMessage(text, type, animate = true) {
    if (!chatBody) return;
    const div = document.createElement('div');
    div.className = `chat-bubble ${type}`;
    div.innerHTML = text.replace(/\\n/g, '<br>');
    chatBody.appendChild(div);
    if (animate) {
      div.style.opacity = '0';
      div.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        div.style.transition = 'all 0.3s ease';
        div.style.opacity = '1';
        div.style.transform = 'translateY(0)';
      });
    }
    chatBody.scrollTo(0, chatBody.scrollHeight);
  }

  async function sendChatMessage() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    console.log('📩 AthleonAI: Sending message:', text);
    chatInput.value = '';
    appendChatMessage(text, 'sent');
    
    const userMsg = { role: 'user', content: text, sessionId: chatSessionId, timestamp: Date.now() };
    chatHistory.push(userMsg);
    
    // Show typing...
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-bubble received typing';
    typingDiv.innerHTML = '<i>Typing...</i>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTo(0, chatBody.scrollHeight);

    try {
      // Build context for API
      const sessionMsgs = chatHistory.filter(m => m.sessionId === chatSessionId).map(m => ({
        role: m.role, content: m.content
      }));

      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: sessionMsgs, sessionId: chatSessionId })
      });

      typingDiv.remove();

      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      
      const botMsg = { role: 'assistant', content: data.reply, sessionId: chatSessionId, timestamp: Date.now() };
      chatHistory.push(botMsg);
      appendChatMessage(data.reply, 'received');
      
      localStorage.setItem('athleon_chat_history', JSON.stringify(chatHistory));
      renderChatHistorySidebar();

    } catch (err) {
      typingDiv.remove();
      appendChatMessage('⚠️ Server error connecting to AI. Make sure the backend is running on port 3001.', 'received');
    }
  }

  // ─── AI Chat Registration ───
  if (chatSendBtn) {
    console.log('💎 AthleonAI: Send button found, attaching listener');
    chatSendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sendChatMessage();
    });
  } else {
    console.error('❌ AthleonAI: Send button NOT found');
  }

  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      chatSessionId = 'session_' + Date.now();
      loadChatSession(chatSessionId);
      renderChatHistorySidebar();
    });
  }

  // Init chat UI
  loadChatSession(chatSessionId);
  renderChatHistorySidebar();


  // ─── Performance Monitoring ───
  // (Module refactored for AI Video Analysis and Personal Achievements)



  // ─── Profile Form & Elements ───
  
  // Custom multi-select logic
  const pfSportsSelect = document.getElementById('pf-sports-select');
  const pfSportsChosen = document.getElementById('pf-sports-chosen');
  
  if (pfSportsSelect) {
    // Show saved sports
    if (user.sports && Array.isArray(user.sports)) {
      Array.from(pfSportsSelect.options).forEach(opt => {
        if (user.sports.includes(opt.value)) opt.selected = true;
      });
      pfSportsChosen.textContent = user.sports.join(', ') || 'None';
    } else if (user.sport) {
      pfSportsChosen.textContent = user.sport;
    }

    pfSportsSelect.addEventListener('change', (e) => {
      let selected = Array.from(pfSportsSelect.selectedOptions).map(o => o.value);
      if (selected.length > 5) {
        showToast('Maximum 5 sports allowed.');
        // Unselect last item
        const lastValue = e.target.value;
        const lastOpt = Array.from(pfSportsSelect.options).find(o => o.value === lastValue);
        if (lastOpt) lastOpt.selected = false;
        selected = Array.from(pfSportsSelect.selectedOptions).map(o => o.value);
      }
      pfSportsChosen.textContent = selected.length ? selected.join(' · ') : 'None selected';
    });
  }

  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('pf-name').value || name;
      user.name = newName;
      user.email = document.getElementById('pf-email').value || user.email;
      user.bio = document.getElementById('pf-bio').value || "";
      
      let selectedSports = [];
      if (pfSportsSelect) {
        selectedSports = Array.from(pfSportsSelect.selectedOptions).map(o => o.value);
        user.sports = selectedSports;
      }
      
      localStorage.setItem('athleon_user', JSON.stringify(user));
      
      // Update UI elements across dashboard
      const newInitials = newName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      if (sidebarUsername) sidebarUsername.textContent = newName;
      if (sidebarAvatar) sidebarAvatar.textContent = newInitials;
      if (topbarAvatar) topbarAvatar.textContent = newInitials;
      if (profileAvatarLg) profileAvatarLg.textContent = newInitials;
      if (profileNameLg) profileNameLg.textContent = newName;
      if (welcomeName) welcomeName.textContent = newName.split(' ')[0];
      
      if (document.getElementById('profile-roles-lg')) {
        document.getElementById('profile-roles-lg').textContent = selectedSports.join(' · ') || 'Athlete';
      }

      showToast('Profile saved to local storage!');
    });
  }

  // Photo Upload
  const uploadPhotoInput = document.getElementById('upload-photo-input');
  if (uploadPhotoInput) {
    uploadPhotoInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        showToast('Uploading photo...');
        // Fake the upload visual instantly for UX
        const objUrl = URL.createObjectURL(file);
        if (profileAvatarLg) {
          profileAvatarLg.style.backgroundImage = `url(${objUrl})`;
          profileAvatarLg.textContent = '';
        }
      }
    });
  }

  // Certifications Add
  const uploadCertInput = document.getElementById('upload-cert-input');
  const certList = document.getElementById('cert-list');
  if (uploadCertInput && certList) {
    uploadCertInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const certItem = document.createElement('div');
        certItem.style.cssText = 'background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:6px; display:flex; align-items:center; gap:0.5rem;';
        certItem.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div style="flex:1; font-size:0.9rem">${file.name}</div>
          <span style="font-size:0.75rem; color:var(--color-primary)">Uploaded</span>
        `;
        certList.appendChild(certItem);
        showToast('Certification added!');
      }
    });
  }

  // Achievements Add
  const addAchBtn = document.getElementById('add-ach-btn');
  const achTitleInput = document.getElementById('ach-title');
  const achList = document.getElementById('ach-list');
  if (addAchBtn && achList && achTitleInput) {
    addAchBtn.addEventListener('click', () => {
      const title = achTitleInput.value.trim();
      if (!title) return;
      const achItem = document.createElement('div');
      achItem.style.cssText = 'background:rgba(255,255,255,0.05); padding:0.75rem; border-radius:6px; display:flex; align-items:center; gap:0.5rem; border-left:3px solid var(--color-accent)';
      achItem.innerHTML = `
        <span style="font-size:1.2rem">🏆</span>
        <div style="flex:1; font-weight:600; font-size:0.9rem">${title}</div>
      `;
      achList.appendChild(achItem);
      achTitleInput.value = '';
      showToast('Achievement recorded!');
    });
  }

  // ─── Notification, Search, Toast ───
  const notifBtn = document.getElementById('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('3 new notifications');
      const badge = notifBtn.querySelector('.notif-badge');
      if (badge) badge.style.display = 'none';
    });
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        showToast(`Searching for "${searchInput.value}"...`);
      }
    });
  }

  function showToast(message) {
    const existing = document.querySelector('.dash-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'dash-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position:fixed; bottom:1.5rem; right:1.5rem;
      background:#111117; color:#fff;
      padding:0.75rem 1.25rem; border-radius:10px;
      font-size:0.875rem; font-weight:500;
      box-shadow:0 8px 24px rgba(0,0,0,0.2);
      z-index:9999; opacity:0;
      transform:translateY(8px);
      transition:all 0.3s ease;
      border-left:3px solid #4f46e5;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ─── Video Upload handling to backend api ───
  const submitVideoBtn = document.querySelector('#page-upload-video .primary');
  if (submitVideoBtn) {
    submitVideoBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const videoFile = fileInput.files[0];
      if (!videoFile) {
        return showToast('Please select a video file first.');
      }
      
      showToast('Uploading video to Supabase via backend...');
      
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('userId', user.uid || 'user_123');

      try {
        // 1. Get Signed URL from Backend
        const fileName = `${user.uid || 'anon'}/${Date.now()}_${videoFile.name.replace(/\s/g, '_')}`;
        
        const signedRes = await fetch(getApiUrl('/api/upload/signed-url'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName, bucketName: 'videos' })
        });
        
        if (!signedRes.ok) throw new Error('Could not get signed upload URL');
        const { signedUrl, path } = await signedRes.json();

        // 2. Upload directly to Supabase via Signed URL
        showToast('Uploading directly to storage...');
        const uploadRes = await fetch(signedUrl, {
          method: 'PUT', // Supabase signed URLs usually use PUT for raw uploads
          body: videoFile,
          headers: { 'Content-Type': videoFile.type }
        });

        if (!uploadRes.ok) throw new Error('Direct upload failed');

        showToast('Upload successful! Path: ' + path);
        
        // Remove file from input
        fileInput.value = '';
        const zone = document.getElementById('upload-zone');
        if (zone) {
          zone.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(77,166,255,0.5)" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <p class="upload-title">Drag & drop your video here</p>
            <p class="upload-sub">MP4, MOV up to 500MB (Direct to Storage)</p>
            <button class="dash-btn outlined" id="browse-btn">Browse Files</button>
          `;
          // Reattach listener
          document.getElementById('browse-btn').addEventListener('click', () => fileInput && fileInput.click());
        }

      } catch (err) {
        console.error(err);
        showToast('Storage error: ' + err.message);
      }
    });
  }

  // ─── Find Page Logic ───
  const findGrid = document.getElementById('find-grid');
  const findSearchInput = document.getElementById('find-search-input');
  
  const mockAthletes = [
    { id: 1, name: 'Marcus Sterling', username: '@msterling', sport: 'Basketball', role: 'Point Guard', skills: ['3pt Shooting', 'Playmaking'], img: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', certs: ['Pro Coach Level 1', 'D1 Verified'] },
    { id: 2, name: 'Sarah Jenkins', username: '@sarahj_fit', sport: 'Tennis', role: 'Singles', skills: ['Backhand', 'Agility'], img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', certs: [] },
    { id: 3, name: 'Alex Thompson', username: '@athompson99', sport: 'Football', role: 'Striker', skills: ['Finishing', 'Pace', 'Dribbling'], img: 'https://images.unsplash.com/photo-1511886929837-354d82b79232?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', certs: ['FIFA Certified'] },
    { id: 4, name: 'David Chen', username: '@dchen_hoops', sport: 'Basketball', role: 'Shooting Guard', skills: ['Defense', 'Catch & Shoot'], img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', certs: [] }
  ];

  function renderAthletes(athletes) {
    if (!findGrid) return;
    findGrid.innerHTML = '';
    
    if (athletes.length === 0) {
      findGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted); background: var(--surface); border-radius: var(--radius); border: 1px dashed var(--border);">No athletes found matching your search.</div>';
      return;
    }

    athletes.forEach(ath => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cssText = 'cursor:pointer; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease; position:relative; overflow:hidden; border:1px solid var(--border);';
      
      card.onmouseover = () => {
        card.style.transform = 'translateY(-6px)';
        card.style.boxShadow = '0 12px 30px rgba(167,139,250,0.15)';
        card.style.borderColor = 'var(--accent)';
      };
      card.onmouseout = () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow)';
        card.style.borderColor = 'var(--border)';
      };
      
      card.innerHTML = `
        <div style="position:absolute; top:0; left:0; width:100%; height:4px; background:linear-gradient(90deg, var(--accent), transparent);"></div>
        <div style="display:flex; align-items:center; gap:1.2rem; margin-bottom:1.5rem;">
          <div style="width:64px; height:64px; border-radius:16px; background:url('${ath.img}') center/cover; border:2px solid var(--accent); box-shadow: 0 4px 12px rgba(167,139,250,0.2);"></div>
          <div style="min-width:0;">
            <h3 style="font-size:1.15rem; font-weight:800; color:#fff; margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${ath.name}</h3>
            <div style="font-size:0.8rem; color:var(--accent); font-weight:600; text-transform:uppercase; letter-spacing:0.05em;">${ath.username}</div>
          </div>
        </div>
        
        <div style="margin-bottom:1.2rem;">
          <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; margin-bottom:0.5rem; font-weight:700;">Primary Sport</div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
             <span style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${ath.sport}</span>
             <span style="font-size:0.75rem; color:var(--text-muted)">• ${ath.role}</span>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
          ${ath.skills.map(s => `<span style="background:rgba(167,139,250,0.08); color:var(--accent); padding:4px 10px; border-radius:6px; font-size:0.75rem; font-weight:600; border: 1px solid rgba(167,139,250,0.1);">${s}</span>`).join('')}
        </div>
        
        ${ath.certs.length ? `
          <div style="display:flex; align-items:center; gap:0.4rem; color:var(--green); font-size:0.8rem; font-weight:600; margin-top:0.5rem; background:rgba(16, 185, 129, 0.05); padding:6px; border-radius:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            ${ath.certs.length} Verified Certifications
          </div>
        ` : ''}
      `;
      card.addEventListener('click', () => openProfileModal(ath));
      findGrid.appendChild(card);
    });
  }

  if (findGrid) {
    renderAthletes(mockAthletes);
    if(findSearchInput) {
      findSearchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = mockAthletes.filter(a => 
          a.name.toLowerCase().includes(term) || 
          a.username.toLowerCase().includes(term) ||
          a.sport.toLowerCase().includes(term) ||
          a.skills.some(s => s.toLowerCase().includes(term))
        );
        renderAthletes(filtered);
      });
    }
  }

  const profileOverlay = document.getElementById('player-profile-overlay');
  const overlayContent = document.getElementById('modal-profile-content');
  const closeOverlayBtn = document.getElementById('close-profile-overlay');

  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener('click', () => {
      profileOverlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  function openProfileModal(athlete) {
    if (!profileOverlay) return;
    overlayContent.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; text-align:center; margin-bottom:3rem; position:relative;">
        <div style="width:140px; height:140px; border-radius:32px; background:url('${athlete.img}') center/cover; border:4px solid var(--accent); margin-bottom:1.5rem; box-shadow: 0 10px 40px rgba(167,139,250,0.3); transform: rotate(-2deg);"></div>
        <h2 style="font-size:2.5rem; font-weight:900; margin-bottom:0.2rem; letter-spacing:-0.03em;">${athlete.name}</h2>
        <div style="color:var(--accent); font-weight:700; text-transform:uppercase; letter-spacing:0.1em; font-size:0.9rem; margin-bottom:1.5rem;">${athlete.username} • ${athlete.sport} Specialists</div>
        
        <div style="display:flex; gap:1rem; margin-bottom:2rem;">
           <button class="dash-btn primary" style="padding: 0.8rem 2.5rem; font-size:1rem;">Message Athlete</button>
           <button class="dash-btn outlined" style="padding: 0.8rem 2rem;">Follow</button>
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:3rem; margin-bottom:3rem;">
        <div>
          <h3 style="margin-bottom:1.5rem; font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:0.6rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Technical Arsenal
          </h3>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem;">
            ${athlete.skills.map(s => `
              <div style="background:rgba(255,255,255,0.03); padding:1rem; border-radius:12px; border:1px solid var(--border); display:flex; flex-direction:column; gap:0.4rem;">
                <span style="color:var(--accent); font-weight:800; font-size:0.8rem; text-transform:uppercase;">Stat High</span>
                <span style="font-weight:700; font-size:1rem; color:#fff;">${s}</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom:1.5rem; font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:0.6rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Accreditations
          </h3>
          ${athlete.certs.length ? `
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              ${athlete.certs.map(c => `
                <div style="background:rgba(16, 185, 129, 0.05); padding:1rem; border-radius:12px; border:1px solid rgba(16, 185, 129, 0.2); display:flex; align-items:center; gap:1rem;">
                  <div style="width:32px; height:32px; background:var(--green); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900;">🏅</div>
                  <span style="font-weight:600; color:#fff; font-size:0.95rem;">${c}</span>
                </div>
              `).join('')}
            </div>
          ` : '<div style="background:var(--surface-2); padding:1.5rem; border-radius:12px; text-align:center; color:var(--text-muted); font-size:0.9rem;">No verified certifications in archive.</div>'}
        </div>
      </div>
      
      <div>
        <h3 style="margin-bottom:1.5rem; font-size:1.25rem; font-weight:800; display:flex; align-items:center; gap:0.6rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          Reels & Match Highlights
        </h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(240px, 1fr)); gap:1.5rem;">
          <div style="aspect-ratio:1/1; border-radius:16px; background:linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400') center/cover; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; cursor:pointer;" class="highlight-video">
             <div style="width:48px; height:48px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; color:#000; box-shadow:0 0 20px rgba(167,139,250,0.5);">▶</div>
             <div style="position:absolute; bottom:12px; left:12px; font-weight:700; font-size:0.8rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Training Session #42</div>
          </div>
          <div style="aspect-ratio:1/1; border-radius:16px; background:linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1511886929837-354d82b79232?auto=format&fit=crop&w=400') center/cover; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; cursor:pointer;" class="highlight-video">
             <div style="width:48px; height:48px; border-radius:50%; background:var(--accent); display:flex; align-items:center; justify-content:center; color:#000; box-shadow:0 0 20px rgba(167,139,250,0.5);">▶</div>
             <div style="position:absolute; bottom:12px; left:12px; font-weight:700; font-size:0.8rem; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">Championship Finals</div>
          </div>
        </div>
      </div>
    `;
    profileOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  // ─── Logout ───
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('athleon_user');
      window.location.href = 'index.html';
    });
  }

  // ─── AI VIDEO LAB LOGIC (Showcase) ───
  const scanStartBtn = document.getElementById('scan-start-btn');
  const scannerUploadArea = document.getElementById('scanner-upload-area');
  const scanProcessArea = document.getElementById('scan-process-area');
  const scanResultsArea = document.getElementById('scan-results-area');
  const scanResetBtn = document.getElementById('scan-reset-btn');
  const scannerFileInput = document.getElementById('scanner-file-input');

  if (scannerUploadArea && scannerFileInput) {
    scannerUploadArea.addEventListener('click', () => scannerFileInput.click());
    scannerFileInput.addEventListener('change', () => {
       if (scannerFileInput.files.length > 0) {
         scannerUploadArea.querySelector('h3').textContent = 'Video: ' + scannerFileInput.files[0].name;
       }
    });
  }

  if (scanStartBtn) {
    scanStartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scannerUploadArea.style.display = 'none';
      scanProcessArea.style.display = 'block';
      
      console.log('🔎 AI Lab: Starting performance scan simulation...');
      
      setTimeout(() => {
        scanProcessArea.style.display = 'none';
        scanResultsArea.style.display = 'block';
        console.log('✨ AI Lab: Scan complete, showing mock results');
      }, 4000);
    });
  }

  if (scanResetBtn) {
    scanResetBtn.addEventListener('click', () => {
      scanResultsArea.style.display = 'none';
      scannerUploadArea.style.display = 'block';
      if (scannerFileInput) {
        scannerFileInput.value = '';
        scannerUploadArea.querySelector('h3').textContent = 'Drop video here or click to select';
      }
    });
  }

  // ─── Credits Modal Logic ───
  const buyCreditsBtn = document.getElementById('buy-credits-btn');
  const creditsOverlay = document.getElementById('credits-overlay');
  const creditsModal = document.getElementById('credits-modal');
  const creditsClose = document.getElementById('credits-close');
  const creditsPlans = document.querySelectorAll('.credits-plan');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (buyCreditsBtn && creditsOverlay && creditsModal) {
    buyCreditsBtn.addEventListener('click', () => {
      creditsOverlay.classList.add('active');
      creditsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeCredits = () => {
      creditsOverlay.classList.remove('active');
      creditsModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    if (creditsClose) creditsClose.addEventListener('click', closeCredits);
    if (creditsOverlay) creditsOverlay.addEventListener('click', closeCredits);

    creditsPlans.forEach(plan => {
      plan.addEventListener('click', () => {
        creditsPlans.forEach(p => p.classList.remove('selected'));
        plan.classList.add('selected');
        
        const planName = plan.querySelector('.plan-name').textContent;
        const planPrice = plan.querySelector('.plan-price').textContent;
        if (checkoutBtn) {
          checkoutBtn.textContent = `PAY ${planPrice} FOR ${planName.toUpperCase()}`;
        }
      });
    });

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const selectedPlan = document.querySelector('.credits-plan.selected');
        if (selectedPlan) {
          const name = selectedPlan.querySelector('.plan-name').textContent;
          alert(`Redirecting to payment gateway for ${name} plan...`);
        } else {
          alert('Please select a credit plan first.');
        }
      });
    }
  }

})();
