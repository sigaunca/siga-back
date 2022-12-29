const Alumno = require("../models/Alumno");
const { validationResult } = require("express-validator");
const Persona = require("../models/Persona");
const { obtenerPersonaById } = require("./personaController");
const Legajo = require("../models/Legajo");
const Curso = require("../models/Curso");
const Inasistencia = require("../models/Inasistencia");
const { traerAlumnoPorNumeroDocumento } = require("../services/alumnoService");
/*
TODO: DREPECADE
*/
exports.crearAlumno = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { numeroDocumento, curso } = req.body;
    try {
        let persona = await Persona.findOne({ numeroDocumento });
        if (!persona) {
            return res
                .status(400)
                .json({ msg: "El numeroDocumento no existe" });
        }
        await persona.save();
        let alumno = new Alumno({ persona });
        let legajo = new Legajo({ alumno: alumno._id, curso: curso });
        await legajo.save();
        const alumnoCreado = await alumno.save();
        const response = { alumnoCreado, legajo };
        res.status(200).json({ response });
    } catch (error) {
        res.status(400).send("Hubo un error");
    }
};

exports.actualizarAlumno = async (req, res) => {};

exports.eliminarAlumno = async (req, res) => {};

exports.obtenerAlumnos = async (req, res) => {
    try {
        let alumnos = await Alumno.find().populate("persona");
        if (!alumnos) {
            return res.status(404).json({ msg: "No hay alumnos cargados" });
        }
        return res.status(200).json(alumnos);
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.obtenerAlumnoById = async (req, res) => {
    try {
        let alumno = await Alumno.findById(req.params.id).populate("persona");
        if (!alumno) {
            return res.status(404).json({ msg: "El alumno no existe" });
        }
        res.status(200).json(alumno);
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.obtenerAlumnosByCurso = async (req, res) => {
    try {
        let legajos = await Legajo.find({ curso: req.params.id }).populate({
            path: "alumno",
            populate: { path: "persona" },
        });
        if (!legajos) {
            return res.status(404).json({ msg: "Alumnos no encontrados" });
        }
        let curso = await Curso.findById(req.params.id).populate("preceptor");
        res.status(200).json({ alumnos: legajos, curso });
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.obtenerAlumnoByNumeroDocumento = async (req, res) => {
    try {
        let alumno = await traerAlumnoPorNumeroDocumento(
            req.params.numeroDocumento,
        );
        res.status(200).json({ alumno });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};
