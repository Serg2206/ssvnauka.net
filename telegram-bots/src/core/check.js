// Сверяет фактическую настройку бота в Telegram с его определением.
// Возвращает список проблем (пустой = всё верно). Не вызывает getUpdates,
// поэтому не мешает работающему экземпляру ботов.
export async function checkBot(def, api) {
  const problems = [];

  const me = await api.call('getMe');
  if (me.username.toLowerCase() !== def.username.toLowerCase()) {
    problems.push(`токен принадлежит @${me.username}, а не @${def.username}`);
  }

  const { name } = await api.call('getMyName');
  if (name !== def.profile.name) problems.push(`имя «${name}» ≠ «${def.profile.name}»`);

  const { description } = await api.call('getMyDescription');
  if (description !== def.profile.description) problems.push('описание отличается от заданного');

  const { short_description } = await api.call('getMyShortDescription');
  if (short_description !== def.profile.shortDescription) problems.push('короткое описание отличается');

  const commands = await api.call('getMyCommands');
  const expected = def.profile.commands.map((c) => c.command).join(',');
  const actual = (commands || []).map((c) => c.command).join(',');
  if (actual !== expected) problems.push(`команды [${actual}] ≠ [${expected}]`);

  const webhook = await api.call('getWebhookInfo');
  if (webhook.url) problems.push(`установлен вебхук ${webhook.url} — он блокирует long polling`);

  return problems;
}
