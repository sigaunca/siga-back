const Persona = require("../models/Persona");
const {
    traerPersonaPorNumeroDocumento,
} = require("../services/personaService");

exports.obtenerPersonaById = async (id) => {
    try {
        let persona = await Persona.findById(id);
        if (!persona) {
            return { msg: "La persona no existe" };
        }
        return persona;
    } catch (error) {
        return { msg: "Hubo un error" };
    }
};

exports.obtenerPersonaByNumeroDocumento = async (req, res) => {
    try {
        let persona = await traerPersonaPorNumeroDocumento(
            req.params.numeroDocumento,
        );
        res.status(200).json({ persona });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
