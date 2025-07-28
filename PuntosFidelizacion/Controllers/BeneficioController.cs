using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PuntosFidelizacion.Data;
using PuntosFidelizacion.Models;


namespace PuntosFidelizacion.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BeneficioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BeneficioController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize]
        public IActionResult ObtenerBeneficios()
        {
            var beneficios = _context.Beneficios
                .Select(b => new
                {
                    b.Id,
                    b.Nombre,
                    b.Descripcion,
                    b.CostoEnPuntos
                }).ToList();

            return Ok(beneficios);
        }



        [HttpGet("destacados")]
        [Authorize]
        public async Task<IActionResult> GetDestacados()
        {
            var beneficios = await _context.Beneficios
                .OrderBy(b => b.CostoEnPuntos)
                .Take(2)
                .ToListAsync();

            return Ok(beneficios);
        }


        [HttpPost("crear")]
        [Authorize(Roles = "1")] // Solo admin
        public async Task<IActionResult> CrearBeneficio([FromBody] Beneficio dto)
        {
            _context.Beneficios.Add(dto);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Beneficio creado correctamente" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> EditarBeneficio(int id, [FromBody] Beneficio dto)
        {
            var beneficio = await _context.Beneficios.FindAsync(id);
            if (beneficio == null)
                return NotFound("Beneficio no encontrado");

            beneficio.Nombre = dto.Nombre;
            beneficio.Descripcion = dto.Descripcion;
            beneficio.CostoEnPuntos = dto.CostoEnPuntos;

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Beneficio actualizado" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public async Task<IActionResult> EliminarBeneficio(int id)
        {
            var beneficio = await _context.Beneficios.FindAsync(id);
            if (beneficio == null)
                return NotFound("Beneficio no encontrado");

            _context.Beneficios.Remove(beneficio);
            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Beneficio eliminado" });
        }


    }
}
