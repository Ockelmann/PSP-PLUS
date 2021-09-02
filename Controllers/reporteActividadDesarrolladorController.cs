
﻿using Microsoft.AspNetCore.Authorization;
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
    public class reporteActividadDesarrolladorController : ControllerBase
    {
        [HttpGet("{id},{fechaInicio},{fechaFinal}")]
        public ActionResult Get(int id, DateTime fechaInicio, DateTime fechaFinal)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var query = db.TiemposPsps.Select(actividad => new
                {
                   IdActividad = actividad.IdTiempoPsp, 
                   IdUsuario = actividad.IdUsuario, 
                   IdProyecto = actividad.IdProyecto, 
                   NombreUsuario = actividad.IdUsuarioNavigation.Nombres, 
                   ApellidoUsuario = actividad.IdUsuarioNavigation.Apellidos, 
                   NombreProyecto = actividad.IdProyectoNavigation.Nombre,
                   DescripcionProyecto = actividad.IdProyectoNavigation.Descripcion,
                   DescripcionActividad = actividad.Descripcion,
                   FechaInicio = actividad.FechaHoraInicio, 
                   FechaFinal = actividad.FechaHoraFinal
                }).Where(actividad => actividad.FechaInicio  >= fechaInicio && actividad.FechaFinal <= fechaFinal && actividad.IdUsuario == id ).ToList();

                return Ok(query);

            }
        }
    }
}

