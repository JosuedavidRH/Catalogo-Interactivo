const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn'); // Botón para iniciar el temporizador
const resetBtn = document.getElementById('resetBtn'); // Botón para reiniciar el temporizador
const countdownTime = 43200000; // 12 horas
let startTime;
let timerInterval;

// Formatea el tiempo en horas, minutos y segundos
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Actualiza el temporizador
function updateTimer() {
    const elapsed = Date.now() - startTime;
    const remaining = countdownTime - elapsed;
    if (remaining <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = '00:00:00';
        localStorage.removeItem('startTime');
        habilitarBotonComprar(); // Habilita el botón Comprar al llegar a cero
        mostrarImagenBloqueo(); // Muestra la imagen de bloqueo
    } else {
        timerDisplay.textContent = formatTime(remaining);
    }
}

// Inicia el temporizador
function iniciarTemporizador() {
    startTime = Date.now();
    localStorage.setItem('startTime', startTime);
    timerInterval = setInterval(updateTimer, 1000);
}

// Reinicia el temporizador a 30 segundos
function resetearTemporizador() {
    clearInterval(timerInterval);
    timerDisplay.textContent = formatTime(countdownTime); // Mostrar 30 segundos inicialmente
    localStorage.removeItem('startTime'); // No guardar el tiempo de inicio
    ocultarImagenBloqueo(); // Ocultar la imagen de bloqueo si se reinicia
}


// Función para mostrar la imagen de bloqueo
function mostrarImagenBloqueo() {
    const imgBloqueo = document.createElement('img');
    imgBloqueo.src = 'img/bloqueo.png';
    imgBloqueo.id = 'imagen-bloqueo';
    imgBloqueo.style.position = 'fixed';
    imgBloqueo.style.top = '50%';
    imgBloqueo.style.left = '50%';
    imgBloqueo.style.transform = 'translate(-50%, -70%)';
    imgBloqueo.style.zIndex = '1000'; // Asegura que quede superpuesta
    document.body.appendChild(imgBloqueo);
    localStorage.setItem('imagenBloqueoVisible', 'true'); // Guardar estado de visibilidad
}

// Función para ocultar la imagen de bloqueo
function ocultarImagenBloqueo() {
    const imgBloqueo = document.getElementById('imagen-bloqueo');
    if (imgBloqueo) {
        imgBloqueo.remove(); // Oculta la imagen
        localStorage.removeItem('imagenBloqueoVisible'); // Eliminar el estado de visibilidad
    }
}

// Esta función se ejecutará cuando se presione el botón "Comprar"
function comprar() {
    resetearTemporizador(); // Reiniciar el temporizador a 30 segundos
    bloquearBotonComprar(); // Bloquear el botón
    iniciarTemporizador(); // Iniciar el temporizador al hacer clic en "Comprar"

    // Guardar en localStorage el estado de la redirección
    localStorage.setItem('redirigidoAPaginaSegunda', 'true');

    // Evitar que el usuario regrese a index.html
    history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        history.pushState(null, '', window.location.href);
    };

    localStorage.setItem('iniciarTemporizadorSegundaPagina', 'true'); // Establece el valor en localStorage
    abrirSegundaPagina(); // Redirige a la segunda página después de iniciar el temporizador

    // Mostrar imagen de pagos y guardar estado en localStorage
    mostrarImagenPagos();
    localStorage.setItem('imagenPagosVisible', 'true');
}

// Cuando se carga la ventana, recupera el estado del temporizador y la imagen de bloqueo
window.addEventListener('load', () => {
    const storedStartTime = localStorage.getItem('startTime');
    if (storedStartTime) {
        startTime = parseInt(storedStartTime);
        const elapsed = Date.now() - startTime;
        const remaining = countdownTime - elapsed;
        if (remaining > 0) {
            timerDisplay.textContent = formatTime(remaining);
            timerInterval = setInterval(updateTimer, 1000);
        } else {
            timerDisplay.textContent = '00:00:00';
            localStorage.removeItem('startTime');
            mostrarImagenBloqueo(); // Muestra la imagen de bloqueo al cargar si el tiempo ha expirado
        }
    } else {
        timerDisplay.textContent = formatTime(countdownTime); // Mostrar 30 segundos si el temporizador no ha iniciado
    }

    // Verifica si la imagen de bloqueo debe estar visible
    if (localStorage.getItem('imagenBloqueoVisible') === 'true') {
        mostrarImagenBloqueo(); // Muestra la imagen si el estado está guardado
    }
});

// Función para habilitar el botón Comprar
function habilitarBotonComprar() {
    const btnComprar = document.getElementById('btn-comprar');
    btnComprar.disabled = false;
    btnComprar.classList.remove('disabled');
    localStorage.removeItem('botonComprarBloqueado');
}
