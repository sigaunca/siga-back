const { validationResult } = require("express-validator");
const listadoCalificacionService = require("../services/listadoDeCalificacionService");
const responseService = require("../services/responseService");

/**
 * Crear Listado de Calificaciones
 * @returns
 */
exports.crearListadoCalificacion = async (req, res) => {
  const errores = validationResult(req); // validaciones
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  try {
    const {
      body,
      query: { validate = false },
    } = req;
    const response = await listadoCalificacionService.crearListado({
      reqListado: body,
      validate: Boolean(validate),
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(400).send(responseService.crearBadResponse(error.message));
  }
};

exports.obtenerListados = async (req, res) => {
  try {
    const response = await listadoCalificacionService.obtenerListados();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(responseService.crearBadResponse(error.message));
  }
};

exports.obtenerListadoById = async (req, res) => {
  try {
    const response = await listadoCalificacionService.obtenerListadoById({
      id: req.params.id,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(responseService.crearBadResponse(error.message));
  }
};

exports.actualizarListadoById = async (req, res) => {
  try {
    const { body } = req;
    const response = await listadoCalificacionService.editarListadosById({
      id: req.params.id,
      listado: body,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(responseService.crearBadResponse(error.message));
  }
};

exports.obtenerListadosByAsignaturaId = async (req, res) => {
  try {
    const response =
      await listadoCalificacionService.obtenerListadosByAsignaturaId({
        id: req.params.id,
      });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(responseService.crearBadResponse(error.message));
  }
};

exports.eliminarListado = async (req, res) => {
  try {
    const response = await listadoCalificacionService.eliminarListado({
      id: req.params.id,
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).send(responseService.crearBadResponse(error.message));
  }
};
