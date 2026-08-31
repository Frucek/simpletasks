const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('./server');

const DB_FILE = path.join(__dirname, 'tasks.json');
beforeEach(() => fs.writeFileSync(DB_FILE, '[]'));
afterAll(() => fs.existsSync(DB_FILE) && fs.unlinkSync(DB_FILE));

test('GET /api/tasks returns empty array initially', async () => {
  const res = await request(app).get('/api/tasks');
  expect(res.status).toBe(200);
  expect(res.body).toEqual([]);
});

test('POST /api/tasks creates a task', async () => {
  const res = await request(app).post('/api/tasks').send({ title: 'Buy milk' });
  expect(res.status).toBe(201);
  expect(res.body.title).toBe('Buy milk');
  expect(res.body.done).toBe(false);
});

test('POST /api/tasks rejects empty title', async () => {
  const res = await request(app).post('/api/tasks').send({ title: '' });
  expect(res.status).toBe(400);
});

test('POST /api/tasks rejects missing title', async () => {
  const res = await request(app).post('/api/tasks').send({});
  expect(res.status).toBe(400);
});

test('GET /api/tasks returns created task', async () => {
  await request(app).post('/api/tasks').send({ title: 'Task A' });
  const res = await request(app).get('/api/tasks');
  expect(res.body.length).toBe(1);
});

test('PUT /api/tasks/:id toggles done', async () => {
  const created = await request(app).post('/api/tasks').send({ title: 'Toggle me' });
  const res = await request(app).put(`/api/tasks/${created.body.id}`);
  expect(res.body.done).toBe(true);
});

test('PUT /api/tasks/:id twice toggles back to false', async () => {
  const created = await request(app).post('/api/tasks').send({ title: 'Toggle twice' });
  await request(app).put(`/api/tasks/${created.body.id}`);
  const res = await request(app).put(`/api/tasks/${created.body.id}`);
  expect(res.body.done).toBe(false);
});

test('PUT /api/tasks/:id 404 for unknown id', async () => {
  const res = await request(app).put('/api/tasks/doesnotexist');
  expect(res.status).toBe(404);
});

test('DELETE /api/tasks/:id removes task', async () => {
  const created = await request(app).post('/api/tasks').send({ title: 'Delete me' });
  const del = await request(app).delete(`/api/tasks/${created.body.id}`);
  expect(del.status).toBe(204);
  const list = await request(app).get('/api/tasks');
  expect(list.body.length).toBe(0);
});

test('DELETE /api/tasks/:id 404 for unknown id', async () => {
  const res = await request(app).delete('/api/tasks/doesnotexist');
  expect(res.status).toBe(404);
});