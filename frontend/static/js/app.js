/**
 * app.js — ClimateLens SPA Router + Admin + Interactions
 */

/* ── State ────────────────────────────────────────── */
let currentPage  = 'home';
let prevPage     = 'home';
let activeFilter = 'all';
let editingId    = null;
let allArticles  = [];

/* ── Init ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initLoader();
  initScrollProgress();
  // Load home on start
  setTimeout(() => showPage('home'), 1500);
});

/* ── Loader ───────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('page-loader');
  setTimeout(() => loader.classList.add('hidden'), 1400);
}

/* ── Custom Cursor ────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || window.innerWidth < 700) return;
  let mx = 0, my = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; });
  function animTrail() { tx += (mx - tx) * 0.14; ty += (my - ty) * 0.14; trail.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`; requestAnimationFrame(animTrail); }
  animTrail();
}

/* ── Scroll Progress ──────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('nav-progress');
  if (!bar) return;
  document.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    bar.style.width = pct + '%';
  });
}

/* ── Navigation ───────────────────────────────────── */
function initNav() {
  // All clickable elements with data-page
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (!el) return;
    const page   = el.dataset.page;
    const filter = el.dataset.filter;
    if (filter) activeFilter = filter;
    showPage(page);
    // Close mobile menu
    document.getElementById('mobile-overlay').classList.remove('open');
  });

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobile-overlay').classList.toggle('open');
  });
  document.getElementById('mobile-close').addEventListener('click', () => {
    document.getElementById('mobile-overlay').classList.remove('open');
  });

  // Search clear
  const clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    document.getElementById('search-input').value = '';
    filterAndRenderNews();
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(filterAndRenderNews, 280);
    });
  }

  // Color picker label
  const colorPicker = document.getElementById('a-color');
  const colorLabel  = document.getElementById('color-label');
  if (colorPicker && colorLabel) {
    colorPicker.addEventListener('input', () => { colorLabel.textContent = colorPicker.value; });
  }
}

/* ── Page Router ──────────────────────────────────── */
function showPage(page) {
  if (page !== 'detail') prevPage = currentPage;
  currentPage = page;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');

  // Nav active state
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Page-specific loaders
  if (page === 'home')  loadHome();
  if (page === 'news')  loadNews();
  if (page === 'admin') initAdminPage();
}

function goBack() { showPage(prevPage); }

/* ── HOME ─────────────────────────────────────────── */
async function loadHome() {
  try {
    const [articles, featured, stats] = await Promise.all([
      API.getArticles(),
      API.getFeatured(),
      API.getStats(),
    ]);
    allArticles = articles;

    // Stat counter
    animateCounter('stat-total', stats.total_articles || articles.length);

    // Ticker
    buildTicker(articles);

    // Featured
    const featSlot = document.getElementById('featured-slot');
    featSlot.innerHTML = renderFeaturedHTML(featured);
    featSlot.querySelector('.featured-card').addEventListener('click', () => openArticle(featured.id));

    // Grid (exclude featured, show up to 6)
    const grid = document.getElementById('home-grid');
    const rest = articles.filter(a => a.id !== featured.id).slice(0, 6);
    grid.innerHTML = rest.map(renderCardHTML).join('') || '<p style="color:var(--text3)">No articles yet.</p>';
    attachCardClicks(grid);

  } catch (err) {
    console.error('Home load failed:', err);
    showToast('⚠ Could not load articles. Is the server running?', 'error');
  }
}

function buildTicker(articles) {
  const track = document.getElementById('ticker-track');
  if (!articles.length) return;
  const items = articles.map(a =>
    `<span class="ticker-item" data-id="${a.id}">${a.emoji || '🌍'} ${a.title}</span><span class="ticker-sep">◆</span>`
  );
  // Duplicate for infinite scroll
  track.innerHTML = [...items, ...items].join('');
  track.querySelectorAll('.ticker-item').forEach(el => {
    el.addEventListener('click', () => openArticle(parseInt(el.dataset.id)));
  });
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(t);
  }, 40);
}

/* ── NEWS ─────────────────────────────────────────── */
async function loadNews() {
  try {
    allArticles = await API.getArticles();
    buildFilters();
    filterAndRenderNews();
  } catch (err) {
    console.error('News load failed:', err);
    showToast('⚠ Could not load articles.', 'error');
  }
}

