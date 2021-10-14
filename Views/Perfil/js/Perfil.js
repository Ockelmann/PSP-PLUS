/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

const formulario = document.querySelector('#formulario');
const nombresInput = document.querySelector('#nombres');
const apellidosInput = document.querySelector('#apellidos');
const inputEmail = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const equipoInput = document.querySelector('#equipo');
const passwordText = document.querySelector('#passstrength');
const inputConfirmarClave = document.querySelector('#confirmar_contraseña');
const inputClave = document.querySelector('#clave');
let idEquipo;

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
    $('#passstrength').className = 'ok';
    $('#passstrength').html('Contraseña Segura!');
    inputClave.style.borderBottom = "2px solid green";
    document.getElementById('boton-Actualizar').style.display = 'block';
    document.getElementById('editar').style.display = 'none';
    for (i = 0; ele = formulario.elements[i]; i++) {
        ele.disabled = false;
    }
    equipoInput.disabled = true;
}

function GetDatos() {
    
    const url = `${URL_Global}/Perfil?idUsuario=${jwt.sub}`;

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



function mostrarDatos(datos) {

        for (i = 0; ele = formulario.elements[i]; i++) {
            ele.disabled = true;
        }

        var fechaSplit = datos.fechaNacimiento.split("T");
        let fecha = fechaSplit[0];
        nombresInput.value = datos.nombres;
        apellidosInput.value = datos.apellidos;
        inputEmail.value = datos.email;
        inputClave.value = datos.clave;
        inputConfirmarClave.value = datos.clave;
        fechaInput.value = fecha;
        equipoInput.value = datos.nombreEquipo;
        idEquipo = datos.idEquipoDesarrollo

}



async function actualizar() {

    const cor = inputEmail.value;
    if (nombresInput.value === '' || apellidosInput.value === '' || inputEmail.value === '' ||
    fechaInput.value === '' || equipoInput.value === '') {

        $(document).ready(function () {
            setTimeout(function () {
                $("#alert").fadeIn(1000);
            }, 0);

            setTimeout(function () {
                $("#alert").fadeOut(1500);
            }, 3000);
        });

        return;
    }else if (cor.search('@plusti.com')==-1) {
        $(document).ready(function () {
            setTimeout(function () {
                $("#correo").fadeIn(1000);
            }, 0);

            setTimeout(function () {
                $("#correo").fadeOut(1500);
            }, 3000);
        });

    }else if(inputConfirmarClave.value != inputClave.value ){
        $(document).ready(function () {
            setTimeout(function () {
                $("#contra").fadeIn(1000);
            }, 0);

            setTimeout(function () {
                $("#contra").fadeOut(1500);
            }, 3000);
        });
    }else if(passwordText.textContent != "Contraseña Segura!"){
        $(document).ready(function () {
            setTimeout(function () {
                $("#segura").fadeIn(1000);
            }, 0);

            setTimeout(function () {
                $("#segura").fadeOut(1500);
            }, 3000);
        });
    }
    else {

        const confirmar = confirm('¿Desea editar sus datos?');
        if (confirmar) {
           
            console.log("Actualizando..")
            console.log(equipoInput.value)
            const urlActualizarUsuario = `${URL_Global}/Perfil`;

            var  datos  = { 
                idUsuario: jwt.sub,
                nombres: nombresInput.value,
                apellidos: apellidosInput.value,
                email: inputEmail.value,
                clave: inputClave.value,
                fechaNacimiento: fechaInput.value,
                idEquipoDesarrollo: idEquipo,
            }

            await fetch(urlActualizarUsuario, {
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
        

            location.reload();
            document.getElementById('boton-Actualizar').style.display = 'none';
        } else {

            location.reload();

        }
    }
}

