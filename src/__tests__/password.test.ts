import app from '../app';
import supertest from 'supertest';

let emailToken: string;
let token: string;
let resetToken: string;

describe('Auth', () => {
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

  const changePassword = {
    previousPassword: 'testing',
    newPassword: 'passpass',
    confirmNewPassword: 'passpass',
  };

  const reset = {
    password: 'testing',
    passwordConfirm: 'testing',
  };

  test('forgets password', async () => {
    const response = await supertest(app)
      .post('/api/v1/reset/forgotpassword')
      .send({ email: 'tolz@yahoo.com' });

    resetToken = response.body.resetToken;
    expect(response.status).toBe(200);
    // console.log(resetToken)
  });

  test('resets password', async () => {
    const response = await supertest(app)
      .post(`/api/v1/reset/resetpassword/${resetToken}`)
      .send(reset);
    expect(response.status).toBe(200);
    // console.log(response.body);
  });

  test('change password', async () => {
    console.log('token:', token);
    const response = await supertest(app)
      .post('/api/v1/reset/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send(changePassword);
    expect(response.status).toBe(200);
  });
});
