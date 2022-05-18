import supertest from 'supertest';
import app from '../app';

let emailToken: string;
let token: string;

describe('Following Feature Test Case', () => {
  const userData = {
    firstName: 'Tolu',
    lastName: 'Johnson',
    email: 'tolz@yahoo.com',
    password: 'testing',
  };
  const followId = {
    userId: '61e5f7416ecc46c9c0556ac1',
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

  test('Follow user', async () => {
    const response = await supertest(app)
      .post('/api/follow')
      .set('Authorization', `Bearer ${token}`)
      .send(followId);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
  test('Unfollow user', async () => {
    const response = await supertest(app)
      .delete('/api/follow')
      .set('Authorization', `Bearer ${token}`)
      .send(followId);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    expect(response.body.hasOwnProperty('data')).toBe(true);
  });
  test('get following', async () => {
    const response = await supertest(app)
      .get('/api/follow/following?pageNo=1&pageSize=5')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    expect(response.body.hasOwnProperty('data')).toBe(true);
  });
  test('get followers', async () => {
    const response = await supertest(app)
      .get('/api/follow/?pageNo=1&pageSize=5')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
  test('get following suggestion', async () => {
    const response = await supertest(app)
      .get('/api/follow/suggest/?pageNo=2&pageSize=5')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
  test('View tweets of following', async () => {
    const response = await supertest(app)
      .get('/api/viewtweet/?pageNo=1&pageSize=9')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
    expect(response.body.data.hasOwnProperty('tweet')).toBe(true);
    expect(response.body.data.hasOwnProperty('retweet')).toBe(true);
    expect(response.body.data.hasOwnProperty('following')).toBe(true);
  });
});
