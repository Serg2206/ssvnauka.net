import { LINKS, CONTACTS } from '../data.js';

const DISCLAIMER = '⚠️ Бот носит информационный характер и не является медицинской консультацией.';

const topics = () => [
  '🩺 Темы, по которым есть материалы:',
  '• Общая хирургия',
  '• Онкологическая хирургия (в т.ч. рак желудка)',
  '• Сосудистая хирургия',
  '• Торакальная хирургия',
  '',
  `Материалы и проекты: ${LINKS.site}`,
  '',
  DISCLAIMER,
].join('\n');

const start = () => [
  '🤖 Maria — ассистент по хирургической тематике проектов профессора Сушкова.',
  '',
  'Команды:',
  '/topics — темы и материалы',
  '/ask — задать вопрос',
  '/contact — связаться с профессором',
  '',
  DISCLAIMER,
].join('\n');

const ask = () => [
  'Напишите ваш вопрос по хирургической тематике одним сообщением —',
  'я подскажу, где найти материалы, либо передам контакты профессора.',
  '',
  DISCLAIMER,
].join('\n');

export default {
  username: 'maria_surgical_ai_bot',
  tokenEnv: 'MARIA_SURGICAL_AI_BOT_TOKEN',
  profile: {
    name: 'Maria — Surgical AI',
    shortDescription: 'Ассистент по хирургической тематике (информационный)',
    description:
      'Maria — информационный ассистент по хирургическим проектам профессора С. В. Сушкова. Подсказывает материалы и контакты. Не является медицинской консультацией.',
    commands: [
      { command: 'start', description: 'Начать' },
      { command: 'topics', description: 'Темы и материалы' },
      { command: 'ask', description: 'Задать вопрос' },
      { command: 'contact', description: 'Контакты' },
    ],
  },
  handlers: {
    start,
    help: start,
    topics,
    ask,
    contact: () => `${CONTACTS}\n\n${DISCLAIMER}`,
  },
  keywords: [
    { match: /хирург|операц|онко|рак|желуд|сосуд|торакальн/i, reply: topics },
    { match: /вопрос|спросить|помо(г|щ)/i, reply: ask },
    { match: /контакт|врач|доктор|професс|связ/i, reply: () => `${CONTACTS}\n\n${DISCLAIMER}` },
  ],
  fallback: () =>
    `Я пока отвечаю по командам — наберите /start.\n\n${DISCLAIMER}`,
};
