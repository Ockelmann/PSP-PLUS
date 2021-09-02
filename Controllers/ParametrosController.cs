using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class ParametrosController : ControllerBase
    {
        [HttpGet]
        public ActionResult Get()
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var param = db.Parametros.Find(1);

                return Ok(param);
            }

        }

        [HttpPut]
        public ActionResult Put(int inactividad, string correo, string clave)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Parametro datos = db.Parametros.Find(1);

                datos.Inactividad= inactividad;
                datos.Correo = correo;
                datos.Clave = clave;

                db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

            }
        }
    }
}
