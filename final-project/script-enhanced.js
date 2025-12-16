// Основные переменные
let projects = [];
let activeFilters = {
    type: 'all',
    year: 'all',
    status: 'all'
};
let sortBy = 'default';
let viewMode = 'grid';

// Данные проектов (32 проекта)
const projectsData = [
    // Веб проекты
    { id: 1, type: 'web', year: '2023', status: 'completed', title: 'Абсурдный Сайт', 
      description: 'Сайт, который нарушает все правила UX', tags: ['HTML', 'CSS', 'JS'], color: '#e0f7fa' },
    { id: 2, type: 'web', year: '2024', status: 'completed', title: 'Минималистичный Хаос', 
      description: 'Чистый дизайн с хаотичной навигацией', tags: ['Figma', 'React'], color: '#bbdefb' },
    { id: 3, type: 'web', year: '2024', status: 'progress', title: 'Интерфейс Будущего', 
      description: 'То, что будет через 100 лет. Или нет.', tags: ['Figma', 'Прототип'], color: '#90caf9' },
    { id: 4, type: 'web', year: '2025', status: 'absurd', title: 'Глитч-Портал', 
      description: 'Портал в другую реальность с багами', tags: ['GSAP', 'Canvas'], color: '#64b5f6' },
    { id: 5, type: 'web', year: '2025', status: 'completed', title: 'Черно-Белое', 
      description: 'Только два цвета. Больше не нужно.', tags: ['HTML', 'CSS'], color: '#42a5f5' },
    { id: 6, type: 'web', year: '2023', status: 'completed', title: 'Текст как Искусство', 
      description: 'Верстка, где текст — главный элемент', tags: ['Typography'], color: '#2196f3' },
    { id: 7, type: 'web', year: '2024', status: 'progress', title: 'Адаптивный Абсурд', 
      description: 'Сайт, который ломается на каждом устройстве по-своему', tags: ['Responsive'], color: '#1e88e5' },
    { id: 8, type: 'web', year: '2025', status: 'absurd', title: 'Без JavaScript', 
      description: 'Сайт, который работает без JS. Шокирует.', tags: ['HTML', 'CSS'], color: '#1976d2' },
    
    // 3D проекты
    { id: 9, type: '3d', year: '2023', status: 'completed', title: 'Сломанный Куб', 
      description: 'Куб, который не хочет быть кубом', tags: ['Blender'], color: '#f3e5f5' },
    { id: 10, type: '3d', year: '2024', status: 'completed', title: 'Абстрактная Форма', 
      description: 'Форма без названия и назначения', tags: ['Blender', 'Sculpt'], color: '#e1bee7' },
    { id: 11, type: '3d', year: '2024', status: 'progress', title: 'Цифровая Скульптура', 
      description: 'Статуя из нулей и единиц', tags: ['ZBrush'], color: '#ce93d8' },
    { id: 12, type: '3d', year: '2025', status: 'absurd', title: 'Невозможный Объект', 
      description: 'Объект, который не может существовать', tags: ['Blender', 'Physics'], color: '#ba68c8' },
    { id: 13, type: '3d', year: '2023', status: 'completed', title: 'Low Poly Мир', 
      description: 'Мир с минимальным количеством полигонов', tags: ['Blender'], color: '#ab47bc' },
    { id: 14, type: '3d', year: '2024', status: 'progress', title: 'Анимация Хаоса', 
      description: 'Все движется, но непонятно куда', tags: ['Animation'], color: '#9c27b0' },
    { id: 15, type: '3d', year: '2025', status: 'absurd', title: 'Сюрреалистичная Сцена', 
      description: 'Сон, записанный в 3D', tags: ['Blender', 'Compositing'], color: '#8e24aa' },
    { id: 16, type: '3d', year: '2025', status: 'completed', title: 'Геометрический Беспорядок', 
      description: 'Геометрия, вышедшая из-под контроля', tags: ['Geometry Nodes'], color: '#7b1fa2' },
    
    // Игры
    { id: 17, type: 'game', year: '2023', status: 'completed', title: 'Платформер с Багами', 
      description: 'Игра, где баги — это фича', tags: ['Unity'], color: '#fff3e0' },
    { id: 18, type: 'game', year: '2024', status: 'completed', title: 'Головоломка без Решения', 
      description: 'Нельзя пройти. И это нормально.', tags: ['Unity', 'C#'], color: '#ffe0b2' },
    { id: 19, type: 'game', year: '2024', status: 'progress', title: 'Хаос-Симулятор', 
      description: 'Симулятор беспорядка в цифровом мире', tags: ['Unity'], color: '#ffcc80' },
    { id: 20, type: 'game', year: '2025', status: 'absurd', title: 'Игра в Одну Кнопку', 
      description: 'Одна кнопка. Миллион возможностей.', tags: ['HTML5'], color: '#ffb74d' },
    { id: 21, type: 'game', year: '2023', status: 'completed', title: 'Текстовая Приключение', 
      description: 'Приключение в мире чистого текста', tags: ['JavaScript'], color: '#ffa726' },
    { id: 22, type: 'game', year: '2024', status: 'progress', title: 'Минималистичный Шутер', 
      description: 'Только точки и линии. И стрельба.', tags: ['Unity'], color: '#ff9800' },
    { id: 23, type: 'game', year: '2025', status: 'absurd', title: 'Игра без Цели', 
      description: 'Просто существуй. Или не существуй.', tags: ['Experimental'], color: '#fb8c00' },
    { id: 24, type: 'game', year: '2025', status: 'completed', title: 'Ретро-Хаос', 
      description: '8-битный беспорядок', tags: ['Pixel Art'], color: '#f57c00' },
    
    // Дизайн
    { id: 25, type: 'design', year: '2023', status: 'completed', title: 'Абсурдный Логотип', 
      description: 'Логотип, который никому не нравится', tags: ['Illustrator'], color: '#e8f5e9' },
    { id: 26, type: 'design', year: '2024', status: 'completed', title: 'Шрифт "Хаос"', 
      description: 'Каждая буква уникальна и неправильна', tags: ['Font Design'], color: '#c8e6c9' },
    { id: 27, type: 'design', year: '2024', status: 'progress', title: 'Айдентика Беспорядка', 
      description: 'Фирменный стиль для несуществующей компании', tags: ['Branding'], color: '#a5d6a7' },
    { id: 28, type: 'design', year: '2025', status: 'absurd', title: 'Плакат без Смысла', 
      description: 'Красиво, но зачем?', tags: ['Poster'], color: '#81c784' },
    { id: 29, type: 'design', year: '2023', status: 'completed', title: 'Упаковка Ничего', 
      description: 'Красивая коробка. Внутри пустота.', tags: ['Packaging'], color: '#66bb6a' },
    { id: 30, type: 'design', year: '2024', status: 'progress', title: 'Инфографика Хаоса', 
      description: 'Данные представлены максимально запутанно', tags: ['Infographic'], color: '#4caf50' },
    { id: 31, type: 'design', year: '2025', status: 'absurd', title: 'Книга с Пустыми Страницами', 
      description: 'Самая честная книга о дизайне', tags: ['Book Design'], color: '#43a047' },
    { id: 32, type: 'design', year: '2025', status: 'completed', title: 'Монохромная Палитра', 
      description: '50 оттенков черного. И все одинаковые.', tags: ['Color Theory'], color: '#388e3c' }
];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем проекты
    projects = projectsData;
    
    // Инициализация фильтров
    initFilters();
    
    // Инициализация сортировки
    initSorting();
    
    // Инициализация переключения вида
    initViewToggle();
    
    // Рендерим проекты
    renderProjects();
    
    // Восстанавливаем состояние
    restoreState();
    
    // Обновляем счетчики
    updateCounters();
});

