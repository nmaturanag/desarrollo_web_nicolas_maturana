package com.actividades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer actividad_id;
    private String nombre_comentarista;
    private String texto;
    private String fecha_hora;

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

    public String getNombreComentarista() {
        return nombre_comentarista;
    }

    public void setNombreComentarista(String nombre_comentarista) {
        this.nombre_comentarista = nombre_comentarista;
    }

    public String getTexto() {
        return texto;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public String getFechaHora() {
        return fecha_hora;
    }

    public void setFechaHora(String fecha_hora) {
        this.fecha_hora = fecha_hora;
    }

    @Override
    public String toString() {
        return "Comentario{" +
                "id=" + id +
                ", actividad_id=" + actividad_id +
                ", nombre_comentarista='" + nombre_comentarista + '\'' +
                ", texto='" + texto + '\'' +
                ", fecha_hora='" + fecha_hora + '\'' +
                '}';
    }
}
