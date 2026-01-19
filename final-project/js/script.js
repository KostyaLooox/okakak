
// воркдата это список всех моих проектов внутри работы (типо базы дданных)
// const грубо говоря константа которая не меняяеться и её мы не переписываем если дал значение 1 то 2 уже ставить нельзя
// портфолио постоянное его мы не меняем 
const worksData = [  
    {
        id: 1,                  // индекс самой работы уникальный      
        title: "ПЕРСОНАЖ В КОМНАТЕ", // название самой работы ну тайтол написан видно же инглиш учим 
        category: "3d",         // сама категория работы по типу её там от 3д до веба
        level: "advanced",      // уровеньь сложно он начинающего до сложного 
        description: "Детализированная 3D модель персонажа в комнате с руками.", // описание работы что внутри неё 
        technologies: ["Blender", "Photoshop"], // то что использоввалось при ссоздание работы вроде как массив если павильно помню 
        year: 2023,     // год создания работы            
        image: "assets/work/PERSKOMNATA.jpg" // завгрузка изображения работы из папки
    },
    {
        id: 2,
        title: "КИНОПОСТЕР",
        category: "poster",
        level: "intermediate",
        description: "Рекламный постер для фантастического фильма с акцентом на типографике и цветовых контрастах.",
        technologies: ["Photoshop"],
        year: 2024,
        image: "assets/work/KINO.png"
    },
    {
        id: 3,
        title: "САЙТ МУЗЕЙ",
        category: "web",
        level: "advanced",
        description: "Адаптивный веб-сайт для музея абсурда",
        technologies: ["Figma"],
        year: 2025,
        image: "assets/work/MUSEM.jpg"
    },
    {
        id: 4,
        title: "РОБОТ",
        category: "3d",
        level: "beginner",
        description: "Первая 3D модель робота.",
        technologies: ["Blender"],
        year: 2022,
        image: "assets/work/ROBOT.png"
    },
    {
        id: 5,
        title: "СТУЛЬНЫЙ ФЕСТИВАЛЬ",
        category: "poster",
        level: "beginner",
        description: "АААААА СТУЛЬЯ",
        technologies: ["Photoshop", "Figma"],
        year: 2022,
        image: "assets/work/STYL.jpg"
    },
    {
        id: 6,
        title: "ГРИБЫ И HTML",
        category: "web",
        level: "intermediate",
        description: "Не реклаама грибов.",
        technologies: ["HTML", "CSS", "Figma"],
        year: 2025,
        image: "assets/work/GRIB.jpg"
    },
    {
        id: 7,
        title: "ЭТО ОБЫЧНАЯ ДЕРЕВНЯ",
        category: "3d",
        level: "advanced",
        description: "Блокинг и не больше",
        technologies: ["Blender", "Photoshop"],
        year: 2025,
        image: "assets/work/GOROD.png"
    },
    {
        id: 8,
        title: "FHKIO",
        category: "poster",
        level: "intermediate",
        description: "Минималистичный постер для FHKIO.",
        technologies: ["Illustrator", "InDesign"],
        year: 2022,
        image: "assets/work/FHKIO.png"
    },
    {
        id: 9,
        title: "ЭТО ОГУРЕЦ)",
        category: "web",
        level: "beginner",
        description: "Личный блог огурца.",
        technologies: ["HTML", "CSS", "Figma"],
        year: 2024,
        image: "assets/work/OGUREH.png"
    },
    {
        id: 10,
        title: "ДОМ",
        category: "3d",
        level: "intermediate",
        description: "ДОМ",
        technologies: ["Blender"],
        year: 2022,
        image: "assets/work/DOM.png"
    },
    {
        id: 11,
        title: "ТЕАТРАЛЬНЫЙ АФИША",
        category: "poster",
        level: "beginner",
        description: "Классическая афиша для театральной постановки.",
        technologies: ["Photoshop"],
        year: 2023,
        image: "assets/work/TEATR.png"
    },
    {
        id: 12,
        title: "САМ В ШОКЕ",
        category: "web",
        level: "advanced",
        description: "Да это сайт",
        technologies: ["Figma"],
        year: 2024,
        image: "assets/work/DA.jpg"
    }
];

