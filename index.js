const config = require('config');
const conectarDB = require("./src/config/db");
PORT = config.get('port');
const HOST = config.get('host');

const app = require("./app");

const server = app.listen(process.env.PORT || PORT, async function () {
    console.log(
        `[ \x1b[33m%s\x1b[0m ]`, config.get('environment').toUpperCase(), `- El servidor esta funcionando en \x1b[34m${HOST}:${process.env.PORT || PORT}\x1b[0m : \x1b[32monline\x1b[0m`
    );
});

conectarDB();

module.exports = { server };
