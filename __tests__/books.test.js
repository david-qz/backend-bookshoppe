const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('books route', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /books should return a list of books', async () => {
    const resp = await request(app).get('/books');
    expect(resp.status).toBe(200);

    expect(resp.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          released: expect.any(Number)
        })
      ])
    );
  });

  it('GET /books/:id should return a book with authors', async () => {
    const resp = await request(app).get('/books/1');
    expect(resp.status).toBe(200);

    expect(resp.body).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      released: expect.any(Number),
      authors: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String)
        })
      ])
    });
  });

  it('POST /books should add a new book', async () => {
    const book = {
      title: 'The Silmarillion',
      released: 1977
    };
    const resp = await request(app).post('/books').send(book);

    expect(resp.body).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      released: expect.any(Number),
      authors: expect.any(Array)
    });
  });

  it('POST /books with authorIds should make a new books and associate it with sent author ids', async () => {
    const book = {
      title: 'The Silmarillion',
      released: 1977,
      authorIds: [1]
    };
    const resp = await request(app).post('/books').send(book);

    expect(resp.body).toEqual({
      id: expect.any(String),
      title: expect.any(String),
      released: expect.any(Number),
      authors: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          dob: expect.any(String),
          pob: expect.any(String)
        })
      ])
    });
  });

  afterAll(() => {
    pool.end();
  });
});
