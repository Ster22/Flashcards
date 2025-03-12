const express = require('express');
const router = express.Router();
const Flashcard = require('./models');

// Middleware do obsługi błędów
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Pobierz wszystkie fiszki
router.get('/flashcards', asyncHandler(async (req, res) => {
  const flashcards = await Flashcard.find().sort({ createdAt: -1 });
  res.json(flashcards);
}));

// Pobierz fiszki z danej kategorii
router.get('/flashcards/:category', asyncHandler(async (req, res) => {
  const { category } = req.params;
  const flashcards = await Flashcard.find({ category }).sort({ createdAt: -1 });
  res.json(flashcards);
}));

// Dodaj fiszkę
router.post('/add-flashcard', asyncHandler(async (req, res) => {
  const { question, answer, category } = req.body;
  const newFlashcard = new Flashcard({ question, answer, category });
  const savedFlashcard = await newFlashcard.save();
  res.status(201).json(savedFlashcard);
}));

// Pobierz wszystkie kategorie
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Flashcard.distinct('category');
  res.json(categories);
}));

// Usuń fiszkę
router.delete('/flashcards/:id', asyncHandler(async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: 'Fiszka usunięta' });
}));

module.exports = router;