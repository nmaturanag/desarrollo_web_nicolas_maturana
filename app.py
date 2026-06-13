import os

from datetime import datetime
from flask import (Flask, jsonify, redirect, render_template, request, url_for)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from werkzeug.utils import secure_filename


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost:3306/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

UPLOAD_FOLDER = os.path.join('static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQLAlchemy(app)


class Miembro(db.Model):
    __tablename__ = 'miembro'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(80), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_registro = db.Column(db.DateTime, nullable=False)
    comuna_id = db.Column(db.Integer, nullable=False)


class Actividad(db.Model):
    __tablename__ = 'actividad'
    id = db.Column(db.Integer, primary_key=True)
    miembro_id = db.Column(db.Integer, db.ForeignKey('miembro.id'), nullable=False)
    dia = db.Column(db.Enum('lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'))
    hora_inicio = db.Column(db.String(5))
    duracion = db.Column(db.String(5))
    tipo = db.Column(db.Enum('arte', 'deporte', 'tecnología', 'social', 'recreación', 'otra'))
    nombre = db.Column(db.String(45))
    descripcion = db.Column(db.Text)


class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    region_id = db.Column(db.Integer, nullable=False)


class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)


class Comentario(db.Model):
    __tablename__ = 'comentario'
    id = db.Column(db.Integer, primary_key=True)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)
    nombre_comentarista = db.Column(db.String(80), nullable=False)
    texto = db.Column(db.Text, nullable=False)
    fecha_hora = db.Column(db.DateTime, default=datetime.now)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre_comentarista,
            "texto": self.texto,
            "fecha": self.fecha_hora.strftime("%Y-%m-%d %H:%M:%S")
        }


@app.route('/')
def index():
    members_list = Miembro.query.order_by(Miembro.id.desc()).limit(5).all() # ultimos 5 miembros
    return render_template('index.html', miembros=members_list)


@app.route('/listado_miembros')
def listado_miembros():
    pagination = Miembro.query.order_by(Miembro.id.asc()).paginate(
        page=request.args.get('page', 1, type=int),
        per_page=5,
        error_out=False
    )
    return render_template('listado_miembros.html', pagination=pagination)


@app.route('/registro_miembros', methods=['GET', 'POST'])
def registro_miembros():
    comunas = Comuna.query.order_by(Comuna.nombre.asc()).all()

    if request.method == 'GET':
        return render_template('registro_miembros.html', comunas=comunas)
    
    elif request.method == 'POST':
        name_form = request.form.get('nombre', '').strip()
        email_form = request.form.get('email', '').strip()
        phone_form = request.form.get('phone', '').strip()
        comuna_id_form = request.form.get('comuna_id', type=int)
        
        # validacion
        if not name_form:
            return render_template(
                'registro_miembros.html',
                comunas=comunas,
                error="Por favor ingresar un nombre válido"
            )
        
        if not email_form:
            return render_template(
                'registro_miembros.html',
                comunas=comunas,
                error="Por favor ingresar un email válido"
            )
        
        if not phone_form:
            return render_template(
                'registro_miembros.html',
                comunas=comunas,
                error="Por favor ingresar un teléfono válido"
            )

        if not comuna_id_form:
            return render_template(
                'registro_miembros.html',
                comunas=comunas,
                error="Por favor seleccionar una comuna"
            )

        comuna = Comuna.query.get(comuna_id_form)

        if not comuna:
            return render_template(
                'registro_miembros.html',
                comunas=comunas,
                error="La comuna seleccionada no existe"
            )
        
        new_member = Miembro(
            nombre=name_form, 
            email=email_form, 
            telefono=phone_form,
            comuna_id=comuna_id_form,
            fecha_registro=datetime.now()
        )
        
        db.session.add(new_member)
        db.session.commit()
        
        return redirect(url_for('index'))


