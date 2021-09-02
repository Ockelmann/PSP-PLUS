//Roberto González
const cardListElement = document.getElementById("lista-erroesp");

const inputproyecto = document.querySelector('#equipo');
const inpuntsearch = document.querySelector('#search');
const alerta = document.querySelector('#alert');

const array = ["--Seleccione un proyecto--"];
const array2 = [0];


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
    getProyectos();
}


async function getProyectos() {
    var url;
    if(jwt.rol == "desarrollador"){
        url = `https://localhost:5001/api/ReporteErroresProyecto?idUsuario=${jwt.sub}`;
    }else if(jwt.rol == "administrador"){
        url = `https://localhost:5001/api/ReporteErroresProyecto`;
    }
    

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
    datos.forEach(proyectos => {
        array.push(proyectos.nombre)
        array2.push(proyectos.idProyecto)
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




async function GetDatos() {
    if(inputproyecto.value== 0){
        alerta.style.display = 'block';
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 3000);
    }else{
    const url = `https://localhost:5001/api/ReporteErroresProyectoTabla?idProyecto=${inputproyecto.value}`;

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
}


function mostrarDatos(datos) {
    document.getElementById("lista-erroesp").innerHTML = "";


    if(datos.length>0)
  {
    datos.forEach(proyectos => {
        //var fechaSplit = proyectos.fechaNacimiento.split("T");
        //var fecha = fechaSplit[0];
        const card = `
            <tr>
              <td>${proyectos.nombres} ${proyectos.apellidos}</td>
              <td>${proyectos.email}</td>
              <td>${proyectos.cantidadErrores}</td>
              <td>${proyectos.cantidadHoras.toFixed(2)}</td>
            </tr>
        `;
        cardListElement.innerHTML += card;
    })
    
}
else
{
    cardListElement.innerHTML +=`<tr> <td colspan="4"> Sin Resultados el proyecto </td> </tr>`;

}

}