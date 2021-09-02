using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Controllers

{
    partial class Datos2
    {
        public string descripcion { get; set; }
        public DateTime fechaHoraInicio { get; set; }
        public DateTime fechaHoraFin { get; set; }
        public double horas { get; set; }
        public string nombreUsuario { get; set; }
        public string nombreProyecto { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [EnableCors("permitir")]
    public class ActividadesporProyectoAdminController : Controller
    {
        [HttpGet]

        public ActionResult Get(int? proyecto, int? id)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
               if (id != null)
                {
                    var proyectos = (from p in db.Proyectos select p).Distinct().ToList();
                    return Ok(proyectos);
                }


                var dt = new List<Datos2>();


                using (SqlConnection sql = new SqlConnection("Server=DESKTOP-IFKEU1D\\SQLEXPRESS;DATABASE=DBPSPPLUS;user=sa;password=albin123"))
                {
                    using (SqlCommand cmd = new SqlCommand("reporteActividades_por_proyecto", sql))
                    {

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@idProyecto", proyecto));

                        sql.Open();
                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var temp = new Datos2();
                                temp.descripcion = reader.GetString(0);
                                temp.fechaHoraInicio = reader.GetDateTime(1);
                                temp.fechaHoraFin = reader.GetDateTime(2);
                                temp.horas = reader.GetDouble(3);
                                temp.nombreUsuario = reader.GetString(4);
                                temp.nombreProyecto = reader.GetString(5);
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
