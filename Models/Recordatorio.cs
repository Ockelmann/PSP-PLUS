using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class Recordatorio
    {
        public int IdRecordatorios { get; set; }
        public string Descripcion { get; set; }
        public int IdUsuario { get; set; }
        public int TipoRecordatorio { get; set; }
        public int? IdProyecto { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaHoraRecordatorio { get; set; }
        public decimal? HorasAlerta { get; set; }

        public virtual Proyecto IdProyectoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}
