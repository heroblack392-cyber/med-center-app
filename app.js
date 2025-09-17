// Данные о специалистах
const specialists = [
    {
        id: 1,
        name: "Иванов Алексей Петрович",
        category: "doctors",
        specialty: "Терапевт высшей категории",
        experience: "12 лет",
        schedule: ["09:00", "10:30", "12:00", "15:00", "16:30"],
        icon: "fas fa-user-md"
    },
    {
        id: 2,
        name: "Смирнова Елена Владимировна",
        category: "doctors",
        specialty: "Кардиолог, к.м.н.",
        experience: "15 лет",
        schedule: ["10:00", "11:30", "14:00", "15:30", "17:00"],
        icon: "fas fa-heartbeat"
    },
    {
        id: 3,
        name: "Петров Дмитрий Игоревич",
        category: "doctors",
        specialty: "Невролог",
        experience: "9 лет",
        schedule: ["09:30", "11:00", "13:30", "15:00", "16:30"],
        icon: "fas fa-brain"
    },
    {
        id: 4,
        name: "Соколова Мария Александровна",
        category: "masseurs",
        specialty: "Массажист высшей категории",
        experience: "7 лет",
        schedule: ["10:00", "11:30", "14:00", "16:00", "17:30"],
        icon: "fas fa-spa"
    },
    {
        id: 5,
        name: "Кузнецов Андрей Викторович",
        category: "masseurs",
        specialty: "Спортивный массажист",
        experience: "10 лет",
        schedule: ["09:00", "10:30", "13:00", "15:00", "16:30"],
        icon: "fas fa-running"
    },
    {
        id: 6,
        name: "Никитин Сергей Олегович",
        category: "instructors",
        specialty: "Инструктор ЛФК",
        experience: "8 лет",
        schedule: ["09:30", "11:00", "14:30", "16:00", "17:30"],
        icon: "fas fa-dumbbell"
    },
    {
        id: 7,
        name: "Федорова Ольга Дмитриевна",
        category: "instructors",
        specialty: "Реабилитолог",
        experience: "11 лет",
        schedule: ["10:00", "12:00", "14:00", "16:00", "18:00"],
        icon: "fas fa-heart"
    }
];

// Текущий выбранный специалист и время
let selectedSpecialist = null;
let selectedTime = null;

// Статус администратора
let isAdminLoggedIn = false;

// Функция для показа уведомлений
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.background = type === 'error' ? '#e74c3c' : '#2c3e50';
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Функция для переключения между разделами
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Обновляем навигацию
    const activeNav = Array.from(document.querySelectorAll('.nav-item')).find(
        item => item.onclick && item.onclick.toString().includes(sectionId)
    );
    if (activeNav) activeNav.classList.add('active');
    
    // Загружаем данные для секции
    if (sectionId === 'home' || sectionId === 'appointments') {
        loadAppointments();
    }
}

