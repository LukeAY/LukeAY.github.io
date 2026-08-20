// ── Feature flags admin page ──────────────────────────────────
//
// Change this passphrase to whatever you like.
const PASSPHRASE = 'luke';

const lockScreen  = document.getElementById('lock-screen');
const adminPanel  = document.getElementById('admin-panel');
const lockForm    = document.getElementById('lock-form');
const lockInput   = document.getElementById('lock-input');
const lockError   = document.getElementById('lock-error');
const flagsList   = document.getElementById('flags-list');
const resetBtn    = document.getElementById('reset-btn');

// ── Auth ──────────────────────────────────────────────────────
// Session-only: unlocked state is not persisted between visits.
let unlocked = false;

lockForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (lockInput.value === PASSPHRASE) {
    unlock();
  } else {
    lockError.hidden = false;
    lockInput.value = '';
    lockInput.focus();
    lockInput.classList.add('shake');
    lockInput.addEventListener('animationend', () => {
      lockInput.classList.remove('shake');
    }, { once: true });
  }
});

function unlock() {
  unlocked = true;
  lockScreen.hidden = true;
  adminPanel.hidden = false;
  renderFlags();
}

// ── Render ────────────────────────────────────────────────────
function renderFlags() {
  flagsList.innerHTML = '';
  const flags = Flags.getAll();

  if (flags.length === 0) {
    flagsList.innerHTML = '<li class="flags-empty">No flags defined yet.</li>';
    return;
  }

  flags.forEach(flag => {
    const li = document.createElement('li');
    li.className = 'flag-row';

    const id = `flag-${flag.key}`;

    li.innerHTML = `
      <div class="flag-info">
        <label class="flag-label" for="${id}">${flag.label}</label>
        <p class="flag-desc">${flag.description}</p>
      </div>
      <div class="flag-control">
        <span class="flag-status ${flag.value ? 'on' : 'off'}">${flag.value ? 'On' : 'Off'}</span>
        <button
          id="${id}"
          class="flag-toggle ${flag.value ? 'enabled' : ''}"
          role="switch"
          aria-checked="${flag.value}"
          aria-label="Toggle ${flag.label}"
        >
          <span class="flag-toggle-thumb"></span>
        </button>
      </div>
    `;

    li.querySelector('.flag-toggle').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      const newValue = btn.getAttribute('aria-checked') !== 'true';
      Flags.set(flag.key, newValue);
      btn.setAttribute('aria-checked', newValue);
      btn.classList.toggle('enabled', newValue);
      const status = li.querySelector('.flag-status');
      status.textContent = newValue ? 'On' : 'Off';
      status.className = `flag-status ${newValue ? 'on' : 'off'}`;
    });

    flagsList.appendChild(li);
  });
}

// ── Reset ─────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  if (confirm('Reset all flags to their default values?')) {
    Flags.resetAll();
    renderFlags();
  }
});
