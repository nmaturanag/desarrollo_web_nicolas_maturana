document.addEventListener("DOMContentLoaded", () => {
    const contenedores = document.querySelectorAll(".comentarios-container");

    contenedores.forEach((container) => {
        const actividadId = container.dataset.actividadId;
        cargarComentarios(actividadId, container);
    });

    const formularios = document.querySelectorAll(".form-comentario");

    formularios.forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const actividadId = form.dataset.actividadId;
            enviarComentario(form, actividadId);
        });
    });
});


async function cargarComentarios(actividadId, container) {
    try {
        const response = await fetch("/api/comentarios/" + actividadId);
        const comentarios = await response.json();

        container.textContent = "";

        if (comentarios.length === 0) {
            const p = document.createElement("p");
            p.textContent = "Sin comentarios.";
            container.appendChild(p);
            return;
        }

        comentarios.forEach((comentario) => {
            const p = document.createElement("p");

            const nombre = document.createElement("strong");
            nombre.textContent = comentario.nombre;

            const resto = document.createTextNode(
                ` (${comentario.fecha}): ${comentario.texto}`
            );

            p.appendChild(nombre);
            p.appendChild(resto);

            container.appendChild(p);
        });

    } catch (error) {
        console.error("Error al cargar comentarios:", error);
    }
}


async function enviarComentario(form, actividadId) {
    const nombre = form.nombre.value.trim();
    const texto = form.texto.value.trim();

    if (nombre.length < 3 || nombre.length > 80) {
        alert("El nombre debe tener entre 3 y 80 caracteres.");
        return;
    }

    if (texto.length < 5) {
        alert("El comentario debe tener al menos 5 caracteres.");
        return;
    }

    const formData = {
        actividad_id: parseInt(actividadId),
        nombre: nombre,
        texto: texto
    };

    try {
        const response = await fetch("/api/comentarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            form.reset();

            const container = document.querySelector('.comentarios-container[data-actividad-id="' + actividadId + '"]');

            cargarComentarios(actividadId, container);
        } else {
            alert("Error al enviar el comentario.");
        }

    } catch (error) {
        console.error("Error al enviar comentario:", error);
    }
}