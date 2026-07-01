document.addEventListener('DOMContentLoaded', () => {
    cargarUltimosMiembros();
});


function cargarUltimosMiembros() {
    const tbody = document.getElementById('tabla-ultimos-miembros');
    const plantilla = document.getElementById('plantilla-fila-miembro').content;

    fetch('/miembros/all')
        .then(respuesta => respuesta.json())
        .then(miembros => {
            tbody.innerHTML = '';

            miembros.sort((a, b) => b.id - a.id);
            const ultimos5 = miembros.slice(0, 5);

            if (ultimos5.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Sin miembros registrados</td></tr>';
                return;
            }

            ultimos5.forEach(miembro => {
                const clon = plantilla.cloneNode(true);
                
                clon.querySelector('.miembro-nombre').textContent = miembro.nombre;
                clon.querySelector('.miembro-email').textContent = miembro.email;
                clon.querySelector('.miembro-telefono').textContent = miembro.telefono;
                
                tbody.appendChild(clon);
            });
        })
}
