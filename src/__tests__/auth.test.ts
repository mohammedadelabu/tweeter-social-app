import supertest from 'supertest';
import app from '../app';

let emailToken: string;
let emailToken2: string;
let token: string;
let token2: string;
let user: string;
let user2: string;
let conversationId: string;
const message = 'Hello';

describe('Auth', () => {
  const userData = {
    firstName: 'Tolu',
    lastName: 'Johnson',
    email: 'tolz@yahoo.com',
    password: 'testing',
  };

  const userData2 = {
    firstName: 'Amazing',
    lastName: 'Grace',
    email: 'gram@yahoo.com',
    password: 'testing',
  };

  test('signup', async () => {
    const response = await supertest(app).post('/users/signup').send(userData);
    const response2 = await supertest(app).post('/users/signup').send(userData2);

    emailToken = response.body.emailToken;
    emailToken2 = response2.body.emailToken;

    expect(response.status).toBe(200);
    expect(response.body.newUser.isActive).toBe(false);
  });

  test('confirmEmail', async () => {
    const response = await supertest(app).get(`/users/verify/${emailToken}`);
    const response2 = await supertest(app).get(`/users/verify/${emailToken2}`);

    expect(response.status).toBe(201);
    expect(response.body.emailToken.email).toEqual(response.body.data.email);
    expect(response.body.data.isActive).toBe(true);
  });

  test('login', async () => {
    const response = await supertest(app)
      .post('/users/login')
      .send({ email: userData.email, password: userData.password });

    // console.log(response.body)
    const response2 = await supertest(app)
      .post('/users/login')
      .send({ email: userData2.email, password: userData2.password });

    token = response.body.token;
    token2 = response2.body.token;
    user = response.body.user._id;
    user2 = response2.body.user._id;
    expect(response.status).toBe(201);
  });
});

describe('Conversation', () => {
  test('create conversation', async () => {
    const data = {
      receiverId: user2,
    };
    const response = await supertest(app)
      .post('/conversation')
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    conversationId = response.body.data._id;
    //console.log(response.body.data._id, response.body.data);
    expect(response.status).toBe(200);
    expect(response.body.data.members[0]).toStrictEqual(user);
  });

  test('get user conversations', async () => {
    const response = await supertest(app)
      .get(`/conversation/${user}`)
      .set('Authorization', `Bearer ${token}`);

    //console.log(response.body)
    expect(response.status).toBe(200);
  });

  test('get users with same conversation', async () => {
    const response = await supertest(app)
      .get(`/conversation/${user}/${user2}`)
      .set('Authorization', `Bearer ${token}`);

    //console.log(response.body)
    expect(response.status).toBe(200);
  });
});

describe('message', () => {
  test('create message', async () => {
    const data = {
      conversationId,
      senderId: user,
      text: message,
    };

    const response = await supertest(app)
      .post('/message')
      .set('Authorization', `Bearer ${token}`)
      .send(data);

    // console.log(response.body, '****', conversationId);
    expect(response.status).toBe(200);
  });

  test('get a conversation messages', async () => {
    const response = await supertest(app)
      .get(`/message/${conversationId}`)
      .set('Authorization', `Bearer ${token}`);

    // console.log(response.body.data[0].text, message, '***');
    expect(response.status).toBe(200);
    expect(response.body.data[0].text).toStrictEqual(message);
  });
});
