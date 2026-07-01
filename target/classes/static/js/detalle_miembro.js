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
            const actividadesMiembro = actividades.filter(a => a.miembroId == miembroId);

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
                
                // cosas de la nota
                const formNota = clon.querySelector('.form-nota');

                formNota.addEventListener('submit', (evento) => {
                    evento.preventDefault();

                    const datosNota = new URLSearchParams();
                    datosNota.append('actividad_id', actividad.id);
                    datosNota.append('nota', formNota.querySelector('.input-nota').value);

                    fetch('/notas/add', {
                        method: 'POST',
                        body: datosNota
                    })
                    .then(respuesta => respuesta.text())
                    .then(mensajeServidor => {
                        alert(mensajeServidor);
                        formNota.reset();
                        const promedio = formNota.closest('.actividad-item').querySelector('.act-promedio');
                        actualizarPromedio(actividad.id, promedio);
                    })
                });

                contenedor.appendChild(clon);

                const items = contenedor.querySelectorAll('.actividad-item');
                const ultimoItem = items[items.length - 1];
                const promedio = ultimoItem.querySelector('.act-promedio');
                
                actualizarPromedio(actividad.id, promedio);

                cargarComentarios(actividad.id, divComentarios);
                formularioComentario.addEventListener("submit", (event) => {
                    event.preventDefault();
                    enviarComentario(formularioComentario, actividad.id);
                });
            });
        })
}


function actualizarPromedio(actividadId, promedio) {
    fetch('/notas/all')
        .then(respuesta => respuesta.json())
        .then(notas => {
            const notasActividad = [];
            for (let i = 0; i < notas.length; i++) {
                if (notas[i].actividadId == actividadId) {
                    notasActividad.push(notas[i]);
                }
            }
            if (notasActividad.length === 0) {
                promedio.textContent = '-';
                return;
            }

            let suma = 0;
            for (let i = 0; i < notasActividad.length; i++) {
                suma = suma + notasActividad[i].nota;
            }

            let promedio_notas = suma / notasActividad.length;
            promedio.textContent = promedio_notas.toFixed(1);
        })
}
