/*
    Desarrollador: Rogelio Raúl Castañeda Flores
*/

 
const URL = `https://localhost:5001/api/Usuarios/SignIn`;const emailInput = document.getElementById("inputEmail");
 
const passwordInput = document.getElementById("inputPassword");
const form = document.getElementById('signin-form');
const alerta = document.querySelector('#alert');
const inputCorreo = document.querySelector('#inputEmail');
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

let cantidadCorreos;

const signIn = async (e) => {
    e.preventDefault()
    const body = JSON.stringify({
        email: emailInput.value,
        clave: passwordInput.value,
    })
    try {
        const response = await fetch(URL, {
            headers: {
                'Accept': "application/json, text/plain, */*",
                'Content-Type': "application/json;charset=utf-8"
            }, method: 'POST', body
        });
        const data = await response.text();
        emailInput.value = '';
        passwordInput.value = '';
         
        Cookies.set('jwt', data);
        const stringJWT = Cookies.get('jwt');
        let jwt;

        if (stringJWT) {
            jwt = parseJwt(stringJWT);
        }

        if (stringJWT == "") {
            alerta.textContent = "Datos Incorrectos"
            alerta.style.display = 'block';
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 3000);
            e.preventDefault()
        } else {
            if (jwt.rol == "administrador") {
                window.location.href = "../MenuPrincipa-Admin/index.html";
            } else if (jwt.rol == "desarrollador") {
                window.location.href = "../MenuPrincipal/Menu.html";
            }
        }
    } catch (err) {
        console.error(err);
    }
}

form.addEventListener('submit', signIn)


async function recuperar(){

    if(inputEmail.value == ""){
        alerta.textContent = "Ingrese un Correo"
            alerta.style.display = 'block';
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 3000);
    }else{
        const url = `https://localhost:5001/api/RecuperarContraseña?correo=${inputEmail.value}`;

    await fetch(url, {
        method: 'PUT',
        headers: new Headers({
          //  'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta)

        alerta.textContent = "Se le ha enviado un correo"
            alerta.style.display = 'block';
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 3000);
    }

    
    
}