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
