
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// DOCUMENTO RELIZADO POR: Erick Eduardo Echeverría Garrido (EE) 5/08/2021
// DOCUMENTO ACTUALIZADO POR: Erick Eduardo Echeverría Garrido (EE) 10/08/2021

// --- IMPORTANTE >>>> El "GET" de -ErroresController- se encuentra funcionando en este archivo

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ActividadesPSPController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(int idUsuario, int? idProyecto, int? buscarProyecto, int? idTiempoPSP, int? actividadesSinProyecto, DateTime? fechaInicioFiltrado, DateTime? fechaFinalFiltrado)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                if(idTiempoPSP != null) // Datos para editar la actividad PSP
                {
                    var actividades = (from d in db.TiemposPsps
                                       select d).Where(d => d.IdTiempoPsp == idTiempoPSP).Where(d => d.IdUsuario == idUsuario).ToList();

                    return Ok(actividades);
                }

                if (actividadesSinProyecto != null) // Obtendra los tiempos PSP sin ningún proyecto relacionado
                {
                    var actividades = (from d in db.TiemposPsps
                                       select d).Where(d => d.IdProyecto == null).Where(d => d.FechaHoraInicio >= fechaInicioFiltrado).Where(d => d.FechaHoraFinal <= fechaFinalFiltrado).OrderBy(d => d.FechaHoraInicio).ToList();

                    var errores = (from d in db.ErroresPsps
                                   select d).Where(d => d.IdProyecto == null).Where(d => d.FechaHoraInicio >= fechaInicioFiltrado).Where(d => d.FechaHoraFinal <= fechaFinalFiltrado).OrderBy(d => d.FechaHoraInicio).ToList();

                    return Ok(new { actividades, errores });
                }

                if (idProyecto == null && buscarProyecto == null) //Obtendra los tiempos PSP al cargar sin ningún filtrado
                {
                    if(fechaInicioFiltrado == null)
                    {
                        var actividades = (from d in db.TiemposPsps
                                           select d).Where(d => d.IdUsuario == idUsuario).OrderBy(d => d.FechaHoraInicio).ToList();

                        var errores = (from d in db.ErroresPsps
                                           select d).Where(d => d.IdUsuario == idUsuario).OrderBy(d => d.FechaHoraInicio).ToList();

                        return Ok( new { actividades, errores });
                    }
                    else
                    {
                        var actividades = (from d in db.TiemposPsps
                                           select d).Where(d => d.IdUsuario == idUsuario).Where(d => d.FechaHoraInicio >= fechaInicioFiltrado).Where(d => d.FechaHoraFinal <= fechaFinalFiltrado).OrderBy(d => d.FechaHoraInicio).ToList();

                        var errores = (from d in db.ErroresPsps
                                            select d).Where(d => d.IdUsuario == idUsuario).Where(d => d.FechaHoraInicio >= fechaInicioFiltrado).Where(d => d.FechaHoraFinal <= fechaFinalFiltrado).OrderBy(d => d.FechaHoraInicio).ToList();

                        return Ok(new { actividades, errores });
                    }
 
                }
                else
                {
                    if (buscarProyecto == null)
                    {
                        // Buscara por filtrado
                        var actividades = (from d in db.TiemposPsps
                                           select d).Where(d => d.IdUsuario == idUsuario).Where(d => d.IdProyecto == idProyecto).Where(d => d.FechaHoraInicio >= fechaInicioFiltrado).Where(d => d.FechaHoraFinal <= fechaFinalFiltrado).OrderBy(d => d.FechaHoraInicio).ToList();

                        var errores = (from d in db.ErroresPsps
                                            select d).Where(d => d.IdUsuario == idUsuario).Where(d => d.IdProyecto == idProyecto).Where(d => d.FechaHoraInicio >= fechaInicioFiltrado).Where(d => d.FechaHoraFinal <= fechaFinalFiltrado).OrderBy(d => d.FechaHoraInicio).ToList();

                        return Ok(new { actividades, errores });
                    }
                    else
                    {
                        // Obtiene los proyectos el cual es usuario este relacionado
                        var proyectos = (from p in db.Proyectos join d in db.UsuarioProyectos on p.IdProyecto equals d.IdProyecto where d.IdUsuario == idUsuario select p).ToList();


                        return Ok(proyectos);
                    }

                        
                }
            }
        }


        [HttpPost]
        public ActionResult Post(DateTime fechaHoraInicio, DateTime fechaHoraFinal, string descripcion, int? idProyecto, int idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.TiemposPsp actividad = new Models.TiemposPsp();

                actividad.FechaHoraInicio = fechaHoraInicio;
                actividad.FechaHoraFinal = fechaHoraFinal;
                actividad.Descripcion = descripcion;
                if(idProyecto != null)
                {
                    actividad.IdProyecto = idProyecto;
                }
                actividad.IdUsuario = idUsuario;
 
                db.TiemposPsps.Add(actividad);
                db.SaveChanges();

            }

            return Ok("La actividad se agrego correctamente");
        }


        [HttpDelete]
        public ActionResult Delete(int idTiempoPSP)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                try
                {
                   Models.TiemposPsp actividad = db.TiemposPsps.Find(idTiempoPSP);

                    db.TiemposPsps.Remove(actividad);
                    db.SaveChanges();

                    return Ok("La actividad se elimino correctamente");
                }
                catch (Exception)
                {
                    return Ok("Error");
                }
            }
        }

        [HttpPut]
        public ActionResult Put(int idTiempoPSP, DateTime fechaHoraInicio, DateTime fechaHoraFinal, string descripcion, int? idProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.TiemposPsp datos = db.TiemposPsps.Find(idTiempoPSP);

                datos.FechaHoraInicio = fechaHoraInicio;
                datos.FechaHoraFinal = fechaHoraFinal;
                datos.Descripcion = descripcion;
                if(idProyecto != null)
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
