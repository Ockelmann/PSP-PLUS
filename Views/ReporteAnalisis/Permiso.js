//Albin leonel Cordero
 
document.addEventListener('DOMContentLoaded', () => { 
    
    jwt = parseJwt(stringJWT);
    const headers = {
        'Accept' : "application/json",
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + stringJWT
      };
    
 if (jwt.rol=="desarrollador")
 {
      document.querySelector("#principal").innerHTML=`
      <h1 style="margin-bottom: 20px;">Reporte</h1>
      <div style="display: flex; justify-content: center; align-items: center;">
          <div id="button-container">
              <div class="div button-export" >
                  <button type="button" class="btn export-btn" id="xlsx"
                      onclick="">Exportar Excel</button>
      
              </div>
              <div class="div button-export">
                  <button type="button" class="btn export-btn" id="pdf"
                      onclick="">Exportar PDF</button>
      
              </div>
          </div>
      </div> 

      <div class="input-group rounded" id="input-container" style="display: flex; justify-content: center; align-items: center;">
          <div style="padding: 10px;" class="combo-container">
           Fecha Inicio   <input type="date" id="inicio" class="form-control rounded" >
          </div>
          <div style="padding: 10px;" class="combo-container">
          Fecha Final    <input type="date" id="fin" class="form-control rounded" >
          </div>
          <a onclick="" id="btn">
              <img src="./img/Lupa.svg" id="imgeditar" alt="" style=" width: 45px;">
          </a>
      </div>
      
      `
      
 }else
 {
    document.querySelector("#principal").innerHTML=`
    <h1 style="margin-bottom: 20px;">Reporte</h1>
    <div style="display: flex; justify-content: center; align-items: center;">
        <div id="button-container">
            <div class="div button-export" >
                <button type="button" class="btn export-btn" id="xlsx"
                    onclick="">Exportar Excel</button>
    
            </div>
            <div class="div button-export">
                <button type="button" class="btn export-btn" id="pdf"
                    onclick="">Exportar PDF</button>
    
            </div>
        </div>
    </div> 

    <div class="input-group rounded" id="input-container" style="display: flex; justify-content: center; align-items: center;">
    <div class="select col-md-6">
    Desarrollador
    <select id="select" name="desarrollador" class="form-select" aria-label="Seleccione desarrollador"></select>
  </div> 
    <div style="padding: 10px;" class="combo-container">
    Fecha Inicio   <input type="date" id="inicio" class="form-control rounded" >
    </div>
    <div style="padding: 10px;" class="combo-container">
    Fecha Final    <input type="date" id="fin" class="form-control rounded" >
    </div>
        <a onclick="" id="btn">
            <img src="./img/Lupa.svg" id="imgeditar" alt="" style=" width: 45px;">
        </a>
    </div>
    
    `
 fillSelect()
     
 }



})


 
  const fillSelect = () => {
    usuarioService
      .getUsuarios()
      .then((response) => {
        
        setSelectOptions(response);
      })
      .catch(() => alert("No se pueden obtener usuarios"));
  };

  const setSelectOptions = (usuarios) => {
    select.innerHTML = "";
    const sel = document.querySelector("#select");
    const option =  document.createElement('option');
    option.value="null";
    option.innerText="Seleccione un Desarrolador"
    sel.appendChild(option);
    usuarios.forEach((usuarios) => {
const data = document.createElement('option');
data.value= usuarios.idUsuario;
data.innerText= usuarios.nombres +" " + usuarios.apellidos
sel.appendChild(data);
     });
      
     
    
  };
