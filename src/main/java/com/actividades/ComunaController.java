package com.actividades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/comunas")
public class ComunaController {

    @Autowired
    private ComunaRepository comunaRepository;

    @GetMapping("/all")
    @ResponseBody
    public Iterable<Comuna> getAllComunas() {
        return comunaRepository.findAll();
    }
    
    @GetMapping("/{id}")
    @ResponseBody
    public Comuna one(@PathVariable Integer id) {
        return comunaRepository.findById(id).orElse(null);
    }
}