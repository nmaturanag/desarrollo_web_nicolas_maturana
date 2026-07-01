document.addEventListener('DOMContentLoaded', () => {
    const parametrosUrl = new URLSearchParams(window.location.search);
    const miembroId = parametrosUrl.get("id");

    cargarMiembro(miembroId);
    cargarActividades(miembroId);
});


function cargarMiembro(id) {
    fetch(`/miembros/${id}`)
        .then(respuesta => respuesta.json())
        .then(miembro => {
            document.getElementById('nombre-miembro').textContent = miembro.nombre;
            document.getElementById('email-miembro').textContent = miembro.email;
            document.getElementById('telefono-miembro').textContent = miembro.telefono;
            document.getElementById('fecha-miembro').textContent = miembro.fecha_registro;
        })
}


function cargarActividades(miembroId) {
    const contenedor = document.getElementById('lista-actividades');
    const plantilla = document.getElementById('plantilla-actividad').content;

    fetch('/actividades/all')
        .then(respuesta => respuesta.json())
        .then(actividades => {
            const actividadesMiembro = actividades.filter(a => a.miembro_id == miembroId);

            if (actividadesMiembro.length === 0) {
                contenedor.innerHTML = '<p>Sin actividades registradas</p>';
                return;
            }

            actividadesMiembro.forEach(actividad => {
                const clon = plantilla.cloneNode(true);
                
                clon.querySelector('.act-nombre').textContent = actividad.nombre;
                clon.querySelector('.act-tipo').textContent = actividad.tipo;
                
                const divComentarios = clon.querySelector('.comentarios-container');
                divComentarios.dataset.actividadId = actividad.id; 

                const formularioComentario = clon.querySelector('.form-comentario');
                formularioComentario.dataset.actividadId = actividad.id;
                
                contenedor.appendChild(clon);
            });

            inicializarComentarios();
        })
}