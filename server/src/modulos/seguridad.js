const auth = require('../../auth');

module.exports = function chequearAuth() {
    function middleware(req, res, next) {
        const rol = req.user.role;
        auth.chequearToken.confirmarToken(req, rol);
        next();
    }

    return middleware;
}