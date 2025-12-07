// Claves para localStorage
const STORAGE_KEY_SALDO = 'alke_saldo';
const STORAGE_KEY_MOVS = 'alke_movimientos';

// Usuario de prueba para el login
const DEMO_EMAIL = 'contacto@bootcamp.cl';
const DEMO_PASS = '1234';

// Helpers de almacenamiento

function getSaldo() {
    const valor = localStorage.getItem(STORAGE_KEY_SALDO);
    return valor ? Number(valor) : 0;
}

function setSaldo(nuevoSaldo) {
    localStorage.setItem(STORAGE_KEY_SALDO, String(nuevoSaldo));
}

function getMovimientos() {
    const data = localStorage.getItem(STORAGE_KEY_MOVS);
    return data ? JSON.parse(data) : [];
}

function setMovimientos(lista) {
    localStorage.setItem(STORAGE_KEY_MOVS, JSON.stringify(lista));
}

// Inicializar valores si no existen
if (localStorage.getItem(STORAGE_KEY_SALDO) === null) {
    setSaldo(0);
}
if (localStorage.getItem(STORAGE_KEY_MOVS) === null) {
    setMovimientos([]);
}

// Detectar página actual

function esPagina(nombre) {
    return window.location.pathname.endsWith(nombre);
}

// LOGIN (login.html)

if (esPagina('login.html')) {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email')?.value.trim();
            const password = document.getElementById('password')?.value.trim();

            if (email === DEMO_EMAIL && password === DEMO_PASS) {
                // Marcamos sesión iniciada (simple)
                sessionStorage.setItem('alke_logged', '1');
                window.location.href = 'menu.html';
            } else {
                // alert('Credenciales incorrectas.\nUsa:\nEmail: ' + DEMO_EMAIL + '\nPass: ' + DEMO_PASS);
                mostrarMensaje("Credenciales incorrectas. Usa:<br>contacto@bootcamp.cl / 1234", "danger");
            }
        });
    }
}

// MENÚ (menu.html) - mostrar saldo

if (esPagina('menu.html')) {
    const saldoElemento = document.getElementById('saldo-actual');
    if (saldoElemento) {
        saldoElemento.textContent = '$' + getSaldo().toLocaleString('es-CL');
    }
}

// DEPÓSITO (deposit.html)

if (esPagina('deposit.html')) {
    const form = document.querySelector('form');
    const inputMonto = document.getElementById('deposit-amount');

    if (form && inputMonto) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const monto = Number(inputMonto.value);

            if (isNaN(monto) || monto <= 0) {
                //alert('Ingresa un monto válido mayor a 0.');
                mostrarMensaje("Debes ingresar un monto válido mayor a 0.", "danger");
                return;
            }

            let saldoActual = getSaldo();
            saldoActual += monto;
            setSaldo(saldoActual);

            const movimientos = getMovimientos();
            movimientos.push({
                fecha: new Date().toLocaleString(),
                tipo: 'Depósito',
                detalle: 'Depósito en cuenta',
                monto: monto
            });
            setMovimientos(movimientos);

            // alert('Depósito exitoso. Nuevo saldo: $' + saldoActual.toLocaleString('es-CL'));
            mostrarMensaje("Depósito exitoso. Nuevo saldo: $" + saldoActual.toLocaleString('es-CL'), "success");
            inputMonto.value = '';
        });
    }
}

// ENVIAR DINERO (sendmoney.html)

if (esPagina('sendmoney.html')) {
    const form = document.querySelector('form');
    const inputContacto = document.getElementById('contact');
    const inputMonto = document.getElementById('send-amount');

    if (form && inputContacto && inputMonto) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const contacto = inputContacto.value.trim();
            const monto = Number(inputMonto.value);
            let saldoActual = getSaldo();

            if (!contacto) {
                // alert('Ingresa un contacto válido.');
                mostrarMensaje("Debes ingresar un contacto válido.", "danger");
                return;
            }

            if (isNaN(monto) || monto <= 0) {
                //alert('Ingresa un monto válido mayor a 0.');
                mostrarMensaje("El monto ingresado no es válido.", "danger");
                return;
            }

            if (monto > saldoActual) {
                // alert('Saldo insuficiente para realizar esta operación.');
                mostrarMensaje("Saldo insuficiente para enviar dinero.", "danger");
                return;
            }

            saldoActual -= monto;
            setSaldo(saldoActual);

            const movimientos = getMovimientos();
            movimientos.push({
                fecha: new Date().toLocaleString(),
                tipo: 'Envío',
                detalle: 'Envío a ' + contacto,
                monto: -monto
            });
            setMovimientos(movimientos);

            // alert('Envío realizado. Nuevo saldo: $' + saldoActual.toLocaleString('es-CL'));
            mostrarMensaje("Envío realizado correctamente. Nuevo saldo: $" + saldoActual.toLocaleString('es-CL'), "success");

            inputMonto.value = '';
            inputContacto.value = '';
        });
    }
}


// HISTORIAL (transactions.html)
if (esPagina('transactions.html')) {
    const tbody = document.getElementById('tabla-movimientos');
    if (tbody) {
        const movimientos = getMovimientos();
        tbody.innerHTML = '';

        movimientos.forEach(m => {
            const tr = document.createElement('tr');

            const tdFecha = document.createElement('td');
            tdFecha.textContent = m.fecha;

            const tdTipo = document.createElement('td');
            tdTipo.textContent = m.tipo;

            const tdDetalle = document.createElement('td');
            tdDetalle.textContent = m.detalle || '-';

            const tdMonto = document.createElement('td');
            tdMonto.textContent = '$' + Math.abs(m.monto).toLocaleString('es-CL');
            tdMonto.style.color = m.monto < 0 ? 'red' : 'green';

            tr.appendChild(tdFecha);
            tr.appendChild(tdTipo);
            tr.appendChild(tdDetalle);
            tr.appendChild(tdMonto);

            tbody.appendChild(tr);
        });
    }
}