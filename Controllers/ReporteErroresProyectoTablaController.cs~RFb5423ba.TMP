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
    public class ReporteErroresProyectoTablaController : ControllerBase
    {

        [HttpGet]
        public ActionResult Get(int? idProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var reporteProyectos = db.Usuarios.Join(
                        db.ErroresPsps, u => u.IdUsuario, e => e.IdUsuario,
                        (u, e) => new
                        {
                            idProyecto = e.IdProyecto,
                            nombres = u.Nombres,
                            apellidos = u.Apellidos,
                            email = u.Email,
                            cantidadErrores = calcularErrores(u.IdUsuario, e.IdProyecto),
                            cantidadHoras = calcularHoras(u.IdUsuario, e.IdProyecto)
                        }

                    ).Where(errores => errores.idProyecto == idProyecto).Distinct().ToList();

                return Ok(reporteProyectos);

            }
        }

        public static int calcularErrores(int idUsuario, int? idProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var Conteo = (from e in db.ErroresPsps join u in db.Usuarios on e.IdUsuario equals u.IdUsuario where u.IdUsuario == idUsuario && e.IdProyecto == idProyecto select e).Count();

                return Conteo;
            }
        }

        public static decimal calcularHoras(int idUsuario, int? idProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                decimal Horas = 0;
                var ListaErrores = (from e in db.ErroresPsps join u in db.Usuarios on e.IdUsuario equals u.IdUsuario where u.IdUsuario == idUsuario && e.IdProyecto == idProyecto select e).ToList();

                foreach (var item in ListaErrores)
                {
                    Horas = Horas + item.TiempoCorrecion;
                }

                return Horas / 60;
            }
        }
    }
}
