import { LINKS, CONTACTS } from '../data.js';

const channel = () => [
  '▶️ YouTube-канал профессора Сушкова:',
  LINKS.youtube,
  '',
  'Подписывайтесь, чтобы не пропустить новые видео.',
].join('\n');

const start = () => [
  '🎬 Бот YouTube-канала SSVproff.',
  '',
  'Команды:',
  '/channel — ссылка на канал',
  '/contact — контакты',
].join('\n');

export default {
  username: 'ssvproff_youtube_bot',
  tokenEnv: 'SSVPROFF_YOUTUBE_BOT_TOKEN',
  profile: {
    name: 'SSVproff — YouTube',
    shortDescription: 'YouTube-канал профессора Сушкова',
    description:
      'Ссылки и анонсы видео YouTube-канала профессора С. В. Сушкова: хирургия, наука, образование.',
    commands: [
      { command: 'start', description: 'Начать' },
      { command: 'channel', description: 'Ссылка на канал' },
      { command: 'contact', description: 'Контакты' },
    ],
  },
  handlers: {
    start,
    help: start,
    channel,
    videos: channel,
    contact: () => CONTACTS,
  },
  keywords: [
    { match: /видео|канал|youtube|ютуб|смотреть/i, reply: channel },
    { match: /контакт|связ/i, reply: () => CONTACTS },
  ],
  fallback: () => `Наберите /start или сразу смотрите канал: ${LINKS.youtube}`,
};
