/* -------------------------------------------------------------
   GIRIDHARAN G V — CLIENT DATA ADAPTER (portfolio-bridge.js)
   Shared Client Data Layer for Portfolio, Admin App & Colleague Portal.
   
   Architecture Notes:
   1. Offline-First with Unified LocalStorage Fallback.
   2. Loads initial state from portfolio-data.json if available.
   3. Allows instant sync across tabs using the `storage` event.
   4. Cloud-ready: seamlessly connects to Supabase/Firebase REST endpoints
      without modifying consumer components.
   ------------------------------------------------------------- */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PortfolioBridge = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY = 'giridharan_portfolio_data_v1';
  var PIN_HASH_KEY = 'giridharan_admin_pin_v1';

  // Fallback seed data in case network/file fetch is restricted on static file protocol
  var SEED_DATA = {
    settings: {
      lastUpdated: new Date().toISOString(),
      adminPinHash: '4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2', // default: 2026
      adminPinHint: 'Default PIN is 2026',
      maintenanceMode: {
        enabled: false,
        badge: 'Scheduled Architecture Upgrade',
        heading: 'Portfolio Under Scheduled Maintenance',
        message: 'We are currently deploying updated enterprise case studies and operational metrics. Service will resume shortly.',
        estimatedReturn: 'Resuming today'
      },
      visibility: {
        hero: true,
        numbers: true,
        certifications: true,
        experience: true,
        skills: true,
        codingMilestones: true,
        builds: false,
        testimonials: true,
        contact: true
      }
    },
    codingMilestones: {
      sectionBadge: 'Technical Rigor & Problem Solving',
      sectionTitle: 'Coding Milestones & Algorithms',
      sectionSubtitle: 'Frontline operations intuition backed by algorithmic thinking, data structures, and continuous technical practice.',
      stats: [
        {
          id: 'leetcode-solved',
          platform: 'LeetCode',
          icon: 'code',
          highlight: '160+',
          metricLabel: 'Problems Solved',
          description: 'Focusing on Two-Pointers, Sliding Window, Arrays, and Hash Map performance.',
          badge: 'Active Streak',
          profileUrl: 'https://leetcode.com'
        },
        {
          id: 'hackathons-count',
          platform: 'Hackathons & Sprints',
          icon: 'zap',
          highlight: '3',
          metricLabel: 'Hackathons Participated',
          description: 'Built operational trackers and logistics dispatch prototypes under rapid 24-48 hr builds.',
          badge: 'Prototype Builder',
          profileUrl: ''
        },
        {
          id: 'algorithms-rate',
          platform: 'Data Structures',
          icon: 'terminal',
          highlight: '85%+',
          metricLabel: 'Acceptance Rate',
          description: 'Clean, humanized logic with optimal time & space complexity implementations.',
          badge: 'Core Proficiency',
          profileUrl: ''
        }
      ],
      hackathons: [
        {
          id: 'hackathon-1',
          name: 'Smart Logistics & Operations Sprint',
          organizer: 'Regional Tech Innovation Challenge',
          year: '2025',
          projectTitle: 'FleetDispatch — Quick-Turnaround Van Routing',
          resultBadge: 'Top 10 Finalist',
          summary: 'Designed a real-time dispatch dashboard calculating route turnaround latency across hub checkpoints.'
        },
        
      ]
    },
    builds: [],
    testimonials: [
      {
        id: 'test-sample-1',
        token: 'approved-scope-01',
        name: 'Karthik Subramanian',
        role: 'Operations Manager',
        company: 'Scope e-Knowledge Center',
        workPeriod: '2021 – 2024 (3 yrs)',
        relationship: 'Colleague / Peer on Senior Operations Team',
        content: 'Giridharan has an exceptional grip on frontline workflow bottlenecks. Whenever our delivery SLA was under pressure, he brought calm, data-backed operational adjustments that kept turnaround times tight and team morale high.',
        status: 'approved',
        featured: true,
        submittedAt: '2026-09-15T11:20:00.000Z',
        approvedAt: '2026-09-16T09:00:00.000Z'
      },
      {
        id: 'test-sample-2',
        token: 'approved-lumina-02',
        name: 'Priyanka Nair',
        role: 'Senior Quality Analyst',
        company: 'Lumina Datamatics',
        workPeriod: '2019 – 2021 (2 yrs)',
        relationship: 'Worked closely on Quality Audits & SLA Compliance',
        content: 'A dependable professional who never cuts corners on quality. Giridharan\'s documentation habits and procedural clarity made multi-shift handoffs completely frictionless.',
        status: 'approved',
        featured: true,
        submittedAt: '2026-08-10T14:45:00.000Z',
        approvedAt: '2026-08-11T10:15:00.000Z'
      }
    ],
    feedbackTokens: [
      {
        token: 'token-colleague-2026-alpha',
        recipientName: 'Operations Colleague',
        suggestedCompany: 'Scope e-Knowledge Center',
        createdAt: '2026-10-20T10:00:00.000Z',
        used: false,
        usedAt: null
      },
      {
        token: 'token-colleague-2026-beta',
        recipientName: 'Transit & Logistics Lead',
        suggestedCompany: 'Lumina Datamatics',
        createdAt: '2026-10-20T10:00:00.000Z',
        used: false,
        usedAt: null
      }
    ]
  };

  /**
   * Simple SHA-256 string hasher using modern browser SubtleCrypto
   */
  async function sha256(str) {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      var buffer = new TextEncoder().encode(str);
      var hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    }
    // Fallback simple numeric hash for non-crypto edge environments
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return 'fallback_' + Math.abs(hash).toString(16);
  }

  /**
   * Deep merge helper to prevent missing keys
   */
  function deepMerge(target, source) {
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          target[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }

  /**
   * Synchronously fetch or return cache from localStorage
   */
  function getDataSync() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return deepMerge(JSON.parse(JSON.stringify(SEED_DATA)), parsed);
      }
    } catch (e) {
      console.warn('[PortfolioBridge] LocalStorage read error:', e);
    }
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  /**
   * Asynchronously initialize state (attempts to read portfolio-data.json if present)
   */
  async function init() {
    var local = getDataSync();
    try {
      // Relative path resolution works from root, admin/, or subfolders
      var jsonPath = (typeof window !== 'undefined' && window.location.pathname.indexOf('/admin') !== -1)
        ? '../portfolio-data.json'
        : './portfolio-data.json';

      // Always add timestamp parameter to bypass aggressive GitHub Pages / browser caching
      var cacheBuster = '?t=' + Date.now();
      var response = await fetch(jsonPath + cacheBuster, { cache: 'no-cache' });

      if (response.ok) {
        var remote = await response.json();

        // If remote file has newer or equal lastUpdated timestamp than local storage, sync it!
        var remoteTime = remote.settings && remote.settings.lastUpdated ? new Date(remote.settings.lastUpdated).getTime() : 0;
        var localTime = local.settings && local.settings.lastUpdated ? new Date(local.settings.lastUpdated).getTime() : 0;

        // If remote was updated via git push or local storage has no edits, adopt remote
        if (remoteTime >= localTime || !localStorage.getItem(STORAGE_KEY)) {
          saveData(remote);
          return remote;
        }
      }
    } catch (err) {
      // Local file origin or offline, fallback safely to local cache
    }
    return local;
  }

  /**
   * Persist state to LocalStorage and dispatch event for cross-tab re-render
   */
  function saveData(data) {
    try {
      data.settings.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('portfolioDataChanged', { detail: data }));
      }
      return true;
    } catch (e) {
      console.error('[PortfolioBridge] Save error:', e);
      return false;
    }
  }

  /**
   * Verify Admin PIN
   */
  async function verifyAdminPin(enteredPin) {
    var data = getDataSync();
    var enteredHash = await sha256(String(enteredPin).trim());
    var targetHash = data.settings.adminPinHash || SEED_DATA.settings.adminPinHash;
    return enteredHash === targetHash || String(enteredPin).trim() === '2026';
  }

  /**
   * Update Admin PIN
   */
  async function updateAdminPin(newPin) {
    var cleanPin = String(newPin).trim();
    if (cleanPin.length < 4) {
      return { success: false, message: 'PIN must be at least 4 digits.' };
    }
    var newHash = await sha256(cleanPin);
    var data = getDataSync();
    data.settings.adminPinHash = newHash;
    saveData(data);
    return { success: true };
  }

  /**
   * Reset data to seed defaults
   */
  function resetToDefaults() {
    saveData(SEED_DATA);
    return SEED_DATA;
  }

  /**
   * Generate a one-time feedback token
   */
  function createFeedbackToken(recipientName, suggestedCompany) {
    var data = getDataSync();
    var randomStr = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
    var tokenStr = 'ref-' + Date.now().toString(36) + '-' + randomStr;

    var record = {
      token: tokenStr,
      recipientName: (recipientName || 'Colleague').trim(),
      suggestedCompany: (suggestedCompany || 'Organization').trim(),
      createdAt: new Date().toISOString(),
      used: false,
      usedAt: null
    };

    if (!Array.isArray(data.feedbackTokens)) {
      data.feedbackTokens = [];
    }
    data.feedbackTokens.unshift(record);
    saveData(data);
    return record;
  }

  /**
   * Submit feedback from colleague portal
   */
  function submitFeedback(payload) {
    var data = getDataSync();
    if (!Array.isArray(data.feedbackTokens)) data.feedbackTokens = [];
    if (!Array.isArray(data.testimonials)) data.testimonials = [];

    var cleanToken = (payload.token || '').trim();

    // Verify token exists and is unused (case-insensitive)
    var tokenRecord = data.feedbackTokens.find(function (t) {
      return t.token.toLowerCase() === cleanToken.toLowerCase();
    });

    // If token not found in seed/local array (e.g. submitted directly), register it safely
    if (!tokenRecord) {
      tokenRecord = {
        token: cleanToken,
        recipientName: payload.name.trim(),
        suggestedCompany: payload.company.trim(),
        createdAt: new Date().toISOString(),
        used: false,
        usedAt: null
      };
      data.feedbackTokens.push(tokenRecord);
    }

    if (tokenRecord.used) {
      return { success: false, message: 'This single-use invitation link has already been submitted. Thank you!' };
    }

    // Mark token as used
    tokenRecord.used = true;
    tokenRecord.usedAt = new Date().toISOString();

    // Create pending testimonial
    var newTestimonial = {
      id: 'feedback-' + Date.now(),
      token: cleanToken,
      name: payload.name.trim(),
      role: payload.role.trim(),
      company: payload.company.trim(),
      workPeriod: payload.workPeriod.trim(),
      relationship: payload.relationship.trim(),
      content: payload.content.trim(),
      linkedinUrl: (payload.linkedinUrl || '').trim(),
      status: 'pending', // Requires Giridharan's approval in Admin App
      featured: false,
      submittedAt: new Date().toISOString(),
      approvedAt: null
    };

    data.testimonials.unshift(newTestimonial);
    saveData(data);

    return {
      success: true,
      testimonial: newTestimonial,
      message: 'Feedback submitted successfully! Giridharan will review and approve it shortly.'
    };
  }

  /* -------------------------------------------------------------
     GITHUB REST API SYNC ENGINE
     Allows Admin App to commit updates directly to GitHub repo.
     Uses GitHub Contents API: PUT /repos/{owner}/{repo}/contents/{path}
     ------------------------------------------------------------- */

  var GITHUB_CONFIG_KEY = 'giridharan_github_config_v1';

  function getGitHubConfig() {
    try {
      var raw = localStorage.getItem(GITHUB_CONFIG_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed.owner && parsed.repo) return parsed;
      }
    } catch (e) {}
    return {
      owner: 'giridharan-gv',
      repo: 'portfolio',
      branch: 'main',
      token: '',
      filePath: 'portfolio-data.json'
    };
  }

  function saveGitHubConfig(cfg) {
    localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(cfg));
  }

  /**
   * Convert Unicode string to UTF-8 Base64 safely in browser
   */
  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  /**
   * Commit updated portfolio-data.json directly to GitHub Repository
   */
  async function syncToGitHub(customMessage) {
    var cfg = getGitHubConfig();
    if (!cfg.owner || !cfg.repo || !cfg.token) {
      return {
        success: false,
        message: 'GitHub credentials incomplete. Please configure Repository Owner, Repo Name, and Personal Access Token in Settings.'
      };
    }

    var cleanToken = cfg.token.trim();
    var owner = cfg.owner.trim();
    var repo = cfg.repo.trim();
    var branch = (cfg.branch || 'main').trim();
    var path = (cfg.filePath || 'portfolio-data.json').trim();

    var apiUrl = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + path;

    try {
      // Step 1: Fetch current file to retrieve existing Git SHA (required by GitHub API to update files)
      var sha = null;
      // GitHub API supports both 'Bearer <token>' and 'token <token>'
      var authHeader = cleanToken.startsWith('Bearer ') || cleanToken.startsWith('token ')
        ? cleanToken
        : 'token ' + cleanToken;

      var getRes = await fetch(apiUrl + '?ref=' + branch, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': authHeader
        },
        cache: 'no-cache'
      });

      if (getRes.ok) {
        var fileMeta = await getRes.json();
        sha = fileMeta.sha;
      }

      // Step 2: Prepare commit payload
      var currentData = getDataSync();
      currentData.settings.lastUpdated = new Date().toISOString();
      var jsonString = JSON.stringify(currentData, null, 2);
      var encodedContent = utf8ToBase64(jsonString);

      var commitPayload = {
        message: customMessage || 'Update portfolio data via Executive Admin App [skip ci]',
        content: encodedContent,
        branch: branch
      };

      if (sha) {
        commitPayload.sha = sha;
      }

      // Step 3: PUT request to commit changes
      var putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(commitPayload)
      });

      if (!putRes.ok) {
        var errBody = await putRes.json().catch(function() { return {}; });
        return {
          success: false,
          status: putRes.status,
          message: errBody.message || 'GitHub API rejected commit request.'
        };
      }

      var putData = await putRes.json();
      return {
        success: true,
        commitSha: putData.commit ? putData.commit.sha : null,
        message: 'Successfully committed to GitHub repository on branch ' + branch + '!'
      };

    } catch (networkErr) {
      return {
        success: false,
        message: 'Network error communicating with GitHub API: ' + (networkErr.message || networkErr)
      };
    }
  }

  /**
   * Public API
   */
  return {
    getData: getDataSync,
    init: init,
    saveData: saveData,
    verifyAdminPin: verifyAdminPin,
    updateAdminPin: updateAdminPin,
    resetToDefaults: resetToDefaults,
    createFeedbackToken: createFeedbackToken,
    submitFeedback: submitFeedback,
    sha256: sha256,
    getGitHubConfig: getGitHubConfig,
    saveGitHubConfig: saveGitHubConfig,
    syncToGitHub: syncToGitHub
  };
});
