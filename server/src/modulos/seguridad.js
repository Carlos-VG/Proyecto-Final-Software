const auth = require('../../auth');

module.exports = function chequearAuth() {
    function middleware(req, res, next) {
        const rol = req.body.rol;
        auth.chequearToken.confirmarToken(req, rol);
        next();
    }

    return middleware;
}