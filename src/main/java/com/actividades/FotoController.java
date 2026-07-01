package com.actividades;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/fotos")
public class FotoController {

    @Autowired
    private FotoRepository fotoRepository;

    @GetMapping("/all")
    @ResponseBody
    public Iterable<Foto> getAllFotos() {
        return fotoRepository.findAll();
    }

    @PostMapping("/add")
    @ResponseBody
    public String add(
        @RequestParam String ruta_archivo, 
        @RequestParam String nombre_archivo, 
        @RequestParam Integer actividad_id
    ) {
        
        Foto f = new Foto();
        f.setRutaArchivo(ruta_archivo);
        f.setNombreArchivo(nombre_archivo);
        f.setActividadId(actividad_id);
        
        fotoRepository.save(f);
        
        return "Agregada nueva foto";
    }
    
    @GetMapping("/{id}")
    @ResponseBody
    public Foto one(@PathVariable Integer id) {
        return fotoRepository.findById(id).orElse(null);
    }
}