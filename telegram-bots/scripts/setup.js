// Регистрирует в Telegram имя, описания и команды каждого бота, у которого задан токен.
// Запуск: npm run setup (токены — в .env, см. .env.example).
import { BOTS } from '../src/bots/index.js';
import { createApi } from '../src/core/api.js';
import { configureBot } from '../src/core/configure.js';
import { loadEnv } from '../src/core/env.js';

loadEnv();

let configured = 0;
let failed = 0;

for (const def of BOTS) {
  const token = process.env[def.tokenEnv];
  if (!token) {
    console.warn(`⏭  @${def.username}: пропущен — не задан ${def.tokenEnv}`);
    continue;
  }
  try {
    const me = await configureBot(def, createApi(token));
    console.log(`✅ @${me.username}: имя, описания и ${def.profile.commands.length} команд настроены`);
    configured++;
  } catch (err) {
    console.error(`❌ @${def.username}: ${err.message}`);
    failed++;
  }
}

console.log(`\nИтого: настроено ${configured}, с ошибками ${failed}, всего ботов ${BOTS.length}`);
if (failed > 0) process.exit(1);
