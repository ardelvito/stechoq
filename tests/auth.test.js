const request = require('supertest');
const app = require('../index.js');
const db = require('../config/db.js');

beforeAll(async () => {
  // Bersihkan dulu user test kalau ada
  await db.query('DELETE FROM users WHERE name = ?', ['testuser']);
  await db.query('DELETE FROM users WHERE name = ?', ['someone']);
  await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', ['someone', 'existing@example.com', 'anotherpass']);
});

afterAll(async () => {
  await db.end();
});

describe('POST /api/v1/user/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/user/register')
      .send(
        { 
            name: 'testuser', 
            email: 'testemail@gmail.com' ,
            password: 'testpass' 
        }
    );

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('data', null);
  });
    it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({
        name: 'incompleteuser',
        password: 'password123'
        // email is missing
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });

  it('should return 409 if email is already used', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({
        name: 'someone',
        email: 'existing@example.com',
        password: 'anotherpass'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Email is already taken');
  });
});

describe('POST /api/v1/user/login', ()=>{
  it('should login user', async ()=>{
    const response = await request(app)
    .post('/api/v1/user/login')
    .send(
      {
        email: 'testemail@gmail.com',
        password: 'testpass'
      }
    );

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).not.toBeNull();
  });

  it('should return 400 if required fields are missing', async ()=>{
    const response = await request(app)
    .post('/api/v1/user/login')
    .send(
      {
        email: 'testemail@gmail.com',
        // password is missing
      }
    );

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'Please provide all required fields');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeNull();
  });

    it('should return 401 if wrong password', async ()=>{
    const response = await request(app)
    .post('/api/v1/user/login')
    .send(
      {
        email: 'testemail@gmail.com',
        password: 'thisiswrongpassword'
      }
    );

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Wrong password');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toBeNull();
  });
  
} )