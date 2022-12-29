// imrpots
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const config = require('config')

// models
const Usuario = require("../models/Usuario");

// services

exports.crearUsuario = async ({
    usuario,
    password,
    autoridad,
    onlyCreateUser = false,
}) => {
    let user = await Usuario.findOne({ usuario });

    if (user) {
        throw new Error("El usuario ya existe");
    }
    // creamos usuario
    user = new Usuario({ usuario, password, autoridad, resetToken: "" });
    // generamos salt
    const salt = await bcryptjs.genSalt(10);
    // seteamos datos del user
    user.password = await bcryptjs.hash(password, salt);
    user.autoridad = autoridad;
    // guardamos
    const usuarioCreado = await user.save();
    if (onlyCreateUser) {
        return usuarioCreado;
    } else {
        // generamos respuesta
        const payload = {
            user: {
                id: user.id,
            },
        };
        // generamos token
        const token = jwt.sign(payload, config.get('secret_jwt'), {
            expiresIn: 3600,
        });

        return {
            usuario: usuarioCreado,
            token,
        };
    }
};
