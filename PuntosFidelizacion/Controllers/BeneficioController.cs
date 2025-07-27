using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PuntosFidelizacion.Data;


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
    }
}