// Инициализация фильтров
function initFilters() {
    // Обработчики для кнопок фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            
            // Снимаем активный класс с других кнопок этой группы
            document.querySelectorAll(`.filter-btn[data-filter="${filterType}"]`).forEach(b => {
                b.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Обновляем фильтры
            activeFilters[filterType] = filterValue;
            
            // Применяем фильтры
            applyFilters();
            
            // Сохраняем состояние
            saveState();
            
            // Обновляем счетчики
            updateCounters();
        });
    });
    
    // Кнопка сброса фильтров
    document.getElementById('reset-filters').addEventListener('click', function() {
        // Сбрасываем все фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.value === 'all') {
                btn.classList.add('active');
            }
        });
        
        // Сбрасываем активные фильтры
        activeFilters = {
            type: 'all',
            year: 'all',
            status: 'all'
        };
        
        // Применяем фильтры
        applyFilters();
        
        // Сохраняем состояние
        saveState();
        
        // Обновляем счетчики
        updateCounters();
    });
}

// Инициализация сортировки
function initSorting() {
    const sortSelect = document.getElementById('sort-select');
    
    // Восстанавливаем сортировку из localStorage
    const savedSort = localStorage.getItem('portfolio-sort');
    if (savedSort) {
        sortBy = savedSort;
        sortSelect.value = savedSort;
    }
    
    sortSelect.addEventListener('change', function() {
        sortBy = this.value;
        applyFilters();
        saveState();
    });
}

