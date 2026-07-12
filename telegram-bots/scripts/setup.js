// Регистрирует в Telegram имя, описания и команды каждого бота, у которого есть токен.
// Запуск: npm run setup. Токены — в .env: либо персональные переменные,
// либо общий список BOT_TOKENS (бот определяется автоматически).
import { BOTS } from '../src/bots/index.js';
import { createApi } from '../src/core/api.js';
import { configureBot } from '../src/core/configure.js';
import { loadEnv } from '../src/core/env.js';
import { resolveTokens } from '../src/core/tokens.js';

loadEnv();
const tokens = await resolveTokens();

let configured = 0;
let failed = 0;

for (const def of BOTS) {
  const token = tokens.get(def);
  if (!token) {
    console.warn(`⏭  @${def.username}: пропущен — нет токена (${def.tokenEnv} или BOT_TOKENS)`);
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
