
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};


document.addEventListener('DOMContentLoaded', () => {
  const stringJWT = Cookies.get('jwt');
  let jwt;


  if (stringJWT) {
    jwt = parseJwt(stringJWT);
    

    if (jwt.rol == "administrador") {
      document.querySelector("#header").innerHTML = `
      <nav class="navbar navbar-expand-sm   ">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#opciones">
       <img src="../Navbar/menu.png"class="navh">
      </button>
      
      <!-- logo -->
      <a class="navbar-brand" href="#">
        <img style="width: 100px;" src="../Navbar/LOGOPLUSTI 2.png" width="75" height="30" alt="">
      </a>
      
      <!-- enlaces -->
      <div class="collapse navbar-collapse" id="opciones">   
        <ul class="navbar-nav">
          
          <li class="nav-item">
            <a class="nav-link" href="../MenuPrincipa-Admin/index.html">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="../CRUD-Usuarios/List-User.html">Usuarios</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="../ProyectoAdmin/ProyectoAdminindex.html">Proyectos</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="../EquiposDeTrabajo/equiposList.html">Equipos de trabajo</a>
          </li>     
          <li class="nav-item">
            <a class="nav-link" href="../MenuReportes/Reporteria.html">Reportes</a>
          </li>          
        </ul>
     
      </div>
      <div >
      <a class="nav-link nombre-nav" style="text-decoration: none;" href="../Perfil/Perfil.html">${jwt.nombre} ${jwt.apellidos}</a>
      </div>
      <div >
      <a href="../Login.html" onclick="CerrarSesion();" class="nav-link"><img src="../Navbar/Vector.png"></a>
      </li>
      </div>
      
    </nav>
    `
    }
    else if ((jwt.rol = "desarrollador")) {

        if(JSON.parse(localStorage.getItem("fechaHoraInicioActividadxCronometro")) != undefined || JSON.parse(localStorage.getItem("fechaHoraInicioErrorxCronometro")) != undefined ){
            document.querySelector("#header").innerHTML = `
            <nav class="navbar navbar-expand-sm   ">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#opciones" style="margin-left: 10px">
            <img src="../Navbar/menu.png"class="navh">
            </button>
            
            <!-- logo -->
            <a class="navbar-brand" href="#">
              <img style="width: 100px;" src="../Navbar/LOGOPLUSTI 2.png" width="75" height="30" alt="">
            </a>
            
            <!-- enlaces -->
            <div class="collapse navbar-collapse" id="opciones">   
              <ul class="navbar-nav">
                
                <li class="nav-item">
                  <a class="nav-link" href="../MenuPrincipal/Menu.html">Inicio</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="../ActividadesPSP/MenuActividades.html">Actividades</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="../ProyectoDesarrollador/ProyectoDesarrolladorindex.html">Proyectos</a>
                </li>  
                <li class="nav-item">
                  <a class="nav-link" href="../Recordatorios/Recordatorios.html">Recordatorios</a>
                </li>
                  <li class="nav-item">
                  <a class="nav-link" href="../MenuReportes/Reporteria.html">Reportes</a>
                </li>  
              </ul>
            
            </div>
            <div>
            <img  src="../Navbar/crono.svg" alt="">
           </div>
            <div >
            

            <a class="nav-link nombre-nav" style="text-decoration: none;" href="../Perfil/Perfil.html">${jwt.nombre} ${jwt.apellidos}</a>
            </div>
            <div >
            
            <a href="../Login.html" onclick="CerrarSesion();" class="nav-link"><img src="../Navbar/Vector.png"></a>
            
            </div>
            
          </nav>
          `
        }else{

          document.querySelector("#header").innerHTML = `
            <nav class="navbar navbar-expand-sm   ">
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#opciones" style="margin-left: 10px">
            <img src="../Navbar/menu.png"class="navh">
            </button>
            
            <!-- logo -->
            <a class="navbar-brand" href="#">
              <img style="width: 100px;" src="../Navbar/LOGOPLUSTI 2.png" width="75" height="30" alt="">
            </a>
            
            <!-- enlaces -->
            <div class="collapse navbar-collapse" id="opciones">   
              <ul class="navbar-nav">
                
                <li class="nav-item">
                  <a class="nav-link" href="../MenuPrincipal/Menu.html">Inicio</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="../ActividadesPSP/MenuActividades.html">Actividades</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="../ProyectoDesarrollador/ProyectoDesarrolladorindex.html">Proyectos</a>
                </li>  
                <li class="nav-item">
                  <a class="nav-link" href="../Recordatorios/Recordatorios.html">Recordatorios</a>
                </li>
                  <li class="nav-item">
                  <a class="nav-link" href="../MenuReportes/Reporteria.html">Reportes</a>
                </li>  
              </ul>
            
            </div>

          

            <div >
            <a class="nav-link nombre-nav" style="text-decoration: none;" href="../Perfil/Perfil.html">${jwt.nombre} ${jwt.apellidos}</a>
            </div>
            <div >
            
            <a href="../Login.html" onclick="CerrarSesion();" class="nav-link"><img src="../Navbar/Vector.png"></a>
            
            </div>
            
          </nav>
          `

        }



      
    }else{
    window.location.href = "../Login.html";  
    }
  }else{
   window.location.href = "../Login.html";
  }
})

function CerrarSesion() {
  Cookies.remove('jwt');
  localStorage.removeItem('fechaHoraInicioErrorxCronometro'); // Elimina del localStorage los POSIBLES
  localStorage.removeItem('fechaHoraInicioActividadxCronometro'); // tiempos de ejecución que tenga el Usuario en proceso
  localStorage.removeItem('FechaInicio');
  localStorage.removeItem('FechaFinal');
};
