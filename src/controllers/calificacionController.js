const calificacionService = require("../services/calificacionService");
const responseService = require("../services/responseService");
const { validationResult } = require("express-validator");

/**
 * Crear Calificacion
 * @returns
 */
 exports.crearCalificacion = async (req, res) => {
    const errores = validationResult(req); // validaciones
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    try {
        const response = await calificacionService.crearCalificacion({reqCalificacion: req.body});
        res.status(201).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * listar Calificacion por trimestre
 * @returns
 */
 exports.listarCalificacionesPorTrimestres = async (req, res) => {
    const errores = validationResult(req); // validaciones
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    try {
        const response = await calificacionService.obtenerCalificacionesPorAlumno({id: req.params.id});
        res.status(201).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};
