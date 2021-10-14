/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

const inputNombre = document.querySelector('#nombre');
const inputDescripcion = document.querySelector('#descripcion');
const alerta = document.querySelector('#alert');

const urlParams = new URLSearchParams(window.location.search);
const idEquipo = urlParams.get('idEquipo');

var editar = 0;

window.onload = () =>{
    getEquipo();
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


async function getEquipo(){
    const url = `${URL_Global}/GetEquiposDesarrollo?idEquipo=${idEquipo}`;

    await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarDatos(resultado);
            console.log(resultado);
        })
}

function mostrarDatos(datos){
        inputNombre.value = datos.nombre;
        inputDescripcion.value = datos.descripcion; 
}

function validar(){
    if(inputNombre.value == ""||inputDescripcion.value == ""){
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
        idEquipoDesarrollo: idEquipo,
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value
    };

    const url = `${URL_Global}/GetEquiposDesarrollo`;

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
    window.location.href = (`./equiposList.html?validar=${editar}`);
 
}