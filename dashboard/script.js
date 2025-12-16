// Основные переменные
let widgets = [];
let currentEditingWidget = null;
let draggedWidget = null;

// Доступные виджеты
const availableWidgetTypes = [
    { type: 'weather', name: 'Погода', defaultSettings: { city: 'Москва', latitude: 55.7558, longitude: 37.6173 } },
    { type: 'currency', name: 'Курсы валют', defaultSettings: { currencies: ['USD', 'EUR'] } },
    { type: 'quote', name: 'Случайная цитата', defaultSettings: {} },
    { type: 'timer', name: 'Таймер', defaultSettings: { workTime: 25, breakTime: 5 } },
    { type: 'notes', name: 'Заметки', defaultSettings: {} }
];

// Координаты городов
const cityCoordinates = {
    'Москва': { latitude: 55.7558, longitude: 37.6173 },
    'Санкт-Петербург': { latitude: 59.9343, longitude: 30.3351 },
    'Новосибирск': { latitude: 55.0084, longitude: 82.9357 },
    'Екатеринбург': { latitude: 56.8389, longitude: 60.6057 },
    'Казань': { latitude: 55.8304, longitude: 49.0661 },
    'Нижний Новгород': { latitude: 56.3269, longitude: 44.0059 },
    'Челябинск': { latitude: 55.1644, longitude: 61.4368 },
    'Самара': { latitude: 53.2415, longitude: 50.2212 },
    'Омск': { latitude: 54.9885, longitude: 73.3242 },
    'Ростов-на-Дону': { latitude: 47.2225, longitude: 39.7187 }
};

// DOM элементы
const widgetsContainer = document.getElementById('widgets-container');
const widgetsModal = document.getElementById('widgets-modal');
const settingsModal = document.getElementById('settings-modal');
const addWidgetBtn = document.getElementById('add-widget-btn');
const closeModalBtn = document.getElementById('close-modal');
const closeSettingsModalBtn = document.getElementById('close-settings-modal');
const availableWidgets = document.getElementById('available-widgets');
const widgetSettings = document.getElementById('widget-settings');
const saveSettingsBtn = document.getElementById('save-settings');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const resetBtn = document.getElementById('reset-btn');
const importFile = document.getElementById('import-file');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    setupEventListeners();
});

