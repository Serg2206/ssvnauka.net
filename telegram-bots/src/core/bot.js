// Ядро бота: маршрутизация входящих обновлений Telegram к обработчикам.
//
// Определение бота (def):
//   username  — имя бота без @ (для отсечения "/cmd@username" в группах)
//   tokenEnv  — имя переменной окружения с токеном
//   profile   — то, что регистрируется в Telegram: name, description,
//               shortDescription, commands: [{ command, description }]
//   handlers  — { имяКоманды: () => текстОтвета }
//   keywords  — [{ match: RegExp, reply: () => текст }] для обычных сообщений
//   fallback  — () => текст, когда ничего не подошло

export function routeMessage(def, text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('/')) {
    const raw = trimmed.split(/\s+/)[0].slice(1);
    const [name, target] = raw.split('@');
    if (target && target.toLowerCase() !== def.username.toLowerCase()) return null;
    const handler = def.handlers[name.toLowerCase()];
    return handler ? handler() : def.fallback();
  }

  for (const { match, reply } of def.keywords || []) {
    if (match.test(trimmed)) return reply();
  }
  return def.fallback();
}

export async function handleUpdate(def, update, api) {
  const message = update.message || update.edited_message;
  if (!message || !message.chat) return null;

  const reply = routeMessage(def, message.text);
  if (!reply) return null;

  await api.call('sendMessage', {
    chat_id: message.chat.id,
    text: reply,
    link_preview_options: { is_disabled: true },
  });
  return reply;
}
