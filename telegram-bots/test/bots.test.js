import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOTS } from '../src/bots/index.js';
import { routeMessage, handleUpdate } from '../src/core/bot.js';

// Общие проверки для каждого из пяти ботов.
for (const def of BOTS) {
  test(`@${def.username}: у каждой команды из профиля есть обработчик`, () => {
    for (const { command } of def.profile.commands) {
      assert.equal(typeof def.handlers[command], 'function', `нет обработчика /${command}`);
    }
  });

  test(`@${def.username}: /start отвечает и упоминает команды`, () => {
    const reply = routeMessage(def, '/start');
    assert.ok(reply && reply.length > 20);
    assert.match(reply, /\/\w+/, 'в /start должен быть список команд');
  });

  test(`@${def.username}: каждая команда профиля даёт непустой ответ`, () => {
    for (const { command } of def.profile.commands) {
      const reply = routeMessage(def, `/${command}`);
      assert.ok(reply && reply.trim().length > 0, `/${command} вернул пустой ответ`);
    }
  });

  test(`@${def.username}: команда с адресацией "/start@${def.username}" работает, чужая — игнорируется`, () => {
    assert.ok(routeMessage(def, `/start@${def.username}`));
    assert.equal(routeMessage(def, '/start@some_other_bot'), null);
  });

  test(`@${def.username}: неизвестная команда и произвольный текст получают fallback`, () => {
    assert.ok(routeMessage(def, '/nonexistent_command'));
    assert.ok(routeMessage(def, 'абракадабра 12345'));
  });

  test(`@${def.username}: профиль заполнен для BotFather`, () => {
    assert.ok(def.profile.name.length > 0 && def.profile.name.length <= 64);
    assert.ok(def.profile.shortDescription.length > 0 && def.profile.shortDescription.length <= 120);
    assert.ok(def.profile.description.length > 0 && def.profile.description.length <= 512);
    assert.ok(def.profile.commands.length >= 2);
    for (const { command, description } of def.profile.commands) {
      assert.match(command, /^[a-z0-9_]{1,32}$/, `недопустимое имя команды: ${command}`);
      assert.ok(description.length >= 3 && description.length <= 256);
    }
  });

  test(`@${def.username}: handleUpdate отправляет ответ в нужный чат`, async () => {
    const calls = [];
    const fakeApi = { call: async (method, params) => void calls.push({ method, params }) };
    const update = { update_id: 1, message: { chat: { id: 42 }, text: '/start' } };
    const reply = await handleUpdate(def, update, fakeApi);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].method, 'sendMessage');
    assert.equal(calls[0].params.chat_id, 42);
    assert.equal(calls[0].params.text, reply);
  });
}

// Смысловые проверки — каждый бот отвечает по своей теме.
test('@sushkov_medical_bot: вопрос о консультации ведёт к контактам и дисклеймеру', () => {
  const def = BOTS.find((b) => b.username === 'sushkov_medical_bot');
  const reply = routeMessage(def, 'Как записаться на консультацию?');
  assert.match(reply, /ssvnauka@gmail\.com/);
  assert.match(reply, /не даёт медицинских советов/);
});

test('@ssvproff_content_bot: спрашивают сайт — получают все три сайта', () => {
  const def = BOTS.find((b) => b.username === 'ssvproff_content_bot');
  const reply = routeMessage(def, 'где ваш сайт?');
  assert.match(reply, /ssvnauka\.net/);
  assert.match(reply, /ssvnauka\.com/);
  assert.match(reply, /proffssv\.site/);
});

test('@ssvproff_publisher_bot: /profiles содержит ORCID, Scholar и Scopus', () => {
  const def = BOTS.find((b) => b.username === 'ssvproff_publisher_bot');
  const reply = routeMessage(def, '/profiles');
  assert.match(reply, /orcid\.org\/0000-0002-6951-9789/);
  assert.match(reply, /scholar\.google\.com/);
  assert.match(reply, /scopus\.com/);
});

test('@ssvproff_youtube_bot: слово «видео» даёт ссылку на канал', () => {
  const def = BOTS.find((b) => b.username === 'ssvproff_youtube_bot');
  const reply = routeMessage(def, 'хочу посмотреть видео');
  assert.match(reply, /youtube\.com\/@SSVproff-22\.06/);
});

test('@maria_surgical_ai_bot: медицинская тема всегда сопровождается дисклеймером', () => {
  const def = BOTS.find((b) => b.username === 'maria_surgical_ai_bot');
  for (const text of ['расскажи про рак желудка', '/topics', '/contact', 'что угодно']) {
    const reply = routeMessage(def, text);
    assert.match(reply, /не является медицинской консультацией/, `нет дисклеймера в ответе на: ${text}`);
  }
});

test('username-ы ботов уникальны и совпадают с BotFather', () => {
  const expected = [
    'ssvproff_content_bot',
    'sushkov_medical_bot',
    'maria_surgical_ai_bot',
    'ssvproff_publisher_bot',
    'ssvproff_youtube_bot',
  ].sort();
  const actual = BOTS.map((b) => b.username).sort();
  assert.deepEqual(actual, expected);
  assert.equal(new Set(BOTS.map((b) => b.tokenEnv)).size, BOTS.length, 'tokenEnv должны быть уникальны');
});
