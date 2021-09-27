const requestUrl = `${URL_Global}/ComboDesarrolladores`


const usuarioService = {
    getUsuarios() {
      return fetch(requestUrl, {
        method: "GET",
        headers
      }).then((response) => response.json());
    },
  };