using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class ErroresPsp
    {
        public int IdErrorPsp { get; set; }
        public DateTime Fecha { get; set; }
        public string Descripcion { get; set; }
        public string Solucion { get; set; }
        public int Correlativo { get; set; }
        public string TipoError { get; set; }
        public string Introducido { get; set; }
        public string Eliminado { get; set; }
        public DateTime FechaHoraInicio { get; set; }
        public DateTime FechaHoraFinal { get; set; }
        public decimal TiempoCorrecion { get; set; }
        public string LenguajeDesarrollo { get; set; }
        public int? IdProyecto { get; set; }
        public int IdUsuario { get; set; }

        public virtual Proyecto IdProyectoNavigation { get; set; }
        public virtual Usuario IdUsuarioNavigation { get; set; }
    }
}
