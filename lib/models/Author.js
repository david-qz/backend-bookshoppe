const pool = require('../utils/pool');
const BookModel = require('./Book');

class Author {
  id;
  name;
  dob;
  pob;
  books;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.dob = row.dob;
    this.pob = row.pob;
    this.books = row.books?.map(x => new BookModel.Book(x));
  }

  static async getAll() {
    const { rows } = await pool.query('select id, name from authors');
    return rows.map(row => new Author(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(`
      select
        authors.*,
        COALESCE(
          json_agg(json_build_object('id', books.id::varchar, 'title', books.title, 'released', books.released))
          FILTER (WHERE books.id IS NOT NULL), '[]'
        ) AS books
        from authors
      left join authors_books on authors.id = authors_books.author_id
      left join books on authors_books.book_id = books.id
      where authors.id = $1
      group by authors.id
      order by authors.id;
    `,
    [id]
    );

    if (rows.length <= 0) throw new Error(`no author with id=${id}`);

    return new Author(rows[0]);
  }
}

module.exports.Author = Author;
