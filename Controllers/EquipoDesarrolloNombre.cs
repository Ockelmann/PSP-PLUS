
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSP_.Models;
using PSP_.Models.Solicitudes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


/*
    Desarrollador: Julio César García Ockelmann
*/

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EquipoDesarrolloNombre : ControllerBase
    {
        [HttpGet]
        public List<DatosdeUsuario> Get(int idUsuario, string correo)
        {
            var searchItems = BuscarDatos(idUsuario, correo);
            return searchItems;
        }

        public static List<DatosdeUsuario> BuscarDatos(int idUsuario, string correo)
        {

            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var equipolist = new List<DatosdeUsuario>();

                if (idUsuario == 0 && correo == null)
                {
                    var usuario = (from d in db.Usuarios
                                   select d).ToList();

                    foreach (var item in usuario)
                    {
                        var equipo = db.EquipoDesarrollos.Find(item.IdEquipoDesarrollo);
                        equipolist.Add(new DatosdeUsuario { IdUsuario = item.IdUsuario, Nombres = item.Nombres, Apellidos = item.Apellidos, Email = item.Email, Clave = item.Clave, FechaNacimiento = item.FechaNacimiento, IdEquipoDesarrollo = item.IdEquipoDesarrollo, NombreEquipo = equipo.Nombre, Rol = item.Rol });
                    }
                }
                else if(idUsuario != 0 && correo == null)
                {
                    var usuario = (from d in db.Usuarios
                                   select d).Where(d => d.IdUsuario == idUsuario).ToList();

                    foreach (var item in usuario)
                    {
                        var equipo = db.EquipoDesarrollos.Find(item.IdEquipoDesarrollo);
                        equipolist.Add(new DatosdeUsuario { IdUsuario = item.IdUsuario, Nombres = item.Nombres, Apellidos = item.Apellidos, Email = item.Email, Clave = item.Clave, FechaNacimiento = item.FechaNacimiento, IdEquipoDesarrollo = item.IdEquipoDesarrollo, NombreEquipo = equipo.Nombre, Rol = item.Rol });
                    }

                }else if(idUsuario == 0 && correo != null)
                {
                    var usuario = (from d in db.Usuarios
                                   select d).Where(d => d.Email.Contains(correo)).ToList();

                    foreach (var item in usuario)
                    {
                        var equipo = db.EquipoDesarrollos.Find(item.IdEquipoDesarrollo);
                        equipolist.Add(new DatosdeUsuario { IdUsuario = item.IdUsuario, Nombres = item.Nombres, Apellidos = item.Apellidos, Email = item.Email, Clave = item.Clave, FechaNacimiento = item.FechaNacimiento, IdEquipoDesarrollo = item.IdEquipoDesarrollo, NombreEquipo = equipo.Nombre, Rol = item.Rol });
                    }
                }
                
                return equipolist;
            }
        }
    }
}

