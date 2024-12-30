require('dotenv').config();  
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(express.json());  
app.use(cors());  
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  publishedYear: { type: Number, required: true },
  genre: { type: String, required: true },
  available: { type: Boolean, default: true }
});


const Book = mongoose.model('Book', bookSchema);


app.get('/books', async (req, res) => {
  try {
    const { author, genre, available, page = 1, limit = 10 } = req.query;

    const query = {};
    if (author) query.author = author;
    if (genre) query.genre = genre;
    if (available !== undefined) query.available = available === 'true';

    
    const books = await Book.find(query)
      .skip((page - 1) * limit)  
      .limit(parseInt(limit)); 

    
    const totalBooks = await Book.countDocuments(query);

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
      totalBooks: totalBooks,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/books', async (req, res) => {
  const { title, author, publishedYear, genre, available } = req.body;
  
  if (!title || !author || !publishedYear || !genre) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newBook = new Book({
      title,
      author,
      publishedYear,
      genre,
      available,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.put('/books/:id', async (req, res) => {
  const { title, author, publishedYear, genre, available } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, publishedYear, genre, available },
      { new: true }
    );
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
