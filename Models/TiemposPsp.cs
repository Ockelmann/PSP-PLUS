using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class TiemposPsp
    {
        public int IdTiempoPsp { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFinal { get; set; }
        public string Descripcion { get; set; }
        public int? IdProyecto { get; set; }
        public int IdUsuario { get; set; }

        public virtual Proyecto IdProyectoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}
