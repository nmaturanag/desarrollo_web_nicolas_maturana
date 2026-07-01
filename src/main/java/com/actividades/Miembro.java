package com.actividades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.JoinColumn;
import java.util.List;

@Entity
public class Miembro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nombre;
    private String email;
    private String telefono;
    private String fecha_registro;
    private Integer comuna_id;

    @OneToMany
    @JoinColumn(name="miembro_id")
    private List<Actividad> actividades;

    public List<Actividad> getActividades() {
        return actividades;
    }

    public void setActividades(List<Actividad> actividades) {
        this.actividades = actividades;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getFechaRegistro() {
        return fecha_registro;
    }

    public void setFechaRegistro(String fecha_registro) {
        this.fecha_registro = fecha_registro;
    }

    public Integer getComunaId() {
        return comuna_id;
    }

    public void setComunaId(Integer comuna_id) {
        this.comuna_id = comuna_id;
    }

    @Override
    public String toString() {
        return "Miembro{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", email='" + email + '\'' +
                ", telefono='" + telefono + '\'' +
                ", fecha_registro='" + fecha_registro + '\'' +
                ", comuna_id=" + comuna_id +
                '}';
    }
}
