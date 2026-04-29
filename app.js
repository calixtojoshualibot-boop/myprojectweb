document.addEventListener('DOMContentLoaded', () => {
  fetchItems();
});

async function fetchItems() {
  try {
    const response = await fetch('/api/items');
    const items = await response.json();
    displayItems(items);
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}

function displayItems(items) {
  const container = document.getElementById('items-container');
  container.innerHTML = '';
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
      <div class="cap-image">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/250x200?text=Cap+Image'">
      </div>
      <div class="cap-info">
        <h2>${item.name}</h2>
        <p><strong>Quality:</strong> ${item.quality}</p>
        <p><strong>Year Released:</strong> ${item.year}</p>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}