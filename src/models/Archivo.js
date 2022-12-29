const mongoose = require("mongoose");

const ArchivoSchema = mongoose.Schema({
    archivoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArchivoType",
    },
    archivo: {
        type: Buffer,
        required: true,
    },
    nombre: {
        type: String,
        required: true,
    },
    ext: {
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

module.exports = mongoose.model("Archivo", ArchivoSchema);
