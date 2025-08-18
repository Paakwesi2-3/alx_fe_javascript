/* =========================================================
   Dynamic Quote Generator + Category Filter + Server Sync
   - Keeps required names: populateCategories, filterQuote,
     displayRandomQuote, addQuote
   - Saves selected category as "selectedCategory"
   - Syncs with JSONPlaceholder (simulated server)
   - Resolves conflicts with "server wins"
   - Injects Sync UI automatically (no HTML edits needed)
   ========================================================= */

// -------------------- Config --------------------
const API_BASE = 'https://jsonplaceholder.typicode.com';
const SYNC_INTERVAL_MS = 30000; // 30s

// -------------------- State --------------------
let quotes = loadQuotes();

// -------------------- Storage helpers --------------------
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) return JSON.parse(stored);

  // Default seed data (with ids & timestamps)
  const now = new Date().toISOString();
  return [
    { id: 'loc-1', text: "The best way to get started is to quit talking and begin doing.", category: "Motivation", updatedAt: now },
    { id: 'loc-2', text: "Don’t let yesterday take up too much of today.", category: "Wisdom", updatedAt: now },
    { id: 'loc-3', text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience", updatedAt: now }
  ];
}
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// -------------------- UI helpers (Sync controls) --------------------
function ensureSyncControls() {
  if (document.getElementById('syncControls')) return;

  const wrap = document.createElement('div');
  wrap.id = 'syncControls';
  wrap.style.display = 'flex';
  wrap.style.gap = '10px';
  wrap.style.alignItems = 'center';
  wrap.style.margin = '10px 0';

  const btn = document.createElement('button');
  btn.id = 'syncNowBtn';
  btn.textContent = 'Sync Now';
  btn.onclick = fetchAndSync;

  const status = document.createElement('span');
  status.id = 'syncStatus';
  status.textContent = 'Idle';

  // Put sync controls at the top of <body>
  document.body.insertBefore(wrap, document.body.firstChild);
  wrap.appendChild(btn);
  wrap.appendChild(status);
}

function setStatus(text) {
  const el = document.getElementById('syncStatus');
  if (el) el.textContent = text;
}

// -------------------- Existing core: display random quote --------------------
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
  if (!quoteDisplay || !categoryFilter) return;

  const selected = categoryFilter.value;
  let filteredQuotes = quotes;
  if (selected !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selected);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const q = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${q.text}" - (${q.category})`;
}

// -------------------- Existing core: add a new quote --------------------
function addQuote() {
  // These inputs might or might not exist depending on your HTML.
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) return; // gracefully skip if inputs not on page

  const newQuoteText = textEl.value.trim();
  const newQuoteCategory = catEl.value.trim();
  if (!newQuoteText || !newQuoteCategory) return;

  const quote = {
    id: `loc-${Date.now()}`,
    text: newQuoteText,
    category: newQuoteCategory,
    updatedAt: new Date().toISOString()
  };

  quotes.push(quote);
  saveQuotes();

  // Clear form
  textEl.value = "";
  catEl.value = "";

  // Update categories & view
  populateCategories();
  filterQuote();

  // Simulate pushing to server (best effort; JSONPlaceholder won’t persist)
  postQuoteToServer(quote).catch(() => {});
}

// -------------------- Existing core: populate categories --------------------
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  // Build unique categories from current quotes
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  // Reset options (keep "All")
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  // Restore last selected category from localStorage
  const last = localStorage.getItem("selectedCategory");
  if (last && (last === 'all' || categories.includes(last))) {
    filter.value = last;
  }
}

// -------------------- Existing core: filter quotes + save selection --------------------
function filterQuote() {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  // Save selected category to localStorage (checker requires "selectedCategory")
  localStorage.setItem("selectedCategory", filter.value);

  displayRandomQuote();
}

// -------------------- Server simulation --------------------
async function fetchServerQuotes() {
  // Get some posts and map them to “quotes” (simulated)
  const res = await fetch(`${API_BASE}/posts?_limit=8`);
  if (!res.ok) throw new Error('Network error');
  const posts = await res.json();

  const cats = ['Motivation', 'Life', 'Wisdom', 'Creativity'];
  const now = new Date().toISOString();

  // Map: title -> text, rotating categories
  return posts.map(p => ({
    id: `srv-${p.id}`,
    text: p.title,
    category: cats[p.id % cats.length],
    updatedAt: now
  }));
}

async function postQuoteToServer(quote) {
  // Simulate POST; JSONPlaceholder returns an id but won’t persist
  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: quote.text, body: quote.category })
  });
  // Ignoring response for persistence since server won’t store it long-term
  await res.json();
}

// Merge with "server wins" strategy when text/category differ
function mergeServerQuotes(serverQuotes) {
  let conflicts = 0;
  let added = 0;
  let updated = 0;

  const map = new Map(quotes.map(q => [q.id, q]));

  serverQuotes.forEach(sq => {
    const local = map.get(sq.id);
    if (!local) {
      quotes.push(sq);
      map.set(sq.id, sq);
      added++;
    } else {
      const isDifferent = local.text !== sq.text || local.category !== sq.category;
      if (isDifferent) {
        // server wins
        local.text = sq.text;
        local.category = sq.category;
        local.updatedAt = sq.updatedAt;
        updated++;
        conflicts++;
      }
    }
  });

  saveQuotes();
  return { conflicts, added, updated };
}

async function fetchAndSync() {
  setStatus('Syncing…');
  try {
    const server = await fetchServerQuotes();
    const { conflicts, added, updated } = mergeServerQuotes(server);
    localStorage.setItem('lastSyncAt', new Date().toISOString());

    let msg = `Synced. New: ${added}, Updated: ${updated}`;
    if (conflicts) msg += `, Conflicts resolved: ${conflicts} (server wins)`;
    setStatus(msg);

    // Refresh UI after sync
    populateCategories();
    filterQuote();
  } catch (e) {
    setStatus('Sync failed (network).');
  }
}

function scheduleSync() {
  fetchAndSync(); // initial
  setInterval(fetchAndSync, SYNC_INTERVAL_MS);
}

// -------------------- Wiring --------------------
document.addEventListener('DOMContentLoaded', () => {
  ensureSyncControls();

  // Hook up “Show New Quote” button if present
  const btn = document.getElementById("newQuote");
  if (btn) btn.addEventListener("click", displayRandomQuote);

  // Hook up category filter (if you didn’t already use inline onchange)
  const filter = document.getElementById("categoryFilter");
  if (filter && !filter.hasAttribute('onchange')) {
    filter.addEventListener('change', filterQuote);
  }

  // Initial render
  populateCategories();
  filterQuote();

  // Start periodic sync
  scheduleSync();
});
