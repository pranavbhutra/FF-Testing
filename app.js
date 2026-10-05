/* ============================================================
   FabFashion — Shared JavaScript
   All pages + Admin Dashboard
   ============================================================ */

'use strict';

/* ============================================================
   UTILITY: Simple LocalStorage DB
   ============================================================ */
const DB = {
  get(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) {
    try { 
      localStorage.setItem(key, JSON.stringify(value)); 
      return true; 
    } catch (err) { 
      if (typeof showToast === 'function') {
        showToast('Storage Limit Exceeded! Please use a smaller image.', 'error');
      }
      return false; 
    }
  }
};

/* ============================================================
   UTILITY: Modal Helpers
   ============================================================ */
window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
};
window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
};

// Close modals on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      e.target.classList.remove('open');
    }
  });
});

/* ============================================================
   UTILITY: Toast Notifications
   ============================================================ */
function showToast(message, type = 'gold', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 450);
  }, duration);
}

/* ============================================================
   NAVBAR — Scroll behaviour + hamburger
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!navbar) return;

  // Scroll handler
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Mark active nav link (clean-URL aware)
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger siblings
        const siblings = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains('reveal')) : [];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = idx > 0 ? `${idx * 0.1}s` : '0s';
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   COUNT-UP ANIMATION
   ============================================================ */
  // ---- Scroll Reveal Animation ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(r => revealObserver.observe(r));
(function initCountUp() {
  // ---- Live Counters Animation ----
  const liveCounters = document.querySelectorAll('.live-counter');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const updateCounter = () => {
          current += step;
          if (current < target) {
            entry.target.innerText = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.innerText = target.toLocaleString();
          }
        };
        updateCounter();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  liveCounters.forEach(c => counterObserver.observe(c));
})();

/* ============================================================
   FOOTER: Secret Logo Click (5x â†’ admin)
   ============================================================ */
(function initFooterSecret() {
  const footerLogo = document.getElementById('footer-logo');
  const secretDot = document.getElementById('footer-secret-dot');
  let clickCount = 0;
  let resetTimer;

  function handleSecretClick() {
    clickCount++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { clickCount = 0; }, 3000);
    if (clickCount >= 5) {
      clickCount = 0;
      window.location.href = 'admin.html';
    }
  }

  if (footerLogo) footerLogo.addEventListener('click', handleSecretClick);
  if (secretDot) secretDot.addEventListener('click', handleSecretClick);
})();

/* ============================================================
   COLLECTIONS FILTER
   ============================================================ */
(function initCollectionsFilter() {
  const filterBar = document.getElementById('filter-bar');
  if (!filterBar) return;

  const pills = filterBar.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.fabric-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ============================================================
   CONTACT FORM — Homepage
   ============================================================ */
(function initContactForm() {
  const form = document.getElementById('homepage-contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const consentCb = form.querySelector('#hf-consent');
  const nameEl = form.querySelector('#hf-name');
  const emailEl = form.querySelector('#hf-email');
  let submitting = false;

  function isValid() {
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    return !!name && !!email && email.includes('@') && email.includes('.') &&
      name.length <= 100 && email.length <= 254 && !!consentCb?.checked;
  }
  function refreshButtonState() {
    if (submitBtn) submitBtn.disabled = submitting || !isValid();
  }
  [nameEl, emailEl, consentCb].forEach(el => {
    el && el.addEventListener('input', refreshButtonState);
    el && el.addEventListener('change', refreshButtonState);
  });
  refreshButtonState();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting || !isValid()) { refreshButtonState(); return; }

    const name = sanitizeInput(nameEl.value.trim());
    const company = sanitizeInput(form.querySelector('#hf-company').value.trim());
    const email = sanitizeInput(emailEl.value.trim());
    const phone = sanitizeInput(form.querySelector('#hf-phone').value.trim());
    const message = sanitizeInput(form.querySelector('#hf-message').value.trim());
    if (message.length > 2000) { showToast('Message is too long. Please shorten it.', 'error'); return; }

    // Anti-Spam Honeypot check — treat as success but do nothing (bot trap)
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') {
      form.reset();
      showToast('Enquiry sent! We\'ll be in touch within 24 hours.', 'success');
      return;
    }

    const wantsNewsletter = !!form.querySelector('#hf-newsletter')?.checked;
    const fabricInterest = form.querySelector('#hf-fabric')?.value || null;
    const inquiry = { name, company, email, phone, message, fabric: fabricInterest };

    submitting = true;
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    const result = await submitEnquiry(inquiry);

    if (wantsNewsletter) {
      insertSubscriberSupabase(email).catch(err => console.warn('Newsletter opt-in failed:', err));
    }

    submitting = false;
    if (submitBtn) submitBtn.innerHTML = originalText;

    if (result.ok) {
      showToast('Enquiry sent! We\'ll be in touch within 24 hours.', 'success');
      form.reset();
    } else {
      showToast('Something went wrong sending your enquiry. Please try again or WhatsApp/call us directly.', 'error');
    }
    refreshButtonState();
  });
})();

/* ============================================================
   CONTACT FORM — Contact Page
   ============================================================ */
(function initContactPageForm() {
  const form = document.getElementById('contact-page-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const consentCb = form.querySelector('#cf-consent');
  const nameEl = form.querySelector('#cf-name');
  const companyEl = form.querySelector('#cf-company');
  const emailEl = form.querySelector('#cf-email');
  const phoneEl = form.querySelector('#cf-phone');
  const messageEl = form.querySelector('#cf-message');
  let submitting = false;

  function isValid() {
    const name = nameEl.value.trim(), company = companyEl.value.trim(),
      email = emailEl.value.trim(), phone = phoneEl.value.trim(), message = messageEl.value.trim();
    return !!name && !!company && !!email && !!phone && !!message &&
      email.includes('@') && email.includes('.') &&
      name.length <= 100 && email.length <= 254 && message.length <= 2000 &&
      !!consentCb?.checked;
  }
  function refreshButtonState() {
    if (submitBtn) submitBtn.disabled = submitting || !isValid();
  }
  [nameEl, companyEl, emailEl, phoneEl, messageEl, consentCb].forEach(el => {
    el && el.addEventListener('input', refreshButtonState);
    el && el.addEventListener('change', refreshButtonState);
  });
  refreshButtonState();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting || !isValid()) { refreshButtonState(); return; }

    const name = sanitizeInput(nameEl.value.trim());
    const company = sanitizeInput(companyEl.value.trim());
    const email = sanitizeInput(emailEl.value.trim());
    const phone = sanitizeInput(phoneEl.value.trim());
    const message = sanitizeInput(messageEl.value.trim());

    // Anti-Spam Honeypot check — treat as success but do nothing (bot trap)
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') {
      form.reset();
      showToast('Enquiry sent! We\'ll be in touch within 24 hours.', 'success');
      return;
    }

    const wantsNewsletter = !!form.querySelector('#cf-newsletter')?.checked;
    const fabricInterest = form.querySelector('#cf-fabric')?.value || null;
    const inquiry = { name, company, email, phone, message, fabric: fabricInterest };

    submitting = true;
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

    const result = await submitEnquiry(inquiry);

    if (wantsNewsletter) {
      insertSubscriberSupabase(email).catch(err => console.warn('Newsletter opt-in failed:', err));
    }

    submitting = false;
    if (submitBtn) submitBtn.innerHTML = originalText;

    if (result.ok) {
      showToast('Enquiry sent! We\'ll be in touch within 24 hours.', 'success');
      form.reset();
    } else {
      showToast('Something went wrong sending your enquiry. Please try again or WhatsApp/call us directly.', 'error');
    }
    refreshButtonState();
  });
})();

/* ============================================================
   NEWSLETTER FORM
   ============================================================ */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  let submitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? sanitizeInput(emailInput.value.trim()) : '';
    if (email.length > 254) { showToast('Email too long.', 'error'); return; }
    if (!email || !email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Anti-Spam Honeypot check
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value.trim() !== '') {
      form.reset();
      showToast('✨ Subscribed! Thank you for joining us.', 'success');
      return;
    }

    submitting = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Subscribing...'; }

    try {
      await insertSubscriberSupabase(email);
      sendEnquiryEmail({ name: 'Newsletter Subscriber', email, message: 'New subscription to FabFashion catalog updates' })
        .catch(() => {});
      showToast('✨ Subscribed! Thank you for joining us.', 'success');
      form.reset();
    } catch (err) {
      console.error('Newsletter subscribe failed:', err);
      showToast('Something went wrong subscribing. Please try again shortly.', 'error');
    } finally {
      submitting = false;
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
    }
  });
})();

/* ============================================================
   TESTIMONIALS AUTO-SCROLL (INTERSECTION-OBSERVED RAF)
   ============================================================ */
(function initTestimonials() {
  const track = document.getElementById('testimonials-track');
  const wrap = document.getElementById('testimonials-wrap');
  if (!track || !wrap) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  let isVisible = false;
  let rafId = null;
  let lastTime = 0;

  function step(time) {
    if (!isVisible || isDown) return;
    if (time - lastTime > 30) {
      lastTime = time;
      wrap.scrollLeft += 1;
      if (wrap.scrollLeft >= wrap.scrollWidth - wrap.clientWidth - 5) {
        wrap.scrollLeft = 0;
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function startAutoScroll() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(step);
  }
  function stopAutoScroll() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) startAutoScroll();
        else stopAutoScroll();
      });
    }, { threshold: 0.05 });
    obs.observe(wrap);
  } else {
    isVisible = true;
    startAutoScroll();
  }

  wrap.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
    stopAutoScroll();
    wrap.style.cursor = 'grabbing';
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.style.cursor = 'grab'; if (isVisible) startAutoScroll(); });
  wrap.addEventListener('mouseup', () => { isDown = false; wrap.style.cursor = 'grab'; if (isVisible) startAutoScroll(); });
  wrap.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX);
  });
  wrap.addEventListener('touchstart', (e) => { isDown = true; startX = e.touches[0].pageX - wrap.offsetLeft; scrollLeft = wrap.scrollLeft; stopAutoScroll(); }, { passive: true });
  wrap.addEventListener('touchend', () => { isDown = false; if (isVisible) startAutoScroll(); }, { passive: true });
})();

/* ============================================================
   WHY US — TAB SWITCHER
   ============================================================ */
(function initTabs() {
  const tabsNav = document.getElementById('tabs-nav');
  if (!tabsNav) return;

  const buttons = tabsNav.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
})();

/* ============================================================
   GLOBAL STATE
   ============================================================ */
let currentUser = null;

/* ============================================================
   GLOBAL: Write Edit Log
   ============================================================ */
function writeLog(action) {
  const logs = DB.get('ff_edit_log', []);
  logs.unshift({ action, user: currentUser?.username || '?', time: new Date().toISOString() });
  DB.set('ff_edit_log', logs);
}

