
﻿
using Microsoft.AspNetCore.Authorization;
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

    //lourdes
    public class usuariosProyectosController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post([FromBody] Models.UsuarioProyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.UsuarioProyecto usuarioP = new Models.UsuarioProyecto();

                usuarioP.IdProyecto = modelo.IdProyecto;
                usuarioP.IdUsuario = modelo.IdUsuario;

               try
                {
                    db.UsuarioProyectos.Add(usuarioP);
                    db.SaveChanges();
                    return Ok("El usuario se añadio correctamente a un proyecto");
                }
                catch(Exception e)
                {
                    var datos = new { esta="601" };
                    return Ok(datos);
                }

            }

           
        }


        [HttpGet("{id}")]
        public ActionResult GetUsuarios(int id)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var query = db.UsuarioProyectos.Select(usuario => new
                {
                    idProyecto = usuario.IdProyecto,
                    idUsuario = usuario.IdUsuario,
                    Nombre = usuario.IdUsuarioNavigation.Nombres,
                    Apellido = usuario.IdUsuarioNavigation.Apellidos,
                    Correo = usuario.IdUsuarioNavigation.Email

                }).Where(usuario => usuario.idProyecto == id).ToList();

                return Ok(query);

            }
        }

        [HttpDelete]
        public ActionResult Delete([FromBody] Models.UsuarioProyecto modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.UsuarioProyecto usuario = db.UsuarioProyectos.Find(modelo.IdUsuario, modelo.IdProyecto);


                db.UsuarioProyectos.Remove(usuario);
                db.SaveChanges();

            }
            return Ok("El desarrollador ha sido eliminado del proyecto con éxito");
        }

        [HttpGet("proyecto/{id}")]
        public ActionResult GetProyecto(int id)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var query = db.Proyectos.Select(proyecto => new
                {
                    idProyecto = proyecto.IdProyecto,
                    nombre = proyecto.Nombre, 
                    descripcion = proyecto.Descripcion
                    

                }).Where(proyecto => proyecto.idProyecto == id).ToList();

                return Ok(query);

            }
        }

     }
}

