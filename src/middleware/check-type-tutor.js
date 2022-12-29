const AutoridadType = require("../models/AutoridadType");
const responseService = require("../services/responseService");

exports.checkTutorExist = async (req, res, next) => {
    try {
        const autoridadTypeTutor = await AutoridadType.findOne({
            tipoAutoridad: "Tutor",
        });

        if (!autoridadTypeTutor) {
            throw new Error("Debe crear el tipo de autoridad 'Tutor'.");
        }
        next();
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};
