using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Models.Solicitudes
{
    public class reporteActividadesDesarrollador
    {
        public int IdProyecto { get; set; }
        public int IdUsuario { get; set; }
        public int IdActividad { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidoUsuario { get; set; }
        public string NombreProyecto { get; set; }
        public  string Descripcion { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFinal { get; set; }

        public TimeSpan horas { get; set; }

    }
}
