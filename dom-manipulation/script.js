// script.js

// Quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Don’t let yesterday take up too much of today.", category: "Motivation" },
  { text: "Your time is limited, don’t waste it living someone else’s life.", category: "Life" }
];

// Show a random quote
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  display.textContent = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    populateCategories(); // refresh dropdown if new category added
    filterQuote(); // update display based on filter
  }
}

// Populate categories dynamically
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  filter.innerHTML = '<option value="all">All Categories</option>';

  const categories = Array.from(new Set(quotes.map(q => q.category)));
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });

  // Restore last selected filter from localStorage
  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter && filter.querySelector(`option[value="${lastFilter}"]`)) {
    filter.value = lastFilter;
  }
}

// Filter quotes based on selected category
function filterQuote() {
  const filter = document.getElementById("categoryFilter");
  const selected = filter.value;

  localStorage.setItem("lastCategoryFilter", selected);

  const display = document.getElementById("quoteDisplay");
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    display.textContent = `"${filtered[randomIndex].text}" — ${filtered[randomIndex].category}`;
  } else {
    display.textContent = "No quotes available for this category.";
  }
}

// Event listener for new quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for category filter
document.getElementById("categoryFilter").addEventListener("change", filterQuote);

// Initialize on page load
window.onload = function () {
  populateCategories();
  filterQuote();
};
