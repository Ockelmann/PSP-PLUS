const UrlPeticion = `${URL}/reporteActividadDesarrollador`

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

const headers = {
    'Accept' : "application/json",
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + stringJWT
  };

   async function obtenerActividades(idUsuario, fechaInicio, fechaFinal)  {
    try {
      const resultado = await fetch(`${UrlPeticion}/${idUsuario},${fechaInicio},${fechaFinal}`, {headers});
      const actividades = await resultado.json();
      console.log(actividades);
      return actividades;
    } catch (error) {
      console.log(error);
    }
  }


 