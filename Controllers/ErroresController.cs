using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// DOCUMENTO RELIZADO POR: Erick Eduardo Echeverría Garrido (EE) 11/08/2021

// --- IMPORTANTE >>>> El "GET" se encuentra también funcionando en -ActividadesPSPController.cs-

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ErroresController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(int idUsuario, int? idErrorPsp, int? idProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {

                if(idProyecto != null)
                {

                    var maxCorrelativo = (from d in db.ErroresPsps
                                          select d).Where(d => d.IdProyecto == idProyecto).Count();

                    if(maxCorrelativo == 0)
                    {
                        maxCorrelativo = 0;
                        return Ok(maxCorrelativo);
                    }
                    else
                    {
                        maxCorrelativo = (from d in db.ErroresPsps
                                          select d).Where(d => d.IdProyecto == idProyecto).Max(d => d.Correlativo);

                        return Ok(maxCorrelativo);
                    }
                    
                    
                }

                var errorPSP = (from d in db.ErroresPsps
                                select d).Where(d => d.IdErrorPsp == idErrorPsp).Where(d => d.IdUsuario == idUsuario).ToList();

                return Ok(errorPSP);

            }
        }

        [HttpPost]
        public ActionResult Post(DateTime fecha, string descripcion, string solucion, int correlativo, string tipoError, string introducido, string eliminado,
            DateTime fechaHoraInicio, DateTime fechaHoraFinal, decimal tiempoCorrecion, string lenguaje, int? idProyecto, int idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.ErroresPsp error = new Models.ErroresPsp();

                error.Fecha = fecha;
                error.Descripcion = descripcion;
                error.Solucion = solucion;
                error.Correlativo = correlativo;
                error.TipoError = tipoError;
                error.Introducido = introducido;
                error.Eliminado = eliminado;
                error.FechaHoraInicio = fechaHoraInicio;
                error.FechaHoraFinal = fechaHoraFinal;
                error.TiempoCorrecion = tiempoCorrecion;
                error.LenguajeDesarrollo = lenguaje;
                if (idProyecto != null)
                {
                    error.IdProyecto = idProyecto;
                }
                error.IdUsuario = idUsuario;

                db.ErroresPsps.Add(error);
                db.SaveChanges();

            }

            return Ok("El error se agrego correctamente");
        }

        [HttpDelete]
        public ActionResult Delete(int idErrorPSP)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                try
                {
                    Models.ErroresPsp errores = db.ErroresPsps.Find(idErrorPSP);

                    db.ErroresPsps.Remove(errores);
                    db.SaveChanges();

                    return Ok("El error se elimino correctamente");
                }
                catch (Exception)
                {
                    return Ok("Error");
                }
            }
        }

        [HttpPut]
        public ActionResult Put(int idErrorPSP, DateTime fecha, string descripcion, string solucion, int correlativo, string tipoError, string introducido, string eliminado,
            DateTime fechaHoraInicio, DateTime fechaHoraFinal, decimal tiempoCorrecion, string lenguaje, int? idProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.ErroresPsp datos = db.ErroresPsps.Find(idErrorPSP);

                datos.Fecha = fecha;
                datos.Descripcion = descripcion;
                datos.Solucion = solucion;
                datos.Correlativo = correlativo;
                datos.TipoError = tipoError;
                datos.Introducido = introducido;
                datos.Eliminado = eliminado;
                datos.FechaHoraInicio = fechaHoraInicio;
                datos.FechaHoraFinal = fechaHoraFinal;
                datos.TiempoCorrecion = tiempoCorrecion;
                datos.LenguajeDesarrollo = lenguaje;
                if (idProyecto != null)
                {
                    datos.IdProyecto = idProyecto;
                }
                else
                {
                    datos.IdProyecto = null;
                }

                db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

            }
        }


    }
}
