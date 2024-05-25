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
router.post('/', seguridad('coordinador'), validarHorario, agregarHorario);
router.put('/actualizar/:id', seguridad('coordinador'), validarHorario, actualizarHorario);
router.delete('/:id', seguridad('coordinador'), eliminarHorario);
router.get('/horarioPeriodoAmbiente/:idPeriodo/:idAmbiente', seguridad('coordinador'), getHorarioPeriodoAmbiente);
router.get('/horarioPeriodoDocente/:idPeriodo/:idDocente', seguridad('coordinador'), getHorarioPeriodoDocente);
router.get('/franjaHorariaDocente/:idDocente?', seguridad(['coordinador', 'docente']), getFranjaHorariaDocente);

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

/**
 * @brief Obtener horarios por periodo y ambiente
 * @return horarios
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getHorarioPeriodoAmbiente(req, res, next) {
    try {
        const items = await controlador.getHorariosByPeriodoYAmbiente(req.params.idPeriodo, req.params.idAmbiente);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Obtener horarios por periodo y docente
 * @return horarios
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getHorarioPeriodoDocente(req, res, next) {
    try {
        const items = await controlador.getHorariosByDocenteYPeriodo(req.params.idDocente, req.params.idPeriodo);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

/**
 * @brief Obtener franja horaria de un docente
 * @return horarios
 * @param req peticion
 * @param res respuesta
 * @param next siguiente
 */
async function getFranjaHorariaDocente(req, res, next) {
    try {
        let idDocenteReq;
        if (req.user.role === 'coordinador' && req.params.idDocente) {
            idDocenteReq = req.params.idDocente;
        } else {
            idDocenteReq = req.user.docente_id;
        }
        const items = await controlador.getFranjaHorariaDocente(idDocenteReq);
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
}

module.exports = router;