document.addEventListener('DOMContentLoaded', () => {
    // --- GESTIONE DELLA NAVIGAZIONE ---
    const allViews = document.querySelectorAll('.view');
    const navButtons = document.querySelectorAll('.svg-btn'); 
    const backButtons = document.querySelectorAll('.back-btn');

    const navigateTo = (viewId) => {
        allViews.forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
    };

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.target;
            const shape = button.querySelector('.button-shape');

            // Aggiunge la classe per avviare l'animazione CSS
            shape.classList.add('animating-stroke');
            
            // Imposta un ritardo di 1 secondo
            setTimeout(() => {
                // Esegue la navigazione
                navigateTo(targetView);
                
                // Rimuove la classe per permettere all'animazione di ripetersi
                shape.classList.remove('animating-stroke');
            }, 1000); 
        });
    });

    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            navigateTo('home-view');
        });
    });

    // --- GESTIONE DELLE ATTIVITÀ (ToDo) ---
    const lavoroForm = document.getElementById('lavoro-form');
    const casaForm = document.getElementById('casa-form');
    const lavoroList = document.getElementById('lavoro-list');
    const casaList = document.getElementById('casa-list');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || { lavoro: [], casa: [] };
    const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

    const renderTasks = () => {
        lavoroList.innerHTML = '';
        casaList.innerHTML = '';
        tasks.lavoro.forEach((text, i) => {
            lavoroList.appendChild(createTaskElement(text, 'lavoro', i));
        });
        tasks.casa.forEach((text, i) => {
            casaList.appendChild(createTaskElement(text, 'casa', i));
        });
    };

    const createTaskElement = (text, category, index) => {
        const li = document.createElement('li');
        const taskText = document.createElement('span');
        taskText.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑️'; // Icona cestino aggiornata
        deleteBtn.onclick = () => {
            tasks[category].splice(index, 1);
            saveTasks();
            renderTasks();
        };

        li.appendChild(taskText);
        li.appendChild(deleteBtn);
        return li;
    };

    lavoroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = lavoroForm.querySelector('input');
        if (input.value.trim() === '') return;
        tasks.lavoro.push(input.value.trim());
        input.value = '';
        saveTasks();
        renderTasks();
    });

    casaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = casaForm.querySelector('input');
        if (input.value.trim() === '') return;
        tasks.casa.push(input.value.trim());
        input.value = '';
        saveTasks();
        renderTasks();
    });
    
    renderTasks();
});