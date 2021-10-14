const select = document.getElementById("select");
const btnAgregar = document.getElementById("agregar");
const form = document.getElementById("form");
let idProyecto;


const setSelectOptions = (usuarios) => {
  select.innerHTML = "";
  let selectHtml =
    '<option selected value="">Seleccione un desarrollador</option>';
  usuarios.forEach((usuarios) => {
    selectHtml += `<option value="${usuarios.idUsuario}">${usuarios.nombres} ${usuarios.apellidos}</option>`;
  });
  select.innerHTML = selectHtml;
};

const fillSelect = () => {
  usuarioService
    .getUsuarios()
    .then((response) => {
       
      setSelectOptions(response);
    })
    .catch(() => alert("No se pueden obtener usuarios"));
};

const guardarUsuario = (e) => {
  e.preventDefault();
  const usuarioP = {
    idUsuario: Number(select.value),
    idProyecto,
  };
  
  usuariosProyectoService.saveUsuariosProyecto(usuarioP);
  
 
 
};


const onLoaded = () => {
    const parametrosURL = new URLSearchParams(window.location.search);
    idProyecto = parametrosURL.get('idProyecto');
    document.querySelector("#relacion").hidden=true;

    fillSelect();
}
document.addEventListener("DOMContentLoaded", onLoaded);
btnAgregar.addEventListener("click", guardarUsuario);