// Инициализация переключения вида
function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Восстанавливаем вид из localStorage
    const savedView = localStorage.getItem('portfolio-view');
    if (savedView) {
        viewMode = savedView;
        document.querySelector(`.view-btn[data-view="${savedView}"]`).classList.add('active');
        document.querySelector('.projects-grid').classList.add(`${savedView}-view`);
    }
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const newView = this.dataset.view;
            
            // Если уже активен этот вид, ничего не делаем
            if (newView === viewMode) return;
            
            // Меняем активную кнопку
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Меняем класс у сетки
            const grid = document.querySelector('.projects-grid');
            grid.classList.remove(`${viewMode}-view`);
            grid.classList.add(`${newView}-view`);
            
            // Сохраняем новый вид
            viewMode = newView;
            localStorage.setItem('portfolio-view', newView);
        });
    });
}

// Применение фильтров и сортировки
function applyFilters() {
    let filteredProjects = [...projects];
    
    // Применяем фильтры
    Object.entries(activeFilters).forEach(([type, value]) => {
        if (value !== 'all') {
            filteredProjects = filteredProjects.filter(project => project[type] === value);
        }
    });
    
    // Применяем сортировку
    filteredProjects.sort((a, b) => {
        switch (sortBy) {
            case 'year':
                return b.year - a.year;
            case 'name':
                return a.title.localeCompare(b.title);
            case 'type':
                return a.type.localeCompare(b.type);
            default:
                return a.id - b.id;
        }
    });
    
    // Рендерим отфильтрованные проекты
    renderProjects(filteredProjects);
    
    // Обновляем счетчик
    document.getElementById('project-count').textContent = filteredProjects.length;
}

// Рендеринг проектов
function renderProjects(projectsToRender = projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';
    
    projectsToRender.forEach((project, index) => {
        const projectCard = createProjectCard(project, index);
        grid.appendChild(projectCard);
    });
    
    // Обновляем общее количество проектов
    document.getElementById('total-projects').textContent = projects.length;
}

