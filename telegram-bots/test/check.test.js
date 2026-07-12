import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBot } from '../src/core/check.js';
import { BOTS } from '../src/bots/index.js';

const perfectApiFor = (def, overrides = {}) => ({
  call: async (method) => {
    const responses = {
      getMe: { id: 1, username: def.username },
      getMyName: { name: def.profile.name },
      getMyDescription: { description: def.profile.description },
      getMyShortDescription: { short_description: def.profile.shortDescription },
      getMyCommands: def.profile.commands,
      getWebhookInfo: { url: '' },
      ...overrides,
    };
    assert.ok(method in responses, `неожиданный вызов ${method}`);
    return responses[method];
  },
});

for (const def of BOTS) {
  test(`checkBot @${def.username}: корректная настройка не даёт проблем`, async () => {
    assert.deepEqual(await checkBot(def, perfectApiFor(def)), []);
  });
}

test('checkBot: находит чужой токен, сбитое имя, лишние команды и вебхук', async () => {
  const def = BOTS[0];
  const api = perfectApiFor(def, {
    getMe: { id: 1, username: 'alien_bot' },
    getMyName: { name: 'Другое имя' },
    getMyCommands: [{ command: 'start', description: 'x' }],
    getWebhookInfo: { url: 'https://old-host.example/hook' },
  });
  const problems = await checkBot(def, api);
  assert.equal(problems.length, 4);
  assert.match(problems.join('\n'), /alien_bot/);
  assert.match(problems.join('\n'), /Другое имя/);
  assert.match(problems.join('\n'), /вебхук/);
});
