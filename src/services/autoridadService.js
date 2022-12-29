// models
const Autoridad = require("../models/Autoridad");
// services
const personaService = require("./personaService");
const autoridadTypeService = require("./autoridadTypeService");
const Alumno = require("../models/Alumno");
const { AutoridadHandler } = require("../handlers");
const AutoridadType = require("../models/AutoridadType");
const Persona = require("../models/Persona");
const Curso = require("../models/Curso");
// TODO: REVISAR SU USO
exports.crearAutoridadLegajo = async ({ reqPersona, alumno }) => {
  let autoridad = await this.traerAutoridadPorNumeroDocumentoSinThrow({
    numeroDocumento: reqPersona.numeroDocumento,
  });

  if (!autoridad) {
    const crearORecuperarPersona = await personaService.recuperarOCrearPersona({
      reqPersona,
    });

    // recuperamos tipo de autoridad TUTOR
    const tipoAutoridadTutor = await AutoridadType.findOne({
      tipoAutoridad: "Tutor",
    });
    // creamos autoridad
    autoridad = await this.crearAutoridad({
      persona: null,
      escuela: null,
      tipoAutoridad: tipoAutoridadTutor,
      personaRelacionada: crearORecuperarPersona._id,
      alumnos: [],
      cursos: [],
    });
    // autoridad = await new Autoridad({
    //     tipo: reqPersona.tipoAutoridad,
    //     persona: crearORecuperarPersona._id,
    // });

    // storage instanceof Array
    //     ? storage.push(autoridad)
    //     : await autoridad.save();
  }

  // validamos que no exista alumno en la autoridad
  const hayAlumnoEnAutoridad = autoridad.alumnos.indexOf(
    (e) => e._id === alumno._id
  );
  if (hayAlumnoEnAutoridad < 0) {
    autoridad.alumnos.push(alumno._id);
    await autoridad.save();
  }

  return autoridad;
};

/**
 *  Actualizar los datos personales de la autoridad
 * @param {{ id, reqAutoridad }} param0
 */
exports.actualizarAutoridadLegajo = async ({ id, reqAutoridad }) => {
  const autoridad = await Autoridad.findById({ _id: id });
  await personaService.actualizarPersona({
    id: autoridad.persona,
    reqPersona: reqAutoridad,
  });
};

/**
 * Recupera autoridad por numero de documento sin throw error
 * @param {numeroDocumento} param0
 * @returns
 */
exports.traerAutoridadPorNumeroDocumentoSinThrow = async ({
  numeroDocumento,
}) => {
  let persona = await personaService.traerPersonaPorNumeroDocumento({
    numeroDocumento,
  });

  if (!persona) return null;

  let autoridad = await Autoridad.findOne({
    persona: persona._id,
  }).populate({
    path: "persona",
  });

  if (!autoridad) return null;

  return autoridad;
};
// TODO: REVISAR SU USO
const actualizarAlumnos = async (autoridad, alumnos = []) => {
  alumnos.forEach((nuevoAlumno) => {
    const found = autoridad.alumnos.indexOf((alumno) => alumno === nuevoAlumno);
    if (!found) {
      autoridad.alumnos.push(nuevoAlumno);
    }
  });

  return await Autoridad.findOneAndUpdate(
    { _id: autoridad._id },
    { $set: { alumnos: autoridad.alumnos } },
    { new: true }
  );
};
// TODO: REVISAR SU USO
const actualizarCursos = async (autoridad, cursos = []) => {
  cursos.forEach((nuevoCurso) => {
    const found = autoridad.cursos.indexOf((curso) => curso === nuevoCurso);
    if (!found) {
      autoridad.cursos.push(nuevoCurso);
    }
  });

  return await Autoridad.findOneAndUpdate(
    { _id: autoridad._id },
    { $set: { cursos: autoridad.cursos } },
    { new: true }
  );
};

exports.crearAutoridad = async ({
  tipoAutoridad: tipoAutoridadData, // desde middleware
  persona: reqPersona,
  personaRelacionada: personaId,
  alumnos = [],
  cursos = [],
  escuela, // desde middle
}) => {
  const { tipoAutoridad: tipoAutoridadName } = tipoAutoridadData;

  let autoridadFound = null;
  if (reqPersona) {
    autoridadFound = await this.traerAutoridadPorNumeroDocumentoSinThrow({
      numeroDocumento: reqPersona.numeroDocumento,
    });
  }

  if (autoridadFound) {
    throw new Error(
      `La persona con numero de documento: ${reqPersona.numeroDocumento} ya corresponde a una autoridad en la base de datos.`
    );
  }
  // validar si la persona ya existe y recuperarla
  // crearPersona

  let personaCompleta = null;
  if (escuela && reqPersona && tipoAutoridadName !== "Tutor") {
    const personaFind = await personaService.traerPersonaPorNumeroDocumento({
      numeroDocumento: reqPersona.numeroDocumento,
    });
    if (!personaFind) {
      // si no existe la persona, creamos una persona con el domicilio escolar como laboral
      personaCompleta = pushDomicilioLaboralEnPersona({
        escuela,
        persona: reqPersona,
        tipoAutoridadName,
      });
      personaCompleta = await personaService.crearPersona({
        reqPersona: personaCompleta,
      });
    } else {
      // si existe la persona, debemos actualizar su domicilio laboral
      personaCompleta = await personaService.actualizarDomicilioLaboralPersona({
        escuela,
        personaId: personaFind._id,
        tipoAutoridadName,
      });
    }
  }

  const autoridad = await AutoridadHandler.autoridadFactoryCreate({
    actionKey: tipoAutoridadName,
    tipoAutoridadData,
    personaId: personaId ? personaId : personaCompleta._id,
    cursos,
    alumnos,
    escuelaId: escuela ? escuela._id : null,
  });

  return autoridad;
};

