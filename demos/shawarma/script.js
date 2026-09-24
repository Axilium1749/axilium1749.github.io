const menuButton = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');

menuButton.addEventListener('click', () => {
  header.classList.toggle('mobile-open');
  menuButton.textContent = header.classList.contains('mobile-open') ? '×' : '☰';
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('mobile-open');
    menuButton.textContent = '☰';
  });
});

const orderForm = document.querySelector('#order-form');
const orderProduct = document.querySelector('#order-product');
const formStatus = document.querySelector('#form-status');

document.querySelectorAll('.order-product').forEach((button) => {
  button.addEventListener('click', () => {
    orderProduct.value = button.dataset.product;
    document.querySelector('#order').scrollIntoView({ behavior: 'smooth', block: 'start' });
    orderForm.querySelector('[name="name"]').focus({ preventScroll: true });
  });
});

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = 'Демо: форма работает, но заказ и личные данные никуда не отправляются.';
  formStatus.className = 'form-status success';
  orderForm.reset();
});
