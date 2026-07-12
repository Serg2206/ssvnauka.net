const API_BASE = 'https://api.telegram.org';

// Тонкий клиент Telegram Bot API. fetchImpl подменяется в тестах.
export function createApi(token, fetchImpl = fetch) {
  if (!token) throw new Error('Telegram bot token is required');
  return {
    async call(method, params = {}) {
      const res = await fetchImpl(`${API_BASE}/bot${token}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const body = await res.json();
      if (!body.ok) {
        throw new Error(`Telegram API ${method} failed: ${body.error_code} ${body.description}`);
      }
      return body.result;
    },
  };
}
