const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const seguridad = require('../seguridad');
const router = express.Router();


/**
 * @brief Rutas de la entidad Ambiente
 */
router.get('/', getTodosLosAmbientes);
router.get('/:id', getUnAmbiente);
router.post('/', agregarAmbiente);
router.put('/:id', actualizarAmbiente);
router.put('/cambiarEstado/:id', cambiarEstadoAmbiente);

/**
 * @brief Obtiene todos los ambientes
 * @return Lista de ambientes
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getTodosLosAmbientes(req, res, next) {
    try {
        const items = await controlador.getAll();
        respuesta.success(req, res, items, 200);
        logger.http('Se obtuvieron todos los ambientes')
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Obtiene un ambiente
 * @return Ambiente
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getUnAmbiente(req, res, next) {
    try {
        const item = await controlador.getOne(req.params.id);
        respuesta.success(req, res, item, 200);
        logger.http('Se obtuvo un ambiente')
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Agrega un ambiente
 * @return Ambiente agregado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function agregarAmbiente(req, res, next) {
    try {
        const item = await controlador.insert(req.body);
        respuesta.success(req, res, 'Ambiente agregado satisfactoriamente', 201);
        logger.http('Se agregó un ambiente')
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Actualiza un ambiente
 * @return Ambiente actualizado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function actualizarAmbiente(req, res, next) {
    try {
        const item = await controlador.update(req.body, req.params.id);
        respuesta.success(req, res, 'Ambiente actualizado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Actualiza el estado de un ambiente
 * @return Estado actualizado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function cambiarEstadoAmbiente(req, res, next) {
    try {
        const item = await controlador.changeState(req.params.id);
        respuesta.success(req, res, 'Estado actualizado', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;