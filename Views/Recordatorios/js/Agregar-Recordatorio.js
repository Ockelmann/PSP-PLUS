//Julio Garcia

const inputDescripcion = document.querySelector('#descripcion');
const inputCondicion = document.querySelector('#condicion');
const divproyecto = document.querySelector('#proyecto');
const divFecha = document.querySelector('#fecha');
const divHora = document.querySelector('#horas');

const inputFechayHora = document.querySelector('#fechahora');
const inputHoraTotal = document.querySelector('#Horas');
const inputProyecto = document.querySelector('#proyectos')

const alerta = document.querySelector('#alert');


const array = ["---Seleccione un Proyecto---"];
const array2 = [0];

const arrayoption = ["---Seleccione una Condicion---","Fecha","Total de horas de un proyecto","Si no se han ingresado actividades de algún proyecto","Si ya se ha excedido la fecha esperada"];
const arrayoptionvalue = [0,1,2,3,4];

let validado = 0;

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
    getEquipos();
}

async function getEquipos() {
    const url = `${URL_Global}/ProyectoAdmin`;

    await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            llenararreglo(resultado);
        })
}

function llenararreglo(datos) {
    datos.forEach(proyecto => {
        array.push(proyecto.nombre)
        array2.push(proyecto.idProyecto)
    })

    cargar();
}

function cargar() {

    var select = document.getElementById("proyectos");

    for (var i = 0; i < array.length; i++) {
        option = document.createElement("option");
        option.value = array2[i];
        option.text = array[i];
        select.appendChild(option);
    }


    var select2 = document.getElementById("condicion");

    for (var i = 0; i < arrayoption.length; i++) {
        option = document.createElement("option");
        option.value = arrayoptionvalue[i];
        option.text = arrayoption[i];
        select2.appendChild(option);
    }
}

function selectCondicion(){
    if(inputCondicion.value == 1){

        divproyecto.style.display = 'none';
        divFecha.style.display = 'flex';
        divHora.style.display = 'none';
        
    }else if(inputCondicion.value == 2){

        divproyecto.style.display = 'flex';
        divFecha.style.display = 'none';
        divHora.style.display = 'flex';

    }else if(inputCondicion.value == 3){
        
        divproyecto.style.display = 'flex';
        divFecha.style.display = 'flex';
        divHora.style.display = 'none';

    }else if(inputCondicion.value == 4){

        divproyecto.style.display = 'flex';
        divFecha.style.display = 'none';
        divHora.style.display = 'none';

    }else if(inputCondicion.value == 0){

        divproyecto.style.display = 'none';
        divFecha.style.display = 'none';
        divHora.style.display = 'none';
    }
}

async function validar() {
   if (inputDescripcion.value == "" || inputCondicion.value == 0 ) {
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    }


    switch (inputCondicion.value) {
        case "1":
            if (inputDescripcion.value == "" || inputCondicion.value == 0 ||  inputFechayHora.value == "" ) {
                alerta.style.display = 'block';
        
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 3000);
        
                return;
            } else {
        
                const url = `${URL_Global}/Recordatorios?descripcion=${inputDescripcion.value}&idUsuario=${jwt.sub}&tipoRecordatorio=${inputCondicion.value}&fechaHoraRecordatorio=${inputFechayHora.value}`;

                await fetch(url, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + stringJWT
                    })
                })
                    .then(respuesta => respuesta)

                    sendEmail();

            }
            break;
        case "2":
            if (inputDescripcion.value == "" || inputCondicion.value == 0 ||  inputHoraTotal.value == "" ) {
                alerta.style.display = 'block';
        
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 3000);
        
                return;
            } else {
        
                const url = `${URL_Global}/Recordatorios?descripcion=${inputDescripcion.value}&idUsuario=${jwt.sub}&tipoRecordatorio=${inputCondicion.value}&idProyecto=${inputProyecto.value}&horasAlerta=${inputHoraTotal.value}`;

                await fetch(url, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + stringJWT
                    })
                })
                    .then(respuesta => respuesta)

                    sendEmail();

            }
            break;
        case "3":
            if (inputDescripcion.value == "" || inputCondicion.value == 0 ||  inputProyecto.value == 0 || inputFechayHora.value == "" ) {
                alerta.style.display = 'block';
        
                setTimeout(() => {
                    alerta.style.display = 'none';
                }, 3000);
        
                return;
            } else {
        
                const url = `${URL_Global}/Recordatorios?descripcion=${inputDescripcion.value}&idUsuario=${jwt.sub}&tipoRecordatorio=${inputCondicion.value}&fechaHoraRecordatorio=${inputFechayHora.value}&idProyecto=${inputProyecto.value}`;

                await fetch(url, {
                    method: 'POST',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + stringJWT
                    })
                })
                    .then(respuesta => respuesta)

                    sendEmail();

            }
            break;
        case "4":
                if (inputDescripcion.value == "" || inputCondicion.value == 0 ||  divproyecto.value == 0 ) {
                    alerta.style.display = 'block';
            
                    setTimeout(() => {
                        alerta.style.display = 'none';
                    }, 3000);
            
                    return;
                } else {
            
                    const url = `${URL_Global}/Recordatorios?descripcion=${inputDescripcion.value}&idUsuario=${jwt.sub}&tipoRecordatorio=${inputCondicion.value}&idProyecto=${inputProyecto.value}`;

                    await fetch(url, {
                        method: 'POST',
                        headers: new Headers({
                            'Authorization': 'Bearer ' + stringJWT
                        })
                    })
                        .then(respuesta => respuesta)

                        sendEmail();

                }
                break;
    }

    validado = 1;

    window.location.href = (`./Recordatorios.html?validar=${validado}`);
}





async function sendEmail() {

var mensaje = `<div class="card">
 
  <div>
    <h2>Recordatorio</h2>
    <p>${inputDescripcion.value}</p>
    
  </div>
</div>`;
var correo = jwt.email;

    await Email.send({
      Host: "smtp.gmail.com",
      Username: "pspplusti@gmail.com",
      Password: "PruebaProyecto1914",
      To: `${correo}`,
      From: "pspplusti@gmail.com",
      Subject: "Recordatorio PSP+",
      Body: `${mensaje}`,
    })

  }