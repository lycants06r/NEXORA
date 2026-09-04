/**
 * Social Media Analytics Dashboard
 * Complete 5-Module Interactive Analytics Suite for Nexora
 */

(function () {
  'use strict';

  // --- Initial Mock Data Schema matching user specification ---
  const initialMockData = {
    sentiment: [
      { timestamp: "2024-01-20T10:00:00", platform: "X", emotion: "supportive", score: 0.85, pos: 68, neu: 20, neg: 12 },
      { timestamp: "2024-01-20T10:15:00", platform: "Telegram", emotion: "anxiety", score: -0.62, pos: 54, neu: 26, neg: 20 },
      { timestamp: "2024-01-20T10:30:00", platform: "Instagram", emotion: "excitement", score: 0.91, pos: 76, neu: 15, neg: 9 },
      { timestamp: "2024-01-20T10:45:00", platform: "Facebook", emotion: "against", score: -0.45, pos: 48, neu: 32, neg: 20 },
      { timestamp: "2024-01-20T11:00:00", platform: "Reddit", emotion: "sarcasm", score: -0.15, pos: 58, neu: 25, neg: 17 },
      { timestamp: "2024-01-20T11:15:00", platform: "YouTube", emotion: "supportive", score: 0.78, pos: 72, neu: 18, neg: 10 }
    ],
    emotions: {
      supportive: 38,
      excitement: 26,
      sarcasm: 16,
      anxiety: 12,
      against: 8
    },
    platforms: {
      X: { pos: 68, neu: 20, neg: 12, volume: "4.2M" },
      Telegram: { pos: 54, neu: 26, neg: 20, volume: "1.8M" },
      Instagram: { pos: 76, neu: 15, neg: 9, volume: "3.5M" },
      Facebook: { pos: 48, neu: 32, neg: 20, volume: "2.9M" },
      Reddit: { pos: 58, neu: 25, neg: 17, volume: "1.2M" },
      YouTube: { pos: 72, neu: 18, neg: 10, volume: "2.1M" }
    },
    demographics: {
      age: { "18-24": 35, "25-34": 42, "35-44": 15, "45+": 8 },
      location: { "US": 45, "UK": 20, "India": 18, "EU": 10, "Others": 7 },
      language: { "English": 65, "Spanish": 20, "Hindi": 10, "Others": 5 },
      interests: [
        { topic: "AI & Tech", weight: 95 },
        { topic: "Finance & Web3", weight: 82 },
        { topic: "Climate Change", weight: 74 },
        { topic: "Cybersecurity", weight: 68 },
        { topic: "Gaming", weight: 60 },
        { topic: "Robotics", weight: 52 },
        { topic: "Digital Policy", weight: 45 }
      ]
    },
    trends: [
      { keyword: "#AI2024", velocity: 1250, prediction: "viral", confidence: 0.92, sparkline: [20, 35, 45, 80, 120, 180, 250], platforms: ["X", "Reddit"], status: "rising" },
      { keyword: "climate summit", velocity: 890, prediction: "growing", confidence: 0.78, sparkline: [15, 25, 40, 50, 65, 85, 95], platforms: ["Instagram", "Facebook"], status: "rising" },
      { keyword: "cyber defense", velocity: 640, prediction: "growing", confidence: 0.84, sparkline: [10, 20, 30, 45, 60, 70, 80], platforms: ["Telegram", "X"], status: "rising" },
      { keyword: "crypto regulation", velocity: 410, prediction: "declining", confidence: 0.65, sparkline: [90, 85, 70, 60, 50, 45, 35], platforms: ["Reddit", "X"], status: "declining" },
      { keyword: "old tech standard", velocity: 180, prediction: "declining", confidence: 0.88, sparkline: [80, 65, 50, 35, 25, 15, 10], platforms: ["Facebook"], status: "declining" }
    ],
    network: {
      nodes: [
        { id: "TechLead_Alex", influence: 0.95, type: "influencer", followers: 520000, posts: 1420, botScore: 5 },
        { id: "DataStream_Bot9", influence: 0.12, type: "bot", followers: 150, posts: 9800, botScore: 92 },
        { id: "PolicyInsights", influence: 0.88, type: "influencer", followers: 310000, posts: 840, botScore: 12 },
        { id: "CryptoPulse_Bot2", influence: 0.08, type: "bot", followers: 90, posts: 12400, botScore: 96 },
        { id: "Elena_V", influence: 0.76, type: "regular", followers: 28000, posts: 410, botScore: 8 },
        { id: "Nexus_Node5", influence: 0.65, type: "regular", followers: 14500, posts: 290, botScore: 14 },
        { id: "Syndicate_Node7", influence: 0.54, type: "regular", followers: 9800, posts: 180, botScore: 18 }
      ],
      edges: [
        { source: "TechLead_Alex", target: "Elena_V", weight: 0.9, interaction: "retweet" },
        { source: "TechLead_Alex", target: "Nexus_Node5", weight: 0.7, interaction: "mention" },
        { source: "PolicyInsights", target: "Elena_V", weight: 0.8, interaction: "reply" },
        { source: "DataStream_Bot9", target: "Syndicate_Node7", weight: 0.95, interaction: "spam_retweet" },
        { source: "CryptoPulse_Bot2", target: "DataStream_Bot9", weight: 0.99, interaction: "bot_sync" },
        { source: "Elena_V", target: "Syndicate_Node7", weight: 0.5, interaction: "like" }
      ]
    },
    alerts: [
      { id: 1, type: "sentiment_spike", severity: "critical", message: "Negative sentiment spike monitor active", timestamp: "2024-01-20T11:00:00", active: false },
      { id: 2, type: "bot_attack", severity: "high", message: "Bot swarm detected targeting #AI2024 with 92% confidence", timestamp: "2024-01-20T10:45:00", active: false },
      { id: 3, type: "keyword_surge", severity: "medium", message: "Unusual velocity spike for 'cyber defense' (+640/hr)", timestamp: "2024-01-20T10:30:00", active: false }
    ],
    riskKeywords: [
      { keyword: "databreach", count: 1420, threshold: 1000, level: "critical" },
      { keyword: "system crash", count: 860, threshold: 800, level: "high" },
      { keyword: "exploit", count: 540, threshold: 600, level: "medium" },
      { keyword: "latency", count: 320, threshold: 500, level: "low" }
    ]
  };

  // --- State Controller & localStorage Preferences ---
  const state = {
    data: JSON.parse(JSON.stringify(initialMockData)),
    activeTab: 'all',
    activeTopicFilter: null,
    selectedNode: null,
    dateRange: '24h',
    autoRefreshInterval: 30000, // 30s default
    autoRefreshTimer: null,
    countdown: 30,
    countdownTimer: null,
    moduleVisibility: JSON.parse(localStorage.getItem('sma_module_visibility') || '{"m1":true,"m2":true,"m3":true,"m4":true,"m5":true}')
  };

  function saveVisibilityPrefs() {
    localStorage.setItem('sma_module_visibility', JSON.stringify(state.moduleVisibility));
  }

  // --- Export Helper Functions ---
  function exportCSV(filename, rows) {
    const processRow = function (row) {
      let finalVal = '';
      for (let j = 0; j < row.length; j++) {
        let innerValue = row[j] === null ? '' : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        let result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ',';
        finalVal += result;
      }
      return finalVal + '\n';
    };

    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  function exportJSON(filename, dataObj) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // --- DOM Injection & Layout Setup ---
  function injectAnalyticsSuite() {
    if (document.getElementById('sma-fab')) return;

    // 1. Create Crisis Top Banner Alert (Hidden by default)
    const crisisBanner = document.createElement('div');
    crisisBanner.id = 'sma-crisis-banner';
    crisisBanner.className = 'sma-crisis-banner';
    crisisBanner.style.display = 'none';
    crisisBanner.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="material-symbols-outlined" style="font-size:20px;">warning</span>
        <span id="sma-banner-text"></span>
      </div>
      <button class="sma-btn sma-btn--danger" id="sma-banner-dismiss" style="padding:4px 10px; font-size:11px;">Dismiss</button>
    `;
    document.body.appendChild(crisisBanner);

    // 2. Create Floating Action Button (FAB)
    const fab = document.createElement('button');
    fab.id = 'sma-fab';
    fab.className = 'sma-fab';
    fab.style.display = 'none';
    // fab removed from webpage corner

    // 3. Create Dashboard Modal Overlay & Container
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'sma-modal';
    modalOverlay.className = 'sma-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="sma-container">
        <!-- Header -->
        <header class="sma-header">
          <div class="sma-header__title-area">
            <div class="sma-header__icon">
              <span class="material-symbols-outlined" style="font-size:24px;">hub</span>
            </div>
            <div>
              <h2 class="sma-header__title">
                Social Media Analytics Dashboard
                <span class="sma-privacy-badge">
                  <span class="material-symbols-outlined" style="font-size:14px;">verified_user</span>
                  Anonymized Data
                </span>
              </h2>
              <p class="sma-header__subtitle">Real-time sentiment, trend forecast, network topology & crisis monitor</p>
            </div>
          </div>

          <!-- Controls -->
          <div class="sma-controls">
            <div class="sma-control-group">
              <span class="sma-control-label">Range:</span>
              <select class="sma-select" id="sma-date-range">
                <option value="1h">Last 1 Hour</option>
                <option value="24h" selected>Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>

            <div class="sma-control-group">
              <span class="sma-control-label">Auto Refresh:</span>
              <select class="sma-select" id="sma-refresh-rate">
                <option value="15000">15s</option>
                <option value="30000" selected>30s</option>
                <option value="60000">1min</option>
                <option value="manual">Manual</option>
              </select>
              <span id="sma-refresh-countdown" style="font-size:11px; font-weight:700; color:var(--primary-color);">30s</span>
            </div>

            <button class="sma-btn sma-btn--primary" id="sma-export-all">
              <span class="material-symbols-outlined" style="font-size:16px;">download</span>
              Export Suite
            </button>

            <button class="sma-btn" id="sma-modal-close" style="padding:6px 10px;">
              <span class="material-symbols-outlined" style="font-size:18px;">close</span>
            </button>
          </div>
        </header>

        <!-- Navigation Tabs & Module Toggles -->
        <nav class="sma-nav-bar">
          <div class="sma-tabs">
            <button class="sma-tab is-active" data-tab="all">All Modules</button>
            <button class="sma-tab" data-tab="m1">1. Sentiment</button>
            <button class="sma-tab" data-tab="m2">2. Demographics</button>
            <button class="sma-tab" data-tab="m3">3. Trends</button>
            <button class="sma-tab" data-tab="m4">4. Network</button>
            <button class="sma-tab" data-tab="m5">5. Crisis Alerts</button>
          </div>

          <div class="sma-toggles">
            <span class="sma-control-label">Toggle Modules:</span>
            <label class="sma-toggle-item">
              <input type="checkbox" class="sma-toggle-input" data-mod="m1" ${state.moduleVisibility.m1 ? 'checked' : ''}>
              Sentiment
            </label>
            <label class="sma-toggle-item">
              <input type="checkbox" class="sma-toggle-input" data-mod="m2" ${state.moduleVisibility.m2 ? 'checked' : ''}>
              Demo
            </label>
            <label class="sma-toggle-item">
              <input type="checkbox" class="sma-toggle-input" data-mod="m3" ${state.moduleVisibility.m3 ? 'checked' : ''}>
              Trends
            </label>
            <label class="sma-toggle-item">
              <input type="checkbox" class="sma-toggle-input" data-mod="m4" ${state.moduleVisibility.m4 ? 'checked' : ''}>
              Network
            </label>
            <label class="sma-toggle-item">
              <input type="checkbox" class="sma-toggle-input" data-mod="m5" ${state.moduleVisibility.m5 ? 'checked' : ''}>
              Crisis
            </label>
          </div>
        </nav>

        <!-- Topic Cross-Filter Indicator Bar -->
        <div class="sma-filter-bar" id="sma-filter-bar">
          <span>Active Cross-Filter Topic:</span>
          <span class="sma-filter-tag" id="sma-filter-tag-name">
            #AI2024
            <span class="sma-filter-tag__remove" id="sma-clear-topic-filter">&times;</span>
          </span>
          <span style="color:var(--text-muted); font-size:11px;">(All 5 modules are filtered by this topic)</span>
        </div>

        <!-- Dashboard Content Body Grid -->
        <main class="sma-body sma-scrollable" id="sma-body-grid">
          <!-- Modules will be dynamically rendered here -->
        </main>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // Wire Events
    fab.addEventListener('click', openModal);
    document.getElementById('sma-modal-close').addEventListener('click', closeModal);
    document.getElementById('sma-banner-dismiss').addEventListener('click', () => {
      crisisBanner.classList.remove('is-visible');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('is-active')) {
        closeModal();
      }
    });

    // Tab buttons
    modalOverlay.querySelectorAll('.sma-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        modalOverlay.querySelectorAll('.sma-tab').forEach(t => t.classList.remove('is-active'));
        e.currentTarget.classList.add('is-active');
        state.activeTab = e.currentTarget.dataset.tab;
        renderAllModules();
      });
    });

    // Module Visibility Checkboxes
    modalOverlay.querySelectorAll('.sma-toggle-input').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const mod = e.target.dataset.mod;
        state.moduleVisibility[mod] = e.target.checked;
        saveVisibilityPrefs();
        renderAllModules();
      });
    });

    // Date Range Picker
    document.getElementById('sma-date-range').addEventListener('change', (e) => {
      state.dateRange = e.target.value;
      simulateDataRefresh();
    });

    // Refresh Rate Selector
    document.getElementById('sma-refresh-rate').addEventListener('change', (e) => {
      const val = e.target.value;
      if (val === 'manual') {
        state.autoRefreshInterval = null;
        clearInterval(state.autoRefreshTimer);
        clearInterval(state.countdownTimer);
        document.getElementById('sma-refresh-countdown').textContent = 'Off';
      } else {
        state.autoRefreshInterval = parseInt(val, 10);
        restartAutoRefresh();
      }
    });

    // Export Suite Button
    document.getElementById('sma-export-all').addEventListener('click', () => {
      exportJSON('social-analytics-full-export.json', state.data);
    });

    // Topic Filter Clear
    document.getElementById('sma-clear-topic-filter').addEventListener('click', () => {
      state.activeTopicFilter = null;
      document.getElementById('sma-filter-bar').classList.remove('is-active');
      renderAllModules();
    });

    // Trigger Initial Auto-Refresh setup
    restartAutoRefresh();
    checkCrisisAlertBanner();
  }

  function openModal() {
    const modal = document.getElementById('sma-modal');
    modal.classList.add('is-active');
    renderAllModules();
  }

  function closeModal() {
    const modal = document.getElementById('sma-modal');
    modal.classList.remove('is-active');
  }

  function checkCrisisAlertBanner() {
    const criticalAlert = state.data.alerts.find(a => a.active && (a.severity === 'critical' || a.severity === 'high'));
    const banner = document.getElementById('sma-crisis-banner');
    if (!banner) return;
    if (criticalAlert) {
      document.getElementById('sma-banner-text').textContent = criticalAlert.message;
      banner.className = `sma-crisis-banner sma-crisis-banner--${criticalAlert.severity} is-visible`;
      banner.style.display = 'flex';
    } else {
      banner.className = 'sma-crisis-banner';
      banner.classList.remove('is-visible');
      banner.style.display = 'none';
    }
  }

  function restartAutoRefresh() {
    clearInterval(state.autoRefreshTimer);
    clearInterval(state.countdownTimer);
    if (!state.autoRefreshInterval) return;

    state.countdown = Math.floor(state.autoRefreshInterval / 1000);
    const cdEl = document.getElementById('sma-refresh-countdown');
    if (cdEl) cdEl.textContent = `${state.countdown}s`;

    state.countdownTimer = setInterval(() => {
      state.countdown--;
      if (state.countdown <= 0) {
        state.countdown = Math.floor(state.autoRefreshInterval / 1000);
      }
      if (cdEl) cdEl.textContent = `${state.countdown}s`;
    }, 1000);

    state.autoRefreshTimer = setInterval(() => {
      simulateDataRefresh();
    }, state.autoRefreshInterval);
  }

  function simulateDataRefresh() {
    // Add real-time fluctuation
    const latest = state.data.sentiment[state.data.sentiment.length - 1];
    const newPos = Math.min(85, Math.max(40, latest.pos + (Math.floor(Math.random() * 7) - 3)));
    const newNeg = Math.min(40, Math.max(5, 100 - newPos - 20));
    const newNeu = 100 - newPos - newNeg;

    state.data.sentiment.push({
      timestamp: new Date().toISOString(),
      platform: ["X", "Telegram", "Instagram", "Reddit", "YouTube"][Math.floor(Math.random() * 5)],
      emotion: ["supportive", "anxiety", "excitement", "sarcasm", "against"][Math.floor(Math.random() * 5)],
      score: (newPos - newNeg) / 100,
      pos: newPos,
      neu: newNeu,
      neg: newNeg
    });

    if (state.data.sentiment.length > 12) state.data.sentiment.shift();

    // Update trend velocities
    state.data.trends.forEach(t => {
      t.velocity += Math.floor(Math.random() * 30) - 14;
      if (t.velocity < 50) t.velocity = 50;
      t.sparkline.shift();
      t.sparkline.push(t.sparkline[t.sparkline.length - 1] + Math.floor(Math.random() * 20) - 8);
    });

    checkCrisisAlertBanner();

    if (document.getElementById('sma-modal').classList.contains('is-active')) {
      renderAllModules();
    }
  }

  // --- Module Render Dispatcher ---
  function renderAllModules() {
    const grid = document.getElementById('sma-body-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const vis = state.moduleVisibility;
    const tab = state.activeTab;

    if ((tab === 'all' || tab === 'm1') && vis.m1) {
      grid.appendChild(createModule1_Sentiment());
    }
    if ((tab === 'all' || tab === 'm2') && vis.m2) {
      grid.appendChild(createModule2_Demographics());
    }
    if ((tab === 'all' || tab === 'm3') && vis.m3) {
      grid.appendChild(createModule3_Trends());
    }
    if ((tab === 'all' || tab === 'm4') && vis.m4) {
      grid.appendChild(createModule4_Network());
    }
    if ((tab === 'all' || tab === 'm5') && vis.m5) {
      grid.appendChild(createModule5_CrisisAlerts());
    }

    // Initialize Network Topology Canvas after rendering DOM
    if ((tab === 'all' || tab === 'm4') && vis.m4) {
      initNetworkCanvas();
    }
  }

  // ==========================================================================
  // MODULE 1: REAL-TIME SENTIMENT ANALYZER
  // ==========================================================================
  function createModule1_Sentiment() {
    const card = document.createElement('div');
    card.className = 'sma-card';

    // Calculate aggregate scores
    const latestSent = state.data.sentiment[state.data.sentiment.length - 1];
    const posPct = latestSent.pos;
    const neuPct = latestSent.neu;
    const negPct = latestSent.neg;

    card.innerHTML = `
      <div class="sma-card__header">
        <h3 class="sma-card__title">
          <span class="material-symbols-outlined" style="color:var(--accent-emerald);">mood</span>
          MODULE 1: Real-Time Sentiment Analyzer
        </h3>
        <div class="sma-card__actions">
          <button class="sma-btn" id="sma-export-m1">
            <span class="material-symbols-outlined" style="font-size:14px;">download</span> CSV
          </button>
        </div>
      </div>

      <div class="sma-grid-4">
        <!-- 1. Live Sentiment Gauge -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06); text-align:center;">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Overall Sentiment Gauge</h4>
          <div class="sma-gauge-wrapper">
            <svg class="sma-gauge-svg" viewBox="0 0 100 100">
              <circle class="sma-gauge-bg" cx="50" cy="50" r="40"></circle>
              <circle class="sma-gauge-fill-pos" cx="50" cy="50" r="40" 
                stroke-dasharray="251.2" stroke-dashoffset="${251.2 * (1 - posPct / 100)}"></circle>
            </svg>
            <div class="sma-gauge-center">
              <div class="sma-gauge-value" style="color:var(--accent-emerald);">${posPct}%</div>
              <div class="sma-gauge-label">Positive Score</div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-around; font-size:11px; margin-top:6px;">
            <span style="color:var(--accent-emerald);">● Pos: ${posPct}%</span>
            <span style="color:var(--text-muted);">● Neu: ${neuPct}%</span>
            <span style="color:var(--accent-rose);">● Neg: ${negPct}%</span>
          </div>
        </div>

        <!-- 2. Emotion Breakdown Chart -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Emotion Breakdown</h4>
          <div class="sma-emotion-list">
            <div class="sma-emotion-item">
              <div class="sma-emotion-info"><span class="sma-emotion-name">Supportive</span><span class="sma-emotion-pct" style="color:var(--primary-color);">${state.data.emotions.supportive}%</span></div>
              <div class="sma-progress-track"><div class="sma-progress-bar" style="width:${state.data.emotions.supportive}%; background:var(--primary-color);"></div></div>
            </div>
            <div class="sma-emotion-item">
              <div class="sma-emotion-info"><span class="sma-emotion-name">Excitement</span><span class="sma-emotion-pct" style="color:var(--accent-violet);">${state.data.emotions.excitement}%</span></div>
              <div class="sma-progress-track"><div class="sma-progress-bar" style="width:${state.data.emotions.excitement}%; background:var(--accent-violet);"></div></div>
            </div>
            <div class="sma-emotion-item">
              <div class="sma-emotion-info"><span class="sma-emotion-name">Sarcasm</span><span class="sma-emotion-pct" style="color:var(--secondary-color);">${state.data.emotions.sarcasm}%</span></div>
              <div class="sma-progress-track"><div class="sma-progress-bar" style="width:${state.data.emotions.sarcasm}%; background:var(--secondary-color);"></div></div>
            </div>
            <div class="sma-emotion-item">
              <div class="sma-emotion-info"><span class="sma-emotion-name">Anxiety</span><span class="sma-emotion-pct" style="color:var(--accent-amber);">${state.data.emotions.anxiety}%</span></div>
              <div class="sma-progress-track"><div class="sma-progress-bar" style="width:${state.data.emotions.anxiety}%; background:var(--accent-amber);"></div></div>
            </div>
            <div class="sma-emotion-item">
              <div class="sma-emotion-info"><span class="sma-emotion-name">Against</span><span class="sma-emotion-pct" style="color:var(--accent-rose);">${state.data.emotions.against}%</span></div>
              <div class="sma-progress-track"><div class="sma-progress-bar" style="width:${state.data.emotions.against}%; background:var(--accent-rose);"></div></div>
            </div>
          </div>
        </div>

        <!-- 3. Timeline Graph Fluctuation (SVG) -->
        <div style="grid-column: span 2; background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06); position:relative;">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Sentiment Fluctuations Over Time</h4>
          <div class="sma-timeline-container" id="sma-timeline-svg-wrap">
            <!-- SVG Timeline Line Graph rendered via JS -->
            <div id="sma-chart-tooltip" class="sma-chart-tooltip"></div>
          </div>
        </div>
      </div>

      <!-- 4. Platform-wise Sentiment Comparison -->
      <div style="margin-top:10px;">
        <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Platform Sentiment Comparison</h4>
        <div class="sma-platform-grid">
          ${Object.keys(state.data.platforms).map(plat => {
      const pData = state.data.platforms[plat];
      return `
              <div class="sma-platform-item">
                <span class="sma-platform-name">${plat}</span>
                <div class="sma-platform-score" style="color:var(--accent-emerald);">${pData.pos}% Pos</div>
                <div style="font-size:10px; color:var(--text-muted);">Vol: ${pData.volume}</div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;

    setTimeout(() => {
      renderSentimentSVGTimeline();
      const exportBtn = card.querySelector('#sma-export-m1');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const rows = [["Timestamp", "Platform", "Emotion", "Positive %", "Neutral %", "Negative %"]];
          state.data.sentiment.forEach(s => rows.push([s.timestamp, s.platform, s.emotion, s.pos, s.neu, s.neg]));
          exportCSV('sentiment_analyzer_export.csv', rows);
        });
      }
    }, 0);

    return card;
  }

  function renderSentimentSVGTimeline() {
    const wrap = document.getElementById('sma-timeline-svg-wrap');
    if (!wrap) return;
    const tooltip = document.getElementById('sma-chart-tooltip');

    const sData = state.data.sentiment;
    const w = wrap.clientWidth || 500;
    const h = 180;

    let pts = sData.map((d, i) => {
      const x = (i / (sData.length - 1)) * (w - 40) + 20;
      const y = h - 20 - (d.pos / 100) * (h - 40);
      return { x, y, d };
    });

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      pathD += ` L ${pts[i].x} ${pts[i].y}`;
    }

    let areaD = `${pathD} L ${pts[pts.length - 1].x} ${h - 20} L ${pts[0].x} ${h - 20} Z`;

    let circlesSvg = pts.map((p, idx) => `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="var(--primary-color)" stroke="#ffffff" stroke-width="2" data-idx="${idx}" style="cursor:pointer;"></circle>
    `).join('');

    wrap.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="sma-grad-pos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <line x1="20" y1="${h - 20}" x2="${w - 20}" y2="${h - 20}" stroke="rgba(255,255,255,0.1)" />
        <path d="${areaD}" fill="url(#sma-grad-pos)" />
        <path d="${pathD}" fill="none" stroke="var(--primary-color)" stroke-width="3" />
        ${circlesSvg}
      </svg>
    `;
    wrap.appendChild(tooltip);

    wrap.querySelectorAll('circle').forEach(c => {
      c.addEventListener('mouseenter', (e) => {
        const idx = e.target.dataset.idx;
        const item = sData[idx];
        const timeStr = new Date(item.timestamp).toLocaleTimeString();
        tooltip.innerHTML = `
          <strong>${timeStr} (${item.platform})</strong><br>
          Positive: ${item.pos}% | Negative: ${item.neg}%<br>
          Emotion: ${item.emotion}
        `;
        tooltip.classList.add('is-active');
        tooltip.style.left = `${e.target.getAttribute('cx')}px`;
        tooltip.style.top = `${e.target.getAttribute('cy')}px`;
      });
      c.addEventListener('mouseleave', () => {
        tooltip.classList.remove('is-active');
      });
    });
  }

  // ==========================================================================
  // MODULE 2: DEMOGRAPHIC DASHBOARD
  // ==========================================================================
  function createModule2_Demographics() {
    const card = document.createElement('div');
    card.className = 'sma-card';

    const demo = state.data.demographics;

    card.innerHTML = `
      <div class="sma-card__header">
        <h3 class="sma-card__title">
          <span class="material-symbols-outlined" style="color:var(--accent-violet);">public</span>
          MODULE 2: Demographic Dashboard (Anonymized Aggregates)
        </h3>
        <div class="sma-card__actions">
          <button class="sma-btn" id="sma-export-m2">
            <span class="material-symbols-outlined" style="font-size:14px;">download</span> CSV
          </button>
        </div>
      </div>

      <div class="sma-grid-4">
        <!-- 1. Age Distribution Donut Chart -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06); text-align:center;">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Age Distribution</h4>
          <div style="height:150px; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 36 36" style="width:120px; height:120px; transform:rotate(-90deg);">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3.8"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--primary-color)" stroke-width="3.8" stroke-dasharray="35 65" stroke-dashoffset="0"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-violet)" stroke-width="3.8" stroke-dasharray="42 58" stroke-dashoffset="-35"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-amber)" stroke-width="3.8" stroke-dasharray="15 85" stroke-dashoffset="-77"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-rose)" stroke-width="3.8" stroke-dasharray="8 92" stroke-dashoffset="-92"/>
            </svg>
          </div>
          <div style="display:flex; justify-content:space-around; font-size:11px; flex-wrap:wrap; gap:4px;">
            <span style="color:var(--primary-color);">● 18-24 (35%)</span>
            <span style="color:var(--accent-violet);">● 25-34 (42%)</span>
            <span style="color:var(--accent-amber);">● 35-44 (15%)</span>
            <span style="color:var(--accent-rose);">● 45+ (8%)</span>
          </div>
        </div>

        <!-- 2. Geographic Heat Map Visualization -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Geographic Heatmap</h4>
          <div class="sma-geo-map">
            <svg width="100%" height="100%" viewBox="0 0 300 150">
              <path d="M 30,40 Q 50,20 80,40 T 120,80 T 50,110 Z" fill="rgba(6, 182, 212, 0.4)" stroke="var(--primary-color)" />
              <path d="M 140,30 Q 160,10 190,30 T 220,60 T 150,90 Z" fill="rgba(139, 92, 246, 0.4)" stroke="var(--accent-violet)" />
              <path d="M 210,70 Q 230,50 270,70 T 290,120 T 200,130 Z" fill="rgba(245, 158, 11, 0.4)" stroke="var(--accent-amber)" />
              <circle cx="70" cy="50" r="14" fill="rgba(6, 182, 212, 0.6)" class="sma-pulse" />
              <circle cx="170" cy="40" r="10" fill="rgba(139, 92, 246, 0.6)" />
              <circle cx="240" cy="90" r="11" fill="rgba(245, 158, 11, 0.6)" />
            </svg>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:8px; color:var(--text-muted);">
            <span>US: 45%</span><span>UK: 20%</span><span>India: 18%</span><span>EU: 10%</span><span>Others: 7%</span>
          </div>
        </div>

        <!-- 3. Language Breakdown Bar Chart -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Language Breakdown</h4>
          <div class="sma-emotion-list">
            ${Object.keys(demo.language).map(lang => `
              <div class="sma-emotion-item">
                <div class="sma-emotion-info"><span class="sma-emotion-name">${lang}</span><span class="sma-emotion-pct">${demo.language[lang]}%</span></div>
                <div class="sma-progress-track"><div class="sma-progress-bar" style="width:${demo.language[lang]}%; background:var(--primary-color);"></div></div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 4. Professional Interests Word Cloud -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Professional Interests Word Cloud</h4>
          <div class="sma-word-cloud">
            ${demo.interests.map(item => `
              <span class="sma-word-tag" style="font-size:${10 + Math.floor(item.weight / 8)}px;" data-topic="${item.topic}">
                ${item.topic}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      // Wire Word Cloud topic cross-filtering
      card.querySelectorAll('.sma-word-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
          const topic = e.target.dataset.topic;
          state.activeTopicFilter = topic;
          document.getElementById('sma-filter-bar').classList.add('is-active');
          document.getElementById('sma-filter-tag-name').firstChild.textContent = topic + ' ';
          renderAllModules();
        });
      });

      const exportBtn = card.querySelector('#sma-export-m2');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const rows = [["Category", "Key", "Percentage/Weight"]];
          Object.keys(demo.age).forEach(k => rows.push(["Age", k, demo.age[k]]));
          Object.keys(demo.location).forEach(k => rows.push(["Location", k, demo.location[k]]));
          Object.keys(demo.language).forEach(k => rows.push(["Language", k, demo.language[k]]));
          demo.interests.forEach(i => rows.push(["Interest", i.topic, i.weight]));
          exportCSV('demographics_export.csv', rows);
        });
      }
    }, 0);

    return card;
  }

  // ==========================================================================
  // MODULE 3: TREND TRACKER
  // ==========================================================================
  function createModule3_Trends() {
    const card = document.createElement('div');
    card.className = 'sma-card';

    card.innerHTML = `
      <div class="sma-card__header">
        <h3 class="sma-card__title">
          <span class="material-symbols-outlined" style="color:var(--accent-emerald);">trending_up</span>
          MODULE 3: Trend Tracker & Viral Forecast
        </h3>
        <div class="sma-card__actions">
          <button class="sma-btn" id="sma-export-m3">
            <span class="material-symbols-outlined" style="font-size:14px;">download</span> CSV
          </button>
        </div>
      </div>

      <div class="sma-grid-3">
        <!-- 1. Live Trending Topics & Velocity -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Live Trending Topics</h4>
          <div class="sma-trend-list">
            ${state.data.trends.map(t => `
              <div class="sma-trend-item ${state.activeTopicFilter === t.keyword ? 'is-selected' : ''}" data-topic="${t.keyword}">
                <div>
                  <div class="sma-trend-keyword">${t.keyword}</div>
                  <div style="font-size:10px; color:var(--text-muted); margin-top:2px;">
                    Platforms: ${t.platforms.join(', ')}
                  </div>
                </div>
                <div style="text-align:right;">
                  <div class="sma-trend-velocity">
                    <span class="material-symbols-outlined" style="font-size:14px;">bolt</span>
                    +${t.velocity}/hr
                  </div>
                  <span class="sma-badge sma-badge--${t.prediction === 'viral' ? 'viral' : 'growing'}">
                    ${t.prediction} (${Math.round(t.confidence * 100)}%)
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. Cross-Platform Trend Migration Diagram -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Cross-Platform Migration Flow</h4>
          <div class="sma-flow-container">
            <svg width="100%" height="100%" viewBox="0 0 300 150">
              <!-- Flow Nodes -->
              <rect x="10" y="20" width="60" height="30" rx="6" fill="rgba(6, 182, 212, 0.3)" stroke="var(--primary-color)" />
              <text x="40" y="38" fill="#fff" font-size="10" text-anchor="middle">X (Twitter)</text>

              <rect x="120" y="60" width="60" height="30" rx="6" fill="rgba(139, 92, 246, 0.3)" stroke="var(--accent-violet)" />
              <text x="150" y="78" fill="#fff" font-size="10" text-anchor="middle">Reddit</text>

              <rect x="230" y="100" width="60" height="30" rx="6" fill="rgba(245, 158, 11, 0.3)" stroke="var(--accent-amber)" />
              <text x="260" y="118" fill="#fff" font-size="10" text-anchor="middle">Telegram</text>

              <!-- Flow Curved Paths -->
              <path d="M 70,35 C 95,35 95,75 120,75" fill="none" stroke="var(--primary-color)" stroke-width="2" stroke-dasharray="4,4" />
              <path d="M 180,75 C 205,75 205,115 230,115" fill="none" stroke="var(--accent-violet)" stroke-width="2" stroke-dasharray="4,4" />
            </svg>
          </div>
          <div style="font-size:11px; color:var(--text-muted); text-align:center; margin-top:8px;">
            Flow Velocity: <strong>840 items/min</strong> from X → Reddit → Telegram
          </div>
        </div>

        <!-- 3. Keyword Surge Sparklines & Rising vs Declining -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Keyword Surge Sparklines</h4>
          <div class="sma-trend-list">
            ${state.data.trends.map(t => {
      const pts = t.sparkline.map((v, i) => `${(i / (t.sparkline.length - 1)) * 70 + 5},${30 - (v / 250) * 25}`).join(' ');
      return `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(255,255,255,0.04);">
                  <span style="font-size:12px; font-weight:600; color:#fff;">${t.keyword}</span>
                  <svg class="sma-sparkline" viewBox="0 0 80 35">
                    <polyline points="${pts}" fill="none" stroke="${t.status === 'rising' ? 'var(--accent-emerald)' : 'var(--accent-rose)'}" stroke-width="2" />
                  </svg>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      card.querySelectorAll('.sma-trend-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const topic = e.currentTarget.dataset.topic;
          state.activeTopicFilter = topic;
          document.getElementById('sma-filter-bar').classList.add('is-active');
          document.getElementById('sma-filter-tag-name').firstChild.textContent = topic + ' ';
          renderAllModules();
        });
      });

      const exportBtn = card.querySelector('#sma-export-m3');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const rows = [["Keyword", "Velocity (/hr)", "Prediction", "Confidence", "Platforms", "Status"]];
          state.data.trends.forEach(t => rows.push([t.keyword, t.velocity, t.prediction, t.confidence, t.platforms.join(';'), t.status]));
          exportCSV('trend_tracker_export.csv', rows);
        });
      }
    }, 0);

    return card;
  }

  // ==========================================================================
  // MODULE 4: NETWORK TOPOLOGY VISUALIZER
  // ==========================================================================
  function createModule4_Network() {
    const card = document.createElement('div');
    card.className = 'sma-card';

    card.innerHTML = `
      <div class="sma-card__header">
        <h3 class="sma-card__title">
          <span class="material-symbols-outlined" style="color:var(--primary-color);">share</span>
          MODULE 4: Network Topology Visualizer & Bot Detection
        </h3>
        <div class="sma-card__actions">
          <button class="sma-btn" id="sma-export-m4">
            <span class="material-symbols-outlined" style="font-size:14px;">download</span> CSV
          </button>
        </div>
      </div>

      <div class="sma-network-layout">
        <!-- Interactive Force Graph Canvas Container -->
        <div class="sma-canvas-container">
          <canvas id="sma-network-canvas"></canvas>
          <div style="position:absolute; bottom:10px; left:10px; font-size:10px; color:var(--text-muted); background:rgba(0,0,0,0.6); padding:4px 8px; border-radius:6px;">
            ● Large Node: Influencer | <span style="color:var(--accent-rose);">● Red Node: Suspicious Bot</span> | Click Node to Inspect
          </div>
        </div>

        <!-- Leaderboard & Node Inspector Side Panel -->
        <div class="sma-network-sidebar">
          <div id="sma-node-inspector" class="sma-node-inspector" style="display:none;">
            <h4 style="font-size:13px; font-weight:800; color:var(--primary-color); margin:0 0 6px 0;" id="sma-inspector-id">User Details</h4>
            <div style="font-size:11px; display:flex; flex-direction:column; gap:4px;" id="sma-inspector-body">
              <!-- Dynamic inspector content -->
            </div>
            <button class="sma-btn" style="margin-top:8px; width:100%; justify-content:center; padding:4px;" id="sma-close-inspector">Close Panel</button>
          </div>

          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 6px 0; text-transform:uppercase;">Influence Score Leaderboard</h4>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${state.data.network.nodes.sort((a, b) => b.influence - a.influence).map(n => `
              <div class="sma-leaderboard-item ${n.type === 'bot' ? 'sma-leaderboard-item--bot' : ''}">
                <div>
                  <div style="font-weight:700; color:#fff;">${n.id}</div>
                  <div style="font-size:10px; color:var(--text-muted);">${n.followers.toLocaleString()} followers</div>
                </div>
                <div style="text-align:right;">
                  <div style="font-weight:800; color:${n.type === 'bot' ? 'var(--accent-rose)' : 'var(--primary-color)'};">
                    ${Math.round(n.influence * 100)} pts
                  </div>
                  ${n.type === 'bot' ? `<span style="font-size:9px; color:var(--accent-rose); font-weight:800;">BOT (${n.botScore}%)</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      const exportBtn = card.querySelector('#sma-export-m4');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const rows = [["Node ID", "Type", "Influence Score", "Followers", "Posts", "Bot Confidence %"]];
          state.data.network.nodes.forEach(n => rows.push([n.id, n.type, n.influence, n.followers, n.posts, n.botScore]));
          exportCSV('network_topology_export.csv', rows);
        });
      }
    }, 0);

    return card;
  }

  // Canvas Force Directed Graph Renderer
  let canvasAnimId = null;
  function initNetworkCanvas() {
    const canvas = document.getElementById('sma-network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;

    canvas.width = container.clientWidth || 600;
    canvas.height = container.clientHeight || 380;

    const nodes = state.data.network.nodes;
    const edges = state.data.network.edges;

    // Initialize random positions if not set
    nodes.forEach((n, idx) => {
      if (!n.x) {
        n.x = Math.random() * (canvas.width - 100) + 50;
        n.y = Math.random() * (canvas.height - 100) + 50;
        n.vx = 0;
        n.vy = 0;
      }
    });

    let draggedNode = null;

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      nodes.forEach(n => {
        const r = n.type === 'influencer' ? 14 : (n.type === 'bot' ? 10 : 8);
        const dist = Math.hypot(n.x - mx, n.y - my);
        if (dist < r) {
          draggedNode = n;
          showNodeInspector(n);
        }
      });
    });

    canvas.addEventListener('mousemove', (e) => {
      if (draggedNode) {
        const rect = canvas.getBoundingClientRect();
        draggedNode.x = e.clientX - rect.left;
        draggedNode.y = e.clientY - rect.top;
      }
    });

    window.addEventListener('mouseup', () => {
      draggedNode = null;
    });

    if (canvasAnimId) cancelAnimationFrame(canvasAnimId);

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Edges with animated pulses
      const time = Date.now() * 0.003;
      edges.forEach(e => {
        const sourceNode = nodes.find(n => n.id === e.source);
        const targetNode = nodes.find(n => n.id === e.target);

        if (sourceNode && targetNode) {
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.strokeStyle = e.interaction.includes('bot') ? 'rgba(239,68,68,0.4)' : 'rgba(6,182,212,0.3)';
          ctx.lineWidth = e.weight * 2;
          ctx.stroke();

          // Animated pulse along edge
          const pulsePos = (time % 1);
          const px = sourceNode.x + (targetNode.x - sourceNode.x) * pulsePos;
          const py = sourceNode.y + (targetNode.y - sourceNode.y) * pulsePos;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fillStyle = e.interaction.includes('bot') ? '#ef4444' : '#06b6d4';
          ctx.fill();
        }
      });

      // Draw Nodes
      nodes.forEach(n => {
        const r = n.type === 'influencer' ? 14 : (n.type === 'bot' ? 10 : 8);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);

        if (n.type === 'bot') {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 10;
        } else if (n.type === 'influencer') {
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 15;
        } else {
          ctx.fillStyle = '#8b5cf6';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Geist, sans-serif';
        ctx.fillText(n.id, n.x + r + 4, n.y + 3);
      });

      canvasAnimId = requestAnimationFrame(step);
    }

    step();
  }

  function showNodeInspector(n) {
    const inspector = document.getElementById('sma-node-inspector');
    if (!inspector) return;
    inspector.style.display = 'block';
    document.getElementById('sma-inspector-id').textContent = `Node: ${n.id}`;
    document.getElementById('sma-inspector-body').innerHTML = `
      <div><strong>Type:</strong> ${n.type.toUpperCase()}</div>
      <div><strong>Influence Score:</strong> ${(n.influence * 100).toFixed(0)} pts</div>
      <div><strong>Followers:</strong> ${n.followers.toLocaleString()}</div>
      <div><strong>Total Posts:</strong> ${n.posts}</div>
      <div><strong>Bot Score Confidence:</strong> <span style="color:${n.botScore > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}">${n.botScore}%</span></div>
    `;

    document.getElementById('sma-close-inspector').onclick = () => {
      inspector.style.display = 'none';
    };
  }

  // ==========================================================================
  // MODULE 5: CRISIS ALERT SYSTEM
  // ==========================================================================
  function createModule5_CrisisAlerts() {
    const card = document.createElement('div');
    card.className = 'sma-card';

    card.innerHTML = `
      <div class="sma-card__header">
        <h3 class="sma-card__title">
          <span class="material-symbols-outlined" style="color:var(--accent-rose);">warning</span>
          MODULE 5: Crisis Alert System & Risk Monitor
        </h3>
        <div class="sma-card__actions">
          <button class="sma-btn" id="sma-export-m5">
            <span class="material-symbols-outlined" style="font-size:14px;">download</span> CSV
          </button>
        </div>
      </div>

      <div class="sma-grid-2">
        <!-- 1. Active Crisis Alerts List -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Active Crisis Notifications</h4>
          <div class="sma-alert-list">
            ${state.data.alerts.map(a => `
              <div class="sma-alert-item sma-alert-item--${a.severity}">
                <span class="material-symbols-outlined" style="font-size:18px;">error</span>
                <div style="flex:1;">
                  <div style="font-weight:700; text-transform:uppercase; font-size:11px;">${a.severity} SEVERITY - ${a.type}</div>
                  <div>${a.message}</div>
                  <div style="font-size:10px; opacity:0.8; margin-top:2px;">${new Date(a.timestamp).toLocaleString()}</div>
                </div>
                <button class="sma-alert-close" data-id="${a.id}">&times;</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 2. Risk Keyword Tracker & Threshold Meters -->
        <div style="background:rgba(2, 6, 23, 0.5); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.06);">
          <h4 style="font-size:12px; color:var(--text-muted); margin:0 0 10px 0; text-transform:uppercase;">Risk Keyword Threshold Tracker</h4>
          <div class="sma-risk-tracker">
            ${state.data.riskKeywords.map(r => {
      const pct = Math.min(100, Math.round((r.count / r.threshold) * 100));
      const color = r.level === 'critical' ? 'var(--accent-rose)' : (r.level === 'high' ? 'var(--accent-amber)' : 'var(--primary-color)');
      return `
                <div class="sma-emotion-item">
                  <div class="sma-emotion-info">
                    <span class="sma-emotion-name">${r.keyword}</span>
                    <span class="sma-emotion-pct" style="color:${color};">${r.count} / ${r.threshold} limit (${pct}%)</span>
                  </div>
                  <div class="sma-progress-track">
                    <div class="sma-progress-bar" style="width:${pct}%; background:${color};"></div>
                  </div>
                </div>
              `;
    }).join('')}
          </div>
        </div>
      </div>
    `;

    setTimeout(() => {
      card.querySelectorAll('.sma-alert-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.currentTarget.dataset.id, 10);
          state.data.alerts = state.data.alerts.filter(a => a.id !== id);
          checkCrisisAlertBanner();
          renderAllModules();
        });
      });

      const exportBtn = card.querySelector('#sma-export-m5');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => {
          const rows = [["ID", "Type", "Severity", "Message", "Timestamp"]];
          state.data.alerts.forEach(a => rows.push([a.id, a.type, a.severity, a.message, a.timestamp]));
          exportCSV('crisis_alerts_export.csv', rows);
        });
      }
    }, 0);

    return card;
  }

  // ==========================================================================
  // LEFT DASHBOARD: 5 CORE WORKING INTELLIGENCE FEATURES
  // 1. Real-Time Sentiment Analysis
  // 2. Fake News & Misinformation Detection
  // 3. Crisis Management & Early Warning Alerts
  // 4. Predictive Engagement & Viral Forecasting
  // 5. Cross-Platform Correlation
  // ==========================================================================

  const leftConsoleState = {
    activeFeature: 'sentiment', // 'sentiment', 'fakenews', 'crisis', 'viral', 'cross'
    threatLevel: 42, // 0 - 100
    crisisSimulated: false,
    liveSentimentShift: {
      posShift: '+14.6%',
      negShift: '-4.2%',
      neuShift: '-10.4%',
      dominant: 'Positive Momentum',
      velocity: '2,840 posts/min'
    },
    liveStreamFeed: [
      { id: 'p1', platform: 'X', author: '@tech_radar', text: 'Quantum computing milestone confirmed by European Labs! Massive throughput gain.', sentiment: 'positive', score: 0.92, time: '10s ago' },
      { id: 'p2', platform: 'Reddit', author: 'u/datacenter_eng', text: 'Power grid stability is holding up despite unprecedented network traffic spike.', sentiment: 'neutral', score: 0.12, time: '28s ago' },
      { id: 'p3', platform: 'Telegram', author: 'CryptoAlerts_Anon', text: 'URGENT: Cloud node latency jumping in western region. Possible DDoS attack underway?', sentiment: 'negative', score: -0.74, time: '45s ago' }
    ],
    selectedNarrative: 'ai_safety',
    viralPrediction: {
      keyword: '#AI2024',
      probability: 93.4,
      rScore: 2.86,
      peakHour: 'In 3.6 hours (~18,400 mentions/hr)',
      curvePoints: [15, 28, 48, 86, 160, 240, 210, 175, 130, 95]
    }
  };

  function injectLeftDashboard() {
    if (document.getElementById('sma-left-console')) return;

    // Left Intelligence Console Drawer
    const consoleDrawer = document.createElement('aside');
    consoleDrawer.id = 'sma-left-console';
    consoleDrawer.className = 'sma-left-console';
    consoleDrawer.innerHTML = `
      <!-- Console Header -->
      <div class="sma-left-console__header">
        <h3 class="sma-left-console__title">
          <span class="material-symbols-outlined" style="color:var(--primary-color);">neurology</span>
          Left Social Intelligence Console
        </h3>
        <button class="sma-btn" id="sma-close-left-console" style="padding:4px 8px;">
          <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
      </div>

      <!-- Left Console Navigation Tabs for the 5 Features -->
      <nav class="sma-left-nav">
        <button class="sma-left-nav-btn is-active" data-feat="sentiment">
          <span class="material-symbols-outlined" style="font-size:14px;">dynamic_feed</span> Live Sentiment
        </button>
        <button class="sma-left-nav-btn" data-feat="fakenews">
          <span class="material-symbols-outlined" style="font-size:14px;">verified</span> Fake News NLP
        </button>
        <button class="sma-left-nav-btn" data-feat="crisis">
          <span class="material-symbols-outlined" style="font-size:14px;">emergency</span> Crisis Early Warning
        </button>
        <button class="sma-left-nav-btn" data-feat="viral">
          <span class="material-symbols-outlined" style="font-size:14px;">trending_up</span> Viral Forecast
        </button>
        <button class="sma-left-nav-btn" data-feat="cross">
          <span class="material-symbols-outlined" style="font-size:14px;">hub</span> Cross-Platform
        </button>
      </nav>

      <!-- Content Body Area -->
      <div class="sma-left-body sma-scrollable" id="sma-left-body">
        <!-- Feature view is rendered here -->
      </div>
    `;
    document.body.appendChild(consoleDrawer);

    // Wire Close
    document.getElementById('sma-close-left-console').addEventListener('click', () => {
      consoleDrawer.classList.remove('is-open');
    });

    // Wire Tabs
    consoleDrawer.querySelectorAll('.sma-left-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        consoleDrawer.querySelectorAll('.sma-left-nav-btn').forEach(b => b.classList.remove('is-active'));
        e.currentTarget.classList.add('is-active');
        leftConsoleState.activeFeature = e.currentTarget.dataset.feat;
        renderLeftFeature();
      });
    });

    // Hook into existing Left Sidebar Navigation (<nav>) in index.html & stream.html
    wireLeftSidebarHooks();

    // Start background stream feeder for live sentiment shifts
    startLiveStreamFeeder();
  }

  function openLeftFeature(featKey) {
    const consoleDrawer = document.getElementById('sma-left-console');
    if (!consoleDrawer) return;
    leftConsoleState.activeFeature = featKey;
    consoleDrawer.querySelectorAll('.sma-left-nav-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.feat === featKey);
    });
    consoleDrawer.classList.add('is-open');
    renderLeftFeature();
  }

  function wireLeftSidebarHooks() {
    // Ensure all Sentiment navigation links go directly to sentiment.html
    document.querySelectorAll('nav a, aside a, .glass-panel a').forEach(a => {
      const text = (a.textContent || '').trim().toLowerCase();
      if (text.includes('sentiment')) {
        a.href = 'sentiment.html';
      }
    });

    // Connect the Social Analytics link in the sidebar between Live Intelligence and Sentiment
    const sidebarSocialLink = document.getElementById('sidebar-social-analytics-link');
    if (sidebarSocialLink) {
      sidebarSocialLink.addEventListener('click', (e) => {
        const suite = document.getElementById('direct-intelligence-suite');
        if (suite) {
          e.preventDefault();
          suite.scrollIntoView({ behavior: 'smooth', block: 'start' });
          suite.classList.add('pulse-border');
          setTimeout(() => suite.classList.remove('pulse-border'), 2500);
        }
      });
    }
  }

  function startLiveStreamFeeder() {
    setInterval(() => {
      const platforms = ['X', 'Reddit', 'Instagram', 'Telegram', 'YouTube'];
      const sentiments = ['positive', 'negative', 'neutral'];
      const topics = [
        { text: "Server cluster scaling automatically under load spike.", sent: 'positive', score: 0.88 },
        { text: "Unverified rumor circulating about API authentication rate limiting.", sent: 'negative', score: -0.65 },
        { text: "New benchmark results shared across tech community.", sent: 'positive', score: 0.79 },
        { text: "Minor regional latency observed on secondary telemetry edge.", sent: 'neutral', score: 0.05 },
        { text: "Disinformation bot swarm detected attempting hashtag hijack.", sent: 'negative', score: -0.84 }
      ];

      const sample = topics[Math.floor(Math.random() * topics.length)];
      const newPost = {
        id: 'p_' + Date.now(),
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        author: '@user_' + Math.floor(Math.random() * 899 + 100),
        text: sample.text,
        sentiment: sample.sent,
        score: sample.score,
        time: 'Just now'
      };

      leftConsoleState.liveStreamFeed.unshift(newPost);
      if (leftConsoleState.liveStreamFeed.length > 8) leftConsoleState.liveStreamFeed.pop();

      // Recalculate sentiment velocity shift
      const posCount = leftConsoleState.liveStreamFeed.filter(p => p.sentiment === 'positive').length;
      const negCount = leftConsoleState.liveStreamFeed.filter(p => p.sentiment === 'negative').length;
      const shiftDelta = Math.round(((posCount - negCount) / leftConsoleState.liveStreamFeed.length) * 100);

      leftConsoleState.liveSentimentShift.posShift = (shiftDelta >= 0 ? '+' : '') + shiftDelta + '%';
      leftConsoleState.liveSentimentShift.velocity = (2800 + Math.floor(Math.random() * 300)) + ' posts/min';

      const drawer = document.getElementById('sma-left-console');
      if (drawer && drawer.classList.contains('is-open') && leftConsoleState.activeFeature === 'sentiment') {
        renderLeftFeature();
      }
    }, 4000);
  }

  function renderLeftFeature() {
    const container = document.getElementById('sma-left-body');
    if (!container) return;
    container.innerHTML = '';

    switch (leftConsoleState.activeFeature) {
      case 'sentiment':
        renderFeature1_Sentiment(container);
        break;
      case 'fakenews':
        renderFeature2_FakeNewsNLP(container);
        break;
      case 'crisis':
        renderFeature3_CrisisAlerts(container);
        break;
      case 'viral':
        renderFeature4_ViralForecast(container);
        break;
      case 'cross':
        renderFeature5_CrossPlatform(container);
        break;
      default:
        renderFeature1_Sentiment(container);
    }
  }

  // --------------------------------------------------------------------------
  // FEATURE 1: REAL-TIME SENTIMENT ANALYSIS
  // --------------------------------------------------------------------------
  function renderFeature1_Sentiment(container) {
    const shift = leftConsoleState.liveSentimentShift;
    const feed = leftConsoleState.liveStreamFeed;

    container.innerHTML = `
      <div>
        <h4 style="font-size:14px; font-weight:800; color:#fff; margin:0 0 4px 0; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-outlined" style="color:var(--accent-emerald); font-size:18px;">dynamic_feed</span>
          Live Stream Sentiment Analysis
        </h4>
        <p style="font-size:11px; color:var(--text-muted); margin:0 0 14px 0;">
          Processing live streams of posts & comments across 5 networks to detect instantaneous sentiment shifts.
        </p>
      </div>

      <!-- Live Shift Indicator Bar -->
      <div class="sma-shift-indicator">
        <div>
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Real-Time Sentiment Shift</div>
          <div style="font-size:18px; font-weight:800; color:${shift.posShift.startsWith('+') ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
            ${shift.posShift}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Ingestion Velocity</div>
          <div style="font-size:13px; font-weight:700; color:var(--primary-color);">${shift.velocity}</div>
        </div>
      </div>

      <!-- Sentiment Polarity Shift Breakdown -->
      <div style="background:rgba(2, 6, 23, 0.6); padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:11px; font-weight:700; color:#fff; margin-bottom:8px;">Live Polarity Balance</div>
        <div style="display:flex; height:12px; border-radius:9999px; overflow:hidden; gap:2px;">
          <div style="flex:65; background:var(--accent-emerald);" title="Positive (65%)"></div>
          <div style="flex:20; background:var(--text-muted);" title="Neutral (20%)"></div>
          <div style="flex:15; background:var(--accent-rose);" title="Negative (15%)"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:6px;">
          <span style="color:var(--accent-emerald);">● Positive (65%)</span>
          <span>● Neutral (20%)</span>
          <span style="color:var(--accent-rose);">● Negative (15%)</span>
        </div>
      </div>

      <!-- Live Ticker Feed of Processed Items -->
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase;">Live Feed Stream (Streaming Now)</span>
          <span class="sma-shift-tag sma-shift-tag--pos">
            <span class="material-symbols-outlined" style="font-size:12px;">fiber_manual_record</span> LIVE
          </span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${feed.map(item => `
            <div style="padding:10px; border-radius:8px; background:rgba(15, 23, 42, 0.85); border:1px solid rgba(255,255,255,0.06);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <span style="font-size:11px; font-weight:700; color:var(--primary-color);">${item.platform} • ${item.author}</span>
                <span class="sma-shift-tag ${item.sentiment === 'positive' ? 'sma-shift-tag--pos' : (item.sentiment === 'negative' ? 'sma-shift-tag--neg' : '')}">
                  ${item.sentiment.toUpperCase()} (${(item.score * 100).toFixed(0)}%)
                </span>
              </div>
              <p style="font-size:11px; color:var(--text-color); margin:0; line-height:1.4;">${item.text}</p>
              <div style="font-size:9px; color:var(--text-muted); margin-top:4px;">${item.time}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // FEATURE 2: FAKE NEWS & MISINFORMATION DETECTION
  // --------------------------------------------------------------------------
  function renderFeature2_FakeNewsNLP(container) {
    container.innerHTML = `
      <div>
        <h4 style="font-size:14px; font-weight:800; color:#fff; margin:0 0 4px 0; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-outlined" style="color:var(--primary-color); font-size:18px;">verified</span>
          NLP Misinformation & Fake News Classifier
        </h4>
        <p style="font-size:11px; color:var(--text-muted); margin:0 0 14px 0;">
          Source credibility verification, coordinated bot behavior analysis, and neural syntactic manipulation detection.
        </p>
      </div>

      <!-- Interactive Claim Testing Form -->
      <div class="sma-nlp-form">
        <label style="font-size:11px; font-weight:700; color:var(--text-color);">Enter Headline or Claim to Test Live:</label>
        <textarea id="sma-nlp-input-text" class="sma-nlp-input" placeholder="Type or paste any post or headline to run NLP credibility analysis...">BREAKING: Artificial intelligence model gains self-awareness and triggers sudden server blackout!</textarea>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button class="sma-btn" style="font-size:10px; padding:4px 8px;" id="sma-preset-1">Sample: Sensational Hoax</button>
          <button class="sma-btn" style="font-size:10px; padding:4px 8px;" id="sma-preset-2">Sample: Verified Report</button>
          <button class="sma-btn" style="font-size:10px; padding:4px 8px;" id="sma-preset-3">Sample: Bot Swarm</button>
        </div>

        <button class="sma-btn sma-btn--primary" id="sma-run-nlp-btn" style="justify-content:center; padding:9px;">
          <span class="material-symbols-outlined" style="font-size:16px;">psychology</span>
          Execute NLP Credibility Classifier
        </button>
      </div>

      <!-- Live Classifier Results Box -->
      <div id="sma-nlp-results-area">
        <!-- Results rendered dynamically on execution -->
      </div>
    `;

    // Presets
    container.querySelector('#sma-preset-1').onclick = () => {
      container.querySelector('#sma-nlp-input-text').value = "BREAKING: Artificial intelligence model gains self-awareness and triggers sudden server blackout!";
      executeNLPTest();
    };
    container.querySelector('#sma-preset-2').onclick = () => {
      container.querySelector('#sma-nlp-input-text').value = "Official Audit: National Cyber Security Agency publishes verified quarterly threat mitigation report.";
      executeNLPTest();
    };
    container.querySelector('#sma-preset-3').onclick = () => {
      container.querySelector('#sma-nlp-input-text').value = "URGENT RETWEET: New government regulation completely bans open source code starting tomorrow!!";
      executeNLPTest();
    };

    container.querySelector('#sma-run-nlp-btn').onclick = executeNLPTest;

    // Run initial test
    executeNLPTest();

    function executeNLPTest() {
      const text = (container.querySelector('#sma-nlp-input-text').value || '').trim();
      const resultsArea = container.querySelector('#sma-nlp-results-area');
      if (!resultsArea) return;

      // Realistic NLP heuristic calculation
      const hasUrgency = /breaking|urgent|banned|shocking|secret|leaked/i.test(text);
      const hasExclamation = (text.match(/!/g) || []).length > 1;
      const isOfficial = /official|verified|report|agency|published|consortium/i.test(text);

      let credibility = isOfficial ? 94 : (hasUrgency && hasExclamation ? 16 : 48);
      let botRisk = isOfficial ? 6 : (hasUrgency ? 88 : 42);
      let verdict = credibility >= 80 ? 'VERIFIED HIGH CREDIBILITY' : (credibility <= 30 ? 'FLAGGED: HIGH MISINFORMATION RISK' : 'UNVERIFIED / SUSPICIOUS CLAIM');
      let verdictColor = credibility >= 80 ? 'var(--accent-emerald)' : (credibility <= 30 ? 'var(--accent-rose)' : 'var(--accent-amber)');

      resultsArea.innerHTML = `
        <div class="sma-nlp-result-card" style="border-color:${verdictColor};">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:800; color:${verdictColor};">${verdict}</span>
            <span style="font-size:11px; font-weight:700; color:#fff;">NLP Confidence: 96.2%</span>
          </div>

          <div class="sma-credibility-gauge">
            <div>
              <div style="font-size:10px; color:var(--text-muted);">Source Credibility Score</div>
              <div style="font-size:20px; font-weight:800; color:${verdictColor};">${credibility}/100</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px; color:var(--text-muted);">Coordinated Bot Risk</div>
              <div style="font-size:20px; font-weight:800; color:${botRisk > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">${botRisk}%</div>
            </div>
          </div>

          <!-- Linguistic Marker Flags -->
          <div style="font-size:11px;">
            <div style="font-weight:700; color:var(--text-muted); margin-bottom:6px;">Linguistic & Network Marker Analysis:</div>
            <div style="display:flex; flex-direction:column; gap:4px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="material-symbols-outlined" style="font-size:14px; color:${hasUrgency ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                  ${hasUrgency ? 'warning' : 'check_circle'}
                </span>
                <span>Urgency & Sensationalist Bias: <strong>${hasUrgency ? 'High Frequency Detected' : 'Minimal / Factual Phrasing'}</strong></span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="material-symbols-outlined" style="font-size:14px; color:${botRisk > 50 ? 'var(--accent-rose)' : 'var(--accent-emerald)'};">
                  ${botRisk > 50 ? 'smart_toy' : 'person'}
                </span>
                <span>Coordinated Bot Amplification Signature: <strong>${botRisk > 50 ? 'Swarm Re-post Clones Detected' : 'Organic Human Distribution'}</strong></span>
              </div>
              <div style="display:flex; align-items:center; gap:6px;">
                <span class="material-symbols-outlined" style="font-size:14px; color:${isOfficial ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">
                  domain
                </span>
                <span>Source Authority Cross-Check: <strong>${isOfficial ? 'Whitelisted Accredited Source' : 'Unindexed / Low Authority Domain'}</strong></span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // FEATURE 3: CRISIS MANAGEMENT & EARLY WARNING ALERTS
  // --------------------------------------------------------------------------
  function renderFeature3_CrisisAlerts(container) {
    const threatLevel = leftConsoleState.threatLevel;
    const isCritical = threatLevel >= 75;
    const levelName = isCritical ? 'CRITICAL CRISIS (Level 4)' : (threatLevel >= 50 ? 'ELEVATED PR RISK (Level 3)' : 'GUARDED / NORMAL (Level 1)');
    const levelColor = isCritical ? 'var(--accent-rose)' : (threatLevel >= 50 ? 'var(--accent-amber)' : 'var(--accent-emerald)');

    container.innerHTML = `
      <div>
        <h4 style="font-size:14px; font-weight:800; color:#fff; margin:0 0 4px 0; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-outlined" style="color:var(--accent-rose); font-size:18px;">emergency</span>
          Crisis Management & Early Warning System
        </h4>
        <p style="font-size:11px; color:var(--text-muted); margin:0 0 14px 0;">
          Continuous monitoring for negative sentiment spikes, risk keyword velocity surges, and public relations emergencies.
        </p>
      </div>

      <!-- Threat Level Bar -->
      <div class="sma-crisis-status-box">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:11px; font-weight:800; color:${levelColor};">${levelName}</span>
          <span style="font-size:14px; font-weight:800; color:#fff;">${threatLevel}% Threat Index</span>
        </div>

        <div class="sma-threat-bar">
          <div class="sma-threat-fill" style="width:${threatLevel}%; background:${levelColor};"></div>
        </div>

        <div style="font-size:10px; color:var(--text-muted); display:flex; justify-content:space-between;">
          <span>0% Normal</span>
          <span>50% Elevated</span>
          <span>100% Critical Emergency</span>
        </div>
      </div>

      <!-- Interactive Trigger Actions -->
      <div style="display:flex; gap:10px;">
        <button class="sma-btn sma-btn--danger" style="flex:1; justify-content:center; padding:9px;" id="sma-trigger-crisis-btn">
          <span class="material-symbols-outlined" style="font-size:16px;">crisis_alert</span>
          Simulate Crisis Spike (+320%)
        </button>
        <button class="sma-btn" style="flex:1; justify-content:center; padding:9px;" id="sma-mitigate-btn">
          <span class="material-symbols-outlined" style="font-size:16px;">shield</span>
          Activate Rapid Mitigation
        </button>
      </div>

      <!-- Risk Keywords Real-Time Surge Monitor -->
      <div style="background:rgba(2, 6, 23, 0.6); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
        <div style="font-size:11px; font-weight:800; color:#fff; margin-bottom:10px;">Surging Risk Keywords Watchlist:</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span>#boycott</span>
            <span style="color:var(--accent-rose); font-weight:700;">+480/hr (Surge limit reached)</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span>databreach</span>
            <span style="color:var(--accent-amber); font-weight:700;">+210/hr (Elevated)</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span>outage failure</span>
            <span style="color:var(--accent-emerald); font-weight:700;">+45/hr (Normal)</span>
          </div>
        </div>
      </div>

      <!-- Automated Alert Action Log -->
      <div style="background:rgba(15, 23, 42, 0.8); padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.06); font-size:11px;">
        <div style="font-weight:700; color:var(--text-muted); margin-bottom:6px;">Automated Protocol Status:</div>
        <div style="color:${isCritical ? '#fca5a5' : 'var(--text-color)'};">
          ${isCritical ? '⚠️ Automatic stakeholder alerts dispatched. Escalation Level 4 active. Response team notified.' : '✓ Incident response standby. Threshold monitors active across all channels.'}
        </div>
      </div>
    `;

    // Wire simulation buttons
    container.querySelector('#sma-trigger-crisis-btn').onclick = () => {
      leftConsoleState.threatLevel = 94;
      state.data.alerts.unshift({
        id: Date.now(),
        type: "crisis_spike",
        severity: "critical",
        message: "CRITICAL PR EMERGENCY: Coordinated boycott & hostile sentiment surge (+340%) detected!",
        timestamp: new Date().toISOString(),
        active: true
      });
      checkCrisisAlertBanner();
      renderFeature3_CrisisAlerts(container);
    };

    container.querySelector('#sma-mitigate-btn').onclick = () => {
      leftConsoleState.threatLevel = 26;
      const banner = document.getElementById('sma-crisis-banner');
      if (banner) banner.classList.remove('is-visible');
      renderFeature3_CrisisAlerts(container);
    };
  }

  // --------------------------------------------------------------------------
  // FEATURE 4: PREDICTIVE ENGAGEMENT & VIRAL FORECASTING
  // --------------------------------------------------------------------------
  function renderFeature4_ViralForecast(container) {
    const vp = leftConsoleState.viralPrediction;

    container.innerHTML = `
      <div>
        <h4 style="font-size:14px; font-weight:800; color:#fff; margin:0 0 4px 0; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-outlined" style="color:var(--accent-emerald); font-size:18px;">trending_up</span>
          Predictive Engagement & Viral Forecasting
        </h4>
        <p style="font-size:11px; color:var(--text-muted); margin:0 0 14px 0;">
          Time-series regression & virality probability model forecasting sudden mass traction before peak trajectory.
        </p>
      </div>

      <!-- Viral Predictor Sandbox Form -->
      <div class="sma-viral-sandbox">
        <label style="font-size:11px; font-weight:700; color:var(--text-color);">Enter Topic, Post, or Hashtag to Forecast:</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="sma-viral-input" class="sma-select" style="flex:1; padding:8px 12px;" value="${vp.keyword}" />
          <button class="sma-btn sma-btn--primary" id="sma-calc-viral-btn" style="white-space:nowrap;">
            Calculate Forecast
          </button>
        </div>

        <div style="display:flex; gap:6px;">
          <button class="sma-btn" style="font-size:10px; padding:3px 8px;" id="sma-vp-1">#AI2024</button>
          <button class="sma-btn" style="font-size:10px; padding:3px 8px;" id="sma-vp-2">#CyberDefense</button>
          <button class="sma-btn" style="font-size:10px; padding:3px 8px;" id="sma-vp-3">#TechLaunch</button>
        </div>
      </div>

      <!-- Forecast Metrics Card -->
      <div style="background:rgba(15, 23, 42, 0.95); border:1px solid var(--primary-color); border-radius:12px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Viral Probability (Mass Traction)</div>
            <div style="font-size:24px; font-weight:800; color:var(--accent-emerald);">${vp.probability}%</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase;">Virality Coefficient (R-Score)</div>
            <div style="font-size:24px; font-weight:800; color:var(--primary-color);">R = ${vp.rScore}</div>
          </div>
        </div>

        <div style="font-size:11px; color:#fff; margin-bottom:10px;">
          <strong>Estimated Peak Trajectory:</strong> ${vp.peakHour}
        </div>

        <!-- 24-Hour Predictive Trajectory Curve (SVG) -->
        <div style="font-size:10px; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase;">
          24-Hour Projected Engagement Velocity Curve:
        </div>
        <div class="sma-trajectory-svg" id="sma-trajectory-svg-wrap">
          <svg width="100%" height="100%" viewBox="0 0 300 130">
            <defs>
              <linearGradient id="sma-viral-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--primary-color)" stop-opacity="0.4"/>
                <stop offset="100%" stop-color="var(--primary-color)" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <path d="M 10,115 Q 80,110 140,50 T 200,25 T 280,85 L 280,120 L 10,120 Z" fill="url(#sma-viral-grad)" />
            <path d="M 10,115 Q 80,110 140,50 T 200,25 T 280,85" fill="none" stroke="var(--primary-color)" stroke-width="3" />
            <circle cx="200" cy="25" r="5" fill="var(--accent-emerald)" stroke="#fff" stroke-width="2" />
            <text x="200" y="15" fill="#fff" font-size="9" font-weight="700" text-anchor="middle">PEAK: 18.4K/hr</text>
            <line x1="10" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.15)" />
          </svg>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:9px; color:var(--text-muted); margin-top:4px;">
          <span>T+0h (Now)</span>
          <span>T+4h (Predicted Peak)</span>
          <span>T+12h (Saturation)</span>
          <span>T+24h</span>
        </div>
      </div>
    `;

    container.querySelector('#sma-vp-1').onclick = () => runViralCalc('#AI2024');
    container.querySelector('#sma-vp-2').onclick = () => runViralCalc('#CyberDefense');
    container.querySelector('#sma-vp-3').onclick = () => runViralCalc('#TechLaunch');
    container.querySelector('#sma-calc-viral-btn').onclick = () => {
      runViralCalc(container.querySelector('#sma-viral-input').value);
    };

    function runViralCalc(kw) {
      const prob = (85 + Math.random() * 12).toFixed(1);
      const r = (2.2 + Math.random() * 1.5).toFixed(2);
      leftConsoleState.viralPrediction = {
        keyword: kw,
        probability: parseFloat(prob),
        rScore: parseFloat(r),
        peakHour: `In ${(3 + Math.random() * 3).toFixed(1)} hours (~${Math.floor(15000 + Math.random() * 12000).toLocaleString()} mentions/hr)`
      };
      renderFeature4_ViralForecast(container);
    }
  }

  // --------------------------------------------------------------------------
  // FEATURE 5: CROSS-PLATFORM CORRELATION
  // --------------------------------------------------------------------------
  function renderFeature5_CrossPlatform(container) {
    container.innerHTML = `
      <div>
        <h4 style="font-size:14px; font-weight:800; color:#fff; margin:0 0 4px 0; display:flex; align-items:center; gap:6px;">
          <span class="material-symbols-outlined" style="color:var(--secondary-color); font-size:18px;">hub</span>
          Cross-Platform Narrative Correlation
        </h4>
        <p style="font-size:11px; color:var(--text-muted); margin:0 0 14px 0;">
          Multi-network unified data pipeline mapping narrative migration and thread jumping across platforms.
        </p>
      </div>

      <!-- Narrative Thread Flow Path -->
      <div>
        <div style="font-size:11px; font-weight:800; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">
          Active Narrative Migration Trail:
        </div>
        <div class="sma-thread-flow">
          <div class="sma-thread-step">
            <span style="font-size:10px; font-weight:800; color:var(--primary-color); background:rgba(6,182,212,0.2); padding:2px 6px; border-radius:4px;">1. ORIGIN</span>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:11px; color:#fff;">X (Twitter) • T+0 min</div>
              <div style="font-size:10px; color:var(--text-muted);">Initial breaking post published by industry influencer</div>
            </div>
            <span style="font-size:11px; color:var(--accent-emerald); font-weight:700;">100% Core</span>
          </div>

          <div style="text-align:center; color:var(--text-muted); font-size:12px; line-height:1;">↓ (+18 min lag time)</div>

          <div class="sma-thread-step">
            <span style="font-size:10px; font-weight:800; color:var(--accent-violet); background:rgba(139,92,246,0.2); padding:2px 6px; border-radius:4px;">2. DEBATE</span>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:11px; color:#fff;">Reddit • T+18 min</div>
              <div style="font-size:10px; color:var(--text-muted);">Deep thread discussion, meme creation, and sentiment divergence</div>
            </div>
            <span style="font-size:11px; color:var(--primary-color); font-weight:700;">r = 0.88</span>
          </div>

          <div style="text-align:center; color:var(--text-muted); font-size:12px; line-height:1;">↓ (+24 min lag time)</div>

          <div class="sma-thread-step">
            <span style="font-size:10px; font-weight:800; color:var(--accent-amber); background:rgba(245,158,11,0.2); padding:2px 6px; border-radius:4px;">3. AMPLIFY</span>
            <div style="flex:1;">
              <div style="font-weight:700; font-size:11px; color:#fff;">Telegram & Instagram • T+42 min</div>
              <div style="font-size:10px; color:var(--text-muted);">Broadcast channel forwards and short-form video commentary</div>
            </div>
            <span style="font-size:11px; color:var(--accent-emerald); font-weight:700;">r = 0.82</span>
          </div>
        </div>
      </div>

      <!-- Cross-Platform Correlation Coefficient Matrix -->
      <div style="background:rgba(2, 6, 23, 0.6); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); margin-top:8px;">
        <div style="font-size:11px; font-weight:800; color:#fff; margin-bottom:8px;">Platform Correlation Matrix (Pearson r):</div>
        <table class="sma-cross-matrix">
          <thead>
            <tr>
              <th>Platform</th>
              <th>X</th>
              <th>Reddit</th>
              <th>Telegram</th>
              <th>Instagram</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight:700; color:var(--primary-color);">X</td>
              <td>1.00</td>
              <td style="color:var(--accent-emerald); font-weight:700;">0.88</td>
              <td style="color:var(--accent-emerald); font-weight:700;">0.81</td>
              <td>0.68</td>
            </tr>
            <tr>
              <td style="font-weight:700; color:var(--accent-violet);">Reddit</td>
              <td style="color:var(--accent-emerald); font-weight:700;">0.88</td>
              <td>1.00</td>
              <td style="color:var(--accent-emerald); font-weight:700;">0.79</td>
              <td>0.74</td>
            </tr>
            <tr>
              <td style="font-weight:700; color:var(--accent-amber);">Telegram</td>
              <td style="color:var(--accent-emerald); font-weight:700;">0.81</td>
              <td style="color:var(--accent-emerald); font-weight:700;">0.79</td>
              <td>1.00</td>
              <td>0.62</td>
            </tr>
            <tr>
              <td style="font-weight:700; color:#f472b6;">Instagram</td>
              <td>0.68</td>
              <td>0.74</td>
              <td>0.62</td>
              <td>1.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }

  // ==========================================================================
  // DIRECT ON-DASHBOARD INTELLIGENCE ENGINES (NO SUBSECTIONS)
  // ==========================================================================
  function initDirectDashboardEngines() {
    const suiteEl = document.getElementById('direct-intelligence-suite');
    if (!suiteEl) return;

    // ------------------------------------------------------------------------
    // ENGINE 1: Real-Time Sentiment Analysis Engine
    // ------------------------------------------------------------------------
    const feedList = document.getElementById('direct-sent-feed-list');
    const shiftEl = document.getElementById('direct-sent-shift');
    const velocityEl = document.getElementById('direct-sent-velocity');
    const emotionEl = document.getElementById('direct-sent-emotion');
    const barPos = document.getElementById('direct-bar-pos');
    const barNeu = document.getElementById('direct-bar-neu');
    const barNeg = document.getElementById('direct-bar-neg');

    let initialDirectPosts = [
      { author: "@kavita_tech", platform: "X", text: "Nexora's autonomous stream classification is lightning fast! Zero dropped frames.", emotion: "Joy", score: "+0.92", time: "Just now", type: "pos" },
      { author: "r/MachineLearning", platform: "Reddit", text: "Evaluating the latency benchmarks for the new model cluster. Scaled nicely.", emotion: "Supportive", score: "+0.78", time: "14s ago", type: "pos" },
      { author: "@crypto_sentinel", platform: "Telegram", text: "Unusual bot swarm patterns spotted in channel broadcast #AlphaLeak.", emotion: "Anxiety", score: "-0.45", time: "32s ago", type: "neg" },
      { author: "@ai_curator", platform: "Instagram", text: "New cyber analytics interface looks incredible with glassmorphic telemetry!", emotion: "Excitement", score: "+0.89", time: "48s ago", type: "pos" },
      { author: "YT/@DataStream", platform: "YouTube", text: "Live sentiment streaming comparison between legacy monitoring vs real-time NLP.", emotion: "Neutral", score: "+0.08", time: "1m ago", type: "neu" }
    ];

    function renderDirectFeedItem(item) {
      const typeBg = item.type === 'pos'
        ? 'bg-sentiment-emerald/10 border-sentiment-emerald/30 text-sentiment-emerald'
        : item.type === 'neg'
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : 'bg-white/10 border-white/20 text-slate-300';

      const scoreColor = item.type === 'pos' ? 'text-sentiment-emerald' : item.type === 'neg' ? 'text-red-400' : 'text-slate-400';

      return `
        <div class="p-2.5 rounded-lg bg-black/40 border border-white/5 hover:border-primary/40 transition-all flex items-start gap-2.5">
          <div class="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            ${item.platform[0]}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <div class="flex items-center gap-1.5 truncate">
                <span class="text-xs font-semibold text-white/90">${item.author}</span>
                <span class="text-[9px] text-white/40">via ${item.platform}</span>
              </div>
              <span class="text-[9px] px-1.5 py-0.5 rounded border ${typeBg}">${item.emotion}</span>
            </div>
            <p class="text-[11px] text-white/70 truncate">${item.text}</p>
          </div>
          <span class="text-[11px] font-bold font-data-display ${scoreColor} shrink-0">${item.score}</span>
        </div>
      `;
    }

    if (feedList) {
      feedList.innerHTML = initialDirectPosts.map(renderDirectFeedItem).join('');

      // Auto streaming engine interval
      const pool = [
        { author: "@tech_insider", platform: "X", text: "Massive positive reaction across developer communities for the v3 release!", emotion: "Excitement", score: "+0.95", type: "pos" },
        { author: "r/privacy", platform: "Reddit", text: "Zero telemetry leaks confirmed during network packet capture. Very solid.", emotion: "Supportive", score: "+0.84", type: "pos" },
        { author: "@security_alert", platform: "Telegram", text: "Minor latency anomaly detected on central routing node. Monitoring.", emotion: "Anxiety", score: "-0.22", type: "neg" },
        { author: "@nexus_design", platform: "Instagram", text: "Obsessed with this dark glassmorphism dashboard layout and micro-glows.", emotion: "Joy", score: "+0.91", type: "pos" },
        { author: "YT/@InfraEng", platform: "YouTube", text: "Testing live failover resilience under high throughput loads.", emotion: "Neutral", score: "+0.05", type: "neu" }
      ];

      let poolIdx = 0;
      setInterval(() => {
        const item = { ...pool[poolIdx % pool.length], time: "Just now" };
        poolIdx++;

        const newEl = document.createElement('div');
        newEl.innerHTML = renderDirectFeedItem(item);
        feedList.insertBefore(newEl.firstElementChild, feedList.firstChild);
        if (feedList.children.length > 5) feedList.removeChild(feedList.lastChild);

        // Update shift & velocity metrics
        const newShift = (12 + Math.random() * 5).toFixed(1);
        const newVelocity = Math.floor(2800 + Math.random() * 120);
        if (shiftEl) shiftEl.textContent = `+${newShift}%`;
        if (velocityEl) velocityEl.textContent = `${newVelocity.toLocaleString()}/min`;

        // Update polarity bar slightly
        const posW = Math.floor(66 + Math.random() * 5);
        const negW = Math.floor(10 + Math.random() * 4);
        const neuW = 100 - posW - negW;
        if (barPos) barPos.style.width = `${posW}%`;
        if (barNeu) barNeu.style.width = `${neuW}%`;
        if (barNeg) barNeg.style.width = `${negW}%`;
      }, 4000);
    }

    // ------------------------------------------------------------------------
    // ENGINE 2: Fake News & Misinformation NLP Classifier
    // ------------------------------------------------------------------------
    const nlpInput = document.getElementById('direct-nlp-input');
    const nlpSubmit = document.getElementById('direct-nlp-submit');
    const nlpVerdict = document.getElementById('direct-nlp-verdict');
    const nlpConf = document.getElementById('direct-nlp-conf');
    const nlpCred = document.getElementById('direct-nlp-cred');
    const nlpBot = document.getElementById('direct-nlp-bot');
    const nlpMarkers = document.getElementById('direct-nlp-markers');

    const preset1 = document.getElementById('direct-nlp-preset-1');
    const preset2 = document.getElementById('direct-nlp-preset-2');
    const preset3 = document.getElementById('direct-nlp-preset-3');

    function runDirectNLP(text) {
      if (!text || !text.trim()) return;
      const lower = text.toLowerCase();

      let credScore = 50;
      let botScore = 40;
      let verdict = "UNVERIFIED / SUSPICIOUS CLAIM";
      let verdictColor = "text-amber-400";
      let markers = [];

      const sensationalTerms = ["breaking", "self-awareness", "shuts down", "leak", "urgent", "secret", "ban", "scandal", "halt", "!!", "!"];
      const verifiedTerms = ["cve", "official", "verified", "audit", "patch", "deployed", "reuters", "published", "research"];

      let sensMatches = sensationalTerms.filter(t => lower.includes(t));
      let verMatches = verifiedTerms.filter(t => lower.includes(t));

      if (sensMatches.length >= 2 || text.includes("!")) {
        credScore = Math.max(12, 35 - sensMatches.length * 8);
        botScore = Math.min(94, 65 + sensMatches.length * 9);
        verdict = "FLAGGED: HIGH MISINFORMATION RISK";
        verdictColor = "text-red-400";
        markers.push(`<div class="flex items-center gap-1.5 text-red-400"><span class="material-symbols-outlined text-[13px]">warning</span><span>Sensationalist linguistic markers identified ("${sensMatches.join('", "')}")</span></div>`);
        markers.push(`<div class="flex items-center gap-1.5 text-red-400"><span class="material-symbols-outlined text-[13px]">smart_toy</span><span>High replication velocity matching coordinated bot swarms</span></div>`);
      } else if (verMatches.length > 0) {
        credScore = Math.min(96, 75 + verMatches.length * 10);
        botScore = Math.max(8, 22 - verMatches.length * 6);
        verdict = "VERIFIED: HIGH CREDIBILITY SOURCE";
        verdictColor = "text-sentiment-emerald";
        markers.push(`<div class="flex items-center gap-1.5 text-sentiment-emerald"><span class="material-symbols-outlined text-[13px]">check_circle</span><span>Corroborated by accredited security registries ("${verMatches.join('", "')}")</span></div>`);
        markers.push(`<div class="flex items-center gap-1.5 text-sentiment-emerald"><span class="material-symbols-outlined text-[13px]">verified_user</span><span>Natural organic distribution curve across verified accounts</span></div>`);
      } else {
        credScore = 48;
        botScore = 52;
        verdict = "UNVERIFIED CLAIM (PENDING CITATION)";
        verdictColor = "text-amber-400";
        markers.push(`<div class="flex items-center gap-1.5 text-amber-400"><span class="material-symbols-outlined text-[13px]">info</span><span>Single-source attribution with neutral sentiment markers</span></div>`);
        markers.push(`<div class="flex items-center gap-1.5 text-slate-400"><span class="material-symbols-outlined text-[13px]">query_stats</span><span>Awaiting third-party registry verification</span></div>`);
      }

      if (nlpVerdict) {
        nlpVerdict.textContent = verdict;
        nlpVerdict.className = `text-xs font-bold ${verdictColor}`;
      }
      if (nlpConf) nlpConf.textContent = `Confidence: ${(91 + Math.random() * 7).toFixed(1)}%`;
      if (nlpCred) {
        nlpCred.textContent = `${credScore}/100`;
        nlpCred.className = `text-xl font-bold font-data-display ${credScore > 60 ? 'text-sentiment-emerald' : credScore < 40 ? 'text-red-400' : 'text-amber-400'}`;
      }
      if (nlpBot) {
        nlpBot.textContent = `${botScore}%`;
        nlpBot.className = `text-xl font-bold font-data-display ${botScore > 60 ? 'text-red-400' : 'text-sentiment-emerald'}`;
      }
      if (nlpMarkers) {
        nlpMarkers.innerHTML = markers.join('');
      }
    }

    if (preset1) {
      preset1.addEventListener('click', () => {
        if (nlpInput) nlpInput.value = "BREAKING: Artificial intelligence model gains self-awareness and shuts down European server grid!";
        runDirectNLP(nlpInput ? nlpInput.value : "");
      });
    }

    if (preset2) {
      preset2.addEventListener('click', () => {
        if (nlpInput) nlpInput.value = "Official CVE-2024-8192 security patch verified and deployed across all production clusters.";
        runDirectNLP(nlpInput ? nlpInput.value : "");
      });
    }

    if (preset3) {
      preset3.addEventListener('click', () => {
        if (nlpInput) nlpInput.value = "Urgent leaked audio reveals entire financial system halting transactions tomorrow morning!! Share now!";
        runDirectNLP(nlpInput ? nlpInput.value : "");
      });
    }

    if (nlpSubmit) {
      nlpSubmit.addEventListener('click', () => {
        runDirectNLP(nlpInput ? nlpInput.value : "");
      });
    }

    // ------------------------------------------------------------------------
    // ENGINE 3: Predictive Engagement & Viral Forecasting Engine
    // ------------------------------------------------------------------------
    const viralInput = document.getElementById('direct-viral-input');
    const viralCalcBtn = document.getElementById('direct-viral-calc-btn');
    const viralProb = document.getElementById('direct-viral-prob');
    const viralR = document.getElementById('direct-viral-r');
    const viralPeak = document.getElementById('direct-viral-peak');
    const viralPeakMetric = document.getElementById('direct-viral-peak-metric');
    const viralPathArea = document.getElementById('direct-viral-path-area');
    const viralPathLine = document.getElementById('direct-viral-path-line');

    const tag1 = document.getElementById('direct-viral-tag-1');
    const tag2 = document.getElementById('direct-viral-tag-2');
    const tag3 = document.getElementById('direct-viral-tag-3');

    function calculateDirectViral(kw) {
      if (!kw) kw = "#Trending";
      const prob = (86 + Math.random() * 11).toFixed(1);
      const r = (2.3 + Math.random() * 1.4).toFixed(2);
      const peakHrs = (2.5 + Math.random() * 3.5).toFixed(1);
      const peakMentions = Math.floor(14000 + Math.random() * 11000);

      if (viralProb) viralProb.textContent = `${prob}%`;
      if (viralR) viralR.textContent = `R = ${r}`;
      if (viralPeak) viralPeak.textContent = `In ${peakHrs} Hours`;
      if (viralPeakMetric) viralPeakMetric.textContent = `Est. ${(peakMentions / 1000).toFixed(1)}K mentions/hr`;

      // Animate SVG path
      const peakY = Math.floor(10 + Math.random() * 15);
      const peakX = Math.floor(180 + Math.random() * 30);
      const dLine = `M 10,75 Q 80,70 140,30 T ${peakX},${peakY} T 280,55`;
      const dArea = `M 10,75 Q 80,70 140,30 T ${peakX},${peakY} T 280,55 L 280,78 L 10,78 Z`;

      if (viralPathLine) viralPathLine.setAttribute('d', dLine);
      if (viralPathArea) viralPathArea.setAttribute('d', dArea);
    }

    if (tag1) tag1.addEventListener('click', () => { if (viralInput) viralInput.value = '#AI2024'; calculateDirectViral('#AI2024'); });
    if (tag2) tag2.addEventListener('click', () => { if (viralInput) viralInput.value = '#CyberDefense'; calculateDirectViral('#CyberDefense'); });
    if (tag3) tag3.addEventListener('click', () => { if (viralInput) viralInput.value = '#TechLaunch'; calculateDirectViral('#TechLaunch'); });
    if (viralCalcBtn) viralCalcBtn.addEventListener('click', () => { calculateDirectViral(viralInput ? viralInput.value : ""); });

    // ------------------------------------------------------------------------
    // ENGINE 4: Crisis Management & Early Warning System
    // ------------------------------------------------------------------------
    const crisisBadge = document.getElementById('direct-crisis-badge');
    const crisisThreatLabel = document.getElementById('direct-crisis-threat-label');
    const crisisThreatVal = document.getElementById('direct-crisis-threat-val');
    const crisisThreatBar = document.getElementById('direct-crisis-threat-bar');
    const spikeBtn = document.getElementById('direct-crisis-spike-btn');
    const mitigateBtn = document.getElementById('direct-crisis-mitigate-btn');

    const kwBoycott = document.getElementById('direct-kw-boycott');
    const kwBreach = document.getElementById('direct-kw-breach');
    const kwLawsuit = document.getElementById('direct-kw-lawsuit');
    const kwCrash = document.getElementById('direct-kw-crash');

    if (spikeBtn) {
      spikeBtn.addEventListener('click', () => {
        if (crisisBadge) {
          crisisBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse';
          crisisBadge.textContent = 'Level 4: Critical Emergency';
        }
        if (crisisThreatLabel) {
          crisisThreatLabel.textContent = 'PR Threat Index: EMERGENCY (+320% Negative Spike)';
          crisisThreatLabel.className = 'text-xs font-bold text-red-400';
        }
        if (crisisThreatVal) {
          crisisThreatVal.textContent = '94% Threat';
          crisisThreatVal.className = 'text-xs font-bold font-data-display text-red-400';
        }
        if (crisisThreatBar) {
          crisisThreatBar.style.width = '94%';
          crisisThreatBar.className = 'h-full bg-red-500 transition-all duration-500 rounded-full shadow-[0_0_15px_#ef4444]';
        }

        if (kwBoycott) { kwBoycott.textContent = '+1,840/hr'; kwBoycott.className = 'font-bold text-red-400 font-data-display animate-pulse'; }
        if (kwBreach) { kwBreach.textContent = '+920/hr'; kwBreach.className = 'font-bold text-red-400 font-data-display animate-pulse'; }
        if (kwLawsuit) { kwLawsuit.textContent = '+480/hr'; kwLawsuit.className = 'font-bold text-red-400 font-data-display animate-pulse'; }
        if (kwCrash) { kwCrash.textContent = '+320/hr'; kwCrash.className = 'font-bold text-red-400 font-data-display'; }
      });
    }

    if (mitigateBtn) {
      mitigateBtn.addEventListener('click', () => {
        if (crisisBadge) {
          crisisBadge.className = 'text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-sentiment-emerald/20 text-sentiment-emerald border border-sentiment-emerald/40';
          crisisBadge.textContent = 'Level 1: Normal';
        }
        if (crisisThreatLabel) {
          crisisThreatLabel.textContent = 'PR Threat Index: Normal (Mitigation Applied)';
          crisisThreatLabel.className = 'text-xs font-bold text-white';
        }
        if (crisisThreatVal) {
          crisisThreatVal.textContent = '22% Threat';
          crisisThreatVal.className = 'text-xs font-bold font-data-display text-sentiment-emerald';
        }
        if (crisisThreatBar) {
          crisisThreatBar.style.width = '22%';
          crisisThreatBar.className = 'h-full bg-sentiment-emerald transition-all duration-500 rounded-full';
        }

        if (kwBoycott) { kwBoycott.textContent = '+210/hr'; kwBoycott.className = 'font-bold text-amber-400 font-data-display'; }
        if (kwBreach) { kwBreach.textContent = '+95/hr'; kwBreach.className = 'font-bold text-slate-400 font-data-display'; }
        if (kwLawsuit) { kwLawsuit.textContent = '+62/hr'; kwLawsuit.className = 'font-bold text-slate-400 font-data-display'; }
        if (kwCrash) { kwCrash.textContent = '+18/hr'; kwCrash.className = 'font-bold text-sentiment-emerald font-data-display'; }
      });
    }
  }

  // --- Auto Run on DOM Ready ---
  function initAll() {
    injectAnalyticsSuite();
    injectLeftDashboard();
    initDirectDashboardEngines();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();


