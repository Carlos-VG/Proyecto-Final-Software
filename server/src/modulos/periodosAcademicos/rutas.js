const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger');
const seguridad = require('../../middleware/seguridad');
const router = express.Router();


/**
 * @brief Rutas de la entidad Periodo Academico
 */
router.get('/', seguridad('coordinador'), getTodosLosPeriodosAcademicos);
router.get('/:id', seguridad('coordinador'), getUnPeriodoAcademico);
router.post('/', seguridad('coordinador'), agregarPeriodoAcademico);
router.put('/:id', seguridad('coordinador'), actualizarUnPeriodoAcademico);
router.delete('/:id', seguridad('coordinador'), eliminarPeriodoAcademico);

/**
 * @brief Obtiene todos los periodos academicos
 */
async function getTodosLosPeriodosAcademicos(req, res, next) {
    try {
        const items = await controlador.getAll();
        respuesta.success(req, res, items, 200);
        logger.http('Se obtuvieron todos los Periodos Academicos')
    } catch (err) {
        logger.error('Error al obtener los Periodos Academicos');
        next(err);
    }
}

/**
 * @brief Obtiene un periodo academico
 * @return Periodo academico
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getUnPeriodoAcademico(req, res, next) {
    try {
        const item = await controlador.getOne(req.params.id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        logger.error('Error al obtener el Periodo Academico');
        next(err);
    }
}

/**
 * @brief Agrega un periodo academico
 * @return Periodo academico agregado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function agregarPeriodoAcademico(req, res, next) {
    try {
        const item = await controlador.insert(req.body);
        respuesta.success(req, res, 'Periodo academico agregado satisfactoriamente', 201);
        logger.http('Periodo academico agregado satisfactoriamente');
    } catch (err) {
        logger.error('Error al agregar el Periodo Academico');
        next(err);
    }
}

/**
 * @brief Actualiza un periodo academico
 * @return Periodo academico actualizado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function actualizarUnPeriodoAcademico(req, res, next) {
    try {
        const item = await controlador.update(req.body, req.params.id);
        respuesta.success(req, res, 'Periodo academico actualizado satisfactoriamente', 200);
        logger.http('Periodo academico actualizado satisfactoriamente');
    } catch (err) {
        logger.error('Error al actualizar el Periodo Academico');
        next(err);
    }
}

/**
 * @brief Elimina un periodo academico
 * @return Item Eliminado Satisfactoriamente
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function eliminarPeriodoAcademico(req, res, next) {
    try {
        const item = await controlador.remove(req.params.id);
        respuesta.success(req, res, 'Periodo academico eliminado satisfactoriamente', 200);
        logger.http('Periodo academico eliminado satisfactoriamente');
    } catch (err) {
        logger.error('Error al eliminar el Periodo Academico');
        next(err);
    }
}

module.exports = router;