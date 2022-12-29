const Asignatura = require("../models/Asignatura");
const Autoridad = require("../models/Autoridad");
const Curso = require("../models/Curso");
const responseService = require("../services/responseService");

exports.crearAsignatura = async (req, res) => {
    const {nombre, curso: cursoId, profesor: autoridadId} = req.body;
    try {

        // pusheamos curso al profesor
        // Validamos existencia del profesor, y obtenemos el array de cursos de su modelo, para actualizarlo
        const existeProfesor = await Autoridad.findById({_id: autoridadId});

        if (!existeProfesor) throw new Error("No existe el profesor en nuestros registros.");

        // Validamos existencia del curso
        const existeCurso = await Curso.findById({_id: cursoId})

        if (!existeCurso) throw new Error("No existe el curso en nuestros registros.");

        const {cursos} = existeProfesor;

        const cursoEncontrado = cursos.find(e => e.toString() === cursoId);
        if (!cursoEncontrado) {
            cursos.push(cursoId);
        }

        await Autoridad.findByIdAndUpdate({_id: autoridadId},{$set: {cursos}});

        const asignatura = new Asignatura({nombre, curso: cursoId, profesor: autoridadId});
        await asignatura.save();

        res.status(201).json(asignatura);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.actualizarAsignatura = async (req, res) => {    
    const {nombre, curso, profesor} = req.body;
    try {
        let asignatura = await Asignatura.findById({ _id: req.params.id });
        if (!asignatura) {
            throw new Error("No existe la asignatura en nuestra base de datos.");
        }
    
        asignatura = await Asignatura.findOneAndUpdate(
            { _id: req.params.id },
            { $set: {nombre, curso, profesor} },
            { new: true },
        );

        res.json(asignatura);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.eliminarAsignatura = async (req, res) => {
    try {
        let asignatura = await Asignatura.findById({ _id: req.params.id });
    if (!asignatura) {
        throw new Error("No existe la asignatura en nuestra base de datos.");
    }
    await Asignatura.findOneAndRemove({ _id: req.params.id });
        res.status(200).json(asignatura);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerAsignaturas = async (req, res) => {
    try {
        let asignaturas = await Asignatura.find()
    .populate("curso")
    .populate({
        path: "profesor",
        populate: { path: "persona" },
    });
        return res.status(200).json(asignaturas);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerAsignaturaById = async (req, res) => {
    try {
        let asignatura = await Asignatura.findById({ _id: req.params.id })
        .populate("curso")
        .populate({
            path: "profesor",
            populate: { path: "persona" },
        });
    if (!asignatura) throw new Error("No existe la asignatura en nuestra base de datos.");
        res.status(200).json(asignatura);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerAsignaturasByAutoridad = async (req, res) => {
    try {
        let asignaturas = await Asignatura.find({ profesor: req.params.id })
        .populate("curso")
        .populate({
            path: "profesor",
            populate: { path: "persona" },
        });
        if (!asignaturas) {
            return []
            // throw new Error("La autoridad no posee cursos asignados.");
        }
        res.status(200).json(asignaturas);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerAsignaturasByCurso = async (req, res) => {
    try {
        let asignaturas = await Asignatura.find({ curso: req.params.id })
        .populate("curso")
        .populate({
            path: "profesor",
            populate: { path: "persona" },
        });
        if (!asignaturas) {
            return []
            // throw new Error("La autoridad no posee cursos asignados.");
        }
        res.status(200).json(asignaturas);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};