const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sample data for vintage NBA caps
let vintageItems = [
  { id: 1, name: 'Lakers Cap', quality: 'Excellent', year: 1995, image: 'https://via.placeholder.com/250x200?text=Lakers+Cap' },
  { id: 2, name: 'Bulls Cap', quality: 'Good', year: 1998, image: 'https://via.placeholder.com/250x200?text=Bulls+Cap' },
  { id: 3, name: 'Celtics Cap', quality: 'Excellent', year: 1986, image: 'https://via.placeholder.com/250x200?text=Celtics+Cap' }
];

// API endpoints
app.get('/api/items', (req, res) => {
  res.json(vintageItems);
});

app.post('/api/items', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  vintageItems.push(newItem);
  res.json(newItem);
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = vintageItems.find(i => i.id === id);
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = vintageItems.findIndex(i => i.id === id);
  if (index !== -1) {
    vintageItems.splice(index, 1);
    res.json({ message: 'Item deleted' });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🎩 Vintage Cap Showcase System running on http://localhost:${PORT}`);
  console.log(`📱 Main Showcase: http://localhost:${PORT}/`);
  console.log(`⚙️  Admin Panel: http://localhost:${PORT}/admin`);
});