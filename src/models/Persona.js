const mongoose = require("mongoose");
const {
    generosPermitidos,
    nacionalidadPermitidos,
} = require("../types/enums.js");

const PersonasSchema = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
        trim: true,
    },
    apellidos: {
        type: String,
        required: true,
        trim: true,
    },
    tipoDocumento: {
        type: String,
        required: true,
        default: "DNI",
        trim: true,
    },
    numeroDocumento: {
        type: String,
        required: true,
        trim: true,
    },
    genero: {
        type: String,
        enum: generosPermitidos,
        required: true,
    },
    grupoFactor: {
        type: String,
        required: true,
        trim: true,
    },
    nacionalidad: {
        type: String,
        enum: nacionalidadPermitidos,
        default: "AR",
        required: true,
    },
    // domicilio
    domicilioPais: {
        type: String,
        default: "Argentina",
        required: false,
    },
    domicilioProvincia: {
        type: String,
        ref: "Provincia",
        default: "Catamarca",
        required: false,
    },
    domicilioLocalidad: {
        type: String,
        required: false,
    },
    domicilioCodigoPostal: {
        type: Number,
        required: false,
    },
    domicilioBarrio: {
        type: String,
        required: false,
    },
    domicilioCalle: {
        type: String,
        required: false,
    },
    domicilioNumeroCalle: {
        type: String,
        default: "S/N",
    },
    domicilioPiso: {
        type: Number,
    },
    domicilioDepartamento: {
        type: String,
    },
    // domicilio fin
    // datos contacto
    contactoTelefono: {
        type: String,
        required: true,
    },
    contactoTelefonoSec: {
        type: String,
        required: false,
    },
    contactoCorreo: {
        type: String,
        required: true,
    },
    // laborales
    ocupacion: {
        type: String,
        required: false,
    },
    domicilioLaboralProvincia: {
        type: String,
        default: "Catamarca",
        required: false,
    },
    domicilioLaboralLocalidad: {
        type: String,
        required: false,
    },
    domicilioLaboralCodigoPostal: {
        type: Number,
        required: false,
    },
    domicilioLaboralCalle: {
        type: String,
        required: false,
    },
    // laborales fin
    difunto: {
        type: Boolean,
        default: false,
    },
    fechaNacimiento: {
        type: Date,
        required: false,
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

module.exports = mongoose.model("Persona", PersonasSchema);

// tipo documento
/**
domicilioProvincia
domicilioLocalidad
domicilioCodigoPostal
domicilioBarrio
domicilioCalle
domicilioNumeroCalle
domicilioPiso
domicilioDepartamento
contactoTelefono
contactoTelefonoSec
contactoCorreo
ocupacion
domicilioLaboralLocalidad
domicilioLaboralProvincia
domicilioLaboralCodigoPostal
domicilioLaboralCalle

 */
