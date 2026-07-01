package com.actividades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Comuna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private Integer region_id;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getRegionId() {
        return region_id;
    }

    public void setRegionId(Integer region_id) {
        this.region_id = region_id;
    }

    @Override
    public String toString() {
        return "Comuna{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", region_id=" + region_id +
                '}';
    }
}
