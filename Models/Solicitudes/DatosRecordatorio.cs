using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Models.Solicitudes
{
    public class DatosRecordatorio
    {
        public int IdRecordatorios { get; set; }
        public string Descripcion { get; set; }
        public int IdUsuario { get; set; }
        public int TipoRecordatorio { get; set; }
        public int? IdProyecto { get; set; }
        public string NombreProyecto { get; set; }
        public string Estado { get; set; }
        public DateTime? FechaHoraRecordatorio { get; set; }
        public decimal? HorasAlerta { get; set; }
    }
}
