package com.actividades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer actividad_id;
    private Integer nota;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getActividadId() {
        return actividad_id;
    }

    public void setActividadId(Integer actividad_id) {
        this.actividad_id = actividad_id;
    }

    public Integer getNota() {
        return nota;
    }

    public void setNota(Integer nota) {
        this.nota = nota;
    }

    @Override
    public String toString() {
        return "Nota{" +
                "id=" + id +
                ", actividad_id=" + actividad_id +
                ", nota=" + nota +
                '}';
    }
}
