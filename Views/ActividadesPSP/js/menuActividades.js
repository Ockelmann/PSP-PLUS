/// DOCUMENTO RELIZADO POR: Erick Eduardo Echeverría Garrido (EE) 5/08/2021 

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
const formulario = document.querySelector('#formulario');
const actividadesForm = document.querySelector('#actividades');

const alerta = document.querySelector('#alert');

const btnAgregarActividad = document.querySelector('.boton-agregarActividad');
const btnAgregarError = document.querySelector('.boton-agregarError');
const proyectosSelect = document.querySelector('#proyectos-listado');

const tituloProyecto = document.querySelector('.tituloProyecto');
const tiempoProyecto = document.querySelector('#tiempoProyecto');

const fechaInicioFiltrado = document.querySelector('#fechaInicio');
const fechaFinalFiltrado = document.querySelector('#fechaFinal');

window.onload = () => {
    btnAgregarActividad.addEventListener('click', crearActividad);
    btnAgregarError.addEventListener('click', crearError);
    proyectosSelect.addEventListener('change', filtrarActividades);

    fechaInicioFiltrado.addEventListener('change', filtrarActividades);
    fechaFinalFiltrado.addEventListener('change', filtrarActividades);

    obtenerProyectos();
}

function filtrarActividades() {

    eliminarActividades();

    if (proyectosSelect.value == '0') {
        alerta.style.display = 'none';
        cargarActividades();
    } else {

        if (proyectosSelect.value == 'SinProyecto') {
            tituloProyecto.textContent = 'Ningún Proyecto relacionado';
            alerta.style.display = 'none';
            cargarActividadesFiltrado();
        } else {

            if(proyectosSelect.value == ''){
                tituloProyecto.textContent = 'Tiempos PSP';
            }else{
                tituloProyecto.textContent = proyectosSelect.options[proyectosSelect.selectedIndex].textContent;
            }
            alerta.style.display = 'none';
            cargarActividadesFiltrado();
        }
    }
}

async function cargarActividadesFiltrado() {

    mostrarSpinner();

    let direccion;

    if (proyectosSelect.value == 'SinProyecto') {
        direccion = `${URL_Global}/ActividadesPSP?idUsuario=${idUsuario}&actividadesSinProyecto=1&fechaInicioFiltrado=${fechaInicioFiltrado.value}&fechaFinalFiltrado=${fechaFinalFiltrado.value} 23:59:59`;
    } else {
        direccion = `${URL_Global}/ActividadesPSP?idUsuario=${idUsuario}&idProyecto=${proyectosSelect.value}&fechaInicioFiltrado=${fechaInicioFiltrado.value}&fechaFinalFiltrado=${fechaFinalFiltrado.value} 23:59:59`;
    }

    await fetch(direccion, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => resultado)
        .then(actividades => imprimirActividades(actividades))
}

function eliminarActividades() {
    const actividades = document.querySelector('#actividades');

    while (actividades.firstChild) {
        actividades.removeChild(actividades.firstChild);
    }
}

async function obtenerProyectos() {

    mostrarSpinner();

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

    eliminarSpinner();

    proyectos.forEach(proyecto => {
        const { nombre, idProyecto } = proyecto;

        const option = document.createElement('option');
        option.value = idProyecto;
        option.textContent = nombre;
        proyectosSelect.appendChild(option);

    });

    cargarActividades();
}

async function cargarActividades() {
    mostrarSpinner();

    let direccion;

    if(fechaFinalFiltrado.value == ''){
        direccion = `${URL_Global}/ActividadesPSP?idUsuario=${idUsuario}`;
    }else{
        direccion = `${URL_Global}/ActividadesPSP?idUsuario=${idUsuario}&fechaInicioFiltrado=${fechaInicioFiltrado.value}&fechaFinalFiltrado=${fechaFinalFiltrado.value} 23:59:59`;
    }
    
    tituloProyecto.textContent = 'Tiempos PSP';

    await fetch(direccion, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => resultado)
        .then(actividades => imprimirActividades(actividades))
}

