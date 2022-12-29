const { validationResult } = require("express-validator");

// services
const legajoService = require("../services/legajoService");
const responseService = require("../services/responseService");

/**
 * Crear legajo
 * @returns
 */
exports.crearLegajo = async (req, res) => {
    const errores = validationResult(req); // validaciones
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const response = await legajoService.crearLegajo(req);
        res.status(201).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Editar legajo
 * @returns
 */
exports.editarLegajo = async (req, res) => {
    const errores = validationResult(req); // validaciones
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    try {
        const response = await legajoService.editarLegajo(req);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Obtener legajos no archivados
 * @returns
 */
exports.obtenerLegajos = async (req, res) => {
    const { data } = req.query;
    try {
        let response = await legajoService.obtenerLegajos({ data });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Obtener legajos Archivados
 * @returns
 */
exports.obtenerLegajosArchivados = async (req, res) => {
    const { data } = req.query;
    try {
        let response = await legajoService.obtenerLegajosArchivados({ data });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Obtener un legajo - id
 * @returns
 */
exports.obtenerLegajoById = async (req, res) => {
    try {
        let response = await legajoService.obtenerLegajoById({
            id: req.params.id,
            booleans: true,
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Archivar un legajo - id
 * @returns
 */
exports.archivarLegajo = async (req, res) => {
    try {
        const response = await legajoService.archivarLegajo({
            id: req.params.id,
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Activar un legajo - id
 * @returns
 */
exports.activarLegajo = async (req, res) => {
    try {
        const response = await legajoService.activarLegajo({
            id: req.params.id,
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

/**
 * Asociar Curso a un legajo
 * @returns
 */
exports.asignarCurso = async (req, res) => {
    try {
        const response = await legajoService.asignarCurso(req.body);
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};
