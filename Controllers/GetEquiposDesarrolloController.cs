
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
        public ActionResult Post([FromBody] Models.EquipoDesarrollo modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.EquipoDesarrollo equipoDesarrollo = new Models.EquipoDesarrollo();

                equipoDesarrollo.Nombre = modelo.Nombre;
                equipoDesarrollo.Descripcion = modelo.Descripcion;

                db.EquipoDesarrollos.Add(equipoDesarrollo);
                db.SaveChanges();

            }

            return Ok("El equipo se añadio correctamente");
        }

        [HttpPut]
        public ActionResult Put([FromBody] Models.EquipoDesarrollo modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.EquipoDesarrollo datos = db.EquipoDesarrollos.Find(modelo.IdEquipoDesarrollo);

                datos.Nombre = modelo.Nombre;
                datos.Descripcion = modelo.Descripcion;
                
                db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

            }
        }

        [HttpDelete]
        public ActionResult Delete([FromBody] Models.EquipoDesarrollo modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.EquipoDesarrollo equipo = db.EquipoDesarrollos.Find(modelo.IdEquipoDesarrollo);


                db.EquipoDesarrollos.Remove(equipo);
                db.SaveChanges();

                return Ok("El equipo se elimino correctamente");

            }
        }
    }
}
