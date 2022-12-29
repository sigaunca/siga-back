const mongoose = require('mongoose');

const CursosSchema = mongoose.Schema({
    escuela: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Escuela'
    },
    preceptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autoridade'
    },
    nivel: {
        type: String,
        trim: true
    },
    anio: {
        type: String,
        required: true
    },
    seccion: {
        type: String,
        required: true
    },
    turno: {
        type: String,
        enum : ['Mañana','Tarde', 'Noche']
    },
    asistenciaEstado: {
        type: Boolean,
        default: false    
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Curso', CursosSchema);