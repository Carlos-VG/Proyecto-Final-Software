const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const seguridad = require('../../middleware/seguridad');
const router = express.Router();


/**
 * @brief Rutas de la entidad docente
 */
router.get('/', seguridad('coordinador'), getTodosLosDocentes);
router.get('/unDocente/:id?', seguridad(['coordinador', 'docente']), getUnDocente);
router.post('/', seguridad('coordinador'), agregarDocente);
router.put('/actualizar/:id', seguridad('coordinador'), actualizarDocente);
router.put('/cambiarEstado/:id', seguridad('coordinador'), cambiarEstadoDocente);

/**
 * @brief Obtiene todos los docentes
 * @return Lista de docentes
 */
async function getTodosLosDocentes(req, res, next) {
    try {
        const items = await controlador.getAll();
        respuesta.success(req, res, items, 200);
        logger.http('Se obtuvieron todos los docentes')
    } catch (err) {
        respuesta.error(req, res, 'Error al obtener los docentes', 500);
        next(err);
    }
}

/**
 * @brief Obtiene un docente
 * @return Docente
 * @param req
 * @param res
 * @param next
 */
async function getUnDocente(req, res, next) {
    try {
        // Obtener el ID del docente directamente del token
        let idDocente;
        if (req.user.role === 'coordinador' && req.params.id) {
            idDocente = req.params.id;
        } else {
            idDocente = req.user.docente_id;
        }
        const item = await controlador.getOne(idDocente);
        if (!item) {
            logger.error('Docente no encontrado');
            return res.status(404).send({ error: 'Docente no encontrado' });
        }
        respuesta.success(req, res, item, 200);
    } catch (err) {
        respuesta.error(req, res, 'Error al obtener el docente', 500);
        next(err);
    }
}

/**
 * @brief Agrega un docente
 * @return Docente agregado
 * @param req
 * @param res
 * @param next
 */
async function agregarDocente(req, res, next) {
    try {
        const item = await controlador.insert(req.body);
        respuesta.success(req, res, 'Docente agregado satisfactoriamente', 201);
    } catch (err) {
        if (err.message.includes('Error al insertar el usuario. Posiblemente el nombre de usuario ya exista.')) {
            respuesta.error(req, res, err.message, 400);
        } else if (err.message.includes('Duplicate entry')) {
            respuesta.error(req, res, 'El docente ya existe.', 400);
        } else if (err.message.includes('Data too long for column')) {
            respuesta.error(req, res, 'La identifacion es muy larga.', 400);
        } else {
            respuesta.error(req, res, 'Error al agregar el docente', 500);
        }
        next(err);
    }
}

async function actualizarDocente(req, res, next) {
    try {
        const item = await controlador.update(req.body, req.params.id);
        respuesta.success(req, res, 'Docente actualizado satisfactoriamente', 200);
    } catch (err) {
        if (err.message.includes('Duplicate entry')) {
            respuesta.error(req, res, 'El docente ya existe.', 400);
        } else if (err.message.includes('Data too long for column')) {
            respuesta.error(req, res, 'La identifacion es muy larga.', 400);
        } else {
            respuesta.error(req, res, 'Error al actualizar el docente', 500);
        }
        next(err);
    }
}

/**
 * @brief actualizar el estado de un docente
 * @return estado actualizado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function cambiarEstadoDocente(req, res, next) {
    try {
        const item = await controlador.changeState(req.params.id);
        respuesta.success(req, res, 'Estado actualizado', 200);
    } catch (err) {
        respuesta.error(req, res, 'Error al actualizar el estado del docente', 500);
        next(err);
    }
}

module.exports = router;