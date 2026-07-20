import { type Locale } from "@/lib/site-data";

export const histologyToolPath = "/diagnostika/rasshifrovka-gistologii";

type HistologyToolCopy = {
  kicker: string;
  title: string;
  description: string;
  audienceIntroDefault: string;
  audienceIntroPatients: string;
  audienceIntroDoctors: string;
  discussTitle: string;
  discussItems: string[];
  receiveTitle: string;
  receiveItems: string[];
  whyImportantLabel: string;
  whyImportantText: string;
  examplesTitle: string;
  examples: { term: string; explanation: string }[];
  howTitle: string;
  howSteps: { title: string; description: string }[];
  usefulTitle: string;
  usefulItems: string[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  contactsLine: string;
  disclaimerTitle: string;
  disclaimerText: string;
  relatedTitle: string;
  relatedItems: { label: string; href: string }[];
};

const copy: Record<Locale, HistologyToolCopy> = {
  en: {
    kicker: "Histology and diagnostics",
    title: "Expert Interpretation of a Pathology Report",
    description: "Clear explanation of key terms in histology and IHC reports and what they may mean for next clinical steps.",
    audienceIntroDefault: "Choose your path: practical explanation for patients or a concise structured view for clinicians.",
    audienceIntroPatients: "Patient mode: plain-language interpretation focused on understanding the report and discussing next steps with your doctor.",
    audienceIntroDoctors: "Doctor mode: concise interpretation focused on morphology, IHC markers, and practical communication for treatment planning.",
    discussTitle: "What Can Be Reviewed",
    discussItems: [
      "Postoperative histology reports",
      "Biopsy reports (core, incisional, excisional)",
      "Histochemistry results",
      "Immunohistochemistry (IHC)",
      "Cytology results"
    ],
    receiveTitle: "What You Receive",
    receiveItems: [
      "Plain-language explanation of report terms",
      "Grade and stage context when available",
      "Interpretation of prognostic markers (Ki-67, receptors, HER2)",
      "Practical recommendations for next steps",
      "Structured PDF summary",
      "Follow-up clarifications in Telegram"
    ],
    whyImportantLabel: "Why this matters:",
    whyImportantText:
      "A pathology report is a core document for treatment planning. Misinterpretation can lead to the wrong strategy, so each key term should be understood in context.",
    examplesTitle: "Examples of Terms",
    examples: [
      {
        term: "Invasive ductal carcinoma G2",
        explanation: "What does invasive mean? What is G2 and how can it affect planning?"
      },
      {
        term: "Ki-67: 35%",
        explanation: "What does this proliferation index indicate and how can it affect treatment choices?"
      },
      {
        term: "Clear resection margins",
        explanation: "What are clear margins and do they change the need for additional therapy?"
      },
      {
        term: "Estrogen receptor positive",
        explanation: "How can this influence systemic therapy options and prognosis discussion?"
      }
    ],
    howTitle: "How It Works",
    howSteps: [
      {
        title: "Submit a request",
        description: "Open Telegram bot @SSVproff_bot and upload a photo or PDF of your pathology report."
      },
      {
        title: "Add brief context",
        description: "Describe when the procedure happened and what concerns you now."
      },
      {
        title: "Receive interpretation",
        description: "A structured interpretation is prepared within 24-48 hours."
      },
      {
        title: "Discuss next steps",
        description: "Get follow-up answers and guidance in Telegram."
      }
    ],
    usefulTitle: "When It Is Helpful",
    usefulItems: [
      "You received a pathology report and need it explained clearly",
      "You want a second expert opinion on histology",
      "You need help understanding why a therapy was recommended",
      "You are preparing for treatment planning discussion"
    ],
    ctaTitle: "Need Histology Interpretation?",
    ctaText: "Upload your report through Telegram bot to receive an expert interpretation.",
    ctaButton: "Upload via Telegram",
    contactsLine: "Questions: Telegram @SSVproff or phone +380 67 570 79 49",
    disclaimerTitle: "Important:",
    disclaimerText:
      "Report interpretation does not replace slide/block review by a pathologist, an in-person clinical visit, or a final diagnosis.",
    relatedTitle: "Related Pages",
    relatedItems: [
      { label: "Clinic and consultation", href: "/clinic" },
      { label: "Surgical oncology", href: "/services/surgical-oncology" },
      { label: "Request consultation", href: "/clinic#request" }
    ]
  },
  ru: {
    kicker: "Гистология и диагностика",
    title: "Экспертная интерпретация гистологического заключения",
    description: "Понятное объяснение ключевых терминов гистологии и ИГХ и их значения для дальнейшей тактики.",
    audienceIntroDefault: "Выберите формат: понятное объяснение для пациента или структурированный разбор для врача.",
    audienceIntroPatients: "Режим для пациентов: объяснение простым языком, чтобы понять заключение и обсудить следующий шаг с лечащим врачом.",
    audienceIntroDoctors: "Режим для врачей: краткий структурированный разбор с акцентом на морфологию, ИГХ-маркеры и практическую коммуникацию тактики.",
    discussTitle: "Что Можно Разобрать",
    discussItems: [
      "Гистологические заключения после операций",
      "Биопсии (пункционные, инцизионные, эксцизионные)",
      "Гистохимические исследования",
      "Иммуногистохимию (ИГХ)",
      "Цитологические исследования"
    ],
    receiveTitle: "Что Вы Получите",
    receiveItems: [
      "Объяснение терминов простым языком",
      "Контекст стадии и степени злокачественности (если доступны)",
      "Разбор прогностических факторов (Ki-67, рецепторы, HER2)",
      "Рекомендации по следующему шагу",
      "Структурированное PDF-заключение",
      "Уточнения по вопросам в Telegram"
    ],
    whyImportantLabel: "Почему это важно:",
    whyImportantText:
      "Гистологическое заключение определяет тактику лечения. Ошибочная интерпретация может привести к неверным решениям, поэтому каждый термин нужно разбирать в клиническом контексте.",
    examplesTitle: "Примеры Терминов",
    examples: [
      {
        term: "Инвазивная протоковая карцинома G2",
        explanation: "Что значит инвазивная? Что означает G2 и как это влияет на тактику?"
      },
      {
        term: "Ki-67: 35%",
        explanation: "Что показывает индекс пролиферации и как он влияет на выбор лечения?"
      },
      {
        term: "Края резекции чистые",
        explanation: "Что такое чистые края и нужна ли дополнительная терапия?"
      },
      {
        term: "Рецепторы эстрогенов позитивные",
        explanation: "Как это влияет на выбор системной терапии и обсуждение прогноза?"
      }
    ],
    howTitle: "Как Это Работает",
    howSteps: [
      {
        title: "Оставляете заявку",
        description: "Откройте Telegram-бот @SSVproff_bot и загрузите фото или PDF заключения."
      },
      {
        title: "Добавляете контекст",
        description: "Кратко укажите, когда была операция/биопсия и что беспокоит сейчас."
      },
      {
        title: "Получаете расшифровку",
        description: "Структурированная интерпретация готовится в течение 24-48 часов."
      },
      {
        title: "Обсуждаете следующий шаг",
        description: "Получаете ответы на уточняющие вопросы в Telegram."
      }
    ],
    usefulTitle: "Когда Это Полезно",
    usefulItems: [
      "Получили гистологию и хотите понять, что именно она означает",
      "Нужно второе экспертное мнение по заключению",
      "Нужно понять обоснование назначенной терапии",
      "Готовитесь к обсуждению плана лечения"
    ],
    ctaTitle: "Нужна Расшифровка Гистологии?",
    ctaText: "Загрузите заключение через Telegram-бот и получите экспертную интерпретацию.",
    ctaButton: "Загрузить через Telegram",
    contactsLine: "Вопросы: Telegram @SSVproff или телефон +380 67 570 79 49",
    disclaimerTitle: "Важно:",
    disclaimerText:
      "Интерпретация заключения не заменяет пересмотр стекол/блоков патоморфологом, очную консультацию и финальный диагноз.",
    relatedTitle: "Полезные Разделы",
    relatedItems: [
      { label: "Клиника и консультация", href: "/clinic" },
      { label: "Онкохирургия", href: "/services/surgical-oncology" },
      { label: "Оставить запрос", href: "/clinic#request" }
    ]
  },
  uk: {
    kicker: "Гістологія та діагностика",
    title: "Експертна інтерпретація гістологічного висновку",
    description: "Зрозуміле пояснення ключових термінів гістології та ІГХ і їх значення для подальшої тактики.",
    audienceIntroDefault: "Оберіть формат: зрозуміле пояснення для пацієнта або структурований розбір для лікаря.",
    audienceIntroPatients: "Режим для пацієнтів: пояснення простою мовою, щоб краще зрозуміти висновок і обговорити наступний крок з лікарем.",
    audienceIntroDoctors: "Режим для лікарів: стислий структурований розбір з акцентом на морфологію, ІГХ-маркери та практичну комунікацію тактики.",
    discussTitle: "Що Можна Розібрати",
    discussItems: [
      "Гістологічні висновки після операцій",
      "Біопсії (пункційні, інцизійні, ексцизійні)",
      "Гістохімічні дослідження",
      "Імуногістохімію (ІГХ)",
      "Цитологічні дослідження"
    ],
    receiveTitle: "Що Ви Отримаєте",
    receiveItems: [
      "Пояснення термінів простою мовою",
      "Контекст стадії та ступеня злоякісності (за наявності)",
      "Розбір прогностичних факторів (Ki-67, рецептори, HER2)",
      "Рекомендації щодо наступного кроку",
      "Структурований PDF-висновок",
      "Уточнення запитань у Telegram"
    ],
    whyImportantLabel: "Чому це важливо:",
    whyImportantText:
      "Гістологічний висновок визначає подальшу тактику лікування. Помилкова інтерпретація може призвести до неправильних рішень, тому кожен термін важливо розглядати в клінічному контексті.",
    examplesTitle: "Приклади Термінів",
    examples: [
      {
        term: "Інвазивна протокова карцинома G2",
        explanation: "Що означає інвазивна? Що таке G2 і як це впливає на тактику?"
      },
      {
        term: "Ki-67: 35%",
        explanation: "Що показує індекс проліферації та як він впливає на вибір лікування?"
      },
      {
        term: "Краї резекції чисті",
        explanation: "Що означають чисті краї і чи потрібна додаткова терапія?"
      },
      {
        term: "Рецептори естрогенів позитивні",
        explanation: "Як це впливає на вибір системної терапії та обговорення прогнозу?"
      }
    ],
    howTitle: "Як Це Працює",
    howSteps: [
      {
        title: "Залишаєте запит",
        description: "Відкрийте Telegram-бот @SSVproff_bot та завантажте фото або PDF висновку."
      },
      {
        title: "Додаєте контекст",
        description: "Коротко вкажіть, коли була операція/біопсія і що турбує зараз."
      },
      {
        title: "Отримуєте розшифровку",
        description: "Структурована інтерпретація готується протягом 24-48 годин."
      },
      {
        title: "Обговорюєте наступний крок",
        description: "Отримуєте відповіді на уточнювальні запитання у Telegram."
      }
    ],
    usefulTitle: "Коли Це Корисно",
    usefulItems: [
      "Отримали гістологію і хочете зрозуміти зміст висновку",
      "Потрібна друга експертна думка",
      "Потрібно зрозуміти обгрунтування призначеної терапії",
      "Готуєтесь до обговорення плану лікування"
    ],
    ctaTitle: "Потрібна Розшифровка Гістології?",
    ctaText: "Завантажте висновок через Telegram-бот і отримайте експертну інтерпретацію.",
    ctaButton: "Завантажити через Telegram",
    contactsLine: "Питання: Telegram @SSVproff або телефон +380 67 570 79 49",
    disclaimerTitle: "Важливо:",
    disclaimerText:
      "Інтерпретація висновку не замінює перегляд скелець/блоків патоморфологом, очну консультацію та фінальний діагноз.",
    relatedTitle: "Корисні Розділи",
    relatedItems: [
      { label: "Клініка та консультація", href: "/clinic" },
      { label: "Онкохірургія", href: "/services/surgical-oncology" },
      { label: "Залишити запит", href: "/clinic#request" }
    ]
  }
};

export function getHistologyToolCopy(locale: Locale) {
  return copy[locale];
}
