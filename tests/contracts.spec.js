const request = require('supertest')
const app = require('../src/app')

describe('Contracts Test', () => {
    it('get non-terminated contracts from Client profile 1 ', async () => {
        const res = await request(app)
            .get('/contracts')
            .set('profile_id', 1)

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(1)
    });

    it('get non-terminated contracts from Contractor profile 7 ', async () => {
        const res = await request(app)
            .get('/contracts')
            .set('profile_id', 7)

        expect(res.statusCode).toEqual(200)
        expect(res.body.length).toEqual(3)
    });
});