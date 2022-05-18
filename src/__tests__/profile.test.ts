import supertest from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import fs from 'fs';

let emailToken: string;
let token: string;
let id: string;

describe('Auth', () => {
  const userData = {
    firstName: 'Ewa',
    lastName: 'olamide',
    email: 'tolc@yahoo.com',
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
    id = response.body.user._id;

    expect(response.status).toBe(201);
    expect(response.body.user.isActive).toBe(true);
  });

  it('should update a profile', async () => {
    const newProfile = {
      firstName: 'Ewa',
      lastName: 'Deola',
      bioData: 'awesome bio',
    };
    const response = await supertest(app)
      .put(`/profile`)
      .set(`Authorization`, `Bearer ${token}`)
      .send(newProfile);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('successful!');
  });

  it('should upload a profile picture', async () => {
    const response = await supertest(app)
      .put('/profile/picture')
      .set(`Authorization`, `Bearer ${token}`)
      .attach('profilePicture', `${__dirname}/file/122.png`);
    expect(response.status).toBe(201);
  }, 60000);

  it('should get user', async () => {
    const response = await supertest(app).get('/profile').set(`Authorization`, `Bearer ${token}`);
    expect(response.body).toEqual(
      expect.objectContaining({
        user: expect.any(Object),
        followers: {
          Totalfollowers: expect.any(Number),
          pageNo: expect.any(Number),
          pageSize: expect.any(Number),
          followers: expect.any(Array),
        },
        following: {
          Totalfollowing: expect.any(Number),
          pageNo: expect.any(Number),
          pageSize: expect.any(Number),
          following: expect.any(Array),
        },
      }),
    );
  });
});

// describe('Profile', () => {
//     const newProfile = {
//       id: '61eb05b8780febeb556508d1',
//       firstName: 'Ewa',
//       lastName: 'Deola',
//       email: "tolc@yahoo.com",
//       bioData: "awesome bio",
//       cloudinary_id: 'http://res.cloudinary.com/du2j5rypm/image/upload/v1643056328/xcxdumuypemx0glxm2fk.png',
//     };

// )
