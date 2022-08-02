const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('books route', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /authors should return a list of authors', async () => {
    const resp = await request(app).get('/authors');
    expect(resp.status).toBe(200);

    expect(resp.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      ])
    );
  });

  it('GET /authors/:id should return an author with books', async () => {
    const resp = await request(app).get('/authors/1');
    expect(resp.status).toBe(200);

    expect(resp.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      dob: expect.any(String),
      pob: expect.any(String),
      books: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          released: expect.any(Number)
        })
      ])
    });
  });

  it('POST /authors should add a new author', async () => {
    const bram = {
      name: 'Bram Stoker',
      dob: 'November 8, 1847',
      pob: 'Clontarf, Dublin, Ireland'
    };
    const resp = await request(app).post('/authors').send(bram);

    expect(resp.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      dob: expect.any(String),
      pob: expect.any(String),
      books: expect.any(Array)
    });
  });

  it('POST /authors with bookIds should make a new author and associate them with sent book ids', async () => {
    const bram = {
      name: 'Bram Stoker',
      dob: 'November 8, 1847',
      pob: 'Clontarf, Dublin, Ireland',
      bookIds: [1, 2]
    };
    const resp = await request(app).post('/authors').send(bram);

    expect(resp.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      dob: expect.any(String),
      pob: expect.any(String),
      books: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          released: expect.any(Number)
        })
      ])
    });
  });

  afterAll(() => {
    pool.end();
  });
});
