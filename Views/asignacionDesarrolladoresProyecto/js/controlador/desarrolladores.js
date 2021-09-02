(function () {
  const listado = document.getElementById("lista-usuarios");
  
  const addButton = document.getElementById("buttonAdd");
  const alerta = document.getElementById("eliminado");
  const titulo = document.getElementById('subtitle');
  let idProyect;
//

 
  addButton.addEventListener("click", addView);

  async function mostrarProyecto() {
    const proyecto = await obtenerProyecto(idProyect);
    console.info(proyecto);
    const [{idProyecto, nombre, descripcion}] = proyecto;
    titulo.innerHTML += `
    <h2 class="project__subtitle">Proyecto: ${nombre}</h2>
    <p class="text-sm-start"> Descripción: ${descripcion}</p>
    `;
  }

  async function mostrarUsuarios() {
    listado.innerHTML = "";
    const usuarios = await obtenerUsuarios(idProyect);
    console.info(usuarios);

    usuarios.forEach((element) => {
      const { idUsuario, idProyecto, nombre, apellido, correo } = element;

      const row = document.createElement("tr");
      row.innerHTML += `
              <td>${nombre} ${apellido}</td>
              <td>${correo}</td>
              <td id="delete"><button class="btn delete eliminar" data-id="${idUsuario}" data-usuario="${idProyecto}" style="background-color: #09254F; color:white;"> Eliminar </button></td>`;

             

      listado.appendChild(row);

      
    });

    var td =  document.getElementsByClassName("eliminar");

      for (var i = 0; i < td.length; i++) {
        td[i].addEventListener('click', confirmacionEliminacion);
      }
  }

  function addView() {
    window.location.href = `./agregarDesarrolladores.html?idProyecto=${idProyect}`;
  }

  const alertaEliminado = () => {
    alerta.textContent = "Usuario Eliminado Correctamente";
    alerta.style.display = "block";
    setTimeout(() => {
      alerta.style.display = "none";
    }, 3000);
  };

  function confirmacionEliminacion(e) {
    e.preventDefault();
    const idU = e.target.dataset.id;
    const idP = e.target.dataset.usuario;

    const user = {
      idUsuario: idU,
      idProyecto: idP,
    };

    Swal.fire({
      title: 'Eliminar desarrollador',
      text: "¿Estas seguro que deseas eliminar el desarrollador de este proyecto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        usuariosProyectoService.deleteUsuariosProyecto(user).then( () => {
          Swal.fire('Desarrollador Eliminado!')
          mostrarUsuarios();
        });
      }
    })
  }
    /*
    const confirmar = confirm("¿Desea eliminar el usuario?");
    if (confirmar) {
      await usuariosProyectoService.deleteUsuariosProyecto(user);
      mostrarUsuarios();
      alertaEliminado();
    }
  }*/

  const onLoaded = () => {
    const parametrosURL = new URLSearchParams(window.location.search);
    idProyect = parametrosURL.get("idProyecto");
    mostrarUsuarios();
    mostrarProyecto();
  };
  document.addEventListener("DOMContentLoaded", onLoaded);


  
})();



