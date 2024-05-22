const jwt = require('jsonwebtoken');
config = require('../src/config');

const secret = config.jwt.secret;

function asignarToken(data) {
    return jwt.sign(data, secret);
}

function verificarToken(token) {
    return jwt.verify(token, secret);
}

const chequearToken = {
    confirmarToken: function (req, roles) {
        const decodificado = decodificarCabecera(req);

        // Verifica si el rol del usuario está en la lista de roles permitidos
        if (!roles.includes(decodificado.role)) {
            throw new Error('No tienes permisos para realizar esta acción');
        }

        // Todo está correcto, establecer el usuario en el request
        req.user = {
            role: decodificado.role,
            username: decodificado.username,
            docente_id: decodificado.docente_id
        };
    }
};

function obtenerToken(autorizacion) {
    if (!autorizacion) {
        throw new Error('No se ha enviado un token');
    }

    if (autorizacion.indexOf('Bearer ') === -1) {
        throw new Error('Formato de token incorrecto');
    }

    let token = autorizacion.replace('Bearer ', '')
    return token;
}

function decodificarCabecera(req) {
    const autorizacion = req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const decodificado = verificarToken(token);

    req.user = {
        role: decodificado.role,
        username: decodificado.username,
        docente_id: decodificado.docente_id // Esto estará presente solo si el rol es 'docente' de lo contrario será undefined
    };

    return decodificado;
}

module.exports = {
    asignarToken,
    chequearToken,
};