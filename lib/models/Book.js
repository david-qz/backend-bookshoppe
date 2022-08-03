const pool = require('../utils/pool');
const AuthorModel = require('./Author');

class Book {
  id;
  title;
  released;
  authors;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.released = row.released;
    this.authors = row.authors?.map(x => new AuthorModel.Author(x));
  }

  static async getAll() {
    const { rows } = await pool.query('select * from books');
    return rows.map(row => new Book(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      'select * from books where id = $1',
      [id]
    );

    if (rows.length <= 0) throw new Error(`no book with id=${id}`);

    return new Book(rows[0]);
  }

  static async getByIdDetailed(id) {
    const { rows } = await pool.query(`
      select
        books.*,
        COALESCE(
          json_agg(json_build_object('id', authors.id::varchar, 'name', authors.name))
          FILTER (WHERE authors.id IS NOT NULL), '[]'
        ) AS authors
        from books
      left join authors_books on books.id = authors_books.book_id
      left join authors on authors_books.author_id = authors.id
      where books.id = $1
      group by books.id;
    `,
    [id]
    );

    if (rows.length <= 0) throw new Error(`no book with id=${id}`);

    return new Book(rows[0]);
  }

  static async addBook(data) {
    const { rows } = await pool.query(`
      insert into books (title, released)
      values ($1, $2)
      returning *;
    `,
    [data.title, data.released]
    );

    const newRow = rows[0];
    newRow.authors = [];

    return new Book(rows[0]);
  }

  async addAuthorship(authorId) {
    const { rows } = await pool.query(
      'insert into authors_books (author_id, book_id) values ($1, $2) returning *',
      [authorId, this.id]
    );

    if (!rows[0]) throw new Error('failed to insert row into author_books for unknown reason');

    const book = await AuthorModel.Author.getById(authorId);
    if (!this.authors) this.authors = []; // Goofy but I'm relying on books to be undefined in list routes :/
    this.authors.push(book);

    return book;
  }
}

module.exports.Book = Book;
