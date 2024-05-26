const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const seguridad = require('../../middleware/seguridad');
const router = express.Router();


router.post('/login', login);
router.post('/', insertarUsuario);
router.get('/rol', seguridad(['coordinador', 'docente']), verificarRol);

/**
 * @brief Rutas de la entidad Usuarios
 */

async function login(req, res, next) {
    try {
        const token = await controlador.login(req.body.usuario, req.body.password);
        respuesta.success(req, res, token, 200);
        logger.info("Usuario autenticado correctamente")
    } catch (error) {
        if (error.message.includes('Credenciales incorrectas')) {
            respuesta.error(req, res, 'Credenciales incorrectas', 401);
        } else {
            respuesta.error(req, res, 'Error al autenticar usuario', 500);
        }
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

async function verificarRol(req, res, next) {
    try {
        let rolObtenido = req.user.role;
        respuesta.success(req, res, rolObtenido, 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;