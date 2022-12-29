// importamos nodemailer
const config = require("config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: config.get('nodemailer_user'),
        pass: config.get('nodemailer_password'),
    },
});

module.exports = { transporter };
