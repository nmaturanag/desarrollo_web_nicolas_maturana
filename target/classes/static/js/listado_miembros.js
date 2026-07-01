let miembrosTotales = [];
let paginaActual = 1;
const miembrosPorPagina = 5;

document.addEventListener('DOMContentLoaded', () => {
    cargarTodosLosMiembros();
    configurarBotonesPaginacion();
});


function cargarTodosLosMiembros() {
    fetch('/miembros/all')
        .then(respuesta => respuesta.json())
        .then(miembros => {
            miembrosTotales = miembros;
            renderizarTabla(miembrosTotales);
        })
}


function renderizarTabla(listaMiembros) {
    const tbody = document.getElementById('tabla-miembros');
    const plantilla = document.getElementById('plantilla-fila-miembro').content;
    const infoPagina = document.getElementById('info-pagina');
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');

    tbody.innerHTML = '';

    if (listaMiembros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Sin miembros registrados</td></tr>';
        infoPagina.textContent = 'Página 1 de 1';
        btnAnterior.disabled = true;
        btnSiguiente.disabled = true;
        return;
    }

    let totalPaginas = parseInt(listaMiembros.length / miembrosPorPagina);
    if (listaMiembros.length % miembrosPorPagina != 0) {
        totalPaginas++;
    }

    let miembrosPagina = [];
    for (let i = 0; i < listaMiembros.length; i++) {
        if (i >= (paginaActual - 1) * miembrosPorPagina && miembrosPagina.length < miembrosPorPagina) {
            miembrosPagina.push(listaMiembros[i]);
        }
    }

    miembrosPagina.forEach(miembro => {
        const clon = plantilla.cloneNode(true);
        
        clon.querySelector('.col-nombre').textContent = miembro.nombre;
        clon.querySelector('.col-email').textContent = miembro.email;
        clon.querySelector('.col-telefono').textContent = miembro.telefono;

        const urlDetalle = `detalle_miembro.html?id=${miembro.id}`;
        clon.querySelector('.clic-fila').addEventListener('click', () => {
            window.location.href = urlDetalle;
        });

        tbody.appendChild(clon);
    });

    infoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual >= totalPaginas;
}

function configurarBotonesPaginacion() {
    const btnAnterior = document.getElementById('btn-anterior');
    const btnSiguiente = document.getElementById('btn-siguiente');

    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarTabla(miembrosTotales);
        }
    });

    btnSiguiente.addEventListener('click', () => {
        let totalPaginas = parseInt(miembrosTotales.length / miembrosPorPagina);
        if (miembrosTotales.length % miembrosPorPagina != 0) {
            totalPaginas++;
        }
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarTabla(miembrosTotales);
        }
    });
}