// Quotes array with text and category
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Resilience" }
];

// Function to display a random quote
function displayRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const categoryFilter = document.getElementById("categoryFilter");
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
  quoteDisplay.textContent = `"${filteredQuotes[randomIndex].text}" - (${filteredQuotes[randomIndex].category})`;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories(); // update categories if new one added
  }
}

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = "";
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from local storage
  const lastFilter = localStorage.getItem("selectedCategory");
  if (lastFilter && categories.includes(lastFilter)) {
    categoryFilter.value = lastFilter;
  }
}

// Function to filter quotes and save selection
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selected = categoryFilter.value;

  // Save selected category in local storage
  localStorage.setItem("selectedCategory", selected);

  displayRandomQuote();
}

// Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

// Initialize
populateCategories();
displayRandomQuote();
