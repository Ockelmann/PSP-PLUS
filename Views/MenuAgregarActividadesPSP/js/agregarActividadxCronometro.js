/// DOCUMENTO RELIZADO POR: Erick Eduardo Echeverría Garrido (EE) 16/08/2021 

// ---------------------------------- Funciones cookies ----------------------------------
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

function CerrarSesion() {
    Cookies.remove('jwt');
};

const idUsuario = jwt.sub;
// ---------------------------------- FIN Funciones cookies ----------------------------------

// SELECTORES
const formulario = document.querySelector('#formulario');

const descripcionInput = document.querySelector('#descripcion');
const proyectosSelect = document.querySelector('#proyectos-listado');

const alerta = document.querySelector('#alert');

const btnIniciar = document.querySelector('#btnComenzar');
const btnDetener = document.querySelector('#btnDetener');
const btnFinalizar = document.querySelector('#btnFinalizar');
const btnReiniciar = document.querySelector('#btnReiniciar');


window.onload = () => {
    
    btnIniciar.addEventListener("click", comenzar);
    btnDetener.addEventListener("click", detener);
    btnFinalizar.addEventListener("click", finalizar);
    btnReiniciar.addEventListener("click", reinciar);
    mostrarSpinner();
    obtenerProyectos();
}

const fechaHoraInicioActividadxCronometro = localStorage.getItem('fechaHoraInicioActividadxCronometro');
const fechaHoraInicioObtenido = JSON.parse(fechaHoraInicioActividadxCronometro);

function validarCronometroGuardado(){

    if(fechaHoraInicioActividadxCronometro){

        fechaHoraInicio = new Date(fechaHoraInicioObtenido.fechaHoraInicio);
        descripcionInput.value = fechaHoraInicioObtenido.descripcion;
        proyectosSelect.value = fechaHoraInicioObtenido.numeroProyecto;

        estado = 1;

        descripcionInput.addEventListener("change", actualizarDatosLocalS);
        proyectosSelect.addEventListener("change", actualizarDatosLocalS);

        $('#btnComenzar').click();
        comenzar();
    }

}

async function obtenerProyectos() {
    const direccion = `${URL_Global}/ActividadesPSP?idUsuario=${idUsuario}&buscarProyecto=1`;

    await fetch(direccion, {
        headers: new Headers({
            'Authorization': 'Bearer ' + stringJWT
        })
    })
        .then(respuesta => respuesta.json())
        .then(resultado => resultado)
        .then(proyectos => selectProyecto(proyectos))
}

function selectProyecto(proyectos) {
    eliminarSpinner();
    proyectos.forEach(proyecto => {
        const { nombre, idProyecto } = proyecto;

        const option = document.createElement('option');
        option.value = idProyecto;
        option.textContent = nombre;
        proyectosSelect.appendChild(option);

    })

    validarCronometroGuardado(); // Valida si anteriormente el usuario habia dejado una actividad cargando...
}
 
let fechaHoraInicio;
let fechaHoraFinal;

let estado = 0; // 0 significa que el conteo empezo y 1 que la proxima acción va a ser detenerse

function comenzar() {

    if(estado == 0){
        fechaHoraInicio = new Date();
        estado = 1;

        const fechaHoraInicioActividadxCronometro = {
            fechaHoraInicio: fechaHoraInicio,
            descripcion: descripcionInput.value,
            numeroProyecto: proyectosSelect.value
        }

        const actividadString = JSON.stringify(fechaHoraInicioActividadxCronometro);
        localStorage.setItem('fechaHoraInicioActividadxCronometro', actividadString);

        descripcionInput.addEventListener("change", actualizarDatosLocalS);
        proyectosSelect.addEventListener("change", actualizarDatosLocalS);
    }

    btnIniciar.style.display = 'none';
    btnDetener.style.display = 'block';
    btnReiniciar.style.display = 'block';

}

