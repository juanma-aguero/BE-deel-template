const request = require('supertest')
const app = require('../src/app')

describe('Balances Test', () => {

    it('Deposit from 1 to 4 with not enough funds', async () => {
        const res = await request(app)
          .post('/balances/deposit/4')
          .send({
              amount: 2000
          })
          .set('profile_id', 1)

        expect(res.statusCode).toEqual(400)
    });

  it('Deposit from 1 to 4 ok', async () => {
    const res = await request(app)
      .post('/balances/deposit/4')
      .send({
        amount: 201
      })
      .set('profile_id', 1)

    expect(res.statusCode).toEqual(200)
  });
});
