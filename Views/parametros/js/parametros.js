/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

const cardListElement = document.getElementById("lista-params");
const exitoso = document.querySelector('#guardado');
const exitoso2 = document.querySelector('#editado');
const exitoso3 = document.querySelector('#eliminado');
const alerta = document.querySelector('#alert');
const inpuntsearch = document.querySelector('#search');

const urlParams = new URLSearchParams(window.location.search);
const val = urlParams.get('validar');

window.onload = () => {
    validacion();
    GetDatos();
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

function validacion() {
    if (val == 2) {
        exitoso2.textContent = "Parámetros Actualizados Correctamente"
        exitoso2.style.display = 'block';
        setTimeout(() => {
            exitoso2.style.display = 'none';
        }, 3000);

    } else if (val == null) {
        return;
    }
    setTimeout(() => {
        history.pushState(null, "", "./parametros.html");
    }, 3000);
}


async function GetDatos() {
    const url = `https://localhost:5001/api/Parametros`;

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
    console.log(datos)
    document.getElementById("lista-params").innerHTML = "";

        const card = `
            <tr>
              <td>${datos.inactividad}</td>
              <td>${datos.correo}</td>
              <td>${datos.clave}</td>
              <td><button class="btn edit" id="detalle" data-id="${datos.idParametro}" style="background-color: #4F73CF; color:white;"> Editar </button></td>
            </tr>
        `;
        cardListElement.innerHTML += card;

    var elements = document.getElementsByClassName("edit");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', modificarParametros);
    }

}

function modificarParametros(e) {
    const param = e.target.parentElement.parentElement;
    const paramId = param.querySelector('button').getAttribute('data-id');

    window.location.href = (`./editarParametros.html?idParametro=${paramId}`);
}
