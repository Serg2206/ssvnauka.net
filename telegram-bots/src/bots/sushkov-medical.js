import { LINKS, CONTACTS, ABOUT } from '../data.js';

const start = () => [
  '👨‍⚕️ Здравствуйте! Это официальный бот профессора Сергея Валентиновича Сушкова —',
  'хирурга, учёного, преподавателя.',
  '',
  'Команды:',
  '/about — о профессоре',
  '/expertise — направления работы',
  '/consult — как связаться для консультации',
  '/contact — контакты',
].join('\n');

const expertise = () => [
  '🔬 Направления:',
  '• Общая хирургия',
  '• Онкологическая хирургия',
  '• Сосудистая хирургия',
  '• Торакальная хирургия',
  '• Клинические исследования (GCP, 20+ лет)',
].join('\n');

const consult = () => [
  '📋 Для консультации напишите напрямую:',
  '',
  CONTACTS,
  '',
  '⚠️ Бот не даёт медицинских советов и не заменяет очный приём врача.',
].join('\n');

export default {
  username: 'sushkov_medical_bot',
  tokenEnv: 'SUSHKOV_MEDICAL_BOT_TOKEN',
  profile: {
    name: 'Проф. Сушков — медицинский бот',
    shortDescription: 'Официальный бот профессора-хирурга С. В. Сушкова',
    description:
      'Информация о профессоре Сергее Валентиновиче Сушкове: опыт, направления хирургии, как записаться на консультацию. Не заменяет консультацию врача.',
    commands: [
      { command: 'start', description: 'Начать' },
      { command: 'about', description: 'О профессоре' },
      { command: 'expertise', description: 'Направления работы' },
      { command: 'consult', description: 'Как получить консультацию' },
      { command: 'contact', description: 'Контакты' },
    ],
  },
  handlers: {
    start,
    help: start,
    about: () => ABOUT,
    expertise,
    consult,
    contact: () => CONTACTS,
  },
  keywords: [
    { match: /консульт|запис|при[её]м/i, reply: consult },
    { match: /контакт|связ|почт|email/i, reply: () => CONTACTS },
    { match: /опыт|о професс|кто вы|about/i, reply: () => ABOUT },
    { match: /хирург|операц|онко|сосуд|торакальн/i, reply: expertise },
  ],
  fallback: () => `Я информационный бот. Наберите /start для списка команд.\n\n${CONTACTS}`,
};
