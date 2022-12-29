const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    autoridad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Autoridade",
    },
    resetToken: {
        type: String,
        required: false,
        trime: true,
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

module.exports = mongoose.model("Usuario", UsuariosSchema);
