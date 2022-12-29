const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// services
const userService = require("../services/usuarioService");
const responseService = require("../services/responseService");

exports.crearUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { usuario, password, autoridad } = req.body;
    try {
        const response = await userService.crearUsuario({
            autoridad,
            usuario,
            password,
        });

        res.status(201).json(response);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};

exports.actualizarUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { usuario, password, autoridad } = req.body;
    const nuevoUsuario = {};
    if (usuario) {
        nuevoUsuario.usuario = usuario;
    }
    if (password) {
        const salt = await bcryptjs.genSalt(10);
        nuevoUsuario.password = await bcryptjs.hash(password, salt);
    }
    if (autoridad) {
        nuevoUsuario.autoridad = autoridad;
    }
    try {
        let user = await Usuario.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        user = await Usuario.findOneAndUpdate(
            { _id: req.params.id },
            { $set: nuevoUsuario },
            { new: true },
        );
        user.password = "*********"
        res.json({ user });
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        let user = await Usuario.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        await Usuario.findOneAndRemove({ _id: req.params.id });
        res.status(200).json({ msg: "Usuario eliminado" });
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.obtenerUsuarios = async (req, res) => {
    try {
        let usuarios = await Usuario.find().populate({
            path: "autoridad",
            populate: [{ path: "persona" }, { path: "tipo" }],
        });
        if (!usuarios) {
            return res.status(404).json({ msg: "No hay usuarios cargados" });
        }
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).send("Hubo un error");
    }
};

exports.obtenerUsuarioById = async (req, res) => {
    try {
        const curso = await Usuario.findById({ _id: req.params.id }).populate({
            path: "autoridad",
            populate: [{ path: "persona" }, { path: "tipo" }],
        });
        if (!curso)
            throw new Error("No existe el usuario en nuestra base de datos.");
        res.status(200).json(curso);
    } catch (error) {
        res.status(400).send(responseService.crearBadResponse(error.message));
    }
};
