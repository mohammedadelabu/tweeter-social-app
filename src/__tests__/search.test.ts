import supertest from 'supertest';
import app from '../app';

let emailToken: string;
let token: string;

describe('Searching Test Case', () => {
  const userData = {
    firstName: 'Tolu',
    lastName: 'Johnson',
    email: 'tolz@yahoo.com',
    password: 'testing',
  };

  test('signup', async () => {
    const response = await supertest(app).post('/users/signup').send(userData);

    emailToken = response.body.emailToken;

    expect(response.status).toBe(200);
    expect(response.body.newUser.isActive).toBe(false);
  });

  test('confirmEmail', async () => {
    const response = await supertest(app).get(`/users/verify/${emailToken}`);

    expect(response.status).toBe(201);
    expect(response.body.emailToken.email).toEqual(response.body.data.email);
    expect(response.body.data.isActive).toBe(true);
  });

  test('login', async () => {
    const response = await supertest(app)
      .post('/users/login')
      .send({ email: userData.email, password: userData.password });

    token = response.body.token;

    expect(response.status).toBe(201);
    expect(response.body.user.isActive).toBe(true);
  });

  test('Searches for tweets and comments', async () => {
    const response = await supertest(app)
      .get(`/api/v1/search?search=sars`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('successfully searched for tweets and retweets');
  });

  test('Searches for users', async () => {
    const response = await supertest(app)
      .get(`/api/v1/search/users?search=Oyinkansola&limit=5&page=1`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('successfully searched for users');
  });
});
