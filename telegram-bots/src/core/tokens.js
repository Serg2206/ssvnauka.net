import { createApi } from './api.js';
import { BOTS } from '../bots/index.js';

// Собирает токены из двух источников:
//  1) персональные переменные (SUSHKOV_MEDICAL_BOT_TOKEN и т.п.);
//  2) BOT_TOKENS — список токенов через запятую/пробел/перенос строки,
//     принадлежность каждого определяется автоматически через getMe.
// Возвращает Map: определение бота → токен.
export async function resolveTokens(env = process.env, apiFactory = createApi) {
  const byBot = new Map();
  for (const def of BOTS) {
    if (env[def.tokenEnv]) byBot.set(def, env[def.tokenEnv]);
  }

  const pool = (env.BOT_TOKENS || '').split(/[\s,]+/).filter(Boolean);
  for (const token of pool) {
    let me;
    try {
      me = await apiFactory(token).call('getMe');
    } catch (err) {
      console.warn(`⚠️  Токен …${token.slice(-6)} не прошёл getMe: ${err.message}`);
      continue;
    }
    const def = BOTS.find((b) => b.username.toLowerCase() === (me.username || '').toLowerCase());
    if (!def) {
      console.warn(`⚠️  Токен принадлежит неизвестному боту @${me.username} — пропускаю`);
      continue;
    }
    if (!byBot.has(def)) byBot.set(def, token);
  }
  return byBot;
}
