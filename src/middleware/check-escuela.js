const responseService = require("../services/responseService");

const Escuela = require("../models/Escuela");

module.exports = async function (req, res, next) {
    const { escuela: escuelaId } = req.body;

    if (!escuelaId) next();
    // se valida el tipo de autoridad TODO: middlew
    const tipoAutoridadFound = await Escuela.findById({
        _id: escuelaId,
    });

    if (!tipoAutoridadFound) {
        res.status(400).json(
            responseService.crearBadResponse(
                "La escuela ingresada no se encuentra en la base de datos.",
            ),
        );
    }
    req.body.escuela = tipoAutoridadFound;
    next();
};
