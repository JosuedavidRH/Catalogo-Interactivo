const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const countdownTime = 30000; // 30 segundos en milisegundos
let startTime;
let timerInterval;

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `00:${seconds}`;
}

function updateTimer() {
    const elapsed = Date.now() - startTime;
    const remaining = countdownTime - elapsed;

    if (remaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = '00:00';
        localStorage.removeItem('startTimeSegundaPagina');
        localStorage.removeItem('temporizadorActivo');
        window.location.href = 'index.html'; // Redirecciona cuando llega a cero
    } else {
        timerDisplay.textContent = formatTime(remaining);
    }
}

function iniciarTemporizador() {
    clearInterval(timerInterval); // Asegura que no haya temporizadores activos
    startTime = Date.now();
    localStorage.setItem('startTimeSegundaPagina', startTime);
    localStorage.setItem('temporizadorActivo', 'true');
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

function resetearTemporizador() {
    clearInterval(timerInterval);
    timerDisplay.textContent = '00:30';
    localStorage.removeItem('startTimeSegundaPagina');
    localStorage.removeItem('temporizadorActivo');
}

// Verifica y reactiva el temporizador al cargar la página
window.addEventListener('load', () => {
    const storedStartTime = localStorage.getItem('startTimeSegundaPagina');
    const temporizadorActivo = localStorage.getItem('temporizadorActivo');

    if (storedStartTime && temporizadorActivo === 'true') {
        startTime = parseInt(storedStartTime);
        const elapsed = Date.now() - startTime;
        const remaining = countdownTime - elapsed;

        if (remaining > 0) {
            timerDisplay.textContent = formatTime(remaining);
            timerInterval = setInterval(updateTimer, 1000);
        } else {
            timerDisplay.textContent = '00:00';
            localStorage.removeItem('startTimeSegundaPagina');
            localStorage.removeItem('temporizadorActivo');
            window.location.href = 'index.html'; // Redirecciona si el tiempo se agotó
        }
    } else {
        iniciarTemporizador(); // Inicia el temporizador si no hay uno activo
    }
});

// Listener para el botón comprar
document.getElementById('buyBtn').addEventListener('click', () => {
    if (localStorage.getItem('temporizadorActivo') === 'true') {
        // Si el temporizador está activo, redirige
        window.location.href = 'index.html';
    } else {
        alert('El temporizador ya no está activo.'); // Opcional, notifica al usuario
    }
});

// Listeners para los botones de iniciar y resetear el temporizador
startBtn.addEventListener('click', () => {
    iniciarTemporizador();
});

resetBtn.addEventListener('click', resetearTemporizador);
