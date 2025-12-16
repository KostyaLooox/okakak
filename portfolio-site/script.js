const slides = document.querySelector('.slides');
const prev = document.getElementById('prev');
const next = document.getElementById('next');

let index = 0;
const total = slides.children.length;
const slideWidth = 300; // ширина слайда

slides.style.width = `${total * slideWidth}px`;

next.addEventListener('click', () => {
  index = (index + 1) % total;
  slides.style.transform = `translateX(-${index * slideWidth}px)`;
});

prev.addEventListener('click', () => {
  index = (index - 1 + total) % total;
  slides.style.transform = `translateX(-${index * slideWidth}px)`;
});