const pushDomicilioLaboralEnPersona = ({
  escuela: { codigoPostal, barrio, calle, numeroCalle },
  persona,
  tipoAutoridadName,
}) => {
  const object = {
    ...persona,
    ocupacion: tipoAutoridadName,
    domicilioLaboralLocalidad: "capital",
    domicilioLaboralCodigoPostal: codigoPostal,
    domicilioLaboralBarrio: barrio,
    domicilioLaboralCalle: calle,
    domicilioLaboralNumeroCalle: numeroCalle,
    domicilioLaboralPiso: null,
  };
  return object;
};

exports.crearAutoridadDesdePersona = async (personaId, alumnos) => {
  const personaFound = await Persona.findById(personaId);
  if (!personaFound) {
    throw new Error(
      "Para crear un tutor, la persona tiene que existir en la base de datos, asegurese que la persona pertenece a un legajo."
    );
  }

  let autoridad = await this.traerAutoridadPorNumeroDocumentoSinThrow(
    personaFound.numeroDocumento
  );

  if (!autoridad) {
    autoridad = AutoridadHandler.autoridadFactoryCreate(
      tipoAutoridadFound.tipoAutoridad,
      tipoAutoridadFound,
      personaFound._id,
      null,
      alumnos
    );
  } else {
    // TODO: actualizar alumnos
    autoridad = actualizarAlumnos(autoridad, alumnos);
  }
  return autoridad;
};

/**
 * Recuperamos un legajo por el numero de documento del alumno
 * @param {numeroDocumento} param0
 * @returns
 */
exports.asignarCurso = async ({ autoridad: autoridadId, curso: cursoId }) => {
  const autoridad = await Autoridad.findById({ _id: autoridadId });

  if (!autoridad) {
    throw new Error("No existe la autoridad en nuestros registros.");
  }

  const cursoValido = await Curso.findById({ _id: cursoId });

  if (!cursoValido) {
    throw new Error("No existe el curso en nuestros registros.");
  }

  const { cursos } = autoridad;

  const existeCurso = cursos.find((e) => e.toString() === cursoId);

  if (!existeCurso) {
    cursos.push(cursoId);
  }

  return await Autoridad.findByIdAndUpdate(
    { _id: autoridadId },
    { $set: { cursos } },
    { new: true }
  );
};

exports.traerPorDNI = async ({
  numero_documento: numeroDocumento,
  tipo_autoridad_name: tipoAutoridadName,
}) => {
  if (!Number(numeroDocumento))
    throw new Error(
      `'${numeroDocumento}' no es un numero de documento valido.`
    );

  const tipoAutoridad =
    await autoridadTypeService.encontrarTipoDeAutoridadPorNombre({
      tipo_autoridad_name: tipoAutoridadName,
    });

  const idTipoAutoridad = tipoAutoridad.id.toString();

  const autoridades = await Autoridad.find()
    .populate({
      path: "persona",
    })
    .populate({
      path: "tipo",
    });

  const autoridadEncontrada = autoridades.filter(
    (e) =>
      e?.tipo?.id?.toString() == idTipoAutoridad &&
      e?.persona?.numeroDocumento == numeroDocumento
  );

  if (!autoridadEncontrada.length)
    throw new Error(
      `No existe una autoridad tipo: '${tipoAutoridadName}' con el documento: '${numeroDocumento}' en nuestros registros.`
    );

  return { msg: "Busqueda por DNI", data: autoridadEncontrada };
};

exports.traerAutoridadPorCoincidenciaEnNombre = async ({
  cadena,
  tipo_autoridad_name: tipoAutoridadName,
}) => {
  const tipoAutoridad =
    await autoridadTypeService.encontrarTipoDeAutoridadPorNombre({
      tipo_autoridad_name: tipoAutoridadName,
    });

  const idTipoAutoridad = tipoAutoridad.id.toString();

  const autoridades = await Autoridad.find()
    .populate({
      path: "persona",
    })
    .populate({
      path: "tipo",
    });

  const autoridadEncontrada = autoridades.filter(
    (e) =>
      e?.tipo?.id?.toString() == idTipoAutoridad &&
      cadenaIncluidaEnNombreYApellido({
        nombres: e?.persona?.nombres,
        apellidos: e?.persona?.apellidos,
        cadena,
      })
  );

  return autoridadEncontrada;
};

const cadenaIncluidaEnNombreYApellido = ({
  nombres = "",
  apellidos = "",
  cadena,
}) => {
  const nuevaCadena = `${apellidos}, ${nombres}`;
  return nuevaCadena.includes(cadena);
};
