// Quotes array with required structure
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "motivation" }
];

// displayRandomQuote function exactly as required
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${randomQuote.text} (${randomQuote.category})</p>`;
}

// createAddQuoteForm function exactly as required
function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteBtn">Add Quote</button>
    `;
    document.body.appendChild(formDiv);
    
    // Event listener for the add quote button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// addQuote function exactly as required
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    if (textInput.value.trim() && categoryInput.value.trim()) {
        quotes.push({
            text: textInput.value.trim(),
            category: categoryInput.value.trim()
        });
        
        textInput.value = '';
        categoryInput.value = '';
        displayRandomQuote();
    }
}

// Initialize the application
function init() {
    createAddQuoteForm();
    displayRandomQuote();
    
    // Event listener for "Show New Quote" button exactly as required
    document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);