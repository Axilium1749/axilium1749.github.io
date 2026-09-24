(() => {
  "use strict";

  const groups = [
    {
      id: "sun", name: "Солнечная группа", icon: "☀️", tone: "amber",
      children: [
        { id: "s1", name: "Аня Л.", dob: "14.04.2021" },
        { id: "s2", name: "Миша К.", dob: "03.11.2020" },
        { id: "s3", name: "София Р.", dob: "22.07.2021" },
        { id: "s4", name: "Лев Н.", dob: "08.02.2021" },
        { id: "s5", name: "Даша М.", dob: "19.09.2020" },
        { id: "s6", name: "Тимур В.", dob: "27.05.2021" }
      ]
    },
    {
      id: "forest", name: "Лесная группа", icon: "🌿", tone: "emerald",
      children: [
        { id: "f1", name: "Полина А.", dob: "05.03.2020" },
        { id: "f2", name: "Матвей Д.", dob: "17.08.2020" },
        { id: "f3", name: "Алиса П.", dob: "12.12.2019" },
        { id: "f4", name: "Марк С.", dob: "30.06.2020" }
      ]
    },
    {
      id: "cloud", name: "Облачная группа", icon: "☁️", tone: "lavender",
      children: [
        { id: "c1", name: "Кира Б.", dob: "11.01.2019" },
        { id: "c2", name: "Никита Т.", dob: "21.10.2019" },
        { id: "c3", name: "Варя Г.", dob: "02.05.2019" },
        { id: "c4", name: "Егор Е.", dob: "16.07.2019" }
      ]
    }
  ];

  const icons = {
    plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5v14"/></svg>',
    clock: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3.5 2.5"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
  };

  const app = document.getElementById("app");
  const groupGrid = document.querySelector(".group-grid");
  const childrenList = document.querySelector(".children");
  const search = document.getElementById("child-search");
  const summary = document.querySelector(".att-summary");
  const childOverlay = document.getElementById("child-overlay");
  const timeOverlay = document.getElementById("time-overlay");
  const calBackdrop = document.getElementById("cal-backdrop");
  const calDropdown = document.getElementById("cal-dropdown");
  const calTrigger = document.getElementById("att-date-trigger");
  const calGrid = document.getElementById("cal-grid");
  const calMonth = document.getElementById("cal-month");
  const timeHh = document.getElementById("time-hh");
  const timeMm = document.getElementById("time-mm");
  const timeError = document.getElementById("time-error");
  const states = new Map(); // Only in memory; reloading the page resets the demo.
  const pad = value => String(value).padStart(2, "0");
  const localDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  };
  const today = localDate();
  let date = today;
  let group = null;
  let selectedChild = null;
  let calView = null;

  // Initial examples are invented and never read from the working service.
  states.set(`sun:${today}:s1`, { kind: "present" });
  states.set(`sun:${today}:s2`, { kind: "present" });
  states.set(`sun:${today}:s3`, { kind: "left", time: "16:20" });
  states.set(`forest:${today}:f1`, { kind: "present" });

  const key = child => `${group.id}:${date}:${child.id}`;
  const status = child => states.get(key(child)) || { kind: "absent" };
  const setStatus = (child, value) => {
    if (value.kind === "absent") states.delete(key(child));
    else states.set(key(child), value);
    renderChildren();
  };

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
      screen.classList.toggle("is-active", screen.id === id);
    });
    document.getElementById(id)?.querySelectorAll(".scroll").forEach(area => { area.scrollTop = 0; });
  }

  function renderGroups() {
    groupGrid.replaceChildren();
    groups.forEach(item => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "group-card";
      card.dataset.tone = item.tone;
      const icon = document.createElement("span");
      icon.className = "group-card__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.icon;
      const name = document.createElement("span");
      name.className = "group-card__name";
      name.textContent = item.name;
      const meta = document.createElement("span");
      meta.className = "group-card__meta";
      meta.textContent = `${item.children.length} детей`;
      card.append(icon, name, meta);
      card.addEventListener("click", () => {
        group = item;
        date = today;
        search.value = "";
        document.getElementById("group-title").textContent = item.name;
        updateDateLabel();
        renderChildren();
        showScreen("attendance-screen");
      });
      groupGrid.append(card);
    });
  }

  function updateDateLabel() {
    const [year, month, day] = date.split("-");
    document.getElementById("att-date-label").textContent = `${day}.${month}.${year}`;
  }

  function renderSummary() {
    if (!group) return;
    let present = 0;
    let left = 0;
    group.children.forEach(child => {
      const kind = status(child).kind;
      if (kind === "present") present++;
      if (kind === "left") left++;
    });
    const absent = group.children.length - present - left;
    summary.innerHTML = `
      <span class="att-summary__chip"><span class="att-summary__dot" style="background:var(--emerald)"></span>Присутствуют: ${present}</span>
      <span class="att-summary__chip"><span class="att-summary__dot" style="background:var(--violet)"></span>Ушли: ${left}</span>
      <span class="att-summary__chip"><span class="att-summary__dot" style="background:var(--rose)"></span>Отсутствуют: ${absent}</span>`;
  }

  function renderChildren() {
    if (!group) return;
    renderSummary();
    childrenList.replaceChildren();
    const query = search.value.trim().toLocaleLowerCase(document.documentElement.lang);
    const visible = group.children.filter(child =>
      (window.portfolioTranslate?.(child.name) || child.name).toLocaleLowerCase(document.documentElement.lang).includes(query));
    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "demo-empty";
      empty.textContent = "Никого не найдено";
      childrenList.append(empty);
      return;
    }
    visible.forEach(child => {
      const entry = status(child);
      const card = document.createElement("div");
      card.className = `child-card${entry.kind === "present" ? " is-present" : ""}${entry.kind === "left" ? " is-left" : ""}`;

      const infoButton = document.createElement("button");
      infoButton.type = "button";
      infoButton.className = "child-card__info-btn";
      infoButton.setAttribute("aria-label", `Информация: ${child.name}`);
      infoButton.innerHTML = icons.info;
      infoButton.addEventListener("click", () => openChild(child));

      const details = document.createElement("div");
      details.className = "child-card__info";
      const name = document.createElement("span");
      name.className = "child-card__name";
      name.textContent = child.name;
      const state = document.createElement("span");
      state.className = "child-card__status";
      const dot = document.createElement("span");
      dot.className = "dot";
      state.append(dot, document.createTextNode(entry.kind === "left" ? ` Ушёл в ${entry.time}` : entry.kind === "present" ? " Присутствует" : " Отсутствует"));
      details.append(name, state);

      const mark = document.createElement("button");
      mark.type = "button";
      mark.className = `mark-btn${entry.kind === "present" ? " is-marked" : ""}${entry.kind === "left" ? " is-done" : ""}`;
      mark.innerHTML = icons[entry.kind === "present" ? "clock" : entry.kind === "left" ? "check" : "plus"];
      mark.disabled = entry.kind === "left";
      mark.setAttribute("aria-label", entry.kind === "present" ? `Указать время ухода: ${child.name}` : entry.kind === "left" ? `${child.name}: ушёл в ${entry.time}` : `Отметить присутствие: ${child.name}`);
      mark.addEventListener("click", () => {
        if (entry.kind === "absent") setStatus(child, { kind: "present" });
        else if (entry.kind === "present") openTime(child);
      });
      card.append(infoButton, details, mark);
      childrenList.append(card);
    });
  }

  function openChild(child) {
    selectedChild = child;
    document.getElementById("overlay-name").textContent = child.name;
    document.getElementById("overlay-dob").textContent = child.dob;
    document.getElementById("overlay-cancel").disabled = status(child).kind === "absent";
    childOverlay.classList.add("is-open");
    childOverlay.setAttribute("aria-hidden", "false");
  }
  function closeChild() {
    childOverlay.classList.remove("is-open");
    childOverlay.setAttribute("aria-hidden", "true");
    selectedChild = null;
  }

  function openTime(child) {
    selectedChild = child;
    timeHh.value = "";
    timeMm.value = "";
    timeError.classList.remove("is-show");
    timeHh.classList.remove("is-error");
    timeMm.classList.remove("is-error");
    timeOverlay.classList.add("is-open");
    timeOverlay.setAttribute("aria-hidden", "false");
    timeHh.focus();
  }
  function closeTime() {
    timeOverlay.classList.remove("is-open");
    timeOverlay.setAttribute("aria-hidden", "true");
    selectedChild = null;
  }
  function saveTime() {
    const hh = Number(timeHh.value);
    const mm = Number(timeMm.value);
    const valid = /^\d{1,2}$/.test(timeHh.value) && /^\d{1,2}$/.test(timeMm.value) && hh <= 23 && mm <= 59;
    if (!valid) {
      timeError.classList.add("is-show");
      timeHh.classList.add("is-error");
      timeMm.classList.add("is-error");
      return;
    }
    const child = selectedChild;
    closeTime();
    setStatus(child, { kind: "left", time: `${pad(hh)}:${pad(mm)}` });
  }

  const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  function renderCalendar() {
    const { year, month } = calView;
    calMonth.textContent = `${months[month - 1]} ${year}`;
    calGrid.replaceChildren();
    const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7;
    const days = new Date(year, month, 0).getDate();
    for (let i = 0; i < offset; i++) {
      const space = document.createElement("span");
      space.className = "cal__empty";
      calGrid.append(space);
    }
    for (let day = 1; day <= days; day++) {
      const value = `${year}-${pad(month)}-${pad(day)}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = `cal__day${value === today ? " is-today" : ""}${value === date ? " is-selected" : ""}`;
      button.textContent = String(day);
      button.addEventListener("click", () => {
        date = value;
        updateDateLabel();
        closeCalendar();
        renderChildren();
      });
      calGrid.append(button);
    }
  }
  function positionCalendar() {
    const appRect = app.getBoundingClientRect();
    const triggerRect = calTrigger.getBoundingClientRect();
    const width = calDropdown.offsetWidth;
    const height = calDropdown.offsetHeight;
    const left = Math.max(12, Math.min(triggerRect.left - appRect.left, app.clientWidth - width - 12));
    const below = triggerRect.bottom - appRect.top + 8;
    const above = triggerRect.top - appRect.top - height - 8;
    calDropdown.style.left = `${left}px`;
    calDropdown.style.top = `${below + height <= app.clientHeight - 12 || above < 12 ? below : above}px`;
  }
  function openCalendar() {
    const [year, month] = date.split("-").map(Number);
    calView = { year, month };
    renderCalendar();
    calBackdrop.classList.add("is-open");
    calDropdown.classList.add("is-open");
    calBackdrop.setAttribute("aria-hidden", "false");
    calDropdown.setAttribute("aria-hidden", "false");
    requestAnimationFrame(positionCalendar);
  }
  function closeCalendar() {
    calBackdrop.classList.remove("is-open");
    calDropdown.classList.remove("is-open");
    calBackdrop.setAttribute("aria-hidden", "true");
    calDropdown.setAttribute("aria-hidden", "true");
  }
  function stepMonth(delta) {
    const next = new Date(calView.year, calView.month - 1 + delta, 1);
    calView = { year: next.getFullYear(), month: next.getMonth() + 1 };
    renderCalendar();
    positionCalendar();
  }

  document.getElementById("back-to-groups").addEventListener("click", () => { closeCalendar(); showScreen("group-screen"); });
  search.addEventListener("input", renderChildren);
  document.querySelectorAll("[data-child-close]").forEach(el => el.addEventListener("click", closeChild));
  document.getElementById("overlay-cancel").addEventListener("click", () => {
    const child = selectedChild;
    closeChild();
    setStatus(child, { kind: "absent" });
  });
  document.querySelectorAll("[data-time-close]").forEach(el => el.addEventListener("click", closeTime));
  [timeHh, timeMm].forEach((field, index) => {
    field.addEventListener("input", () => {
      field.value = field.value.replace(/\D/g, "").slice(0, 2);
      timeError.classList.remove("is-show");
      field.classList.remove("is-error");
      if (index === 0 && field.value.length === 2) timeMm.focus();
    });
    field.addEventListener("keydown", event => { if (event.key === "Enter") saveTime(); });
  });
  document.getElementById("time-done").addEventListener("click", saveTime);
  calTrigger.addEventListener("click", openCalendar);
  calBackdrop.addEventListener("click", closeCalendar);
  document.getElementById("cal-prev").addEventListener("click", () => stepMonth(-1));
  document.getElementById("cal-next").addEventListener("click", () => stepMonth(1));
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (timeOverlay.classList.contains("is-open")) closeTime();
    else if (childOverlay.classList.contains("is-open")) closeChild();
    else closeCalendar();
  });

  renderGroups();
  updateDateLabel();
  if (new URLSearchParams(window.location.search).get("preview") === "attendance") {
    groupGrid.querySelector("button")?.click();
  }
})();
