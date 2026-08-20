/**
 * flags.js — shared feature flag store
 *
 * Flags are persisted in localStorage under the key "featureFlags".
 * Each flag has:
 *   - key:         unique identifier used in code
 *   - label:       human-readable name shown in the admin UI
 *   - description: short explanation of what the flag does
 *   - default:     value used when no saved preference exists
 *   - condition:   optional function — if provided, flag is only surfaced in the
 *                  admin UI when condition() returns true (e.g. date windows)
 *
 * To add a new flag, append an entry to FLAG_DEFINITIONS and read it in your
 * feature code via Flags.get('your-flag-key').
 */

const FLAG_DEFINITIONS = [
  {
    key: 'christmas-cursor',
    label: 'Christmas Cursor 🎄',
    description: 'Small Christmas trees follow the cursor during the festive season.',
    default: true,
    condition: () => {
      // Visible in the admin UI year-round, but only active on the main page
      // when within the date window defined in script.js
      return true;
    },
  },
  {
    key: 'union-flag-bg',
    label: 'Union Flag Background 🇬🇧',
    description: 'Tiles the page background with Union Jack emoji.',
    default: false,
  },
  // ── Add new flags below this line ───────────────────────────────────────────
  // {
  //   key: 'my-new-feature',
  //   label: 'My New Feature',
  //   description: 'What this feature does.',
  //   default: false,
  // },
];

const STORAGE_KEY = 'featureFlags';

const Flags = (() => {
  function _load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function _save(store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  /** Get the current value of a flag by key. Returns the flag's default if not yet set. */
  function get(key) {
    const store = _load();
    const def = FLAG_DEFINITIONS.find(f => f.key === key);
    if (!def) return false;
    return key in store ? store[key] : def.default;
  }

  /** Set a flag value explicitly. */
  function set(key, value) {
    const store = _load();
    store[key] = value;
    _save(store);
  }

  /** Reset all flags to their defaults. */
  function resetAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Returns all flag definitions (with their current values injected). */
  function getAll() {
    return FLAG_DEFINITIONS.map(def => ({
      ...def,
      value: get(def.key),
    }));
  }

  return { get, set, resetAll, getAll };
})();
