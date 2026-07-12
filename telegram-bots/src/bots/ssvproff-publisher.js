import { LINKS, CONTACTS } from '../data.js';

const profiles = () => [
  '🔗 Научные профили:',
  `• ORCID: ${LINKS.orcid}`,
  `• Google Scholar: ${LINKS.scholar}`,
  `• Scopus: ${LINKS.scopus}`,
  `• GitHub: ${LINKS.github}`,
].join('\n');

const metrics = () => [
  '📊 Наукометрия профессора Сушкова:',
  '• 121 публикация',
  '• 18 патентов',
  '• h-index: 6',
  '• 40+ лет исследовательского опыта',
].join('\n');

const start = () => [
  '📖 Бот научных публикаций профессора Сушкова.',
  '',
  'Команды:',
  '/publications — наукометрия',
  '/profiles — ORCID, Scholar, Scopus',
  '/contact — контакты для научного сотрудничества',
].join('\n');

export default {
  username: 'ssvproff_publisher_bot',
  tokenEnv: 'SSVPROFF_PUBLISHER_BOT_TOKEN',
  profile: {
    name: 'SSVproff — публикации',
    shortDescription: 'Научные публикации и профили профессора Сушкова',
    description:
      'Научные публикации, патенты и наукометрические профили (ORCID, Google Scholar, Scopus) профессора С. В. Сушкова. Контакты для научного сотрудничества.',
    commands: [
      { command: 'start', description: 'Начать' },
      { command: 'publications', description: 'Публикации и наукометрия' },
      { command: 'profiles', description: 'ORCID, Scholar, Scopus' },
      { command: 'contact', description: 'Контакты' },
    ],
  },
  handlers: {
    start,
    help: start,
    publications: metrics,
    profiles,
    contact: () => CONTACTS,
  },
  keywords: [
    { match: /публикац|стать|патент|h-?index|наукометр/i, reply: metrics },
    { match: /orcid|scholar|scopus|профил/i, reply: profiles },
    { match: /контакт|сотрудничеств|связ/i, reply: () => CONTACTS },
  ],
  fallback: () => 'Наберите /start — покажу публикации и научные профили.',
};
