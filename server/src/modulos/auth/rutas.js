const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const router = express.Router();


router.get('/login', login);

/**
 * @brief Rutas de la entidad Usuarios
 */

async function login(req, res, next) {
    try {
        console.log('Esto debe llegar', req.body.usuario + ' ' + req.body.password);
        const token = await controlador.login(req.body.usuario, req.body.password);
        respuesta.success(req, res, token, 200);
        logger.http('Usuario autenticado');
    } catch (error) {
        next(error);
        logger.error('Error al autenticar usuario');
    }
};

module.exports = router;