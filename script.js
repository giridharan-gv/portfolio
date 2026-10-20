/* -------------------------------------------------------------
   GIRIDHARAN G V — JAVASCRIPT INTERACTIONS
   Operations Executive & Systems Builder
   Chennai, Tamil Nadu
   
   Vanilla JS, human-written, zero dependencies.
   ------------------------------------------------------------- */

// Set dynamic current year in footer
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------
   1. THEME TOGGLE (EXECUTIVE OBSIDIAN DEFAULT / LIGHT MODE SWAP)
   ------------------------------------------------------------- */
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlElement = document.documentElement;

function getSavedTheme() {
  try {
    return localStorage.getItem('giridharan_theme') || 'dark';
  } catch (err) {
    return 'dark'; // Safe fallback for file:/// or restricted context
  }
}

function persistTheme(theme) {
  try {
    localStorage.setItem('giridharan_theme', theme);
  } catch (err) {
    // Storage restricted in local context
  }
}

// Initialize theme from saved preference (default dark)
htmlElement.setAttribute('data-theme', getSavedTheme());

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', nextTheme);
    persistTheme(nextTheme);
  });
}

/* -------------------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------- */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNavDrawer = document.getElementById('mobileNavDrawer');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function toggleMobileMenu() {
  const isOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
  mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
  mobileNavDrawer.classList.toggle('is-open', !isOpen);
  mobileNavDrawer.setAttribute('aria-hidden', isOpen);
}

if (mobileMenuBtn && mobileNavDrawer) {
  mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileNavDrawer.classList.remove('is-open');
      mobileNavDrawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* -------------------------------------------------------------
   3. STICKY HEADER SCROLL PROGRESS BAR (Passive rAF)
   ------------------------------------------------------------- */
const scrollProgressBar = document.getElementById('scrollProgressBar');
let isTicking = false;

function updateScrollProgress() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;
  if (scrollProgressBar) {
    scrollProgressBar.style.transform = `scaleX(${progress})`;
  }
  isTicking = false;
}

window.addEventListener('scroll', () => {
  if (!isTicking) {
    window.requestAnimationFrame(updateScrollProgress);
    isTicking = true;
  }
}, { passive: true });

/* -------------------------------------------------------------
   4. SCROLL REVEALS & DIVIDER LINES (IntersectionObserver)
   ------------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal');
const dividerLines = document.querySelectorAll('[data-reveal-divider]');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  const dividerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  dividerLines.forEach(line => dividerObserver.observe(line));
} else {
  // Fallback for older browsers
  revealElements.forEach(el => el.classList.add('is-revealed'));
  dividerLines.forEach(line => line.classList.add('is-visible'));
}

/* -------------------------------------------------------------
   5. ONE-CLICK EMAIL & CREDENTIAL ID COPY
   ------------------------------------------------------------- */
const copyEmailBtn = document.getElementById('copyEmailBtn');
const emailDisplay = document.getElementById('emailDisplay');

if (copyEmailBtn && emailDisplay) {
  copyEmailBtn.addEventListener('click', () => {
    const email = emailDisplay.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      const originalText = copyEmailBtn.textContent;
      copyEmailBtn.textContent = 'Copied!';
      copyEmailBtn.style.background = 'var(--color-gold)';
      copyEmailBtn.style.color = '#0b0c0e';

      setTimeout(() => {
        copyEmailBtn.textContent = originalText;
        copyEmailBtn.style.background = '';
        copyEmailBtn.style.color = '';
      }, 2400);
    }).catch(() => {
      window.location.href = `mailto:${email}`;
    });
  });
}

// One-Click Credential ID Copy
const copyCredIdBtn = document.getElementById('copyCredIdBtn');
const credIdCode = document.getElementById('credIdCode');

if (copyCredIdBtn && credIdCode) {
  copyCredIdBtn.addEventListener('click', () => {
    const credId = credIdCode.textContent.trim();
    navigator.clipboard.writeText(credId).then(() => {
      const originalText = copyCredIdBtn.textContent;
      copyCredIdBtn.textContent = 'Copied!';
      copyCredIdBtn.style.background = 'var(--color-gold)';
      copyCredIdBtn.style.color = '#0b0c0e';

      setTimeout(() => {
        copyCredIdBtn.textContent = originalText;
        copyCredIdBtn.style.background = '';
        copyCredIdBtn.style.color = '';
      }, 2400);
    });
  });
}

/* -------------------------------------------------------------
   6. CONTACT FORM HANDLER (Direct Mailto Integration)
   ------------------------------------------------------------- */
function handleFormSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('portfolioContactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const subject = document.getElementById('contactSubject').value;
  const message = document.getElementById('contactMessage').value;

  feedback.classList.add('is-success');
  feedback.textContent = `Thank you, ${name}. Launching email client to dharangiri144@gmail.com...`;

  const mailtoUrl = `mailto:dharangiri144@gmail.com?subject=${encodeURIComponent('[Operations Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 700);
}
window.handleFormSubmit = handleFormSubmit;


/* -------------------------------------------------------------
   DYNAMIC SECTIONS & ADMIN SYNC CONTROLLER
   Reads configuration from PortfolioBridge (localStorage & JSON)
   Renders Coding Milestones, Builds & Colleague Testimonials
   Handles Maintenance Banner Strip and Section Visibility live.
   ------------------------------------------------------------- */

(function () {
  'use strict';

  // Fallback safe check if PortfolioBridge is loaded
  if (typeof PortfolioBridge === 'undefined') {
    return;
  }

  /**
   * Render or update dynamic sections on page
   */
  async function syncPortfolioState() {
    var data = await PortfolioBridge.init();
    if (!data) return;

    var settings = data.settings || {};
    var vis = settings.visibility || {};

    // 1. Maintenance Mode Board & Banner
    var maint = settings.maintenanceMode || {};
    var banner = document.getElementById('maintenanceBannerStrip');
    var overlayBoard = document.getElementById('maintenanceOverlayBoard');

    var isMaintOn = Boolean(maint && maint.enabled);
    var displayMode = (maint && maint.displayMode) || 'fullscreen'; // 'fullscreen' or 'banner'

    if (banner) {
      banner.style.display = (isMaintOn && displayMode === 'banner') ? 'flex' : 'none';
      var headingEl = document.getElementById('maintBannerHeading');
      var msgEl = document.getElementById('maintBannerMsg');
      var timeEl = document.getElementById('maintBannerTime');
      if (headingEl) headingEl.textContent = maint.badge || 'Notice:';
      if (msgEl) msgEl.textContent = maint.message || 'Portfolio undergoing maintenance.';
      if (timeEl) timeEl.textContent = maint.estimatedReturn || 'Returning shortly';
    }

    if (overlayBoard) {
      overlayBoard.style.display = (isMaintOn && displayMode === 'fullscreen') ? 'flex' : 'none';
      var oBadge = document.getElementById('maintOverlayBadge');
      var oHeading = document.getElementById('maintOverlayHeading');
      var oMsg = document.getElementById('maintOverlayMsg');
      var oTime = document.getElementById('maintOverlayTime');
      if (oBadge) oBadge.textContent = maint.badge || 'Scheduled Architecture Upgrade';
      if (oHeading) oHeading.textContent = maint.heading || 'Portfolio Under Maintenance';
      if (oMsg) oMsg.textContent = maint.message || 'We are currently deploying updated enterprise case studies and operational metrics. Service will resume shortly.';
      if (oTime) oTime.textContent = maint.estimatedReturn || 'Returning shortly today';
    }

    // 2. Section Visibility Toggles (Dom hide/show)
    function applyVisibility(sectionId, isVisible, navId, mobileNavId, dividerId) {
      var sec = document.getElementById(sectionId);
      if (sec) sec.style.display = isVisible ? '' : 'none';
      var nav = document.getElementById(navId);
      if (nav) nav.style.display = isVisible ? '' : 'none';
      var mNav = document.getElementById(mobileNavId);
      if (mNav) mNav.style.display = isVisible ? '' : 'none';
      var div = dividerId ? document.getElementById(dividerId) : null;
      if (div) div.style.display = isVisible ? '' : 'none';
    }

    applyVisibility('numbers', vis.numbers !== false);
    applyVisibility('certifications', vis.certifications !== false);
    applyVisibility('experience', vis.experience !== false);
    applyVisibility('skills', vis.skills !== false);
    applyVisibility('coding-milestones', vis.codingMilestones !== false, 'navLinkMilestones', 'mobileNavLinkMilestones', 'dividerMilestones');
    applyVisibility('builds', !!vis.builds, 'navLinkBuilds', 'mobileNavLinkBuilds', 'dividerBuilds');
    applyVisibility('testimonials', vis.testimonials !== false, 'navLinkTestimonials', 'mobileNavLinkTestimonials', 'dividerTestimonials');

    // 3. Render Coding Milestones
    renderCodingMilestones(data.codingMilestones);

    // 4. Render Builds & SaaS Projects
    renderBuilds(data.builds);

    // 5. Render Approved Colleague Testimonials
    renderTestimonials(data.testimonials);
  }

  /**
   * Render Coding Milestones stats & Hackathons
   */
  function renderCodingMilestones(milestones) {
    if (!milestones) return;

    var statsContainer = document.getElementById('milestonesStatsGrid');
    if (statsContainer && Array.isArray(milestones.stats)) {
      statsContainer.innerHTML = milestones.stats.map(function (stat, idx) {
        var linkHtml = stat.profileUrl
          ? '<a href="' + stat.profileUrl + '" target="_blank" rel="noopener noreferrer" class="milestone-link">' +
              '<span>View Verified Profile</span>' +
              '<svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
            '</a>'
          : '';

        return '<div class="milestone-stat-card reveal stagger-' + ((idx % 3) + 1) + '">' +
          '<div class="milestone-header">' +
            '<span class="milestone-platform">' + stat.platform + '</span>' +
            '<span class="milestone-badge">' + stat.badge + '</span>' +
          '</div>' +
          '<div class="milestone-number">' + stat.highlight + '</div>' +
          '<div class="milestone-label">' + stat.metricLabel + '</div>' +
          '<div class="milestone-desc">' + stat.description + '</div>' +
          linkHtml +
        '</div>';
      }).join('');
    }

    var hackathonsContainer = document.getElementById('hackathonsGrid');
    if (hackathonsContainer && Array.isArray(milestones.hackathons)) {
      hackathonsContainer.innerHTML = milestones.hackathons.map(function (item, idx) {
        return '<div class="hackathon-card reveal stagger-' + ((idx % 2) + 1) + '">' +
          '<span class="hackathon-badge">' + item.resultBadge + '</span>' +
          '<h4 class="hackathon-title">' + item.projectTitle + '</h4>' +
          '<div class="hackathon-meta">' + item.name + ' (' + item.year + ') &bull; ' + item.organizer + '</div>' +
          '<p class="hackathon-summary">' + item.summary + '</p>' +
        '</div>';
      }).join('');
    }
  }

  /**
   * Render Builds & SaaS Applications
   */
  function renderBuilds(buildsList) {
    var container = document.getElementById('buildsContainer');
    if (!container) return;

    if (!Array.isArray(buildsList) || !buildsList.length) {
      container.innerHTML = '<p style="color:var(--color-text-muted); font-size:0.9rem;">Building next-generation operational tools. Check back shortly.</p>';
      return;
    }

    container.innerHTML = buildsList.map(function (b, idx) {
      var chips = (b.techStack || []).map(function (t) {
        return '<span class="chip">' + t + '</span>';
      }).join('');

      var actionsHtml = '';
      if (b.liveUrl) {
        actionsHtml += '<a href="' + b.liveUrl + '" target="_blank" class="btn btn-primary btn-sm">' +
          '<span>Launch Application</span>' +
          '<svg viewBox="0 0 24 24" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2;"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
        '</a>';
      }
      if (b.githubUrl) {
        actionsHtml += '<a href="' + b.githubUrl + '" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">' +
          '<span>Source Code</span>' +
        '</a>';
      }

      return '<div class="build-card reveal stagger-' + ((idx % 2) + 1) + '">' +
        '<div>' +
          '<div class="build-card-category">' + b.category + ' &bull; ' + b.status + '</div>' +
          '<h3 class="build-card-title">' + b.title + '</h3>' +
          '<div class="build-card-tagline">' + b.tagline + '</div>' +
          '<p class="build-card-summary">' + b.summary + '</p>' +
          '<div class="build-tech-chips">' + chips + '</div>' +
        '</div>' +
        '<div class="build-actions">' + actionsHtml + '</div>' +
      '</div>';
    }).join('');
  }

  /**
   * Render Approved Colleague Testimonials
   */
  function renderTestimonials(testimonialsList) {
    var container = document.getElementById('testimonialsContainer');
    if (!container) return;

    var approved = (testimonialsList || []).filter(function (t) {
      return t.status === 'approved';
    });

    if (!approved.length) {
      container.innerHTML = '<div style="grid-column: 1 / -1; padding: 2rem; background: var(--color-surface); border: 1px dashed var(--color-border); border-radius: var(--radius-md); text-align: center; color: var(--color-text-muted); font-size: 0.9rem;">' +
        'Colleague endorsements are currently undergoing administrative verification. Colleagues can submit recommendations via the <a href="feedback.html" style="color:var(--color-gold); font-weight:600;">Colleague Portal</a>.' +
      '</div>';
      return;
    }

    container.innerHTML = approved.map(function (item, idx) {
      var initial = (item.name || 'C').charAt(0).toUpperCase();

      return '<div class="testimonial-card reveal stagger-' + ((idx % 2) + 1) + '">' +
        '<div>' +
          '<svg class="testimonial-quote-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>' +
          '<p class="testimonial-text">&ldquo;' + item.content + '&rdquo;</p>' +
        '</div>' +
        '<div class="testimonial-author">' +
          '<div class="testimonial-author-avatar">' + initial + '</div>' +
          '<div class="testimonial-author-info">' +
            '<h4>' + item.name + '</h4>' +
            '<p>' + item.role + ' &bull; ' + item.company + '</p>' +
            '<span class="testimonial-work-period">' + item.workPeriod + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Listen for real-time live sync from Admin App in other tabs
  window.addEventListener('storage', function (e) {
    if (e.key === 'giridharan_portfolio_data_v1') {
      syncPortfolioState();
    }
  });

  window.addEventListener('portfolioDataChanged', function () {
    syncPortfolioState();
  });

  // Run on page load
  window.addEventListener('DOMContentLoaded', syncPortfolioState);
})();
