/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

const formulario = document.querySelector('#formulario');
const nombresInput = document.querySelector('#nombres');
const apellidosInput = document.querySelector('#apellidos');
const correoInput = document.querySelector('#correo');
const fechaInput = document.querySelector('#fecha');
const equipoInput = document.querySelector('#equipo');

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
    GetDatos();
}


function mostrar() {
    document.getElementById('boton-Actualizar').style.display = 'block';
    document.getElementById('editar').style.display = 'none';
    for (i = 0; ele = formulario.elements[i]; i++) {
        ele.disabled = false;
    }
    equipoInput.disabled = true;
}

function GetDatos() {
    
    const url = `https://localhost:44368/api/Perfil?idUsuario=${jwt.sub}`;

    fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrarDatos(resultado);
        })
}

var contra;

function mostrarDatos(datos) {

        for (i = 0; ele = formulario.elements[i]; i++) {
            ele.disabled = true;
        }

        var fechaSplit = datos.fechaNacimiento.split("T");
        let fecha = fechaSplit[0];
        nombresInput.value = datos.nombres;
        apellidosInput.value = datos.apellidos;
        correoInput.value = datos.email;
        contra = datos.clave;
        fechaInput.value = fecha;
        equipoInput.value = datos.idEquipoDesarrollo;

}



function actualizar() {

    if (nombresInput.value === '' || apellidosInput.value === '' || correoInput.value === '' ||
    fechaInput.value === '' || equipoInput.value === '') {

        $(document).ready(function () {
            setTimeout(function () {
                $("#alert").fadeIn(1000);
            }, 0);

            setTimeout(function () {
                $("#alert").fadeOut(1500);
            }, 3000);
        });


    } else {

        const confirmar = confirm('¿Desea editar sus datos?');
        if (confirmar) {
           
            console.log("Actualizando..")
            const urlActualizarUsuario = `https://localhost:44368/api/Perfil?idUsuario=${jwt.sub}&nombre=${nombresInput.value}&apellido=${apellidosInput.value}&email=${correoInput.value}&clave=${contra}&fechaNacimiento=${fechaInput.value}&idEquipo=${equipoInput.value}`;

            fetch(urlActualizarUsuario, {
                method: 'PUT',
                headers: new Headers({
                    'Authorization': 'Bearer ' + stringJWT
                })
            })
                .then(respuesta => respuesta)

            location.reload();
            document.getElementById('boton-Actualizar').style.display = 'none';
        } else {

            location.reload();

        }
    }
}