// Настройка обработчиков событий
function setupEventListeners() {
    addWidgetBtn.addEventListener('click', () => widgetsModal.style.display = 'flex');
    closeModalBtn.addEventListener('click', () => widgetsModal.style.display = 'none');
    closeSettingsModalBtn.addEventListener('click', () => settingsModal.style.display = 'none');
    saveSettingsBtn.addEventListener('click', saveWidgetSettings);
    exportBtn.addEventListener('click', exportDashboard);
    importBtn.addEventListener('click', () => importFile.click());
    resetBtn.addEventListener('click', resetDashboard);
    
    importFile.addEventListener('change', handleFileImport);

    // Добавление виджетов из модального окна
    availableWidgets.addEventListener('click', function(e) {
        if (e.target.classList.contains('available-widget')) {
            const widgetType = e.target.getAttribute('data-type');
            addWidget(widgetType);
            widgetsModal.style.display = 'none';
        }
    });

    // Закрытие модальных окон при клике вне их
    window.addEventListener('click', function(e) {
        if (e.target === widgetsModal) {
            widgetsModal.style.display = 'none';
        }
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
}

// Загрузка дашборда из localStorage
function loadDashboard() {
    const savedDashboard = localStorage.getItem('dashboard');
    if (savedDashboard) {
        const parsedData = JSON.parse(savedDashboard);
        widgets = parsedData;
        
        // Восстановление таймеров
        widgets.forEach(widget => {
            if (widget.type === 'timer' && widget.timerState && widget.timerState.isRunning) {
                startTimer(widget.id);
            }
        });
        
        renderWidgets();
        
        // Обновление данных виджетов при загрузке
        widgets.forEach(widget => {
            if (widget.type !== 'timer' && widget.type !== 'notes') {
                loadWidgetData(widget.id);
            }
        });
    }
}

// Сохранение дашборда в localStorage
function saveDashboard() {
    localStorage.setItem('dashboard', JSON.stringify(widgets));
}

// Добавление нового виджета
function addWidget(type) {
    const widgetType = availableWidgetTypes.find(w => w.type === type);
    if (!widgetType) return;

    const newWidget = {
        id: Date.now().toString(),
        type: type,
        name: widgetType.name,
        settings: JSON.parse(JSON.stringify(widgetType.defaultSettings)),
        data: null,
        error: null,
        loading: true
    };

    widgets.push(newWidget);
    saveDashboard();
    renderWidgets();
    loadWidgetData(newWidget.id);
}

// Удаление виджета
function removeWidget(id) {
    const widget = widgets.find(w => w.id === id);
    if (widget && widget.type === 'timer' && widget.timerState && widget.timerState.intervalId) {
        clearInterval(widget.timerState.intervalId);
    }
    
    widgets = widgets.filter(w => w.id !== id);
    saveDashboard();
    renderWidgets();
}

// Обновление данных виджета
function updateWidget(id) {
    const widget = widgets.find(w => w.id === id);
    if (widget) {
        widget.loading = true;
        widget.error = null;
        saveDashboard();
        renderWidgets();
        loadWidgetData(id);
    }
}

// Открытие настроек виджета
function openWidgetSettings(id) {
    currentEditingWidget = id;
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;

    widgetSettings.innerHTML = '';

    // Настройки для виджета погоды
    if (widget.type === 'weather') {
        const cities = Object.keys(cityCoordinates);
        widgetSettings.innerHTML = `
            <div class="setting-group">
                <label class="setting-label" for="weather-city">Город</label>
                <select class="setting-input" id="weather-city">
                    ${cities.map(city => 
                        `<option value="${city}" ${city === widget.settings.city ? 'selected' : ''}>${city}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }
    // Настройки для виджета курсов валют
    else if (widget.type === 'currency') {
        const currencies = widget.settings.currencies || ['USD', 'EUR'];
        widgetSettings.innerHTML = `
            <div class="setting-group">
                <label class="setting-label">Валюты (через запятую, например: USD, EUR, GBP)</label>
                <input type="text" class="setting-input" id="currency-list" value="${currencies.join(', ')}">
            </div>
        `;
    }
    // Настройки для виджета таймера
    else if (widget.type === 'timer') {
        widgetSettings.innerHTML = `
            <div class="setting-group">
                <label class="setting-label" for="work-time">Время работы (минуты)</label>
                <input type="number" class="setting-input" id="work-time" value="${widget.settings.workTime || 25}">
            </div>
            <div class="setting-group">
                <label class="setting-label" for="break-time">Время перерыва (минуты)</label>
                <input type="number" class="setting-input" id="break-time" value="${widget.settings.breakTime || 5}">
            </div>
        `;
    }
    // Для других виджетов настройки не нужны
    else {
        widgetSettings.innerHTML = '<p>Для этого виджета нет настроек.</p>';
    }

    settingsModal.style.display = 'flex';
}

// Сохранение настроек виджета
function saveWidgetSettings() {
    if (!currentEditingWidget) return;

    const widget = widgets.find(w => w.id === currentEditingWidget);
    if (!widget) return;

    // Сохранение настроек для виджета погоды
    if (widget.type === 'weather') {
        const cityInput = document.getElementById('weather-city');
        if (cityInput) {
            const selectedCity = cityInput.value;
            widget.settings.city = selectedCity;
            widget.settings.latitude = cityCoordinates[selectedCity].latitude;
            widget.settings.longitude = cityCoordinates[selectedCity].longitude;
        }
    }
    // Сохранение настроек для виджета курсов валют
    else if (widget.type === 'currency') {
        const currencyInput = document.getElementById('currency-list');
        if (currencyInput) {
            widget.settings.currencies = currencyInput.value.split(',').map(c => c.trim()).filter(c => c);
        }
    }
    // Сохранение настроек для виджета таймера
    else if (widget.type === 'timer') {
        const workTimeInput = document.getElementById('work-time');
        const breakTimeInput = document.getElementById('break-time');
        if (workTimeInput && breakTimeInput) {
            widget.settings.workTime = parseInt(workTimeInput.value) || 25;
            widget.settings.breakTime = parseInt(breakTimeInput.value) || 5;
            
            // Сброс таймера при изменении настроек
            if (widget.timerState) {
                resetTimer(widget.id);
            }
        }
    }

    saveDashboard();
    settingsModal.style.display = 'none';
    updateWidget(currentEditingWidget);
}

// Загрузка данных для виджета
function loadWidgetData(id) {
    const widget = widgets.find(w => w.id === id);
    if (!widget) return;

    // Загрузка данных в зависимости от типа виджета
    switch (widget.type) {
        case 'weather':
            loadWeatherData(widget);
            break;
        case 'currency':
            loadCurrencyData(widget);
            break;
        case 'quote':
            loadQuoteData(widget);
            break;
        case 'timer':
            // Для таймера данные не загружаются
            widget.loading = false;
            saveDashboard();
            renderWidgets();
            break;
        case 'notes':
            // Для заметок данные загружаются из localStorage
            loadNotesData(widget);
            break;
    }
}

// Загрузка данных о погоде с Open-Meteo API
async function loadWeatherData(widget) {
    try {
        const { latitude, longitude } = widget.settings;
        
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Moscow`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Рендерим данные погоды
        renderWeatherData(widget, data);
        
    } catch (error) {
        console.error('Error loading weather data:', error);
        widget.error = `Не удалось загрузить данные: ${error.message}`;
        widget.loading = false;
        saveDashboard();
        renderWidgets();
    }
}

// Рендеринг данных погоды
function renderWeatherData(widget, data) {
    const currentWeather = data.current_weather;
    
    widget.data = {
        temperature: Math.round(currentWeather.temperature),
        windSpeed: currentWeather.windspeed,
        windDirection: currentWeather.winddirection,
        weatherCode: currentWeather.weathercode,
        description: getWeatherDescription(currentWeather.weathercode),
        icon: getWeatherIcon(currentWeather.weathercode),
        city: widget.settings.city,
        time: new Date(currentWeather.time).toLocaleTimeString('ru-RU')
    };
    
    widget.loading = false;
    widget.error = null;
    saveDashboard();
    renderWidgets();
}

// Функция для получения описания погоды по коду
function getWeatherDescription(weatherCode) {
    const weatherDescriptions = {
        0: 'Ясно',
        1: 'Преимущественно ясно',
        2: 'Переменная облачность',
        3: 'Пасмурно',
        45: 'Туман',
        48: 'Туман с инеем',
        51: 'Лежащая морось',
        53: 'Умеренная морось',
        55: 'Сильная морось',
        61: 'Небольшой дождь',
        63: 'Умеренный дождь',
        65: 'Сильный дождь',
        71: 'Небольшой снег',
        73: 'Умеренный снег',
        75: 'Сильный снег',
        80: 'Небольшие ливни',
        81: 'Умеренные ливни',
        82: 'Сильные ливни'
    };
    
    return weatherDescriptions[weatherCode] || 'Неизвестно';
}

// Функция для получения иконки погоды по коду
function getWeatherIcon(weatherCode) {
    const iconMap = {
        0: '☀️',   // Ясно
        1: '🌤️',   // Преимущественно ясно
        2: '⛅',   // Переменная облачность
        3: '☁️',   // Пасмурно
        45: '🌫️',  // Туман
        48: '🌫️',  // Туман с инеем
        51: '🌧️',  // Морось
        53: '🌧️',  // Морось
        55: '🌧️',  // Морось
        61: '🌦️',  // Дождь
        63: '🌧️',  // Дождь
        65: '⛈️',  // Дождь
        71: '🌨️',  // Снег
        73: '🌨️',  // Снег
        75: '❄️',  // Снег
        80: '🌦️',  // Ливни
        81: '🌧️',  // Ливни
        82: '⛈️'   // Ливни
    };
    
    return iconMap[weatherCode] || '🌤️';
}

// Загрузка данных о курсах валют с реального API
async function loadCurrencyData(widget) {
    const currencies = widget.settings.currencies || ['USD', 'EUR'];
    
    try {
        // Используем API Центробанка России для получения реальных курсов
        const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        
        widget.data = currencies.map(currencyCode => {
            const currencyInfo = data.Valute[currencyCode];
            
            if (!currencyInfo) {
                return {
                    currency: currencyCode,
                    rate: 'N/A',
                    change: '0.00',
                    name: currencyCode
                };
            }
            
            const currentRate = currencyInfo.Value;
            const previousRate = currencyInfo.Previous;
            const change = ((currentRate - previousRate) / previousRate * 100).toFixed(2);
            
            return {
                currency: currencyCode,
                rate: currentRate.toFixed(2),
                change: change,
                name: currencyInfo.Name
            };
        });
        
        widget.loading = false;
        widget.error = null;
    } catch (error) {
        console.error('Error loading currency data:', error);
        widget.error = `Не удалось загрузить данные: ${error.message}`;
        widget.loading = false;
        
        // Демо-данные на случай ошибки
        widget.data = currencies.map(currency => ({
            currency: currency,
            rate: (Math.random() * 20 + 70).toFixed(2),
            change: (Math.random() * 2 - 1).toFixed(2),
            name: currency === 'USD' ? 'Доллар США' : 'Евро'
        }));
    }
    
    saveDashboard();
    renderWidgets();
}

// Загрузка случайной цитаты
async function loadQuoteData(widget) {
    try {
        const response = await fetch('https://api.quotable.io/random');
        
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }
        
        const data = await response.json();
        
        widget.data = {
            quote: data.content,
            author: data.author
        };
        
        widget.loading = false;
        widget.error = null;
    } catch (error) {
        console.error('Error loading quote:', error);
        
        // Запасные цитаты
        const backupQuotes = [
            { content: "Программирование — это не о том, чтобы знать все ответы, а о том, чтобы знать, где их найти.", author: "Стив Макконнелл" },
            { content: "Лучший способ предсказать будущее — создать его.", author: "Абрахам Линкольн" },
            { content: "Единственный способ сделать великую работу — любить то, что вы делаете.", author: "Стив Джобс" }
        ];
        
        const randomQuote = backupQuotes[Math.floor(Math.random() * backupQuotes.length)];
        widget.data = {
            quote: randomQuote.content,
            author: randomQuote.author
        };
        widget.loading = false;
    }
    
    saveDashboard();
    renderWidgets();
}

// Загрузка данных заметок
function loadNotesData(widget) {
    const savedNotes = localStorage.getItem(`notes_${widget.id}`);
    widget.data = savedNotes ? JSON.parse(savedNotes) : [];
    widget.loading = false;
    saveDashboard();
    renderWidgets();
}

// Сохранение данных заметок
function saveNotesData(widget) {
    localStorage.setItem(`notes_${widget.id}`, JSON.stringify(widget.data || []));
}

// Добавление новой заметки
function addNote(widgetId, noteText) {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget || !noteText.trim()) return;

    if (!widget.data) widget.data = [];
    widget.data.push({
        id: Date.now().toString(),
        text: noteText.trim(),
        timestamp: new Date().toLocaleString()
    });

    saveNotesData(widget);
    saveDashboard();
    renderWidgets();
}

// Удаление заметки
function deleteNote(widgetId, noteId) {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget || !widget.data) return;

    widget.data = widget.data.filter(note => note.id !== noteId);
    saveNotesData(widget);
    saveDashboard();
    renderWidgets();
}

// Запуск таймера
function startTimer(widgetId) {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    if (!widget.timerState) {
        widget.timerState = {
            isRunning: true,
            isWorkTime: true,
            remainingTime: (widget.settings.workTime || 25) * 60, // в секундах
            intervalId: null
        };
    } else {
        widget.timerState.isRunning = true;
    }

    // Запуск интервала для обновления таймера
    widget.timerState.intervalId = setInterval(() => {
        if (widget.timerState.remainingTime > 0) {
            widget.timerState.remainingTime--;
            saveDashboard();
            renderWidgets();
        } else {
            // Таймер завершился
            clearInterval(widget.timerState.intervalId);
            
            // Браузерные уведомления
            if (Notification.permission === 'granted') {
                new Notification(widget.timerState.isWorkTime ? 'Время работы завершено!' : 'Перерыв завершен!', {
                    body: widget.timerState.isWorkTime ? 'Сделайте перерыв.' : 'Возвращайтесь к работе.',
                    icon: '/favicon.ico'
                });
            } else {
                alert(widget.timerState.isWorkTime ? 'Время работы завершено! Сделайте перерыв.' : 'Перерыв завершен! Возвращайтесь к работе.');
            }
            
            // Переключение между рабочим временем и перерывом
            widget.timerState.isWorkTime = !widget.timerState.isWorkTime;
            widget.timerState.remainingTime = (widget.timerState.isWorkTime ? 
                (widget.settings.workTime || 25) : (widget.settings.breakTime || 5)) * 60;
            
            // Если был рабочий таймер, запускаем перерыв автоматически
            if (!widget.timerState.isWorkTime) {
                startTimer(widgetId);
            } else {
                widget.timerState.isRunning = false;
            }
            
            saveDashboard();
            renderWidgets();
        }
    }, 1000);

    saveDashboard();
    renderWidgets();
}

// Запрос разрешения на уведомления
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Пауза таймера
function pauseTimer(widgetId) {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget || !widget.timerState) return;

    widget.timerState.isRunning = false;
    if (widget.timerState.intervalId) {
        clearInterval(widget.timerState.intervalId);
        widget.timerState.intervalId = null;
    }

    saveDashboard();
    renderWidgets();
}

// Сброс таймера
function resetTimer(widgetId) {
    const widget = widgets.find(w => w.id === widgetId);
    if (!widget) return;

    if (widget.timerState && widget.timerState.intervalId) {
        clearInterval(widget.timerState.intervalId);
    }

    widget.timerState = {
        isRunning: false,
        isWorkTime: true,
        remainingTime: (widget.settings.workTime || 25) * 60,
        intervalId: null
    };

    saveDashboard();
    renderWidgets();
}

// Форматирование времени для таймера
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Drag & Drop функции
function handleDragStart(e) {
    draggedWidget = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    
    if (draggedWidget !== this) {
        const draggedId = draggedWidget.getAttribute('data-id');
        const targetId = this.getAttribute('data-id');
        
        const draggedIndex = widgets.findIndex(w => w.id === draggedId);
        const targetIndex = widgets.findIndex(w => w.id === targetId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Перемещение элемента в массиве
            const [movedWidget] = widgets.splice(draggedIndex, 1);
            widgets.splice(targetIndex, 0, movedWidget);
            
            saveDashboard();
            renderWidgets();
        }
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Отрисовка всех виджетов
function renderWidgets() {
    widgetsContainer.innerHTML = '';

    widgets.forEach(widget => {
        const widgetElement = document.createElement('div');
        widgetElement.className = 'widget';
        widgetElement.setAttribute('data-id', widget.id);

        // Добавление возможности перетаскивания
        widgetElement.setAttribute('draggable', 'true');
        widgetElement.addEventListener('dragstart', handleDragStart);
        widgetElement.addEventListener('dragover', handleDragOver);
        widgetElement.addEventListener('drop', handleDrop);
        widgetElement.addEventListener('dragend', handleDragEnd);

        let contentHTML = '';

        if (widget.loading) {
            contentHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Загрузка данных...</p>
                </div>
            `;
        } else if (widget.error) {
            contentHTML = `
                <div class="error">
                    <p>Ошибка: ${widget.error}</p>
                    <button class="btn btn-primary" onclick="updateWidget('${widget.id}')">Повторить</button>
                </div>
            `;
        } else {
            // Контент в зависимости от типа виджета
            switch (widget.type) {
                case 'weather':
                    contentHTML = `
                        <div class="weather-info">
                            <div class="weather-main">
                                <div class="weather-temp">${widget.data.temperature}°C</div>
                                <div class="weather-icon">${widget.data.icon}</div>
                            </div>
                            <div class="weather-desc">${widget.data.description}</div>
                            <div class="weather-city">${widget.data.city}</div>
                            <div class="weather-time">${widget.data.time}</div>
                            <div class="weather-details">
                                <div class="weather-detail">
                                    <span class="detail-label">Ветер</span>
                                    <span class="detail-value">${widget.data.windSpeed} м/с</span>
                                </div>
                                <div class="weather-detail">
                                    <span class="detail-label">Направление</span>
                                    <span class="detail-value">${widget.data.windDirection}°</span>
                                </div>
                            </div>
                        </div>
                    `;
                    break;
                case 'currency':
                    contentHTML = `
                        <div class="currency-list">
                            ${widget.data.map(currency => {
                                const changeClass = parseFloat(currency.change) > 0 ? 'positive' : 
                                                 parseFloat(currency.change) < 0 ? 'negative' : '';
                                const trendSymbol = parseFloat(currency.change) > 0 ? '▲' :
                                                  parseFloat(currency.change) < 0 ? '▼' : '●';
                                return `
                                    <div class="currency-item">
                                        <div class="currency-name">${currency.name || currency.currency}</div>
                                        <div class="currency-rate">${currency.rate} ₽</div>
                                        <div class="currency-change ${changeClass}">
                                            ${parseFloat(currency.change) > 0 ? '+' : ''}${currency.change}% ${trendSymbol}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="currency-update-time">
                            Курсы ЦБ РФ • ${new Date().toLocaleTimeString('ru-RU')}
                        </div>
                    `;
                    break;
                case 'quote':
                    contentHTML = `
                        <div class="quote-content">
                            <p>"${widget.data.quote}"</p>
                            <p><strong>— ${widget.data.author}</strong></p>
                        </div>
                        <button class="btn btn-primary" onclick="updateWidget('${widget.id}')">Следующая цитата</button>
                    `;
                    break;
                case 'timer':
                    const timerState = widget.timerState || {
                        isRunning: false,
                        isWorkTime: true,
                        remainingTime: (widget.settings.workTime || 25) * 60,
                        intervalId: null
                    };
                    
                    contentHTML = `
                        <div class="timer-display">
                            ${formatTime(timerState.remainingTime)}
                        </div>
                        <div class="timer-mode">
                            ${timerState.isWorkTime ? '🔄 Рабочее время' : '☕ Перерыв'}
                        </div>
                        <div class="timer-controls">
                            ${!timerState.isRunning ? 
                                `<button class="btn btn-primary" onclick="startTimer('${widget.id}'); requestNotificationPermission();">Старт</button>` : 
                                `<button class="btn btn-secondary" onclick="pauseTimer('${widget.id}')">Пауза</button>`
                            }
                            <button class="btn btn-danger" onclick="resetTimer('${widget.id}')">Сброс</button>
                        </div>
                    `;
                    break;
                case 'notes':
                    contentHTML = `
                        <div class="notes-container">
                            <div class="notes-list">
                                ${(widget.data || []).map(note => `
                                    <div class="note-item">
                                        <span class="note-text">${note.text}</span>
                                        <button class="note-delete" onclick="deleteNote('${widget.id}', '${note.id}')">×</button>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="add-note-form">
                                <input type="text" class="add-note-input" id="note-input-${widget.id}" placeholder="Введите заметку...">
                                <button class="btn btn-primary" onclick="addNote('${widget.id}', document.getElementById('note-input-${widget.id}').value); document.getElementById('note-input-${widget.id}').value = '';">Добавить</button>
                            </div>
                        </div>
                    `;
                    break;
            }
        }

        widgetElement.innerHTML = `
            <div class="widget-header">
                <h3 class="widget-title">${widget.name}</h3>
                <div class="widget-controls">
                    <button class="widget-control-btn" onclick="openWidgetSettings('${widget.id}')" title="Настройки">⚙️</button>
                    <button class="widget-control-btn" onclick="updateWidget('${widget.id}')" title="Обновить">🔄</button>
                    <button class="widget-control-btn" onclick="removeWidget('${widget.id}')" title="Удалить">🗑️</button>
                </div>
            </div>
            <div class="widget-content">
                ${contentHTML}
            </div>
        `;

        widgetsContainer.appendChild(widgetElement);
    });
}

// Экспорт конфигурации дашборда
function exportDashboard() {
    const dataStr = JSON.stringify(widgets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'dashboard-config.json';
    link.click();
}

// Импорт конфигурации дашборда
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Остановка всех запущенных таймеров
            widgets.forEach(widget => {
                if (widget.type === 'timer' && widget.timerState && widget.timerState.intervalId) {
                    clearInterval(widget.timerState.intervalId);
                }
            });
            
            widgets = importedData;
            saveDashboard();
            renderWidgets();
            
            // Запуск таймеров, если они были активны
            widgets.forEach(widget => {
                if (widget.type === 'timer' && widget.timerState && widget.timerState.isRunning) {
                    startTimer(widget.id);
                }
            });
            
            alert('Конфигурация успешно импортирована!');
        } catch (error) {
            alert('Ошибка при импорте конфигурации: ' + error.message);
        }
    };
    reader.readAsText(file);
    e.target.value = ''; // Сброс значения input
}

// Сброс дашборда
function resetDashboard() {
    if (confirm('Вы уверены, что хотите сбросить дашборд? Все данные будут удалены.')) {
        // Остановка всех таймеров
        widgets.forEach(widget => {
            if (widget.type === 'timer' && widget.timerState && widget.timerState.intervalId) {
                clearInterval(widget.timerState.intervalId);
            }
        });
        
        widgets = [];
        localStorage.removeItem('dashboard');
        
        // Удаление всех заметок
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('notes_')) {
                localStorage.removeItem(key);
            }
        });
        
        renderWidgets();
    }
}

// Запрос разрешения на уведомления при загрузке
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}