using Microsoft.EntityFrameworkCore;
using PuntosFidelizacion.Models;
using System.Collections.Generic;

namespace PuntosFidelizacion.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Transaccion> Transacciones { get; set; }
        public DbSet<Beneficio> Beneficios { get; set; }

    }
}
