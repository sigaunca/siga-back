exports.checkIdValidate = (req, res, next) => {
    const id = req.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        // SI, es un ObjectId valido, proceder con la siguiente llamada.
        next();
        return;
    }
    // No es un ObjectId valido, retornar aviso.
    res.status(400).send("El id ingresado no es válido.");
};
