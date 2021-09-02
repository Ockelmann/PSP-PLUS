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
    public class ReporteTipoErrorController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(string tipoerror, int? idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {


                if (idUsuario == null)
                {

                    var reporte = db.Proyectos.Join(
                    db.ErroresPsps, u => u.IdProyecto, e => e.IdProyecto,
                    (u, e) => new
                    {
                        solucion = e.Solucion,
                        tipoError = e.TipoError,
                        introducido = e.Introducido,
                        eliminado = e.Eliminado,
                        fechaHoraInicio = e.FechaHoraInicio,
                        fechaHoraFinal = e.FechaHoraFinal,
                        nombreProyecto = u.Nombre
                    }

                ).Where(errores => errores.tipoError == tipoerror).Distinct().ToList();


                    return Ok(reporte);


                }
                else
                {



                    var reporte = db.Proyectos.Join(
                        db.ErroresPsps, u => u.IdProyecto, e => e.IdProyecto,
                        (u, e) => new
                        {
                            idusuario = e.IdUsuario,
                            solucion = e.Solucion,
                            tipoError = e.TipoError,
                            introducido = e.Introducido,
                            eliminado = e.Eliminado,
                            fechaHoraInicio = e.FechaHoraInicio,
                            fechaHoraFinal = e.FechaHoraFinal,
                            nombreProyecto = u.Nombre
                        }

                    ).Where(errores => errores.tipoError == tipoerror && errores.idusuario == idUsuario).Distinct().ToList();


                    return Ok(reporte);
                }
            }
        }
    }
}
