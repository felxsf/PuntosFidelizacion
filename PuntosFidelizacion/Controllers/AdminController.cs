using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PuntosFidelizacion.Data;
using PuntosFidelizacion.DTOs;
using PuntosFidelizacion.Models;

namespace PuntosFidelizacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "1")] // Solo administradores
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("otorgar")]
        public async Task<IActionResult> OtorgarPuntos(OtorgarPuntosDto dto)
        {
            if (dto.Puntos <= 0)
                return BadRequest("La cantidad de puntos debe ser mayor a cero.");

            var usuario = await _context.Usuarios.FindAsync(dto.UsuarioId);
            if (usuario == null)
                return NotFound("Usuario no encontrado.");

            usuario.SaldoPuntos += dto.Puntos;

            var transaccion = new Transaccion
            {
                UsuarioId = usuario.Id,
                Puntos = dto.Puntos,
                Tipo = "Otorgar",
                Observaciones = dto.Observaciones ?? "Otorgamiento manual por administrador"
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Mensaje = "Puntos otorgados exitosamente.",
                SaldoActual = usuario.SaldoPuntos
            });
        }

        [HttpGet("usuarios")]
        public async Task<IActionResult> VerUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Select(u => new
                {
                    u.Id,
                    u.Nombre,
                    u.Correo,
                    u.Rol,
                    u.SaldoPuntos
                }).ToListAsync();

            return Ok(usuarios);
        }

        [HttpGet("historial")]
        public async Task<IActionResult> VerHistorialGeneral()
        {
            var historial = await _context.Transacciones
                .Include(t => t.Usuario)
                .OrderByDescending(t => t.Fecha)
                .Select(t => new
                {
                    t.Fecha,
                    t.Tipo,
                    t.Puntos,
                    t.Observaciones,
                    Usuario = t.Usuario.Nombre,
                    Correo = t.Usuario.Correo
                }).ToListAsync();

            return Ok(historial);
        }
    }
}
