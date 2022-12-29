const config = require("config");
const mongoose = require("mongoose");

require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
    try {
        await mongoose.connect(config.get('db_atlas'));
        console.log(`Base de datos \x1b[32m${config.get('db_atlas')}\x1b[0m : \x1b[32m%s\x1b[0m `, "conectada");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = conectarDB;
