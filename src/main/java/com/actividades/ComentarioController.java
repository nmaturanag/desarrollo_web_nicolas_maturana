package com.actividades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @GetMapping("/{actividad_id}")
    @ResponseBody
    public Iterable<Comentario> getComentarios(@PathVariable Integer actividad_id) {
        
        List<Comentario> filtrados = new ArrayList<>();
        
        for (Comentario c: comentarioRepository.findAll()) {
            if (c.getActividadId().equals(actividad_id)) {
                filtrados.add(c);
            }
        }
        return filtrados;
    }

    @PostMapping("/add")
    @ResponseBody
    public String add(
        @RequestParam Integer actividad_id, 
        @RequestParam String nombre, 
        @RequestParam String texto
    ) {
        
        if (nombre == null || nombre.length() < 3 || nombre.length() > 80) {
            return "Error: El nombre debe tener entre 3 y 80 caracteres.";
        }
        if (texto == null || texto.length() < 5) {
            return "Error: El comentario debe tener al menos 5 caracteres.";
        }

        Comentario c = new Comentario();
        c.setActividadId(actividad_id);
        c.setNombreComentarista(nombre);
        c.setTexto(texto);

        java.time.format.DateTimeFormatter formato = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        c.setFechaHora(java.time.LocalDateTime.now().format(formato));

        comentarioRepository.save(c);
        
        return "Comentario agregado exitosamente.";
    }
}