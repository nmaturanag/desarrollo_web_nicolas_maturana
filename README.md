# Tarea 1

## Ejecución

Para ejecutar hay que copiar el proyecto y hacer doble click en index.html

## Diseño

### HTML

Se dejó cada página en un html aparte, incluyendo el listado de miembros que podría haberse dejado en la página principal, pero me pareció más ordenado así.

En gráficos.html puse como ejemplo un par de métricas y un par de gráficos que me parecieron interesantes. Los datos son inventados.

### CSS

Un diseño básico, toda la parte estética se maneja en el css (en vez de los html).

### JS

En el archivo validation.js se revisa que los campos de inscripción de personas y actividades tengan los requisitos mínimos.

En select.js se maneja la selección de roles en la inscripción (estudiante, académico y funcionario). Permití selección múltiple porque en teoría una persona podría tener más de un rol (un estudiante de doctorado que también es profesor por ejemplo).

En filter_list.js está la lógica para filtrar la mini tabla de listado_miembros.html.

### Flask

- Agregué un html para los detalles de un miembro específico porque se pedía.
- Las categorías de actividades también fueron ajstadas a lo que salía en la base de datos.
- Como no había columna de tipo de miembro (funcionario, estudiante, etc.), quite eso de la tabla de miembros para que coincida con la base de datos. Me faltó un selector de comunas, por ahora se usa el mismo id de comuna para todos (10101, la primera).
- Las métricas se mantuvieron como antes (gráficos de ejemplo con datos inventados). La verdad no alcancé a modificarlos por código, pero de todas formas para que se vieran habría que insertar como 100 miembros y actividades de varios tipos, y como en el enunciado no se mencionaba esto decidí dejarlo así.

Fuera de eso la página es similar a antes.