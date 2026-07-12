import { LINKS, CONTACTS } from '../data.js';

const sites = () => [
  '🌐 Сайты профессора Сушкова:',
  `• ${LINKS.site} — академический профиль`,
  `• ${LINKS.siteCom} — основной сайт`,
  `• ${LINKS.proffssv} — проекты`,
].join('\n');

const channel = () => `✈️ Telegram-канал: ${LINKS.telegram}`;

const start = () => [
  '📚 Контент-бот SSVproff: сайты, канал и материалы профессора Сушкова.',
  '',
  'Команды:',
  '/sites — сайты',
  '/channel — Telegram-канал',
  '/support — поддержать проект',
  '/contact — контакты',
].join('\n');

export default {
  username: 'ssvproff_content_bot',
  tokenEnv: 'SSVPROFF_CONTENT_BOT_TOKEN',
  profile: {
    name: 'SSVproff — контент',
    shortDescription: 'Сайты, канал и материалы профессора Сушкова',
    description:
      'Навигация по контенту профессора С. В. Сушкова: сайты ssvnauka.net и ssvnauka.com, Telegram-канал @SSVproff, способы поддержать проект.',
    commands: [
      { command: 'start', description: 'Начать' },
      { command: 'sites', description: 'Сайты' },
      { command: 'channel', description: 'Telegram-канал' },
      { command: 'support', description: 'Поддержать проект' },
      { command: 'contact', description: 'Контакты' },
    ],
  },
  handlers: {
    start,
    help: start,
    sites,
    channel,
    support: () => `☕ Поддержать проект: ${LINKS.coffee}`,
    contact: () => CONTACTS,
  },
  keywords: [
    { match: /сайт|site/i, reply: sites },
    { match: /канал|channel|telegram/i, reply: channel },
    { match: /поддерж|донат|coffee/i, reply: () => `☕ Поддержать проект: ${LINKS.coffee}` },
    { match: /контакт|связ/i, reply: () => CONTACTS },
  ],
  fallback: () => 'Наберите /start, чтобы увидеть, какой контент я могу показать.',
};