// Выбор специалиста
function selectSpecialist(specialistId) {
    selectedSpecialist = specialistId;
    document.getElementById('time-selection').style.display = 'block';
    document.getElementById('booking-form').style.display = 'none';
    
    // Прокрутка к выбору времени
    setTimeout(() => {
        document.getElementById('time-selection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 300);
}

// Выбор времени
function selectTime(element, time) {
    selectedTime = time;
    
    // Снятие выделения со всех слотов
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Выделение выбранного слота
    element.classList.add('selected');
    
    // Показать форму для заполнения данных
    document.getElementById('booking-form').style.display = 'block';
    
    // Установка даты (завтрашний день)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('appointment-date').value = tomorrow.toISOString().split('T')[0];
    
    // Прокрутка к форме
    setTimeout(() => {
        document.getElementById('booking-form').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
    }, 300);
}

// Загрузка записей
function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    
    // Предстоящие записи
    const upcoming = appointments.filter(app => {
        const appDate = new Date(app.date);
        const today = new Date();
        return appDate >= today;
    });
    
    // Прошедшие записи
    const history = appointments.filter(app => {
        const appDate = new Date(app.date);
        const today = new Date();
        return appDate < today;
    });
    
    // Отображаем предстоящие записи
    const upcomingList = document.getElementById('upcoming-list');
    const upcomingHome = document.getElementById('upcoming-appointments');
    
    if (upcoming.length === 0) {
        upcomingList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px;">Нет предстоящих записей</p>';
        upcomingHome.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 10px;">Нет предстоящих визитов</p>';
    } else {
        upcomingList.innerHTML = upcoming.map(app => `
            <div class="appointment-card slide-up">
                <div class="appointment-date">${new Date(app.date).toLocaleDateString()}, ${app.time}</div>
                <div class="appointment-doctor">${app.specialist} - ${app.specialty}</div>
                <span class="appointment-status status-${app.status}">${getStatusText(app.status)}</span>
                <button onclick="cancelAppointment(${app.id})" style="margin-top: 10px; background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">
                    <i class="fas fa-times"></i> Отменить
                </button>
            </div>
        `).join('');
        
        // Для главной страницы показываем только ближайшие 2 записи
        const recentUpcoming = upcoming.slice(0, 2);
        upcomingHome.innerHTML = recentUpcoming.map(app => `
            <div class="appointment-card slide-up">
                <div class="appointment-date">${new Date(app.date).toLocaleDateString()}, ${app.time}</div>
                <div class="appointment-doctor">${app.specialist}</div>
                <span class="appointment-status status-${app.status}">${getStatusText(app.status)}</span>
            </div>
        `).join('');
    }
    
    // Отображаем историю записей
    const historyList = document.getElementById('history-list');
    if (history.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #7f8c8d; padding: 20px;">Нет записей в истории</p>';
    } else {
        historyList.innerHTML = history.map(app => `
            <div class="appointment-card slide-up">
                <div class="appointment-date">${new Date(app.date).toLocaleDateString()}, ${app.time}</div>
                <div class="appointment-doctor">${app.specialist} - ${app.specialty}</div>
                <span class="appointment-status status-${app.status}">${getStatusText(app.status)}</span>
            </div>
        `).join('');
    }
}

// Текст статуса
function getStatusText(status) {
    const statuses = {
        'pending': 'Ожидание',
        'confirmed': 'Подтверждено',
        'cancelled': 'Отменено'
    };
    return statuses[status] || status;
}

// Отмена записи
function cancelAppointment(id) {
    let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    appointments = appointments.map(app => 
        app.id === id ? {...app, status: 'cancelled'} : app
    );
    localStorage.setItem('appointments', JSON.stringify(appointments));
    showToast('Запись отменена');
    loadAppointments();
}

// Подтверждение записи
function confirmBooking() {
    if (!selectedSpecialist || !selectedTime) {
        showToast('Пожалуйста, выберите специалиста и время', 'error');
    }
}

// ===== ФУНКЦИИ АДМИНИСТРАТОРА ===== //

function openAdminLogin() {
    alert('Форма входа администратора будет здесь!');
    // Здесь потом добавим модальное окно
}

// ===== ИНИЦИАЛИЗАЦИЯ ===== //

document.addEventListener('DOMContentLoaded', function() {
    // Установка минимальной даты для записи (завтра)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('appointment-date').min = tomorrow.toISOString().split('T')[0];
    
    // Загрузка записей
    loadAppointments();
    
    // Обработка иконки уведомлений
    document.getElementById('notifications-icon').addEventListener('click', function() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const pendingCount = appointments.filter(app => app.status === 'pending').length;
        
        if (pendingCount > 0) {
            showToast(`У вас ${pendingCount} ожидающих подтверждения записей`);
        } else {
            showToast('У вас нет новых уведомлений');
        }
    });
    
    // Обработчик иконки администратора
    const adminBtn = document.getElementById('admin-login-btn');
    if (adminBtn) {
        adminBtn.addEventListener('click', openAdminLogin);
        console.log('Обработчик администратора добавлен');
    } else {
        console.log('Иконка администратора не найдена');
    }
    
    // Запрос разрешения на уведомления
    if ('Notification' in window) {
        Notification.requestPermission();
    }
});

// Глобальные функции для обработчиков onclick
window.showSection = showSection;
window.selectSpecialist = selectSpecialist;
window.selectTime = selectTime;
window.confirmBooking = confirmBooking;
window.cancelAppointment = cancelAppointment;
window.openAdminLogin = openAdminLogin;