/* ============================================================
   GLOBAL: Default Collections + getCollections
   ============================================================ */
const defaultCollections = [
  { id:'c1', name:'Oxford Weave', category:'cotton', composition:'100% Cotton', weight:'110–130 GSM', description:'Classic basket-weave construction.', imageUrl:'images/oxford_fabric.webp', priceLabel:'₹ Contact for Pricing', showInGallery: true },
  { id:'c2', name:'Twill Fabric', category:'cotton', composition:'100% Cotton', weight:'120–145 GSM', description:'Diagonal ribbed pattern with smooth finish.', imageUrl:'images/twill_fabric.webp', priceLabel:'₹ Contact for Pricing', showInGallery: true },
  { id:'c3', name:'Poplin & Stripes', category:'cotton', composition:'100% Cotton', weight:'90–115 GSM', description:'Ultra-fine tightly woven poplin.', imageUrl:'images/poplin_fabric.webp', priceLabel:'₹ Contact for Pricing', showInGallery: true },
  { id:'c4', name:'Herringbone Pattern', category:'blends', composition:'Cotton / Poly Blend', weight:'130–160 GSM', description:'V-shaped weave with sophisticated visual texture.', imageUrl:'images/herringbone_fabric.webp', priceLabel:'₹ Contact for Pricing', showInLaunched: true },
  { id:'c5', name:'Custom Weaves', category:'custom', composition:'As Specified', weight:'Custom GSM', description:'Bespoke weave patterns crafted for your brand.', imageUrl:'images/custom_fabric.webp', priceLabel:'₹ Contact for Pricing' },
  { id:'c6', name:'Linen Blend', category:'linen', composition:'Linen / Cotton Blend', weight:'140–180 GSM', description:'Natural breathability with cotton comfort.', imageUrl:'images/linen_fabric.webp', priceLabel:'₹ Contact for Pricing' },
];

