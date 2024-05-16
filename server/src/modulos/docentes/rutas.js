const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger'); // Módulo de registro personalizado
const router = express.Router();


/**
 * @brief Rutas de la entidad docente
 */
router.get('/', getTodosLosDocentes);
router.get('/:id', getUnDocente);
router.post('/', agregarDocente);
router.put('/:id', actualizarDocente);
router.delete('/:id', eliminarDocente);

/**
 * @brief Obtiene todos los docentes
 * @return Lista de docentes
 */
async function getTodosLosDocentes(req, res, next) {
    try {
        const items = await controlador.getAll('tabla_docentes', 'id_docente');
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
 * @brief Elimina un docente
 * @return Item Eliminado Satisfactoriamente
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function eliminarDocente(req, res, next) {
    try {
        const item = await controlador.remove(req.params.id);
        respuesta.success(req, res, 'Docente eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;