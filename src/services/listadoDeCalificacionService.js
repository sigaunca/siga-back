// models
const ListadoDeCalificacion = require("../models/ListadoCalificaciones");

// services
const calificacionesServices = require("../services/calificacionService");
const asignaturaServices = require("../services/asignaturaService");
const { SystemConfig } = require("../config/system");
const { ordenamientoDescendente } = require("../utils/utilities");

/**
 * Crear listado calificaciones
 * @param reqListado
 * @returns {Promise<*>}
 * Se crea un listado de calificaciones y cada una de las nuevas calificaciones que llegan en el array calificaciones
 */
exports.crearListado = async ({ reqListado, validate }) => {
  // array de nuevas calificaciones
  const calificacionesIds = [];
  const existeAsignatura = await asignaturaServices.obtenerMateriaPorID({
    id: reqListado.asignatura,
  });
  if (!existeAsignatura) {
    throw new Error("No existe la asignatura.");
  }
  const { calificaciones = [], fecha, concepto, asignatura } = reqListado;

  // Validacion de fecha si llega param
  // Obtenemos el rango actual segun la fecha de hoy
  const current_date = new Date();
  const { first_date_limit, second_date_limit } =
    SystemConfig.getCurrentLimitDate({ current_date: new Date(fecha) });

  const validate_date = new Date(fecha);
  if (
    validate &&
    !(validate_date >= first_date_limit && validate_date < second_date_limit)
  ) {
    throw new Error("No se puede cargar una fecha fuera del trimestre actual.");
  }

  if (calificaciones.length) {
    for (const calificacion of calificaciones) {
      const reqCalificacion = {
        ...calificacion,
        fecha,
        asignatura,
      };
      const nuevaCalificacion = await calificacionesServices.crearCalificacion({
        reqCalificacion,
      });
      // push nuevo id
      calificacionesIds.push(nuevaCalificacion.id);
    }
  }
  // creando listado
  const listado = {
    concepto,
    fecha,
    calificaciones: calificacionesIds,
  };
  return await crearListadoCalificaciones({ listado });
};

crearListadoCalificaciones = async ({ listado }) => {
  const litadoDeCalificacion = await new ListadoDeCalificacion({
    ...listado,
  });
  await litadoDeCalificacion.save();
  return litadoDeCalificacion;
};

exports.obtenerListados = async () => {
  const listadosDeCalificaciones = await ListadoDeCalificacion.find();

  // promise
  const Promiselistado = listadosDeCalificaciones.map(async (listado) => {
    return await mapearListadoConCalificaciones({ listado });
  });
  // promise all
  const response = await Promise.all(Promiselistado);
  // return
  return response;
};

/**
 * Recibe id de asignatura y retorna todos los listados de calificaciones de esa asignatura
 * @param {id} param0
 * @returns
 */
exports.obtenerListadosByAsignaturaId = async ({ id }) => {
  const listados = await this.obtenerListados();
  const listadosFiltrados = listados.filter((listado) => {
    const encontrarAsignatura = listado.calificaciones.find(
      (element) => element.asignatura.toString() === id
    );
    if (encontrarAsignatura) {
      return listado;
    }
    return null;
  });
  console.log(listadosFiltrados);
  const listadosMapeados = listadosFiltrados.map((listado) => {
    // mapeamos las calificaiones para obtener por cada una, asignatura, valor, ausente, fecha, nombreCompleto y alumno (id)
    const listadoMapeado = listado.calificaciones.map((calificacion) => {
      // Para mapear una calificacion, se emplea el servicio de calificaciones
      return calificacionesServices.mapearCalificaciones({ calificacion });
    });

    return {
      ...listado,
      calificaciones: listadoMapeado.sort((a, b) =>
        ordenamientoDescendente(a.nombreCompleto, b.nombreCompleto)
      ),
    };
  });

  return listadosMapeados;
};

/**
 * Recibe id de asignatura y retorna todos los listados de calificaciones de esa asignatura
 * @param {id} param0
 * @returns
 */
