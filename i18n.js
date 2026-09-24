// Shared language preference and translations for the portfolio and all static demos.
(() => {
  const key = 'axilium-language';
  let saved;
  try { saved = localStorage.getItem(key); } catch (_) { /* Private browsing can disable storage. */ }
  const language = saved === 'ru' || saved === 'en'
    ? saved
    : /^ru(?:-|$)/i.test(navigator.language || '') ? 'ru' : 'en';
  document.documentElement.lang = language;
  if (language === 'en') {
    document.documentElement.dataset.i18nLoading = 'en';
    const style = document.createElement('style');
    style.textContent = 'html[data-i18n-loading="en"] body{visibility:hidden}';
    document.head.append(style);
  }

  const dictionary = {
  "Проекты — Axilium": "Projects — Axilium",
  "Язык / Language": "Language",
  "Проекты": "Projects",
  "Сайты, веб-приложения и Telegram Mini Apps.": "Websites, web apps and Telegram Mini Apps.",
  "Учёт посещаемости для детского сада": "Kindergarten attendance tracker",
  "Клиентский проект": "Client project",
  "Telegram Mini App для отметок посещаемости и формирования месячных отчётов.": "A Telegram Mini App for tracking attendance and creating monthly reports.",
  "Открыть демо": "Open demo",
  "Прототип": "Prototype",
  "Меню, заказы и учёт продуктов с отдельными кабинетами пользователя, повара и администратора.": "Menus, orders and inventory with separate user, chef and admin dashboards.",
  "Код на GitHub": "View code on GitHub",
  "Лендинг шаурмичной": "Shawarma restaurant landing page",
  "Демо": "Demo",
  "Адаптивный сайт с меню и демонстрационной формой заказа.": "A responsive website with a menu and a sample order form.",
  "Axilium — проекты: Telegram Mini App, веб-система на Django и демонстрационный лендинг.": "Axilium projects: a Telegram Mini App, a Django web app and a sample landing page.",
  "Axilium — главная": "Axilium — home",
  "Примеры проектов": "Project examples",
  "Скриншот демо учёта посещаемости": "Attendance tracker demo screenshot",
  "Скриншот панели администратора MealHub": "MealHub admin dashboard screenshot",
  "Скриншот лендинга шаурмичной": "Shawarma landing page screenshot",
  "ШАВЕРМА — огонь внутри": "SHAWARMA — fire inside",
  "Демо-проект": "Demo project",
  "Бренд, адреса и цифры вымышлены. Форма ничего не отправляет.": "The brand, addresses and figures are fictional. The form does not send anything.",
  "Портфолио ↗": "Portfolio ↗",
  "Ш": "SH",
  "А": "A",
  "ВЕРМА": "WARMA",
  "Меню": "Menu",
  "О нас": "About us",
  "Контакты": "Contact",
  "Мы рядом": "Find us nearby",
  "городская еда с характером": "street food with character",
  "Огонь": "Fire",
  "внутри": "inside",
  "каждой": "every",
  "шавермы": "shawarma",
  "Сочное мясо на живом огне, хрустящие овощи и наши соусы. Собираем честно и щедро — как для своих.": "Juicy flame-grilled meat, crisp vegetables and our own sauces. Made fresh and generously, just like we would for friends.",
  "Смотреть меню": "View menu",
  "Никакой заморозки.": "Never frozen.",
  "Готовим каждый день.": "Made fresh every day.",
  "сочно · горячо · щедро · сочно · горячо · щедро ·": "juicy · hot · generous · juicy · hot · generous ·",
  "Сделано": "Made",
  "с любовью": "with love",
  "и перцем": "and spice",
  "СОЧНОЕ МЯСО": "JUICY MEAT",
  "СВЕЖИЕ ОВОЩИ": "FRESH VEGETABLES",
  "МНОГО НАЧИНКИ": "GENEROUS FILLING",
  "ЯРКИЙ ВКУС": "BOLD FLAVOUR",
  "выбирай настроение": "choose your mood",
  "В меню —": "On the menu —",
  "только хиты": "only favourites",
  "Классика, которая никогда не надоедает. Выбирай размер, добавляй остроты и наслаждайся.": "Classic flavours that never get old. Choose a size, turn up the heat and enjoy.",
  "хит": "favourite",
  "Классика": "Classic",
  "Курица · овощи · фирменный соус": "Chicken · vegetables · signature sauce",
  "от 260 ₽": "from ₽260",
  "Заказать самовывоз →": "Order pickup →",
  "остро": "spicy",
  "Поострее": "Extra Spicy",
  "Курица · халапеньо · чили-соус": "Chicken · jalapeño · chilli sauce",
  "от 280 ₽": "from ₽280",
  "Сырный взрыв": "Cheese Explosion",
  "Курица · сырный соус · моцарелла": "Chicken · cheese sauce · mozzarella",
  "от 310 ₽": "from ₽310",
  "Всё меню — в наших точках": "Full menu at our locations",
  "без очереди": "skip the queue",
  "Забери": "Pick it up",
  "горячей.": "hot.",
  "Оставьте заявку — приготовим к удобному времени. Оплата на кассе при получении.": "Place a request and we will prepare it for your chosen time. Pay at the counter when you collect it.",
  "Ваше имя": "Your name",
  "Телефон": "Phone",
  "Что готовим": "Your order",
  "Классика — от 260 ₽": "Classic — from ₽260",
  "Поострее — от 280 ₽": "Extra Spicy — from ₽280",
  "Сырный взрыв — от 310 ₽": "Cheese Explosion — from ₽310",
  "Количество": "Quantity",
  "1 шт.": "1 item",
  "2 шт.": "2 items",
  "3 шт.": "3 items",
  "4 шт.": "4 items",
  "Точка самовывоза": "Pickup location",
  "Литейный, 32": "32 Liteyny Avenue",
  "Большая Конюшенная, 14": "14 Bolshaya Konyushennaya Street",
  "Когда заберёте": "Pickup time",
  "Как можно скорее": "As soon as possible",
  "Через 15 минут": "In 15 minutes",
  "Через 30 минут": "In 30 minutes",
  "Через 45 минут": "In 45 minutes",
  "Комментарий": "Comment",
  "Оформить самовывоз": "Place pickup order",
  "НАСТОЯЩИЙ": "REAL",
  "ВКУС": "FLAVOUR",
  "наше простое правило": "our simple rule",
  "Еда должна": "Food should",
  "быть": "be",
  "честной.": "honest.",
  "Поэтому мы не экономим на ингредиентах, не прячем вкус за кучей специй и не готовим впрок. Просто делаем ту самую шаверму, за которой хочется вернуться.": "We never skimp on ingredients, hide flavours under too many spices or cook days in advance. Just the shawarma you will want to come back for.",
  "открыли первую": "opened our first",
  "точку": "location",
  "точек в городе": "locations in town",
  "и ещё растём": "and still growing",
  "вкусно,": "delicious,",
  "мы проверяли": "we checked",
  "ждём в гости": "come visit us",
  "Ближе, чем": "Closer than",
  "кажется": "you think",
  "ежедневно 10:00—23:00": "daily 10:00–23:00",
  "Адрес для примера": "Sample address",
  "Вкусно. Просто. По-настоящему.": "Tasty. Simple. The real deal.",
  "Демо от Axilium ↗": "Demo by Axilium ↗",
  "Вернуться в портфолио": "Back to portfolio",
  "ШАВЕРМА — на главную": "SHAWARMA — home",
  "Основная навигация": "Main navigation",
  "Открыть меню": "Open menu",
  "Аппетитная шаверма с овощами": "Delicious shawarma with vegetables",
  "Наши принципы": "Our principles",
  "Классическая шаверма": "Classic shawarma",
  "Острая шаверма": "Spicy shawarma",
  "Шаверма с сыром": "Shawarma with cheese",
  "Как к вам обращаться": "What should we call you?",
  "Например: без лука, добавить остроты": "For example: no onion, extra spicy",
  "Приготовление еды на кухне": "Food being prepared in a kitchen",
  "Посещаемость — демо Axilium": "Attendance — Axilium demo",
  "Демо · вымышленные данные": "Demo · fictional data",
  "Группы": "Groups",
  "Выберите группу для отметки": "Choose a group to mark attendance",
  "Группа": "Group",
  "Отметьте посещаемость": "Mark attendance",
  "Дата рождения": "Date of birth",
  "Тестовые данные не показаны": "Test contact details are hidden",
  "Отменить пометку": "Clear attendance mark",
  "Время ухода": "Departure time",
  "Во сколько ребёнок ушёл домой": "When the child went home",
  "Введите корректное время": "Enter a valid time",
  "Готово": "Done",
  "Пн": "Mon",
  "Вт": "Tue",
  "Ср": "Wed",
  "Чт": "Thu",
  "Пт": "Fri",
  "Сб": "Sat",
  "Вс": "Sun",
  "Демонстрация мобильного интерфейса учёта посещаемости на вымышленных данных.": "A mobile attendance interface demo with fictional data.",
  "Выбор группы": "Choose a group",
  "Посещаемость": "Attendance",
  "Назад к группам": "Back to groups",
  "Выбрать дату": "Choose date",
  "Поиск по имени…": "Search by name…",
  "Поиск ребёнка": "Search for a child",
  "Закрыть": "Close",
  "ЧЧ": "HH",
  "Часы": "Hours",
  "ММ": "MM",
  "Минуты": "Minutes",
  "Выбор даты": "Date picker",
  "Предыдущий месяц": "Previous month",
  "Следующий месяц": "Next month",
  "MealHub — демо": "MealHub — demo",
  "Код ↗": "Code ↗",
  "Меню, выдача и управление питанием. Выберите экран.": "Menus, serving and meal management. Choose a screen.",
  "Пользователь": "User",
  "Повар": "Chef",
  "Администратор": "Administrator",
  "Статическое демо оригинальных интерфейсов. Данные вымышлены, сервер не подключён.": "A static demo of the original interfaces. All data is fictional; no server is connected.",
  "MealHub — демо оригинальных интерфейсов пользователя, повара и администратора.": "MealHub demo: user, chef and administrator interfaces.",
  "Меню пользователя MealHub": "MealHub user menu",
  "Панель повара MealHub": "MealHub chef dashboard",
  "Панель администратора MealHub": "MealHub admin dashboard",
  "24 сент. 2026, чт": "24 Sep 2026, Thu",
  "Завтрак": "Breakfast",
  "Овсяная каша": "Oatmeal",
  "Аллергены:": "Allergens:",
  "Молоко": "Milk",
  "Обед": "Lunch",
  "Куриный суп": "Chicken soup",
  "Рис с овощами": "Rice with vegetables",
  "Без аллергенов": "No allergens",
  "Кошелёк": "Wallet",
  "Баланс:": "Balance:",
  "Пополнить": "Add funds",
  "История покупок": "Purchase history",
  "Завтрак · 08:30": "Breakfast · 08:30",
  "Настройки": "Settings",
  "Алексей": "Alexey",
  "Не выбраны": "None selected",
  "Добавить аллергены": "Add allergens",
  "Выйти из аккаунта": "Sign out",
  "Выберите аллергены": "Choose allergens",
  "Яйца": "Eggs",
  "Арахис": "Peanuts",
  "Орехи": "Tree nuts",
  "Рыба": "Fish",
  "Моллюски": "Molluscs",
  "Ракообразные": "Crustaceans",
  "Соя": "Soy",
  "Пшеница (глютен)": "Wheat (gluten)",
  "Сельдерей": "Celery",
  "Горчица": "Mustard",
  "Кунжут": "Sesame",
  "Люпин": "Lupin",
  "Сульфиты": "Sulphites",
  "Заказать": "Order",
  "(для дальнейшего получения на кассе)": "(for later pickup at the counter)",
  "Состав:": "Ingredients:",
  "Отзывы": "Reviews",
  "Оставить отзыв": "Leave a review",
  "Отмена": "Cancel",
  "Отправить": "Submit",
  "Оплата": "Payment",
  "Сумма": "Amount",
  "Оплатить": "Pay",
  "Месячный абонемент: 10000р": "Monthly meal plan: ₽10,000",
  "Все экраны ↗": "All screens ↗",
  "Фото профиля": "Profile photo",
  "Рейтинг 0,0 из 5": "Rating 0.0 out of 5",
  "5 звезд": "5 stars",
  "4 звезды": "4 stars",
  "3 звезды": "3 stars",
  "2 звезды": "2 stars",
  "1 звезда": "1 star",
  "Ваш отзыв...": "Your review...",
  "Введите сумму": "Enter amount",
  "MealHub - Меню повара": "MealHub — Chef menu",
  "Выдача и контроль блюд": "Serving and meal tracking",
  "Главная": "Home",
  "Заявки на закупку": "Purchase requests",
  "Остатки": "Stock",
  "Оплаты сегодня": "Payments today",
  "Посещения": "Visits",
  "1 учеников": "1 student",
  "0 позиций": "0 items",
  "Низкие остатки": "Low stock",
  "2 позиций": "2 items",
  "Приёмов пищи": "Meals",
  "Меню на день": "Daily menu",
  "Блюдо": "Dish",
  "Заказано": "Ordered",
  "Выдано": "Served",
  "Наличие": "Available",
  "Выдачи": "Serving",
  "Ваши заявки на закупку": "Your purchase requests",
  "Дата": "Date",
  "Товары": "Items",
  "Статус": "Status",
  "Уведомления": "Notifications",
  "Уведомлений нет": "No notifications",
  "Четверг,": "Thursday,",
  "870 порций": "870 portions",
  "1-е блюдо": "First course",
  "Каша гречневая": "Buckwheat porridge",
  "230/400 порций": "230/400 portions",
  "Сырники с джемом": "Cottage cheese pancakes with jam",
  "270/450 порций": "270/450 portions",
  "Чай чёрный": "Black tea",
  "370/500 порций": "370/500 portions",
  "920 порций": "920 portions",
  "Суп куриный": "Chicken soup",
  "280/400 порций": "280/400 portions",
  "2-е блюдо": "Main course",
  "Котлета с пюре": "Cutlet with mashed potatoes",
  "260/350 порций": "260/350 portions",
  "Напиток": "Drink",
  "Компот": "Compote",
  "380/520 порций": "380/520 portions",
  "Полдник": "Afternoon snack",
  "540 порций": "540 portions",
  "Перекус": "Snack",
  "Йогурт": "Yogurt",
  "180/240 порций": "180/240 portions",
  "Фрукт": "Fruit",
  "Яблоко": "Apple",
  "200/250 порций": "200/250 portions",
  "Морс": "Fruit drink",
  "160/220 порций": "160/220 portions",
  "Завтраков выдано: 130": "Breakfasts served: 130",
  "Обедов выдано: 200": "Lunches served: 200",
  "Перейти к остаткам": "Go to stock",
  "3 активные": "3 active",
  "124 завершенные": "124 completed",
  "Новая заявка": "New request",
  "История заявок": "Request history",
  "Создатель": "Created by",
  "Остатки по продуктам": "Product stock",
  "Продукт": "Product",
  "Остаток": "Remaining",
  "Курица": "Chicken",
  "15,00 кг": "15.00 kg",
  "Наличие достаточно": "In stock",
  "7,00 кг": "7.00 kg",
  "Осталось мало": "Low stock",
  "Овсяные хлопья": "Oat flakes",
  "8,00 кг": "8.00 kg",
  "Рис": "Rice",
  "14,00 кг": "14.00 kg",
  "Состав заявки": "Request items",
  "Выберите продукт и количество": "Choose a product and quantity",
  "Выберите продукт": "Choose a product",
  "Цена": "Price",
  "₽/кг": "₽/kg",
  "кг": "kg",
  "+ Добавить ещё продукт": "+ Add another product",
  "Отменить": "Cancel",
  "Отправить заявку": "Send request",
  "выйти из аккаунта": "sign out",
  "Аккаунт": "Account",
  "Выбор приёма пищи": "Choose a meal",
  "Дни недели": "Days of the week",
  "Переключение недели": "Switch week",
  "Предыдущая неделя": "Previous week",
  "Следующая неделя": "Next week",
  "Список приёмов пищи": "Meal list",
  "Сводка выдач": "Serving summary",
  "Продукты": "Products",
  "Удалить продукт": "Remove product",
  "MealHub - Меню админа": "MealHub — Admin menu",
  "Контроль питания учеников": "Student meal management",
  "Статистика": "Statistics",
  "Заказы": "Orders",
  "Отчёты": "Reports",
  "Динамика оплат, руб.": "Payment trend, RUB",
  "Динамика посещаемости, чел.": "Attendance trend, people",
  "Новые заявки на закупку": "New purchase requests",
  "Нет отзывов для этой даты": "No reviews for this date",
  "Аллергены": "Allergens",
  "Добавить": "Add",
  "Состав": "Ingredients",
  "Заявки, связанные с блюдом": "Requests related to this dish",
  "Молоко пастеризованное": "Pasteurised milk",
  "Крупа гречневая": "Buckwheat groats",
  "+ Добавить блюдо": "+ Add dish",
  "Время выдачи": "Serving time",
  "Добавить меню": "Add menu",
  "Сохранить все": "Save all",
  "9 заявок": "9 requests",
  "Выберите отчет": "Choose a report",
  "Отчёт по питанию": "Meal report",
  "Отчёт по затратам": "Cost report",
  "Далее": "Next",
  "Период": "Period",
  "День": "Day",
  "Неделя": "Week",
  "Месяц": "Month",
  "Сформировать": "Generate",
  "Назад к отчётам": "Back to reports",
  "Демонстрационный график": "Demo chart",
  "Тип приёма пищи": "Meal type",
  "Название блюда": "Dish name",
  "Вес (г)": "Weight (g)",
  "Ккал": "kcal",
  "Ингредиенты": "Ingredients",
  "Поиск": "Search",
  "Предыдущая дата": "Previous date",
  "Следующая дата": "Next date",
  "Тип отчёта": "Report type",
  "Общий отчёт": "Overview report",
  "Выбор периода": "Choose period",
  "Предыдущий период": "Previous period",
  "Следующий период": "Next period"
};
  const extra = {
    'Язык / Language': 'Language',
    'Демо: форма работает, но заказ и личные данные никуда не отправляются.': 'Demo: the form works, but no order or personal details are sent.',
    'Солнечная группа': 'Sunshine group',
    'Лесная группа': 'Forest group',
    'Облачная группа': 'Cloud group',
    'Аня Л.': 'Anya L.',
    'Миша К.': 'Misha K.',
    'София Р.': 'Sofia R.',
    'Лев Н.': 'Lev N.',
    'Даша М.': 'Dasha M.',
    'Тимур В.': 'Timur V.',
    'Полина А.': 'Polina A.',
    'Матвей Д.': 'Matvey D.',
    'Алиса П.': 'Alisa P.',
    'Марк С.': 'Mark S.',
    'Кира Б.': 'Kira B.',
    'Никита Т.': 'Nikita T.',
    'Варя Г.': 'Varya G.',
    'Егор Е.': 'Egor E.',
    'Присутствует': 'Present',
    'Отсутствует': 'Absent',
    'Никого не найдено': 'No children found',
    'Январь': 'January', 'Февраль': 'February', 'Март': 'March',
    'Апрель': 'April', 'Май': 'May', 'Июнь': 'June',
    'Июль': 'July', 'Август': 'August', 'Сентябрь': 'September',
    'Октябрь': 'October', 'Ноябрь': 'November', 'Декабрь': 'December',
    'Воскресенье': 'Sunday', 'Понедельник': 'Monday', 'Вторник': 'Tuesday',
    'Среда': 'Wednesday', 'Четверг': 'Thursday', 'Пятница': 'Friday',
    'Суббота': 'Saturday',
    'Овсяная каша: Молоко, Овсяные хлопья': 'Oatmeal: milk, oat flakes',
    'Куриный суп: Курица': 'Chicken soup: chicken',
    'Рис с овощами: Рис': 'Rice with vegetables: rice',
    'Овсяные хлопья, молоко и ягоды': 'Oat flakes, milk and berries',
    'Курица, картофель и овощи': 'Chicken, potatoes and vegetables',
    'Рис, морковь и зелень': 'Rice, carrots and herbs',
    'Получено': 'Collected',
    'Подтвердить получение': 'Confirm pickup',
    'Введите сумму больше нуля': 'Enter an amount greater than zero',
    'Демо: подписка не оформляется': 'Demo: subscriptions are not activated',
    'Демо: получение подтверждено': 'Demo: pickup confirmed',
    'Недостаточно средств на балансе': 'Insufficient balance',
    'Демо: заказ добавлен': 'Demo: order added',
    'Выберите оценку': 'Choose a rating',
    'Демо: отзыв добавлен': 'Demo: review added',
    'Демо: аллергены обновлены': 'Demo: allergens updated',
    'Демо: данные не отправляются': 'Demo: no data is sent',
    'Должно остаться хотя бы одно блюдо!': 'At least one dish must remain!',
    'Пожалуйста, заполните названия всех блюд!': 'Please enter a name for every dish!',
    'г': 'g',
    'ингредиент': 'ingredient',
    'аллерген': 'allergen'
  };
  Object.assign(dictionary, extra);

  function translate(value) {
    if (language !== 'en' || typeof value !== 'string') return value;
    const normalized = value.trim().replace(/\s+/g, ' ');
    let result = dictionary[normalized];
    if (!result) {
      let match;
      if ((match = normalized.match(/^(\d+) детей$/))) result = `${match[1]} children`;
      else if ((match = normalized.match(/^(Присутствуют|Ушли|Отсутствуют): (\d+)$/))) {
        result = `${{ 'Присутствуют': 'Present', 'Ушли': 'Left', 'Отсутствуют': 'Absent' }[match[1]]}: ${match[2]}`;
      } else if ((match = normalized.match(/^Ушёл в (.+)$/))) result = `Left at ${match[1]}`;
      else if ((match = normalized.match(/^(Информация|Указать время ухода|Отметить присутствие): (.+)$/))) {
        result = `${{ 'Информация': 'Information', 'Указать время ухода': 'Set departure time', 'Отметить присутствие': 'Mark present' }[match[1]]}: ${dictionary[match[2]] || match[2]}`;
      } else if ((match = normalized.match(/^(.+): ушёл в (.+)$/))) {
        result = `${dictionary[match[1]] || match[1]}: left at ${match[2]}`;
      } else if ((match = normalized.match(/^([А-Яа-яЁё]+) (\d{4})$/)) && dictionary[match[1]]) {
        result = `${dictionary[match[1]]} ${match[2]}`;
      } else if ((match = normalized.match(/^Рейтинг ([\d,]+) из 5$/))) {
        result = `Rating ${match[1].replace(',', '.')} out of 5`;
      } else if ((match = normalized.match(/^Демо: баланс пополнен на (.+)$/))) {
        result = `Demo: ${match[1]} added to your balance`;
      } else if ((match = normalized.match(/^Удалить (ингредиент|аллерген) (.+)$/))) {
        result = `Remove ${dictionary[match[1]]} ${dictionary[match[2]] || match[2]}`;
      } else if ((match = normalized.match(/^Блюдо (\d+)$/))) result = `Dish ${match[1]}`;
    }
    return result ? value.replace(/^(\s*)[\s\S]*?(\s*)$/, (_, before, after) => before + result + after) : value;
  }
  window.portfolioTranslate = translate;

  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.parentElement?.closest('script, style')) {
        const translated = translate(node.nodeValue);
        if (translated !== node.nodeValue) node.nodeValue = translated;
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.matches('script, style')) return;
    for (const name of ['alt', 'title', 'placeholder', 'aria-label', 'content']) {
      if (node.hasAttribute(name)) {
        const old = node.getAttribute(name);
        const translated = translate(old);
        if (translated !== old) node.setAttribute(name, translated);
      }
    }
    for (const child of node.childNodes) translateNode(child);
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (language === 'en') {
      document.querySelectorAll('img[data-preview-en]').forEach(image => {
        image.src = image.dataset.previewEn;
      });
    }
    if (language === 'en') {
      translateNode(document.head);
      translateNode(document.body);
      new MutationObserver(records => {
        for (const record of records) {
          if (record.type === 'characterData') translateNode(record.target);
          else if (record.type === 'attributes') translateNode(record.target);
          else for (const node of record.addedNodes) translateNode(node);
        }
      }).observe(document.body, {
        childList: true, characterData: true, subtree: true,
        attributes: true, attributeFilter: ['alt', 'title', 'placeholder', 'aria-label']
      });
      delete document.documentElement.dataset.i18nLoading;
    }
    const selector = document.getElementById('language-select');
    if (selector) {
      selector.value = language;
      selector.addEventListener('change', () => {
        try { localStorage.setItem(key, selector.value); } catch (_) { /* Keep current page usable. */ }
        location.reload();
      });
    }
  });
})();
