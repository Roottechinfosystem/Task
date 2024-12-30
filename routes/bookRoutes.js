
const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');


router.get('/books', booksController.getBooks);


router.get('/books/:id', booksController.getBookById);


router.post('/books', booksController.createBook);


router.put('/books/:id', booksController.updateBook);


router.delete('/books/:id', booksController.deleteBook);

module.exports = router;
