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
            if (!context.Usuarios.Any())
            {
                var usuarios = new List<Usuario>
                {
                    new Usuario { Nombre = "Admin", Correo = "admin@admin.com", PasswordHash = "1234", Rol = 1, SaldoPuntos = 0 },
                    new Usuario { Nombre = "Usuario1", Correo = "user1@correo.com", PasswordHash = "1234", Rol = 0, SaldoPuntos = 300 },
                    new Usuario { Nombre = "Usuario2", Correo = "user2@correo.com", PasswordHash = "1234", Rol = 0, SaldoPuntos = 150 }
                };

                context.Usuarios.AddRange(usuarios);
            }
            if (!context.Beneficios.Any())
            {
                var beneficios = new List<Beneficio>
                {
                    new Beneficio
                    {
                        Nombre = "Bono Amazon $10.000",
                        Descripcion = "Tarjeta regalo digital de Amazon",
                        CostoEnPuntos = 1000
                    },
                    new Beneficio
                    {
                        Nombre = "Descuento 15% próxima compra",
                        Descripcion = "Aplicable a compras superiores a $50.000",
                        CostoEnPuntos = 700
                    },
                    new Beneficio
                    {
                        Nombre = "Suscripción Netflix 1 mes",
                        Descripcion = "Código de acceso válido por 30 días",
                        CostoEnPuntos = 1500
                    }
                };

                        context.Beneficios.AddRange(beneficios);
                    }

            context.SaveChanges();
        }
    }
}
