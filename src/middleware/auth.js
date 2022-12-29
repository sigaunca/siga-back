const jwt = require("jsonwebtoken");
const config = require('config');
module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No hay token, permiso no válido" });
  }
  try {
    const cifrado = jwt.verify(token.substring(7, token.lenght), config.get('secret_jwt'));
    req.user = cifrado.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token no válido" });
  }
};
