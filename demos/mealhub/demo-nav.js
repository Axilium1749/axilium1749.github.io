document.addEventListener('submit', (event) => event.preventDefault());

document.querySelectorAll('.footer_container[data-view], .admin_nav_button[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    const name = button.dataset.view;
    const viewClass = document.body.classList.contains('demo-menu') ? 'app_view' : 'menu_app_view';
    const activeClass = `${viewClass}--active`;
    const target = [...document.querySelectorAll(`.${viewClass}[data-view]`)]
      .find((view) => view.dataset.view === name);
    if (!target) return;
    document.querySelectorAll(`.${viewClass}`).forEach((view) => view.classList.remove(activeClass));
    target.classList.add(activeClass);
    document.querySelectorAll('.footer_container, .admin_nav_button').forEach((item) => item.classList.remove('demo-active'));
    button.classList.add('demo-active');
  });
});
