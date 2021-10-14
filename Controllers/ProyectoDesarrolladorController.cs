
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
    public class ProyectoDesarrolladorController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get( int idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var proyectos = (from p in db.Proyectos join d in db.UsuarioProyectos on p.IdProyecto equals d.IdProyecto where d.IdUsuario == idUsuario select p).ToList();

                return Ok(proyectos);
            }

        }

        [HttpPost]
        public ActionResult Post([FromBody] Models.Proyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = new Models.Proyecto();
                Models.UsuarioProyecto usuarioproyecto = new Models.UsuarioProyecto();
                proyecto.Nombre = modelo.Nombre;
                proyecto.Descripcion = modelo.Descripcion;
                proyecto.Cliente = modelo.Cliente;
                proyecto.FechaInicioEsperada = modelo.FechaInicioEsperada;
                proyecto.FechaFinalEsperada = modelo.FechaFinalEsperada;
                proyecto.Dev = modelo.Dev; 
                db.Proyectos.Add(proyecto);

                

                db.SaveChanges();

                return Ok(proyecto);
            }
        }

        [HttpPut]
        public ActionResult Put([FromBody] Models.Proyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = db.Proyectos.Find(modelo.IdProyecto);
                Console.WriteLine(modelo.IdProyecto);
                proyecto.Nombre = modelo.Nombre;
                proyecto.Descripcion = modelo.Descripcion;
                proyecto.Cliente = modelo.Cliente;
                proyecto.FechaInicioEsperada = modelo.FechaInicioEsperada;
                proyecto.FechaFinalEsperada = modelo.FechaFinalEsperada;
                proyecto.Dev = modelo.Dev;

                db.Entry(proyecto).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();


            }
            return Ok("Proyecto actualizado correctamente");
        }

        [HttpDelete]
        public ActionResult Delete([FromBody] Models.Proyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = db.Proyectos.Find(modelo.IdProyecto);
                db.Proyectos.Remove(proyecto);
                db.SaveChanges();

            }
            return Ok("Proyecto eliminado correctamente");
        }

    }
}
