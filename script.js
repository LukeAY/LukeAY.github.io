// ── Dark mode toggle ────────────────────────────────────────
const toggle = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');

// Respect the user's OS preference on first visit, then use saved preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

applyTheme(initialTheme);

toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', theme);
}

// ── Footer year ─────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Christmas cursor ─────────────────────────────────────────
// Define the festive date window (month is 0-indexed: 11 = December)
const XMAS_START = { month: 11, day: 1  };  // 1 Dec
const XMAS_END   = { month: 11, day: 31 }; // 31 Dec

const xmasBtn = document.getElementById('xmas-toggle');
let xmasEnabled = false;
let lastTreeTime = 0;
const TREE_INTERVAL = 40; // ms between spawns while moving — lower = more trees

function isXmasSeason() {
  const now = new Date();
  const month = now.getMonth();
  const day   = now.getDate();
  const afterStart = month > XMAS_START.month ||
    (month === XMAS_START.month && day >= XMAS_START.day);
  const beforeEnd  = month < XMAS_END.month ||
    (month === XMAS_END.month && day <= XMAS_END.day);
  return afterStart && beforeEnd;
}

function spawnTree(x, y) {
  const el = document.createElement('span');
  el.className = 'xmas-tree';
  el.textContent = '🎄';
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function onMouseMove(e) {
  if (!xmasEnabled) return;
  const now = Date.now();
  if (now - lastTreeTime < TREE_INTERVAL) return;
  lastTreeTime = now;
  spawnTree(e.clientX, e.clientY);
}

function setXmas(enabled) {
  xmasEnabled = enabled;
  localStorage.setItem('xmasEnabled', enabled);
  xmasBtn.classList.toggle('active', enabled);
  xmasBtn.setAttribute('aria-pressed', enabled);
}

if (isXmasSeason()) {
  xmasBtn.hidden = false;
  // Restore preference from last visit
  const savedXmas = localStorage.getItem('xmasEnabled');
  setXmas(savedXmas === null ? true : savedXmas === 'true');
  xmasBtn.addEventListener('click', () => setXmas(!xmasEnabled));
  document.addEventListener('mousemove', onMouseMove);
}
