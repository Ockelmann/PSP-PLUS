using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class EquipoDesarrollo
    {
        public EquipoDesarrollo()
        {
            Usuarios = new HashSet<Usuario>();
        }

        public int IdEquipoDesarrollo { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }

        public virtual ICollection<Usuario> Usuarios { get; set; }
    }
}
