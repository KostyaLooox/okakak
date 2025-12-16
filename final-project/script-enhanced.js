// Данные проектов
const projects = [
  {
    id: 1,
    title: "Веб-портфолио",
    image: "photo/raboti/1cc0924b6ad34a158732c30e80ec5f72jajNDANsQQiqpvq8-0.jpg",
    tech: ["web", "ui"],
    difficulty: "intermediate",
    year: "2024",
    description: "Адаптивный сайт-портфолио"
  },
  {
    id: 2,
    title: "3D Модель здания",
    image: "photo/raboti/1cc0924b6ad34a158732c30e80ec5f72jajNDANsQQiqpvq8-2.jpg",
    tech: ["3d"],
    difficulty: "advanced",
    year: "2024",
    description: "Детализированная архитектурная модель"
  },
  {
    id: 3,
    title: "Брендинг кафе",
    image: "photo/raboti/dd088aa7d5084c78d7166e759ca9b855faAT1LNAKXBCNNKX-0.jpg",
    tech: ["brand", "ui"],
    difficulty: "intermediate",
    year: "2023",
    description: "Логотип и фирменный стиль"
  },
  {
    id: 4,
    title: "Игровой интерфейс",
    image: "photo/raboti/dd088aa7d5084c78d7166e759ca9b855faAT1LNAKXBCNNKX-2.jpg",
    tech: ["game", "ui"],
    difficulty: "advanced",
    year: "2025",
    description: "UI для мобильной игры"
  },
  {
    id: 5,
    title: "Концепт сайта",
    image: "photo/raboti/Frame%204.png",
    tech: ["web", "ui"],
    difficulty: "beginner",
    year: "2023",
    description: "Дизайн-концепт для стартапа"
  },
  {
    id: 6,
    title: "Абстрактная композиция",
    image: "photo/raboti/Frame%206.png",
    tech: ["3d", "brand"],
    difficulty: "absurd",
    year: "2025",
    description: "Экспериментальная 3D работа"
  },
  {
    id: 7,
    title: "Мобильное приложение",
    image: "photo/raboti/photo_2025-07-28_21-15-24.jpg",
    tech: ["ui", "web"],
    difficulty: "intermediate",
    year: "2024",
    description: "Прототип FinTech приложения"
  },
  {
    id: 8,
    title: "Игровой персонаж",
    image: "photo/raboti/photo_2025-07-28_21-15-33.jpg",
    tech: ["3d", "game"],
    difficulty: "advanced",
    year: "2025",
    description: "Low-poly модель для игры"
  },
  {
    id: 9,
    title: "Плакаты",
    image: "photo/raboti/photo_2025-07-28_21-15-36.jpg",
    tech: ["brand"],
    difficulty: "beginner",
    year: "2023",
    description: "Серия графических плакатов"
  },
  {
    id: 10,
    title: "Сюрреалистичный арт",
    image: "photo/raboti/photo_2025-07-28_21-15-38.jpg",
    tech: ["3d", "brand"],
    difficulty: "absurd",
    year: "2025",
    description: "Смешение реальности и абсурда"
  }
];

// Состояние фильтров
let filters = {
  tech: "all",
  difficulty: "all",
  year: "all"
};

// Загрузка фильтров из LocalStorage
function loadFilters() {
  const saved = localStorage.getItem('portfolioFilters');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      filters = { ...filters, ...parsed };
    } catch (e) {
      console.log('Не удалось загрузить фильтры');
    }
  }
}

// Сохранение фильтров в LocalStorage
function saveFilters() {
  localStorage.setItem('portfolioFilters', JSON.stringify(filters));
}

// Инициализация фильтров
function initFilters() {
  loadFilters();
  
  // Установка активных кнопок
  Object.keys(filters).forEach(type => {
    const value = filters[type];
    const btn = document.querySelector(`.filter-btn[data-type="${type}"][data-value="${value}"]`);
    if (btn) btn.classList.add('active');
  });
  
  // Обработчики для кнопок фильтров
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const value = btn.dataset.value;
      
      // Снимаем активный класс со всех кнопок этого типа
      document.querySelectorAll(`.filter-btn[data-type="${type}"]`).forEach(b => {
        b.classList.remove('active');
      });
      
      // Добавляем активный класс нажатой кнопке
      btn.classList.add('active');
      
      // Обновляем фильтры
      filters[type] = value;
      saveFilters();
      filterProjects();
      updateFilterStatus();
    });
  });
  
  // Кнопка сброса фильтров
  document.getElementById('reset-filters').addEventListener('click', () => {
    filters = { tech: "all", difficulty: "all", year: "all" };
    saveFilters();
    
    // Сбрасываем все кнопки
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.value === 'all') {
        btn.classList.add('active');
      }
    });
    
    filterProjects();
    updateFilterStatus();
  });
}

