const actualizarBloques = () => {
    const esEstudiante = document.querySelector('input[value="estudiante"]').checked;
    const esAcademico = document.querySelector('input[value="academico"]').checked;
    const esFuncionario = document.querySelector('input[value="funcionario"]').checked;

    const bloqueEstudiante = document.getElementById('bloque-estudiante');
    const bloqueAcademico = document.getElementById('bloque-academico');
    const bloqueFuncionario = document.getElementById('bloque-funcionario');

    bloqueEstudiante.style.display = esEstudiante ? 'block' : 'none';
    bloqueAcademico.style.display = esAcademico ? 'block' : 'none';
    bloqueFuncionario.style.display = esFuncionario ? 'block' : 'none';
};

window.onload = () => {
    const checkboxes = document.querySelectorAll('.check-tipo');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarBloques);
    });

    actualizarBloques();
};
