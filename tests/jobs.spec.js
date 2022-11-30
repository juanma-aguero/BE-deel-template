const request = require('supertest')
const app = require('../src/app')

describe('Jobs Test', () => {
    it('get unpaid jobs for Client profile 1 ', async () => {
        const res = await request(app)
            .get('/jobs/unpaid')
            .set('profile_id', 1)

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(1)
    });

    it('get unpaid jobs for Client profile 7 ', async () => {
        const res = await request(app)
          .get('/jobs/unpaid')
          .set('profile_id', 7)

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(2)
    });

    it('Paid for job not enough funds', async () => {
        const res = await request(app)
          .post('/jobs/2/pay')
          .send({
              amount: 2000
          })
          .set('profile_id', 1)

        expect(res.statusCode).toEqual(400)
    });

    it('Paid for job not enough amount for price', async () => {
        const res = await request(app)
          .post('/jobs/2/pay')
          .send({
              amount: 100
          })
          .set('profile_id', 1)

        expect(res.statusCode).toEqual(400)
    });

  it('Paid for job enough funds and amount ok ', async () => {
    const res = await request(app)
      .post('/jobs/2/pay')
      .send({
        amount: 201
      })
      .set('profile_id', 1)

    expect(res.statusCode).toEqual(201)
  });
});