function imprimirActividades(actividades) {

    if (actividades.actividades.length == 0 && actividades.errores.length == 0) {
        alerta.style.display = 'block';
    } else {
        alerta.style.display = 'none';
    }

    var actividadesJuntas = actividades.actividades;

    actividadesJuntas = actividadesJuntas.concat(actividades.errores);

    actividadesJuntas = actividadesJuntas.sort((a, b) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime());
    
    eliminarSpinner();

    actividadesJuntas.forEach(actividad => { 

        if(actividad.correlativo){
            const { correlativo, descripcion, fechaHoraInicio, fechaHoraFinal, idErrorPsp, tipoError } = actividad;

            var fechaInicioSplit = fechaHoraInicio.split("T");
            let fechaInicio = fechaInicioSplit[0];
            var HoraInicioSplit = fechaInicioSplit[1].split(":00");
            let horaInicio = HoraInicioSplit[0];

            var fechaFinalSplit = fechaHoraFinal.split("T");
            let fechaFinal = fechaFinalSplit[0];
            var HoraFinalSplit = fechaFinalSplit[1].split(":00");
            let horaFinal = HoraFinalSplit[0];

            if (horaInicio.indexOf(':') == -1) {
                horaInicio = horaInicio + ':00';
            };

            if (horaFinal.indexOf(':') == -1) {
                horaFinal = horaFinal + ':00';
            };

            restarHoras(fechaHoraInicio, fechaHoraFinal);

            actividadesForm.innerHTML += `
            <div class="actividad">
                <img src="./img/separadorActividadErrors.svg">
                <div class="tituloActividad">
                    <h3>${descripcion}</h3>
                </div>
                <div class="acciones">
                    <a onclick="eliminarError(${idErrorPsp})" ><img id="eliminar" src="./img/eliminars.svg"></a>
                    <a href="../ErroresPSP/EditarError.html?error=${idErrorPsp}"><img id="editar" src="./img/editars.svg"></a>
                    <a href="../ErroresPSP/VerError.html?error=${idErrorPsp}"><img id="ver" src="./img/vers.svg"></a>
                </div>
                 <div class="fechaHora d-flex">
                    <h5>${horaInicio}</h5>
                    <h4>${fechaInicio}</h4>
                    <h4>a</h4>
                    <h5>${horaFinal}</h5>
                    <h4>${fechaFinal}</h4>
                </div>  
                
            </div>
            `;

            if(fechaInicioFiltrado.value == '' || fechaInicioFiltrado.value > fechaInicioSplit[0]){
                fechaInicioFiltrado.value = fechaInicioSplit[0];
            }
            
            if(fechaFinalFiltrado.value == '' || fechaFinalFiltrado.value < fechaFinalSplit[0]){
                fechaFinalFiltrado.value = fechaFinalSplit[0];
            }
        }else{
            const { idTiempoPsp, fechaHoraInicio, fechaHoraFinal, descripcion, idProyecto, idUsuario } = actividad;

            var fechaInicioSplit = fechaHoraInicio.split("T");
            let fechaInicio = fechaInicioSplit[0];
            var HoraInicioSplit = fechaInicioSplit[1].split(":00");
            let horaInicio = HoraInicioSplit[0];
    
            var fechaFinalSplit = fechaHoraFinal.split("T");
            let fechaFinal = fechaFinalSplit[0];
            var HoraFinalSplit = fechaFinalSplit[1].split(":00");
            let horaFinal = HoraFinalSplit[0];
    
            if (horaInicio.indexOf(':') == -1) {
                horaInicio = horaInicio + ':00';
            };
    
            if (horaFinal.indexOf(':') == -1) {
                horaFinal = horaFinal + ':00';
            };
    
            restarHoras(fechaHoraInicio, fechaHoraFinal);
    
            actividadesForm.innerHTML += `
            <div class="actividad">
                <img src="./img/separadorActividads.svg">
                <div class="tituloActividad">
                    <h3>${descripcion}</h3>
                </div>
                <div class="acciones">
                    <a onclick="eliminarActividad(${idTiempoPsp})" ><img id="eliminar" src="./img/eliminars.svg"></a>
                    <a href="./EditarActividad.html?actividad=${idTiempoPsp}"><img id="editar" src="./img/editars.svg"></a>
                    <a href="./VerActividad.html?actividad=${idTiempoPsp}"><img id="ver" src="./img/vers.svg"></a>
                </div>
                <div class="fechaHora d-flex">
                    <h5>${horaInicio}</h5>
                    <h4>${fechaInicio}</h4>
                    <h4>a</h4>
                    <h5>${horaFinal}</h5>
                    <h4>${fechaFinal}</h4>
                </div>
                
            </div>
            `;
    
            if(fechaInicioFiltrado.value == '' || fechaInicioFiltrado.value > fechaInicioSplit[0]){
                fechaInicioFiltrado.value = fechaInicioSplit[0];
            }
            
            if(fechaFinalFiltrado.value == '' || fechaFinalFiltrado.value < fechaFinalSplit[0]){
                fechaFinalFiltrado.value = fechaFinalSplit[0];;
            }
        }

    })

    calcularHoras();

}