function actualizarDatosLocalS(){
    
    const fechaHoraInicioActividadxCronometro = {
        fechaHoraInicio: fechaHoraInicio,
        descripcion: descripcionInput.value,
        numeroProyecto: proyectosSelect.value
    }

    const actividadString = JSON.stringify(fechaHoraInicioActividadxCronometro);

    localStorage.setItem('fechaHoraInicioActividadxCronometro', actividadString);
}

function detener() {

    fechaHoraFinal = new Date();

    btnDetener.style.display = 'none';
    btnReiniciar.style.display = 'none';
    btnFinalizar.style.display = 'block';

}

function finalizar(){
    if (descripcionInput.value == '' || proyectosSelect.value == '') {
    
        alerta.style.display = 'block';

        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);

        return;    
    }

    agregarActividad(); 
}

function reinciar(){
    localStorage.removeItem('fechaHoraInicioActividadxCronometro');
    location.reload();
}




async function agregarActividad() {

    mostrarSpinner();

    const direccion =  `${URL_Global}/ActividadesPSP`;
    var datos;
  
    
    if(fechaHoraInicio.getMonth()+1 < 10){
        if(fechaHoraInicio.getDate() <10){
            if(fechaHoraInicio.getHours() < 10){
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }else{
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }
        }else{
            if(fechaHoraInicio.getHours() < 10){
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }else{
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-0'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }
        }
        
    }else{
        if(fechaHoraInicio.getDate() <10){
            if(fechaHoraInicio.getHours() < 10){
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }else{
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-0'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }
        }else{
            if(fechaHoraInicio.getHours() < 10){
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T0'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }else{
                if(fechaHoraInicio.getMinutes() < 10){
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':0'+fechaHoraInicio.getMinutes();
                }else{
                    fechaHoraInicio = fechaHoraInicio.getFullYear()+'-'+(fechaHoraInicio.getMonth()+1)+'-'+fechaHoraInicio.getDate()+'T'+fechaHoraInicio.getHours()+':'+fechaHoraInicio.getMinutes();
                }
            }
        }


        
    }

    if(fechaHoraFinal.getMonth()+1 < 10){
        
        if(fechaHoraFinal.getDate() < 10){
            if(fechaHoraFinal.getHours() < 10){
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }else{
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }
        }else{
            if(fechaHoraFinal.getHours() < 10){
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }else{
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-0'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }
        }
        
    }else{  
        if(fechaHoraFinal.getDate() < 10){
            if(fechaHoraFinal.getHours() < 10){
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }else{
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-0'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }
        }else{
            if(fechaHoraFinal.getHours() < 10){
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T0'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }else{
                if(fechaHoraFinal.getMinutes() < 10){
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':0'+fechaHoraFinal.getMinutes();
                }else{
                    fechaHoraFinal = fechaHoraFinal.getFullYear()+'-'+(fechaHoraFinal.getMonth()+1)+'-'+fechaHoraFinal.getDate()+'T'+fechaHoraFinal.getHours()+':'+fechaHoraFinal.getMinutes();
                }
            }
        }    
    }
    
 

    if (proyectosSelect.value == '0') {
        datos  = { 
            fechaHoraInicio: fechaHoraInicio,
            fechaHoraFinal: fechaHoraFinal,
            descripcion: descripcionInput.value,
            idUsuario: idUsuario,
            cronometro: true,
        }

         
    } else {
        datos  = { 
            fechaHoraInicio: fechaHoraInicio,
            fechaHoraFinal: fechaHoraFinal,
            descripcion: descripcionInput.value,
            idProyecto: proyectosSelect.value,
            idUsuario: idUsuario,
            cronometro: true,
        }

        
    }

    await fetch(direccion, {
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

        localStorage.removeItem('fechaHoraInicioActividadxCronometro');

    alert('Agregado Exitosamente');
    window.location.href = (`../ActividadesPSP/MenuActividades.html`);
}
 
function mostrarSpinner() {

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    formulario.appendChild(spinner);
}

function eliminarSpinner() {
    const spinner = document.querySelector('.spinner');

    formulario.removeChild(spinner);
}