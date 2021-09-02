
﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
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
    public class GetProyectosBusquedaController : ControllerBase
    {

        [HttpGet]
        public ActionResult Get(string nombreProyecto, int? idUsuarios)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                if(idUsuarios != null)
                {

                    var proyectos = db.UsuarioProyectos.Join(
                        db.Proyectos, u => u.IdProyecto, e => e.IdProyecto,
                        (u, e) => new
                        {
                            idUsuario = u.IdUsuario,
                            idProyecto = e.IdProyecto,
                            Nombre = e.Nombre,
                            Descripcion = e.Descripcion,
                            Cliente = e.Cliente,
                            FechaInicioEsperada = e.FechaInicioEsperada,
                            FechaInicioReal = e.FechaInicioReal,
                            FechaFinalEsperada = e.FechaFinalEsperada,
                            FechaFinalReal = e.FechaFinalReal,
                            Dev = e.Dev,
                            TotalHorasTrabajadas = e.TotalHorasTrabajadas
                        }

                    ).Where(e => e.Nombre.Contains(nombreProyecto)&& e.idUsuario == idUsuarios).ToList();

                    //var proyectos = (from p in db.Proyectos join d in db.UsuarioProyectos on p.IdProyecto equals d.IdProyecto where d.IdUsuario == idUsuario  select p.Nombre).Contains(nombreProyecto);


                    return Ok(proyectos);
                }
                else
                {

                    var proyectos = (from d in db.Proyectos.Where(p => p.Nombre.Contains(nombreProyecto))select d).ToList();


                    return Ok(proyectos);
                }

            }

        }

    }
}

