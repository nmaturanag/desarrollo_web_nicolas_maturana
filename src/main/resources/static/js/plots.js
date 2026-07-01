document.addEventListener("DOMContentLoaded", () => {cargarGraficos();});


async function cargarGraficos() {
    try {
        const response = await fetch("/api/estadisticas");
        const datos = await response.json();
        crearGraficoMiembrosPorDia(datos.lineas);
        crearGraficoActividadesTipo(datos.torta);
        crearGraficoActividadesComuna(datos.barras);
    } catch (error) {
        console.error("Error al cargar los gráficos:", error);
    }
}


function crearGraficoMiembrosPorDia(datos) {
    const contexto = document.getElementById("graficoMiembrosPorDia").getContext("2d");
    new Chart(contexto, {
        type: "line",
        data: {
            labels: datos.labels,
            datasets: [{
                label: "Miembros registrados",
                data: datos.data
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}


function crearGraficoActividadesTipo(datos) {
    const contexto = document.getElementById("graficoActividadesTipo").getContext("2d");

    new Chart(contexto, {
        type: "pie",
        data: {
            labels: datos.labels,
            datasets: [{
                label: "Actividades por tipo",
                data: datos.data
            }]
        }
    });
}


function crearGraficoActividadesComuna(datos) {
    const contexto = document.getElementById("graficoActividadesComuna").getContext("2d");

    new Chart(contexto, {
        type: "bar",
        data: {
            labels: datos.labels,
            datasets: [{
                label: "Actividades registradas",
                data: datos.data
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}