exports.obtenerListadoById = async ({ id }) => {
  const listadoEncontrado = await ListadoDeCalificacion.findById(id);
  if (!listadoEncontrado) {
    throw new Error("No existe el listado en nuestros registros.");
  }

  const listadoMapeado = await mapearListadoConCalificaciones({
    listado: listadoEncontrado,
  });

  // mapeamos las calificaiones para obtener por cada una, asignatura, valor, ausente, fecha, nombreCompleto y alumno (id)
  const calificacionesMapeadas = listadoMapeado.calificaciones.map(
    (calificacion) => {
      // Para mapear una calificacion, se emplea el servicio de calificaciones
      return calificacionesServices.mapearCalificaciones({ calificacion });
    }
  );

  const listadoResponse = {
    ...listadoMapeado,
    calificaciones: calificacionesMapeadas.sort((a, b) =>
      ordenamientoDescendente(a.nombreCompleto, b.nombreCompleto)
    ),
  };

  return listadoResponse;
};

/**
 * Editar un listado y sus calificaciones
 * @param {*} param0 
 * @returns 
 */
exports.editarListadosById = async ({ listado, id: idListado }) => {
  const { calificaciones, fecha, concepto, asignatura } = listado; // TODO: validar si se edita asignatura

  // validamos si existe la nueva asignatura a la que pertenecera el listado
  const asignaturaEncontrada = asignaturaServices.obtenerMateriaPorID({id: asignatura})
  if(!asignaturaEncontrada) {
    throw new Error("No existe la asignatura en nuestro registros.")
  }
  // editamos las cada calificacion del array
  const promiseEditarCalificaciones = calificaciones.map(
    async (calificacion) => {
      const { id, valor, ausente } = calificacion;
      return await calificacionesServices.editarCalificacion({
        id,
        reqCalificacion: { valor, ausente, fecha , asignatura },
      });
    }
  );
  // se usa Promise.all para permitir un map asincrono 
  const calificacionesEditadas = await Promise.all(promiseEditarCalificaciones);
  // preparamos el array de id strings
  const arrayCalificacionesId = [];
  calificacionesEditadas.forEach((calificacion) =>
    arrayCalificacionesId.push(calificacion.id.toString())
  );
  // editamos el listado y retornamos
  return await editarListado({ id: idListado, calificaciones: arrayCalificacionesId, fecha, concepto, asignatura });
};

async function editarListado({ id: idListado, calificaciones, fecha, concepto, asignatura }) {
  return await ListadoDeCalificacion.findByIdAndUpdate(
    { _id: idListado },
    { $set: { calificaciones, fecha, concepto, asignatura } },
    { new: true }
  );
}

/**
 * Recibe un listado de calificaciones puro, se mapea su data
 * Por cada ID de calificaciones, se recupera el objeto Calificacion
 * Recordemos que un listado tiene id, concepto, fecha, calificaciones: [id, id, id]
 *
 * Retorna {id, concepto, fecha, calificaciones : [{asignatura, valor, ausente, fecha, nombreCompleto, alumno}]}
 * @param {listado} param0
 * @returns {id, concepto, fecha, listadoCalificaciones}
 */
async function mapearListadoConCalificaciones({ listado }) {
  const { calificaciones, fecha, concepto, id } = listado;
  // calificaciones a mostrar
  const listaCalificaciones = [];
  if (calificaciones.length) {
    for (const id of calificaciones) {
      listaCalificaciones.push(
        await calificacionesServices.obtenerCalificacionById({ id })
      );
    }
  }
  return {
    id,
    concepto,
    fecha,
    calificaciones: listaCalificaciones,
  };
}

/**
 * Recibe id de asignatura y retorna todos los listados de calificaciones de esa asignatura
 * @param {id} param0
 * @returns
 */
exports.eliminarListado = async ({ id }) => {
  const listado = await ListadoDeCalificacion.findById(id);

  if (!listado) {
    throw new Error(
      "El listado que desea eliminar no se encuentra en nuestros registros"
    );
  }

  listado.calificaciones.forEach((idCalificacion) => {
    calificacionesServices.eliminarCalificacionPorId({
      id: idCalificacion.toString(),
    });
  });

  await ListadoDeCalificacion.findByIdAndDelete({ _id: id });

  return { msg: "Listado eliminado con exito", data: listado };
};
