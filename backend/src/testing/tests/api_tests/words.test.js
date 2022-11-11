const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../app');
const api = supertest(app);

test('random word returned', async () => {
    await new Promise((r) => setTimeout(r, 3000));

    const response = await api.get('/api/words/word/en/-/tense/Present/mood/Indicative');

    expect(response.body).toBeDefined();
    expect(response.body.infinitive).toBeDefined();
});

afterAll(() => {
    mongoose.connection.close();
});