// Фильтрация проектов
function filterProjects() {
  const projects = document.querySelectorAll('.project-card');
  let visibleCount = 0;
  
  projects.forEach(project => {
    const tech = project.dataset.tech.split(',');
    const difficulty = project.dataset.difficulty;
    const year = project.dataset.year;
    
    let matches = true;
    
    // Проверка технологии
    if (filters.tech !== 'all' && !tech.includes(filters.tech)) {
      matches = false;
    }
    
    // Проверка сложности
    if (filters.difficulty !== 'all' && difficulty !== filters.difficulty) {
      matches = false;
    }
    
    // Проверка года
    if (filters.year !== 'all' && year !== filters.year) {
      matches = false;
    }
    
    if (matches) {
      project.classList.remove('hidden');
      visibleCount++;
    } else {
      project.classList.add('hidden');
    }
  });
  
  // Обновляем счетчик
  document.getElementById('project-count').textContent = visibleCount;
}

// Обновление статуса фильтров
function updateFilterStatus() {
  const activeFilters = [];
  
  if (filters.tech !== 'all') {
    const techNames = {
      web: 'Веб-дизайн',
      '3d': '3D Моделирование',
      ui: 'UI/UX',
      game: 'Геймдизайн',
      brand: 'Брендинг'
    };
    activeFilters.push(techNames[filters.tech] || filters.tech);
  }
  
  if (filters.difficulty !== 'all') {
    const diffNames = {
      beginner: 'Начинающий',
      intermediate: 'Средняя',
      advanced: 'Продвинутый',
      absurd: 'Абсурдная'
    };
    activeFilters.push(diffNames[filters.difficulty] || filters.difficulty);
  }
  
  if (filters.year !== 'all') {
    activeFilters.push(filters.year);
  }
  
  const statusElement = document.getElementById('active-filters');
  if (activeFilters.length > 0) {
    statusElement.textContent = activeFilters.join(', ');
    statusElement.style.fontWeight = 'bold';
  } else {
    statusElement.textContent = 'все работы';
    statusElement.style.fontWeight = 'normal';
  }
}

// Создание карточек проектов
function renderProjects() {
  const container = document.getElementById('projects-container');
  container.innerHTML = '';
  
  projects.forEach((project, index) => {
    const cardAngle = (index % 5) - 2; // От -2 до 2 градусов
    
    const techNames = {
      web: 'Веб',
      '3d': '3D',
      ui: 'UI/UX',
      game: 'Игры',
      brand: 'Бренд'
    };
    
    const diffNames = {
      beginner: 'Начинающий',
      intermediate: 'Средняя',
      advanced: 'Продвинутый',
      absurd: 'Абсурд'
    };
    
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.tech = project.tech.join(',');
    card.dataset.difficulty = project.difficulty;
    card.dataset.year = project.year;
    card.style.setProperty('--card-angle', cardAngle);
    
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/200x120?text=Project+${project.id}'">
      </div>
      <div class="project-info">
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tech.map(t => `<span class="project-tag">${techNames[t]}</span>`).join('')}
          <span class="project-tag">${diffNames[project.difficulty]}</span>
          <span class="project-tag">${project.year}</span>
        </div>
      </div>
    `;
    
    container.appendChild(card);
  });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  renderProjects();
  initFilters();
  filterProjects();
  updateFilterStatus();
  
  // Добавляем случайный угол для блоков при загрузке
  document.querySelectorAll('.chaotic').forEach(el => {
    const currentAngle = parseInt(el.style.getPropertyValue('--angle') || el.style.transform.match(/-?\d+/)?.[0] || 0);
    const randomOffset = (Math.random() * 2) - 1; // -1 до 1
    el.style.setProperty('--angle', currentAngle + randomOffset);
  });
});