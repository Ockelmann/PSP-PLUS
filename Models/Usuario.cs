using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class Usuario
    {
        public Usuario()
        {
            ErroresPsps = new HashSet<ErroresPsp>();
            Recordatorios = new HashSet<Recordatorio>();
            TiemposPsps = new HashSet<TiemposPsp>();
            UsuarioProyectos = new HashSet<UsuarioProyecto>();
        }

        public int IdUsuario { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Email { get; set; }
        public string Clave { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string Rol { get; set; }
        public int IdEquipoDesarrollo { get; set; }

        public virtual EquipoDesarrollo IdEquipoDesarrolloNavigation { get; set; }
        public virtual ICollection<ErroresPsp> ErroresPsps { get; set; }
        public virtual ICollection<Recordatorio> Recordatorios { get; set; }
        public virtual ICollection<TiemposPsp> TiemposPsps { get; set; }
        public virtual ICollection<UsuarioProyecto> UsuarioProyectos { get; set; }
    }
}
