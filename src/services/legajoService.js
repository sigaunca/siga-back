// models
const Legajo = require("../models/Legajo");

// services
const { crearUsuario } = require("./usuarioService");
const {
    crearAlumno,
    traerAlumnoPorNumeroDocumentoSinThrow,
    actualizarAlumno,
} = require("./alumnoService");
const {
    crearAutoridadLegajo,
    actualizarAutoridadLegajo,
    crearAutoridad,
} = require("./autoridadService");
const {
    recuperarOCrearPersona,
    actualizarPersona,
    validarDatosLaborales,
} = require("./personaService");

// emails
const mailService = require("./mailService");
const config = require("config");

/**
 * Crear un nuevo legajo
 * @param { body: { alumno: { persona, procedenciaEscolar }, padre: { persona }, madre: { persona },tutor: { persona }} } req
 * @returns
 */
exports.crearLegajo = async ({
    body: {
        alumno: { persona: reqAlumno, procedenciaEscolar },
        padre: { persona: reqPadre },
        madre: { persona: reqMadre },
        tutor: { persona: reqTutor },
    },
}) => {
    // nuevo legajo
    const alumnoCreado = await crearAlumno({
        reqPersona: reqAlumno,
        procedenciaEscolar,
    });

    const createPadre = reqPadre
        ? await recuperarOCrearPersona({
              reqPersona: reqPadre,
          })
        : null;

    const createMadre = reqMadre
        ? await recuperarOCrearPersona({
              reqPersona: reqMadre,
          })
        : null;

    const createAutoridadTutor = await crearAutoridadLegajo({
        reqPersona: reqTutor,
        alumno: alumnoCreado,
    });

    const legajo = await new Legajo({
        alumno: alumnoCreado._id,
        padre: createPadre ? createPadre._id : null,
        madre: createMadre ? createMadre._id : null,
        tutor: createAutoridadTutor._id,
        archivado: false,
        curso: null,
    });

    // creamos usuario
    await crearUsuario({
        usuario: reqTutor.numeroDocumento,
        password: config.get('password_default'),
        autoridad: createAutoridadTutor._id,
        onlyCreateUser: true,
    });

    // envio de email
    await mailService.sendEmailUserAndPassword({
        email: reqTutor.contactoCorreo,
        user: reqTutor.numeroDocumento,
        password: config.get('password_default'),
    });

    await legajo.save();

    return legajo;
};

/**
 * Crear un nuevo legajo
 * @param { body: { alumno: { persona, procedenciaEscolar }, padre: { persona }, madre: { persona },tutor: { persona }}} req
 * @returns
 */
exports.editarLegajo = async ({
    params: { id: legajoId },
    body: {
        alumno: { persona: reqAlumno, procedenciaEscolar },
        padre: { persona: reqPadre },
        madre: { persona: reqMadre },
        tutor: { persona: reqTutor },
    },
}) => {
    // editar legajo
    let legajo = await this.obtenerLegajoById({ id: legajoId }); // Tiene throw

    // actualizar Alumno
    await actualizarAlumno({
        id: legajo.alumno._id,
        reqAlumno,
        procedenciaEscolar,
    });

    // actualizar Tutor
    await actualizarAutoridadLegajo({
        id: legajo.tutor._id,
        reqAutoridad: reqTutor,
    });

    // actualizar Padre
    await actualizarPersona({
        id: legajo.padre._id,
        reqPersona: reqPadre,
    });

    // actualizar Madre
    await actualizarPersona({
        id: legajo.madre._id,
        reqPersona: reqMadre,
    });

    // actualizar legajo

    legajo = await this.obtenerLegajoById({ id: legajoId });
    return legajo;
};

/**
 * Obtener legajos no archivados
 * @returns Legajos[]
 */
exports.obtenerLegajos = async ({ data = false }) => {
    return data == "true"
        ? Legajo.find({ archivado: false })
        .populate({
            path: "alumno",
            populate: {
                path: "persona",
            },
        })
        .populate({
            path: "padre",
        })
        .populate({
            path: "madre",
        })
        .populate({
            path: "tutor",
            populate: {
                path: "persona",
            },
        })
        .populate({
            path: "tutor",
            populate: {
                path: "persona",
            },
        })
        : Legajo.find({ archivado: false }).populate({
              path: "alumno",
              populate: { path: "persona" },
          });
};

