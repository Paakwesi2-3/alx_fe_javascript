// Initial quotes data - array with objects containing text and category properties
const quotes = [
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

// Function to display a random quote - renamed to match requirement
function displayRandomQuote() {
  let filteredQuotes = currentCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === currentCategory);
  
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

// Function to create the add quote form (though we already have it in HTML)
function createAddQuoteForm() {
  // In our case, the form is already in HTML, so we'll just ensure it's properly connected
  const formContainer = document.getElementById('addQuoteForm');
  formContainer.innerHTML = `
    <h3>Add Your Own Quote</h3>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Function to add a new quote
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
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  
  generateCategoryFilters();
  currentCategory = newQuote.category;
  displayRandomQuote();
  
  // Update active category button
  document.querySelectorAll('.category-btn').forEach(button => {
    button.classList.remove('active');
    if (button.textContent === newQuote.category) {
      button.classList.add('active');
    }
  });
}

// Generate category filter buttons
function generateCategoryFilters() {
  const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '';
  
  categories.forEach(category => {
    const btn = document.createElement('button');
    btn.textContent = category;
    btn.classList.add('category-btn');
    if (category === currentCategory) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      currentCategory = category;
      displayRandomQuote();
      document.querySelectorAll('.category-btn').forEach(button => {
        button.classList.remove('active');
      });
      btn.classList.add('active');
    });
    categoryFilter.appendChild(btn);
  });
}

// Initialize the application
function init() {
  createAddQuoteForm(); // Even though form exists in HTML, we call this to satisfy requirement
  displayRandomQuote();
  generateCategoryFilters();
  
  // Event listener for "Show New Quote" button
  newQuoteBtn.addEventListener('click', displayRandomQuote);
}

document.addEventListener('DOMContentLoaded', init);