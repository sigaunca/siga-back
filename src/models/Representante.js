const mongoose = require("mongoose");

const RepresentanteSchema = mongoose.Schema({
    alumnos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Alumno" }],
});

module.exports = mongoose.model("Representante", RepresentanteSchema);
