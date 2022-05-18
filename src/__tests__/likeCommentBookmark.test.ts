import app from '../app';
import supertest from 'supertest';

let token: string;
let userId: string;
let tweetId: string;
let emailToken: string;

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
    userId = response.body.user._id;
    expect(response.status).toBe(201);
    expect(response.body.user.isActive).toBe(true);
  });
});

describe('Tweet by authorised user', () => {
  const newData = {
    userId: '61e5ba1ca9dd9f3f16df5389',
    messageBody: 'Message here',
    tweetImage: 'cloudImage.secure_url here',
    whoCanReply: 'Everyone',
    cloudinary_id: 'cloudImage.public_id here',
  };

  // check if a user is not authorised
  it(' Authorised user for tweeting', async () => {
    const res = await supertest(app)
      .post('/tweet/')
      .set(`Authorization`, `Bearer ${token}`)
      .send(newData);
    expect(res.status).toBe(200);
  });

  // All user tweet

  it(' A user can view all his tweet', async () => {
    const res = await supertest(app).get('/tweet/alltweet').set(`Authorization`, `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  // a user can view all his retweet

  it(' A user can view all his retweet', async () => {
    const res = await supertest(app)
      .get('/tweet/allretweet')
      .set(`Authorization`, `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  //retweet a tweet
  it(' Retweet a tweet using valid tweet id', async () => {
    const res = await supertest(app)
      .post('/tweet/retweet/61e6c6ef532239cbd186ac4f')
      .set(`Authorization`, `Bearer ${token}`)
      .send(newData);

    expect(res.status).toBe(201);
  });

  //return 404 error if tweet id you want to retweet is invalid

  it(' Return 404 error during retweet using invalid tweet id,', async () => {
    const res = await supertest(app)
      .post('/tweet/retweet/1')
      .set(`Authorization`, `Bearer ${token}`)
      .send(newData);

    expect(res.status).toBe(404);
  });

  // delete a tweet using a valid tweet id

  it(' return 404 if id is not available for delete', async () => {
    const res = await supertest(app)
      .delete('/tweet/deletetweet/61e6c6ef532239cbd186ac4f')

      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('comment', () => {
  const data = {
    content: 'This is a comment',
  };

  test('comment', async () => {
    const response = await supertest(app)
      .post(`/tweet/${tweetId}/comment`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  test('get comments', async () => {
    const response = await supertest(app)
      .get(`/tweet/${tweetId}/comment`)
      .set('Authorization', `Bearer ${token}`)
      .send(data);
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});

describe('like', () => {
  test('like', async () => {
    const response = await supertest(app)
      .post(`/tweet/${tweetId}/like`)
      .set('Authorization', `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  test('get likes', async () => {
    const response = await supertest(app)
      .get(`/tweet/${tweetId}/like`)
      .set('Authorization', `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
  });

  test('dislike', async () => {
    const response = await supertest(app)
      .delete(`/tweet/${tweetId}/like`)
      .set('Authorization', `Bearer ${token}`);
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});

describe('bookmark', () => {
  test('bookmark', async () => {
    const response = await supertest(app)
      .post(`/tweet/${tweetId}/bookmark`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  test('get all bookmarks', async () => {
    const response = await supertest(app).get(`/bookmarks`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  test('get single bookmark', async () => {
    const response = await supertest(app)
      .get(`/bookmarks/id`) //fix
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toEqual(200);
  });

  test('delete bookmark', async () => {
    const response = await supertest(app)
      .delete(`/tweet/${tweetId}/bookmark`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  test('get likes by user', async () => {
    const res = await supertest(app)
      .get(`/tweet/user/likes/${userId}`)
      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
