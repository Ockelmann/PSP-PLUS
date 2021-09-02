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
    public class EditarProyectoController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get(int IdProyecto)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var comentario = (from d in db.Proyectos.Where(b => b.IdProyecto == IdProyecto)
                                  select d).ToList();

                return Ok(comentario);
            }

        }
    }
}
