/**
 * Dynamic Quote Generator with Category Filtering and Web Storage
 * Assumes the following HTML structure:
 * 
 * <select id="categoryFilter" onchange="filterQuotes()">
 *   <option value="all">All Categories</option>
 *   <!-- Dynamically populated categories -->
 * </select>
 * <div id="quotesContainer"></div>
 * <form id="addQuoteForm">
 *   <input type="text" id="quoteText" placeholder="Quote" required>
 *   <input type="text" id="quoteAuthor" placeholder="Author" required>
 *   <input type="text" id="quoteCategory" placeholder="Category" required>
 *   <button type="submit">Add Quote</button>
 * </form>
 */

// --- Initialization ---

// Load quotes from localStorage or use default
const defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett", category: "Success" }
];

function getQuotes() {
  return JSON.parse(localStorage.getItem('quotes')) || defaultQuotes;
}

function setQuotes(quotes) {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// --- Category Population ---

function populateCategories() {
  const quotes = getQuotes();
  const categories = Array.from(new Set(quotes.map(q => q.category)));
  const filter = document.getElementById('categoryFilter');
  // Remove all except "All Categories"
  filter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter
  const lastFilter = localStorage.getItem('lastCategoryFilter');
  if (lastFilter && filter.querySelector(`option[value="${lastFilter}"]`)) {
    filter.value = lastFilter;
  }
}

// --- Quote Filtering ---

function filterQuotes() {
  const filter = document.getElementById('categoryFilter');
  const selected = filter.value;
  localStorage.setItem('lastCategoryFilter', selected);

  const quotes = getQuotes();
  const filtered = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  displayQuotes(filtered);
}

// --- Display Quotes ---

function displayQuotes(quotes) {
  const container = document.getElementById('quotesContainer');
  container.innerHTML = '';
  if (quotes.length === 0) {
    container.textContent = 'No quotes found for this category.';
    return;
  }
  quotes.forEach(q => {
    const div = document.createElement('div');
    div.className = 'quote';
    div.innerHTML = `<blockquote>${q.text}</blockquote>
      <footer>- ${q.author} <em>(${q.category})</em></footer>`;
    container.appendChild(div);
  });
}

// --- Add Quote ---

function addQuote(e) {
  e.preventDefault();
  const text = document.getElementById('quoteText').value.trim();
  const author = document.getElementById('quoteAuthor').value.trim();
  const category = document.getElementById('quoteCategory').value.trim();
  if (!text || !author || !category) return;

  const quotes = getQuotes();
  quotes.push({ text, author, category });
  setQuotes(quotes);

  populateCategories();
  filterQuotes();

  // Reset form
  e.target.reset();
}

// --- Event Listeners and Initial Load ---

document.addEventListener('DOMContentLoaded', () => {
  populateCategories();
  filterQuotes();

  // Listen for add quote form
  const form = document.getElementById('addQuoteForm');
  if (form) {
    form.addEventListener('submit', addQuote);
  }

  // Listen for category filter change (if not using inline onchange)
  const filter = document.getElementById('categoryFilter');
  if (filter && !filter.hasAttribute('onchange')) {
    filter.addEventListener('change', filterQuotes);
  }
});