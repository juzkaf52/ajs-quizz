// config.js — Shared across all pages
// Replace this URL after deploying your Google Apps Script
const API_URL = 'https://script.google.com/macros/s/AKfycbxOrWxV_t54JpgakoUaAJw2HLplEbyuGIQW5qbLcyTrErq_02FlSmW41HMBBwvv_-Gd2w/exec';

async function api(action, payload = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ action, ...payload }),
  });
  return res.json();
}

function getUser() {
  try { return JSON.parse(sessionStorage.getItem('ajts_user') || 'null'); } catch { return null; }
}
function setUser(u) { sessionStorage.setItem('ajts_user', JSON.stringify(u)); }
function logout() { sessionStorage.removeItem('ajts_user'); window.location.href = 'index.html'; }
function requireAuth(role) {
  const u = getUser();
  if (!u) { window.location.href = 'index.html'; return null; }
  if (role && u.role !== role && u.role !== 'admin') { window.location.href = 'index.html'; return null; }
  return u;
}

function toast(msg, type = 'success') {
  let t = document.getElementById('__toast');
  if (!t) {
    t = document.createElement('div'); t.id = '__toast';
    t.style.cssText = `position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);
      padding:13px 28px;border-radius:10px;font-family:'Tajawal',sans-serif;font-size:.95rem;font-weight:600;
      z-index:9999;transition:transform .3s cubic-bezier(.34,1.56,.64,1);pointer-events:none;white-space:nowrap;`;
    document.body.appendChild(t);
  }
  t.style.background = type === 'error' ? '#7f1d1d' : type === 'warn' ? '#78350f' : '#14532d';
  t.style.color = '#fff';
  t.style.border = `1px solid ${type === 'error' ? '#ef4444' : type === 'warn' ? '#f59e0b' : '#4ade80'}`;
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(t._t);
  t._t = setTimeout(() => { t.style.transform = 'translateX(-50%) translateY(80px)'; }, 3000);
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit' });
}
