const { Author } = require('../models/Author');
const { Router } = require('express');

module.exports = new Router()
  .get('/', async (req, res, next) => {
    try {
      const authors = await Author.getAll();
      res.json(authors);
    } catch(error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const author = await Author.getByIdDetailed(req.params.id);
      res.json(author);
    } catch(error) {
      next(error);
    }
  })
  .post('/', async (req, res, next) => {
    try {
      const author = await Author.addAuthor(req.body);

      const bookIds = req.body.bookIds;
      if (bookIds) {
        await Promise.all(bookIds.map(bookId => author.addAuthorship(bookId)));
      }

      res.json(author);
    } catch(error) {
      next(error);
    }
  });
