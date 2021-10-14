
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
        public ActionResult Post([FromBody] Models.TiemposPsp modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.TiemposPsp actividad = new Models.TiemposPsp();

                actividad.FechaHoraInicio = modelo.FechaHoraInicio;
                actividad.FechaHoraFinal = modelo.FechaHoraFinal;

                actividad.FechaRealGrabacion = DateTime.Now;
                actividad.Descripcion = modelo.Descripcion;
                if (modelo.IdProyecto != null)
                {
                    actividad.IdProyecto = modelo.IdProyecto;
                }



                actividad.IdUsuario = modelo.IdUsuario;

                actividad.Cronometro = modelo.Cronometro;

                db.TiemposPsps.Add(actividad);
                db.SaveChanges();

            }

            return Ok("La actividad se agrego correctamente");
        }


        [HttpDelete]
        public ActionResult Delete([FromBody] Models.TiemposPsp modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                try
                {
                   Models.TiemposPsp actividad = db.TiemposPsps.Find(modelo.IdTiempoPsp);

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
        public ActionResult Put([FromBody] Models.TiemposPsp modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.TiemposPsp datos = db.TiemposPsps.Find(modelo.IdTiempoPsp);

                datos.FechaHoraInicio = modelo.FechaHoraInicio;
                datos.FechaHoraFinal = modelo.FechaHoraFinal;
                datos.Descripcion = modelo.Descripcion;
                if(modelo.IdProyecto != null)
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
