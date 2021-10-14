
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSP_.Models.Solicitudes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/*
    Desarrollador: Julio César García Ockelmann
    9/08/2021
*/

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RecordatoriosController : ControllerBase
    {
        [HttpPost]
        public ActionResult Post([FromBody] Models.Recordatorio modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = new Models.Recordatorio();

                switch (modelo.TipoRecordatorio)
                {
                    case 1:
                        recordatorio.Descripcion = modelo.Descripcion;
                        recordatorio.IdUsuario = modelo.IdUsuario;
                        recordatorio.TipoRecordatorio = modelo.TipoRecordatorio;
                        recordatorio.FechaHoraRecordatorio = modelo.FechaHoraRecordatorio;
                        break;
                    case 2:
                        recordatorio.Descripcion = modelo.Descripcion;
                        recordatorio.IdUsuario = modelo.IdUsuario;
                        recordatorio.TipoRecordatorio = modelo.TipoRecordatorio;
                        recordatorio.IdProyecto = modelo.IdProyecto;
                        recordatorio.HorasAlerta = modelo.HorasAlerta;
                        break;
                    case 3:
                        recordatorio.Descripcion = modelo.Descripcion;
                        recordatorio.IdUsuario = modelo.IdUsuario;
                        recordatorio.TipoRecordatorio = modelo.TipoRecordatorio;
                        recordatorio.IdProyecto = modelo.IdProyecto;
                        recordatorio.FechaHoraRecordatorio = modelo.FechaHoraRecordatorio;
                        break;
                    case 4:
                        recordatorio.Descripcion = modelo.Descripcion;
                        recordatorio.IdUsuario = modelo.IdUsuario;
                        recordatorio.TipoRecordatorio = modelo.TipoRecordatorio;
                        recordatorio.IdProyecto = modelo.IdProyecto;
                        break;

                }

                db.Recordatorios.Add(recordatorio);
                db.SaveChanges();

            }

            return Ok("El Recordatorio se agrego correctamente");
        }



        [HttpGet]
        public List<DatosRecordatorio> Get(int idUsuario)
        {
            var searchItems = BuscarDatos(idUsuario);
            return searchItems;
        }

        public static List<DatosRecordatorio> BuscarDatos(int idUsuario)
        {

            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var recordatorioslist = new List<DatosRecordatorio>();

 
                var recordatorio = (from d in db.Recordatorios
                                   select d).Where(d => d.IdUsuario == idUsuario).ToList();

                    foreach (var item in recordatorio)
                    {
                        if(item.IdProyecto != null)
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
        public ActionResult Put([FromBody] Models.Recordatorio modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = db.Recordatorios.Find(modelo.IdRecordatorios);

                recordatorio.Estado = modelo.Estado;

                db.Entry(recordatorio).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("El estado se actualizo Correctamente");

            }
        }


        [HttpDelete]
        public ActionResult Delete([FromBody] Models.Recordatorio modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = db.Recordatorios.Find(modelo.IdRecordatorios);


                db.Recordatorios.Remove(recordatorio);
                db.SaveChanges();

                return Ok("El Recordatorio se elimino correctamente");

            }
        }



    }


}

