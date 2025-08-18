// script.js

// DOM Elements
const quoteList = document.getElementById('quoteList');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const quoteInput = document.getElementById('quoteInput');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

// Quotes array
let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  if (stored) {
    try {
      quotes = JSON.parse(stored);
    } catch (e) {
      quotes = [];
    }
  }
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Render quotes to the DOM
function renderQuotes() {
  quoteList.innerHTML = '';
  quotes.forEach((q, idx) => {
    const li = document.createElement('li');
    li.textContent = q;
    li.onclick = () => {
      sessionStorage.setItem('lastViewedQuote', q);
      alert(`Last viewed quote stored in session: "${q}"`);
    };
    quoteList.appendChild(li);
  });
}

// Add a new quote
function addQuote() {
  const val = quoteInput.value.trim();
  if (val) {
    quotes.push(val);
    saveQuotes();
    renderQuotes();
    quoteInput.value = '';
  }
}

// Export quotes as JSON
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        renderQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (err) {
      alert('Failed to import: Invalid JSON.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize
function init() {
  loadQuotes();
  renderQuotes();

  addQuoteBtn.onclick = addQuote;
  exportBtn.onclick = exportQuotes;
  importFile.onchange = importFromJsonFile;
}

// Wait for DOM
document.addEventListener('DOMContentLoaded', init);

// Expose import for inline handler (if needed)
window.importFromJsonFile = importFromJsonFile;