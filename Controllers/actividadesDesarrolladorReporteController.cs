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
    public class actividadesDesarrolladorReporteController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(DateTime FechaInicio, DateTime FechaFinal)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var query = db.TiemposPsps.Select(actividad => new
                {
                    idActividad = actividad.IdTiempoPsp,
                    idProyecto = actividad.IdProyecto,
                    idUsuario = actividad.IdUsuario,
                    NombreUsuario = actividad.IdUsuarioNavigation.Nombres,
                    ApellidoUsuario = actividad.IdUsuarioNavigation.Apellidos,
                    NombreProyecto = actividad.IdProyectoNavigation.Nombre,
                    Descripcion = actividad.Descripcion,
                    fechaInicio = actividad.FechaHoraInicio,
                    fechaFinal = actividad.FechaHoraFinal,
                    horas = actividad.FechaHoraInicio - actividad.FechaHoraInicio


                }).Where(actividad => actividad.fechaInicio >= FechaInicio && actividad.fechaFinal <= FechaFinal).ToList();

                return Ok(query);

            }
        }
    }
}
