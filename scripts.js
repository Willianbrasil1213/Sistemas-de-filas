// Função para salvar os dados do paciente no localStorage
function savePatientToLocalStorage(patient) {
    try {
        // Verifica se já existem pacientes salvos no localStorage
        const storedPatients = localStorage.getItem('patients');
        let patients = [];
        if (storedPatients) {
            patients = JSON.parse(storedPatients);
        }
        // Adiciona o novo paciente à lista de pacientes
        patients.push(patient);
        // Salva a lista atualizada no localStorage
        localStorage.setItem('patients', JSON.stringify(patients));

        // Mostra a notificação
        showNotification(`Você foi registrado na fila. Sua posição na fila é ${patients.length}.`, 10000);
    } catch (error) {
        console.error('Erro ao salvar paciente no localStorage:', error);
    }
}

// Função para carregar os pacientes do localStorage quando a página é carregada
window.addEventListener('load', loadPatientsFromLocalStorage);

function loadPatientsFromLocalStorage() {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
        const parsedPatients = JSON.parse(storedPatients);
        queue.push(...parsedPatients);
        updateQueueDisplay();
    }
}

// Restante do seu código JavaScript...

document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const priority = document.getElementById('priority').checked;

    const patient = {
        firstName,
        lastName,
        priority
    };

    addPatientToQueue(patient);

    // Salva os dados do paciente no localStorage
    savePatientToLocalStorage(patient);

    document.getElementById('patientForm').reset();
});


const queue = [];

function addPatientToQueue(patient) {
    queue.push(patient);
    updateQueueDisplay();
}

function updateQueueDisplay() {
    const queueList = document.getElementById('queue');
    queueList.innerHTML = '';

    const sortedQueue = [...queue].sort((a, b) => b.priority - a.priority);

    sortedQueue.forEach((patient, index) => {
        const listItem = document.createElement('li');
        
        const patientInfo = document.createElement('span');
        patientInfo.textContent = `${patient.firstName} ${patient.lastName} ${patient.priority ? '(Prioridade)' : ''}`;

        const guicheSelect = document.createElement('select');
        guicheSelect.innerHTML = `
            <option value="1">Guichê 1</option>
            <option value="2">Guichê 2</option>
            <option value="3">Guichê 3</option>
            <option value="4">Guichê 4</option>
        `;

        const callButton = document.createElement('button');
        callButton.textContent = 'Chamar';
        callButton.addEventListener('click', () => callPatient(index, guicheSelect.value));

        const registerTime = document.createElement('small');
        registerTime.textContent = `Registrado às ${getFormattedTime()}`;

        listItem.appendChild(patientInfo);
        listItem.appendChild(guicheSelect);
        listItem.appendChild(callButton);
        listItem.appendChild(registerTime);
        queueList.appendChild(listItem);
    });
}

function callPatient(index, guiche) {
    if (!guiche) {
        alert('Por favor, informe o número do guichê.');
        return;
    }

    const calledPatient = queue.splice(index, 1)[0];
    calledPatient.guiche = guiche;
    updateQueueDisplay();
    displayCalledPatient(calledPatient);
}

function displayCalledPatient(patient) {
    const currentCalledList = document.getElementById('currentCalledList');
    const listItem = document.createElement('li');
    listItem.textContent = `${patient.firstName} ${patient.lastName} - Guichê: ${patient.guiche}`;
    currentCalledList.innerHTML = ''; // Limpa a lista atual
    currentCalledList.appendChild(listItem);

    // Remover o paciente chamado após um tempo
    setTimeout(() => {
        // Move o paciente chamado atualmente para o histórico
        const previousCalledList = document.getElementById('previousCalledList');
        listItem.textContent = `${patient.firstName} ${patient.lastName} - Guichê: ${patient.guiche}`;
        previousCalledList.prepend(listItem);

        // Limpa a lista atual
        currentCalledList.innerHTML = '';
    }, 30000); // 30 segundos = 30000 milissegundos
}

function showSection(sectionId) {
    document.getElementById('register-section').style.display = 'none';
    document.getElementById('call-section').style.display = 'none';
    document.getElementById('called-section').style.display = 'none';

    document.getElementById(sectionId).style.display = 'block';
}

function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Adicione esta linha no final do seu código JavaScript
setInterval(clearPreviousCalledList, 60000); // 1 minuto = 60000 milissegundos

function clearPreviousCalledList() {
    const previousCalledList = document.getElementById('previousCalledList');
    previousCalledList.innerHTML = ''; // Limpa o histórico de chamadas
}
function showSection(sectionId) {
    const sections = document.querySelectorAll('.container'); // Seleciona todas as seções com a classe 'container'
    sections.forEach(section => { // Percorre todas as seções
        if (section.id === sectionId) { // Se a seção atual tiver o mesmo ID que o parâmetro sectionId
            section.style.display = 'block'; // Exibe a seção
        } else {
            section.style.display = 'none'; // Oculta as outras seções
        }
    });
}

document.getElementById('link-register').addEventListener('click', function() {
    showSection('register-section');
});

document.getElementById('link-call').addEventListener('click', function() {
    showSection('call-section');
});

document.getElementById('link-called').addEventListener('click', function() {
    showSection('called-section');
});

function showNotification(message, duration = 3000) {
    const notificationContainer = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    notification.style.display = 'block';

    // Define um temporizador para remover a notificação após a duração especificada
    setTimeout(() => {
        notification.style.display = 'none';
        notificationContainer.removeChild(notification);
    }, duration);
}