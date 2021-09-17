using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecuperarContraseñaController : ControllerBase
    {
        static string desKey = "m/ti5TXBWPOigPCSqBy0Kg==";
        protected static SymmetricAlgorithm DES = null;

        private string from = "";
        private string contraseña = "";

        [HttpPut]
        public ActionResult Put(string correo)
        {

            Random rdn = new Random();
            string caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%$#@";
            int longitud = caracteres.Length;
            char letra;
            int longitudContrasenia = 10;
            string contraseniaAleatoria = string.Empty;

            for (int i = 0; i < longitudContrasenia; i++)
            {
                letra = caracteres[rdn.Next(longitud)];
                contraseniaAleatoria += letra.ToString();
            }

            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var parametros = (from d in db.Parametros select d).ToList();

                var usuario = (from d in db.Usuarios
                               select d).Where(d => d.Email == correo).ToList();

                foreach (var item in parametros)
                {
                    from = item.Correo;
                    contraseña = item.Clave;
                }


                MailMessage message = new MailMessage(from, correo);
                string mailbody = $"<div> <div> <h2>Contraseña Nueva:</h2> <p>{contraseniaAleatoria}</p></div></div>";
                message.Subject = "Recuperar contraseña PSP+";
                message.Body = mailbody;
                message.BodyEncoding = Encoding.UTF8;
                message.IsBodyHtml = true;
                SmtpClient client = new SmtpClient("smtp.gmail.com", 587); //Gmail smtp    
                System.Net.NetworkCredential basicCredential1 = new
                System.Net.NetworkCredential(from, contraseña);
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;
                client.Credentials = basicCredential1;
                try
                {
                    client.Send(message);
                    Console.WriteLine("send mail");
                }

                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    Console.WriteLine("not send mail");
                }



                foreach (var item in usuario)
                {
                    Models.Usuario datos = db.Usuarios.Find(item.IdUsuario);


                    datos.Clave = EncryptPassword(contraseniaAleatoria);
                    datos.RecuperaContraseña = true;
                    db.Entry(datos).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    db.SaveChanges();

                    

                }



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
