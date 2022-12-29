// models
const Persona = require("../models/Persona");

/**
 *
 * @param {*} reqPersona
 * @param {nombre, ocupacion} trabajaEnEscuela || null
 * @returns
 */
exports.recuperarOCrearPersona = async ({ reqPersona }) => {
    let persona = await Persona.findOne({
        numeroDocumento: reqPersona.numeroDocumento,
    });

    if (!persona) {
        // nueva persona
        persona = await new Persona({
            ...reqPersona,
        });
        await persona.save();
    }

    return persona;
};

/**
 * Crear Persona
 * @param {reqPersona} param
 * @returns
 */
exports.crearPersona = async ({ reqPersona }) => {
    const persona = await new Persona({
        ...reqPersona,
    });
    await persona.save();
    return persona;
};

/**
 * traer una persona por numero de documento
 * @param {numeroDocumento String}
 * @returns
 */
exports.traerPersonaPorNumeroDocumento = async ({ numeroDocumento }) => {
    return await Persona.findOne({
        numeroDocumento: numeroDocumento,
    });
};

/**
 *
 * @param {{id, reqPersona}} param0
 */
exports.actualizarPersona = async ({ id, reqPersona }) => {
    // encontrar persona, y actualizar
    await Persona.findOneAndUpdate(
        { _id: id },
        { $set: { ...reqPersona } },
        { new: true },
    );
};

exports.actualizarDomicilioLaboralPersona = async ({
    escuela: { codigoPostal, barrio, calle, numeroCalle },
    personaId,
    tipoAutoridadName,
}) => {
    return await Persona.findByIdAndUpdate(
        { _id: personaId },
        {
            $set: {
                ocupacion: tipoAutoridadName,
                domicilioLaboralLocalidad: "capital",
                domicilioLaboralCodigoPostal: codigoPostal,
                domicilioLaboralBarrio: barrio,
                domicilioLaboralCalle: calle,
                domicilioLaboralNumeroCalle: numeroCalle,
                domicilioLaboralPiso: null,
            },
        },
        { new: true },
    );
};

exports.validarDatosLaborales = ({ object }) => {
    if (!object) {
        return false;
    }
    const {
        domicilioLaboralLocalidad,
        domicilioLaboralProvincia,
        domicilioLaboralCodigoPostal,
        domicilioLaboralCalle,
    } = object;

    return !(
        domicilioLaboralLocalidad &&
        domicilioLaboralProvincia &&
        domicilioLaboralCodigoPostal &&
        domicilioLaboralCalle
    );
};
