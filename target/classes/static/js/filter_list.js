function aplicarFiltros() {
    const filtroTipo = document.getElementById("filtro-tipo").value;
    const filas = document.querySelectorAll("#tabla-miembros tr");

    for (const fila of filas) {
        const tipoMiembroEnFila = fila.cells[1].textContent.toLowerCase();
        if (filtroTipo === "todos" || tipoMiembroEnFila.includes(filtroTipo)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const boton = document.getElementById("boton-aplicar-filtros");
    if (boton) {
        boton.onclick = aplicarFiltros;
    }
});
