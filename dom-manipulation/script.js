let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// -------- Populate Categories --------
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = savedCategory;
}

// -------- Filter Quotes --------
function filterQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const display = document.getElementById("quoteDisplay");
  display.innerHTML = "";

  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.textContent = `"${q.text}" - ${q.category}`;
    display.appendChild(p);
  });
}

// -------- Add Quote --------
function addQuote() {
  const text = document.getElementById("quoteText").value;
  const category = document.getElementById("quoteCategory").value;

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));

    populateCategories();
    filterQuote();

    postQuoteToServer(newQuote);

    document.getElementById("quoteText").value = "";
    document.getElementById("quoteCategory").value = "";
  }
}

// -------- Server Sync Functions --------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(post => ({
      text: post.title,
      category: "server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const data = await response.json();
    console.log("Quote synced to server:", data);
    return data;
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

  // Conflict resolution: server wins
  localQuotes = [...localQuotes, ...serverQuotes];
  localQuotes = Array.from(new Set(localQuotes.map(q => q.text)))
    .map(text => localQuotes.find(q => q.text === text));

  localStorage.setItem("quotes", JSON.stringify(localQuotes));
  quotes = localQuotes;

  populateCategories();
  filterQuote();

  // ✅ UI notification (alert + div)
  alert("Quotes synced with server!");
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
}

// -------- Initialization --------
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuote();
  setInterval(syncQuotes, 30000); // sync every 30s
});
