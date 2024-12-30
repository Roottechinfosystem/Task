
const Book = require('../models/bookModel');


exports.getBooks = async (req, res) => {
  try {
    const { author, genre, available } = req.query;
    const filters = {};

    if (author) filters.author = author;
    if (genre) filters.genre = genre;
    if (available) filters.available = available === 'true';

    const books = await Book.find(filters);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createBook = async (req, res) => {
  const { title, author, publishedYear, genre, available } = req.body;

 
  if (!title || !author || !publishedYear || !genre || available === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newBook = new Book({
    title,
    author,
    publishedYear,
    genre,
    available,
  });

  try {
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
