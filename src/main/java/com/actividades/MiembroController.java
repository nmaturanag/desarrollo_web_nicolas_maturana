package com.actividades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;


@RestController
@RequestMapping("/miembros")
public class MiembroController {

    @Autowired
    private MiembroRepository miembroRepository;

    @GetMapping("/all")
    @ResponseBody
    public Iterable<Miembro> getAllMiembros() {
        return miembroRepository.findAll();
    }

    @PostMapping("/add")
    @ResponseBody
    public String add(
        @RequestParam String nombre, 
        @RequestParam String email, 
        @RequestParam String telefono, 
        @RequestParam Integer comuna_id
    ) {
        
        Miembro m = new Miembro();
        m.setNombre(nombre);
        m.setEmail(email);
        m.setTelefono(telefono);
        m.setComunaId(comuna_id);
        
        m.setFechaRegistro(LocalDateTime.now()); 
        
        miembroRepository.save(m);
        
        return "Agregado nuevo miembro";
    }
    
    @GetMapping("/{id}")
    @ResponseBody
    public Miembro one(@PathVariable Integer id) {
        return miembroRepository.findById(id).orElse(null);
    }
}
