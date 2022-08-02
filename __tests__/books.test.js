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

  afterAll(() => {
    pool.end();
  });
});
