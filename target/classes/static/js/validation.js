function validarNombre(nombre) {
    if (nombre.length < 2) {
        return false;
    }
    // valida que sea alfa-numérico
    const re = /^[a-zA-Z0-9 ]+$/;
    return re.test(nombre);
}

const validarEmail = (email) => {
    // valida que tenga algo antes del @, un @, algo después, un punto, y algo después
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validarURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};

function mostrarErrores(errores, boxId, listId) {
    const box = document.getElementById(boxId);
    const list = document.getElementById(listId);
    
    list.innerHTML = "";
    
    if (errores.length > 0) {
        for (const error of errores) {
            const li = document.createElement("li");
            li.textContent = error;
            list.appendChild(li);
        }
        
        box.style.display = "block"; 
        
        window.scrollTo(0, 0); 
        return false;
    }
    
    box.style.display = "none";
    return true;
}

function validarMiembros() {
    const errores = [];
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const checkboxes = document.querySelectorAll('.check-tipo');
    
    if (!validarNombre(nombre)) {
        errores.push("Debe ingresar un nombre válido.");
    }
    if (!validarEmail(email)) {
        errores.push("Debe ingresar un correo electrónico válido.");
    }

    let alguienSeleccionado = false;

    for (const checkbox of checkboxes) {
        
        if (checkbox.checked) {
            alguienSeleccionado = true;

            if (checkbox.value === "estudiante") {
                const carrera = document.getElementById("carrera").value.trim();
                if (carrera === "") {
                    errores.push("Como estudiante, debe indicar su carrera.");
                }
            }
            if (checkbox.value === "academico") {
                const depto = document.getElementById("departamento").value.trim();
                if (depto === "") {
                    errores.push("Como académico, debe indicar su departamento.");
                }
            }
            if (checkbox.value === "funcionario") {
                const cargo = document.getElementById("cargo").value.trim();
                if (cargo === "") {
                    errores.push("Como funcionario, debe indicar su cargo.");
                }
            }
        }
    }

    if (alguienSeleccionado === false) {
        errores.push("Debe seleccionar al menos un tipo de miembro.");
    }
    if (mostrarErrores(errores, "val-box-miembro", "val-list-miembro")) {
        return true
    }
    return false
}

const validarActividades = () => {
    const errores = [];
    const tipoActividad = document.getElementById("tipo-actividad").value;
    const nombreActividad = document.getElementById("nombre-actividad").value.trim();
    const archivos = document.getElementById("audiovisual").files;
    const enlace = document.getElementById("enlace").value.trim();
    
    if (!tipoActividad) errores.push("Debe seleccionar un tipo de actividad.");
    if (nombreActividad.length < 2) errores.push("El nombre de la actividad es muy corto.");

    const diasMarcados = document.querySelectorAll('input[name="dia"]:checked');
    if (diasMarcados.length === 0) {
        errores.push("Debe seleccionar al menos un día para la actividad.");
    }
    if (archivos.length === 0) {
        errores.push("Debe subir al menos un archivo (foto o video) de la actividad.");
    }
    if (!enlace || !validarURL(enlace)) {
        errores.push("Debe proporcionar un enlace válido a contenido de la actividad.");
    }

    if (mostrarErrores(errores, "val-box-actividad", "val-list-actividad")) {
        return true
    }
    return false
};