function calcularHoras() {
    let totalHoras = (Number(sumaDeMinutos) / 60).toFixed(2);

    tiempoProyecto.textContent = 'Tiempo Invertido: ' + totalHoras + ' hrs';

    sumaDeMinutos = 0;
}

let sumaDeMinutos = 0;

function restarHoras(horaInicio, horaFinal) {

    let a = moment(horaFinal);
    let b = moment(horaInicio);

    sumaDeMinutos = sumaDeMinutos + parseInt(a.diff(b, 'minutes'));

}

async function eliminarActividad(idActividad) {
    /*const confirmar = confirm('¿ Desea eliminar la actividad ?');

    if (confirmar) {

        const direccion = `${URL_Global}/ActividadesPSP?idTiempoPSP=${idActividad}`;

        await fetch(direccion, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)
            .then(resultado => {
            })

        alert('Elimando Exitosamente');

    }else{
        return;
    }

    location.reload();*/

    try {
        const {isConfirmed} = await Swal.fire({
            title: 'Eliminar actividad',
            text: "¿Estas seguro que deseas esta actividad?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        })
        if(!isConfirmed){
            return;
        }
        const direccion = `${url}/api/ActividadesPSP?idTiempoPSP=${idActividad}`;

        await fetch(direccion, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)
        Swal.fire('Actividad Eliminada!')
        
    } catch (error) {
        Swal.fire("Problemas a elminiar actividad");
    }
    location.reload();

}

async function eliminarError(idErrorPSP){

    /*const confirmar = confirm('¿ Desea eliminar el error registrado ?');

    if(confirmar){
        const direccion = `${URL_Global}/Errores?idErrorPSP=${idErrorPSP}`;

        await fetch(direccion, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)
            .then(resultado => {
            })

        alert('Elimando Exitosamente');
    }else{
        return;
    }

    location.reload();*/

    try {
        const {isConfirmed} = await Swal.fire({
            title: 'Eliminar Error',
            text: "¿Estas seguro que deseas este error?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        })
        if(!isConfirmed){
            return;
        }
        const direccion = `${url}/api/Errores?idErrorPSP=${idErrorPSP}`;

        await fetch(direccion, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)
        Swal.fire('Error Eliminado!')
        cargarActividades();
        
    } catch (error) {
        Swal.fire("Problemas a elminiar error.");
    }
    location.reload();
}


function crearActividad() {
    window.location.href = ('../MenuAgregarActividadesPSP/menuAgregarActividadPSP.html?actividad=1');
}

function crearError(){
    window.location.href = ('../MenuAgregarActividadesPSP/menuAgregarActividadPSP.html?error=1');
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

function eliminarSpinner() {
    const spinner = document.querySelector('.spinner');

    formulario.removeChild(spinner);
}
