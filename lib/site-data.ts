export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssvnauka.com";

export const locales = ["en", "ru", "uk"] as const;
export type Locale = (typeof locales)[number];

export const serviceSlugs = ["laparoscopic-surgery", "surgical-oncology", "emergency-surgery"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export function localePath(locale: Locale, path = "/") {
  if (locale === "en") {
    return path;
  }

  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

type ServiceCopy = {
  title: string;
  summary: string;
  intro: string;
  indicationsTitle: string;
  indications: string[];
  preparationTitle: string;
  preparation: string[];
  urgentTitle: string;
  urgent: string[];
};

type LocaleCopy = {
  languageName: string;
  nav: {
    home: string;
    clinic: string;
    consultation: string;
    diagnostics: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    copy: string;
    primaryCta: string;
    secondaryCta: string;
    histologyPatientsCta: string;
    histologyDoctorsCta: string;
    highlights: string[];
  };
  services: {
    title: string;
    intro: string;
    cta: string;
  };
  conditions: {
    title: string;
    items: string[];
  };
  experience: {
    title: string;
    copy: string;
    metrics: { value: string; label: string }[];
  };
  consultation: {
    title: string;
    copy: string;
    steps: string[];
  };
  faq: {
    title: string;
    items: { question: string; answer: string }[];
  };
  clinic: {
    eyebrow: string;
    title: string;
    copy: string;
    disclaimer: string;
    locationLabel: string;
    emailLabel: string;
    telegramLabel: string;
    phoneLabel: string;
    emergencyNotice: string;
    formTitle: string;
    formCopy: string;
    intake: {
      fullName: string;
      contactValue: string;
      preferredContact: string;
      summary: string;
      submit: string;
      sending: string;
    };
    consentCopy: string;
    privacyCopy: string;
  };
  contacts: {
    email: string;
    telegram: string;
    phone: string;
    city: string;
  };
  servicesDetail: Record<ServiceSlug, ServiceCopy>;
};

export const siteCopy: Record<Locale, LocaleCopy> = {
  en: {
    languageName: "English",
    nav: {
      home: "Home",
      clinic: "Clinic",
      consultation: "Request consultation",
      diagnostics: "Histology tool"
    },
    hero: {
      eyebrow: "Surgeon • Oncologist • Scientist • Educator",
      title: "Personalized surgical care for complex conditions in Kharkiv.",
      copy: "Prof. Sergiy Sushkov combines decades of clinical practice with minimally invasive techniques for oncology, abdominal disease, and urgent surgery.",
      primaryCta: "Request consultation",
      secondaryCta: "Explore services",
      histologyPatientsCta: "Histology tool for patients",
      histologyDoctorsCta: "Histology tool for doctors",
      highlights: ["40+ years of experience", "Laparoscopic surgery", "Cancer surgery"]
    },
    services: {
      title: "Services",
      intro: "Each service has its own page with the main indications, preparation steps, and what to expect from a consultation.",
      cta: "Learn more"
    },
    conditions: {
      title: "Conditions and diseases",
      items: [
        "Oncological surgery and organ-preserving planning",
        "Gallbladder disease, hernias, and other abdominal surgery",
        "Urgent abdominal conditions that need rapid assessment"
      ]
    },
    experience: {
      title: "Experience and scientific work",
      copy: "More than 40 years of clinical practice, over 120 publications, patents, and long-term teaching experience with surgeons and residents.",
      metrics: [
        { value: "40+", label: "years of experience" },
        { value: "120+", label: "publications" },
        { value: "200+", label: "surgeons trained" }
      ]
    },
    consultation: {
      title: "Book a consultation",
      copy: "Use the intake form below for a routine consultation request. Do not submit emergencies, detailed diagnostics, or uploads unless the private storage layer is configured.",
      steps: [
        "Send only the minimum contact details needed for follow-up.",
        "Briefly describe the reason for the visit without sharing sensitive records.",
        "The office will reply with the next safe step for the case."
      ]
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "Do you treat cancer patients?",
          answer: "Yes. Surgical oncology and organ-preserving planning are core parts of the practice."
        },
        {
          question: "Are laparoscopic procedures available?",
          answer: "Yes. Minimally invasive surgery is used when it is clinically appropriate."
        },
        {
          question: "How can I arrange a consultation?",
          answer: "Send a request by the secure form, email, or Telegram, and the office will confirm the next step."
        }
      ]
    },
    clinic: {
      eyebrow: "Clinic and intake",
      title: "Visit the clinic in Kharkiv",
      copy: "For routine appointments, use the contact details or the secure intake form below. For severe symptoms, call emergency services first.",
      disclaimer: "This MVP does not persist real medical records. Intake data is accepted only as a contact request unless private storage and a medical CRM are configured.",
      locationLabel: "Location",
      emailLabel: "Email",
      telegramLabel: "Telegram",
      phoneLabel: "Phone",
      emergencyNotice: "For severe pain, bleeding, chest symptoms, or sudden deterioration, contact emergency services before submitting a form.",
      formTitle: "Secure request form",
      formCopy: "Only minimal contact details are collected. Please do not include diagnoses, test results, or attachments in this MVP.",
      intake: {
        fullName: "Name",
        contactValue: "Email or phone",
        preferredContact: "Preferred contact",
        summary: "Short request summary",
        submit: "Send request",
        sending: "Sending..."
      },
      consentCopy: "I consent to being contacted about this request.",
      privacyCopy: "I understand that this MVP does not store real medical records unless a private data store is configured."
    },
    contacts: {
      email: "ssvproff@gmail.com",
      telegram: "@SSVproff",
      phone: "+380000000000",
      city: "Kharkiv, Ukraine"
    },
    servicesDetail: {
      "laparoscopic-surgery": {
        title: "Laparoscopic surgery",
        summary: "Minimally invasive procedures with smaller incisions and a faster recovery path.",
        intro: "Laparoscopic surgery is used when the clinical situation allows a less traumatic approach while keeping treatment safety and effectiveness in focus.",
        indicationsTitle: "When it is used",
        indications: ["Gallbladder disease", "Hernias", "Selected abdominal operations"],
        preparationTitle: "Before the procedure",
        preparation: ["Share recent test results if you already have them.", "Discuss medications, allergies, and previous operations.", "Follow the office instructions about fasting and recovery."],
        urgentTitle: "When to seek urgent help",
        urgent: ["Severe abdominal pain", "Fever with vomiting", "Sudden deterioration after surgery"]
      },
      "surgical-oncology": {
        title: "Surgical oncology",
        summary: "Careful planning for cancer surgery, including organ-preserving strategies where possible.",
        intro: "The goal is to align the operation with the diagnosis, stage, and recovery needs while keeping the patient informed at every step.",
        indicationsTitle: "Core focus areas",
        indications: ["Breast cancer surgery", "Abdominal oncology", "Multidisciplinary treatment planning"],
        preparationTitle: "Before the consultation",
        preparation: ["Bring the latest pathology and imaging results if available.", "List previous treatments and current medications.", "Write down the main questions you want answered."],
        urgentTitle: "If the condition is unstable",
        urgent: ["Do not wait for an online response.", "Contact emergency services or the nearest hospital.", "Use the form only for routine consultation requests."]
      },
      "emergency-surgery": {
        title: "Emergency surgery",
        summary: "Rapid surgical assessment and decision-making for time-sensitive abdominal conditions.",
        intro: "Emergency cases require a direct clinical assessment. The site form is not a substitute for urgent medical care.",
        indicationsTitle: "Typical urgent situations",
        indications: ["Perforation or peritonitis", "Acute pancreatitis", "Severe postoperative complications"],
        preparationTitle: "What matters most",
        preparation: ["Describe symptoms briefly and clearly.", "State when they started and how quickly they changed.", "Seek in-person care immediately if symptoms are severe."],
        urgentTitle: "Do not delay",
        urgent: ["Call local emergency services.", "Go to the nearest emergency department.", "Use the form only after the acute issue is addressed."]
      }
    }
  },
  ru: {
    languageName: "Русский",
    nav: {
      home: "Главная",
      clinic: "Клиника",
      consultation: "Запись",
      diagnostics: "Гистология"
    },
    hero: {
      eyebrow: "Хирург • Онколог • Учёный • Преподаватель",
      title: "Персонализированная хирургическая помощь при сложных состояниях в Харькове.",
      copy: "Профессор Сергей Сушков сочетает многолетнюю практику и малоинвазивные методы в онкологии, абдоминальной и неотложной хирургии.",
      primaryCta: "Записаться на консультацию",
      secondaryCta: "Посмотреть услуги",
      histologyPatientsCta: "Расшифровка гистологии для пациентов",
      histologyDoctorsCta: "Расшифровка гистологии для врачей",
      highlights: ["40+ лет опыта", "Лапароскопия", "Онкохирургия"]
    },
    services: {
      title: "Услуги",
      intro: "У каждой услуги есть отдельная страница с показаниями, подготовкой и тем, чего ожидать от консультации.",
      cta: "Подробнее"
    },
    conditions: {
      title: "Заболевания и состояния",
      items: [
        "Онкологическая хирургия и органосохраняющее планирование",
        "Желчнокаменная болезнь, грыжи и другая абдоминальная хирургия",
        "Неотложные абдоминальные состояния, требующие быстрого осмотра"
      ]
    },
    experience: {
      title: "Опыт и научная работа",
      copy: "Более 40 лет клинической практики, свыше 120 публикаций, патенты и многолетняя преподавательская работа с хирургами и ординаторами.",
      metrics: [
        { value: "40+", label: "лет опыта" },
        { value: "120+", label: "публикаций" },
        { value: "200+", label: "обученных хирургов" }
      ]
    },
    consultation: {
      title: "Запись на консультацию",
      copy: "Используйте форму ниже только для плановой записи. Не отправляйте экстренные случаи, подробные медданные или вложения, если приватное хранилище ещё не настроено.",
      steps: [
        "Оставьте только минимальные контактные данные.",
        "Коротко опишите причину обращения без чувствительных документов.",
        "Офис сообщит следующий безопасный шаг."
      ]
    },
    faq: {
      title: "Частые вопросы",
      items: [
        {
          question: "Вы принимаете онкологических пациентов?",
          answer: "Да. Онкохирургия и органосохраняющее планирование входят в основное направление работы."
        },
        {
          question: "Доступны лапароскопические операции?",
          answer: "Да. Малоинвазивный подход используется, когда это клинически оправдано."
        },
        {
          question: "Как записаться на консультацию?",
          answer: "Отправьте запрос через защищённую форму, email или Telegram, и офис подтвердит следующий шаг."
        }
      ]
    },
    clinic: {
      eyebrow: "Клиника и приём",
      title: "Приём в Харькове",
      copy: "Для плановой записи используйте контакты или защищённую форму ниже. При тяжёлых симптомах сначала вызывайте неотложную помощь.",
      disclaimer: "В этом MVP реальные медицинские записи не сохраняются. Данные формы принимаются только как контактный запрос, пока не подключены приватное хранилище и CRM.",
      locationLabel: "Местоположение",
      emailLabel: "Email",
      telegramLabel: "Telegram",
      phoneLabel: "Телефон",
      emergencyNotice: "При сильной боли, кровотечении, симптомах со стороны груди или резком ухудшении сначала обращайтесь в экстренную службу.",
      formTitle: "Защищённая форма",
      formCopy: "Собираются только минимальные контактные данные. Не указывайте диагнозы, результаты анализов и вложения в этом MVP.",
      intake: {
        fullName: "Имя",
        contactValue: "Email или телефон",
        preferredContact: "Предпочтительный контакт",
        summary: "Краткое описание запроса",
        submit: "Отправить запрос",
        sending: "Отправка..."
      },
      consentCopy: "Я согласен(на) на контакт по этому запросу.",
      privacyCopy: "Я понимаю, что этот MVP не сохраняет реальные медкарты, пока не подключено приватное хранилище."
    },
    contacts: {
      email: "ssvproff@gmail.com",
      telegram: "@SSVproff",
      phone: "+380000000000",
      city: "Харьков, Украина"
    },
    servicesDetail: {
      "laparoscopic-surgery": {
        title: "Лапароскопическая хирургия",
        summary: "Малоинвазивные операции с меньшими разрезами и более быстрым восстановлением.",
        intro: "Лапароскопическая хирургия используется, когда клиническая ситуация позволяет снизить травматичность без потери безопасности и эффективности лечения.",
        indicationsTitle: "Когда применяется",
        indications: ["Желчнокаменная болезнь", "Грыжи", "Выбранные абдоминальные операции"],
        preparationTitle: "Перед процедурой",
        preparation: ["Передайте недавние обследования, если они есть.", "Обсудите лекарства, аллергии и перенесённые операции.", "Следуйте инструкциям по голоданию и восстановлению."],
        urgentTitle: "Когда нужна срочная помощь",
        urgent: ["Сильная боль в животе", "Температура и рвота", "Внезапное ухудшение после операции"]
      },
      "surgical-oncology": {
        title: "Онкохирургия",
        summary: "Тщательное планирование операций при раке, включая органосохраняющие стратегии, когда это возможно.",
        intro: "Цель — согласовать операцию с диагнозом, стадией и потребностями восстановления и при этом держать пациента в курсе каждого шага.",
        indicationsTitle: "Основные направления",
        indications: ["Рак молочной железы", "Абдоминальная онкология", "Междисциплинарное планирование лечения"],
        preparationTitle: "Перед консультацией",
        preparation: ["Возьмите свежие данные патологии и визуализации, если они есть.", "Составьте список предыдущего лечения и текущих лекарств.", "Запишите основные вопросы, которые хотите обсудить."],
        urgentTitle: "Если состояние нестабильное",
        urgent: ["Не ждите онлайн-ответа.", "Свяжитесь с неотложной помощью или ближайшим стационаром.", "Форму используйте только для плановой записи."]
      },
      "emergency-surgery": {
        title: "Неотложная хирургия",
        summary: "Быстрая хирургическая оценка и решение при абдоминальных состояниях, где важны минуты.",
        intro: "Экстренные случаи требуют прямого клинического осмотра. Форма на сайте не заменяет срочную медицинскую помощь.",
        indicationsTitle: "Типичные срочные ситуации",
        indications: ["Перфорация или перитонит", "Острый панкреатит", "Тяжёлые послеоперационные осложнения"],
        preparationTitle: "Самое важное",
        preparation: ["Кратко и чётко опишите симптомы.", "Укажите, когда они начались и как быстро менялись.", "При тяжёлых симптомах сразу обращайтесь очно."],
        urgentTitle: "Не откладывайте",
        urgent: ["Позвоните в экстренную службу.", "Езжайте в ближайшее отделение неотложной помощи.", "Используйте форму только после стабилизации состояния."]
      }
    }
  },
  uk: {
    languageName: "Українська",
    nav: {
      home: "Головна",
      clinic: "Клініка",
      consultation: "Запис",
      diagnostics: "Гістологія"
    },
    hero: {
      eyebrow: "Хірург • Онколог • Вчений • Викладач",
      title: "Персоналізована хірургічна допомога при складних станах у Харкові.",
      copy: "Професор Сергій Сушков поєднує багаторічну практику і малоінвазивні методики в онкології, абдомінальній та невідкладній хірургії.",
      primaryCta: "Записатися на консультацію",
      secondaryCta: "Переглянути послуги",
      histologyPatientsCta: "Розшифрування гістології для пацієнтів",
      histologyDoctorsCta: "Розшифрування гістології для лікарів",
      highlights: ["40+ років досвіду", "Лапароскопія", "Онкохірургія"]
    },
    services: {
      title: "Послуги",
      intro: "Кожна послуга має окрему сторінку з показаннями, підготовкою та тим, чого очікувати від консультації.",
      cta: "Докладніше"
    },
    conditions: {
      title: "Захворювання та стани",
      items: [
        "Онкохірургія та органозберігаюче планування",
        "Жовчнокам’яна хвороба, грижі та інша абдомінальна хірургія",
        "Невідкладні абдомінальні стани, що потребують швидкого огляду"
      ]
    },
    experience: {
      title: "Досвід і наукова робота",
      copy: "Понад 40 років клінічної практики, понад 120 публікацій, патенти та багаторічна викладацька робота з хірургами й ординаторами.",
      metrics: [
        { value: "40+", label: "років досвіду" },
        { value: "120+", label: "публікацій" },
        { value: "200+", label: "підготовлених хірургів" }
      ]
    },
    consultation: {
      title: "Запис на консультацію",
      copy: "Використовуйте форму нижче лише для планового запису. Не надсилайте невідкладні випадки, детальні меддані або вкладення, поки приватне сховище не налаштоване.",
      steps: [
        "Залиште лише мінімальні контактні дані.",
        "Коротко опишіть причину звернення без чутливих документів.",
        "Офіс повідомить наступний безпечний крок."
      ]
    },
    faq: {
      title: "Часті запитання",
      items: [
        {
          question: "Ви приймаєте онкологічних пацієнтів?",
          answer: "Так. Онкохірургія та органозберігаюче планування є основою практики."
        },
        {
          question: "Доступні лапароскопічні операції?",
          answer: "Так. Малоінвазивний підхід застосовується, коли це клінічно доречно."
        },
        {
          question: "Як записатися на консультацію?",
          answer: "Надішліть запит через захищену форму, email або Telegram, і офіс підтвердить наступний крок."
        }
      ]
    },
    clinic: {
      eyebrow: "Клініка та прийом",
      title: "Прийом у Харкові",
      copy: "Для планового запису використовуйте контакти або захищену форму нижче. При тяжких симптомах спершу викликайте невідкладну допомогу.",
      disclaimer: "У цьому MVP реальні медичні записи не зберігаються. Дані форми приймаються лише як контактний запит, доки не підключено приватне сховище і CRM.",
      locationLabel: "Місцезнаходження",
      emailLabel: "Email",
      telegramLabel: "Telegram",
      phoneLabel: "Телефон",
      emergencyNotice: "При сильному болю, кровотечі, симптомах з боку грудей або різкому погіршенні спершу зверніться до екстреної служби.",
      formTitle: "Захищена форма",
      formCopy: "Збираються лише мінімальні контактні дані. Не вказуйте діагнози, результати аналізів і вкладення в цьому MVP.",
      intake: {
        fullName: "Ім'я",
        contactValue: "Email або телефон",
        preferredContact: "Бажаний контакт",
        summary: "Короткий опис запиту",
        submit: "Надіслати запит",
        sending: "Надсилання..."
      },
      consentCopy: "Я погоджуюся на контакт щодо цього запиту.",
      privacyCopy: "Я розумію, що цей MVP не зберігає реальні медкарти, поки не підключене приватне сховище."
    },
    contacts: {
      email: "ssvproff@gmail.com",
      telegram: "@SSVproff",
      phone: "+380000000000",
      city: "Харків, Україна"
    },
    servicesDetail: {
      "laparoscopic-surgery": {
        title: "Лапароскопічна хірургія",
        summary: "Малоінвазивні операції з меншими розрізами та швидшим відновленням.",
        intro: "Лапароскопічна хірургія використовується, коли клінічна ситуація дозволяє зменшити травматичність без втрати безпеки та ефективності лікування.",
        indicationsTitle: "Коли застосовується",
        indications: ["Жовчнокам’яна хвороба", "Грижі", "Окремі абдомінальні операції"],
        preparationTitle: "Перед процедурою",
        preparation: ["Передайте недавні обстеження, якщо вони є.", "Обговоріть ліки, алергії та перенесені операції.", "Дотримуйтеся інструкцій щодо голодування й відновлення."],
        urgentTitle: "Коли потрібна термінова допомога",
        urgent: ["Сильний біль у животі", "Температура та блювання", "Раптове погіршення після операції"]
      },
      "surgical-oncology": {
        title: "Онкохірургія",
        summary: "Ретельне планування операцій при раку, включно з органозберігаючими стратегіями, коли це можливо.",
        intro: "Мета — узгодити операцію з діагнозом, стадією та потребами відновлення і водночас тримати пацієнта в курсі кожного кроку.",
        indicationsTitle: "Основні напрями",
        indications: ["Рак молочної залози", "Абдомінальна онкологія", "Міждисциплінарне планування лікування"],
        preparationTitle: "Перед консультацією",
        preparation: ["Візьміть свіжі дані патології та візуалізації, якщо вони є.", "Складіть список попереднього лікування і поточних ліків.", "Запишіть основні питання, які хочете обговорити."],
        urgentTitle: "Якщо стан нестабільний",
        urgent: ["Не чекайте онлайн-відповіді.", "Зверніться до невідкладної допомоги або найближчого стаціонару.", "Форму використовуйте лише для планового запису."]
      },
      "emergency-surgery": {
        title: "Невідкладна хірургія",
        summary: "Швидка хірургічна оцінка і рішення при абдомінальних станах, де важливі хвилини.",
        intro: "Екстрені випадки потребують прямого клінічного огляду. Форма на сайті не замінює термінову медичну допомогу.",
        indicationsTitle: "Типові термінові ситуації",
        indications: ["Перфорація або перитоніт", "Гострий панкреатит", "Тяжкі післяопераційні ускладнення"],
        preparationTitle: "Найважливіше",
        preparation: ["Коротко і чітко опишіть симптоми.", "Укажіть, коли вони почалися і як швидко змінювалися.", "При тяжких симптомах одразу звертайтесь очно."],
        urgentTitle: "Не відкладайте",
        urgent: ["Зателефонуйте в екстрену службу.", "Їдьте до найближчого відділення невідкладної допомоги.", "Використовуйте форму лише після стабілізації стану."]
      }
    }
  }
};

export function getLocaleCopy(locale: Locale) {
  return siteCopy[locale];
}

export function getServiceCopy(locale: Locale, slug: ServiceSlug) {
  return siteCopy[locale].servicesDetail[slug];
}
