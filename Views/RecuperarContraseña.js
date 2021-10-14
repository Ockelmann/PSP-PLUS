const inputClave = document.querySelector('#inputPassword');
const inputConfirmarClave = document.querySelector('#inputConfirmarPassword');
const alerta = document.querySelector('#alert');
const passwordText = document.querySelector('#passstrength');
const form = document.getElementById('signin-form');




$('#inputPassword').keyup(function(e) {
   
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

const actualizar = async (e) => {
    if(inputClave.value == "" || inputConfirmarClave.value == ""){
        alerta.textContent = "Todos los campos son necesarios"
        alerta.style.display = 'block';
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);
        e.preventDefault();
     }else if(inputClave.value != inputConfirmarClave.value){
        alerta.textContent = "La contraseña no coincide"
        alerta.style.display = 'block';
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);
        e.preventDefault();
     }else{
        if(passwordText.textContent != "Contraseña Segura!"){
            alerta.textContent = 'Necesita contraseña segura';
            alerta.style.display = 'block';
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 3000);
            e.preventDefault();
        }else{
        GuardarDatos();
        e.preventDefault();
        validar();
        e.preventDefault();
        }
            
           
     }
}

form.addEventListener('submit', actualizar)


function validar(){

    if (jwt.rol == "administrador") {
       window.location.href = "../MenuPrincipa-Admin/index.html";

} else if (jwt.rol == "desarrollador") {

      
       window.location.href = "../MenuPrincipal/Menu.html";
   

}}


async function  GuardarDatos(){

    var datos = {
        idUsuario: jwt.sub,
        clave: inputClave.value,
    };

    const url = `${URL_Global}/ActualizarContraseña`;
        
    await fetch(url, {
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
}