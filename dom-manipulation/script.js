// Quotes array (with text + category)
const quotes = [
  { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "You must be the change you wish to see in the world.", category: "Inspiration" }
];

// Function: show random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").innerText = `${quote.text} - ${quote.category}`;
}

// Function: add new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listener: button for new quote
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);
