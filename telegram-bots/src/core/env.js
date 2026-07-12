import { readFileSync } from 'node:fs';

// Минимальный загрузчик .env (KEY=VALUE, # — комментарий); без внешних зависимостей.
// Переменные, уже заданные в окружении, имеют приоритет.
export function loadEnv(path = new URL('../../.env', import.meta.url)) {
  let raw;
  try {
    raw = readFileSync(path, 'utf8');
  } catch {
    return;
  }
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    const [, key, value] = m;
    if (!(key in process.env)) process.env[key] = value.replace(/^["']|["']$/g, '');
  }
}
