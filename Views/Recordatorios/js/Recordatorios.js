/*Julio Garcia
*/
const cardListElement = document.getElementById("lista-recordatorios");
const exitoso = document.querySelector('#guardado');
const exitoso2 = document.querySelector('#editado');
const exitoso3 = document.querySelector('#eliminado');
const alerta = document.querySelector('#alert');


const urlParams = new URLSearchParams(window.location.search);
const val = urlParams.get('validar');
var eliminar = 0;

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
    validacion();
    GetDatos();

}

function validacion() {
    if (val == 1) {

        exitoso.textContent = "Recordatorio Agregado Correctamente"
        exitoso.style.display = 'block';
        setTimeout(() => {
            exitoso.style.display = 'none';
        }, 3000);
    } else if (val == 2) {
        exitoso2.textContent = "Recordatorio Actualizado Correctamente"
        exitoso2.style.display = 'block';
        setTimeout(() => {
            exitoso2.style.display = 'none';
        }, 3000);

    } else if (val == null) {
        return;
    }
    setTimeout(() => {
        history.pushState(null, "", "./Recordatorios.html");
    }, 3000);
}


async function GetDatos() {
    if (eliminar == 1) {

        exitoso3.textContent = "Recordatorio Eliminado Correctamente"
        exitoso3.style.display = 'block';
        setTimeout(() => {
            exitoso3.style.display = 'none';
        }, 3000);

        eliminar = 0;
    }
    const url = `https://localhost:5001/api/Recordatorios?idUsuario=${jwt.sub}`;

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
    cardListElement.innerHTML = "";

    datos.forEach(recordatorio => {

        switch(recordatorio.tipoRecordatorio){
            case 1:
                var fechaSplit = recordatorio.fechaHoraRecordatorio.split("T");
                var fecha = fechaSplit[0];
                var hora = fechaSplit[1];

                if(recordatorio.estado == "No Leído"){
                        const card = `
                    <div class="row ">
                        <div class="col">
                            <div class="div"></div>
                            <img src="./img/Icon.svg" />
                            <p><b>${recordatorio.descripcion}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:center">
                            <img class="reloj" src="./img/reloj.svg" />
                            <p><b>${fecha} : ${hora}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:flex-end">
                            <b>${recordatorio.estado}<input class="estado" id="estados"  type="checkbox" value="${recordatorio.estado}" data-id="${recordatorio.idRecordatorios}"></b>
                            <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                            <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg" class="imgdelete"  alt="delete" /></a>
                        </div>
                    </div>
                    `;
                    cardListElement.innerHTML += card;
                }else{
                        const card = `
                    <div class="row ">
                        <div class="col">
                            <div class="div"></div>
                            <img src="./img/Icon.svg" />
                            <p><b>${recordatorio.descripcion}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:center">
                            <img class="reloj" src="./img/reloj.svg" />
                            <p><b>${fecha} : ${hora}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:flex-end">
                            <b>${recordatorio.estado}</b>
                            <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                            <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg" class="imgdelete"  alt="delete" /></a>
                        </div>
                    </div>
                    `;
                    cardListElement.innerHTML += card;
                }

                
                
                break;
            case 2:
                if(recordatorio.estado == "No Leído"){
                    const card2 = `
                <div class="row ">
                    <div class="col">
                        <div class="div"></div>
                        <img src="./img/Icon.svg" />
                        <p><b>${recordatorio.descripcion}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:center">
                        <img class="reloj" src="./img/reloj.svg" />
                        <p><b>Proyecto: ${recordatorio.nombreProyecto} - Horas Alcanzadas: ${recordatorio.horasAlerta}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:flex-end">
                        <b>${recordatorio.estado}<input class="estado" id="estados"   type="checkbox" value="${recordatorio.estado}" data-id="${recordatorio.idRecordatorios}"></b> 
                        <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                        <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg"  alt="delete" class="imgdelete"/></a>
                    </div>
                </div>
                `;
                cardListElement.innerHTML += card2;
                }else{
                    const card2 = `
                <div class="row ">
                    <div class="col">
                        <div class="div"></div>
                        <img src="./img/Icon.svg" />
                        <p><b>${recordatorio.descripcion}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:center">
                        <img class="reloj" src="./img/reloj.svg" />
                        <p><b>Proyecto: ${recordatorio.nombreProyecto} - Horas Alcanzadas: ${recordatorio.horasAlerta}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:flex-end">
                        <b>${recordatorio.estado}</b> 
                        <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                        <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg"  alt="delete" class="imgdelete"/></a>
                    </div>
                </div>
                `;
                cardListElement.innerHTML += card2;
                }
                
         

                break;
            case 3:
                var fechaSplit = recordatorio.fechaHoraRecordatorio.split("T");
                var fecha = fechaSplit[0];
                var hora = fechaSplit[1];
                if(recordatorio.estado == "No Leído"){
                    const card3= `
                <div class="row ">
                    <div class="col">
                        <div class="div"></div>
                        <img src="./img/Icon.svg" />
                        <p><b>${recordatorio.descripcion}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:center">
                        <img class="reloj" src="./img/reloj.svg" />
                        <p><b>Proyecto: ${recordatorio.nombreProyecto} - ${fecha} : ${hora}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:flex-end">
                        <b>${recordatorio.estado}<input class="estado" id="estados"   type="checkbox" value="${recordatorio.estado}" data-id="${recordatorio.idRecordatorios}" ></b>
                        <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                        <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg" alt="delete"  class="imgdelete"/></a>
                    </div>
                </div>
                `;
                cardListElement.innerHTML += card3;
                }else{
                    const card3= `
                <div class="row ">
                    <div class="col">
                        <div class="div"></div>
                        <img src="./img/Icon.svg" />
                        <p><b>${recordatorio.descripcion}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:center">
                        <img class="reloj" src="./img/reloj.svg" />
                        <p><b>Proyecto: ${recordatorio.nombreProyecto} - ${fecha} : ${hora}</b></p>
                    </div>
                    <div class="col" style="display: flex; justify-content:flex-end">
                        <b>${recordatorio.estado}</b>
                        <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                        <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg" alt="delete"  class="imgdelete"/></a>
                    </div>
                </div>
                `;
                cardListElement.innerHTML += card3;
                }
                
               
                break;
            case 4:
                if(recordatorio.estado == "No Leído"){
                    const card4= `
                    <div class="row ">
                        <div class="col">
                            <div class="div"></div>
                            <img src="./img/Icon.svg" />
                            <p><b>${recordatorio.descripcion}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:center">
                            <img class="reloj" src="./img/reloj.svg" />
                            <p><b>Proyecto: ${recordatorio.nombreProyecto}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:flex-end">
                            <b>${recordatorio.estado}<input class="estado" id="estados"  type="checkbox" value="${recordatorio.estado}" data-id="${recordatorio.idRecordatorios}"></b> 
                            <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                            <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg" alt="delete" class="imgdelete"/></a>
                        </div>
                    </div>
                    `;
                    cardListElement.innerHTML += card4;
                }else{
                    const card4= `
                    <div class="row ">
                        <div class="col">
                            <div class="div"></div>
                            <img src="./img/Icon.svg" />
                            <p><b>${recordatorio.descripcion}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:center">
                            <img class="reloj" src="./img/reloj.svg" />
                            <p><b>Proyecto: ${recordatorio.nombreProyecto}</b></p>
                        </div>
                        <div class="col" style="display: flex; justify-content:flex-end">
                            <b>${recordatorio.estado}</b> 
                            <a class="edit" data-id="${recordatorio.idRecordatorios}"><img src="./img/edit.svg" class="imgedit"  alt="edit" /></a>
                            <a class="delete" data-id="${recordatorio.idRecordatorios}"><img src="./img/delete.svg" alt="delete" class="imgdelete"/></a>
                        </div>
                    </div>
                    `;
                    cardListElement.innerHTML += card4;
                }

              
                break;
     
        }        
    }
    
    )


    var elements = document.getElementsByClassName("edit");

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', editRecordatorio);
    }

    var elements2 = document.getElementsByClassName("delete");

    for (var i = 0; i < elements2.length; i++) {
        elements2[i].addEventListener('click', deleteRecordatorio);
    }
    


    var elements3 = document.getElementsByClassName("estado");

    for (var i = 0; i < elements3.length; i++) {
        elements3[i].addEventListener('click', actualizarEstado);
    }

}

