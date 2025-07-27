using System.Transactions;

namespace PuntosFidelizacion.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Correo { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int Rol { get; set; } // 0 = Usuario, 1 = Admin
        public int SaldoPuntos { get; set; } = 0;

        public ICollection<Transaccion>? Transacciones { get; set; }
    }
}
