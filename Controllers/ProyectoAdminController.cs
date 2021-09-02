
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
        public ActionResult Post(string nombre, string descripcion, string cliente, DateTime fechainicioesperada, DateTime fechafinalesperada, string dev)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = new Models.Proyecto();
                proyecto.Nombre = nombre;
                proyecto.Descripcion = descripcion;
                proyecto.Cliente = cliente;
                proyecto.FechaInicioEsperada = fechainicioesperada;
                proyecto.FechaFinalEsperada = fechafinalesperada;
                proyecto.Dev = dev;

                db.Proyectos.Add(proyecto);
                db.SaveChanges();


            }
            return Ok("Se agrego un Proyecto correctamente");
        }

        [HttpPut]
        public ActionResult Put(int? idproyecto,string nombre, string descripcion, string cliente, DateTime fechainicioesperada, DateTime fechafinalesperada, string dev, decimal totalhorastrabajadas)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = db.Proyectos.Find(idproyecto);
                Console.WriteLine(idproyecto);
                proyecto.Nombre = nombre;
                proyecto.Descripcion = descripcion;
                proyecto.Cliente = cliente;
                proyecto.FechaInicioEsperada = fechainicioesperada;
                proyecto.FechaFinalEsperada = fechafinalesperada;
                proyecto.Dev = dev;
                proyecto.TotalHorasTrabajadas = totalhorastrabajadas;

                db.Entry(proyecto).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();


            }
            return Ok("Proyecto actualizado correctamente");
        }

        [HttpDelete]
        public ActionResult Delete(int? idproyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Proyecto proyecto = db.Proyectos.Find(idproyecto);
                db.Proyectos.Remove(proyecto);
                db.SaveChanges();

            }
            return Ok("Proyecto eliminado correctamente");
        }


    }
}
