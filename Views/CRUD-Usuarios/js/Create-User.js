//Julio Garcia
//5/08/2021
const inputNombre = document.querySelector('#nombre');
const inputApellido = document.querySelector('#apellido');
const inputEmail = document.querySelector('#email');
const inputClave = document.querySelector('#clave');
const inputConfirmarClave = document.querySelector('#confirmar_contraseña');
const inputFecha = document.querySelector('#fecha');
const inputEquipo = document.querySelector('#equipo');
const inputRol = document.querySelector('#rol');
const passwordText = document.querySelector('#passstrength');

const alerta = document.querySelector('#alert');
const alerta2 = document.querySelector('#alert2');

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

const array = ["---Seleccione una opcion---"];
const array2 = [0];

let cantidadCorreos = false;

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

window.onload = () => {
    getEquipos();
}

function validarCorreos(usuarios) {

    usuarios.forEach(usuario => {

        if (inputEmail.value == usuario.email) {
            cantidadCorreos = true;
        }

    })
}

async function getEquipos() {
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

function llenararreglo(datos) {
    datos.forEach(equipos => {
        array.push(equipos.nombre)
        array2.push(equipos.idEquipoDesarrollo)
    })

    cargar();
}

function cargar() {

    var select = document.getElementById("equipo");

    for (var i = 0; i < array.length; i++) {
        option = document.createElement("option");
        option.value = array2[i];
        option.text = array[i];
        select.appendChild(option);
    }
}


async function agregarUser() {


    const usarios = `${URL_Global}/EquipoDesarrolloNombre`;

    await fetch(usarios, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
            validarCorreos(resultado);
        })



    if (cantidadCorreos == true) {
        alerta2.style.display = 'block';

        setTimeout(() => {
            alerta2.style.display = 'none';
        }, 3000);

        inputEmail.value = '';
        cantidadCorreos = false;
        return;
    }

    const url = `${URL_Global}/AgregarUsuarios`;

    var  datos  = { 
        nombres: inputNombre.value,
        apellidos: inputApellido.value,
        email: inputEmail.value,
        clave: inputClave.value,
        fechaNacimiento: inputFecha.value,
        IdEquipoDesarrollo: inputEquipo.value,
        rol: inputRol.value,
    }



    await fetch(url, {
        method: 'POST',
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


    validado = 1;

    window.location.href = (`./List-User.html?validar=${validado}`);

}

function validar() {
    const cor = inputEmail.value;
    alerta.textContent = 'Todos los campos son necesarios!';
    if (inputNombre.value == "" || inputApellido.value == "" ||   inputClave.value == "" || inputFecha.value == "" || inputEquipo.value == 0 || inputRol.value == "" || inputConfirmarClave.value == "") {
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;
    } else if (cor.search('@plusti.com')==-1) {
        alerta.textContent = 'Correo invalido , Recuerde usar su correo institucional el cual tiene @plusti.com';
        alerta.style.display = 'block';
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

    }else if(inputConfirmarClave.value != inputClave.value ){
        alerta.textContent = 'La contraseña no coincide intente nuevamente';
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
            agregarUser();
        }
    }

}