@app.route('/registro_actividades', methods=['GET', 'POST'])
def registro_actividades():
    if request.method == 'GET':
        members_list = Miembro.query.all()
        return render_template('registro_actividades.html', miembros=members_list)
    
    if request.method == 'POST':
        miembro_id = request.form.get('miembro_id') 
        tipo = request.form.get('tipo-actividad')
        nombre = request.form.get('nombre-actividad')
        descripcion = request.form.get('descripcion')
        enlace = request.form.get('enlace')

        selected_days = request.form.getlist('dia')
        if not selected_days:
             return render_template(
                'registro_actividades.html', 
                miembros=Miembro.query.all(),
                error="Debes seleccionar al menos un día."
            )

        archivos = request.files.getlist('audiovisual')
        filenames_guardados = []
        for archivo in archivos:
            if archivo and archivo.filename:
                filename = secure_filename(archivo.filename)
                abs_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                archivo.save(abs_path)
                filenames_guardados.append(filename)

        for day in selected_days:
            hora_inicio = request.form.get(f'hora-inicio-{day}')
            hora_fin = request.form.get(f'hora-fin-{day}')
            duracion_calculada = hora_fin if hora_fin else "00:00"

            nueva_actividad = Actividad(
                miembro_id=miembro_id,
                dia=day,
                hora_inicio=hora_inicio,
                duracion=duracion_calculada,
                tipo=tipo,
                nombre=nombre,
                descripcion=descripcion
            )
            db.session.add(nueva_actividad)
            db.session.flush()
            
            for fname in filenames_guardados:
                nueva_foto = Foto(
                    ruta_archivo=os.path.join('uploads', fname),
                    nombre_archivo=fname,
                    actividad_id=nueva_actividad.id
                )
                db.session.add(nueva_foto)

        db.session.commit()
        return redirect(url_for('index'))

@app.route('/graficos')
def graficos():
    return render_template('graficos.html')


@app.route('/miembro/<int:miembro_id>')
def detalle_miembro(miembro_id):
    miembro = Miembro.query.get_or_404(miembro_id)
    actividades = Actividad.query.filter_by(miembro_id=miembro_id).all()
    return render_template('detalle_miembro.html', miembro=miembro, actividades=actividades)


@app.route('/actividad/<int:actividad_id>')
def detalle_actividad(actividad_id):
    actividad = Actividad.query.get_or_404(actividad_id)
    miembro = Miembro.query.get_or_404(actividad.miembro_id)
    fotos = Foto.query.filter_by(actividad_id=actividad_id).all()
    return render_template(
        'detalle_actividad.html',
        actividad=actividad,
        miembro=miembro,
        fotos=fotos
    )


@app.route('/api/comentarios', methods=['POST'])
def agregar_comentario():
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "Solicitud inválida."}), 400
    
    actividad_id = data.get('actividad_id')
    nombre = data.get('nombre', '').strip()
    texto = data.get('texto', '').strip()
    
    if not (3 <= len(nombre) <= 80):
        return jsonify({"status": "error", "message": "El nombre debe tener entre 3 y 80 caracteres."}), 400
        
    if len(texto) < 5:
        return jsonify({"status": "error", "message": "El comentario debe tener al menos 5 caracteres."}), 400

    try:
        nuevo_comentario = Comentario(
            actividad_id=actividad_id,
            nombre_comentarista=nombre,
            texto=texto,
            fecha_hora=datetime.now()
        )
        db.session.add(nuevo_comentario)
        db.session.commit()
        
        return jsonify({"status": "success", "message": "Comentario agregado exitosamente.", "comentario": nuevo_comentario.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/comentarios/<int:actividad_id>', methods=['GET'])
def obtener_comentarios(actividad_id):
    comentarios = Comentario.query.filter_by(
        actividad_id=actividad_id
    )
    comentarios = comentarios.order_by(
        Comentario.fecha_hora.desc()
    ).all()
    
    resultado = [c.to_dict() for c in comentarios]
    return jsonify(resultado), 200


@app.route('/api/estadisticas', methods=['GET'])
def obtener_estadisticas():
    miembros_por_dia = (
        db.session.query(
            func.date(Miembro.fecha_registro).label('fecha'),
            func.count(Miembro.id).label('cantidad')
        )
        .group_by(func.date(Miembro.fecha_registro))
        .order_by(func.date(Miembro.fecha_registro))
        .all()
    )
    
    datos_lineas = {
        "labels": [str(m.fecha) for m in miembros_por_dia],
        "data": [m.cantidad for m in miembros_por_dia]
    }

    actividades_tipo = (
        db.session.query(
            Actividad.tipo,
            func.count(Actividad.id).label('cantidad')
        )
        .group_by(Actividad.tipo)
        .all()
    )

    datos_torta = {
        "labels": [a.tipo for a in actividades_tipo],
        "data": [a.cantidad for a in actividades_tipo]
    }

    actividades_comuna = (
        db.session.query(
            Comuna.nombre,
            func.count(Actividad.id).label('cantidad')
        )
        .select_from(Actividad)
        .join(Miembro, Actividad.miembro_id == Miembro.id)
        .join(Comuna, Miembro.comuna_id == Comuna.id)
        .group_by(Comuna.nombre)
        .all()
    )

    datos_barras = {
        "labels": [c.nombre for c in actividades_comuna],
        "data": [c.cantidad for c in actividades_comuna]
    }

    return jsonify({
        "lineas": datos_lineas,
        "torta": datos_torta,
        "barras": datos_barras
    })


if __name__ == '__main__':
    app.run(debug=True)