async function actualizarEstado(e) {
   
  
    const recordatorio = e.target.parentElement.parentElement;
    const recordatorioid = recordatorio.querySelector('input').getAttribute('data-id');
    const recordatoriovalor = recordatorio.querySelector('input').getAttribute('value');
    if(recordatoriovalor == "No Leído"){

        const url = `https://localhost:5001/api/Recordatorios?idRecordatorio=${recordatorioid}&estado=Leído`;

        await fetch(url, {
            method: 'PUT',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)
            
        GetDatos();
    }
}
 



async function deleteRecordatorio(e) {
    const recordatorio = e.target.parentElement.parentElement;
    const recordatorioid = recordatorio.querySelector('a').getAttribute('data-id');
   

    try {
        const {isConfirmed} = await Swal.fire({
            title: 'Eliminar Recordatorio',
            text: "¿Estas seguro que deseas eliminar este recordatorio?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        })
        if(!isConfirmed){
            return;
        }
        const urlActualizarUsuario = `https://localhost:5001/api/Recordatorios?idRecordatorio=${recordatorioid}`;

        await fetch(urlActualizarUsuario, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + stringJWT
            })
        })
            .then(respuesta => respuesta)
        Swal.fire('Recordatorio Eliminado!')
        GetDatos();
        
    } catch (error) {
        Swal.fire("Problemas a eliminiar el recordatorio.");
    }
  
}

async function editRecordatorio(e) {
    const recordatorio = e.target.parentElement.parentElement;
    const recordatorioid = recordatorio.querySelector('a').getAttribute('data-id');
   

    try {
        const {isConfirmed} = await Swal.fire({
            title: 'Editar Recordatorio',
            text: "¿Estas seguro que deseas editar este recordatorio?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Editar'
        })
        if(!isConfirmed){
            return;
        }

        window.location.href = (`./Editar-Recordatorio.html?recordatorioid=${recordatorioid}`);
        
    } catch (error) {
        Swal.fire("Problemas al editar el recordatorio.");
    }
  
}





