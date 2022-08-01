const Book = require('../models/Book');
const { Router } = require('express');

module.exports = new Router()
  .get('/', async (req, res, next) => {
    try {
      const books = await Book.getAll();
      res.json(books);
    } catch(error) {
      next(error);
    }
  });
