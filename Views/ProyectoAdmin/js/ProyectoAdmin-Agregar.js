const inputNombre = document.querySelector('#nombre');
const inputDescripcion = document.querySelector('#descripcion');
const inputCliente = document.querySelector('#cliente');
const inputFechaInicioEsperada = document.querySelector('#fechainicioesperada');
const inputFechaFinalEsperada = document.querySelector('#fechafinalesperada');
const inputDev = document.querySelector('#dev');

const alerta = document.querySelector('#alert');
const exitoso = document.querySelector('#guardado');

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


async function agregarProyecto() {
    const url = `${URL_Global}/ProyectoAdmin`;

    var  datos  = { 
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value,
        cliente: inputCliente.value,
        fechainicioesperada: inputFechaInicioEsperada.value,
        fechafinalesperada: inputFechaFinalEsperada.value,
        dev: inputDev.value,
    }

    await fetch(url, {
        method: 'POST',
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

}

function validar() {
    if (inputNombre.value == "" || inputDescripcion.value == "" || inputCliente.value == "" || inputFechaInicioEsperada.value == "" || inputFechaFinalEsperada.value == "" || inputDev.value == "") {
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    } else {

        agregarProyecto();
        exitoso.style.display = 'block';
        inputNombre.value = "";
        inputDescripcion.value = "";
        inputCliente.value = "";
        inputFechaInicioEsperada.value = "";
        inputFechaFinalEsperada.value = "";
        inputDev.value = "";

        setTimeout(() => {
            exitoso.style.display = 'none';
        }, 3000);

        window.location.href = (`./ProyectoAdminindex.html`);
    }

}