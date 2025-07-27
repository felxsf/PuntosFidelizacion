namespace PuntosFidelizacion.DTOs
{
    public class OtorgarPuntosDto
    {
        public int UsuarioId { get; set; }
        public int Puntos { get; set; }
        public string? Observaciones { get; set; }
    }
}
