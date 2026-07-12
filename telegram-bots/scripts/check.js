// Проверка настройки каждого бота: npm run check (или node scripts/check.js).
import { BOTS } from '../src/bots/index.js';
import { createApi } from '../src/core/api.js';
import { checkBot } from '../src/core/check.js';
import { loadEnv } from '../src/core/env.js';
import { resolveTokens } from '../src/core/tokens.js';

loadEnv();
const tokens = await resolveTokens();

let ok = 0;
let bad = 0;
for (const def of BOTS) {
  const token = tokens.get(def);
  if (!token) {
    console.warn(`⏭  @${def.username}: нет токена — пропущен`);
    continue;
  }
  try {
    const problems = await checkBot(def, createApi(token));
    if (problems.length === 0) {
      console.log(`✅ @${def.username}: всё настроено верно`);
      ok++;
    } else {
      console.error(`❌ @${def.username}:\n   - ${problems.join('\n   - ')}`);
      bad++;
    }
  } catch (err) {
    console.error(`❌ @${def.username}: ${err.message}`);
    bad++;
  }
}
console.log(`\nИтого: исправны ${ok}, с проблемами ${bad}, всего ботов ${BOTS.length}`);
if (bad > 0) process.exit(1);
