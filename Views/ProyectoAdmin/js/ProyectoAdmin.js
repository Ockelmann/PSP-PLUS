const cardlistelement = document.getElementById("lista-proyectos");
const alerta = document.querySelector('#alert');
const alertarelacion = document.querySelector('#relacion');
const inpuntsearch = document.querySelector('#search');
let array = [];
var validation = 0;

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
    getdatos();
    validarcascada();
}

async function getdatos() {
    const url = `https://localhost:5001/api/ProyectoAdmin`;

    await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            mostrardatos(resultado);
        })
}

function mostrardatos(datos) {
    datos.forEach(proyecto => {
        var fechaSplit1 = proyecto.fechaInicioEsperada.split("T");
        var fechainicioesperada = fechaSplit1[0];
        var fechaSplit2 = proyecto.fechaFinalEsperada.split("T");
        var fechafinalesperada = fechaSplit2[0];

        if (proyecto.fechaInicioReal == null) {
            var fechainicioreal = "";
        } else {
            var fechaSplit3 = proyecto.fechaInicioReal.split("T");
            var fechainicioreal = fechaSplit3[0];
        }
        if (proyecto.fechaFinalReal == null) {
            var fechafinalreal = "";
        } else {
            var fechaSplit4 = proyecto.fechaFinalReal.split("T");
            var fechafinalreal = fechaSplit4[0];
        }

        const card = `


        <tr>
              <td>${proyecto.idProyecto}</td>
              <td>${proyecto.nombre}</td>
              <td>${proyecto.cliente}</td>
              <td>${fechainicioreal}</td>
              <td>${fechainicioesperada}</td>
              <td>${fechafinalreal}</td>
              <td>${fechafinalesperada}</td>
              <td>${proyecto.dev}</td>
              <td>${proyecto.totalHorasTrabajadas}</td>
              
              <td><a class="edit" id="editar" data-id="${proyecto.idProyecto}">
                    <img class="eliminar-editar" src="./img/Editar.svg" id="imgeditar" alt="" style=" width: 35px;">
                    </a></td>
              <td><a class="delete" id="eliminar" data-id="${proyecto.idProyecto}">
                    <img class="eliminar-editar" src="./img/Eliminar.svg" id="imgeliminar" alt="" style=" width: 25px;">
                </a></td>
              <td><button class="btn dev"  data-id="${proyecto.idProyecto}"> Desarrolladores </button></td>
            </tr>
       `;
        cardlistelement.innerHTML += card;
    });

    var elements = document.getElementsByClassName("edit");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', modificarProyecto);
    }

    var elements2 = document.getElementsByClassName("delete");

    for (var i = 0; i < elements2.length; i++) {
        elements2[i].addEventListener('click', eliminarProyecto);
    }

   // var elements3 = document.getElementsByClassName("desarrollador");

    //for (var i = 0; i < elements3.length; i++) {
//        elements3[i].addEventListener('click', verDesarrollador);
  //  }

  var elementdesarrollador = document.getElementsByClassName("dev");
    for (var i = 0; i < elementdesarrollador.length; i++) {
      elementdesarrollador[i].addEventListener('click', verDesarrollador);
    }
}



function modificarProyecto(e) {
    const proyecto = e.target.parentElement.parentElement;
    const proyectoid = proyecto.querySelector('a').getAttribute('data-id');
    idtemp = proyectoid;
    window.location.href = (`./ProyectoAdmin-Editar.html?proyectoId=${proyectoid}`);
}

async function eliminarProyecto(e) {
    const proyecto = e.target.parentElement.parentElement;
    const proyectoid = proyecto.querySelector('a').getAttribute('data-id');
    /*const confirmar = confirm('¿Desea Eliminar Proyecto?');
    if (confirmar) {


    for(i=0;i<array.length;i++){
        const url = `https://localhost:5001/api/ProyectoAdmin?idproyecto=${proyectoid}`;

            if(array[i] == proyectoid){
       

                alertarelacion.style.display = 'block';

                setTimeout(() => {
                    alertarelacion.style.display = 'none';
                }, 3000);


            return;
            }
        }

        const url = `https://localhost:5001/api/ProyectoAdmin?idproyecto=${proyectoid}`;

                await fetch(url, {
                    method: 'DELETE',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + stringJWT
                    })
                })
                    .then(respuesta => respuesta)

                window.location.href = (`./ProyectoAdminindex.html`);
    }
    else {

        return;

    }*/
    try {
        const {isConfirmed} = await Swal.fire({
            title: 'Eliminar Proyecto',
            text: "¿Estas seguro que deseas este proyecto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        })
        if(!isConfirmed){
            return;
        }
        for(i=0;i<array.length;i++){
           
    
                if(array[i] == proyectoid){
           
    
                    alertarelacion.style.display = 'block';
    
                    setTimeout(() => {
                        alertarelacion.style.display = 'none';
                    }, 3000);
    
    
                return;
                }
            }
    
            const url = `https://localhost:5001/api/ProyectoAdmin?idproyecto=${proyectoid}`;
    
                    await fetch(url, {
                        method: 'DELETE',
                        headers: new Headers({
                            'Authorization': 'Bearer ' + stringJWT
                        })
                    })
                        .then(respuesta => respuesta)
    
                    window.location.href = (`./ProyectoAdminindex.html`);
                    Swal.fire('Proyecto Eliminado!')
        
    } catch (error) {
        Swal.fire("Problemas a eliminiar el proyecto.");
    }
    window.location.href = (`./ProyectoAdminindex.html`);
}


async function validarcascada(){

    const url = `https://localhost:5001/api/GetUsuarioProyecto`;

    await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
                validardatos(resultado);
        })

    }


    function validardatos(datos) {
        datos.forEach(proyecto => {

            array.push(proyecto.idProyecto);

        })}

function verDesarrollador(e) {
    const proyecto = e.target.parentElement.parentElement;
    const proyectoid = proyecto.querySelector('BUTTON').getAttribute('data-id');

   window.location.href = (`../asignacionDesarrolladoresProyecto/desarrolladores.html?idProyecto=${proyectoid}`);
}


async function searchCursos() {
    document.getElementById('alert').style.display = 'none';
    if (inpuntsearch.value == "") {
        document.getElementById("lista-proyectos").innerHTML = "";
        getdatos();
    }
    else {
        document.getElementById("lista-proyectos").innerHTML = "";
        const url = `https://localhost:5001/api/GetProyectosBusqueda?nombreProyecto=${inpuntsearch.value}`;
        await fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })

            .then(respuesta => respuesta.json())
            .then(resultado => {
                mostrardatos(resultado);
                if (Object.keys(resultado).length == 0) {
                    document.getElementById('alert').style.display = 'block';
                } else {

                    document.getElementById('alert').style.display = 'none';
                }
            })
    }
}