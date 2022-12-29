const responseService = require("../services/responseService");

const AutoridadType = require("../models/AutoridadType");

module.exports = async function (req, res, next) {
    const { tipoAutoridad: tipoAutoridadID } = req.body;

    if (!tipoAutoridadID) next();
    // se valida el tipo de autoridad TODO: middlew
    const tipoAutoridadFound = await AutoridadType.findById({
        _id: tipoAutoridadID,
    });

    if (!tipoAutoridadFound) {
        return res
            .status(400)
            .json(
                responseService.crearBadResponse(
                    400,
                    "El tipo de autoridad ingresado no se encuentra en la base de datos.",
                ),
            );
    }
    req.body.tipoAutoridad = tipoAutoridadFound;

    next();
};
