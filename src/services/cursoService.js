const Curso = require("../models/Curso");

/**
 * crear curso nuevo
 * @param { escuela, preceptor, nivel, anio, seccion, turno, asistenciaEstado}
 * @returns Curso
 */
exports.crearCurso = async ({
    escuela,
    preceptor,
    nivel,
    anio,
    seccion,
    turno,
    asistenciaEstado,
}) => {
    const curso = await new Curso({
        escuela,
        preceptor,
        nivel,
        anio,
        seccion,
        turno,
        asistenciaEstado,
    });
    await curso.save();
    return curso;
};

/**
 * obtener curso por id
 * @param {id string}
 * @returns
 */
exports.obtenerCursoById = async ({ id }) => {
    const curso = await Curso.findById({ _id: id })
        .populate("escuela")
        .populate({
            path: "preceptor",
            populate: { path: "persona" },
        });
    if (!curso) throw new Error("No existe el curso en nuestra base de datos.");
    return curso;
};

/**
 * obtener todos los cursos
 * @returns Curso[]
 */
exports.obtenerCursos = async () => {
    const curso = await Curso.find()
        .populate("escuela")
        .populate({
            path: "preceptor",
            populate: { path: "persona" },
        });
    return curso;
};

/**
 * obtener todos los cursos
 * @returns Curso[]
 */
exports.actualizarCurso = async ({ id, reqCurso }) => {
    let curso = await Curso.findById({ _id: id });
    if (!curso) {
        throw new Error("No existe el curso en nuestra base de datos.");
    }

    curso = await Curso.findOneAndUpdate(
        { _id: id },
        { $set: { ...reqCurso } },
        { new: true },
    );

    return curso;
};

/**
 * eliminar un curso
 * @returns Curso[]
 */
exports.eliminarCurso = async ({ id }) => {
    const curso = await Curso.findById({ _id: id });
    if (!curso) {
        throw new Error("No existe el curso en nuestra base de datos.");
    }
    await Curso.findOneAndRemove({ _id: id });
    return curso;
};

/**
 * obtener un curso por el ID de la autoridad
 * @returns Curso[]
 */
exports.obtenerCursosByAutoridad = async ({ id }) => {
    const curso = await Curso.find({ preceptor: id })
    // .populate({
    //     path: "preceptor",
    //     populate: { path: "persona" },
    // });
    if (!curso) {
        return []
        // throw new Error("La autoridad no posee cursos asignados.");
    }
    return curso;
};