/**
 * Obtener legajos archivados
 * @returns Legajos[]
 */
exports.obtenerLegajosArchivados = async ({ data = false }) => {
    return data == "true"
        ? Legajo.find({ archivado: true })
        .populate({
            path: "alumno",
            populate: {
                path: "persona",
            },
        })
        .populate({
            path: "padre",
        })
        .populate({
            path: "madre",
        })
        .populate({
            path: "tutor",
            populate: {
                path: "persona",
            },
        })
        .populate({
            path: "tutor",
            populate: {
                path: "persona",
            },
        })
        : Legajo.find({ archivado: true }).populate({
              path: "alumno",
              populate: { path: "persona" },
          });
};

/**
 *
 * @param {id: String} legajoId
 * @returns
 */
exports.obtenerLegajoById = async ({ id: legajoId, booleans = false }) => {
    let legajo = await Legajo.findById(legajoId)
        .populate({
            path: "alumno",
            populate: {
                path: "persona",
            },
        })
        .populate({
            path: "padre",
        })
        .populate({
            path: "madre",
        })
        .populate({
            path: "tutor",
            populate: {
                path: "persona",
            },
        })
        .populate({
            path: "tutor",
            populate: {
                path: "persona",
            },
        });

    if (!legajo) {
        throw Error("El legajo no se encuentra en nuestra base de datos.");
    }
    return booleans ? legajoConBooleanos({ legajo }) : legajo;
};

/**
 * Archivar un legajo por Id
 * @param {id: String} legajoId
 */
exports.archivarLegajo = async ({ id: legajoId }) => {
    let legajo = await Legajo.findOneAndUpdate(
        { _id: legajoId },
        { $set: { archivado: true } },
        { new: true },
    );

    if (!legajo) {
        throw Error("El legajo no se encuentra en nuestra base de datos.");
    }

    return legajo;
};

/**
 * Archivar un legajo por Id
 * @param {id: String} legajoId
 */
exports.activarLegajo = async ({ id: legajoId }) => {
    let legajo = await Legajo.findOneAndUpdate(
        { _id: legajoId },
        { $set: { archivado: false } },
        { new: true },
    );

    if (!legajo) {
        throw Error("El legajo no se encuentra en nuestra base de datos.");
    }

    return legajo;
};

/**
 * Recuperamos un legajo por el numero de documento del alumno
 * @param {numeroDocumento} param0
 * @returns
 */
exports.obtenerLegajosPorNumeroDocumento = async ({ numeroDocumento }) => {
    let alumnoEncontrado = await traerAlumnoPorNumeroDocumentoSinThrow({
        numeroDocumento,
    });

    if (!alumnoEncontrado) return null;

    let legajo = await Legajo.findOne({ alumno: alumnoEncontrado._id });

    if (!legajo) return null;

    return legajo;
};

const legajoConBooleanos = ({ legajo }) => {
    const {
        cursos,
        archivado,
        alumno,
        padre,
        madre,
        tutor,
        documentos,
        curso,
    } = legajo;

    const legajoFormater = {
        cursos,
        archivado,
        alumno,
        padre: asignacionBooleanos({ object: padre }),
        madre: asignacionBooleanos({ object: madre }),
        tutor: asignacionBooleanosTutor(tutor),
        documentos,
        curso,
    };

    return legajoFormater;
};

const asignacionBooleanos = ({ object }) => {
    const newObject = {
        sin_info_persona: !Boolean(object),
        sin_info_domicilio_laboral: validarDatosLaborales({ object }),
        persona: object,
    };

    return newObject;
};

const asignacionBooleanosTutor = ({ cursos, alumnos, _id, persona }) => {
    return {
        sin_info_persona: !Boolean(persona),
        sin_info_domicilio_laboral: validarDatosLaborales({ object: persona }),
        cursos,
        alumnos,
        _id,
        persona,
    };
};

/**
 * Recuperamos un legajo por el numero de documento del alumno
 * @param {numeroDocumento} param0
 * @returns
 */
exports.asignarCurso = async ({ legajo: legajoId, curso: cursoId }) => {
    return await Legajo.findByIdAndUpdate(
        { _id: legajoId },
        { $set: { curso: cursoId } },
        { new: true },
    );
};
