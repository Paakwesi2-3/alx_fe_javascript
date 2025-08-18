// 1. Quotes array with text and category properties
const quotes = [
    { text: "Sample quote 1", category: "category1" },
    { text: "Sample quote 2", category: "category2" }
];

// 2. displayRandomQuote function
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `${quote.text} (${quote.category})`;
}

// 3. createAddQuoteForm function
function createAddQuoteForm() {
    const form = document.createElement('div');
    form.innerHTML = `
        <input type="text" id="newQuoteText" placeholder="Quote text">
        <input type="text" id="newQuoteCategory" placeholder="Quote category">
        <button id="addQuoteButton">Add Quote</button>
    `;
    document.body.appendChild(form);
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// 4. addQuote function
function addQuote() {
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
    if (text && category) {
        quotes.push({ text, category });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        displayRandomQuote();
    }
}

// 5. Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

// Initialize
createAddQuoteForm();
displayRandomQuote();