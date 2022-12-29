// const domicilioService = require("../services/domicilioService");
const Escuela = require("../models/Escuela");
const { path } = require("express/lib/application");

/**
 * Crear una escuela
 * @param {reqEscuela Object}
 * @returns se crea una nueva escuela
 */
// TODO: REVISAR SU USO
exports.crearEscuela = async (reqEscuela) => {
    const { nombre } = reqEscuela;
    let escuela = await Escuela.findOne({ nombre });
    if (!escuela) {
        // creamos escuela
        escuela = new Escuela({
            ...reqEscuela,
        });
        escuela.save();
    }
    return escuela;
};

/**
 * obtener una escuela por nombre
 * @param {nombre String}
 * @returns
 */
// TODO: REVISAR SU USO
exports.traerEscuelaByName = async (nombre) => {
    const escuela = await Escuela.findOne({ nombre }).populate("domicilio");
    if (!escuela) {
        throw new Error("No existe una escuela con el nombre ingresado.");
    }
    return escuela;
};

/**
 * obtener escuela por id
 * @param {id string}
 * @returns
 */
// TODO: REVISAR SU USO
exports.traerEscuelaById = async (id) => {
    const escuela = await Escuela.findById(id).populate("domicilio");
    if (!escuela) {
        throw new Error("No existe una escuela con el id ingresado.");
    }
    return escuela;
};

/**
 * obtener el domicilioId de una escuela por nombre
 * @param {nombre String}
 * @returns
 */
// TODO: REVISAR SU USO
exports.traerDomicilioIdDeEscuelaByName = async (nombre) => {
    const escuela = await Escuela.findOne({ nombre }).populate("domicilio");
    if (!escuela) {
        throw new Error("No existe una escuela con el nombre ingresado.");
    }
    return escuela.domicilio._id;
};
