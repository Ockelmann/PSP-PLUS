using Microsoft.AspNetCore.Authorization;
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
    public class ComboDesarrolladores : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var desarrolladores = (from d in db.Usuarios where d.Rol == "desarrollador" select d).ToList();

                return Ok(desarrolladores);
            }
        }
    }
}
