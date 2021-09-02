
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
    public class ReporteErroresProyectoController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get( int? idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                if(idUsuario == null)
                {
                
                    var proyectos = (from p in db.Proyectos join d in db.UsuarioProyectos on p.IdProyecto equals d.IdProyecto select p).Distinct().ToList();
                
                    return Ok(proyectos);
                }
                else
                {
                    var proyectos = (from p in db.Proyectos join d in db.UsuarioProyectos on p.IdProyecto equals d.IdProyecto where d.IdUsuario == idUsuario select p).Distinct().ToList();

                    return Ok(proyectos);

                }
            }
        }



    }
}
