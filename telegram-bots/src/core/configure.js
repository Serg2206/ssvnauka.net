// Настройка профиля бота в Telegram: имя, описания, список команд.
// Используется скриптом scripts/setup.js и тестами.

export async function configureBot(def, api) {
  const me = await api.call('getMe');
  if (me.username && me.username.toLowerCase() !== def.username.toLowerCase()) {
    throw new Error(
      `Токен принадлежит @${me.username}, а ожидался @${def.username} — проверьте переменные окружения`,
    );
  }

  await api.call('setMyName', { name: def.profile.name });
  await api.call('setMyDescription', { description: def.profile.description });
  await api.call('setMyShortDescription', { short_description: def.profile.shortDescription });
  await api.call('setMyCommands', { commands: def.profile.commands });
  // Боты работают через long polling — вебхук должен быть снят.
  await api.call('deleteWebhook', { drop_pending_updates: false });

  return me;
}
