using System.Security.Claims;

namespace PuntosFidelizacion.Services
{

    public static class JwtHelper
    {
        public static int ObtenerIdDesdeToken(ClaimsPrincipal user)
        {
            var idClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            return idClaim != null ? int.Parse(idClaim.Value) : 0;
        }
    }
}
