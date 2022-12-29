const mongoose = require("mongoose");

const ListadoCalificacionesSchema = mongoose.Schema({
    calificaciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Califacion"
    }],
    fecha: {
        type: String
    },
    concepto: {
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

module.exports = mongoose.model("ListadoCalificaciones", ListadoCalificacionesSchema);
