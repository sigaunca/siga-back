const mongoose = require("mongoose");

const CalificacionSchema = mongoose.Schema({
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumno"
    },
    asignatura: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asignatura"
    },
    valor: {
        type: String,
        default: "A"
    },
    ausente: {
        type: Boolean,
        default: false
    },
    fecha:{
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Calificacion", CalificacionSchema);
