// DOCUMENTO RELIZADO POR: Erick Eduardo Echeverría Garrido (EE)

// ---------------------------------- Funciones cookies ----------------------------------
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const stringJWT = Cookies.get('jwt');
let jwt;

if (stringJWT) {
    jwt = parseJwt(stringJWT);
}

function CerrarSesion() {
    Cookies.remove('jwt');
};

const idUsuario = jwt.sub;
// ---------------------------------- FIN Funciones cookies ----------------------------------

// SELECTORES
const alerta = document.querySelector('#alert');
const alertaFechasIncorrectas = document.querySelector('#alert2');

const formulario = document.querySelector('#formulario');
const descripcionInput = document.querySelector('#descripcion');
const solucionInput = document.querySelector('#solucion');
const correlativoInput = document.querySelector('#correlativo');
const tipoErrorSelect = document.querySelector('#tipoErrores-listado');
const etapasIntroducidoSelect = document.querySelector('#etapasIntroducido-listado');
const etapasEliminadoSelect = document.querySelector('#etapasEliminado-listado');
const lenguajeInput = document.querySelector('#lenguaje');
const fechaHoraInicioInput = document.querySelector('#fechaHoraInicio');
const fechaHoraFinalInput = document.querySelector('#fechaHoraFinal');
const proyectosSelect = document.querySelector('#proyectos-listado');

let tiempoCorrecion;


window.onload = () => {
    obtenerProyectos();
    proyectosSelect.addEventListener("change", obtenerCorrelativo);
}

function obtenerCorrelativo(){

    if(proyectosSelect.value == '0'){
        correlativoInput.value = 1;

        return;
    }

    const direccion = `${URL_Global}/Errores?idProyecto=${proyectosSelect.value}`;

    fetch(direccion, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => resultado)
        .then(correlativo => mostrarCorrelativo(correlativo))
}
function mostrarCorrelativo(maxCorrelativo){
    correlativoInput.value = maxCorrelativo + 1;
}

async function obtenerProyectos() {
    const direccion = `${URL_Global}/ActividadesPSP?idUsuario=${idUsuario}&buscarProyecto=1`;

    await fetch(direccion, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => resultado)
        .then(proyectos => selectProyecto(proyectos))
}

function selectProyecto(proyectos) {
    proyectos.forEach(proyecto => {
        const { nombre, idProyecto } = proyecto;

        const option = document.createElement('option');
        option.value = idProyecto;
        option.textContent = nombre;
        proyectosSelect.appendChild(option);

    })
}

function validarDatos() {
    if (descripcionInput.value == '' || solucionInput.value == '' || correlativoInput.value == '' || tipoErrorSelect.value == '' || etapasIntroducidoSelect.value == '' || etapasEliminadoSelect.value == '' || lenguajeInput.value == '' || fechaHoraInicioInput.value == '' || fechaHoraFinalInput.value == '' || proyectosSelect.value == '') {

        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    }

    if (fechaHoraInicioInput.value > fechaHoraFinalInput.value) {
        alertaFechasIncorrectas.style.display = 'block';

        setTimeout(() => {
            alertaFechasIncorrectas.style.display = 'none';
        }, 3000);

        return;
    }

    agregarError();
}

async function agregarError() {

    calcularTiempoDeCorrecion();

    mostrarSpinner();

    let direccion;

    if (proyectosSelect.value == '0') {
        direccion = `${URL_Global}/Errores?fecha=${fechaHoraInicioInput.value}&descripcion=${descripcionInput.value}&solucion=${solucionInput.value}&correlativo=${correlativoInput.value}&tipoError=${tipoErrorSelect.value}&introducido=${etapasIntroducidoSelect.value}&eliminado=${etapasEliminadoSelect.value}&fechaHoraInicio=${fechaHoraInicioInput.value}&fechaHoraFinal=${fechaHoraFinalInput.value}&tiempoCorrecion=${tiempoCorrecion}&lenguaje=${lenguajeInput.value}&idUsuario=${idUsuario}`;
    } else {
        direccion = `${URL_Global}/Errores?fecha=${fechaHoraInicioInput.value}&descripcion=${descripcionInput.value}&solucion=${solucionInput.value}&correlativo=${correlativoInput.value}&tipoError=${tipoErrorSelect.value}&introducido=${etapasIntroducidoSelect.value}&eliminado=${etapasEliminadoSelect.value}&fechaHoraInicio=${fechaHoraInicioInput.value}&fechaHoraFinal=${fechaHoraFinalInput.value}&tiempoCorrecion=${tiempoCorrecion}&lenguaje=${lenguajeInput.value}&idProyecto=${proyectosSelect.value}&idUsuario=${idUsuario}`;
    }

    await fetch(direccion, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta)
        .then(resultado => {
        })

    window.location.href = (`../ActividadesPSP/MenuActividades.html`);
}

function calcularTiempoDeCorrecion(){

    let a = moment(fechaHoraInicioInput.value);
    let b = moment(fechaHoraFinalInput.value);

    tiempoCorrecion = parseInt(b.diff(a, 'minutes'));
}

function mostrarSpinner() {

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    formulario.appendChild(spinner);
}