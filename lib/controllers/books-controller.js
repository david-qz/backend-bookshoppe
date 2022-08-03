const { Book } = require('../models/Book');
const { Router } = require('express');

module.exports = new Router()
  .get('/', async (req, res, next) => {
    try {
      const books = await Book.getAll();
      res.json(books);
    } catch(error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const book = await Book.getByIdDetailed(req.params.id);
      res.json(book);
    } catch (error) {
      next(error);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const book = await Book.addBook(req.body);

      const authorIds = req.body.authorIds;
      if (authorIds) {
        await Promise.all(authorIds.map(authorId => book.addAuthorship(authorId)));
      }

      res.json(book);
    } catch (error) {
      next(error);
    }
  });
