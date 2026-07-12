// Запуск всех ботов, для которых задан токен, в режиме long polling.
import { BOTS } from './bots/index.js';
import { createApi } from './core/api.js';
import { handleUpdate } from './core/bot.js';
import { loadEnv } from './core/env.js';

loadEnv();

async function pollBot(def, api) {
  let offset = 0;
  console.log(`[${def.username}] polling started`);
  for (;;) {
    try {
      const updates = await api.call('getUpdates', {
        offset,
        timeout: 50,
        allowed_updates: ['message'],
      });
      for (const update of updates) {
        offset = update.update_id + 1;
        handleUpdate(def, update, api).catch((err) =>
          console.error(`[${def.username}] reply failed:`, err.message),
        );
      }
    } catch (err) {
      console.error(`[${def.username}] poll error:`, err.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

const active = BOTS.filter((def) => process.env[def.tokenEnv]);
if (active.length === 0) {
  console.error('Ни один токен не задан. Заполните .env (см. .env.example) и повторите.');
  process.exit(1);
}
for (const def of BOTS) {
  if (!process.env[def.tokenEnv]) {
    console.warn(`[${def.username}] пропущен: не задан ${def.tokenEnv}`);
  }
}
await Promise.all(active.map((def) => pollBot(def, createApi(process.env[def.tokenEnv]))));
