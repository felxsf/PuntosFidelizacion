using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PuntosFidelizacion.Data;
using PuntosFidelizacion.DTOs;
using PuntosFidelizacion.Models;
using System.Security.Claims;

namespace PuntosFidelizacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "0")] // Solo usuarios regulares (rol = 0)
    public class UsuarioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuarioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("redimir")]
        public async Task<IActionResult> RedimirPuntos([FromBody] RedimirDto dto)
        {
            if (dto.PuntosARedimir <= 0)
                return BadRequest("Cantidad de puntos inválida");

            var usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            if (usuario == null)
                return NotFound("Usuario no encontrado");

            if (usuario.SaldoPuntos < dto.PuntosARedimir)
                return BadRequest("Saldo insuficiente");

            usuario.SaldoPuntos -= dto.PuntosARedimir;

            var transaccion = new Transaccion
            {
                UsuarioId = usuario.Id,
                Puntos = -dto.PuntosARedimir,
                Tipo = "Redimir",
                Observaciones = dto.Observaciones ?? "Redención de puntos"
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Mensaje = "Redención exitosa",
                SaldoActual = usuario.SaldoPuntos,
                ValorRedimido = dto.PuntosARedimir * 10 // Ejemplo: 100 pts = $1.000
            });
        }

        [HttpGet("saldo")]
        public async Task<IActionResult> ObtenerSaldo()
        {
            var usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var usuario = await _context.Usuarios.FindAsync(usuarioId);

            if (usuario == null)
                return NotFound("Usuario no encontrado");

            return Ok(new
            {
                usuario.Nombre,
                usuario.Correo,
                usuario.SaldoPuntos,
                ValorMonetario = usuario.SaldoPuntos * 10 // Ejemplo: $1.000 por cada 100 pts
            });
        }

        [HttpGet("historial")]
        public IActionResult Historial()
        {
            var usuarioId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var historial = _context.Transacciones
                .Where(t => t.UsuarioId == usuarioId)
                .OrderByDescending(t => t.Fecha)
                .Select(t => new
                {
                    t.Fecha,
                    t.Puntos,
                    t.Tipo,
                    t.Observaciones
                })
                .ToList();

            return Ok(historial);
        }
    }
}
