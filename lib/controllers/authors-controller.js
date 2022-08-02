const Author = require('../models/Author');
const { Router } = require('express');

module.exports = new Router()
  .get('/', async (req, res, next) => {
    try {
      const authors = await Author.getAll();
      res.json(authors);
    } catch(error) {
      next(error);
    }
  });
