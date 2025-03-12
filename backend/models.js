const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Flashcard", flashcardSchema);