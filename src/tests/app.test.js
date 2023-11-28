import app from '../app.js';
import request from 'supertest';
import { conectionMongoose } from '../persistance/daos/mongodb/conection.js';
import config from '../utils/config.js';

describe('Tests integrales', () => {
    beforeAll(async () => {
        const init = await conectionMongoose();
        console.log("*****conexión mongo******");
    });

    test('[LOG-IN] /users', async () => {
        const response = await request(app).post('/api/users/loginApi').send({ email: config.EMAIL_TEST, password: config.PASSWORD_TEST });
       

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Object);
    });
});