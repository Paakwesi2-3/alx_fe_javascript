// Initial quotes data
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "work" },
  { text: "In the middle of difficulty lies opportunity.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Strive not to be a success, but rather to be of value.", category: "success" },
  { text: "The only thing we have to fear is fear itself.", category: "courage" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
let currentCategory = 'all';

// Initialize the app
function init() {
  // Display first quote
  showRandomQuote();
  
  // Setup event listeners
  newQuoteBtn.addEventListener('click', showRandomQuote);
  
  // Generate category filter buttons
  generateCategoryFilters();
}

// Display a random quote
function showRandomQuote() {
  let filteredQuotes = quotes;
  
  if (currentCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === currentCategory);
  }
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p class="quote-text">No quotes found in this category.</p>`;
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <p class="quote-text">"${randomQuote.text}"</p>
    <p class="quote-category">— ${randomQuote.category}</p>
  `;
}

// Generate category filter buttons
function generateCategoryFilters() {
  // Get all unique categories
  const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing buttons
  categoryFilter.innerHTML = '';
  
  // Create buttons for each category
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category;
    btn.classList.add('category-btn');
    if (category === currentCategory) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      currentCategory = category;
      showRandomQuote();
      // Update active state of buttons
      document.querySelectorAll('.category-btn').forEach(button => {
        button.classList.remove('active');
      });
      btn.classList.add('active');
    });
    categoryFilter.appendChild(btn);
  });
}

// Add a new quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value;
  const quoteCategory = document.getElementById('newQuoteCategory').value;
  
  if (quoteText.trim() === '' || quoteCategory.trim() === '') {
    alert('Please enter both quote text and category');
    return;
  }
  
  const newQuote = {
    text: quoteText,
    category: quoteCategory.toLowerCase()
  };
  
  quotes.push(newQuote);
  
  // Clear input fields
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  
  // Update category filters
  generateCategoryFilters();
  
  // Show the newly added quote
  currentCategory = newQuote.category;
  showRandomQuote();
  
  // Set the new category button as active
  document.querySelectorAll('.category-btn').forEach(button => {
    button.classList.remove('active');
    if (button.textContent === newQuote.category) {
      button.classList.add('active');
    }
  });
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);