// по факту хранение иекущих настроеек фильтра
// let переменая которая может меняться так как у нас фильтры 
let currentFilters = {
    category: 'all', // это отвечает за категории (по умолчанию категории и уровни всоя на все для удобвства)
    level: 'all' // это отвечает за уровни 
};

// DOM элементы это любой аштб тэг к которому джс может что-то сделать или поговорить с ним 
// грубо говоря хранилище этих элементов
// ранее обьявление пременных чтобы элементы были доступны во всех функциях
let worksContainer; // карточки работ
let filterButtons;  // фильтр категорий
let levelButtons; // фильтор уровня
let resetButton; // кнопка сброса фильтра
let activeFiltersSpan; // Отображение текущего фильтра
let totalProjectsSpan; // Общее количество проектов
let filteredProjectsSpan; // отфильрованное количесво элементов 
let mobileMenuBtn; // мобильное меню (зачем сдделал не знаю но пусть будет сайт то красивый)
let nav; // навигация

// документ это рисунок html странпаницы представвляем это это простот это документ  её
// addEventListener реакция на собитие (тоесть при мы ждем событие которое должно произоойти и после активируем его)
// DOMContentLoaded это название события которое и должно произойти (когд html загружен)
// функция выполнение которой происхооддит после выполнения события 
document.addEventListener('DOMContentLoaded', function() {
    initElements(); // поиск всех элементов 
    loadFiltersFromStorage(); // загрузить сохраанёный фильт
    renderWorks(); // отобразить саму работу на сайте 
    updateStats(); // обновитьь счёт проектов
    updateActiveFiltersText(); // обновить текст фильтра который активен 
    updateActiveButtons(); // обновить состояние кнопки
    setupEventListeners(); // обработка всех событий
});

// подготовка элементов (инициализация) (поиск элементов и сохранение их переменных)
function initElements() {
    worksContainer = document.getElementById('works-container'); // найти элемент по айди который мы назначили и записать его в переменную (сама карточка)
    filterButtons = document.querySelectorAll('.filter-btn'); // категории (сначало берем все потом подгружаем сохранение)
    levelButtons = document.querySelectorAll('.level-btn'); // уровень
    resetButton = document.getElementById('reset-filters');  // сброс фильтра
    activeFiltersSpan = document.getElementById('active-filters'); // активный фильтр
    totalProjectsSpan = document.getElementById('total-projects'); // кол проектов общее
    filteredProjectsSpan = document.getElementById('filtered-projects'); // отфильт кол
    mobileMenuBtn = document.querySelector('.mobile-menu-btn'); // кноопка мобильного меню
    nav = document.querySelector('.nav'); // навигация
}

// функция реакций на сайте на нажатие
function setupEventListeners() { 

    filterButtons.forEach(button => {  // фильтр кнопок категорий (форич это перебор каждой кнопки)
        button.addEventListener('click', () => { // на каждую кнопку делаем клин
            currentFilters.category = button.dataset.filter;
            saveFiltersToStorage(); // сохранение фильтра
            updateActiveButtons(); // обновление активности
            updateActiveFiltersText(); // текст нью
            renderWorks(); // нбю карточки
        });
    });


    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilters.level = button.dataset.level;
            saveFiltersToStorage();
            updateActiveButtons();
            updateActiveFiltersText();
            renderWorks();
        });
    });


    resetButton.addEventListener('click', () => {
        currentFilters = { category: 'all', level: 'all' };
        saveFiltersToStorage();
        updateActiveButtons();
        updateActiveFiltersText();
        renderWorks();
    });

    // это для мобильной адапции его меню 
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Закрытие меню при нажатие
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });

}

// Рендеринг работ
function renderWorks() {
    worksContainer.innerHTML = ''; // переменая в которой айди 
    
    const filteredWorks = filterWorks(); 
    
    filteredWorks.forEach((work, index) => { //форич пройтись по каждой работе
        const workCard = createWorkCard(work, index);
        worksContainer.appendChild(workCard);
    });
    
    updateStats(filteredWorks.length); //сколько всего проектов офильтрованных
}

