/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

const inputNombre = document.querySelector('#nombre');
const inputDescripcion = document.querySelector('#descripcion');
const alerta = document.querySelector('#alert');

var validado = 0;

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

async function agregarEquipo() {

    const url = `https://localhost:5001/api/GetEquiposDesarrollo?nombre=${inputNombre.value}&descripcion=${inputDescripcion.value}`;

    await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta)

    validado = 1;

    window.location.href = (`./equiposList.html?validar=${validado}`);
}

function validar() {
    if (inputNombre.value == "" || inputDescripcion.value == "") {
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    } else {

        agregarEquipo();
    }

}