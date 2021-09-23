using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSP_.Models.Solicitudes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]

    public class EditarRecordatorioController : ControllerBase
    {

        [HttpGet]
        public List<DatosRecordatorio> Get(int idRecordatorio)
        {
            var searchItems = BuscarDatos(idRecordatorio);
            return searchItems;
        }

        public static List<DatosRecordatorio> BuscarDatos(int idRecordatorio)
        {

            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var recordatorioslist = new List<DatosRecordatorio>();


                var recordatorio = (from d in db.Recordatorios
                                    select d).Where(d => d.IdRecordatorios == idRecordatorio).ToList();

                foreach (var item in recordatorio)
                {
                    if (item.IdProyecto != null)
                    {
                        var proyecto = db.Proyectos.Find(item.IdProyecto);
                        recordatorioslist.Add(new DatosRecordatorio { IdRecordatorios = item.IdRecordatorios, Descripcion = item.Descripcion, IdUsuario = item.IdUsuario, TipoRecordatorio = item.TipoRecordatorio, IdProyecto = item.IdProyecto, NombreProyecto = proyecto.Nombre, Estado = item.Estado, FechaHoraRecordatorio = item.FechaHoraRecordatorio, HorasAlerta = item.HorasAlerta });

                    }
                    else
                    {
                        recordatorioslist.Add(new DatosRecordatorio { IdRecordatorios = item.IdRecordatorios, Descripcion = item.Descripcion, IdUsuario = item.IdUsuario, TipoRecordatorio = item.TipoRecordatorio, IdProyecto = item.IdProyecto, NombreProyecto = "null", Estado = item.Estado, FechaHoraRecordatorio = item.FechaHoraRecordatorio, HorasAlerta = item.HorasAlerta });

                    }
                }

                return recordatorioslist;
            }
        }



        [HttpPut]
        public ActionResult Put(int idRecordatorio, string descripcion, int idUsuario, int tipoRecordatorio, int? idProyecto, DateTime fechaHoraRecordatorio, decimal horasAlerta)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = db.Recordatorios.Find(idRecordatorio);

                switch (tipoRecordatorio)
                {
                    case 1:
                        recordatorio.Descripcion = descripcion;
                        recordatorio.IdUsuario = idUsuario;
                        recordatorio.TipoRecordatorio = tipoRecordatorio;
                        recordatorio.FechaHoraRecordatorio = fechaHoraRecordatorio;
                        break;
                    case 2:
                        recordatorio.Descripcion = descripcion;
                        recordatorio.IdUsuario = idUsuario;
                        recordatorio.TipoRecordatorio = tipoRecordatorio;
                        recordatorio.IdProyecto = idProyecto;
                        recordatorio.HorasAlerta = horasAlerta;
                        break;
                    case 3:
                        recordatorio.Descripcion = descripcion;
                        recordatorio.IdUsuario = idUsuario;
                        recordatorio.TipoRecordatorio = tipoRecordatorio;
                        recordatorio.IdProyecto = idProyecto;
                        recordatorio.FechaHoraRecordatorio = fechaHoraRecordatorio;
                        break;
                    case 4:
                        recordatorio.Descripcion = descripcion;
                        recordatorio.IdUsuario = idUsuario;
                        recordatorio.TipoRecordatorio = tipoRecordatorio;
                        recordatorio.IdProyecto = idProyecto;
                        break;

                }

                db.Entry(recordatorio).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

               

            }

            return Ok("Datos Actualizados Correctamente");
        }
    }
}
