let actividadesTotales = [];
let miembrosTotales = [];
let comunasTotales = [];


document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    configurarBuscador();
});


function configurarBuscador() {
    const inputBusqueda = document.getElementById('input-busqueda');

    inputBusqueda.addEventListener('input', () => {
        const texto = inputBusqueda.value.trim();
        if (texto.length >= 3) {
            buscar(texto);
        } else {
            document.getElementById('resultados-busqueda').innerHTML = '<p>Escribe al menos 3 caracteres para buscar.</p>';
        }
    });
}


function cargarDatos() {
    fetch('/actividades/all')
        .then(respuesta => respuesta.json())
        .then(actividades => {
            actividadesTotales = actividades;
        });

    fetch('/miembros/all')
        .then(respuesta => respuesta.json())
        .then(miembros => {
            miembrosTotales = miembros;
        });

    fetch('/comunas/all')
        .then(respuesta => respuesta.json())
        .then(comunas => {
            comunasTotales = comunas;
        });
}


function buscar(texto) {
    const contenedor = document.getElementById('resultados-busqueda');
    const plantilla = document.getElementById('plantilla-resultado').content;
    const textoBusqueda = texto.toLowerCase();

    const resultados = [];
    for (let i = 0; i < actividadesTotales.length; i++) {
        const actividad = actividadesTotales[i];

        let nombreMiembro = '-';
        let nombreComuna = '-';

        for (let j = 0; j < miembrosTotales.length; j++) {
            if (miembrosTotales[j].id == actividad.miembroId) {
                nombreMiembro = miembrosTotales[j].nombre;

                for (let k = 0; k < comunasTotales.length; k++) {
                    if (comunasTotales[k].id == miembrosTotales[j].comunaId) {
                        nombreComuna = comunasTotales[k].nombre;
                    }
                }
                break;
            }
        }
        // busca en actividad, descripcion o comuna
        const coincideNombre = actividad.nombre.toLowerCase().includes(textoBusqueda);
        const coincideDescripcion = actividad.descripcion.toLowerCase().includes(textoBusqueda);
        const coincideComuna = nombreComuna.toLowerCase().includes(textoBusqueda);

        if (coincideNombre || coincideDescripcion || coincideComuna) {
            resultados.push({
                actividad: actividad,
                nombreMiembro: nombreMiembro,
                nombreComuna: nombreComuna
            });
        }
    }

    contenedor.innerHTML = '';

    if (resultados.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron actividades.</p>';
        return;
    }

    const lista = document.createElement('ul');

    for (let i = 0; i < resultados.length; i++) {
        const r = resultados[i];
        const clon = plantilla.cloneNode(true);

        clon.querySelector('.res-nombre').innerHTML = destacar(r.actividad.nombre, texto);
        clon.querySelector('.res-miembro').textContent = r.nombreMiembro;
        clon.querySelector('.res-dia').textContent = r.actividad.dia;
        clon.querySelector('.res-tipo').textContent = r.actividad.tipo;
        clon.querySelector('.res-comuna').innerHTML = destacar(r.nombreComuna, texto);
        clon.querySelector('.res-descripcion').innerHTML = destacar(r.actividad.descripcion, texto);

        lista.appendChild(clon);
    }

    contenedor.appendChild(lista);
}


function destacar(texto, patron) {
    if (!texto) {
        return '-';
    }

    const textoLower = texto.toLowerCase();
    const patronLower = patron.toLowerCase();
    const indice = textoLower.indexOf(patronLower);

    if (indice === -1) {
        return texto;
    }

    const antes = texto.substring(0, indice);
    const coincidencia = texto.substring(indice, indice + patron.length);
    const despues = texto.substring(indice + patron.length);

    return antes + '<strong>' + coincidencia + '</strong>' + despues;
}
