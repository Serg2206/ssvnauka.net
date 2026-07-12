import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApi } from '../src/core/api.js';
import { handleUpdate } from '../src/core/bot.js';
import { configureBot } from '../src/core/configure.js';
import { BOTS } from '../src/bots/index.js';

test('createApi: требует токен', () => {
  assert.throws(() => createApi(''), /token is required/);
});

test('createApi: собирает URL и разворачивает result', async () => {
  const requests = [];
  const fakeFetch = async (url, init) => {
    requests.push({ url, init });
    return { json: async () => ({ ok: true, result: { id: 1 } }) };
  };
  const api = createApi('TOKEN123', fakeFetch);
  const result = await api.call('getMe');
  assert.deepEqual(result, { id: 1 });
  assert.equal(requests[0].url, 'https://api.telegram.org/botTOKEN123/getMe');
  assert.equal(requests[0].init.method, 'POST');
});

test('createApi: ошибка Telegram превращается в исключение с описанием', async () => {
  const fakeFetch = async () => ({
    json: async () => ({ ok: false, error_code: 401, description: 'Unauthorized' }),
  });
  const api = createApi('BAD', fakeFetch);
  await assert.rejects(api.call('getMe'), /401 Unauthorized/);
});

test('handleUpdate: обновления без сообщения или текста не вызывают отправку', async () => {
  const def = BOTS[0];
  const calls = [];
  const fakeApi = { call: async (m, p) => void calls.push(m) };
  assert.equal(await handleUpdate(def, { update_id: 1 }, fakeApi), null);
  assert.equal(await handleUpdate(def, { update_id: 2, message: { chat: { id: 1 } } }, fakeApi), null);
  assert.equal(calls.length, 0);
});

test('configureBot: настраивает профиль и снимает вебхук', async () => {
  const def = BOTS[0];
  const calls = [];
  const fakeApi = {
    call: async (method, params) => {
      calls.push({ method, params });
      if (method === 'getMe') return { id: 7, username: def.username };
      return true;
    },
  };
  await configureBot(def, fakeApi);
  const methods = calls.map((c) => c.method);
  assert.deepEqual(methods, [
    'getMe',
    'setMyName',
    'setMyDescription',
    'setMyShortDescription',
    'setMyCommands',
    'deleteWebhook',
  ]);
  const setCommands = calls.find((c) => c.method === 'setMyCommands');
  assert.deepEqual(setCommands.params.commands, def.profile.commands);
});

test('configureBot: токен от чужого бота отклоняется', async () => {
  const def = BOTS[0];
  const fakeApi = { call: async () => ({ id: 7, username: 'wrong_bot' }) };
  await assert.rejects(configureBot(def, fakeApi), /wrong_bot/);
});