function buildFilters() {
  const categories = ['all', ...new Set(allArticles.map(a => a.category))];
  const container  = document.getElementById('filter-btns');
  container.innerHTML = categories.map(cat => {
    const label = cat === 'all' ? '🌍 All' : cat.charAt(0).toUpperCase() + cat.slice(1);
    return `<button class="filter-btn ${activeFilter === cat ? 'active' : ''}" data-cat="${cat}">${label}</button>`;
  }).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.cat;
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterAndRenderNews();
    });
  });
}

function filterAndRenderNews() {
  const grid     = document.getElementById('news-grid');
  const emptyEl  = document.getElementById('news-empty');
  const search   = (document.getElementById('search-input')?.value || '').toLowerCase();

  let filtered = allArticles;
  if (activeFilter !== 'all') filtered = filtered.filter(a => a.category === activeFilter);
  if (search) filtered = filtered.filter(a =>
    a.title.toLowerCase().includes(search) ||
    a.description.toLowerCase().includes(search)
  );

  if (!filtered.length) {
    grid.innerHTML = '';
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';
  grid.innerHTML = filtered.map(renderCardHTML).join('');
  attachCardClicks(grid);
}

/* ── ARTICLE DETAIL ───────────────────────────────── */
function attachCardClicks(container) {
  container.querySelectorAll('[data-id]').forEach(el => {
    el.addEventListener('click', () => openArticle(parseInt(el.dataset.id)));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') openArticle(parseInt(el.dataset.id)); });
  });
}

async function openArticle(id) {
  showPage('detail');
  const container = document.getElementById('detail-content');
  container.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:center; height:50vh; color:var(--text3); font-family:var(--font-mono); font-size:0.85rem;">
      Loading article…
    </div>
  `;
  try {
    const article = await API.getArticle(id);
    container.innerHTML = renderDetailHTML(article);

    // Animate impact bar
    setTimeout(() => {
      container.querySelectorAll('.impact-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 300);

    // Back button
    container.querySelector('#back-btn').addEventListener('click', goBack);

  } catch (err) {
    console.error('Article load failed:', err);
    container.innerHTML = `<button class="back-btn" id="back-btn">← Back</button><p style="color:var(--text3); margin-top:32px">Could not load this article.</p>`;
    container.querySelector('#back-btn').addEventListener('click', goBack);
  }
}

/* ── ADMIN ────────────────────────────────────────── */
function initAdminPage() {
  const token = sessionStorage.getItem('cl_token');
  if (token) showAdminPanel();
  else showAdminLogin();
}

function showAdminLogin() {
  document.getElementById('admin-login').style.display = 'flex';
  document.getElementById('admin-panel').style.display  = 'none';
}

function showAdminPanel() {
  document.getElementById('admin-login').style.display = 'none';
  document.getElementById('admin-panel').style.display  = 'block';
  loadAdminStats();
  renderManageList();
}

async function adminLogin() {
  const username = document.getElementById('admin-user').value.trim();
  const password = document.getElementById('admin-pass').value;
  const errEl    = document.getElementById('login-error');
  errEl.classList.remove('show');

  try {
    const res = await API.login(username, password);
    sessionStorage.setItem('cl_token', res.token);
    showAdminPanel();
  } catch {
    errEl.classList.add('show');
    document.getElementById('admin-pass').value = '';
  }
}

function adminLogout() {
  sessionStorage.removeItem('cl_token');
  showAdminLogin();
}

function togglePw() {
  const inp = document.getElementById('admin-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

async function loadAdminStats() {
  try {
    const stats = await API.getStats();
    document.getElementById('as-total').textContent = stats.total_articles;
    document.getElementById('as-high').textContent  = stats.impact_levels?.high || 0;
    document.getElementById('as-cats').textContent  = Object.keys(stats.categories || {}).length;
  } catch (err) { console.error('Stats load failed:', err); }
}

async function renderManageList() {
  const list    = document.getElementById('manage-list');
  const emptyEl = document.getElementById('manage-empty');
  try {
    const articles = await API.getArticles();
    allArticles = articles;
    if (!articles.length) {
      list.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }
    emptyEl.style.display = 'none';
    list.innerHTML = articles.map(renderManageRowHTML).join('');

    // Wire action buttons
    list.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const { action, id } = btn.dataset;
        const intId = parseInt(id);
        if (action === 'edit')    startEdit(intId);
        if (action === 'delete')  deleteArticle(intId);
        if (action === 'feature') featureArticle(intId);
      });
    });
  } catch (err) {
    console.error('Manage list failed:', err);
  }
}

function switchTab(tab) {
  document.querySelectorAll('.atab').forEach((t, i) => {
    t.classList.toggle('active', (tab === 'add' && i === 0) || (tab === 'manage' && i === 1));
  });
  document.querySelectorAll('.tab-pane').forEach((p, i) => {
    p.classList.toggle('active', (tab === 'add' && i === 0) || (tab === 'manage' && i === 1));
  });
  if (tab === 'manage') renderManageList();
}

async function submitArticle() {
  const errEl = document.getElementById('add-error');
  errEl.classList.remove('show');

  const data = {
    title:       document.getElementById('a-title').value.trim(),
    category:    document.getElementById('a-category').value,
    impact:      document.getElementById('a-impact').value,
    description: document.getElementById('a-desc').value.trim(),
    body:        document.getElementById('a-body').value.trim(),
    env_impact:  document.getElementById('a-env').value.trim(),
    ethics:      document.getElementById('a-ethics').value.trim(),
    actions:     document.getElementById('a-actions').value.trim(),
    emoji:       document.getElementById('a-emoji').value.trim() || '🌍',
    color:       document.getElementById('a-color').value,
    featured:    false,
  };

  const required = ['title','category','impact','description','body','env_impact','ethics','actions'];
  const missing  = required.find(k => !data[k]);
  if (missing) {
    errEl.textContent = `Please fill in all required fields (missing: ${missing.replace('_',' ')}).`;
    errEl.classList.add('show');
    return;
  }

  const btn   = document.getElementById('submit-btn');
  const label = document.getElementById('submit-label');
  btn.disabled = true;
  label.textContent = editingId ? 'Saving…' : 'Publishing…';

  try {
    if (editingId) {
      await API.updateArticle(editingId, data);
      showToast('✅ Article updated!');
    } else {
      await API.createArticle(data);
      showToast('✅ Article published!');
    }
    cancelEdit();
    switchTab('manage');
    loadAdminStats();
  } catch (err) {
    errEl.textContent = `Error: ${err.message}`;
    errEl.classList.add('show');
  } finally {
    btn.disabled = false;
    label.textContent = editingId ? 'Save Changes' : 'Publish Article';
  }
}

function startEdit(id) {
  const article = allArticles.find(a => a.id === id);
  if (!article) return;
  editingId = id;

  document.getElementById('a-title').value    = article.title;
  document.getElementById('a-category').value = article.category;
  document.getElementById('a-impact').value   = article.impact;
  document.getElementById('a-desc').value     = article.description;
  document.getElementById('a-body').value     = article.body;
  document.getElementById('a-env').value      = article.env_impact;
  document.getElementById('a-ethics').value   = article.ethics;
  document.getElementById('a-actions').value  = article.actions;
  document.getElementById('a-emoji').value    = article.emoji || '';
  document.getElementById('a-color').value    = article.color || '#0d1f2d';
  document.getElementById('color-label').textContent = article.color || '#0d1f2d';

  document.getElementById('form-heading').textContent = 'Edit Article';
  document.getElementById('submit-label').textContent = 'Save Changes';
  document.getElementById('cancel-edit').style.display = 'inline-flex';

  switchTab('add');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelEdit() {
  editingId = null;
  document.getElementById('form-heading').textContent = 'New Article';
  document.getElementById('submit-label').textContent = 'Publish Article';
  document.getElementById('cancel-edit').style.display = 'none';
  document.getElementById('add-error').classList.remove('show');
  // Clear all fields
  ['a-title','a-category','a-impact','a-desc','a-body','a-env','a-ethics','a-actions','a-emoji'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('a-color').value = '#0d1f2d';
  document.getElementById('color-label').textContent = '#0d1f2d';
}

async function deleteArticle(id) {
  const article = allArticles.find(a => a.id === id);
  if (!confirm(`Delete "${article?.title || 'this article'}"? This cannot be undone.`)) return;
  try {
    await API.deleteArticle(id);
    showToast('🗑️ Article deleted');
    renderManageList();
    loadAdminStats();
  } catch (err) {
    showToast(`⚠ Delete failed: ${err.message}`, 'error');
  }
}

async function featureArticle(id) {
  try {
    await API.featureArticle(id);
    showToast('★ Article set as featured!');
    renderManageList();
  } catch (err) {
    showToast(`⚠ Feature failed: ${err.message}`, 'error');
  }
}

/* ── Toast ────────────────────────────────────────── */
let toastTimer;
function showToast(message, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.style.borderColor = type === 'error' ? 'rgba(224,90,58,0.4)' : 'var(--edge2)';
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ── Admin enter key ──────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement?.id === 'admin-pass') adminLogin();
});