function getUniqueCategories(cols) {
  const cats = new Set();
  cols.forEach(c => {
    if (c.category) cats.add(c.category.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'));
  });
  const order = ['cotton', 'linen', 'blends', 'custom'];
  const finalCats = [...order];
  cats.forEach(c => {
    if (!order.includes(c) && c) finalCats.push(c);
  });
  return finalCats;
}

function formatCatName(str) {
  if (str === 'blends') return 'Blends';
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getCollections() {
  return liveCollectionsCache && liveCollectionsCache.length ? liveCollectionsCache : defaultCollections;
}

let liveCollectionsCache = null;

/**
 * Public pages read collections straight from Supabase using the anon key
 * (RLS on the `collections` table allows anon SELECT only — see
 * supabase/schema.sql). This is what makes admin-panel edits to the fabric
 * catalog actually show up for real visitors, instead of only existing in
 * the admin's own browser localStorage.
 */
async function refreshPublicCollectionsCache() {
  const cfg = window.FABFASHION_CONFIG;
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) return;
  try {
    const res = await fetch(`${cfg.SUPABASE_URL}/rest/v1/ff_collections?select=*&order=created_at.asc`, {
      headers: { apikey: cfg.SUPABASE_KEY, Authorization: `Bearer ${cfg.SUPABASE_KEY}` }
    });
    if (!res.ok) return;
    const rows = await res.json();
    if (!Array.isArray(rows) || !rows.length) return; // keep defaultCollections fallback
    // Columns already match the shape the rest of the app expects (imageUrl,
    // priceLabel, showInGallery, showInLaunched are already camelCase in the
    // real ff_collections table) — just filter out anything marked hidden.
    liveCollectionsCache = rows.filter(r => !r.isHidden);
    // Re-render whichever sections are on this page, now with live data.
    if (document.getElementById('full-collections-grid') && typeof initCollectionsPage === 'function') {
      initCollectionsPage();
    }
    if (typeof initHomepageDynamicSections === 'function') {
      initHomepageDynamicSections();
    }
  } catch (err) {
    console.warn('Could not load live collections from Supabase, showing defaults:', err);
  }
}

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */
(function initAdmin() {
  if (!document.body.classList.contains('admin-body')) return;

  // ---- State ----
  let editingCollection = null;
  let editingUser = null;
  let pendingFabricData = null;
  let pendingLimitType = null;
  let inquiriesCache = [];
  let collectionsCache = [];
  let subscribersCache = [];
  let usersCache = [];
  let editLogCache = [];

  // ---- DOM refs ----
  const loginScreen = document.getElementById('login-screen');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');
  const currentUserDisplay = document.getElementById('current-user');
  const navItems = document.querySelectorAll('.admin-nav-item');
  const adminTabs = document.querySelectorAll('.admin-tab');

  async function apiCall(url, options = {}) {
    const res = await fetch(url, {
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    let data = null;
    try { data = await res.json(); } catch { /* no body */ }
    if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
    return data;
  }

  function writeLog(action) {
    apiCall('/api/edit-log', { method: 'POST', body: JSON.stringify({ action }) }).catch(() => {});
  }

  // ---- Login (real server-side session — no credentials ever stored client-side) ----
  async function restoreSession() {
    try {
      const me = await apiCall('/api/admin-me');
      currentUser = { username: me.username, role: me.role };
      showDashboard();
      return true;
    } catch {
      return false;
    }
  }

  function showDashboard() {
    loginScreen.style.display = 'none';
    dashboard.style.display = 'flex';
    if (currentUserDisplay) currentUserDisplay.textContent = currentUser.username;
    applyRoleRestrictions();
    renderDashboard();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const u = document.getElementById('admin-username').value.trim();
      const p = document.getElementById('admin-password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Verifying...'; }
      if (loginError) loginError.textContent = '';
      try {
        const result = await apiCall('/api/admin-login', {
          method: 'POST',
          body: JSON.stringify({ username: u, password: p })
        });
        currentUser = { username: result.username, role: result.role };
        showDashboard();
        writeLog('Logged in');
      } catch (err) {
        if (loginError) loginError.textContent = err.message || 'Invalid username or password.';
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Sign In'; }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      writeLog('Logged out');
      try { await apiCall('/api/admin-logout', { method: 'POST' }); } catch {}
      currentUser = null;
      dashboard.style.display = 'none';
      loginScreen.style.display = 'flex';
    });
  }

  restoreSession();

  // ---- Tab Navigation ----
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      adminTabs.forEach(t => t.classList.remove('active'));
      item.classList.add('active');
      const tabId = 'tab-' + item.dataset.tab;
      const tab = document.getElementById(tabId);
      if (tab) tab.classList.add('active');
      renderCurrentTab(item.dataset.tab);
    });
  });

  function renderCurrentTab(tabName) {
    switch(tabName) {
      case 'inquiries': renderInquiries(); break;
      case 'collections': renderCollections(); break;
      case 'users': renderUsers(); break;
      case 'subscribers': renderSubscribers(); break;
      case 'testimonials': renderAdminTestimonials(); break;
      case 'editlog': renderEditLog(); break;
    }
  }

  function applyRoleRestrictions() {
    const isEditor = currentUser?.role === 'editor';
    const navUsers = document.getElementById('nav-users');
    const navEditLog = document.getElementById('nav-editlog');
    const statUsers = document.getElementById('stat-users');
    const navTestimonials = document.getElementById('nav-testimonials');

    if (isEditor) {
      if (navUsers) navUsers.style.display = 'none';
      if (navEditLog) navEditLog.style.display = 'none';
      if (statUsers && statUsers.parentElement) statUsers.parentElement.style.display = 'none';
      if (navTestimonials) navTestimonials.style.display = 'none';
      
      const activeTab = document.querySelector('.admin-nav-item.active');
      if (activeTab && (activeTab.dataset.tab === 'users' || activeTab.dataset.tab === 'editlog' || activeTab.dataset.tab === 'testimonials')) {
        document.getElementById('nav-inquiries').click();
      }
    } else {
      if (navUsers) navUsers.style.display = '';
      if (navEditLog) navEditLog.style.display = '';
      if (statUsers && statUsers.parentElement) statUsers.parentElement.style.display = '';
      if (navTestimonials) navTestimonials.style.display = '';
    }
  }

  async function renderDashboard() {
    await renderInquiries();
  }

  // ---- Stats ----
  function renderStats() {
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('stat-inquiries', inquiriesCache.length);
    setVal('stat-unread', inquiriesCache.filter(i => i.status === 'unread').length);
    setVal('stat-collections', collectionsCache.length || 6);
    setVal('stat-users', usersCache.length);
  }

  // ---- INQUIRIES ----
  async function renderInquiries() {
    const tbody = document.getElementById('inquiries-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-light);padding:2rem;">Loading…</td></tr>';
    try {
      inquiriesCache = await apiCall('/api/enquiries');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:#b91c1c;padding:2rem;">Failed to load enquiries: ${escHtml(err.message)}</td></tr>`;
      return;
    }
    if (!inquiriesCache.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-light);padding:2rem;">No enquiries yet.</td></tr>';
      renderStats();
      return;
    }
    tbody.innerHTML = inquiriesCache.map(inq => `
      <tr>
        <td class="${inq.status === 'unread' ? 'unread' : ''}" style="white-space:nowrap;">${escHtml(inq.name)}</td>
        <td style="white-space:nowrap;">${escHtml(inq.company || '—')}</td>
        <td style="white-space:nowrap;"><a href="mailto:${escHtml(inq.email)}">${escHtml(inq.email)}</a></td>
        <td style="white-space:nowrap;">${escHtml(inq.phone || '—')}</td>
        <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escHtml(inq.message)}">${escHtml(inq.message || '—')}</td>
        <td style="white-space:nowrap;"><span class="status-badge status-${inq.status}">${inq.status}</span></td>
        <td style="white-space:nowrap;font-size:0.75rem;">${formatDate(inq.created_at)}</td>
        <td style="white-space:nowrap;">
          <button class="btn-action btn-read" onclick="adminMarkRead('${inq.id}')">Mark Read</button>
          <button class="btn-action btn-delete" onclick="adminDeleteInquiry('${inq.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
    renderStats();
  }

  window.adminMarkRead = async function(id) {
    const inq = inquiriesCache.find(i => i.id === id);
    if (!inq) return;
    const newStatus = inq.status === 'unread' ? 'read' : 'unread';
    try {
      await apiCall('/api/enquiries', { method: 'PATCH', body: JSON.stringify({ id, status: newStatus }) });
      writeLog(`Marked enquiry from ${inq.name} as ${newStatus}`);
      await renderInquiries();
    } catch (err) {
      showToast(`Failed to update enquiry: ${err.message}`, 'error');
    }
  };

  window.adminDeleteInquiry = async function(id) {
    if (!confirm('Delete this enquiry?')) return;
    const inq = inquiriesCache.find(i => i.id === id);
    try {
      await apiCall(`/api/enquiries?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      writeLog(`Deleted enquiry from ${inq ? inq.name : id}`);
      showToast('Enquiry deleted.', 'error');
      await renderInquiries();
    } catch (err) {
      showToast(`Failed to delete enquiry: ${err.message}`, 'error');
    }
  };

  // ---- COLLECTIONS ----
  // ff_collections already stores columns in the same camelCase shape the
  // rest of the app uses (imageUrl, priceLabel, showInGallery, showInLaunched)
  // so no field-name translation is needed here anymore.
  function mapDbCollection(r) { return r; }
  function mapToDbCollection(c) { return c; }

  async function renderCollections() {
    const tbody = document.getElementById('collections-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">Loading…</td></tr>';
    try {
      const rows = await apiCall('/api/collections');
      collectionsCache = rows.map(mapDbCollection);
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#b91c1c;padding:2rem;">Failed to load collections: ${escHtml(err.message)}</td></tr>`;
      return;
    }
    const cols = collectionsCache;
    tbody.innerHTML = cols.map(c => `
      <tr>
        <td><img src="${escHtml(c.imageUrl)}" style="width:48px;height:36px;object-fit:cover;border-radius:6px;" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" onerror="this.src='images/oxford_fabric.webp'" /></td>
        <td>${escHtml(c.name)}</td>
        <td>${escHtml(c.category)}</td>
        <td>${escHtml(c.composition)}</td>
        <td>${escHtml(c.weight)}</td>
        <td>${escHtml(c.priceLabel)}</td>
        <td>
          <button class="btn-action btn-edit" onclick="adminEditCollection('${c.id}')">Edit</button>
          <button class="btn-action btn-delete" onclick="adminDeleteCollection('${c.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
    renderStats();
  }

  window.addAdminColorInput = function(colorObj = null) {
    const container = document.getElementById('col-colors-container');
    if (!container) return;
    
    let cName = '';
    let cHex = '#000000';
    if (typeof colorObj === 'string' && colorObj) {
      cName = colorObj;
      const mapped = getColorHex(cName);
      // Hack to get real hex from css color name
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.fillStyle = mapped;
      cHex = ctx.fillStyle; 
    } else if (colorObj && typeof colorObj === 'object') {
      cName = colorObj.name || '';
      cHex = colorObj.hex || '#000000';
    }

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.gap = '0.5rem';
    div.style.alignItems = 'center';
    div.className = 'admin-color-row';
    div.innerHTML = `
      <input type="color" class="col-color-picker" value="${cHex}" style="width:36px; height:36px; padding:0; border:1px solid #ccc; border-radius:4px; cursor:pointer; flex-shrink:0;" title="Pick exact color" oninput="this.nextElementSibling.nextElementSibling.value = this.value" />
      <input type="text" class="col-color-input" placeholder="e.g. Navy Blue" value="${escHtml(cName)}" style="flex:1; padding:0.4rem; border:1px solid #ccc; border-radius:4px;" oninput="
        const mapped = getColorHex(this.value);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillStyle = mapped;
        const res1 = ctx.fillStyle;
        ctx.fillStyle = '#ffffff';
        ctx.fillStyle = mapped;
        const res2 = ctx.fillStyle;
        if(res1 === res2 && res1.startsWith('#') && res1.length === 7) {
          this.previousElementSibling.value = res1;
          this.nextElementSibling.value = res1;
        }
      " />
      <input type="text" class="col-color-hex-input" placeholder="Hex/RGB" value="${cHex}" style="width:90px; padding:0.4rem; border:1px solid #ccc; border-radius:4px; font-family:monospace; font-size:0.85rem;" oninput="
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillStyle = this.value;
        const res1 = ctx.fillStyle;
        ctx.fillStyle = '#ffffff';
        ctx.fillStyle = this.value;
        const res2 = ctx.fillStyle;
        if(res1 === res2 && res1.startsWith('#') && res1.length === 7) {
          this.previousElementSibling.previousElementSibling.value = res1;
        }
      " />
      <button type="button" onclick="this.parentElement.remove()" style="background:none;border:none;color:red;cursor:pointer;font-weight:bold;font-size:1.2rem;padding:0 0.5rem;" title="Remove Color">&times;</button>
    `;
    container.appendChild(div);
  };

  window.adminEditCollection = function(id) {
    editingCollection = collectionsCache.find(c => c.id === id);
    if (!editingCollection) return;
    document.getElementById('col-name').value = editingCollection.name;
    document.getElementById('col-category').value = editingCollection.category;
    document.getElementById('col-composition').value = editingCollection.composition;
    document.getElementById('col-weight').value = editingCollection.weight;
    if (document.getElementById('col-uses')) document.getElementById('col-uses').value = editingCollection.uses || (editingCollection.attributes && editingCollection.attributes.uses) || '';
    if (document.getElementById('col-finish')) document.getElementById('col-finish').value = editingCollection.finish || (editingCollection.attributes && editingCollection.attributes.finish) || '';
    document.getElementById('col-desc').value = editingCollection.description;
    const colorContainer = document.getElementById('col-colors-container');
    if (colorContainer) {
      colorContainer.innerHTML = '';
      if (editingCollection.colors && editingCollection.colors.length > 0) {
        editingCollection.colors.forEach(c => addAdminColorInput(c));
      } else {
        addAdminColorInput('');
      }
    }
    document.getElementById('col-image').value = '';
      const hint = document.getElementById('col-image-hint');
      if (hint) hint.textContent = editingCollection.imageUrl ? 'Image already saved. Upload a new one to replace it.' : '';
    document.getElementById('col-price').value = editingCollection.priceLabel;
      document.getElementById('col-gallery').checked = !!editingCollection.showInGallery;
      document.getElementById('col-launched').checked = !!editingCollection.showInLaunched;
    document.getElementById('collection-modal-title').textContent = 'Edit Fabric';
    openModal('collection-modal');
  };

  window.adminDeleteCollection = async function(id) {
    if (!confirm('Delete this fabric?')) return;
    const col = collectionsCache.find(c => c.id === id);
    try {
      await apiCall(`/api/collections?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      writeLog(`Deleted fabric: ${col ? col.name : id}`);
      showToast('Fabric deleted.', 'error');
      await renderCollections();
    } catch (err) {
      showToast(`Failed to delete fabric: ${err.message}`, 'error');
    }
  };

  window.adminAddCollection = function() {
    editingCollection = null;
    const form = document.getElementById('collection-form');
    if (form) form.reset();
    const colorContainer = document.getElementById('col-colors-container');
    if (colorContainer) {
      colorContainer.innerHTML = '';
      addAdminColorInput('');
    }
      const hint = document.getElementById('col-image-hint');
      if (hint) hint.textContent = '';
      if (document.getElementById('col-gallery')) document.getElementById('col-gallery').checked = false;
      if (document.getElementById('col-launched')) document.getElementById('col-launched').checked = false;
    document.getElementById('collection-modal-title').textContent = 'Add Fabric';
    openModal('collection-modal');
  };

  const colForm = document.getElementById('collection-form');
  if (colForm) {
    colForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cols = collectionsCache;
      
      let imageUrl = editingCollection ? editingCollection.imageUrl : 'images/hero_fabric.png';
      const fileInput = document.getElementById('col-image');
      if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        imageUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
              } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              // compress as JPEG to save huge amount of storage
              resolve(canvas.toDataURL('image/jpeg', 0.7)); 
            };
            img.src = evt.target.result;
          };
          reader.readAsDataURL(file);
        });
      }

      const data = {
        id: editingCollection ? editingCollection.id : 'c' + Date.now(),
        name: sanitizeInput(document.getElementById('col-name').value.trim()),
        category: sanitizeInput(document.getElementById('col-category').value),
        composition: sanitizeInput(document.getElementById('col-composition').value.trim()),
        weight: sanitizeInput(document.getElementById('col-weight').value.trim()),
        uses: document.getElementById('col-uses') ? sanitizeInput(document.getElementById('col-uses').value.trim()) : '',
        finish: document.getElementById('col-finish') ? sanitizeInput(document.getElementById('col-finish').value.trim()) : '',
        description: sanitizeInput(document.getElementById('col-desc').value.trim()),
        colors: Array.from(document.querySelectorAll('.admin-color-row')).map(row => {
          const name = sanitizeInput(row.querySelector('.col-color-input').value.trim());
          const hex = row.querySelector('.col-color-picker').value;
          return name ? { name, hex } : null;
        }).filter(c => c),
        imageUrl: imageUrl,
        priceLabel: sanitizeInput(document.getElementById('col-price').value.trim()),
        showInGallery: document.getElementById('col-gallery').checked,
        showInLaunched: document.getElementById('col-launched').checked,
      };

      // Check Limits (Max 6)
      const otherCols = cols.filter(c => c.id !== data.id);
      const galleryCount = otherCols.filter(c => c.showInGallery).length;
      const launchedCount = otherCols.filter(c => c.showInLaunched).length;

      if (data.showInGallery && galleryCount >= 6) {
        pendingFabricData = data;
        pendingLimitType = 'gallery';
        showLimitReplacementUI('Gallery', otherCols.filter(c => c.showInGallery));
        return;
      }
      if (data.showInLaunched && launchedCount >= 6) {
        pendingFabricData = data;
        pendingLimitType = 'launched';
        showLimitReplacementUI('Just Launched', otherCols.filter(c => c.showInLaunched));
        return;
      }

      saveFabricFinal(data, cols);
    });
  }

  async function saveFabricFinal(data, cols) {
    if (!confirm('Are you sure you want to save this fabric?')) return;
    try {
      if (editingCollection) {
        await apiCall('/api/collections', { method: 'PATCH', body: JSON.stringify({ id: data.id, ...mapToDbCollection(data) }) });
        writeLog(`Edited fabric: ${data.name}`);
        showToast(`Fabric "${data.name}" updated.`, 'success');
      } else {
        await apiCall('/api/collections', { method: 'POST', body: JSON.stringify(mapToDbCollection(data)) });
        writeLog(`Added fabric: ${data.name}`);
        showToast(`Fabric "${data.name}" added.`, 'success');
      }
      closeModal('collection-modal');
      await renderCollections();
    } catch (err) {
      showToast(`Failed to save fabric: ${err.message}`, 'error');
    }
  }

  window.showLimitReplacementUI = function(sectionName, currentItems) {
    closeModal('collection-modal');
    document.getElementById('limit-modal-title').textContent = `${sectionName} Limit Reached`;
    document.getElementById('limit-modal-desc').textContent = `Maximum 6 fabrics allowed in the ${sectionName} section. Please select one to replace:`;
    
    const list = document.getElementById('limit-modal-list');
    list.innerHTML = currentItems.map(c => `
      <label class="limit-replace-item" style="display:flex; align-items:center; gap:1rem; padding:0.75rem; border:1px solid #ddd; border-radius:6px; margin-bottom:0.5rem; cursor:pointer;">
        <input type="radio" name="replace_fabric_id" value="${c.id}" />
        <img src="${escHtml(c.imageUrl)}" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" />
        <span style="font-weight:600;">${escHtml(c.name)}</span>
      </label>
    `).join('');
    
    openModal('limit-modal');
  };

  window.confirmLimitReplacement = async function() {
    const selected = document.querySelector('input[name="replace_fabric_id"]:checked');
    if (!selected) {
      showToast('Please select a fabric to replace.', 'error');
      return;
    }
    const replaceId = selected.value;
    const cols = collectionsCache;
    const toReplace = cols.find(c => c.id === replaceId);
    if (toReplace) {
      if (pendingLimitType === 'gallery') toReplace.showInGallery = false;
      if (pendingLimitType === 'launched') toReplace.showInLaunched = false;
      try {
        await apiCall('/api/collections', {
          method: 'PATCH',
          body: JSON.stringify({ id: toReplace.id, ...mapToDbCollection(toReplace) })
        });
      } catch (err) {
        showToast(`Failed to update replaced fabric: ${err.message}`, 'error');
        return;
      }
    }

    // Check if the other limit is also reached
    const otherCols = cols.filter(c => c.id !== pendingFabricData.id);
    if (pendingLimitType === 'gallery' && pendingFabricData.showInLaunched) {
      const launchedCount = otherCols.filter(c => c.showInLaunched).length;
      if (launchedCount >= 6) {
        pendingLimitType = 'launched';
        showLimitReplacementUI('Just Launched', otherCols.filter(c => c.showInLaunched));
        return;
      }
    }

    closeModal('limit-modal');
    await saveFabricFinal(pendingFabricData, cols);
  };

  window.cancelLimitReplacement = function() {
    closeModal('limit-modal');
    openModal('collection-modal');
  };


  // ---- SUBSCRIBERS ----
  async function renderSubscribers() {
    const tbody = document.getElementById('subscribers-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:2rem;">Loading…</td></tr>';
    try {
      subscribersCache = await apiCall('/api/subscribers');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="2" style="text-align:center;color:#b91c1c;padding:2rem;">Failed to load subscribers: ${escHtml(err.message)}</td></tr>`;
      return;
    }
    if (!subscribersCache.length) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:2rem;color:var(--text-light);">No subscribers yet.</td></tr>';
      return;
    }
    tbody.innerHTML = subscribersCache.map(s => `
      <tr>
        <td style="font-weight:500;">${escHtml(s.email)}</td>
        <td style="text-align:right;">
          <button class="action-btn delete" onclick="adminDeleteSubscriber('${s.id}')" title="Delete">🗑️</button>
        </td>
      </tr>
    `).join('');
  }

  window.adminDeleteSubscriber = async function(id) {
    const sub = subscribersCache.find(s => s.id === id);
    if (!sub) return;
    if (!confirm(`Remove ${sub.email} from the subscriber list?`)) return;
    try {
      await apiCall(`/api/subscribers?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      writeLog(`Deleted subscriber: ${sub.email}`);
      showToast('Subscriber removed.', 'error');
      await renderSubscribers();
    } catch (err) {
      showToast(`Failed to remove subscriber: ${err.message}`, 'error');
    }
  };

  // ---- USERS ----
  async function renderUsers() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:2rem;">Loading…</td></tr>';
    try {
      usersCache = await apiCall('/api/admin-users');
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#b91c1c;padding:2rem;">Failed to load users: ${escHtml(err.message)}</td></tr>`;
      return;
    }
    tbody.innerHTML = usersCache.map(u => `
      <tr>
        <td>${escHtml(u.username)}</td>
        <td><span class="status-badge status-${u.role}">${u.role}</span></td>
        <td>
          ${u.username !== currentUser.username ? `<button class="btn-action btn-edit" onclick="adminEditUser('${u.id}')">Edit</button>` : '<span style="font-size:0.75rem;color:var(--text-light)">You</span>'}
          ${u.username !== currentUser.username ? `<button class="btn-action btn-delete" onclick="adminDeleteUser('${u.id}')">Delete</button>` : ''}
        </td>
      </tr>
    `).join('');
    renderStats();
  }

  window.adminEditUser = function(id) {
    editingUser = usersCache.find(u => u.id === id);
    if (!editingUser) return;
    document.getElementById('user-username').value = editingUser.username;
    document.getElementById('user-password').value = '';
    document.getElementById('user-password').placeholder = 'Leave blank to keep current password';
    document.getElementById('user-role').value = editingUser.role;
    document.getElementById('user-modal-title').textContent = 'Edit User';
    openModal('user-modal');
  };

  window.adminDeleteUser = async function(id) {
    const user = usersCache.find(u => u.id === id);
    if (!user) return;
    if (user.username === currentUser.username) { showToast('You cannot delete your own account.', 'error'); return; }
    if (!confirm('Delete this user?')) return;
    try {
      await apiCall(`/api/admin-users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      writeLog(`Deleted user: ${user.username}`);
      showToast('User deleted.', 'error');
      await renderUsers();
    } catch (err) {
      showToast(`Failed to delete user: ${err.message}`, 'error');
    }
  };

  window.adminAddUser = function() {
    editingUser = null;
    const form = document.getElementById('user-form');
    if (form) form.reset();
    document.getElementById('user-password').placeholder = '';
    document.getElementById('user-modal-title').textContent = 'Add User';
    openModal('user-modal');
  };

  const userForm = document.getElementById('user-form');
  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newUsername = sanitizeInput(document.getElementById('user-username').value.trim());
      const newPassword = document.getElementById('user-password').value;
      const newRole = document.getElementById('user-role').value;

      try {
        if (editingUser) {
          if (!newUsername) { showToast('Username required.', 'error'); return; }
          const patch = { id: editingUser.id, role: newRole };
          if (newPassword) patch.password = newPassword;
          await apiCall('/api/admin-users', { method: 'PATCH', body: JSON.stringify(patch) });
          writeLog(`Edited user: ${newUsername}`);
          showToast('User updated.', 'success');
        } else {
          if (!newUsername || !newPassword) { showToast('Username and password required.', 'error'); return; }
          if (usersCache.find(u => u.username === newUsername)) { showToast('Username already exists.', 'error'); return; }
          await apiCall('/api/admin-users', { method: 'POST', body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }) });
          writeLog(`Added user: ${newUsername}`);
          showToast('User added.', 'success');
        }
        closeModal('user-modal');
        await renderUsers();
      } catch (err) {
        showToast(`Failed to save user: ${err.message}`, 'error');
      }
    });
  }

  // ---- EDIT LOG ----
  async function renderEditLog() {
    const logList = document.getElementById('edit-log-list');
    if (!logList) return;
    logList.innerHTML = '<p style="text-align:center;padding:2rem;">Loading…</p>';
    try {
      editLogCache = await apiCall('/api/edit-log');
    } catch (err) {
      logList.innerHTML = `<p style="color:#b91c1c;text-align:center;padding:2rem;">Failed to load log: ${escHtml(err.message)}</p>`;
      return;
    }
    if (!editLogCache.length) {
      logList.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:2rem;">No actions logged yet.</p>';
      return;
    }
    logList.innerHTML = editLogCache.map(l => `
      <div class="log-entry">
        <span class="log-time">${formatDate(l.date || l.created_at)}</span>
        <span>${escHtml(l.action)}</span>
      </div>
    `).join('');
  }

  window.adminClearLog = async function() {
    if (currentUser?.role !== 'admin') { showToast('Only admins can clear logs.', 'error'); return; }
    if (!confirm('Clear all edit logs?')) return;
    try {
      await apiCall('/api/edit-log', { method: 'DELETE' });
      showToast('Edit log cleared.', 'gold');
      await renderEditLog();
    } catch (err) {
      showToast(`Failed to clear log: ${err.message}`, 'error');
    }
  };

  // (openModal and closeModal were extracted to global scope)

})();

/* ============================================================
   GLOBAL SHORTCUT (Ctrl/Cmd + Shift + A) → Admin Panel
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    e.stopPropagation();
    // Use explicit admin.html — do NOT use '/admin' (no routing on static server)
    window.location.href = 'admin.html';
  }
});


/* ============================================================
   HELPERS
   ============================================================ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
  } catch (e) {
    return iso;
  }
}

/* ============================================================
   IMAGE ROTATOR (CAROUSEL - INTERSECTION OBSERVED)
   ============================================================ */
(function initImageRotators() {
  const rotators = document.querySelectorAll('.image-rotator');
  if (!rotators.length) return;

  rotators.forEach(rotator => {
    const imgs = rotator.querySelectorAll('img');
    if (imgs.length <= 1) return;
    let curr = 0;
    let intervalId = null;

    function startRotation() {
      if (intervalId) return;
      intervalId = setInterval(() => {
        imgs[curr].classList.remove('active');
        curr = (curr + 1) % imgs.length;
        imgs[curr].classList.add('active');
      }, 3500);
    }

    function stopRotation() {
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) startRotation();
          else stopRotation();
        });
      }, { threshold: 0.1 });
      obs.observe(rotator);
    } else {
      startRotation();
    }
  });
})();

/* ============================================================
   LIGHTBOX GALLERY (Event Delegation)
   ============================================================ */
(function initLightbox() {
  let lightbox = document.querySelector('.lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<span class="lightbox-close">&times;</span><img src="" alt="Enlarged Image" title="Enlarged Image" />`;
    document.body.appendChild(lightbox);
  }
  
  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.lightbox-close');

  document.body.addEventListener('click', (e) => {
    const item = e.target.closest('.facility-item, .gallery-item');
    if (item) {
      const img = item.querySelector('img');
      if (img && lbImg) {
        lbImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  };

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
})();

/* Prevent Image Copying in Gallery */
(function protectGalleryImages() {
  const preventCopy = (e) => e.preventDefault();
  document.querySelectorAll('.facility-item img, .lightbox img').forEach(img => {
    img.addEventListener('contextmenu', preventCopy);
    img.addEventListener('dragstart', preventCopy);
  });
})();

/* ============================================================
   MARQUEE LOGIC & SETTINGS
   ============================================================ */
(function initMarquee() {
  const defaultMarquee = ["Poplin & Stripes", "Herringbone Pattern", "Custom Weaves Available", "50+ Years of Excellence", "ISO 9001:2015 Certified", "Oxford Weaves"];
  const track = document.getElementById('marquee-track');
  if (track) {
    const items = DB.get('ff_marquee', defaultMarquee);
    let html = '';
    for(let i=0; i<4; i++) {
      items.forEach(text => {
        html += '<span class="marquee-item">' + text + '</span><span class="marquee-item">&#x2726;</span>';
      });
    }
    track.innerHTML = html;
  }

  const saveSettingsBtn = document.getElementById('save-settings-btn');
  if (saveSettingsBtn) {
    const mqInput = document.getElementById('setting-marquee');
    const current = DB.get('ff_marquee', defaultMarquee);
    if(mqInput) mqInput.value = current.join(', ');

    saveSettingsBtn.addEventListener('click', () => {
      const val = sanitizeInput(mqInput.value.trim());
      if(val.length > 1000) { showToast('Text too long.', 'error'); return; }
      const arr = val.split(',').map(s => s.trim()).filter(s => s);
      DB.set('ff_marquee', arr.length ? arr : defaultMarquee);
      showToast('Settings saved! Refresh homepage to see changes.');
    });
  }
})();


/* ============================================================
   TESTIMONIALS LOGIC
   ============================================================ */
let editingTestimonial = null;

// NOTE FOR CONTENT TEAM / PRANAV:
// The fallback testimonials shown on the homepage (Rajesh Mehta, Priya Sharma, Ankit Joshi, Sameer Khan)
// are default placeholders per the site's fallback-when-empty logic.
// They should be replaced with real, verified client endorsements via the Admin Panel (/admin.html)
// before scaling up paid marketing or PR outreach campaigns.
function getTestimonials() {
  return DB.get('ff_testimonials', []);
}

function renderAdminTestimonials() {
  const tbody = document.getElementById('admin-testimonials-tbody');
  if (!tbody) return;
  const tests = getTestimonials();
  if (tests.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;padding:2rem;color:var(--text-light);">No testimonials found. Click 'Add Testimonial' to create one.</td></tr>`;
    return;
  }
  tbody.innerHTML = tests.map(t => `
    <tr>
      <td style="max-width:300px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(t.quote)}</td>
      <td>${t.author ? escHtml(t.author) : '<em>None</em>'}</td>
      <td>${t.company ? escHtml(t.company) : '<em>None</em>'}</td>
      <td>
        <button class="btn-action btn-edit" onclick="adminEditTestimonial('${t.id}')">Edit</button>
        <button class="btn-action btn-delete" onclick="adminDeleteTestimonial('${t.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.adminAddTestimonial = function() {
  editingTestimonial = null;
  const form = document.getElementById('testimonial-form');
  if (form) form.reset();
  document.getElementById('testimonial-modal-title').textContent = 'Add Testimonial';
  openModal('testimonial-modal');
};

window.adminEditTestimonial = function(id) {
  const tests = getTestimonials();
  editingTestimonial = tests.find(t => t.id === id);
  if (!editingTestimonial) return;
  document.getElementById('test-quote').value = editingTestimonial.quote;
  document.getElementById('test-author').value = editingTestimonial.author || '';
  document.getElementById('test-company').value = editingTestimonial.company || '';
  document.getElementById('testimonial-modal-title').textContent = 'Edit Testimonial';
  openModal('testimonial-modal');
};

window.adminDeleteTestimonial = function(id) {
  if (confirm('Are you sure you want to delete this testimonial?')) {
    let tests = getTestimonials();
    tests = tests.filter(t => t.id !== id);
    DB.set('ff_testimonials', tests);
    renderAdminTestimonials();
    writeLog('Deleted a testimonial');
    showToast('Testimonial deleted.', 'success');
  }
};

window.adminSaveTestimonial = function(e) {
  if (e) e.preventDefault();
  if (!confirm('Are you sure you want to save this testimonial?')) return false;
  try {
    const tests = getTestimonials();
    const quoteVal = sanitizeInput(document.getElementById('test-quote').value.trim());
    if (!quoteVal) {
      showToast('Quote is required.', 'error');
      return false;
    }
    const data = {
      id: editingTestimonial ? editingTestimonial.id : 't' + Date.now(),
      quote: quoteVal,
      author: sanitizeInput(document.getElementById('test-author').value.trim()),
      company: sanitizeInput(document.getElementById('test-company').value.trim()),
    };
    if (editingTestimonial) {
      const idx = tests.findIndex(t => t.id === editingTestimonial.id);
      if (idx > -1) tests[idx] = data;
      writeLog('Edited a testimonial');
      showToast('Testimonial updated.', 'success');
    } else {
      tests.push(data);
      writeLog('Added a testimonial');
      showToast('Testimonial added.', 'success');
    }
    const success = DB.set('ff_testimonials', tests);
    if (success) {
      renderAdminTestimonials();
      closeModal('testimonial-modal');
    } else {
      showToast('Error saving testimonial.', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Unexpected error occurred.', 'error');
  }
  return false;
};

function initHomepageTestimonials() {
  const track = document.getElementById('testimonials-track');
  const section = document.getElementById('testimonials');
  if (!track || !section) return;

  // Only replace hardcoded cards if there are admin-saved testimonials
  const saved = DB.get('ff_testimonials', null);
  if (!saved || !saved.length) {
    // Leave the hardcoded cards untouched; make sure section is visible
    section.style.display = '';
    return;
  }

  track.innerHTML = saved.map(t => {
    let authorHtml = '';
    if (t.author || t.company) {
      const auth = t.author ? '<strong>' + escHtml(t.author) + '</strong>' : '';
      const comp = t.company ? '<span>' + escHtml(t.company) + '</span>' : '';
      const initial = t.author ? escHtml(t.author.charAt(0).toUpperCase()) : 'O';
      authorHtml = `
        <div class="testimonial-author">
          <div class="testimonial-avatar">${initial}</div>
          <div class="testimonial-meta">
            ${auth}
            ${comp}
          </div>
        </div>
      `;
    }
    return `
      <div class="testimonial-card">
        <div class="testimonial-stars">â˜…â˜…â˜…â˜…â˜…</div>
        <p class="testimonial-text">"${escHtml(t.quote)}"</p>
        ${authorHtml}
      </div>
    `;
  }).join('');
  
  // Clone nodes if needed for infinite scroll effect (requires min 4-5 items)
  if (saved.length > 0 && saved.length < 5) {
      const clonesNeeded = 5 - saved.length;
      for (let i=0; i<clonesNeeded; i++) {
          track.innerHTML += track.children[i % saved.length].outerHTML;
      }
  }

}

// Attach initializers

/* ============================================================
   COLLECTIONS PAGE LOGIC
   ============================================================ */
function initCollectionsPage() {
  const grid = document.getElementById('full-collections-grid');
  if (!grid) return;

  const cols = getCollections();
  
  function render(items) {
    if (items.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light);">No fabrics found in this category.</div>';
      return;
    }
    grid.innerHTML = items.map(c => {
      const colorText = (c.colors && c.colors.length > 0) ? `<div style="font-size:0.8rem; color:var(--text-light); margin-bottom:1rem; font-weight:500;">${c.colors.length} color${c.colors.length > 1 ? 's' : ''} available</div>` : '';
      return `
      <div class="mission-card reveal" data-fabric-id="${c.id}" style="display:flex;flex-direction:column;border-radius:12px;overflow:hidden;background:#fff;box-shadow:var(--shadow-card); cursor:pointer;">
        <div style="position:relative;">
          <img src="${escHtml(c.imageUrl)}" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" loading="lazy" style="width:100%;height:250px;object-fit:cover;" />
          ${c.showInLaunched ? '<span class="new-range-badge" style="position:absolute;top:1rem;left:1rem;background:var(--gold);color:#fff;font-size:0.7rem;padding:0.4rem 0.8rem;border-radius:20px;font-weight:700;">New</span>' : ''}
        </div>
        <div style="padding:1.5rem;flex:1;display:flex;flex-direction:column;">
          <h3 style="margin-top:0;font-family:var(--font-heading);font-size:1.5rem;margin-bottom:0.5rem;color:var(--text);">${escHtml(c.name)}</h3>
          <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:1rem;flex:1;">${escHtml(c.description)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem;">
            <span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:#f4ebd9;color:var(--gold-dark);border-radius:4px;font-weight:600;">${escHtml(c.category)}</span>
            ${c.composition ? `<span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:#eee;color:#333;border-radius:4px;">${escHtml(c.composition)}</span>` : ''}
            ${c.weight ? `<span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:#eee;color:#333;border-radius:4px;">${escHtml(c.weight)}</span>` : ''}
          </div>
          ${colorText}
          <a href="/contact" class="btn btn-outline-gold" style="text-align:center;">Request Sample</a>
        </div>
      </div>
    `}).join('');
    
    // Re-trigger scroll reveal
    setTimeout(() => {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('#full-collections-grid .reveal').forEach(el => revealObserver.observe(el));
    }, 50);
  }

  // Initial render
  render(cols);

  // Dynamic Filter Pills Logic
  const filterBarEl = document.querySelector('.filter-bar');
  if (filterBarEl) {
    const cats = getUniqueCategories(getCollections());
    let html = `<button class="filter-btn active" data-filter="all">All Fabrics</button>`;
    cats.forEach(c => {
      html += `<button class="filter-btn" data-filter="${c}">${formatCatName(c)}</button>`;
    });
    filterBarEl.innerHTML = html;
  }
  const filterBtns = document.querySelectorAll('.filter-bar .filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      
      let filtered = cols;
      if (f !== 'all') {
        filtered = cols.filter(c => String(c.category).toLowerCase() === f.toLowerCase());
      }
      render(filtered);
    });
  });

  // URL Filter Parameter & Hash Handler (e.g. collections.html?filter=cotton or #filter=cotton)
  const urlParams = new URLSearchParams(window.location.search);
  const rawFilter = urlParams.get('filter') || (window.location.hash.includes('filter=') ? window.location.hash.split('filter=')[1] : null);
  if (rawFilter) {
    const cleanFilter = rawFilter.toLowerCase().trim();
    const targetBtn = Array.from(filterBtns).find(b => b.getAttribute('data-filter').toLowerCase() === cleanFilter);
    if (targetBtn) {
      targetBtn.click();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initCollectionsPage();
  renderAdminTestimonials();
  initHomepageTestimonials();
  initHomepageDynamicSections();
  refreshPublicCollectionsCache();
});

function initHomepageDynamicSections() {
  const collections = getCollections();
  
  // Gallery
  const galleryGrid = document.getElementById('homepage-gallery-grid');
  if (galleryGrid) {
    const galleryItems = collections.filter(c => c.showInGallery);
    const gallerySection = document.getElementById('gallery');
    if (galleryItems.length === 0) {
      if (gallerySection) gallerySection.style.display = 'none';
    } else {
      if (gallerySection) gallerySection.style.display = 'block';
      galleryGrid.innerHTML = galleryItems.map(c => `
        <div class="gallery-item reveal">
          <a href="/collections#fabric-${c.id}" style="display:block; height:100%; position:relative;">
            <img src="${escHtml(c.imageUrl)}" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" loading="lazy" />
            <div class="gallery-overlay" style="display:flex; flex-direction:column; gap:0.5rem; justify-content:center; align-items:center; background:rgba(0,0,0,0.6); position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; transition:opacity 0.3s; color:#fff;">
              <span style="font-family:var(--font-heading); font-size:1.4rem; font-weight:400;">${escHtml(c.name)}</span>
              <span style="color:var(--gold); border:1px solid var(--gold); padding:4px 12px; border-radius:30px; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px; background:rgba(201,168,76,0.1);">View Details</span>
            </div>
          </a>
        </div>
      `).join('');
    }
  }

  // Just Launched
  const launchedContainer = document.getElementById('homepage-just-launched');
  if (launchedContainer) {
    const launchedItems = collections.filter(c => c.showInLaunched).slice(0, 6);
    const newRangeSection = document.getElementById('new-range');
    
    if (launchedItems.length === 0) {
      if (newRangeSection) newRangeSection.style.display = 'none';
    } else if (launchedItems.length === 1) {
      if (newRangeSection) newRangeSection.style.display = 'block';
      const c = launchedItems[0];
      launchedContainer.innerHTML = `
        <div class="grid-2" style="align-items:center;">
          <div class="reveal">
            <div style="position:relative;border-radius:12px;overflow:hidden;box-shadow:0 15px 40px rgba(0,0,0,0.1);">
              <img src="${escHtml(c.imageUrl)}" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" loading="lazy" style="width:100%;display:block;" />
              <span class="new-range-badge">New Range</span>
            </div>
          </div>
          <div class="reveal">
            <span class="eyebrow">Just Launched</span>
            <h2 class="section-title">${escHtml(c.name)}</h2>
            <p class="section-desc">${escHtml(c.description)}</p>
            <ul class="feature-list" style="margin-bottom:1.5rem;">
              <li><strong>Category:</strong> ${escHtml(c.category)}</li>
              ${c.composition ? `<li><strong>Composition:</strong> ${escHtml(c.composition)}</li>` : ''}
              ${c.weight ? `<li><strong>Weight:</strong> ${escHtml(c.weight)}</li>` : ''}
              ${c.priceLabel ? `<li><strong>Price:</strong> ${escHtml(c.priceLabel)}</li>` : ''}
            </ul>
            <a href="/contact" class="btn btn-gold">Request Samples</a>
          </div>
        </div>
      `;
    } else {
      if (newRangeSection) newRangeSection.style.display = 'block';
      launchedContainer.innerHTML = `
        <div class="section-header reveal">
          <span class="eyebrow">Just Launched</span>
          <h2 class="section-title">Our Newest Collections</h2>
        </div>
        <div class="grid-3">
          ${launchedItems.map(c => `
            <div class="mission-card reveal" style="display:flex;flex-direction:column;border-radius:12px;overflow:hidden;background:#fff;box-shadow:var(--shadow-card);">
              <div style="position:relative;">
                <img src="${escHtml(c.imageUrl)}" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" loading="lazy" style="width:100%;height:250px;object-fit:cover;" />
                <span class="new-range-badge" style="position:absolute;top:1rem;left:1rem;">New Range</span>
              </div>
              <div style="padding:1.5rem;flex:1;display:flex;flex-direction:column;">
                <h3 style="margin-top:0;font-family:var(--font-heading);font-size:1.5rem;margin-bottom:0.5rem;color:var(--text);">${escHtml(c.name)}</h3>
                <p style="color:var(--text-light);font-size:0.9rem;margin-bottom:1rem;flex:1;">${escHtml(c.description)}</p>
                <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
                  <span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:#f4ebd9;color:var(--gold-dark);border-radius:4px;font-weight:600;">${escHtml(c.category)}</span>
                  ${c.composition ? `<span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:#eee;color:#333;border-radius:4px;">${escHtml(c.composition)}</span>` : ''}
                  ${c.weight ? `<span style="font-size:0.75rem;padding:0.25rem 0.5rem;background:#eee;color:#333;border-radius:4px;">${escHtml(c.weight)}</span>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // Stacking cards
  const stackingCards = document.getElementById('stacking-cards');
  if (stackingCards) {
    let cols = getCollections();
    // Fisher-Yates shuffle
    for (let i = cols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cols[i], cols[j]] = [cols[j], cols[i]];
    }
    cols = cols.slice(0, 7);

    const colors = ['#FDFAF5','#F5F0E8','#FDFAF5','#F5F0E8','#FDFAF5','#F5F0E8'];
    stackingCards.innerHTML = cols.map((c, i) => {
      const colorText = (c.colors && c.colors.length > 0) ? `<div style="font-size:0.8rem; color:var(--text-light); margin-top:0.5rem; font-weight:500;">${c.colors.length} color${c.colors.length > 1 ? 's' : ''} available</div>` : '';
      return `
      <div class="fabric-card" data-fabric-id="${c.id}" data-category="${escHtml(c.category)}" style="z-index:${10+i};background:${colors[i % colors.length]}; cursor:pointer;">
        <div class="fabric-card-image">
          <img src="${escHtml(c.imageUrl)}" alt="${escHtml(c.name)}" title="${escHtml(c.name)}" loading="lazy" />
        </div>
        <div class="fabric-card-content">
          <span class="fabric-tag">${escHtml(c.category)}</span>
          <h3 class="fabric-name">${escHtml(c.name)}</h3>
          <div class="fabric-meta">
            <div class="fabric-meta-item"><label>Composition</label><span>${escHtml(c.composition)}</span></div>
            <div class="fabric-meta-item"><label>Weight</label><span>${escHtml(c.weight)}</span></div>
          </div>
          ${colorText}
          <p class="fabric-desc">${escHtml(c.description)}</p>
          <a href="/contact" class="btn btn-gold">Request Sample</a>
          <span class="card-number">${String(i+1).padStart(2,'0')}</span>
        </div>
      </div>
    `}).join('');

    // Re-init filter after dynamic render
    const filterBar = document.getElementById('filter-bar');
    if (filterBar) {
      const cats = getUniqueCategories(getCollections());
      let html = `<button class="filter-pill active" data-filter="all">All</button>`;
      cats.forEach(c => {
        html += `<button class="filter-pill" data-filter="${c}">${formatCatName(c)}</button>`;
      });
      filterBar.innerHTML = html;
      const pills = filterBar.querySelectorAll('.filter-pill');
      const newCards = stackingCards.querySelectorAll('.fabric-card');
      pills.forEach(pill => {
        pill.addEventListener('click', () => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const filter = pill.dataset.filter;
          newCards.forEach(card => {
            const cardCat = card.dataset.category ? String(card.dataset.category).trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') : '';
            if (filter === 'all' || cardCat === filter) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    }
  }

  // Inject gallery overlay CSS rule
  const styleEl = document.createElement('style');
  styleEl.textContent = `.gallery-item:hover .gallery-overlay { opacity: 1 !important; }`;
  document.head.appendChild(styleEl);

  // Re-observe any newly injected .reveal elements
  setTimeout(() => {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
  }, 50);
}

function initContactDropdown() {
  const cfFabric = document.getElementById('cf-fabric');
  if (cfFabric) {
    const cats = getUniqueCategories(getCollections());
    let html = `<option value="">Select a fabric type...</option>`;
    cats.forEach(c => {
      html += `<option value="${c}">${formatCatName(c)}</option>`;
    });
    html += `<option value="other">Other</option>`;
    cfFabric.innerHTML = html;
  }
}
document.addEventListener('DOMContentLoaded', initContactDropdown);

function initAdminCategoryDropdown() {
  const catSelect = document.getElementById('col-category');
  const newWrapper = document.getElementById('new-category-wrapper');
  const newCatInput = document.getElementById('new-category-input');
  const btnAddCat = document.getElementById('btn-add-category');

  if (catSelect && newWrapper && newCatInput && btnAddCat) {
    // Populate dynamic categories into dropdown
    const cats = getUniqueCategories(getCollections());
    let html = '';
    cats.forEach(c => {
      html += `<option value="${c}">${formatCatName(c)}</option>`;
    });
    html += `<option value="__new__">+ Add New Category...</option>`;
    catSelect.innerHTML = html;

    // Show/hide wrapper on change
    catSelect.addEventListener('change', () => {
      if (catSelect.value === '__new__') {
        newWrapper.style.display = 'flex';
      } else {
        newWrapper.style.display = 'none';
      }
    });

    // Handle add button click
    btnAddCat.addEventListener('click', () => {
      const val = newCatInput.value.trim();
      if (!val) { showToast('Enter a category name.', 'error'); return; }
      const formattedVal = val.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      
      // Add to select
      const opt = document.createElement('option');
      opt.value = formattedVal;
      opt.textContent = val.charAt(0).toUpperCase() + val.slice(1);
      catSelect.insertBefore(opt, catSelect.lastElementChild);
      
      // Select it and hide input
      catSelect.value = formattedVal;
      newWrapper.style.display = 'none';
      newCatInput.value = '';
      showToast('Category added locally. Save fabric to persist.', 'success');
    });
  }
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', initAdminCategoryDropdown);

  // ---- EXCEL EXPORT ----
  window.exportSubscribersToExcel = async function() {
    let subs;
    try {
      const res = await fetch('/api/subscribers', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Not authenticated or request failed.');
      subs = await res.json();
    } catch (err) {
      showToast('Failed to load subscribers for export.', 'error');
      return;
    }
    if (!subs || subs.length === 0) {
      showToast('No subscribers to export.', 'error');
      return;
    }
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,Email Address\n";
    subs.forEach(s => {
      // Handle both object {email: '...'} and simple string arrays just in case
      const email = typeof s === 'object' ? (s.email || s.id || '') : s;
      csvContent += `${email}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "fabfashion_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    writeLog('Exported subscribers to Excel');
  };


/* ============================================================
   FABRIC CATALOG DATA
   ============================================================ */
const FABRIC_CATALOG = [
  { id: "oxford", name: "Oxford Weave", tag: "Cotton", img: "images/oxford_fabric.webp", composition: "100% Cotton", weight: "110-130 GSM", desc: "A classic basket-weave construction that offers a distinctive textured appearance with excellent durability. Perfect for formal and semi-formal shirts, breathable and easy to care for.", uses: "Formal Shirts, Corporate Wear, Semi-formal Attire", finish: "Soft-brushed / Natural" },
  { id: "twill", name: "Twill Fabric", tag: "Cotton", img: "images/twill_fabric.webp", composition: "100% Cotton", weight: "120-145 GSM", desc: "Characterized by its diagonal ribbed pattern, our twill fabric delivers a smooth, lustrous finish with superior drape. Favoured for premium dress shirts and corporate wear.", uses: "Premium Dress Shirts, Corporate Uniforms", finish: "Lustrous / Smooth" },
  { id: "poplin", name: "Poplin & Stripes", tag: "Cotton", img: "images/poplin_fabric.webp", composition: "100% Cotton", weight: "90-115 GSM", desc: "Ultra-fine, tightly woven poplin with crisp stripe variations. Offers a sleek appearance and excellent comfort, making it ideal for formal shirts across all seasons.", uses: "Formal Shirts, Summer Wear, All-season Fashion", finish: "Crisp / Sheen" },
  { id: "herringbone", name: "Herringbone Pattern", tag: "Blends", img: "images/herringbone_fabric.webp", composition: "Cotton / Poly Blend", weight: "130-160 GSM", desc: "An elegant V-shaped weave that creates a sophisticated visual texture. Our herringbone blends offer wrinkle resistance and colour retention, perfect for executive menswear.", uses: "Executive Menswear, Blazers, Premium Trousers", finish: "Wrinkle-resistant / Matte" },
  { id: "custom", name: "Custom Weaves", tag: "Custom", img: "images/custom_fabric.webp", composition: "As Specified", weight: "Custom GSM", desc: "Bring your design vision to life. We craft bespoke weave patterns, custom colours, and exclusive textures tailored to your brand's unique identity and market requirements.", uses: "Brand Collections, OEM Manufacturing, Special Orders", finish: "As Required" },
  { id: "linen", name: "Premium Linen", tag: "Linen", img: "images/linen_fabric.webp", composition: "100% Linen", weight: "140-160 GSM", desc: "Highly breathable, exceptionally strong, and naturally elegant. Our premium linen fabrics are perfect for summer collections and luxury resort wear.", uses: "Summer Wear, Resort Collections, Luxury Apparel", finish: "Natural / Breathable" }
];

/* ============================================================
   SECURITY: Input Sanitizer (XSS Prevention)
   ============================================================ */
function sanitizeInput(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ============================================================
   SUPABASE — source of truth for enquiries/subscribers.
   Tables here are your REAL existing tables (ff_inquiries,
   ff_newsletter) — public anon key can only INSERT into these
   (see supabase/schema.sql RLS). Admin reads/updates/deletes go
   through /api/enquiries and /api/subscribers instead.
   ============================================================ */
async function insertEnquirySupabase(inquiry) {
  const cfg = window.FABFASHION_CONFIG;
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) {
    throw new Error('Supabase is not configured.');
  }
  const res = await fetch(`${cfg.SUPABASE_URL}/rest/v1/ff_inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: cfg.SUPABASE_KEY,
      Authorization: `Bearer ${cfg.SUPABASE_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      id: 'i' + Date.now(),
      name: inquiry.name,
      company: inquiry.company || null,
      email: inquiry.email,
      phone: inquiry.phone || null,
      fabric: inquiry.fabric || null,
      quantity: inquiry.quantity || null,
      message: inquiry.message || null,
      date: new Date().toISOString(),
      status: 'unread'
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase insert failed (${res.status}): ${text}`);
  }
  return true;
}

async function insertSubscriberSupabase(email) {
  const cfg = window.FABFASHION_CONFIG;
  if (!cfg || !cfg.SUPABASE_URL || !cfg.SUPABASE_KEY) throw new Error('Supabase is not configured.');
  const res = await fetch(`${cfg.SUPABASE_URL}/rest/v1/ff_newsletter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: cfg.SUPABASE_KEY,
      Authorization: `Bearer ${cfg.SUPABASE_KEY}`,
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ id: 'n' + Date.now(), email, date: new Date().toISOString() })
  });
  if (!res.ok && res.status !== 409) {
    const text = await res.text().catch(() => '');
    throw new Error(`Supabase subscriber insert failed (${res.status}): ${text}`);
  }
  return true;
}

/**
 * Submits an enquiry to Supabase (source of truth) and fires the
 * FormSubmit email notification in parallel. Returns { ok, error }.
 * ok=true only when the Supabase insert actually succeeded — the
 * email notification is best-effort and never blocks/fakes success.
 */
async function submitEnquiry(inquiry) {
  const results = await Promise.allSettled([
    insertEnquirySupabase(inquiry),
    sendEnquiryEmail(inquiry)
  ]);
  const supabaseResult = results[0];
  if (supabaseResult.status === 'rejected') {
    console.error('Enquiry storage failed:', supabaseResult.reason);
    // Keep a local fallback copy so the enquiry isn't silently lost
    // if Supabase is unreachable — visible to admins only on this device.
    const inquiries = DB.get('ff_inquiries_unsynced', []);
    inquiries.unshift(inquiry);
    DB.set('ff_inquiries_unsynced', inquiries);
    return { ok: false, error: supabaseResult.reason };
  }
  return { ok: true, error: null };
}

function sendEnquiryEmail(data) {
  // Option (b) chosen: Refactored endpoint to /api/contact which is proxied via vercel.json rewrite rule to FormSubmit.
  // We also provide a direct fallback if hosted locally without Vercel rewrite rules.
  const payload = {
    name: data.name,
    email: data.email,
    company: data.company || '',
    phone: data.phone || '',
    message: data.message || '',
    _subject: 'New Enquiry from FabFashion Website',
    _captcha: 'false'
  };

  return fetch("/api/contact", {
    method: "POST",
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => {
    // Direct fallback to FormSubmit endpoint when running outside Vercel
    return fetch("https://formsubmit.co/ajax/fabfashionfabrics@gmail.com", {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
  }).catch(err => console.warn('Email notification failed:', err));
}

/* ============================================================
   BROCHURE PREVIEW MODAL
   ============================================================ */
(function initBrochurePreview() {
  // Create modal HTML once
  const modal = document.createElement('div');
  modal.id = 'brochure-modal';
  modal.style.cssText = `
    display:none; position:fixed; inset:0; z-index:9999;
    background:rgba(0,0,0,0.85); backdrop-filter:blur(6px);
    align-items:center; justify-content:center; flex-direction:column;
  `;
  modal.innerHTML = `
    <div style="background:#1a1a1a; border:1px solid rgba(180,145,60,0.3); border-radius:16px;
                max-width:900px; width:95vw; max-height:92vh; display:flex; flex-direction:column;
                overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,0.7);">
      <div style="display:flex; justify-content:space-between; align-items:center;
                  padding:16px 24px; border-bottom:1px solid rgba(180,145,60,0.2);">
        <div style="display:flex; align-items:center; gap:12px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b4913c" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style="color:#f0e6c8; font-family:'Montserrat',sans-serif; font-size:14px; font-weight:500;">
            FabFashion — Company Brochure
          </span>
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <a href="brochure.pdf" download class="btn btn-gold btn-sm" id="brochure-download-btn"
             style="display:flex; align-items:center; gap:8px; padding:8px 18px; font-size:13px;
                    background:linear-gradient(135deg,#b4913c,#d4af5a); color:#1a1208;
                    border-radius:6px; text-decoration:none; font-weight:600; font-family:'Montserrat',sans-serif;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download PDF
          </a>
          <button onclick="closeBrochureModal()" aria-label="Close"
                  style="background:rgba(255,255,255,0.08); border:none; color:#ccc; cursor:pointer;
                         width:34px; height:34px; border-radius:50%; font-size:18px; display:flex;
                         align-items:center; justify-content:center; transition:background 0.2s;">✕</button>
        </div>
      </div>
      <div style="flex:1; overflow:hidden; min-height:0;">
        <iframe id="brochure-iframe" src="" style="width:100%; height:100%; min-height:70vh; border:none;"
                title="FabFashion Brochure Preview"></iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeBrochureModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBrochureModal();
  });

  window.openBrochureModal = function() {
    const iframe = document.getElementById('brochure-iframe');
    if (iframe && !iframe.src.includes('brochure.pdf')) {
      iframe.src = 'brochure.pdf';
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeBrochureModal = function() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Hook all brochure buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[id*="brochure-btn"], [href="brochure.pdf"]');
    if (btn && !btn.id.includes('download')) {
      e.preventDefault();
      openBrochureModal();
    }
  });
})();


/* ============================================================
   FABRIC DETAIL POPUP MODAL — Works on all pages
   ============================================================ */
(function initFabricDetailModal() {
  // Build modal element once
  const modal = document.createElement('div');
  modal.id = 'fabric-detail-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = `
    display:none; position:fixed; inset:0; z-index:10000;
    background:rgba(15,12,8,0.88); backdrop-filter:blur(8px);
    align-items:center; justify-content:center;
  `;
  modal.innerHTML = `
    <div id="fabric-modal-box" style="
      background:linear-gradient(145deg,#fdfaf5,#f5efe3);
      border:1px solid rgba(180,145,60,0.25);
      border-radius:20px; max-width:860px; width:94vw;
      max-height:90vh; overflow-y:auto;
      box-shadow:0 40px 100px rgba(0,0,0,0.5);
      animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    ">
      <div style="display:grid; grid-template-columns:1fr 1fr; min-height:420px;">
        <!-- Left: Image -->
        <div style="position:relative; overflow:hidden; border-radius:20px 0 0 20px; min-height:320px;">
          <img id="fmodal-img" src="" alt="Fabric preview" title="Fabric preview"
            style="width:100%; height:100%; object-fit:cover; display:block;" />
          <div style="position:absolute;inset:0;background:linear-gradient(to right,transparent 60%,rgba(253,250,245,0.3));pointer-events:none;"></div>
        </div>
        <!-- Right: Details -->
        <div style="padding:2.5rem 2rem; display:flex; flex-direction:column; gap:1rem;">
          <button onclick="closeFabricModal()" aria-label="Close"
            style="align-self:flex-end; background:rgba(180,145,60,0.1); border:1px solid rgba(180,145,60,0.25);
                   color:#8a7340; cursor:pointer; width:32px; height:32px; border-radius:50%;
                   font-size:16px; display:flex; align-items:center; justify-content:center;
                   transition:all 0.2s; flex-shrink:0;">✕</button>
          <div>
            <span id="fmodal-tag" style="
              display:inline-block; background:rgba(180,145,60,0.12); color:#8a7340;
              font-size:0.65rem; font-weight:700; letter-spacing:0.18em; text-transform:uppercase;
              padding:4px 12px; border-radius:20px; margin-bottom:0.75rem;"></span>
            <h2 id="fmodal-name" style="
              font-family:'Cormorant Garamond',serif; font-size:clamp(1.6rem,3vw,2.2rem);
              font-weight:400; color:#2c2415; line-height:1.2; margin:0;"></h2>
          </div>
          <p id="fmodal-desc" style="
            font-family:'Montserrat',sans-serif; font-size:0.82rem; color:#5a4e3a;
            line-height:1.75; margin:0;"></p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-top:0.25rem;">
            <div style="background:rgba(180,145,60,0.07); border-radius:10px; padding:0.75rem 1rem;">
              <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#9a8b6a;font-weight:600;margin-bottom:0.3rem;">Composition</div>
              <div id="fmodal-comp" style="font-family:'Montserrat',sans-serif;font-size:0.82rem;font-weight:600;color:#3a2e1a;"></div>
            </div>
            <div style="background:rgba(180,145,60,0.07); border-radius:10px; padding:0.75rem 1rem;">
              <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#9a8b6a;font-weight:600;margin-bottom:0.3rem;">Weight</div>
              <div id="fmodal-weight" style="font-family:'Montserrat',sans-serif;font-size:0.82rem;font-weight:600;color:#3a2e1a;"></div>
            </div>
            <div style="background:rgba(180,145,60,0.07); border-radius:10px; padding:0.75rem 1rem;">
              <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#9a8b6a;font-weight:600;margin-bottom:0.3rem;">Best For</div>
              <div id="fmodal-uses" style="font-family:'Montserrat',sans-serif;font-size:0.78rem;color:#3a2e1a;"></div>
            </div>
            <div style="background:rgba(180,145,60,0.07); border-radius:10px; padding:0.75rem 1rem;">
              <div style="font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#9a8b6a;font-weight:600;margin-bottom:0.3rem;">Finish</div>
              <div id="fmodal-finish" style="font-family:'Montserrat',sans-serif;font-size:0.82rem;font-weight:600;color:#3a2e1a;"></div>
            </div>
          </div>
          <div style="margin-top:auto; padding-top:1rem; border-top:1px solid rgba(180,145,60,0.15);">
            <a href="/contact" class="btn btn-gold" style="
              display:inline-flex; align-items:center; gap:8px;
              background:linear-gradient(135deg,#b4913c,#d4af5a); color:#1a1208;
              padding:12px 28px; border-radius:8px; text-decoration:none;
              font-family:'Montserrat',sans-serif; font-size:0.8rem; font-weight:700;
              letter-spacing:0.08em; text-transform:uppercase;">
              Request a Sample
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add keyframe animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalIn {
      from { opacity:0; transform:scale(0.92) translateY(20px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    @media (max-width:640px) {
      #fabric-modal-box > div { grid-template-columns:1fr !important; }
      #fabric-modal-box img { border-radius:20px 20px 0 0 !important; min-height:220px; }
    }
    .fabric-card-image, .fabric-card { cursor:pointer; }
    .fabric-card-image img { transition: transform 0.4s ease; }
    .fabric-card:hover .fabric-card-image img { transform: scale(1.03); }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  // Close on backdrop click
  modal.addEventListener('click', e => { if (e.target === modal) closeFabricModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeFabricModal(); });

  // Color Hex Mapping System
  const COLOR_MAP = {
    'sunset coral': '#FF7F50',
    'misty sage': '#B2C2B2',
    'navy blue': '#000080',
    'maroon': '#800000',
    'beige': '#F5F5DC',
    'olive': '#808000',
    'charcoal': '#36454F',
    'mustard': '#FFDB58',
    'teal': '#008080',
    'ivory': '#FFFFF0',
    'crimson': '#DC143C',
    'slate': '#708090',
    'peach': '#FFE5B4'
  };

  window.getColorHex = function(name) {
    if (!name) return 'transparent';
    const n = name.trim().toLowerCase();
    return COLOR_MAP[n] || n;
  };

  window.openFabricModal = function(fabricId) {
    let fabric = FABRIC_CATALOG.find(f => f.id === fabricId);
    if (!fabric) {
      const cols = typeof getCollections === 'function' ? getCollections() : [];
      fabric = cols.find(c => c.id === fabricId || c.id === parseInt(fabricId, 10));
    }
    if (!fabric) return;
    
    // Map properties for dynamic collections format
    if (!fabric.img) fabric.img = fabric.imageUrl || '';
    if (!fabric.tag) fabric.tag = fabric.category || '';
    if (!fabric.desc) fabric.desc = fabric.description || '';
    if (!fabric.composition) fabric.composition = fabric.attributes ? fabric.attributes.composition : '';
    if (!fabric.weight) fabric.weight = fabric.attributes ? fabric.attributes.weight : '';
    if (!fabric.uses) fabric.uses = fabric.attributes ? fabric.attributes.uses : '';
    if (!fabric.finish) fabric.finish = fabric.attributes ? fabric.attributes.finish : '';
    
    let colorsHtml = '';
    if (fabric.colors && fabric.colors.length > 0) {
      colorsHtml = `
        <div style="margin-top: 1.5rem; margin-bottom: 0.5rem;">
          <h4 style="color: var(--gold-dark); font-size: 0.95rem; margin-bottom: 0.75rem;">Available Colors</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
            ${fabric.colors.map(color => {
              let cName = typeof color === 'string' ? color : color.name;
              let cHex = typeof color === 'string' ? getColorHex(color) : color.hex;
              return `
                <div title="${escHtml(cName)}" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem;">
                  <div style="width: 28px; height: 28px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); background-color: ${escHtml(cHex)}; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"></div>
                  <span style="font-size: 0.65rem; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">${escHtml(cName)}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }
    
    document.getElementById('fmodal-img').src = fabric.img;
    document.getElementById('fmodal-img').alt = fabric.name;
    document.getElementById('fmodal-img').title = fabric.name;
    document.getElementById('fmodal-tag').textContent = fabric.tag;
    document.getElementById('fmodal-name').textContent = fabric.name;
    document.getElementById('fmodal-desc').innerHTML = fabric.desc.replace(/\n/g, '<br>') + colorsHtml;
    document.getElementById('fmodal-comp').textContent = fabric.composition;
    document.getElementById('fmodal-weight').textContent = fabric.weight;
    document.getElementById('fmodal-uses').textContent = fabric.uses;
    document.getElementById('fmodal-uses').parentElement.style.display = fabric.uses ? 'block' : 'none';
    document.getElementById('fmodal-finish').textContent = fabric.finish;
    document.getElementById('fmodal-finish').parentElement.style.display = fabric.finish ? 'block' : 'none';
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeFabricModal = function() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Event delegation for .fabric-card or .mission-card clicks
  document.body.addEventListener('click', e => {
    const card = e.target.closest('.fabric-card, .mission-card');
    if (!card) return;
    
    // Ignore if clicking a button inside the card
    if (e.target.closest('a.btn')) return;
    if (e.target.closest('button')) return;
    
    e.preventDefault();
    
    const cardId = card.id || '';
    let fabricId = card.getAttribute('data-fabric-id');
    
    // Fallback for static homepage cards that don't have data-fabric-id
    if (!fabricId && cardId.startsWith('fabric-card-')) {
      const num = parseInt(cardId.replace('fabric-card-', ''), 10);
      const fabricMap = {1:'oxford',2:'twill',3:'poplin',4:'herringbone',5:'custom',6:'linen'};
      fabricId = fabricMap[num];
    }
    
    // Fallback for collections.html cards
    if (!fabricId && cardId.startsWith('col-card-')) {
      fabricId = cardId.replace('col-card-', '');
    }
    
    if (fabricId) window.openFabricModal(fabricId);
  });
})();

/* ============================================================
   DATA PRIVACY & RIGHTS (DPDP ACT)
   ============================================================ */
window.openPrivacyModal = function(e) {
  if(e) { e.preventDefault(); e.stopPropagation(); }
  window.openModal('privacy-modal');
};

window.openDataRightsModal = function(e) {
  if(e) { e.preventDefault(); e.stopPropagation(); }
  const list = document.getElementById('data-rights-list');
  if(!list) return;
  list.innerHTML = '';
  
  let totalData = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if(key.startsWith('ff_')) {
      const val = localStorage.getItem(key);
      const size = new Blob([val]).size;
      totalData += size;
      const li = document.createElement('li');
      li.style.marginBottom = '0.5rem';
      li.innerHTML = `<strong>${key.replace('ff_', 'Module: ')}</strong> - ${size} bytes`;
      list.appendChild(li);
    }
  }
  
  if(totalData === 0) {
    list.innerHTML = '<li style="color:var(--text-light);">No personal data found in your local storage.</li>';
  } else {
    const totalLi = document.createElement('li');
    totalLi.style.marginTop = '1rem';
    totalLi.style.borderTop = '1px solid rgba(201,168,76,0.3)';
    totalLi.style.paddingTop = '0.5rem';
    totalLi.innerHTML = `<strong>Total Storage Used:</strong> ${(totalData / 1024).toFixed(2)} KB`;
    list.appendChild(totalLi);
  }
  
  window.openModal('data-rights-modal');
};

window.eraseAllMyData = function() {
  if(!confirm('Are you sure you want to permanently erase all FabFashion data stored on your device? This cannot be undone.')) return;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if(key.startsWith('ff_')) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  showToast('All your personal data has been securely erased.', 'success');
  window.closeModal('data-rights-modal');
  setTimeout(() => window.location.reload(), 1500);
};


/* ============================================================
   COOKIE CONSENT BANNER (DPDP & GDPR COMPLIANT)
   ============================================================ */
function initCookieConsent() {
  if (typeof localStorage === 'undefined') return;
  const consent = localStorage.getItem('ff_cookie_consent');
  if (consent) return; // Consent already registered

  const banner = document.createElement('div');
  banner.id = 'cookie-consent-banner';
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie Consent Notice');
  banner.innerHTML = `
    <div class="cookie-banner-inner">
      <div>
        <p class="cookie-banner-title"><strong>🍪 Privacy &amp; Essential Cookies</strong></p>
        <p class="cookie-banner-desc">We use minimal functional cookies and browser storage to power our fabric catalog, swatches, and inquiry dispatch. We never deploy invasive third-party advertising tracking. By browsing our website, you agree to our <a href="/privacy" style="color:var(--gold-light);text-decoration:underline;">Privacy Policy</a> and <a href="/terms" style="color:var(--gold-light);text-decoration:underline;">Terms</a>.</p>
      </div>
      <div class="cookie-banner-actions">
        <button type="button" class="btn btn-outline-gold btn-sm" id="cookie-decline-btn" style="color:white;border-color:rgba(255,255,255,0.4);">Decline Optional</button>
        <button type="button" class="btn btn-outline-gold btn-sm" id="cookie-essential-btn" style="color:white;border-color:rgba(255,255,255,0.4);">Accept Essential</button>
        <button type="button" class="btn btn-gold btn-sm" id="cookie-accept-btn">Accept All</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookie-accept-btn')?.addEventListener('click', () => {
    localStorage.setItem('ff_cookie_consent', 'accepted_all');
    banner.classList.add('cookie-banner-hidden');
    setTimeout(() => banner.remove(), 400);
  });

  document.getElementById('cookie-essential-btn')?.addEventListener('click', () => {
    localStorage.setItem('ff_cookie_consent', 'essential_only');
    banner.classList.add('cookie-banner-hidden');
    setTimeout(() => banner.remove(), 400);
  });

  document.getElementById('cookie-decline-btn')?.addEventListener('click', () => {
    localStorage.setItem('ff_cookie_consent', 'declined');
    banner.classList.add('cookie-banner-hidden');
    setTimeout(() => banner.remove(), 400);
  });
}

window.openCookieSettings = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  localStorage.removeItem('ff_cookie_consent');
  const existing = document.getElementById('cookie-consent-banner');
  if (existing) existing.remove();
  initCookieConsent();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCookieConsent);
} else {
  initCookieConsent();
}
