using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
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
    [EnableCors("permitir")]
    [Authorize]
    public class PerfilController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(int? idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var reporteProyectos = db.Usuarios.Join(
                         db.EquipoDesarrollos, u => u.IdEquipoDesarrollo, e => e.IdEquipoDesarrollo,
                         (u, e) => new
                         {
                             idusuario = u.IdUsuario,
                             nombres = u.Nombres,
                             apellidos = u.Apellidos,
                             email = u.Email,
                             clave = u.Clave,
                             fechaNacimiento = u.FechaNacimiento,
                             nombreEquipo = e.Nombre,        
                             idEquipoDesarrollo = u.IdEquipoDesarrollo

                         }

                     ).Where(er => er.idusuario == idUsuario).Distinct().First();

                return Ok(reporteProyectos);
            }
        }

        [HttpPut]
        public ActionResult Put(int? idUsuario, string nombre, string apellido, string email, string clave, DateTime fechaNacimiento, int idEquipo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Usuario datos = db.Usuarios.Find(idUsuario);

                datos.Nombres = nombre;
                datos.Apellidos = apellido;
                datos.Email = email;
                datos.Clave = clave;
                datos.FechaNacimiento = fechaNacimiento;
                datos.IdEquipoDesarrollo = idEquipo;

                db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

            }
        }
    }
}