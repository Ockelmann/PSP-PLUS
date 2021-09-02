
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
        public ActionResult Post(string descripcion, int idUsuario, int tipoRecordatorio, int? idProyecto, DateTime fechaHoraRecordatorio, decimal horasAlerta)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = new Models.Recordatorio();

                switch (tipoRecordatorio)
                {
                    case 1:
                        recordatorio.Descripcion = descripcion;
                        recordatorio.IdUsuario = idUsuario;
                        recordatorio.TipoRecordatorio = tipoRecordatorio;
                        recordatorio.FechaHoraRecordatorio = Convert.ToDateTime( $"{fechaHoraRecordatorio.Date.Year}/{fechaHoraRecordatorio.Date.Month}/{fechaHoraRecordatorio.Date.Day} {fechaHoraRecordatorio.Hour}:{fechaHoraRecordatorio.Minute}");
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
        public ActionResult Put(int idRecordatorio, string estado)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = db.Recordatorios.Find(idRecordatorio);

                recordatorio.Estado = estado;

                db.Entry(recordatorio).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("El estado se actualizo Correctamente");

            }
        }


        [HttpDelete]
        public ActionResult Delete(int? idRecordatorio)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Recordatorio recordatorio = db.Recordatorios.Find(idRecordatorio);


                db.Recordatorios.Remove(recordatorio);
                db.SaveChanges();

                return Ok("El Recordatorio se elimino correctamente");

            }
        }



    }


}

