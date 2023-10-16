const request = require('supertest');
const app = require('../../../src/app');

describe('Testing the 404 Middleware', () => {
  test("Invalid Routes should return 404", async () => {
    const res = await request(app).get('/hamit');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.body.error).toEqual({
      "code": 404,
      "message": "Resource doesn't exist!!",
    });
  })
})
