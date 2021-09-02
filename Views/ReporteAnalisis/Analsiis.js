
//Albin Cordero 


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

document.addEventListener('DOMContentLoaded', () => {
const bt = document.querySelector("#btn");
    const inicio = document.querySelector("#inicio")
    const fn = document.querySelector("#fin")
     const pdf= document.querySelector("#pdf")
     
     
     const ex = document.querySelector("#xlsx")
     const msg = document.querySelector("#alert")
     pdf.hidden=true;
     ex.hidden=true;
     msg.hidden=true;

     ex.addEventListener('click',() =>
     {
        tableToExcel('Reporte', 'W3C Example Table')
     })
     pdf.addEventListener('click',() => {
 
 
        var element = document.querySelector('#Reporte');
       
        html2pdf()
    .set({
        margin: 1.2,
        filename: 'Analisis'+Date.now()+'.pdf',
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
  inicio.addEventListener('change',() => {

    fn.setAttribute("min",inicio.value)
  })
  fn.addEventListener('change',() => {

    inicio.setAttribute("max",fn.value)
  })
  bt.addEventListener('click',() => {
    jwt = parseJwt(stringJWT);
    console.log(jwt.rol) 
    if(jwt.rol=="administrador"){
        const sel = document.querySelector("#select");
            console.log(sel.value)
        if(inicio.value=="" || fin.value=="" || sel.value=="null" )
        {
            document.querySelector("#alert").hidden=false;
    document.querySelector("#alert").innerHTML="Todos Los Campos Son Requeridos para la busqueda"
    setTimeout(() => {
        msg.hidden=true;
    }, 3000);
        }
        else
        {
            pdf.hidden=false;
            ex.hidden=false;
            let fnn= String(inicio.value) + ' 00:00:00';
        let inn= String(fin.value) + ' 23:59:59';
        
       
       
        
            
            
            const url = `https://localhost:5001/api/Reporte_Analisis/${sel.value},${fnn},${inn}`;
            cargar(url);
        
         
    
        }
       
    }
     
    if(jwt.rol=="desarrollador")
    {
        if(inicio.value=="" || fin.value=="")
    {
        document.querySelector("#alert").hidden=false;
document.querySelector("#alert").innerHTML="Todos Los Campos Son Requeridos para la busqueda"
setTimeout(() => {
    msg.hidden=true;
}, 3000);
    }
    else
    {
        pdf.hidden=false;
        ex.hidden=false;
        let fnn= String(inicio.value) + ' 00:00:00';
    let inn= String(fin.value) + ' 23:59:59';
    
   
   
     
        const url = `https://localhost:5001/api/Reporte_Analisis/${jwt.sub},${fnn},${inn}`;
        cargar(url);
     
     

    }
    }

    

} )
})

const headers = {
    'Accept' : "application/json",
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + stringJWT
  };
  
async function  cargar(url) {
    await fetch(url, {
        headers,
    })
        .then(respuesta => respuesta.json())
        .then(resultado => {
           mostrar(resultado);
        })
}


function mostrar(reporte) {
   
   const lista= document.querySelector("#datos");
   lista.innerHTML=""
  if(reporte.length>0)
  {
    reporte.forEach(re => {
        const {proyecto,inicio,fin,tiempo,tareas} = re
        lista.innerHTML +=`<tr> <td>${proyecto}</td> <td>${inicio.split('T')[0]}</td> <td>${fin.split('T')[0]}</td> <td>${tiempo.toFixed(2)} Hrs</td> <td>${tareas}</td>  </tr>`;
      });
  }
  else
  {
    lista.innerHTML +=`<tr> <td colspan="5"> Sin Resultados entre las fechas seleccionadas </td> </tr>`;

  }
}

 