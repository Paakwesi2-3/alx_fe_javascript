// 1. Quotes array with text and category properties
const quotes = [
    { text: "Sample quote 1", category: "inspiration" },
    { text: "Sample quote 2", category: "motivation" }
];

// 2. displayRandomQuote function
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `
        <p>"${randomQuote.text}"</p>
        <p>- ${randomQuote.category}</p>
    `;
}

// 3. createAddQuoteForm function
function createAddQuoteForm() {
    const formHTML = `
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHTML);
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