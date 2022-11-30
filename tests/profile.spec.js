const request = require('supertest')
const app = require('../src/app')
describe('Profile Test', () => {

    it('should return info of the profile id:1', async () => {
        const res = await request(app)
            .get('/contracts/1')
            .set('profile_id', 1)

        expect(res.statusCode).toEqual(200)
        expect(res.body.id).toEqual(1)
    });

    it('should return 401, because is not authorized for that resource', async () => {
        const res = await request(app)
            .get('/contracts/2')
            .set('profile_id', 1)

        expect(res.statusCode).toEqual(401)
    });
});
