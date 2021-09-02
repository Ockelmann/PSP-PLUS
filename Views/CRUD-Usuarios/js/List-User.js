/*Julio Garcia
5/08/2021*/
const cardListElement = document.getElementById("lista-usuarios");
const exitoso = document.querySelector('#guardado');
const exitoso2 = document.querySelector('#editado');
const exitoso3 = document.querySelector('#eliminado');
const alerta = document.querySelector('#alert');
const alertarelacion = document.querySelector('#relacion');
const inpuntsearch = document.querySelector('#search');



const urlParams = new URLSearchParams(window.location.search);
const val = urlParams.get('validar');
let eliminar = 0;


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
    if (val == 1) {

        exitoso.textContent = "Usuario Agregado Correctamente"
        exitoso.style.display = 'block';
        setTimeout(() => {
            exitoso.style.display = 'none';
        }, 3000);
    } else if (val == 2) {
        exitoso2.textContent = "Usuario Actualizado Correctamente"
        exitoso2.style.display = 'block';
        setTimeout(() => {
            exitoso2.style.display = 'none';
        }, 3000);

    } else if (val == null) {
        return;
    }
    setTimeout(() => {
        history.pushState(null, "", "./List-User.html");
    }, 3000);
}


async function GetDatos() {
    /*if (eliminar == 1) {

        exitoso3.textContent = "Usuario Eliminado Correctamente"
        exitoso3.style.display = 'block';
        setTimeout(() => {
            exitoso3.style.display = 'none';
        }, 3000);

        eliminar = 0;
    }*/
    const url = `https://localhost:5001/api/EquipoDesarrolloNombre`;

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
    document.getElementById("lista-usuarios").innerHTML = "";

    datos.forEach(usuario => {
        var fechaSplit = usuario.fechaNacimiento.split("T");
        var fecha = fechaSplit[0];
        let card = null;
        if(usuario.rol == "administrador"){
            card = `
            <tr>
              <td>${usuario.idUsuario}</td>
              <td>${usuario.nombres} ${usuario.apellidos}</td>
              <td>${usuario.email}</td>
              <td>${fecha}</td>
              <td>${usuario.nombreEquipo}</td>
              <td>${usuario.rol}</td>
              <td><button class="btn edit" id="detalle" data-id="${usuario.idUsuario}" style="background-color: #4F73CF; color:white;"> Editar </button></td>
              <td><button class="btn delete" id="detalle" data-id="${usuario.idUsuario}" style="background-color: #09254F; color:white;" disabled> Eliminar </button></td>  
              </tr>
                
        `;
  
        }else{
            card = `
            <tr>
              <td>${usuario.idUsuario}</td>
              <td>${usuario.nombres} ${usuario.apellidos}</td>
              <td>${usuario.email}</td>
              <td>${fecha}</td>
              <td>${usuario.nombreEquipo}</td>
              <td>${usuario.rol}</td>
              <td><button class="btn edit" id="detalle" data-id="${usuario.idUsuario}" style="background-color: #4F73CF; color:white;"> Editar </button></td>
              <td><button class="btn delete" id="detalle" data-id="${usuario.idUsuario}" style="background-color: #09254F; color:white;"> Eliminar </button></td>
            </tr>
        `;
        }
        
        cardListElement.innerHTML += card;
    })

    var elements = document.getElementsByClassName("edit");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', modificarUsuario);
    }

    var elements2 = document.getElementsByClassName("delete");

    for (var i = 0; i < elements2.length; i++) {
        elements2[i].addEventListener('click', eliminarUsuario);
    }

}

function modificarUsuario(e) {
    const user = e.target.parentElement.parentElement;
    const userid = user.querySelector('button').getAttribute('data-id');

    window.location.href = (`./Edit-User.html?Userid=${userid}`);
}

async function eliminarUsuario(e) {
    const user = e.target.parentElement.parentElement;
    const userid = user.querySelector('button').getAttribute('data-id');
    

    try {
        const {isConfirmed} = await Swal.fire({
            title: 'Eliminar desarrollador',
            text: "¿Estas seguro que deseas eliminar el desarrollador de este proyecto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        })
        if(!isConfirmed){
            return;
        }

        const url = `https://localhost:5001/api/ActividadesPSP?idUsuario=${userid}`;
        const url2 = `https://localhost:5001/api/ProyectoDesarrollador?idUsuario=${userid}`;
let number=0;
        await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta.json())
            .then(resultado => {
                
                number= Object.keys(resultado.actividades).length+Object.keys(resultado.errores).length;
            })
            await fetch(url2, {
                headers: new Headers({
                    'Authorization': 'Bearer ' + stringJWT
                })
            })
                .then(respuesta => respuesta.json())
                .then(resultado => {
                    
                     number=number+resultado.length;
                
                    
                })
                console.log(number);
              validarEliminacion(number,userid);
      

    } catch (error) {
        Swal.fire("Problemas a elminiar desarrollador");
    }
    
}


async function validarEliminacion(resultado,userid){
    if (resultado>0) {

        alertarelacion.style.display = 'block';

        setTimeout(() => {
            alertarelacion.style.display = 'none';
        }, 3000);

        return;
    } else{

        const urlActualizarUsuario = `https://localhost:5001/api/AgregarUsuarios?idUsuario=${userid}`;

        await fetch(urlActualizarUsuario, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)

        eliminar = 1;
        Swal.fire('Desarrollador Eliminado!')
        GetDatos();
    }
}




async function searchCursos() {
    document.getElementById('alert').style.display = 'none';
    if (inpuntsearch.value == "") {
        document.getElementById("lista-usuarios").innerHTML = "";
        GetDatos();
    }
    else {
        document.getElementById("lista-usuarios").innerHTML = "";
        const url = `https://localhost:5001/api/EquipoDesarrolloNombre?correo=${inpuntsearch.value}`;
        await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })

            .then(respuesta => respuesta.json())
            .then(resultado => {
                mostrarDatos(resultado);
                if (Object.keys(resultado).length == 0) {
                    document.getElementById('alert').style.display = 'block';
                } else {

                    document.getElementById('alert').style.display = 'none';
                }
            })
    }
}