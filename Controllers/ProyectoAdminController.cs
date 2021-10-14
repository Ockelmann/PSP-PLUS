
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
    public class ProyectoAdminController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var proyectoadmin = (from d in db.Proyectos
                                     select d).ToList();

                return Ok(proyectoadmin);
            }

        }

        [HttpPost]
        public ActionResult Post([FromBody] Models.Proyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = new Models.Proyecto();
                proyecto.Nombre = modelo.Nombre;
                proyecto.Descripcion = modelo.Descripcion;
                proyecto.Cliente = modelo.Cliente;
                proyecto.FechaInicioEsperada = modelo.FechaInicioEsperada;
                proyecto.FechaFinalEsperada = modelo.FechaFinalEsperada;
                proyecto.Dev = modelo.Dev;

                db.Proyectos.Add(proyecto);
                db.SaveChanges();


            }
            return Ok("Se agrego un Proyecto correctamente");
        }

        [HttpPut]
        public ActionResult Put([FromBody] Models.Proyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = db.Proyectos.Find(modelo.IdProyecto);

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
