using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PSP_.Models
{
    public class ReporteErroresProyecto
    {
        public string Usuario { get; set; }
        public string Proyecto { get; set; }
        public int CantidadErrores { get; set; }
        public decimal TiempoTotal { get; set; }
    }
}
