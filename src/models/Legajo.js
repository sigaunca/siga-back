const mongoose = require("mongoose");

const LegajosSchema = mongoose.Schema({
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
        default: null,
    },
    alumno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alumno",
    },
    padre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Persona",
    },
    madre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Persona",
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Autoridade",
    },
    documentos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Archivo",
    },
    archivado: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model("Legajo", LegajosSchema);
