namespace PuntosFidelizacion.Models
{
    public class Transaccion
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; } = null!;
        public DateTime Fecha { get; set; } = DateTime.UtcNow;
        public int Puntos { get; set; }
        public string Tipo { get; set; } = string.Empty; // "Otorgar" o "Redimir"
        public string? Observaciones { get; set; }
        public int? BeneficioId { get; set; }
        public Beneficio? Beneficio { get; set; } // Navigation property

    }
}
