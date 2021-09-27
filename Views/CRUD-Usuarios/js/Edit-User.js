//Julio Garcia
//5/08/2021
const inputNombre = document.querySelector('#nombre');
const inputApellido = document.querySelector('#apellido');
const inputEmail = document.querySelector('#email');
const inputClave = document.querySelector('#clave');
const inputConfirmarClave = document.querySelector('#confirmar_contraseña');
const inputFecha = document.querySelector('#fecha');
const inputEquipo = document.querySelector('#equipo');
const passwordText = document.querySelector('#passstrength');

const alerta = document.querySelector('#alert');


const urlParams = new URLSearchParams(window.location.search);
const idUsuario = urlParams.get('Userid');

$('#clave').keyup(function(e) {
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{6,}).*", "g");
    if (false == enoughRegex.test($(this).val())) {
            $('#passstrength').html('Más caracteres.');
            inputClave.style.borderBottom = "2px solid red";
    } else if (strongRegex.test($(this).val())) {
            $('#passstrength').className = 'ok';
            $('#passstrength').html('Contraseña Segura!');
            inputClave.style.borderBottom = "2px solid green";
    } else if (mediumRegex.test($(this).val())) {
            $('#passstrength').className = 'alert';
            $('#passstrength').html('Contraseña Media: Debe contener letras Mayusculas, Minusculas, numeros y simbolos!');
            inputClave.style.borderBottom = "2px solid yellow";
    } else {
            $('#passstrength').className = 'error';
            $('#passstrength').html('Contraseña Débil: Debe contener letras Mayusculas, Minusculas, numeros y simbolos!');
            inputClave.style.borderBottom = "2px solid orange";
    }
    return true;
});

const array = [];
const array2 = [];

var editar = 0;


    window.onload = () =>{
        getEquipos();
        $('#passstrength').className = 'ok';
                $('#passstrength').html('Contraseña Segura!');
                inputClave.style.borderBottom = "2px solid green";
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

async function getEquipos(){
    const url = `${URL_Global}/GetEquiposDesarrollo`;

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

function llenararreglo(datos){
    datos.forEach(equipos =>{
        array.push(equipos.nombre)
        array2.push(equipos.idEquipoDesarrollo)
    })

    cargar();
}

function cargar(){

    var select = document.getElementById("equipo");

    for(var i=0;i<array.length;i++){ 
        option = document.createElement("option");
        option.value = array2[i];
        option.text = array[i];
        select.appendChild(option);
     }

     getUser();
}


async function getUser(){
    const url = `${URL_Global}/EquipoDesarrolloNombre?idUsuario=${idUsuario}`;

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
    datos.forEach(usuario =>{
        var fechaSplit = usuario.fechaNacimiento.split("T");
        var fecha = fechaSplit[0];

        inputNombre.value = usuario.nombres;
        inputApellido.value = usuario.apellidos; 
        inputEmail.value = usuario.email;
        inputClave.value = usuario.clave; 
        inputConfirmarClave.value = usuario.clave;
        inputFecha.value = fecha; 

        for(var i = 0; i < inputEquipo.options.length; i++){
            if(inputEquipo.options[i].value == usuario.idEquipoDesarrollo){
                inputEquipo.options[i].selected = true;
            }
        }

    })
}

function validar(){
    const cor = inputEmail.value;
    
    if(inputNombre.value == ""||inputApellido.value == ""|| inputEmail.value == ""|| inputClave.value == ""|| inputFecha.value == "" || inputEquipo.value == 0){
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    }else if (cor.search('@plusti.com')==-1) {
        alerta.textContent = 'Correo invalido , Recuerde usar su correo institucional el cual tiene @plusti.com';
        alerta.style.display = 'block';
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

    } else {
        if(passwordText.textContent != "Contraseña Segura!"){
            alerta.textContent = 'Necesita contraseña segura';
            alerta.style.display = 'block';
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 3000);
        }else{
            editUser();
        }


    }
}

async function editUser(){
    const url = `${URL_Global}/AgregarUsuarios?idUsuario=${idUsuario}&nombre=${inputNombre.value}&apellido=${inputApellido.value}&email=${inputEmail.value}&clave=${inputClave.value}&fechaNacimiento=${inputFecha.value}&idEquipo=${inputEquipo.value}`;

    await fetch(url, {
        method: 'PUT',
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta)


    editar = 2;
    window.location.href = (`./List-User.html?validar=${editar}`);
 
}




