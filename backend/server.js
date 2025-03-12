const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const flashcardRoutes = require('./routes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Połączenie z MongoDB
mongoose.connect('mongodb://localhost:27017/flashcards', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Połączono z MongoDB'))
.catch(err => {
  console.error('Błąd połączenia z MongoDB:', err);
  process.exit(1); // Zakończ proces w przypadku błędu
});

// Routes
app.use('/api', flashcardRoutes);

// Statyczne pliki
app.use(express.static(path.join(__dirname, '../frontend')));

// Strony HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/add', (req, res) => res.sendFile(path.join(__dirname, '../frontend/add.html')));
app.get('/quiz', (req, res) => res.sendFile(path.join(__dirname, '../frontend/quiz.html')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Serwer działa na porcie ${PORT}`));