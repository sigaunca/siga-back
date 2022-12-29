const { validationResult } = require("express-validator");
const Escuela = require("../models/Escuela");
const Curso = require("../models/Curso");
// service
const cursoService = require("../services/cursoService");
const responseService = require("../services/responseService");

exports.crearCurso = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        let curso = await cursoService.crearCurso(req.body);

        res.status(201).json(curso);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.actualizarCurso = async (req, res) => {
    try {
        let curso = await cursoService.actualizarCurso({
            id: req.params.id,
            reqCurso: req.body,
        });

        res.json(curso);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.eliminarCurso = async (req, res) => {
    try {
        let curso = await cursoService.eliminarCurso({ id: req.params.id });
        res.status(200).json(curso);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerCursos = async (req, res) => {
    try {
        let cursos = await cursoService.obtenerCursos();
        return res.status(200).json(cursos);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerCursoById = async (req, res) => {
    try {
        let curso = await cursoService.obtenerCursoById({ id: req.params.id });
        res.status(200).json(curso);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerCursosByAutoridad = async (req, res) => {
    try {
        let cursos = await cursoService.obtenerCursosByAutoridad({
            id: req.params.id,
        });
        res.status(200).json(cursos);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

