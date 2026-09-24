// UI-only actions for the static portfolio demo. No requests or persistent data.
document.addEventListener('DOMContentLoaded', () => {
  const toast = document.createElement('div');
  toast.className = 'demo-toast';
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  // Every form in this published demo is local only.
  document.addEventListener('submit', event => event.preventDefault());
  document.querySelectorAll('.footer_container[data-view], .admin_nav_button[data-view], [data-open-view]')
    .forEach(button => button.addEventListener('click', () => document.body.classList.add('demo-interacted')));

  if (document.body.classList.contains('demo-menu')) {
    const page = document.querySelector('.menu_page');
    const balanceEls = document.querySelectorAll('.balance_money, .st_balance');
    let balance = 1250;
    const formatMoney = value => `${value.toFixed(2).replace('.', ',')}₽`;
    const updateBalance = () => balanceEls.forEach(el => { el.textContent = formatMoney(balance); });

    document.querySelector('.payment-card')?.addEventListener('submit', event => {
      const input = event.currentTarget.querySelector('#paymentAmount');
      const amount = Number(input?.value);
      if (!Number.isFinite(amount) || amount <= 0) { showToast('Введите сумму больше нуля'); return; }
      balance += amount;
      updateBalance();
      input.value = '';
      document.querySelector('#paymentOverlay')?.classList.remove('active');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      showToast(`Демо: баланс пополнен на ${formatMoney(amount)}`);
    });
    document.querySelector('.payment-subscribe')?.addEventListener('click', () => showToast('Демо: подписка не оформляется'));

    document.querySelector('#order-form')?.addEventListener('submit', event => {
      const selected = document.querySelector('.openSheet[data-item="' + event.currentTarget.querySelector('#itemDateField2')?.value + '"]');
      const button = event.currentTarget.querySelector('.sheet_order_btn');
      if (button?.disabled) return;
      const status = selected?.dataset.orderStatus || '';
      if (status === 'ordered') {
        selected.dataset.orderStatus = 'confirmed';
        window.applyOrderButtonState?.('confirmed');
        showToast('Демо: получение подтверждено');
        return;
      }
      const price = Number(selected?.dataset.price || 0);
      if (price > balance) { showToast('Недостаточно средств на балансе'); return; }
      balance -= price;
      updateBalance();
      if (selected) selected.dataset.orderStatus = 'ordered';
      window.applyOrderButtonState?.('ordered');
      showToast('Демо: заказ добавлен');
    });

    const reviewList = document.querySelector('#reviews-container');
    const reviews = new Map();
    const ratingOverlay = document.querySelector('#sheetRatingOverlay');
    document.querySelector('#openOverlay')?.addEventListener('click', event => {
      event.preventDefault();
      const item = document.querySelector('#itemDateField6')?.value;
      reviewList.querySelectorAll('.demo-review').forEach(node => node.remove());
      for (const review of reviews.get(item) || []) {
        const row = document.createElement('div');
        row.className = 'demo-review';
        const stars = document.createElement('strong');
        stars.textContent = `${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}  `;
        const text = document.createElement('span');
        text.textContent = review.text;
        row.append(stars, text);
        reviewList.appendChild(row);
      }
      ratingOverlay.style.display = 'flex';
    });
    const closeReviews = () => { ratingOverlay.style.display = 'none'; };
    document.querySelector('#closeOverlay')?.addEventListener('click', closeReviews);
    document.querySelector('.sheet-rating-backdrop')?.addEventListener('click', closeReviews);
    document.querySelector('#star-rating')?.addEventListener('change', event => {
      document.querySelector('#rating-value').textContent = `${event.target.value}/5`;
    });
    document.querySelector('#review-form')?.addEventListener('submit', event => {
      const form = event.currentTarget;
      const stars = Number(form.querySelector('input[name="stars_count"]:checked')?.value);
      const text = form.querySelector('textarea')?.value.trim();
      if (!stars) { showToast('Выберите оценку'); return; }
      if (!text) return;
      const item = form.querySelector('#itemCategoryField')?.value;
      const list = reviews.get(item) || [];
      list.push({ stars, text });
      reviews.set(item, list);
      const avg = list.reduce((sum, entry) => sum + entry.stars, 0) / list.length;
      const card = document.querySelector(`.openSheet[data-item="${item}"]`);
      if (card) card.dataset.ratingAvg = String(avg);
      window.setRating?.(avg);
      window.closeRate?.();
      form.reset();
      document.querySelector('#rating-value').textContent = '0/5';
      showToast('Демо: отзыв добавлен');
    });

    document.querySelector('#allergens-form')?.addEventListener('submit', event => {
      const checked = [...event.currentTarget.querySelectorAll('input[type="checkbox"]:checked')];
      const names = checked.map(input => input.closest('label')?.querySelector('span')?.textContent.trim()).filter(Boolean);
      const list = document.querySelector('.account_info_box ul');
      if (list) {
        list.replaceChildren();
        for (const name of names.length ? names : ['Не выбраны']) {
          const li = document.createElement('li');
          li.textContent = name;
          list.appendChild(li);
        }
      }
      page.dataset.userAllergens = names.join('||');
      const settings = document.querySelector('.settings_main');
      const allergens = document.querySelector('.allergens_main');
      settings?.classList.remove('is-exit-left');
      settings?.classList.add('is-active');
      settings.style.transform = 'translateX(0)';
      allergens?.classList.remove('is-active');
      allergens.style.transform = 'translateX(100%)';
      showToast('Демо: аллергены обновлены');
    });
  }

  if (document.body.classList.contains('demo-dashboard')) {
    document.querySelectorAll('.issue-btn, .return-btn').forEach(button => {
      button.addEventListener('click', () => {
        const row = button.closest('.day_menu_row');
        const issued = row?.querySelector('.issued-count');
        const available = row?.querySelector('.available-count');
        if (!issued || !available) return;
        const delta = button.classList.contains('return-btn') ? -1 : Number(button.dataset.amount || 1);
        const next = Math.max(0, Number(issued.textContent) + delta);
        const change = next - Number(issued.textContent);
        issued.textContent = String(next);
        available.textContent = String(Math.max(0, Number(available.textContent) - change));
        issued.classList.add('updated');
        available.classList.add('updated');
        setTimeout(() => { issued.classList.remove('updated'); available.classList.remove('updated'); }, 500);
      });
    });

    const reportType = document.querySelectorAll('.reports_picker_input');
    const next = document.querySelector('.reports_next');
    reportType.forEach(input => input.addEventListener('change', () => { next.disabled = false; }));
    next?.addEventListener('click', () => {
      const selected = document.querySelector('.reports_picker_input:checked')?.value;
      if (!selected) return;
      document.querySelectorAll('.reports_panel').forEach(panel => panel.classList.toggle('reports_panel--active', panel.dataset.stage === selected));
    });
    document.querySelectorAll('.reports_back').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.reports_panel').forEach(panel => panel.classList.toggle('reports_panel--active', panel.dataset.stage === 'select'));
    }));
    document.querySelectorAll('.reports_form, #chefOrderForm, .menu_configurator_form').forEach(form => {
      form.addEventListener('submit', () => showToast('Демо: данные не отправляются'));
    });

    const datebar = document.querySelector('[data-role="datebar"]');
    if (datebar) {
      let weekStart = new Date(2026, 8, 21);
      const weekdayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const shortDate = day => `${String(day.getDate()).padStart(2, '0')}.${String(day.getMonth() + 1).padStart(2, '0')}`;
      const renderWeek = activeIndex => {
        datebar.querySelectorAll('.chef_serving_day').forEach((button, index) => {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + index);
          button.dataset.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          button.classList.toggle('is-active', index === activeIndex);
        });
        const current = new Date(weekStart);
        current.setDate(current.getDate() + activeIndex);
        datebar.querySelector('[data-role="date-display"]').textContent = `${shortDate(current)}.${current.getFullYear()}`;
        datebar.querySelector('.chef_serving_date_label').textContent = `${weekdayNames[current.getDay()]},`;
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 4);
        datebar.querySelector('[data-role="week-label"]').textContent = `${shortDate(weekStart)} - ${shortDate(end)}`;
      };
      datebar.querySelectorAll('.chef_serving_day').forEach((button, index) => button.addEventListener('click', () => renderWeek(index)));
      datebar.querySelectorAll('.chef_serving_week_btn').forEach((button, index) => button.addEventListener('click', () => {
        weekStart.setDate(weekStart.getDate() + (index === 0 ? -7 : 7));
        renderWeek(0);
      }));
    }

    const statsGraphs = [
      ['stats_paymentDynamics', 'display-stats-pay', 'prev-btn-so', 'next-btn-so', [72, 96, 84, 125, 112, 151, 174]],
      ['stats_customersTraffic', 'display-stats-comes', 'prev-btn-sc', 'next-btn-sc', [90, 104, 95, 138, 129, 160, 147]],
    ];
    const svgNS = 'http://www.w3.org/2000/svg';
    for (const [id, labelId, previousId, nextId, values] of statsGraphs) {
      const canvas = document.getElementById(id);
      if (!canvas) continue;
      let offset = 0;
      const svg = document.createElementNS(svgNS, 'svg');
      svg.classList.add('demo-chart');
      svg.setAttribute('viewBox', '0 0 360 190');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.setAttribute('aria-label', 'Демонстрационный график');
      canvas.replaceWith(svg);
      const render = () => {
        const monday = new Date(2026, 8, 21 + offset * 7);
        const sunday = new Date(2026, 8, 27 + offset * 7);
        const short = day => `${String(day.getDate()).padStart(2, '0')}.${String(day.getMonth() + 1).padStart(2, '0')}`;
        document.getElementById(labelId).textContent = `${short(monday)} - ${short(sunday)}`;
        svg.replaceChildren();
        for (const y of [35, 75, 115, 155]) {
          const line = document.createElementNS(svgNS, 'path');
          line.setAttribute('d', `M0 ${y}H360`);
          line.setAttribute('stroke', '#e8eef5');
          svg.appendChild(line);
        }
        const polyline = document.createElementNS(svgNS, 'polyline');
        polyline.setAttribute('points', values.map((value, index) => `${8 + index * 56},${180 - Math.max(25, Math.min(160, value + Math.sin(offset * 2 + index) * 18))}`).join(' '));
        polyline.setAttribute('fill', 'none');
        polyline.setAttribute('stroke', '#3098ef');
        polyline.setAttribute('stroke-width', '4');
        polyline.setAttribute('stroke-linecap', 'round');
        polyline.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(polyline);
      };
      document.getElementById(previousId)?.addEventListener('click', () => { offset--; render(); });
      document.getElementById(nextId)?.addEventListener('click', () => { offset++; render(); });
      document.querySelector('.admin_nav_button[data-view="admin_stats"]')?.addEventListener('click', () => requestAnimationFrame(render));
      render();
    }
    const reviewLabel = document.getElementById('display-stats-reviews');
    if (reviewLabel) {
      let reviewOffset = 0;
      const empty = document.getElementById('sheet-review-empty');
      if (empty) empty.style.display = '';
      const renderReviewWeek = () => {
        const monday = new Date(2026, 8, 21 + reviewOffset * 7);
        const sunday = new Date(2026, 8, 27 + reviewOffset * 7);
        const short = day => `${String(day.getDate()).padStart(2, '0')}.${String(day.getMonth() + 1).padStart(2, '0')}`;
        reviewLabel.textContent = `${short(monday)} - ${short(sunday)}`;
      };
      document.getElementById('review-next-btn')?.addEventListener('click', () => { reviewOffset--; renderReviewWeek(); });
      document.getElementById('review-before-btn')?.addEventListener('click', () => { reviewOffset++; renderReviewWeek(); });
      renderReviewWeek();
    }
  }
});
