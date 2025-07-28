using System.ComponentModel.DataAnnotations;

namespace PuntosFidelizacion.Models
{
    public class Beneficio
    {
        public int Id { get; set; }

        [Required]
        public string Nombre { get; set; }
        public string Descripcion { get; set; }

        [Range(1, int.MaxValue)]
        public int CostoEnPuntos { get; set; }
    }
}
