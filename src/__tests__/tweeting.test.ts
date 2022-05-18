import request from 'supertest';
import app from '../app';

let emailToken: string;
let cloudinary_id: string;
let tweetId: string;
let token: string;
let userId: string;

describe('Auth', () => {
  const userData = {
    firstName: 'Tolu',
    lastName: 'Johnson',
    email: 'tolz@yahoo.com',
    password: 'testing',
  };

  test('signup', async () => {
    const response = await request(app).post('/users/signup').send(userData);

    emailToken = response.body.emailToken;

    expect(response.status).toBe(200);
    expect(response.body.newUser.isActive).toBe(false);
  });

  test('confirmEmail', async () => {
    const response = await request(app).get(`/users/verify/${emailToken}`);

    expect(response.status).toBe(201);
    expect(response.body.emailToken.email).toEqual(response.body.data.email);
    expect(response.body.data.isActive).toBe(true);
  });

  test('login', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ email: userData.email, password: userData.password });

    token = response.body.token;
    userId = response.body.user._id;

    expect(response.status).toBe(201);
    expect(response.body.user.isActive).toBe(true);
  });
});

// Another user sign up and login. Then he can retweet my tweet

/**************************************************************************|
| Test that handle  tweet, retweet operation by a login user              *|
 /**************************************************************************/

describe('Tweet by authorised user', () => {
  const newData = {
    userId: userId,
    messageBody: 'Message here',
    tweetImage: 'image Url',
    whoCanReply: 'Everyone',
    cloudinary_id: cloudinary_id,
  };

  // check if a user is not authorised
  it(' Authorised user  can tweet', async () => {
    const res = await request(app)
      .post('tweeting')
      .set(`Authorization`, `Bearer ${token}`)
      .send(newData);
    expect(res.status).toBe(201);

    tweetId = res.body.data.createTweet._id;
  });

  // All user tweet

  it(' A user can view all his tweet', async () => {
    const res = await request(app).get('/tweet/alltweet').set(`Authorization`, `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  // a user can view all his retweet

  it(' A user can view all his retweet', async () => {
    const res = await request(app).get('/tweet/allretweet').set(`Authorization`, `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  //retweet a tweet
  it(' Retweet a tweet using valid tweet id', async () => {
    console.log(tweetId);
    const res = await request(app)
      .post(`tweet/retweet/${tweetId}`)
      .set(`Authorization`, `Bearer ${token}`)
      .send(newData);

    expect(res.status).toBe(201);
    // expect(res.body.msg).toBe('Retweet created....');
  });

  //return 404 error if tweet id you want to retweet is invalid

  it(' Return 404 error during retweet using invalid tweet id,', async () => {
    const res = await request(app)
      .post('tweet/retweet/1')
      .set(`Authorization`, `Bearer ${token}`)
      .send(newData);

    expect(res.status).toBe(404);
  });

  // delete a tweet using a valid tweet id

  it(' Return 200 for deleting a particular tweet via a valid id', async () => {
    const res = await request(app)
      .delete(`tweet/deletetweet/${tweetId}`)

      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  //get tweet and retweet of other user

  it('Get tweet and retweet of other user', async () => {
    const res = await request(app)
      .get(`tweet/otherusertweet/${tweetId}`)
      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  // Get single tweet and it comment

  it('Get Single tweet and it comment', async () => {
    const res = await request(app)
      .get(`tweet/singletweet/${tweetId}`)

      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('successful');
    expect(res.body).toHaveProperty('message');
  });

  //single user profile

  it('A login user can get a list of users of the app', async () => {
    const res = await request(app)
      .get(`/profile/list-of-users`)

      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('successful');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('data');
  });
  it('gets user tweet by time', async () => {
    const res = await request(app)
      .get(`/tweet/otherusertweet/${userId}`)

      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
  it('gets popular tweets', async () => {
    const res = await request(app)
      .get('/tweet/popular')

      .set(`Authorization`, `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
