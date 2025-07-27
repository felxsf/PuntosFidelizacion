using Microsoft.AspNetCore.Mvc;
using PuntosFidelizacion.Data;
using PuntosFidelizacion.DTOs;
using PuntosFidelizacion.Models;
using PuntosFidelizacion.Services;
using System.Security.Cryptography;
using System.Text;

namespace PuntosFidelizacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwt;

        public AuthController(AppDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(AuthRequestDto dto)
        {
            if (_context.Usuarios.Any(u => u.Correo == dto.Correo))
                return BadRequest("Correo ya registrado");

            var usuario = new Usuario
            {
                Correo = dto.Correo,
                Nombre = dto.Correo.Split('@')[0],
                PasswordHash = HashPassword(dto.Password),
                Rol = 0,
                SaldoPuntos = 0
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(AuthRequestDto dto)
        {
            var usuario = _context.Usuarios.FirstOrDefault(u => u.Correo == dto.Correo);
            if (usuario == null || usuario.PasswordHash != HashPassword(dto.Password))
                return Unauthorized("Correo o contraseña incorrectos");

            var token = _jwt.GenerarToken(usuario);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Nombre = usuario.Nombre,
                Correo = usuario.Correo,
                Rol = usuario.Rol
            });
        }

        private static string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
