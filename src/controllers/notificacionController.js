const Evento = require("../models/Evento");
const Notificacion = require("../models/Notificacion");
const responseService = require("../services/responseService");

exports.obtenerNotificacionesByAlumno = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find({ alumno: req.params.id }).populate('evento')
        const response = {notificaciones, not_leidas: notificaciones.filter(not => !not.leida)}
        res.status(200).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.obtenerNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.find()
        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.eliminarNotificacionByEvento = async (req, res) => {
    try {
        let notificaciones = await Notificacion.find({evento: req.params.id});
    if (!notificaciones) {
        throw new Error("No existen notificaciones con ese evento en nuestra base de datos.");
    }
    notificaciones.map(async notificacion => {
        await Notificacion.findOneAndRemove({ _id: notificacion._id });
    })
   
    res.status(200);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.marcarLeida = async (req, res) => {
    try {
        let notificacion = await Notificacion.findById(req.params.id);
        if (!notificacion) {
            return res.status(404).json({ msg: "Notificacion no encontrada" });
        }
        notificacion.leida = !notificacion.leida;
        notificacion = await Notificacion.findOneAndUpdate(
            { _id: req.params.id },
            { $set: notificacion },
            { new: true },
        );
        res.json({ notificacion });
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
}