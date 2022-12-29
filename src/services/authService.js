// imrpots
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

// models
const Usuario = require("../models/Usuario");

// services
const mailService = require("../services/mailService");
const config = require("config");

exports.forgotPassword = async ({ username, email }) => {
    const usuario = await Usuario.findOne({
        usuario: username,
    }).populate({
        path: "autoridad",
        populate: [{ path: "persona" }],
    });
    if (!usuario) {
        throw new Error("Datos incorrectos");
    }
    if(usuario.autoridad.persona.contactoCorreo !== email){
        throw new Error("Datos incorrectos");
    }
    // generamos token
    const token = jwt.sign(
        { userId: usuario.id, username: usuario.usuario },
        config.get('secret_jwt'),
        {
            expiresIn: "10m",
        },
    );

    // guardamos token en user
    usuario.resetToken = token;
    await usuario.save();
    const verificationLink = `${config.get('recovery_server')+config.get('recovery_path')}?token=${token}`;

    try {
        await mailService.sendEmailVerificationLink({
            email: usuario.autoridad.persona.contactoCorreo,
            user: usuario.usuario,
            verificationLink,
        });
    } catch (error) {
        throw new Error(
            "No fue posible procesar la solicitud, debe comunicarse con la institución, disculpe las molestias",
        );
    }

    return {
        message:
            "Revise su correo electronico, y siga las instrucciones para procesar el reseteo de su contraseña.",
        verificationLink,
    };
};
