
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//Desarrollador: Rogelio Raúl Castañeda Flores

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReporteErroresDesarrolladorProyecto : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(int idProyecto, int idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var reporte = (from u in db.Usuarios join e in db.ErroresPsps 
                               on u.IdUsuario equals e.IdUsuario
                               where e.IdProyecto == idProyecto && u.IdUsuario == idUsuario select e).ToList();

                return Ok(reporte);
            }
        }
    }
}