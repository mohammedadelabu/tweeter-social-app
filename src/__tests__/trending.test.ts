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

  test('Trending Hashtag with tweet', async () => {
    const response = await supertest(app)
      .get('/api/trends')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });

  test('Trending Hashtag  count', async () => {
    const response = await supertest(app)
      .get('/api/trends/tweetcount')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
  test('View tweets of a friend', async () => {
    const response = await supertest(app)
      .get('/api/viewtweet/friend/61f2bdaef45386084b83aceb?pageNo=2&pageSize=5')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('success');
  });
  // test('find Hashtag tweets', async () => {
  //   const response = await supertest(app)
  //     .get('/api/trends/hashtag?hashtag=#davidadejo')
  //     .set('Authorization', `Bearer ${token}`);
  //   expect(response.status).toBe(200);
  //   expect(response.body.message).toBe('success');
  // });
});
