const auth = require('../../auth');

module.exports = function chequearAuth(roles) {
    function middleware(req, res, next) {
        auth.chequearToken.confirmarToken(req, roles);
        next();
    }

    return middleware;
}