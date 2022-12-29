const mongoose = require("mongoose");

const AsignaturaSchema = mongoose.Schema({
    nombre: {
        type: String        
    },
    curso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso"
    },
    profesor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autoridade'
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

module.exports = mongoose.model("Asignatura", AsignaturaSchema);
