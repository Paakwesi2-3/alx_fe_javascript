// -------- Initial Setup --------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
];

// -------- DOM Elements --------
const quoteDisplay = document.getElementById("quoteDisplay");
const categorySelect = document.getElementById("categorySelect");

// -------- Display Functions --------
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" (${randomQuote.category})`;
}

function displayQuotes(filteredQuotes) {
  quoteDisplay.textContent = "";
  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" (${q.category})`;
    quoteDisplay.appendChild(p);
  });
}

// -------- Populate Categories --------
function populateCategories() {
  categorySelect.innerHTML = `<option value="all">All Categories</option>`;
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // restore saved category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categorySelect.value = savedCategory;
    filterQuote();
  }
}

// -------- Filter Function --------
function filterQuote() {
  const selectedCategory = categorySelect.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  if (selectedCategory === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter(q => q.category === selectedCategory);
    displayQuotes(filtered);
  }
}

// -------- Add Quote --------
function addQuote() {
  const text = document.getElementById("quoteInput").value;
  const category = document.getElementById("categoryInput").value;

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    displayQuotes(quotes);

    // sync with server
    postQuoteToServer(newQuote);

    document.getElementById("quoteInput").value = "";
    document.getElementById("categoryInput").value = "";
  }
}

// -------- Server Sync Functions --------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

function fetchQuotesFromServer() {
  return fetch(SERVER_URL)
    .then(response => response.json())
    .then(data => {
      return data.slice(0, 5).map(post => ({
        text: post.title,
        category: "server"
      }));
    })
    .catch(error => {
      console.error("Error fetching from server:", error);
      return [];
    });
}

function postQuoteToServer(quote) {
  return fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Quote synced to server:", data);
      return data;
    })
    .catch(error => console.error("Error posting to server:", error));
}

function syncQuotes() {
  fetchQuotesFromServer().then(serverQuotes => {
    let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

    // server wins in conflict
    localQuotes = [...localQuotes, ...serverQuotes];
    localQuotes = Array.from(new Set(localQuotes.map(q => q.text)))
      .map(text => localQuotes.find(q => q.text === text));

    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    quotes = localQuotes;

    // update UI
    populateCategories();
    filterQuote();

    // notification
    const notification = document.createElement("div");
    notification.textContent = "Quotes synced with server!";
    notification.style.background = "lightgreen";
    notification.style.padding = "10px";
    notification.style.position = "fixed";
    notification.style.bottom = "10px";
    notification.style.right = "10px";
    notification.style.zIndex = "1000";
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  });
}

// -------- Event Listeners --------
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
categorySelect.addEventListener("change", filterQuote);

// -------- Init --------
populateCategories();
filterQuote();
setInterval(syncQuotes, 30000);
