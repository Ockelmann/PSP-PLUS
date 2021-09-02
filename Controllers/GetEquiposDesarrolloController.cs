
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class GetEquiposDesarrolloController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(int? idEquipo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                if (idEquipo != null)
                {
                    var equipo = db.EquipoDesarrollos.Find(idEquipo);

                    return Ok(equipo);
                }
                else
                {
                    var equipos = (from d in db.EquipoDesarrollos select d).ToList();

                    return Ok(equipos);
                }
            }
        }

        [HttpPost]
        public ActionResult Post(string nombre, string descripcion)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.EquipoDesarrollo equipoDesarrollo = new Models.EquipoDesarrollo();

                equipoDesarrollo.Nombre = nombre;
                equipoDesarrollo.Descripcion = descripcion;

                db.EquipoDesarrollos.Add(equipoDesarrollo);
                db.SaveChanges();

            }

            return Ok("El equipo se añadio correctamente");
        }

        [HttpPut]
        public ActionResult Put(int? idEquipo, string nombre, string descripcion)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.EquipoDesarrollo datos = db.EquipoDesarrollos.Find(idEquipo);

                datos.Nombre = nombre;
                datos.Descripcion = descripcion;
                
                db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

            }
        }

        [HttpDelete]
        public ActionResult Delete(int? idEquipo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.EquipoDesarrollo equipo = db.EquipoDesarrollos.Find(idEquipo);


                db.EquipoDesarrollos.Remove(equipo);
                db.SaveChanges();

                return Ok("El equipo se elimino correctamente");

            }
        }
    }
}
