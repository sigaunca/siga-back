const mongoose = require("mongoose");

const EscuelasSchema = mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
    },
    telefono: {
        type: String,
        required: true,
    },
    codigoPostal: {
        type: String,
        required: true,
    },
    barrio: {
        type: String,
        required: true,
    },
    calle: {
        type: String,
        required: true,
    },
    numeroCalle: {
        type: String,
        required: true,
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

module.exports = mongoose.model("Escuela", EscuelasSchema);
