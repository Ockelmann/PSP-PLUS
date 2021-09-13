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
        public ActionResult Post([FromBody] Models.ErroresPsp modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.ErroresPsp error = new Models.ErroresPsp();

                error.Fecha = modelo.Fecha;
                error.Descripcion = modelo.Descripcion;
                error.Solucion = modelo.Solucion;
                error.Correlativo = modelo.Correlativo;
                error.TipoError = modelo.TipoError;
                error.Introducido = modelo.Introducido;
                error.Eliminado = modelo.Eliminado;
                error.FechaHoraInicio = modelo.FechaHoraInicio;
                error.FechaHoraFinal = modelo.FechaHoraFinal;
                error.TiempoCorrecion = modelo.TiempoCorrecion;
                error.LenguajeDesarrollo = modelo.LenguajeDesarrollo;
                error.FechaRealGrabacion = DateTime.Now;
                if (modelo.IdProyecto != null)
                {
                    error.IdProyecto = modelo.IdProyecto;
                }
                error.IdUsuario = modelo.IdUsuario;
                error.Cronometro = modelo.Cronometro;
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
        public ActionResult Put([FromBody] Models.ErroresPsp modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.ErroresPsp datos = db.ErroresPsps.Find(modelo.IdErrorPsp);

                datos.Fecha = modelo.Fecha;
                datos.Descripcion = modelo.Descripcion;
                datos.Solucion = modelo.Solucion;
                datos.Correlativo = modelo.Correlativo;
                datos.TipoError = modelo.TipoError;
                datos.Introducido = modelo.Introducido;
                datos.Eliminado = modelo.Eliminado;
                datos.FechaHoraInicio = modelo.FechaHoraInicio;
                datos.FechaHoraFinal = modelo.FechaHoraFinal;
                datos.TiempoCorrecion = modelo.TiempoCorrecion;
                datos.LenguajeDesarrollo = modelo.LenguajeDesarrollo;
                if (modelo.IdProyecto != null)
                {
                    datos.IdProyecto = modelo.IdProyecto;
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
