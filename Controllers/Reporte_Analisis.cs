using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using SpreadsheetLight;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace PSP_.Models
{//Albin Cordero 09/08/2021
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
    [Authorize]
    public class Reporte_Analisis : ControllerBase
    {
        [HttpGet("{id},{feci},{fecf}")]

        public ActionResult Get(int id, DateTime feci, DateTime fecf)
        {

            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {



                var dt = new List<Datos>();


                using (SqlConnection sql = new SqlConnection("Server=DESKTOP-FGBRIH1;DATABASE=DBPSPPLUS;user=capacitacion;password=12345"))
                {
                    using (SqlCommand cmd = new SqlCommand("Analisis", sql))
                    {

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", id));
                        cmd.Parameters.Add(new SqlParameter("@inn", feci));
                        cmd.Parameters.Add(new SqlParameter("@fn", fecf));

                        sql.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var temp = new Datos();
                                temp.proyecto = reader.GetString(0);
                                if (reader.GetDateTime(5) > reader.GetDateTime(1))
                                {
                                    temp.inicio = reader.GetDateTime(1);
                                }
                                else
                                {
                                    if (reader.GetDateTime(5).Year != 1900)
                                    {
                                        temp.inicio = reader.GetDateTime(5);
                                    }
                                    else
                                    {
                                        temp.inicio = reader.GetDateTime(1);

                                    }
                                }
                                if (reader.GetDateTime(6) > reader.GetDateTime(2))
                                {
                                    temp.fin = reader.GetDateTime(6);
                                }
                                else
                                {
                                    temp.fin = reader.GetDateTime(2);
                                }


                                temp.tiempo = reader.GetDouble(3) + (Convert.ToDouble(reader.GetDecimal(7)) / 60);
                                temp.tareas = reader.GetInt32(4);


                                dt.Add(temp);
                            }
                            return Ok(dt);
                        }
                    }
                }




            }
        }
    }
}
