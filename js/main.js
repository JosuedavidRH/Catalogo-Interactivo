function checkBrowserChange() {
    // Verifica si ya existe el navegador inicial
    const navegadorInicial = localStorage.getItem('navegadorInicial');
    
    if (!navegadorInicial) {
        // Si navegadorInicial no está configurado, este es el primer navegador
        setTimeout(() => {
            localStorage.setItem('browserID', generateUUID());
            localStorage.setItem('navegadorInicial', 'true'); // Marca este como el navegador inicial
        }, 500);  // Retraso para evitar que active la alerta en la misma sesión
    } else {
        // Si ya existe navegadorInicial pero falta browserID, se asume un navegador nuevo
        if (!localStorage.getItem('browserID')) {
            alert("Estás usando un navegador nuevo. Los datos guardados no estarán disponibles aquí.");
            localStorage.setItem('browserID', generateUUID());
            localStorage.setItem('navegadorInicial', 'true');
        }
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Llama a la función para verificar el cambio de navegador
checkBrowserChange();

// Estado de desbloqueo basado en PIN
let pinCorrecto = false;
const pinRequerido = "1234567"; // Define el PIN correcto

// Función para abrir el enlace en Google Chrome
function abrirEnChrome(url) {
    const chromeIntentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;package=com.android.chrome;scheme=https;end;`;
    window.location.href = chromeIntentUrl;
}

// Función para abrir la segunda página
function abrirSegundaPagina() {
    window.location.href = 'segunda_pagina.html';
}

// Función para redirigir el enlace de Comprar y bloquear el botón
function comprar() {
    resetearTemporizador(); // Reinicia el temporizador a 12 horas
    bloquearBotonComprar(); // Bloquea el botón

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

// Función para mostrar la imagen de pagos
function mostrarImagenPagos() {
    const imgPagos = document.createElement('img');
    imgPagos.src = 'img/pagos.gif';
    imgPagos.id = 'imagen-pagos';
    imgPagos.style.position = 'fixed';
    imgPagos.style.top = '55%';
    imgPagos.style.left = '50%';
    imgPagos.style.transform = 'translate(-50%, -50%)';
    imgPagos.style.zIndex = '1000'; // Asegura que quede superpuesta
    imgPagos.style.width = '110%'; // Ajusta el tamaño de la imagen
    document.body.appendChild(imgPagos);
}

// Función para ocultar la imagen de pagos y guardar el estado en localStorage
function ocultarImagenPagos() {
    const imgPagos = document.getElementById('imagen-pagos');
    if (imgPagos) {
        imgPagos.style.display = 'none'; // Oculta la imagen
        localStorage.setItem('imagenPagosVisible', 'false'); // Guarda el estado de la imagen como no visible
    }
}

// Función para bloquear el botón Comprar y guardar el estado en localStorage
function bloquearBotonComprar() {
    const btnComprar = document.getElementById('btn-comprar');
    btnComprar.disabled = true;
    btnComprar.classList.add('disabled');
    localStorage.setItem('botonComprarBloqueado', 'true'); // Guardar estado de bloqueo en localStorage
}

// Función para habilitar el botón Comprar y guardar el estado en localStorage
function habilitarBotonComprar() {
    const btnComprar = document.getElementById('btn-comprar');
    btnComprar.disabled = false;
    btnComprar.classList.remove('disabled');
    localStorage.removeItem('botonComprarBloqueado'); // Eliminar el estado de bloqueo en localStorage
}

// Función para reiniciar el temporizador a 12 horas
function resetearTemporizador() {
    const countdownTime = 43200000; // 12 horas en milisegundos
    const timerDisplay = document.getElementById('timer');
    timerDisplay.textContent = formatTime(countdownTime); // Mostrar 12 horas inicialmente
    localStorage.removeItem('startTime'); // Borrar el valor en localStorage
}

// Función para mostrar la imagen de falla
function mostrarImagenFalla() {
    const imgFalla = document.createElement('img');
    imgFalla.src = 'img/falla.png'; // Ruta de la imagen
    imgFalla.id = 'imagen-falla';
    imgFalla.style.position = 'fixed';
    imgFalla.style.top = '40%';
    imgFalla.style.left = '50%';
    imgFalla.style.transform = 'translate(-50%, -50%)';
    imgFalla.style.zIndex = '1000'; // Asegura que quede superpuesta
    imgFalla.style.width = '100%'; // Ajusta el tamaño de la imagen (reduce al 50%)
    document.body.appendChild(imgFalla);
}

// Función para ocultar la imagen de falla
function ocultarImagenFalla() {
    const imgFalla = document.getElementById('imagen-falla');
    if (imgFalla) {
        imgFalla.style.display = 'none'; // Oculta la imagen
    }
}

// Función para verificar si el PIN es correcto y habilitar el botón Comprar
function verificarPin() {
    const inputPin = document.getElementById('pin-input').value;
    if (inputPin === pinRequerido) {
        pinCorrecto = true;
        habilitarBotonComprar(); // Habilitar el botón al ingresar el PIN correcto
        ocultarImagenPagos(); // Oculta la imagen de pagos al desbloquear el PIN
        ocultarImagenFalla(); // Oculta la imagen de falla al validar el PIN
        resetearTemporizador(); // Reinicia el temporizador al validar el PIN

        // Guardar indicador de PIN validado en localStorage
        localStorage.setItem('pinValidado', 'true');

        // Alerta de éxito y recarga la página (opcional)
        alert("PIN correcto, puedes proceder a comprar.");
        location.reload(); // Recarga la página para aplicar cambios
    } else {
        alert("PIN incorrecto, intenta nuevamente.");
    }
}

// Función para verificar el estado del localStorage al cargar la página
function verificarEstadoLocalStorage() {
    // Verificación de localStorage para datos de usuario
    const usuarioData = localStorage.getItem('usuarioDatos'); // Cambia 'usuarioDatos' por la clave que necesitas
    if (!usuarioData) {
        alert('Parece que los datos almacenados han sido borrados o no están disponibles.');
        mostrarImagenFalla(); // Muestra la imagen de falla si no hay datos
    }
}

// Función para redirigir el enlace de Precio Tienda
function precioTienda() {
    abrirEnChrome('https://www.polarisoffice.com/d/2RRisCMG');
}

// Función para animar el botón al ser presionado
function animarBoton(idBoton) {
    const boton = document.getElementById(idBoton);
    boton.style.transform = 'scale(0.65)';
    setTimeout(() => {
        boton.style.transform = 'scale(1)';
    }, 250);
}

// Restaurar el estado del botón y de la imagen al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el botón Comprar está bloqueado al recargar la página
    if (localStorage.getItem('botonComprarBloqueado') === 'true') {
        bloquearBotonComprar(); // Si está bloqueado, asegurarse de mantenerlo bloqueado
    } else {
        habilitarBotonComprar(); // Si el PIN ya fue validado, habilitar el botón
    }

    // Verificar si la imagen de pagos debe seguir visible
    if (localStorage.getItem('imagenPagosVisible') === 'true') {
        mostrarImagenPagos();
    }

    // Verificación de localStorage para datos de usuario y si el PIN ha sido validado
    const usuarioData = localStorage.getItem('usuarioDatos');
    const pinValidado = localStorage.getItem('pinValidado');

    // Mostrar la alerta solo si el PIN no ha sido validado y usuarioData está vacío
    if (!usuarioData && !pinValidado) {
        alert('Parece que los datos almacenados han sido borrados o no están disponibles.');
        mostrarImagenFalla(); // Muestra la imagen de falla al mostrar la alerta
    }

    // Asignar las funciones a los eventos click de los botones
    document.getElementById('btn-comprar').addEventListener('click', function() {
        if (!this.disabled) {
            animarBoton('btn-comprar');
            iniciarTemporizador(); // Llama a la función para iniciar el temporizador
            comprar(); // Llama a la función comprar al hacer clic en el botón
        }
    });

    document.getElementById('btn-precio-tienda').addEventListener('click', function() {
        animarBoton('btn-precio-tienda');
        precioTienda();
    });

    // Asignar función al botón para ingresar PIN
    document.getElementById('btn-ingresar-pin').addEventListener('click', function() {
        verificarPin(); // Verifica el PIN ingresado
        animarBoton('btn-ingresar-pin');
    });

    document.getElementById('btn-desbloquear-imagen').addEventListener('click', function() {
        localStorage.setItem('imagenAprobada', 'true'); // Desbloquear la imagen
        alert("Imagen desbloqueada. Refresque la segunda página para ver el cambio."); // Mensaje de confirmación
    });
});