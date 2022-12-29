const Asignatura = require("../models/Asignatura");

exports.obtenerMateriaPorID = async ({ id }) => await Asignatura.findById({_id: id},{nombre: 1, curso: 1, profesor: 1});
