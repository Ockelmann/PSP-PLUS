
﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class AgregarUsuariosController : ControllerBase
    {
        static string desKey = "m/ti5TXBWPOigPCSqBy0Kg==";
        protected static SymmetricAlgorithm DES = null;

        [HttpGet]
        public ActionResult Get()
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var usuarios = (from d in db.Usuarios select d).ToList();

                return Ok(usuarios);
            }
        }

        [HttpPost]
        public ActionResult Post([FromBody] Models.Usuario modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Usuario usuario = new Models.Usuario();

                usuario.Nombres = modelo.Nombres;
                usuario.Apellidos = modelo.Apellidos;
                usuario.Email = modelo.Email;
                usuario.Clave = EncryptPassword(modelo.Clave);
                usuario.FechaNacimiento = modelo.FechaNacimiento;
                usuario.IdEquipoDesarrollo = modelo.IdEquipoDesarrollo;
                usuario.Rol = modelo.Rol;
                
                db.Usuarios.Add(usuario);
                db.SaveChanges();

            }

            return Ok("El usuario se añadio correctamente");
        }

        [HttpPut]
        public ActionResult Put([FromBody] Models.Usuario modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Usuario usuario = db.Usuarios.Find(modelo.IdUsuario);

                usuario.Nombres = modelo.Nombres;
                usuario.Apellidos = modelo.Apellidos;
                usuario.Email = modelo.Email;
                usuario.Clave = EncryptPassword(modelo.Clave);
                usuario.FechaNacimiento = modelo.FechaNacimiento;
                usuario.IdEquipoDesarrollo = modelo.IdEquipoDesarrollo;


                db.Entry(usuario).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

            }
        }


        [HttpDelete]
        public ActionResult Delete([FromBody] Models.Usuario modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Usuario usuario = db.Usuarios.Find(modelo.IdUsuario);


                db.Usuarios.Remove(usuario);
                db.SaveChanges();

                return Ok("El Usuario se elimino correctamente");

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

