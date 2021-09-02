function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

(function () {
  const inicio = document.getElementById("fechaInicio");
  const fin = document.getElementById("fechaFinal");
  const listado = document.getElementById('lista-actividades')
  const btnBuscar = document.getElementById('buscar');
  const selectDev = document.getElementById("select-dev");
  const selectContainer = document.getElementById("input-container");

  let idUsuario;
  let proyecto;
  let desProyecto;
  const stringJWT = Cookies.get('jwt');
  let jwt;

  btnBuscar.addEventListener('click', mostrarReporte);


  async function mostrarReporte() {

    let fnn = String(inicio.value) + ' 00:00:00';
    let inn = String(fin.value) + ' 23:59:59';

    console.info(fnn);
    console.info(inn);

    listado.innerHTML = "";
    var actividades;
    if(jwt.rol == "desarrollador"){
      actividades = await obtenerActividades(idUsuario, fnn, inn);
    }else if(jwt.rol == "administrador"){
      actividades = await obtenerActividades(selectDev.value, fnn, inn);
    }
    console.info(actividades);

    
    actividades.forEach((element) => {
      const { idActividad, idProyecto, idUsuario, nombreUsuario, apellidoUsuario, descripcionActividad, descripcionProyecto, fechaInicio,
        fechaFinal, nombreProyecto } = element;

      var fechaInicioSplit = fechaInicio.split("T");
      let fechaInicioN = fechaInicioSplit[0];
      var HoraInicioSplit = fechaInicioSplit[1].split(":00");
      let horaInicio = HoraInicioSplit[0];

      var fechaFinalSplit = fechaFinal.split("T");
      let fechaFinalN = fechaFinalSplit[0];
      var HoraFinalSplit = fechaFinalSplit[1].split(":00");
      let horaFinal = HoraFinalSplit[0];


      if (nombreProyecto == null) {
        proyecto = 'Sin asignación de proyecto';
        desProyecto = 'Tarea sin proyecto asignado'
      } else {
        proyecto = nombreProyecto;
        desProyecto = descripcionProyecto;
      }
      calcularHoras(fechaInicio, fechaFinal);
      const row = document.createElement("tr");

      row.innerHTML += `
                <td>${nombreUsuario} ${apellidoUsuario}</td>
                <td>${proyecto}</td>
                <td>${desProyecto}</td>
                <td>${descripcionActividad}</td>
                <td>${fechaInicioSplit}</td>
                <td>${fechaFinalSplit}</td>
                <td>${totalHoras}</td>
                `;

      listado.appendChild(row);
    });
     totalHoras = 0;
  }

  let totalHoras = 0;


  function calcularHoras(horaInicio, horaFinal) {

    let a = moment(horaFinal);
    let b = moment(horaInicio);

    totalHoras = totalHoras + parseInt(a.diff(b, 'hours'));

  }

  function setDevOptions(usuarios) {
    selectDev.innerHTML = "";
    let selectHtml =
      '<option selected value="">--- Seleccione un desarrollador ---</option>';
    usuarios.forEach((usuario) => {
      selectHtml += `<option value="${usuario.idUsuario}">${usuario.nombres} ${usuario.apellidos}</option>`;
    });
    selectDev.innerHTML = selectHtml;
  };

  async function fillSelectDev() {
    const url = `https://localhost:5001/api/ComboDesarrolladores`;

    await fetch(url, {
      headers: new Headers({
        'Authorization': 'Bearer ' + stringJWT
      })
    })
      .then(respuesta => respuesta.json())
      .then(resultado => {
        setDevOptions(resultado);
      })
  };


  const onLoaded = () => {
    
 document.querySelector("#export-excel").addEventListener("click",() =>{
  tableToExcel('Reporte', 'W3C Example Table')
 })
 document.querySelector("#export-pdf").addEventListener("click",() =>{
   
var element = document.querySelector('#Reporte');
       
html2pdf()
.set({
margin: 1.2,
filename: 'Actividades'+Date.now()+'.pdf',
image: {
    type: 'jpeg',
    quality: 0.98
},
html2canvas: {
    scale: 3, // A mayor escala, mejores gráficos, pero más peso
    letterRendering: true,
},
jsPDF: {
    unit: "in",
    format: "a3",
    orientation: 'landscape' // landscape o portrait
}
})
.from(element)
.save()
.catch(err => console.log(err));

 })
    if (stringJWT) {
      jwt = parseJwt(stringJWT);
    }

    if (jwt.rol == "administrador") {
      fillSelectDev();
    }else{
      selectContainer.style.display = "none";
    }
    
    console.info()

    idUsuario = jwt.sub;
    console.info(idUsuario);
  };
  document.addEventListener("DOMContentLoaded", onLoaded);
})();
