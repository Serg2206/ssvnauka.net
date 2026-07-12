import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveTokens } from '../src/core/tokens.js';
import { BOTS } from '../src/bots/index.js';

const fakeFactoryFor = (usernameByToken) => (token) => ({
  call: async (method) => {
    assert.equal(method, 'getMe');
    const username = usernameByToken[token];
    if (!username) throw new Error('401 Unauthorized');
    return { id: 1, username };
  },
});

test('resolveTokens: берёт токены из персональных переменных без запросов к API', async () => {
  const env = { SUSHKOV_MEDICAL_BOT_TOKEN: 'tok-med' };
  const tokens = await resolveTokens(env, () => {
    throw new Error('API не должен вызываться');
  });
  const def = BOTS.find((b) => b.username === 'sushkov_medical_bot');
  assert.equal(tokens.get(def), 'tok-med');
  assert.equal(tokens.size, 1);
});

test('resolveTokens: BOT_TOKENS определяет ботов через getMe (запятые, пробелы, переносы)', async () => {
  const env = { BOT_TOKENS: 'tok-a, tok-b\ntok-c' };
  const tokens = await resolveTokens(
    env,
    fakeFactoryFor({
      'tok-a': 'ssvproff_youtube_bot',
      'tok-b': 'maria_surgical_ai_bot',
      'tok-c': 'ssvproff_content_bot',
    }),
  );
  assert.equal(tokens.size, 3);
  assert.equal(tokens.get(BOTS.find((b) => b.username === 'ssvproff_youtube_bot')), 'tok-a');
  assert.equal(tokens.get(BOTS.find((b) => b.username === 'maria_surgical_ai_bot')), 'tok-b');
});

test('resolveTokens: невалидный токен и чужой бот пропускаются без падения', async () => {
  const env = { BOT_TOKENS: 'tok-bad tok-alien tok-ok' };
  const tokens = await resolveTokens(
    env,
    fakeFactoryFor({ 'tok-alien': 'somebody_else_bot', 'tok-ok': 'ssvproff_publisher_bot' }),
  );
  assert.equal(tokens.size, 1);
  assert.equal(tokens.get(BOTS.find((b) => b.username === 'ssvproff_publisher_bot')), 'tok-ok');
});

test('resolveTokens: персональная переменная имеет приоритет над BOT_TOKENS', async () => {
  const env = { SSVPROFF_YOUTUBE_BOT_TOKEN: 'tok-direct', BOT_TOKENS: 'tok-pool' };
  const tokens = await resolveTokens(env, fakeFactoryFor({ 'tok-pool': 'ssvproff_youtube_bot' }));
  assert.equal(tokens.get(BOTS.find((b) => b.username === 'ssvproff_youtube_bot')), 'tok-direct');
});
