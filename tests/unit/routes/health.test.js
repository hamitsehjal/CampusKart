const request = require('supertest');
const { hostname } = require('os');

const app = require('../../../src/app');
const { version, author } = require('../../../package.json');
describe('Health-Check Route', () => {

  test('Should return 200 OK', async () => {
    const res = await request(app).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toEqual('ok');
    expect(res.body.author).toEqual(author);
    expect(res.body.version).toEqual(version);
    expect(res.body.hostname).toEqual(hostname());
  })
})
