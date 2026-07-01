package com.actividades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Foto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String ruta_archivo;
    private String nombre_archivo;
    private Integer actividad_id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRutaArchivo() {
        return ruta_archivo;
    }

    public void setRutaArchivo(String ruta_archivo) {
        this.ruta_archivo = ruta_archivo;
    }

    public String getNombreArchivo() {
        return nombre_archivo;
    }

    public void setNombreArchivo(String nombre_archivo) {
        this.nombre_archivo = nombre_archivo;
    }

    public Integer getActividadId() {
        return actividad_id;
    }

    public void setActividadId(Integer actividad_id) {
        this.actividad_id = actividad_id;
    }

    @Override
    public String toString() {
        return "Foto{" +
                "id=" + id +
                ", ruta_archivo='" + ruta_archivo + '\'' +
                ", nombre_archivo='" + nombre_archivo + '\'' +
                ", actividad_id=" + actividad_id +
                '}';
    }
}
