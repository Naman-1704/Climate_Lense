/**
 * render.js — HTML generation helpers for articles
 */

const CAT_TAG_CLASS = {
  flood:         'tag-flood',
  heatwave:      'tag-heatwave',
  pollution:     'tag-pollution',
  deforestation: 'tag-deforestation',
  policy:        'tag-policy',
  glacier:       'tag-glacier',
  biodiversity:  'tag-biodiversity',
};

const IMPACT_CLASS = { high: 'impact-high', med: 'impact-med', low: 'impact-low' };
const IMPACT_LABEL = { high: '⬆ High Impact', med: '● Med Impact', low: '↓ Low Impact' };
const IMPACT_COLOR = { high: '#e05a3a', med: '#e8c44a', low: '#3ddc84' };
const IMPACT_PCT   = { high: 88, med: 55, low: 28 };

function fmtDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

function tagHTML(category) {
  const cls = CAT_TAG_CLASS[category] || 'tag-policy';
  const label = (category || '').charAt(0).toUpperCase() + (category || '').slice(1);
  return `<span class="tag ${cls}">${label}</span>`;
}

function impactHTML(impact) {
  const cls = IMPACT_CLASS[impact] || 'impact-low';
  return `<span class="impact-badge ${cls}">${IMPACT_LABEL[impact] || impact}</span>`;
}

function renderCardHTML(a) {
  return `
    <div class="news-card" data-id="${a.id}" role="button" tabindex="0" aria-label="Read article: ${a.title}">
      <div class="card-vis" style="background:${a.color || '#161e15'}">
        <div class="card-vis-glow"></div>
        <span class="card-emoji">${a.emoji || '🌍'}</span>
      </div>
      <div class="card-body">
        <div class="card-meta-row">
          ${tagHTML(a.category)}
          ${impactHTML(a.impact)}
          <span class="card-date">${fmtDate(a.date_added)}</span>
        </div>
        <div class="card-title">${a.title}</div>
        <div class="card-desc">${a.description}</div>
        <div class="card-footer-row">
          <div class="card-impact-row">
            <div class="impact-pip" style="background:${IMPACT_COLOR[a.impact] || '#3ddc84'}"></div>
            <span style="font-size:0.72rem; color:var(--text4); font-family:var(--font-mono)">${a.category}</span>
          </div>
          <span class="card-read-link">Read Analysis <span>→</span></span>
        </div>
      </div>
    </div>
  `;
}

function renderFeaturedHTML(a) {
  return `
    <div class="featured-card" data-id="${a.id}" role="button" tabindex="0" aria-label="Read featured: ${a.title}">
      <div class="featured-vis" style="background:${a.color || '#161e15'}">
        <div class="featured-vis-glow"></div>
        <span class="featured-vis-emoji">${a.emoji || '🌍'}</span>
      </div>
      <div class="featured-body">
        <div class="feat-eyebrow">★ Featured Story</div>
        <div class="feat-title">${a.title}</div>
        <div class="feat-desc">${a.description}</div>
        <div class="feat-meta">
          ${tagHTML(a.category)}
          ${impactHTML(a.impact)}
          <span class="detail-date">${fmtDate(a.date_added)}</span>
        </div>
        <button class="btn-read">
          Read Full Analysis
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  `;
}

function renderDetailHTML(a) {
  const actions = (a.actions || '').split('\n').filter(s => s.trim());
  const pct = IMPACT_PCT[a.impact] || 40;
  const color = IMPACT_COLOR[a.impact] || '#3ddc84';
  const bodyParagraphs = (a.body || '').split('\n').filter(s => s.trim()).map(p => `<p>${p}</p>`).join('');

  return `
    <button class="back-btn" id="back-btn">← Back to Articles</button>

    <div class="detail-vis" style="background:${a.color || '#161e15'}">
      <div class="featured-vis-glow"></div>
      <span class="detail-vis-emoji">${a.emoji || '🌍'}</span>
    </div>

    <div class="detail-meta-row">
      ${tagHTML(a.category)}
      ${impactHTML(a.impact)}
      <span class="detail-date">${fmtDate(a.date_added)}</span>
    </div>

    <h1 class="detail-title">${a.title}</h1>
    <div class="detail-byline">📌 ClimateLens Editorial Team</div>

    <div class="detail-body">${bodyParagraphs || `<p>${a.description}</p>`}</div>

    <div class="analysis-block">
      <div class="analysis-card env-card">
        <h3>🌿 Environmental Impact</h3>
        <p>${a.env_impact}</p>
        <div class="impact-bar-wrap">
          <div class="impact-bar-header">
            <span>Ecological Severity</span>
            <span>${pct}%</span>
          </div>
          <div class="impact-bar-track">
            <div class="impact-bar-fill" style="width:0%; background:${color}" data-target="${pct}"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="analysis-block">
      <div class="analysis-card eth-card">
        <h3>⚖️ Ethical Perspective</h3>
        <p>${a.ethics}</p>
      </div>
    </div>

    <div class="analysis-block">
      <div class="analysis-card act-card">
        <h3>💡 Suggested Actions</h3>
        <ul class="actions-list">
          ${actions.map(act => `
            <li>
              <span class="action-arrow">→</span>
              <span>${act}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderManageRowHTML(a) {
  const featuredBadge = a.featured ? `<span class="featured-star">★ Featured</span>` : '';
  return `
    <div class="manage-row" data-id="${a.id}">
      <span class="manage-emoji">${a.emoji || '🌍'}</span>
      <div class="manage-info">
        <div class="manage-title">${a.title}</div>
        <div class="manage-meta">
          ${tagHTML(a.category)}
          ${impactHTML(a.impact)}
          ${featuredBadge}
          <span style="font-family:var(--font-mono); font-size:0.68rem; color:var(--text4)">${fmtDate(a.date_added)}</span>
        </div>
      </div>
      <div class="manage-actions">
        <button class="btn-maction btn-mfeature" data-action="feature" data-id="${a.id}" title="Set as featured">★</button>
        <button class="btn-maction btn-medit" data-action="edit" data-id="${a.id}">Edit</button>
        <button class="btn-maction btn-mdelete" data-action="delete" data-id="${a.id}">Delete</button>
      </div>
    </div>
  `;
}
