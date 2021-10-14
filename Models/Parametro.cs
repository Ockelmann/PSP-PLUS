using System;
using System.Collections.Generic;

#nullable disable

namespace PSP_.Models
{
    public partial class Parametro
    {
        public int IdParametro { get; set; }
        public int? Inactividad { get; set; }
        public string Correo { get; set; }
        public string Clave { get; set; }
    }
}
