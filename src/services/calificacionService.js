// models
const Calificacion = require("../models/Calificacion");

// services
const asignaturaService = require("../services/asignaturaService");

// System config
const { SystemConfig } = require("../config/system");

/**
 * Crear Calificacion
 * @param reqCalificacion
 * @returns {Promise<*>}
 * Se crea una calificacion nueva
 */
exports.crearCalificacion = async ({ reqCalificacion }) => {
  const calificacion = await new Calificacion({
    ...reqCalificacion,
  });
  await calificacion.save();
  return calificacion;
};

/**
 * Crear Calificacion
 * @param reqCalificacion
 * @returns {Promise<*>}
 * Se crea una calificacion nueva
 */
exports.editarCalificacion = async ({ id, reqCalificacion }) => {
  return await Calificacion.findByIdAndUpdate(
    { _id: id },
    { $set: { ...reqCalificacion } },
    { new: true }
  );
};

/**
 * Obtener una calificacion por id
 * @param {id} param0
 * @returns
 */
exports.obtenerCalificacionById = async ({ id }) => {
  return await Calificacion.findById({
    _id: id,
  }).populate({
    path: "alumno",
    select: ["persona"],
    populate: {
      path: "persona",
      select: ["nombres", "apellidos"],
    },
  });
};

/**
 * Obtener listado de calificaciones por trimestre de un alumno
 * @param {id} param0
 * @returns
 * [
    {
        "nombre": "NOMBRE",
        "primerTrimestre": "4.75",
        "segundoTrimestre": "9",
        "tercerTrimestre": "A"
    }
]
 */
exports.obtenerCalificacionesPorAlumno = async ({ id }) => {
  const calificacionesPorIdAlumno = await Calificacion.find({ alumno: id });

  // obtenemos diccionario
  const diccionarioDeNotasPorCalificacion =
    mapArrayCalificacionesToDiccionarioDeMaterias({
      calificaciones: calificacionesPorIdAlumno,
    });
  // Generando promediso de trimestres por materias
  return await generarPromediosPorTrimestresPorMateria({
    diccionario: diccionarioDeNotasPorCalificacion,
  });
};

/**
 * Convertimos las calificaciones en un diccionario donde las calificaciones de la misma materia seran acumuladas en un array
 * La key es el ID de la calificacion
 * El value es un array de {fecha, valor}
 * @param {calificaciones} param0
 * @returns
 */
const mapArrayCalificacionesToDiccionarioDeMaterias = ({ calificaciones }) => {
  return calificaciones.reduce((acu, element) => {
    const { valor, fecha } = element;
    const key = element.asignatura.toString();
    if (acu[key]) {
      acu[key].push({ valor, fecha });
    } else {
      acu[key] = [];
      acu[key].push({ valor, fecha });
    }
    return acu;
  }, {});
};

/**
 * Recibe array de valores y calcula el promedio
 * @param {valores} param0
 * @returns
 */
const calcularPromedio = ({ valores }) => {
  if (!valores.length) {
    return "-";
  }
  // calculamos la sumatoria de valores
  const promedio = valores.reduce((acu, value) => {
    return acu + Number(value);
  }, 0);

  // retornamos promedio
  return (promedio / valores.length).toFixed(2).toString();
};

/**
 * Recibe array de valores y calcula el promedio
 * @param {valores} param0
 * @returns
 */
const calcularPromedioFinal = ({
  primer_trimestre,
  segundo_trimestre,
  tercer_trimestre,
}) => {
  if (
    primer_trimestre === "-" ||
    segundo_trimestre === "-" ||
    tercer_trimestre === "-"
  ) {
    return "-";
  }
  // calculamos la sumatoria de valores
  const sumatoriaDeNotasFinales =
    Number(primer_trimestre) +
    Number(segundo_trimestre) +
    Number(tercer_trimestre);

  // retornamos promedio
  return (sumatoriaDeNotasFinales / 3).toFixed(2).toString();
};

/**
 * Recibe un diccionario KEY: id Calificacion , Value [{fecha, value}]
 * @param {diccionario} param0
 *
 */
const generarPromediosPorTrimestresPorMateria = async ({
  diccionario: diccionarioDeNotasPorCalificacion,
}) => {
  // Obtenemos las fechas seteadas por sistema
  const {
    first_date: firstStartDate,
    first_trimester_date: firstTrimesterEndDate,
    second_trimester_date: secondTrimesterEndDate,
    third_trimester_date: thirdTrimesterEndDate, // TODO: validar si es necesario
  } = SystemConfig.getConfig();

  const response = [];

  for (const key in diccionarioDeNotasPorCalificacion) {
    if (Object.hasOwnProperty.call(diccionarioDeNotasPorCalificacion, key)) {
      const asignatura = diccionarioDeNotasPorCalificacion[key];

      // obtenemos el nombre de la materia
      const a = await asignaturaService.obtenerMateriaPorID({
        id: key,
      });

      const {nombre} = a

      const obj = asignatura.reduce((acu, element) => {
        fechaElemento = new Date(element.fecha);
        if (
          !(
            acu["primerTrimestre"] &&
            acu["segundoTrimestre"] &&
            acu["tercerTrimestre"]
          )
        ) {
          acu["primerTrimestre"] = [];
          acu["segundoTrimestre"] = [];
          acu["tercerTrimestre"] = [];
        }
        if (
          fechaElemento >= firstStartDate &&
          fechaElemento < firstTrimesterEndDate
        ) {
          acu["primerTrimestre"].push(element.valor);
        }
        if (
          fechaElemento >= firstTrimesterEndDate &&
          fechaElemento < secondTrimesterEndDate
        ) {
          acu["segundoTrimestre"].push(element.valor);
        }
        // TODO: considerar la fecha de inicio del año siguente, para tener en cuenta las calificaciones de febrero, que corresponden al año anterior
        if (fechaElemento >= secondTrimesterEndDate) {
          acu["tercerTrimestre"].push(element.valor);
        }

        return acu;
      }, {});

      const primerTrimestre = calcularPromedio({
        valores: obj.primerTrimestre,
      });
      const segundoTrimestre = calcularPromedio({
        valores: obj.segundoTrimestre,
      });
      const tercerTrimestre = calcularPromedio({
        valores: obj.tercerTrimestre,
      });
      const notaFinal = calcularPromedioFinal({
        primer_trimestre: primerTrimestre,
        segundo_trimestre: segundoTrimestre,
        tercer_trimestre: tercerTrimestre,
      });
      response.push({
        nombre,
        primerTrimestre,
        segundoTrimestre,
        tercerTrimestre,
        notaFinal,
      });
    }
  }
  return response;
};

exports.obtenerCalificacionPorId = async ({ id }) => {
  return await Calificacion.findById(id);
};

exports.eliminarCalificacionPorId = async ({ id }) => {
  await Calificacion.findByIdAndDelete({ _id: id });
};

/**
 * Recibe una calificacion y la mapea para una mejor comprension de la misma, generando un nombre completo del alumno, dejando solo su ID y los demas datos de la calificacion
 * @param {calificacion} param0
 * @returns { asignatura, valor, ausente, fecha, nombreCompleto, alumno: id}
 */
exports.mapearCalificaciones = ({ calificacion }) => {
  console.log(calificacion);
  const { id, asignatura, valor, ausente, fecha, alumno } = calificacion;
  const { id: idAlumno } = alumno;
  const nombreCompleto = `${alumno.persona.apellidos}, ${alumno.persona.nombres}`;
  return {
    id,
    asignatura,
    valor,
    ausente,
    fecha,
    nombreCompleto,
    alumno: idAlumno,
  };
};
