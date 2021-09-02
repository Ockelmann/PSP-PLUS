using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using PSP_.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

/*
    Desarrollador: Rogelio Raúl Castañeda Flores 
*/

namespace PSP_.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("permitir")]
    [Authorize]
    public class UsuariosController : ControllerBase
    {
        static readonly string desKey = "m/ti5TXBWPOigPCSqBy0Kg==";
        protected static SymmetricAlgorithm DES = null;
       



        [AllowAnonymous]
        [HttpPost]
        [Route("SignIn")]
        public ActionResult Post([FromBody] DTO.SignInDTO credentials)
        {
            using (Models.DBPSPPLUSContext db = new Models.DBPSPPLUSContext())
            {
                var usuario = db.Usuarios.Where(x => x.Email == credentials.Email).FirstOrDefault();

                if (DecryptPassword(usuario.Clave) == credentials.Clave)
                {
                    var token =  Authenticate(usuario);
                    return Ok(token);
                }
                else
                {
                    var tokenEmpty = "";
                    return Ok(tokenEmpty);
                }
            }
        }
        private string Authenticate(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes("abcdefghijklmnopqrstuv");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim("sub", usuario.IdUsuario.ToString()),
                    new Claim("rol", usuario.Rol.ToString()),
                    new Claim("email", usuario.Email.ToString()),
                    new Claim("nombre", usuario.Nombres.ToString()),
                    new Claim("apellidos", usuario.Apellidos.ToString())

                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }


        private static string DecryptPassword(string Password)
        {
            DES = new TripleDESCryptoServiceProvider();
            DES.Key = ParseKey(desKey);
            DES.IV = GetIV();
            byte[] encryptedBytes = Convert.FromBase64String(Password);
            byte[] decryptedBytes = DES.CreateDecryptor().TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
           var x = Encoding.UTF8.GetString(decryptedBytes);
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
