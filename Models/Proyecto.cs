using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class Proyecto
    {
        public Proyecto()
        {
            ErroresPsps = new HashSet<ErroresPsp>();
            Recordatorios = new HashSet<Recordatorio>();
            TiemposPsps = new HashSet<TiemposPsp>();
            UsuarioProyectos = new HashSet<UsuarioProyecto>();
        }

        public int IdProyecto { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Cliente { get; set; }
        public DateTime FechaInicioEsperada { get; set; }
        public DateTime? FechaInicioReal { get; set; }
        public DateTime FechaFinalEsperada { get; set; }
        public DateTime? FechaFinalReal { get; set; }
        public string Dev { get; set; }
        public decimal? TotalHorasTrabajadas { get; set; }

        public virtual ICollection<ErroresPsp> ErroresPsps { get; set; }
        public virtual ICollection<Recordatorio> Recordatorios { get; set; }
        public virtual ICollection<TiemposPsp> TiemposPsps { get; set; }
        public virtual ICollection<UsuarioProyecto> UsuarioProyectos { get; set; }
    }
}
