const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../index.ts');

const api = supertest(app);

test('random word returned', async () => {
    const response = await api.get('/api/words/word/en/tense/Present/mood/Indicative');

    expect(response.body).toBeDefined();
    expect(response.body.infinitive).toBeDefined();
});

