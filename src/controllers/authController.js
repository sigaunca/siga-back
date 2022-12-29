const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require('config');

// services imports
const authService = require("../services/authService");
const responseService = require("../services/responseService");

// TODO: revisar
exports.autenticarUsuario = async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    const { usuario, password } = req.body;
    try {
        let user = await Usuario.findOne({ usuario }).populate({
            path: "autoridad",
            // Get friends of friends - populate the 'friends' array for every friend
            populate: [{ path: "persona" }, {path: "escuela"}],
        });
        if (!user) {
            return res.status(400).json({ msg: "El usuario no existe" });
        }

        const passCorrecto = await bcryptjs.compare(password, user.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: "Password incorrecta" });
        }
        // HAY QUE PONER ACÁ LO QUE QUEREMOS MANDAR EN EL TOKEN
        const payload = {
            user: {
                id: user.id,
            },
        };
        user.password = "*********"
        jwt.sign(
            payload,
            config.get('secret_jwt'),
            {
                expiresIn: 3600,
            },
            async (error, token) => {
                if (error) throw error;
                //Mensaje de confirmacion
                await res.status(200).json({ token, user });
            },
        );
    } catch (error) {
        console.log(error);
        res.status(500).send("Hubo un error");
    }
};

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id).select("-password");
        res.status(200).json({ usuario });
    } catch (error) {
        res.status(500).json({ msg: "Hubo un error" });
    }
};
// TODO: revisar
exports.resetPassword = async (req, res) => {
    let cifrado;
    try {
        cifrado = jwt.verify(req.header("Authorization").substring(7, req.header("Authorization").lenght),config.get('secret_jwt'));
      } catch (error) {
        console.log(error)
        res.status(401).json({ msg: "Token no válido" });
        return;
      }
    let searchedUser = req.body.usuario === "forgot" ? cifrado !== undefined ? cifrado.userId : null : req.body.usuario;
    if(searchedUser === null){
        
        throw new Error("Token expirado");
    }
    try {
        let usuario = await Usuario.findById({
            _id: searchedUser,
        }).populate({
            path: "autoridad",
            populate: [{ path: "persona" }],
        });
        if (!usuario) {
            throw new Error("No existe el usuario en nuestra base de datos.");
        }
        const salt = await bcryptjs.genSalt(10);
        const newPassword = await bcryptjs.hash(
            usuario.autoridad.persona.numeroDocumento,
            salt,
        );
        usuario = await Usuario.findOneAndUpdate(
            { _id: usuario._id },
            { $set: { password: newPassword } },
            { new: true },
        );
        res.status(200).json({ msg: "Password reiniciada" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Hubo un error" });
    }
};

exports.forgotPassword = async (req, res) => {
    const { usuario, email } = req.body;
    if (!usuario) {
        return res.status(400).json({ message: "'usuario' es requerido!" });
    }
    if (!email) {
        return res.status(400).json({ message: "'email' es requerido!" });
    }
    try {
        const response = await authService.forgotPassword({
            username: usuario,
            email
        });
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res
            .status(400)
            .json(responseService.crearBadResponse(error.message));
    }
};
