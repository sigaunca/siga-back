// models
const Alumno = require("../models/Alumno");
const Persona = require("../models/Persona");
// const Domicilio = require("../models/Domicilio");
// const DatosContacto = require("../models/DatosContacto");

// services
// const domicilioService = require("../services/domicilioService");
// const datosContactoService = require("../services/datosContactoService");
const personaService = require("../services/personaService");

/**
 * Crear alumno
 * @param reqAlumno
 * @param procedenciaEscolar
 * @returns {Promise<*>}
 * se busca por documento la existencia del alumno:
 * - si no existe creamos nuevo alumno y lo retornamos
 * - si existe, retornamos ese alumno
 */
exports.crearAlumno = async ({ reqPersona, procedenciaEscolar }) => {
    let alumno = await this.traerAlumnoPorNumeroDocumentoSinThrow({
        numeroDocumento: reqPersona.numeroDocumento,
    });

    if (!alumno) {
        const nuevaPersona = await personaService.recuperarOCrearPersona({
            reqPersona,
        });

        alumno = await new Alumno({
            persona: nuevaPersona._id,
            procedenciaEscolar: procedenciaEscolar,
        });

        await alumno.save();
    }

    return alumno;
};

/**
 * Actualizamos los datos del alumno
 * @param {*} reqAlumno
 * @returns
 */
exports.actualizarAlumno = async ({ id, reqAlumno, procedenciaEscolar }) => {
    // encontrar el alumno, si no existe?
    const alumno = await Alumno.findOneAndUpdate(
        { _id: id },
        { $set: { procedenciaEscolar } },
        { new: true },
    );

    personaService.actualizarPersona({
        id: alumno.persona,
        reqPersona: reqAlumno,
    });

    //
};
// TODO: REVISAR SU USO
exports.traerAlumnoByPersonaId = async (personaId) => {
    let alumno = null;
    if (personaId)
        alumno = await Alumno.findOne({
            persona: personaId,
        });
    return alumno;
};

/**
 * traer una persona por numero de documento
 * @param {numeroDocumento String}
 * @returns
 */
// TODO: REVISAR SU USO
exports.traerAlumnoPorNumeroDocumento = async ({ numeroDocumento }) => {
    let persona =
        personaService.traerPersonaPorNumeroDocumento(numeroDocumento);

    if (!persona)
        throw new Error(
            "No se encuentra un alumno con ese numero de documento",
        );

    let alumno = await Alumno.findOne({
        persona: persona._id,
    }).populate({
        path: "persona",
    });

    if (!alumno)
        throw new Error(
            "No se encuentra un alumno con ese numero de documento",
        );

    return alumno;
};

/**
 * traer una persona por numero de documento - No lanza throws
 * @param {numeroDocumento String}
 * @returns
 */
exports.traerAlumnoPorNumeroDocumentoSinThrow = async ({ numeroDocumento }) => {
    let persona = await personaService.traerPersonaPorNumeroDocumento({
        numeroDocumento,
    });

    if (!persona) return null;

    let alumno = await Alumno.findOne({
        persona: persona._id,
    }).populate({
        path: "persona",
    });

    if (!alumno) return null;

    return alumno;
};
