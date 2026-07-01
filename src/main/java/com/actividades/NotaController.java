package com.actividades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/notas")
public class NotaController {

    @Autowired
    private NotaRepository notaRepository;

    @GetMapping("/all")
    @ResponseBody
    public Iterable<Nota> getAllNotas() {
        return notaRepository.findAll();
    }

    @PostMapping("/add")
    @ResponseBody
    public String add(
        @RequestParam Integer actividad_id, 
        @RequestParam Integer nota
    ) {
        
        if (nota < 1 || nota > 7) {
            return "Error: La nota debe estar entre 1 y 7";
        }
        
        Nota n = new Nota();
        n.setActividadId(actividad_id);
        n.setNota(nota);
        
        notaRepository.save(n);
        
        return "Agregada nueva nota";
    }
    
    @GetMapping("/{id}")
    @ResponseBody
    public Nota one(@PathVariable Integer id) {
        return notaRepository.findById(id).orElse(null);
    }
}
