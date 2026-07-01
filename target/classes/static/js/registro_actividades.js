document.addEventListener('DOMContentLoaded', () => {
    cargarMiembros();
    registrarActividad();
});


function cargarMiembros() {
    const selectMiembros = document.getElementById('miembro_id');

    fetch('/miembros/all')
        .then(respuesta => respuesta.json())
        .then(miembros => {
            selectMiembros.innerHTML = '<option value="">Seleccione un miembro</option>';
            
            miembros.forEach(miembro => {
                const opcion = document.createElement('option');
                opcion.value = miembro.id;
                opcion.textContent = `${miembro.nombre} (${miembro.email})`;
                selectMiembros.appendChild(opcion);
            });
        })
}


function registrarActividad() {
    const formulario = document.getElementById('formulario-actividades');

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        if (!validarActividades()) {
            return;
        }

        const datosActividad = new FormData(formulario);

        fetch('/actividades/add', {
            method: 'POST',
            body: datosActividad
        })
        .then(respuesta => respuesta.text())
        .then(mensajeServidor => {
            alert(mensajeServidor);
            window.location.href = 'index.html';
        })
    });
}