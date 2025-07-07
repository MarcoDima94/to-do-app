document.addEventListener('DOMContentLoaded', () => {

    // === STATO E DATI ===
    let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || {
        lavoro: [],
        casa: [],
        spesa: [],
        appuntamenti: []
    };
    const saveTasks = () => localStorage.setItem('todo_tasks', JSON.stringify(tasks));

    // === UTILITY PER LA NAVIGAZIONE E FEEDBACK ===
    const allViews = document.querySelectorAll('.view');
    let currentView = 'home-view';

    const triggerVibration = () => {
        if (navigator.vibrate) navigator.vibrate(50);
    };
    
    const navigateTo = (viewId) => {
        triggerVibration();
        const targetView = document.getElementById(viewId);
        const currentViewElement = document.getElementById(currentView);

        if (currentViewElement && currentViewElement !== targetView) {
            currentViewElement.classList.add('exiting');
            currentViewElement.addEventListener('animationend', () => {
                currentViewElement.classList.remove('active', 'exiting');
            }, { once: true });
        }
        
        targetView.classList.add('active');
        currentView = viewId;
    };

    // === CREAZIONE TEMPLATE HTML DINAMICI ===
    const createViewContent = (category, title, placeholder) => {
        const view = document.getElementById(`${category}-view`);
        view.innerHTML = `
            <header class="view-header">
                <button class="back-btn" data-target="home-view">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
                </button>
                <h1>${title}</h1>
            </header>
            <div class="app-content">
                <form id="${category}-form" class="task-form">
                    <input type="text" placeholder="${placeholder}" required>
                    <button type="submit" class="add-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14m-7-7h14"></path></svg>
                    </button>
                </form>
                <ul id="${category}-list" class="task-list"></ul>
            </div>
        `;
    };

    const createAppointmentViewContent = () => {
        const view = document.getElementById('appuntamenti-view');
        view.innerHTML = `
            <header class="view-header">
                <button class="back-btn" data-target="home-view">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
                </button>
                <h1>Appuntamenti</h1>
            </header>
            <div class="app-content">
                <form id="appuntamenti-form" class="task-form">
                    <div class="input-with-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                        <input type="text" id="appointment-text" placeholder="Descrivi l'evento..." required>
                    </div>

                    <div class="input-with-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <input type="text" id="appointment-date" class="date-time-input placeholder-visible" value="Data" required>
                    </div>

                    <div class="input-with-icon">
                        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <input type="text" id="appointment-time" class="date-time-input placeholder-visible" value="Ora" required>
                    </div>

                    <button type="submit" class="add-btn full-width-btn">Aggiungi Appuntamento</button>
                </form>
                <ul id="appuntamenti-list" class="task-list"></ul>
            </div>
        `;
    };


    // === LOGICA DI RENDER ===
    const renderTasks = () => {
        ['lavoro', 'casa', 'spesa'].forEach(category => {
            const list = document.getElementById(`${category}-list`);
            if (!list) return;
            list.innerHTML = '';
            tasks[category].forEach(task => list.appendChild(createTaskElement(task, category)));
        });

        const apptList = document.getElementById('appuntamenti-list');
        if (apptList) {
            apptList.innerHTML = '';
            tasks.appuntamenti
                .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
                .forEach(appt => apptList.appendChild(createAppointmentElement(appt)));
        }
    };
    
    // === CREAZIONE ELEMENTI LISTA ===
    const createDeleteButton = (id, category) => {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6"></path></svg>';
        deleteBtn.onclick = () => {
            triggerVibration();
            tasks[category] = tasks[category].filter(item => item.id !== id);
            saveTasks();
            renderTasks();
        };
        return deleteBtn;
    };
    
    const createTaskElement = (task, category) => {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.appendChild(createDeleteButton(task.id, category));
        return li;
    };
    
    const createAppointmentElement = (appt) => {
        const li = document.createElement('li');
        const details = document.createElement('div');
        details.className = 'appointment-details';
        
        const date = new Date(appt.dateTime);
        const dateString = date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
        const timeString = date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

        details.innerHTML = `
            <span class="appointment-date">${dateString} - ${timeString}</span>
            <span class="appointment-text">${appt.text}</span>
        `;
        li.appendChild(details);
        li.appendChild(createDeleteButton(appt.id, 'appuntamenti'));
        return li;
    };

    // === GESTIONE EVENTI ===
    const handleSimpleTaskSubmit = (event, category) => {
        event.preventDefault();
        const input = event.target.querySelector('input');
        if (input.value.trim() === '') return;
        
        tasks[category].push({ id: Date.now(), text: input.value.trim() });
        input.value = '';
        saveTasks();
        renderTasks();
    };

    document.body.addEventListener('submit', (e) => {
        if (e.target.matches('#lavoro-form')) handleSimpleTaskSubmit(e, 'lavoro');
        if (e.target.matches('#casa-form')) handleSimpleTaskSubmit(e, 'casa');
        if (e.target.matches('#spesa-form')) handleSimpleTaskSubmit(e, 'spesa');

        if (e.target.matches('#appuntamenti-form')) {
            e.preventDefault();
            const textInput = document.getElementById('appointment-text');
            const dateInput = document.getElementById('appointment-date');
            const timeInput = document.getElementById('appointment-time');

            if (!textInput.value.trim() || dateInput.type === 'text' || timeInput.type === 'text') return;

            const fullDateTime = `${dateInput.value}T${timeInput.value}`;
            tasks.appuntamenti.push({
                id: Date.now(),
                text: textInput.value.trim(),
                dateTime: fullDateTime
            });
            textInput.value = '';
            dateInput.value = 'Data'; dateInput.type = 'text'; dateInput.classList.add('placeholder-visible');
            timeInput.value = 'Ora'; timeInput.type = 'text'; timeInput.classList.add('placeholder-visible');
            saveTasks();
            renderTasks();
        }
    });

    document.body.addEventListener('focus', (e) => {
        const target = e.target;
        if (target.matches('#appointment-date')) {
            target.type = 'date';
            target.classList.remove('placeholder-visible');
            if (target.value === 'Data') target.value = '';
        }
        if (target.matches('#appointment-time')) {
            target.type = 'time';
            target.classList.remove('placeholder-visible');
            if (target.value === 'Ora') target.value = '';
        }
    }, true);

    document.body.addEventListener('blur', (e) => {
        const target = e.target;
        if (target.matches('#appointment-date') && !target.value) {
            target.type = 'text';
            target.value = 'Data';
            target.classList.add('placeholder-visible');
        }
        if (target.matches('#appointment-time') && !target.value) {
            target.type = 'text';
            target.value = 'Ora';
            target.classList.add('placeholder-visible');
        }
    }, true);
    
    document.body.addEventListener('click', (e) => {
        const categoryBtn = e.target.closest('.category-btn');
        const backBtn = e.target.closest('.back-btn');

        if (categoryBtn) {
            navigateTo(categoryBtn.dataset.target);
            renderTasks();
        }
        if (backBtn) {
            navigateTo(backBtn.dataset.target);
        }
    });

    // === INIZIALIZZAZIONE APP ===
    const init = () => {
        createViewContent('lavoro', 'Lavoro', 'Nuova attività di lavoro...');
        createViewContent('casa', 'Casa', 'Nuova faccenda domestica...');
        createViewContent('spesa', 'Spesa', 'Aggiungi alla lista...');
        createAppointmentViewContent();
    };
    
    init();
});