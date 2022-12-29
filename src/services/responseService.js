exports.crearResponse = (data, statusCode = null) => {
    return {
        statusCode,
        data,
    };
};

exports.crearResponseConMensaje = (data, statusCode = null, message = null) => {
    return {
        statusCode,
        message,
        data,
    };
};

exports.crearBadResponse = (message) => {
    return {
        message,
    };
};
