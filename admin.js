let uploadedImageData = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchItems();
  document.getElementById('itemForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancelEdit').addEventListener('click', cancelEdit);
  document.getElementById('imageFile').addEventListener('change', handleImageUpload);
});

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImageData = e.target.result;
      console.log('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  }
}

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
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200x150?text=Cap+Image'">
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p><strong>Quality:</strong> ${item.quality}</p>
        <p><strong>Year Released:</strong> ${item.year}</p>
      </div>
      <div class="item-actions">
        <button onclick="editItem(${item.id})">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      </div>
    `;
    container.appendChild(itemDiv);
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  
  // Use uploaded image if available, otherwise use URL
  const imageData = uploadedImageData || formData.get('image');
  
  const itemData = {
    name: formData.get('name'),
    quality: formData.get('quality'),
    year: parseInt(formData.get('year')),
    image: imageData
  };
  const itemId = formData.get('id');

  if (itemId) {
    updateItem(itemId, itemData);
  } else {
    createItem(itemData);
  }
  
  uploadedImageData = null;
}

async function createItem(itemData) {
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    if (response.ok) {
      fetchItems();
      document.getElementById('itemForm').reset();
    }
  } catch (error) {
    console.error('Error creating item:', error);
  }
}

async function updateItem(id, itemData) {
  try {
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    if (response.ok) {
      fetchItems();
      cancelEdit();
    }
  } catch (error) {
    console.error('Error updating item:', error);
  }
}

async function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
}

function editItem(id) {
  fetch(`/api/items/${id}`)
    .then(response => response.json())
    .then(item => {
      document.getElementById('itemId').value = item.id;
      document.getElementById('name').value = item.name;
      document.getElementById('quality').value = item.quality;
      document.getElementById('year').value = item.year;
      document.getElementById('image').value = item.image;
      document.getElementById('cancelEdit').style.display = 'inline-block';
    })
    .catch(error => console.error('Error fetching item:', error));
}

function cancelEdit() {
  document.getElementById('itemForm').reset();
  document.getElementById('itemId').value = '';
  document.getElementById('cancelEdit').style.display = 'none';
  document.getElementById('quality').value = '';
  document.getElementById('year').value = '';
  document.getElementById('image').value = '';
  document.getElementById('imageFile').value = '';
  uploadedImageData = null;
}