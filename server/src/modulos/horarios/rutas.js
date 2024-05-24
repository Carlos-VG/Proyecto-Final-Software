const express = require('express');
const respuesta = require('../../red/respuestas');
const controlador = require('./index');
const logger = require('../../logger');
const seguridad = require('../../middleware/seguridad');
const validarHorario = require('../../middleware/validarHorario');
const router = express.Router();


/**
 * @brief Rutas de la entidad horario
 */
router.get('/', seguridad('coordinador'), getTodosLosHorarios);
router.get('/unHorario/:id?', seguridad(['coordinador', 'docente']), getUnHorario);
router.post('/', seguridad('coordinador'), validarHorario);
router.put('/actualizar/:id', seguridad('coordinador'), validarHorario);
router.delete('/:id', seguridad('coordinador'), eliminarHorario);

/**
 * @brief Obtiene todos los horarios
 * @return Lista de horarios
 */
async function getTodosLosHorarios(req, res, next) {
    try {
        const items = await controlador.getAll();
        respuesta.success(req, res, items, 200);
        logger.http('Se obtuvieron todos los docentes')
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Obtiene un horario
 * @return Horario
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getUnHorario(req, res, next) {
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
            logger.error('Horario no encontrado');
            return res.status(404).send({ error: 'Horario no encontrado' });
        }
        respuesta.success(req, res, item, 200);
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Agregar un horario
 * @return horario agregado
 * @param req peticion
 * @param res respuesta
 */
async function agregarHorario(req, res, next) {
    try {
        const item = await controlador.insert(req.body);
        respuesta.success(req, res, 'Horario agregado satisfactoriamente', 201);
        logger
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Actualizar un horario
 * @return horario actualizado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function actualizarHorario(req, res, next) {
    try {
        const item = await controlador.update(req.body, req.params.id);
        respuesta.success(req, res, 'Horario actualizado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Eliminar un horario
 * @return horario eliminado
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function eliminarHorario(req, res, next) {
    try {
        const item = await controlador.changeState(req.params.id);
        respuesta.success(req, res, 'Estado actualizado', 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;