
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
    public class equiposTrabajoBusquedaController : ControllerBase
    {

        [HttpGet]
        public ActionResult Get(string nombre)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var equipos = (from d in db.EquipoDesarrollos.Where(p => p.Nombre.Contains(nombre))
                              select d).ToList();

                return Ok(equipos);
            }

        }

    }
}
