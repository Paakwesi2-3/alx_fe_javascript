// Quotes array with required properties
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspiration" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "motivation" }
];

// Required function name exactly as specified
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">— ${randomQuote.category}</p>
    `;
}

// Required function name exactly as specified
function createAddQuoteForm() {
    const formHTML = `
        <div id="addQuoteForm">
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Event listener for add quote button
    document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
}

// Required function
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

// Initialize application
function init() {
    createAddQuoteForm();
    displayRandomQuote();
    
    // Required event listener
    document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', init);