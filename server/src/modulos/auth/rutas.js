const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const router = express.Router();


router.get('/login', login);
router.post('/', insertarUsuario);

/**
 * @brief Rutas de la entidad Usuarios
 */

async function login(req, res, next) {
    try {
        const token = await controlador.login(req.body.usuario, req.body.password);
        respuesta.success(req, res, token, 200);
        logger.info("Usuario autenticado correctamente")
    } catch (error) {
        next(error);
        logger.error('Error al autenticar usuario');
    }
}

async function insertarUsuario(req, res, next) {
    try {
        const usuario = await controlador.insert(req.body);
        respuesta.success(req, res, usuario, 201);
        logger.info('Usuario creado correctamente');
    } catch (error) {
        next(error);
        logger.error('Error al crear usuario');
    }
}

module.exports = router;