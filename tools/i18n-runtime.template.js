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

  const dictionary = /* DICTIONARY */ {};
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
