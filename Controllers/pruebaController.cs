
﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Controllers
{
    partial class Datos
    {
        public string proyecto { get; set; }
        public DateTime inicio { get; set; }
        public DateTime fin { get; set; }
        public double tiempo { get; set; }
        public int tareas { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class pruebaController : ControllerBase
    {
        
            //[HttpGet("{id},{feci},{fecf}")]

            //public ActionResult Get(int id, DateTime feci, DateTime fecf)
            //{

            //    using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            //    {



            //        var dt = new List<Datos>();


            //        using (SqlConnection sql = new SqlConnection("Server=DESKTOP-IFKEU1D\\SQLEXPRESS;DATABASE=DBPSPPLUS;user=sa;password=albin123"))
            //        {
            //            using (SqlCommand cmd = new SqlCommand("Analisis", sql))
            //            {

            //                cmd.CommandType = System.Data.CommandType.StoredProcedure;
            //                cmd.Parameters.Add(new SqlParameter("@id", id));
            //                cmd.Parameters.Add(new SqlParameter("@inn", feci));
            //                cmd.Parameters.Add(new SqlParameter("@fn", fecf));

            //                sql.Open();
            //                using (var reader = cmd.ExecuteReader())
            //                {
            //                    while (reader.Read())
            //                    {
            //                        var temp = new Datos();
            //                        temp.proyecto = reader.GetString(0);
            //                        temp.inicio = reader.GetDateTime(1);
            //                        temp.fin = reader.GetDateTime(2);
            //                        temp.tiempo = reader.GetDouble(3);
            //                        temp.tareas = reader.GetInt32(4);
            //                        dt.Add(temp);
            //                    }
            //                    return Ok(dt);
            //                }
            //            }
            //        }




            //    }
            //}
        }
    }