// Создание карточки работы
function createWorkCard(work, index) {
    const workCard = document.createElement('div');
    workCard.className = 'work-card';
    workCard.dataset.category = work.category;
    workCard.dataset.level = work.level;
    workCard.style.animationDelay = `${index * 0.1}s`;
    
    const categoryNames = {
        '3d': '3D МОДЕЛЬ',
        'poster': 'ПОСТЕР',
        'web': 'ВЕБ-ДИЗАЙН'
    };
    
    const levelNames = {
        'beginner': 'НАЧИНАЮЩИЙ',
        'intermediate': 'СРЕДНИЙ',
        'advanced': 'ПРОДВИНУТЫЙ'
    };

    
    // Создаем HTML структуру
    workCard.innerHTML = `
        <div class="work-image">
            <div class="work-number">${work.id}</div>
            <div class="work-category">${categoryNames[work.category]}</div>
        </div>
        <div class="work-info">
            <h3 class="work-title">${work.title}</h3>
            <div class="work-meta">
                <span class="work-year">${work.year}</span>
                <span class="work-level level-${work.level}">${levelNames[work.level]}</span>
            </div>
            <p class="work-description">${work.description}</p>
            <div class="work-tech">${work.technologies.join(' • ')}</div>
        </div>
    `;
    
    // Добавляем изображение ДОПОЛНИТЕЛЬНО к существующей структуре
    const workImageDiv = workCard.querySelector('.work-image');
    
    if (work.image) {
        // Создаем элемент изображения
        const img = document.createElement('img');
        img.src = work.image;
        img.alt = work.title;
        img.className = 'work-image-content';
        
        // Вставляем изображение в начало блока work-image
        workImageDiv.insertBefore(img, workImageDiv.firstChild);
        
        // Убираем градиентный фон, т.к. теперь есть изображение
        workImageDiv.style.background = 'none';
    } else {
        // Если нет изображения, оставляем градиентный фон
        workImageDiv.style.background = gradient;
    }
    
    return workCard;
}

// Фильтрация работ
function filterWorks() {
    return worksData.filter(work => {
        // Фильтр по категории
        if (currentFilters.category !== 'all' && work.category !== currentFilters.category) {
            return false;
        }
        
        // Фильтр по уровню
        if (currentFilters.level !== 'all' && work.level !== currentFilters.level) {
            return false;
        }
        
        return true;
    });
}

// Обновление статистики
function updateStats(filteredCount = worksData.length) {
    totalProjectsSpan.textContent = worksData.length;
    filteredProjectsSpan.textContent = filteredCount;
}

// Обновление текста активных фильтров
function updateActiveFiltersText() {
    const categoryNames = {
        'all': 'Все',
        '3d': '3D',
        'poster': 'Постеры',
        'web': 'Веб'
    };
    
    const levelNames = {
        'all': 'всех уровней',
        'beginner': 'начинающего уровня',
        'intermediate': 'среднего уровня',
        'advanced': 'продвинутого уровня'
    };
    
    let text = 'Показаны: ';
    
    if (currentFilters.category === 'all' && currentFilters.level === 'all') {
        text += 'Все проекты';
    } else {
        if (currentFilters.category !== 'all') {
            text += categoryNames[currentFilters.category];
        }
        
        if (currentFilters.level !== 'all') {
            if (currentFilters.category !== 'all') text += ' ';
            text += levelNames[currentFilters.level];
        }
    }
    
    activeFiltersSpan.textContent = text;
}

// Обновление активных кнопок
function updateActiveButtons() {
    // Сброс всех кнопок
    filterButtons.forEach(btn => btn.classList.remove('active'));
    levelButtons.forEach(btn => btn.classList.remove('active'));
    
    // Активация кнопок по текущим фильтрам
    document.querySelector(`.filter-btn[data-filter="${currentFilters.category}"]`)?.classList.add('active');
    document.querySelector(`.level-btn[data-level="${currentFilters.level}"]`)?.classList.add('active');
}

// Сохранение фильтров в LocalStorage
function saveFiltersToStorage() {
    localStorage.setItem('portfolioFilters', JSON.stringify(currentFilters));
}

// Загрузка фильтров из LocalStorage
function loadFiltersFromStorage() {
    const savedFilters = localStorage.getItem('portfolioFilters');
    
    if (savedFilters) {
        try {
            const filters = JSON.parse(savedFilters);
            currentFilters = {
                category: filters.category || 'all',
                level: filters.level || 'all'
            };
        } catch (e) {
            console.error('Ошибка загрузки фильтров:', e);
        }
    }
}