import React, { useState, useEffect } from 'react';
import './styles.css';

/* -------------------------------------------------------------
   GIRIDHARAN G V — REACT PORTFOLIO COMPONENT
   Operations Executive | QSR, Transit Mobility & Service Operations
   Chennai, Tamil Nadu | dharangiri144@gmail.com
   ------------------------------------------------------------- */

export default function Portfolio() {
  // Theme state with safe localStorage read (default: dark)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('giridharan_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCredId, setCopiedCredId] = useState(false);
  const [formFeedback, setFormFeedback] = useState(false);

  const handleCopyCredId = () => {
    navigator.clipboard.writeText('a0KW9795Cjh283121E').then(() => {
      setCopiedCredId(true);
      setTimeout(() => setCopiedCredId(false), 2400);
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('dharangiri144@gmail.com').then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const subject = e.target.subject.value;
    const message = e.target.message.value;

    setFormFeedback(true);
    const mailtoUrl = `mailto:dharangiri144@gmail.com?subject=${encodeURIComponent('[Operations Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 700);
  };

  // Sync theme with document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('giridharan_theme', theme);
    } catch {}
  }, [theme]);

  // Set favicon
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }
    link.href = 'favicon.png';
  }, []);

  // Scroll Progress Listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for Scroll Reveals & Dividers
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const revealElements = document.querySelectorAll('.reveal');
    const dividerLines = document.querySelectorAll('[data-reveal-divider]');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    const dividerObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    dividerLines.forEach(line => dividerObserver.observe(line));

    return () => {
      revealObserver.disconnect();
      dividerObserver.disconnect();
    };
  }, []);

  return (
    <div className="portfolio-app">
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Film Grain Texture Overlay */}
      <svg className="grain-overlay" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <filter id="noiseFilterReact">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilterReact)" />
      </svg>

      {/* Sticky Header */}
      <header className="site-header" id="siteHeader">
        <div className="container">
          <a href="#hero" className="site-logo" aria-label="Giridharan G V - Home">
            <img src="images/giridharan.jpg" alt="Giridharan G V" className="logo-avatar" width="40" height="40" />
            <div className="logo-text">
              <span className="logo-name">Giridharan G V</span>
              <span className="logo-role">Operations Executive • Chennai</span>
            </div>
          </a>

          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li><a href="#about" className="nav-link">About</a></li>
              <li><a href="#numbers" className="nav-link">Impact Metrics</a></li>
              <li><a href="#certifications" className="nav-link">Certification</a></li>
              <li><a href="#experience" className="nav-link">Career History</a></li>
              <li><a href="#skills" className="nav-link">Competencies</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>
          </nav>

          <div className="header-actions">
            {/* Theme Toggle */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark/light theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="icon-sun" style={{ display: 'block' }} viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg className="icon-moon" style={{ display: 'block' }} viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="scroll-progress-track" aria-hidden="true">
          <div
            className="scroll-progress-bar"
            style={{ transform: `scaleX(${scrollProgress})` }}
          ></div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'is-open' : ''}`}>
        <ul className="mobile-nav-list">
          <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About Giridharan</a></li>
          <li><a href="#numbers" onClick={() => setMobileMenuOpen(false)}>Key Impact Metrics</a></li>
          <li><a href="#certifications" onClick={() => setMobileMenuOpen(false)}>Verified Certification</a></li>
          <li><a href="#experience" onClick={() => setMobileMenuOpen(false)}>Career History (7 Years)</a></li>
          <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>Core Competencies</a></li>
          <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact Giridharan</a></li>
        </ul>
      </div>

      <main id="main-content">
        {/* HERO SECTION */}
        <section className="hero-section theme-dark-fixed" id="hero">
          <div className="container">
            <div className="hero-grid">
              {/* Left column: Executive operator introduction */}
              <div className="hero-content" id="about">
                <div className="hero-badge-wrap">
                  <div className="hero-profile-lockup">
                    <img src="images/giridharan.jpg" alt="Giridharan G V" className="hero-avatar-img" width="52" height="52" />
                    <div className="hero-profile-meta">
                      <span className="hero-profile-name">
                        Giridharan G V
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--color-gold)" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      </span>
                      <span className="hero-profile-role">Operations Executive • Chennai</span>
                    </div>
                    <div className="hero-profile-status">
                      <span className="status-dot"></span>
                      Open to Operations Roles
                    </div>
                  </div>
                </div>

                <div className="hero-headline-wrap">
                  <h1 className="hero-headline">
                    7 Years Running Frontline Operations Across <strong>QSR, Transit Mobility &amp; Service Teams</strong>.
                  </h1>
                </div>

                <p className="hero-lead">
                  Operations professional with <strong>7 years of verified experience</strong> across QSR, hospitality, and transport operations. Most recently <strong>Executive – Operations</strong> at <strong>IntrCity SmartBus</strong>, coordinating 9 daily buses with 14 captains across 5 southern corridors and handling 1,836 trips.
                </p>
                <p className="hero-lead-secondary">
                  Previously <strong>Customer Experience Manager</strong> at <strong>Chaayos</strong>, leading teams of 6–10 and driving food cost control, wastage reduction, and SOP compliance. Certified in <strong>Microsoft Excel Data Analysis</strong> (GUVI / IITM Research Park). Targeting <strong>Shift Manager, Assistant Restaurant Manager, and Operations roles</strong>.
                </p>

                <div className="hero-actions">
                  <a href="#experience" className="btn btn-primary">
                    View Career History
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                  <a href="#skills" className="btn btn-outline-dark">
                    Explore Competencies
                  </a>
                  <a href="#contact" className="btn btn-text-link">
                    Get in Touch &rarr;
                  </a>
                </div>

                <div className="hero-credentials-strip">
                  <div className="cred-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span><strong>7 Years</strong> Operations</span>
                  </div>
                  <div className="cred-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span><strong>1,836</strong> Bus Trips</span>
                  </div>
                  <div className="cred-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    <span><strong>40+</strong> Crew Certified</span>
                  </div>
                  <div className="cred-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    <span><strong>MS Excel</strong> Certified</span>
                  </div>
                </div>
              </div>

              {/* Right column: Framed Executive Portrait Card */}
              <div className="hero-portrait-frame">
                <div className="hero-portrait-card">
                  <div className="portrait-photo-wrap">
                    <img src="images/giridharan.jpg" alt="Giridharan G V - Operations Executive" className="hero-main-photo" width="460" height="540" />
                    <div className="portrait-gradient-overlay" aria-hidden="true"></div>
                    <div className="portrait-floating-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      Verified Executive
                    </div>
                    <div className="portrait-floating-location">
                      Chennai, Tamil Nadu
                    </div>
                  </div>

                  <div className="portrait-info-block">
                    <div className="portrait-info-header">
                      <div>
                        <span className="portrait-role-badge">Executive Profile</span>
                        <h3 className="portrait-name">Giridharan G V</h3>
                        <p className="portrait-sub">Operations Executive &amp; Multi-Unit Store Lead</p>
                      </div>
                      <div className="portrait-exp-badge">
                        <span className="exp-number">7</span>
                        <span className="exp-unit">Years</span>
                      </div>
                    </div>

                    <div className="portrait-quick-specs">
                      <div className="spec-row">
                        <span className="spec-icon">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                        </span>
                        <div className="spec-text">
                          <strong>QSR &amp; Store Operations</strong>
                          <span>Chaayos Customer Experience Manager • Taco Bell Buddie Trainer</span>
                        </div>
                      </div>
                      <div className="spec-row">
                        <span className="spec-icon">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="15" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                        </span>
                        <div className="spec-text">
                          <strong>Fleet Dispatch &amp; Transit Logistics</strong>
                          <span>IntrCity SmartBus • 9 Buses • 14 Captains • 1,836 Trips</span>
                        </div>
                      </div>
                      <div className="spec-row">
                        <span className="spec-icon">
                          <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                        </span>
                        <div className="spec-text">
                          <strong>Data Modeling &amp; Analytics</strong>
                          <span>MS Excel Data Analyst • Process Optimization &amp; P&amp;L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <div className="divider-line" data-reveal-divider></div>

        {/* NUMBERS STRIP */}
        <section className="section-compact numbers-section" id="numbers" aria-label="Key Performance Indicators">
          <div className="container">
            <div className="numbers-grid">
              <div className="metric-card reveal stagger-1">
                <div className="metric-number">1,836</div>
                <div className="metric-label">SmartBus Trips Handled</div>
                <div className="metric-sub">Coordinated across 5 southern intercity corridors.</div>
              </div>

              <div className="metric-card reveal stagger-2">
                <div className="metric-number">50k<span>+</span></div>
                <div className="metric-label">Passengers Supported</div>
                <div className="metric-sub">Across IntrCity route operations and onboard service.</div>
              </div>

              <div className="metric-card reveal stagger-3">
                <div className="metric-number">9</div>
                <div className="metric-label">Daily Intercity Buses</div>
                <div className="metric-sub">Managed with 14 captains, CCTV, and live GPS coordination.</div>
              </div>

              <div className="metric-card reveal stagger-4">
                <div className="metric-number">40<span>+</span></div>
                <div className="metric-label">Team Members Trained</div>
                <div className="metric-sub">Certified at Taco Bell on speed, portion, and food hygiene.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-line" data-reveal-divider></div>

        {/* CERTIFICATIONS SECTION */}
        <section className="section" id="certifications">
          <div className="container">
            <div className="reveal">
              <span className="section-eyebrow">Verified Accreditations</span>
              <h2 className="section-title">Certifications &amp; Technical Credentials</h2>
              <p className="section-intro">
                Formal technical qualification in advanced data analytics, spreadsheet architecture, and operational process design.
              </p>
            </div>

            <div className="cert-grid">
              <div className="cert-card reveal stagger-1">
                <div className="cert-card-header">
                  <div className="cert-badge-row">
                    <span className="cert-status-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                      Verified Certificate
                    </span>
                    <span className="cert-issuer-badge">GUVI • IITM Research Park</span>
                  </div>
                  <div className="cert-icon-wrap" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                </div>

                <div className="cert-card-body">
                  <h3 className="cert-title">Microsoft Excel Complete Course – Data Analysis and Spreadsheet Skills</h3>
                  <p className="cert-desc">
                    Comprehensive professional accreditation covering data modeling, formula engineering, PivotTables, VLOOKUP/INDEX-MATCH lookup engines, conditional formatting, and business data analysis.
                  </p>

                  <div className="cert-meta-group">
                    <div className="cert-meta-item">
                      <span className="meta-label">Credential ID:</span>
                      <div className="cert-id-badge">
                        <code>a0KW9795Cjh283121E</code>
                        <button
                          type="button"
                          className="copy-id-btn"
                          onClick={handleCopyCredId}
                          aria-label="Copy Credential ID"
                          style={copiedCredId ? { background: 'var(--color-gold)', color: '#0b0c0e' } : {}}
                        >
                          {copiedCredId ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="cert-meta-item">
                      <span className="meta-label">Issuing Platform:</span>
                      <span className="meta-value">GUVI Geek Networks</span>
                    </div>
                  </div>

                  <div className="cert-skills-strip">
                    <span className="chip">Data Analysis</span>
                    <span className="chip">Spreadsheet Skills</span>
                    <span className="chip">Formulas &amp; Lookups</span>
                    <span className="chip">Data Cleaning</span>
                    <span className="chip">PivotTables</span>
                    <span className="chip">P&amp;L Modeling</span>
                  </div>
                </div>

                <div className="cert-card-footer">
                  <a
                    href="https://www.guvi.in/share-certificate/a0KW9795Cjh283121E"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary cert-verify-btn"
                  >
                    Verify Credential on GUVI
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                  <span className="cert-auth-note">Officially verified by GUVI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-line" data-reveal-divider></div>

        {/* CAREER HISTORY */}
        <section className="section" id="experience">
          <div className="container">
            <div className="reveal">
              <span className="section-eyebrow">Professional Track Record</span>
              <h2 className="section-title">7 Years of Frontline Operations Leadership</h2>
              <p className="section-intro">
                A chronological progression across high-velocity transit fleet logistics, QSR multi-unit store operations, crew training benchmarks, and large-scale hospitality.
              </p>
            </div>

            <div className="timeline">
              {/* ROLE 1: IntrCity SmartBus Executive */}
              <div className="timeline-item reveal">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">Executive – Operations</h3>
                      <div className="timeline-company">IntrCity SmartBus • Chennai, Tamil Nadu</div>
                    </div>
                    <span className="timeline-period">Jan 2026 — Aug 2026</span>
                  </div>
                  <p className="timeline-summary">
                    Coordinated daily intercity operations across 5 southern routes, managing fleet continuity, real-time trip execution, captain rosters, and high passenger volume.
                  </p>
                  <ul className="timeline-bullets">
                    <li>Coordinated daily operations for 9 buses across Chennai–Hyderabad, Vijayawada, Bengaluru, Trichy, and Madurai routes, handling 1,836 trips and approximately 40,000–50,000 passengers.</li>
                    <li>Coordinated 14 captains and resolved real-time issues affecting trip execution, crew availability, and service delivery.</li>
                    <li>Handled and resolved 100+ customer and service issues, including NPS-related complaints.</li>
                    <li>Coordinated with bus operators and internal stakeholders on GPS, CCTV, and vehicle-related requirements to support service continuity.</li>
                    <li>Monitored route operations and service compliance to maintain operational standards.</li>
                  </ul>
                </div>
              </div>

              {/* ROLE 2: Chaayos Customer Experience Manager */}
              <div className="timeline-item reveal">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">Customer Experience Manager</h3>
                      <div className="timeline-company">Chaayos • Chennai, Tamil Nadu</div>
                    </div>
                    <span className="timeline-period">Sep 2024 — Jan 2026</span>
                  </div>
                  <p className="timeline-summary">
                    Promoted from Cafe Trainer to Customer Experience Manager in recognition of consistent performance and operational quality; led daily shift operations and store P&amp;L support.
                  </p>
                  <ul className="timeline-bullets">
                    <li>Promoted from Cafe Trainer to Customer Experience Manager in recognition of consistent performance and operational quality.</li>
                    <li>Led a team of approximately 6–10, managing 2–3 employees per shift and coordinating manpower for daily shift operations.</li>
                    <li>Managed daily inventory, stock usage, and stock entries, monitoring stock levels and taking corrective action to reduce wastage.</li>
                    <li>Supported food cost control through portion control, stock monitoring, and efficient shift operations.</li>
                    <li>Handled customer complaints and escalations during shifts, working toward timely resolution.</li>
                    <li>Trained team members on SOPs, customer service, and shift activities, maintaining SOP compliance and operational standards.</li>
                  </ul>
                </div>
              </div>

              {/* ROLE 3: IntrCity SmartBus Bus Captain */}
              <div className="timeline-item reveal">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">Bus Captain</h3>
                      <div className="timeline-company">IntrCity SmartBus • Chennai, Tamil Nadu</div>
                    </div>
                    <span className="timeline-period">Apr 2023 — Jul 2024</span>
                  </div>
                  <p className="timeline-summary">
                    Managed frontline passenger journey experience, onboard service standards, and en-route issue resolution across 394 intercity bus trips.
                  </p>
                  <ul className="timeline-bullets">
                    <li>Managed passenger service across 394 trips for approximately 8,000–10,000 passengers, maintaining onboard service standards and supporting passenger safety.</li>
                    <li>Handled 100+ customer issues and complaints through direct passenger interaction.</li>
                    <li>Monitored bus cleanliness and amenities and coordinated with the crew for smooth trip operations.</li>
                  </ul>
                </div>
              </div>

              {/* ROLE 4: Taco Bell Buddie Trainer */}
              <div className="timeline-item reveal">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">Buddie Trainer</h3>
                      <div className="timeline-company">Taco Bell • Chennai, Tamil Nadu</div>
                    </div>
                    <span className="timeline-period">Mar 2021 — Mar 2023</span>
                  </div>
                  <p className="timeline-summary">
                    Trained 40+ new team members on food preparation and hygiene, leading shift lines and driving portion accuracy to minimize wastage.
                  </p>
                  <ul className="timeline-bullets">
                    <li>Trained 40+ new team members on food preparation, service speed, hygiene procedures, and operational standards.</li>
                    <li>Handled approximately 4–6 team members per shift while supporting inventory accuracy, portion control, and wastage reduction.</li>
                  </ul>
                </div>
              </div>

              {/* ROLE 5: Star Hotels ODC Member */}
              <div className="timeline-item reveal">
                <div className="timeline-dot"></div>
                <div className="timeline-card">
                  <div className="timeline-header">
                    <div>
                      <h3 className="timeline-role">ODC Member (Outdoor Catering)</h3>
                      <div className="timeline-company">Star Hotels • Chennai, Tamil Nadu</div>
                    </div>
                    <span className="timeline-period">Jul 2019 — Mar 2021</span>
                  </div>
                  <p className="timeline-summary">
                    Supported high-volume banquet setups, catering service flow, and guest hospitality standards during large-scale hospitality events.
                  </p>
                  <ul className="timeline-bullets">
                    <li>Assisted in banquet setups, service flow, and guest handling during large-scale events.</li>
                    <li>Maintained high service standards to ensure smooth hospitality operations.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education Box */}
            <div className="education-box reveal">
              <h4>Academic Background</h4>
              <p><strong>SSLC (Secondary School Leaving Certificate)</strong> • Railway Mixed High School, Arakkonam (Jul 2016 — Apr 2018)</p>
            </div>
          </div>
        </section>

        <div className="divider-line" data-reveal-divider></div>

        {/* CORE COMPETENCIES */}
        <section className="section" id="skills">
          <div className="container">
            <div className="reveal">
              <span className="section-eyebrow">Skills &amp; Capabilities</span>
              <h2 className="section-title">Core Competencies</h2>
              <p className="section-intro">
                A comprehensive operational capability profile spanning restaurant operations, crew leadership, guest resolution, and multi-corridor transit logistics.
              </p>
            </div>

            <div className="skills-grid">
              <div className="skill-card reveal stagger-1">
                <div className="skill-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                </div>
                <h3>Restaurant &amp; QSR Operations</h3>
                <p>End-to-end cafe and QSR operations, shift governance, inventory tracking, portion control, and food cost containment.</p>
                <div className="skill-chips">
                  <span className="chip">QSR Operations</span>
                  <span className="chip">Shift Management</span>
                  <span className="chip">SOP Compliance</span>
                  <span className="chip">Food Cost Control</span>
                  <span className="chip">Wastage Control</span>
                  <span className="chip">Inventory Management</span>
                  <span className="chip">Portion Control</span>
                  <span className="chip">P&amp;L Support</span>
                </div>
              </div>

              <div className="skill-card reveal stagger-2">
                <div className="skill-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3>Team &amp; People Leadership</h3>
                <p>Structured crew training, manpower planning for multi-shift schedules, captain coordination, and performance standards.</p>
                <div className="skill-chips">
                  <span className="chip">Team Leadership</span>
                  <span className="chip">Staff Training (40+)</span>
                  <span className="chip">Manpower Planning</span>
                  <span className="chip">Crew Coordination</span>
                  <span className="chip">Performance Management</span>
                  <span className="chip">Shift Scheduling</span>
                </div>
              </div>

              <div className="skill-card reveal stagger-3">
                <div className="skill-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </div>
                <h3>Customer &amp; Service Experience</h3>
                <p>Direct guest engagement, de-escalation of frontline service issues, NPS recovery management, and service quality consistency.</p>
                <div className="skill-chips">
                  <span className="chip">Customer Experience</span>
                  <span className="chip">Complaint Resolution</span>
                  <span className="chip">Escalation Resolution</span>
                  <span className="chip">NPS Resolution</span>
                  <span className="chip">Service Quality</span>
                  <span className="chip">Guest Handling</span>
                </div>
              </div>

              <div className="skill-card reveal stagger-4">
                <div className="skill-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="15" rx="2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
                </div>
                <h3>Route Operations &amp; Analytics</h3>
                <p>Territory route execution, GPS/CCTV vehicle monitoring, operator coordination, operational compliance, and Excel analysis.</p>
                <div className="skill-chips">
                  <span className="chip">Territory &amp; Route Ops</span>
                  <span className="chip">Operator Coordination</span>
                  <span className="chip">GPS &amp; CCTV Coordination</span>
                  <span className="chip">Operational Compliance</span>
                  <span className="chip">Real-Time Issue Resolution</span>
                  <span className="chip">MS Excel Certified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider-line" data-reveal-divider></div>

        {/* CONTACT SECTION */}
        <section className="section contact-section" id="contact">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info reveal">
                <span className="section-eyebrow">Initiate Contact</span>
                <h2 className="section-title">Ready to Discuss Operations Leadership.</h2>
                <p>
                  Available for Shift Manager, Assistant Restaurant Manager, Operations Executive, and Fleet Operations roles across Chennai and surrounding locations.
                </p>

                <div className="contact-methods">
                  <div className="contact-method-card">
                    <div className="method-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div className="method-details">
                      <span className="method-label">Direct Email</span>
                      <span className="method-value" id="emailDisplay">dharangiri144@gmail.com</span>
                    </div>
                    <button
                      type="button"
                      className="copy-email-btn"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      style={copiedEmail ? { background: 'var(--color-gold)', color: '#0b0c0e' } : {}}
                    >
                      {copiedEmail ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  

                  <div className="contact-method-card">
                    <div className="method-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div className="method-details">
                      <span className="method-label">Current Location</span>
                      <span className="method-value">Chennai, Tamil Nadu, India</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-form-card reveal stagger-1">
                <h3 className="form-title">Send a Direct Inquiry</h3>
                <p className="form-subtitle">Messages launch directly to my primary inbox.</p>

                <form id="portfolioContactForm" onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="contactName" className="form-label">Your Name</label>
                    <input type="text" id="contactName" name="name" className="form-input" placeholder="e.g. Anand Kumar" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactEmail" className="form-label">Email Address</label>
                    <input type="email" id="contactEmail" name="email" className="form-input" placeholder="anand@company.com" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactSubject" className="form-label">Role or Project Discussion</label>
                    <input type="text" id="contactSubject" name="subject" className="form-input" placeholder="e.g. Operations Manager Position" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactMessage" className="form-label">Message</label>
                    <textarea id="contactMessage" name="message" className="form-textarea" rows="4" placeholder="Brief outline of the role, location, or project scope..." required></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary form-submit-btn">
                    Send Direct Message
                    <svg viewBox="0 0 24 24" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>

                  {formFeedback && (
                    <div className="form-feedback is-success" role="status" aria-live="polite">
                      Launching email client to dharangiri144@gmail.com...
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <h4>Giridharan G V</h4>
              <p>Operations Executive • MS Excel Certified • Chennai, Tamil Nadu</p>
            </div>

            <ul className="footer-nav">
              <li><a href="#about">About</a></li>
              <li><a href="#numbers">Metrics</a></li>
              <li><a href="#certifications">Certification</a></li>
              <li><a href="#experience">Career</a></li>
              <li><a href="#skills">Competencies</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} Giridharan G V. 100% verified experience portfolio.
            </div>

            <a href="#hero" className="back-to-top-btn" aria-label="Back to top of the page">
              Back to top
              <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
