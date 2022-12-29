const Escuela = require("../models/Escuela");
const { crearEscuela } = require("../services/escuelaService");

// services
const responseService = require("../services/responseService");

exports.obtenerEscuelas = async (req, res) => {
    try {
        let escuelas = await Escuela.find();
        if (!escuelas) {
            return res.status(404).json({ msg: "No hay escuelas cargadas" });
        }
        res.status(200).json(escuelas);
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.crearEscuela = async (req, res) => {
    const reqEscuela = req.body;
    try {
        const escuelaCreada = await crearEscuela(reqEscuela);
        res.status(201).json(escuelaCreada);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};
