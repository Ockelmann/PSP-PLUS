
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSP_.Models;
using PSP_.Models.Solicitudes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
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
        static string desKey = "m/ti5TXBWPOigPCSqBy0Kg==";
        protected static SymmetricAlgorithm DES = null;
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
                        equipolist.Add(new DatosdeUsuario { IdUsuario = item.IdUsuario, Nombres = item.Nombres, Apellidos = item.Apellidos, Email = item.Email, Clave = DecryptPassword(item.Clave), FechaNacimiento = item.FechaNacimiento, IdEquipoDesarrollo = item.IdEquipoDesarrollo, NombreEquipo = equipo.Nombre, Rol = item.Rol, Estado = item.Estado});
                    }
                }
                else if(idUsuario != 0 && correo == null)
                {
                    var usuario = (from d in db.Usuarios
                                   select d).Where(d => d.IdUsuario == idUsuario).ToList();

                    foreach (var item in usuario)
                    {
                        var equipo = db.EquipoDesarrollos.Find(item.IdEquipoDesarrollo);
                        equipolist.Add(new DatosdeUsuario { IdUsuario = item.IdUsuario, Nombres = item.Nombres, Apellidos = item.Apellidos, Email = item.Email, Clave = DecryptPassword(item.Clave), FechaNacimiento = item.FechaNacimiento, IdEquipoDesarrollo = item.IdEquipoDesarrollo, NombreEquipo = equipo.Nombre, Rol = item.Rol, Estado = item.Estado });
                    }

                }else if(idUsuario == 0 && correo != null)
                {
                    var usuario = (from d in db.Usuarios
                                   select d).Where(d => d.Email.Contains(correo)).ToList();

                    foreach (var item in usuario)
                    {
                        var equipo = db.EquipoDesarrollos.Find(item.IdEquipoDesarrollo);
                        equipolist.Add(new DatosdeUsuario { IdUsuario = item.IdUsuario, Nombres = item.Nombres, Apellidos = item.Apellidos, Email = item.Email, Clave = DecryptPassword(item.Clave), FechaNacimiento = item.FechaNacimiento, IdEquipoDesarrollo = item.IdEquipoDesarrollo, NombreEquipo = equipo.Nombre, Rol = item.Rol, Estado = item.Estado });
                    }
                }
                
                return equipolist;
            }
        }


        public static string EncryptPassword(string Password)
        {
            string testPwd = string.Empty;

            DES = new TripleDESCryptoServiceProvider();
            byte[] plaintext = Encoding.ASCII.GetBytes(Password);
            DES.Key = ParseKey(desKey);
            DES.IV = GetIV();
            //string decPwd = DecryptPassword("Lw5AEvoSG+7VlrMK+XgmGw==");
            byte[] encrypted = DES.CreateEncryptor().TransformFinalBlock(plaintext, 0, plaintext.Length);
            return Convert.ToBase64String(encrypted);
        }

        public static string DecryptPassword(string Password)
        {
            DES = new TripleDESCryptoServiceProvider();
            DES.Key = ParseKey(desKey);
            DES.IV = GetIV();
            byte[] encryptedBytes = Convert.FromBase64String(Password);
            byte[] decryptedBytes = DES.CreateDecryptor().TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
            return Encoding.UTF8.GetString(decryptedBytes);
        }

        private static byte[] ParseKey(string data)
        {
            byte[] key = Convert.FromBase64String(data);
            return key;
        }

        private static byte[] GetIV()
        {

            byte[] iv = new byte[DES.BlockSize / 8];
            return iv;
        }
    }
}

