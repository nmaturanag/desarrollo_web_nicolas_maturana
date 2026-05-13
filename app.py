import os

from datetime import datetime
from flask import (Flask, redirect, render_template, request, url_for)
from flask_sqlalchemy import SQLAlchemy
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


class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)
    nombre_archivo = db.Column(db.String(300), nullable=False)
    actividad_id = db.Column(db.Integer, db.ForeignKey('actividad.id'), nullable=False)


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
    if request.method == 'GET':
        return render_template('registro_miembros.html')
    
    elif request.method == 'POST':
        name_form = request.form.get('nombre')
        email_form = request.form.get('email')
        phone_form = request.form.get('phone')
        
        # validacion
        if not name_form:
            return render_template('registro_miembros.html', error="Por favor ingresar un nombre válido")
        
        if not email_form:
            return render_template('registro_miembros.html', error="Por favor ingresar un email válido")
        
        new_member = Miembro(
            nombre=name_form, 
            email=email_form, 
            telefono=phone_form,
            comuna_id=10101,
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

# los dejé como en la T1 por falta de tiempo :(
@app.route('/graficos')
def graficos():
    return render_template('graficos.html')


@app.route('/miembro/<int:miembro_id>')
def detalle_miembro(miembro_id):
    miembro = Miembro.query.get_or_404(miembro_id)
    actividades = Actividad.query.filter_by(miembro_id=miembro_id).all()
    return render_template('detalle_miembro.html', miembro=miembro, actividades=actividades)


if __name__ == '__main__':
    app.run(debug=True)
