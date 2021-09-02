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
    public class AgregarDesarrolladorProyectoController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post(int idusuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var proyecto = db.Proyectos.OrderByDescending(x => x.IdProyecto).First();
                Models.UsuarioProyecto usuarioproyecto = new Models.UsuarioProyecto();

                usuarioproyecto.IdUsuario = idusuario;
                usuarioproyecto.IdProyecto = Convert.ToInt32(proyecto.IdProyecto);
                db.UsuarioProyectos.Add(usuarioproyecto);

                db.SaveChanges();

                return Ok("Se agrego un Proyecto correctamente");
            }

        }
    }
}
