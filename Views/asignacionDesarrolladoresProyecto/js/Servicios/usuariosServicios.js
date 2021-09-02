const requestUrl = `${URL}/ComboDesarrolladores`


const usuarioService = {
    getUsuarios() {
      return fetch(requestUrl, {
        method: "GET",
        headers
      }).then((response) => response.json());
    },
  };