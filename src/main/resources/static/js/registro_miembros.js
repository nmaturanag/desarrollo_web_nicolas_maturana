document.addEventListener('DOMContentLoaded', () => {
    cargarComunas();
    configurarFormulario();
});

function cargarComunas() {
    const selectComuna = document.getElementById('comuna_id');

    fetch('/comunas/all')
        .then(respuesta => respuesta.json())
        .then(comunas => {
            selectComuna.innerHTML = '<option value="">Seleccione su comuna</option>';

            comunas.forEach(comuna => {
                const opcion = document.createElement('option');
                opcion.value = comuna.id;
                opcion.textContent = comuna.nombre;
                selectComuna.appendChild(opcion);
            });
        })
}

function configurarFormulario() {
    const formulario = document.getElementById('formulario-miembros');

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const datosFormulario = new FormData(formulario);

        fetch('/miembros/add', {
            method: 'POST',
            body: datosFormulario
        })
        .then(respuesta => respuesta.text())
        .then(mensajeServidor => {
            alert(mensajeServidor);
            window.location.href = 'index.html';
        })
    });
}