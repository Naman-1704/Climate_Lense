/**
 * api.js — All communication with the FastAPI backend
 * Base URL auto-detects: localhost in dev, same origin in production
 */

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000'
  : window.location.origin;

const API = {

  async _fetch(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(err.detail || `HTTP ${res.status}`);
    }
    return res.json();
  },

  // ── Articles ──────────────────────────────────
  getArticles(category, search) {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (search) params.set('search', search);
    const qs = params.toString();
    return this._fetch(`/api/articles${qs ? '?' + qs : ''}`);
  },

  getFeatured() {
    return this._fetch('/api/articles/featured');
  },

  getArticle(id) {
    return this._fetch(`/api/articles/${id}`);
  },

  createArticle(data) {
    return this._fetch('/api/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateArticle(id, data) {
    return this._fetch(`/api/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteArticle(id) {
    return this._fetch(`/api/articles/${id}`, { method: 'DELETE' });
  },

  featureArticle(id) {
    return this._fetch(`/api/articles/${id}/feature`, { method: 'PATCH' });
  },

  // ── Stats ─────────────────────────────────────
  getStats() {
    return this._fetch('/api/stats');
  },

  // ── Auth ──────────────────────────────────────
  login(username, password) {
    return this._fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
};
