//Import de dependencias
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoMemoryServer;

const testDbConnect = async () => {
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

const testDbDisconnect = async () => {
    await mongoose.disconnect();
    await mongoMemoryServer.stop();
};

module.exports = {
    testDbConnect,
    testDbDisconnect,
};