// Создание карточки проекта
function createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.type = project.type;
    card.dataset.year = project.year;
    card.dataset.status = project.status;
    
    // Случайный угол для хаотичности
    const angle = (Math.random() * 6 - 3);
    card.style.setProperty('--project-angle', `${angle}deg`);
    
    // Определяем номер проекта
    const number = (index + 1).toString().padStart(2, '0');
    
    // Определяем тип для отображения
    const typeNames = {
        'web': 'ВЕБ',
        '3d': '3D',
        'game': 'ИГРА',
        'design': 'ДИЗАЙН'
    };
    
    const statusNames = {
        'completed': 'ЗАВЕРШЕНО',
        'progress': 'В РАБОТЕ',
        'absurd': 'АБСУРД'
    };
    
    card.innerHTML = `
        <div class="project-image" style="background: ${project.color};" data-number="${number}">
            <div style="font-size: 3em; color: rgba(0,0,0,0.1);">${number}</div>
        </div>
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
            <div class="project-meta">
                <span class="project-year">${project.year}</span>
                <span class="project-type">${typeNames[project.type]} • ${statusNames[project.status]}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Сохранение состояния
function saveState() {
    const state = {
        filters: activeFilters,
        sort: sortBy,
        view: viewMode
    };
    
    localStorage.setItem('portfolio-state', JSON.stringify(state));
    
    // Показываем индикатор сохранения
    showSaveIndicator();
}

// Восстановление состояния
function restoreState() {
    const saved = localStorage.getItem('portfolio-state');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            
            // Восстанавливаем фильтры
            if (state.filters) {
                activeFilters = state.filters;
                
                // Устанавливаем активные кнопки фильтров
                Object.entries(activeFilters).forEach(([type, value]) => {
                    const btn = document.querySelector(`.filter-btn[data-filter="${type}"][data-value="${value}"]`);
                    if (btn) {
                        // Снимаем активный класс со всех кнопок этой группы
                        document.querySelectorAll(`.filter-btn[data-filter="${type}"]`).forEach(b => {
                            b.classList.remove('active');
                        });
                        // Добавляем активный класс нужной кнопке
                        btn.classList.add('active');
                    }
                });
            }
            
            // Восстанавливаем сортировку
            if (state.sort) {
                sortBy = state.sort;
                document.getElementById('sort-select').value = state.sort;
            }
            
            // Восстанавливаем вид
            if (state.view) {
                viewMode = state.view;
                const grid = document.querySelector('.projects-grid');
                const viewBtn = document.querySelector(`.view-btn[data-view="${state.view}"]`);
                
                if (viewBtn) {
                    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                    viewBtn.classList.add('active');
                    grid.classList.add(`${state.view}-view`);
                }
            }
            
            // Применяем восстановленные настройки
            applyFilters();
            
        } catch (e) {
            console.log('Ошибка восстановления состояния:', e);
        }
    }
}

// Обновление счетчиков и информации
function updateCounters() {
    const visibleCount = document.querySelectorAll('.project-card:not([style*="display: none"])').length;
    document.getElementById('project-count').textContent = visibleCount;
    
    // Подсчитываем активные фильтры
    let activeFiltersCount = 0;
    Object.values(activeFilters).forEach(value => {
        if (value !== 'all') activeFiltersCount++;
    });
    
    document.getElementById('active-filters-count').textContent = activeFiltersCount;
    
    // Обновляем текст активных фильтров
    updateActiveFiltersText();
}

// Обновление текста активных фильтров
function updateActiveFiltersText() {
    const filterText = document.getElementById('active-filters-text');
    const filters = [];
    
    const typeNames = {
        'web': 'Веб',
        '3d': '3D',
        'game': 'Игры',
        'design': 'Дизайн'
    };
    
    const statusNames = {
        'completed': 'Завершено',
        'progress': 'В работе',
        'absurd': 'Абсурд'
    };
    
    if (activeFilters.type !== 'all') {
        filters.push(typeNames[activeFilters.type]);
    }
    
    if (activeFilters.year !== 'all') {
        filters.push(activeFilters.year);
    }
    
    if (activeFilters.status !== 'all') {
        filters.push(statusNames[activeFilters.status]);
    }
    
    if (filters.length === 0) {
        filterText.textContent = 'все работы';
    } else {
        filterText.textContent = filters.join(', ');
    }
}

// Показать индикатор сохранения
function showSaveIndicator() {
    // Создаем индикатор, если его нет
    let indicator = document.querySelector('.save-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        document.body.appendChild(indicator);
    }
    
    indicator.textContent = 'Состояние сохранено';
    indicator.classList.add('show');
    
    // Убираем индикатор через 2.5 секунды
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2500);
}

// Автосохранение каждые 30 секунд
setInterval(() => {
    saveState();
    document.getElementById('save-status').textContent = 'сохранено';
    document.getElementById('save-status').style.color = '#00aa00';
}, 30000);

// Изменение статуса при модификации
document.addEventListener('input', () => {
    document.getElementById('save-status').textContent = 'не сохранено';
    document.getElementById('save-status').style.color = '#ff3366';
});

// Инициализация после полной загрузки
window.addEventListener('load', () => {
    // Добавляем случайные углы для блоков
    document.querySelectorAll('.chaotic').forEach((block, index) => {
        // Сохраняем оригинальный угол
        const originalAngle = parseInt(getComputedStyle(block).getPropertyValue('--angle') || 0);
        // Добавляем небольшое случайное отклонение
        const randomOffset = (Math.random() * 1 - 0.5);
        block.style.setProperty('--angle', (originalAngle + randomOffset).toString());
    });
    
    // Обновляем статус сохранения
    document.getElementById('save-status').textContent = 'сохранено';
    document.getElementById('save-status').style.color = '#00aa00';
});
