package com.actividades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/actividades")
public class ActividadController {

    @Autowired
    private ActividadRepository actividadRepository;

    @GetMapping("/all")
    @ResponseBody
    Iterable<Actividad> getAllActividades() {
        return actividadRepository.findAll();
    }

    @PostMapping("/add")
    @ResponseBody
    String add(
        @RequestParam Integer miembro_id, 
        @RequestParam String dia, 
        @RequestParam String tipo, 
        @RequestParam String nombre, 
        @RequestParam String descripcion
    ) {

        Actividad a = new Actividad();
        a.setMiembroId(miembro_id);
        a.setDia(dia);
        a.setTipo(tipo);
        a.setNombre(nombre);
        a.setDescripcion(descripcion);

        actividadRepository.save(a);
        return "Agregada nueva actividad";
    }

    @GetMapping("/{id}")
    Actividad one(@PathVariable Integer id) {
        return actividadRepository.findById(id).orElse(null);
    }
}
