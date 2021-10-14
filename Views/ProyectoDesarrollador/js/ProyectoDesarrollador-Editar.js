const inputNombre = document.querySelector('#nombre');
const inputDescripcion = document.querySelector('#descripcion');
const inputCliente = document.querySelector('#cliente');
const inputFechaInicioEsperada = document.querySelector('#fechainicioesperada');
const inputFechaFinalEsperada = document.querySelector('#fechafinalesperada');
const inputDev = document.querySelector('#dev');

const alerta = document.querySelector('#alert');
const exitoso = document.querySelector('#guardado');


const urlParam = new URLSearchParams(window.location.search);
const idProyecto = urlParam.get('proyectoId');

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

window.onload = () => {
    getProyecto();
}

async function getProyecto() {
    const url = `${URL_Global}/EditarProyecto?IdProyecto=${idProyecto}`;

    await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarDatos(resultado);
        })
}

function mostrarDatos(datos) {
    datos.forEach(proyecto => {
        var fechaSplit1 = proyecto.fechaInicioEsperada.split("T");
        var fechainicioesperada = fechaSplit1[0];
        var fechaSplit2 = proyecto.fechaFinalEsperada.split("T");
        var fechafinalesperada = fechaSplit2[0];

        inputNombre.value = proyecto.nombre;
        inputDescripcion.value = proyecto.descripcion;
        inputCliente.value = proyecto.cliente;
        inputFechaInicioEsperada.value = fechainicioesperada;
        inputFechaFinalEsperada.value = fechafinalesperada;
        inputDev.value = proyecto.dev



    })
}

function validar() {
    if (inputNombre.value == "" || inputDescripcion.value == "" || inputCliente.value == "" || inputFechaInicioEsperada.value == "" || inputFechaFinalEsperada.value == "" || inputDev.value == "") {
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    } else {

        editProyecto();

    }
}

async function editProyecto() {

    var datos  = {
        idproyecto: idProyecto,
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value,
        cliente: inputCliente.value,
        fechainicioesperada: inputFechaInicioEsperada.value,
        fechafinalesperada: inputFechaFinalEsperada.value,
        dev: inputDev.value
    }

    const url = `${URL_Global}/ProyectoDesarrollador`;

    await fetch(url, {
        method: 'PUT',
        headers: new Headers({
            'Accept' : "application/json",
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + stringJWT
        }),
        body: JSON.stringify(datos),
    })
        .then((res)=>{
            console.log("bien" + res);
        }).catch((err)=>{
            console.log("mal"+ err);
        })


    window.location.href = (`./ProyectoDesarrolladorindex.html`);

}