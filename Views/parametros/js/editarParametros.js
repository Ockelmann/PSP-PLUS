/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

const inputInactividad = document.querySelector('#inactividad');
const inputCorreo = document.querySelector('#correo');
const inputClave = document.querySelector('#clave');
const alerta = document.querySelector('#alert');

const urlParams = new URLSearchParams(window.location.search);
const idParametro = urlParams.get('idParametro');

var editar = 0;

window.onload = () =>{
    getParams();
}

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


async function getParams(){
    const url = `${URL_Global}/Parametros`;

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

function mostrarDatos(datos){
        inputInactividad.value = datos.inactividad;
        inputCorreo.value = datos.correo; 
        inputClave.value = datos.clave;
}

function validar(){
    if(inputInactividad.value == ""|| inputCorreo.value == "" || inputClave.value == "") {
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    }else{
        
        editUser();
    }
}

async function editUser(){

    var datos = {
        inactividad: inputInactividad.value,
        correo: inputCorreo.value,
        clave: inputClave.value
    };

    const url = `${URL_Global}/Parametros`;

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


    editar = 2;
    window.location.href = (`./parametros.html?validar=${editar}`);
 
}