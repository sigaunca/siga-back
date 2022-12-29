const mongoose = require("mongoose");

const AlumnosSchema = mongoose.Schema({
    persona: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Persona",
    },
    procedenciaEscolar: {
        type: String,
        required: false,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    // asistencia: {
    //     type: Boolean,
    //     default: false,
    // },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Alumno", AlumnosSchema);
