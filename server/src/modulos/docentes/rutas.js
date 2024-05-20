const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const seguridad = require('../seguridad');
const router = express.Router();


/**
 * @brief Rutas de la entidad docente
 */
router.get('/', getTodosLosDocentes);
router.get('/:id', getUnDocente);
router.post('/', seguridad(), agregarDocente);
router.put('/:id', actualizarDocente);
router.put('/cambiarEstado/:id', cambiarEstadoDocente);

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
        const item = await controlador.getOne(req.params.id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
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
        logger
    } catch (err) {
        next(err);
    }
}

async function actualizarDocente(req, res, next) {
    try {
        const item = await controlador.update(req.body, req.params.id);
        respuesta.success(req, res, 'Docente actualizado satisfactoriamente', 200);
    } catch (err) {
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
        next(err);
    }
}

module.exports = router;