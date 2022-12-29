const mongoose = require("mongoose");
const { tipoAutoridadPermitidos } = require("../types/enums.js");

const AutoridadTypeSchema = mongoose.Schema({
    tipoAutoridad: {
        type: String,
        enum: tipoAutoridadPermitidos,
    },
    permisos: {
        type: Array,
    },
});

module.exports = mongoose.model("AutoridadType", AutoridadTypeSchema);
