using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AgregarActividadCronometroController : ControllerBase
    {

        [HttpPost]
        public ActionResult Post([FromBody] Models.TiemposPsp modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.TiemposPsp actividad = new Models.TiemposPsp();

                actividad.FechaHoraInicio = modelo.FechaHoraInicio;
                actividad.FechaHoraFinal = modelo.FechaHoraFinal;

                actividad.FechaRealGrabacion = DateTime.Now;
                actividad.Descripcion = modelo.Descripcion;

                actividad.IdProyecto = modelo.IdProyecto;
    
                actividad.IdUsuario = modelo.IdUsuario;

                actividad.Cronometro = modelo.Cronometro;

                db.TiemposPsps.Add(actividad);
                db.SaveChanges();

            }

            return Ok("La actividad se agrego correctamente");
        }

    }
}
