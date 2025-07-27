using Microsoft.EntityFrameworkCore;
using PuntosFidelizacion.Models;
using PuntosFidelizacion.Data;

namespace PuntosFidelizacion.Data
{
    public class DbInitializer
    {
        public static void Seed(AppDbContext context)
        {
            // Aplica migraciones automáticamente
            context.Database.Migrate();

            // Si ya hay usuarios, no hacer nada
            if (context.Usuarios.Any()) return;

            var usuarios = new List<Usuario>
{
                new Usuario { Nombre = "Admin", Correo = "admin@admin.com", PasswordHash = "1234", Rol = 1, SaldoPuntos = 0 },
                new Usuario { Nombre = "Usuario1", Correo = "user1@correo.com", PasswordHash = "1234", Rol = 0, SaldoPuntos = 300 },
                new Usuario { Nombre = "Usuario2", Correo = "user2@correo.com", PasswordHash = "1234", Rol = 0, SaldoPuntos = 150 }
            };

            context.Usuarios.AddRange(usuarios);
            context.SaveChanges();
        }
    }
}
