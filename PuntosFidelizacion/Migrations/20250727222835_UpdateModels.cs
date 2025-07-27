using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PuntosFidelizacion.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BeneficioId",
                table: "Transacciones",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Beneficios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CostoEnPuntos = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Beneficios", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transacciones_BeneficioId",
                table: "Transacciones",
                column: "BeneficioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transacciones_Beneficios_BeneficioId",
                table: "Transacciones",
                column: "BeneficioId",
                principalTable: "Beneficios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transacciones_Beneficios_BeneficioId",
                table: "Transacciones");

            migrationBuilder.DropTable(
                name: "Beneficios");

            migrationBuilder.DropIndex(
                name: "IX_Transacciones_BeneficioId",
                table: "Transacciones");

            migrationBuilder.DropColumn(
                name: "BeneficioId",
                table: "Transacciones");
        }
    }
}
