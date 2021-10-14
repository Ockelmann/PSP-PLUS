using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

//Desarrollador: Rogelio Raúl Castañeda Flores

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("permitir")]
    [Authorize]
    public class PerfilController : ControllerBase

    {
        static string desKey = "m/ti5TXBWPOigPCSqBy0Kg==";
        protected static SymmetricAlgorithm DES = null;
        [HttpGet]
        public ActionResult Get(int? idUsuario)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var reporteProyectos = db.Usuarios.Join(
                         db.EquipoDesarrollos, u => u.IdEquipoDesarrollo, e => e.IdEquipoDesarrollo,
                         (u, e) => new
                         {
                             idusuario = u.IdUsuario,
                             nombres = u.Nombres,
                             apellidos = u.Apellidos,
                             email = u.Email,
                             clave = DecryptPassword(u.Clave),
                             fechaNacimiento = u.FechaNacimiento,
                             nombreEquipo = e.Nombre,        
                             idEquipoDesarrollo = u.IdEquipoDesarrollo

                         }

                     ).Where(er => er.idusuario == idUsuario).Distinct().First();

                return Ok(reporteProyectos);
            }
        }

        [HttpPut]
        public ActionResult Put([FromBody] Models.Usuario modelo)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                Models.Usuario datos = db.Usuarios.Find(modelo.IdUsuario);

                datos.Nombres = modelo.Nombres;
                datos.Apellidos = modelo.Apellidos;
                datos.Email = modelo.Email;
                datos.Clave = EncryptPassword(modelo.Clave);
                datos.FechaNacimiento = modelo.FechaNacimiento;
                datos.IdEquipoDesarrollo = modelo.IdEquipoDesarrollo;

                db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                db.SaveChanges();

                return Ok("Datos Actualizados Correctamente");

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