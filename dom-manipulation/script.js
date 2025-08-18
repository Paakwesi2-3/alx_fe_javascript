const quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
];

function showRandomQuote(category = null) {
  let filteredQuotes = quotes;
  if (category) {
    filteredQuotes = quotes.filter(q => q.category === category);
  }
  if (filteredQuotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" — ${quote.category}`;
}

function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  textInput.value = '';
  categoryInput.value = '';
  showRandomQuote();
  updateCategoryDropdown();
}

function createAddQuoteForm() {
  const formDiv = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.type = 'text';
  textInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formDiv.appendChild(textInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

function updateCategoryDropdown() {
  let dropdown = document.getElementById('categoryDropdown');
  if (!dropdown) {
    dropdown = document.createElement('select');
    dropdown.id = 'categoryDropdown';
    dropdown.onchange = function() {
      const selected = dropdown.value;
      showRandomQuote(selected === 'All' ? null : selected);
    };
    document.body.insertBefore(dropdown, document.getElementById('quoteDisplay'));
  }
  // Remove all options
  dropdown.innerHTML = '';
  // Add "All" option
  const allOption = document.createElement('option');
  allOption.value = 'All';
  allOption.textContent = 'All Categories';
  dropdown.appendChild(allOption);

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });
}

document.getElementById('newQuote').addEventListener('click', () => {
  const dropdown = document.getElementById('categoryDropdown');
  const selectedCategory = dropdown && dropdown.value !== 'All' ? dropdown.value : null;
  showRandomQuote(selectedCategory);
});

// Initial setup
showRandomQuote();
createAddQuoteForm();
updateCategoryDropdown();