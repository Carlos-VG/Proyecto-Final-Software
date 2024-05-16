const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

/**
 * @brief Rutas de la entidad docente
 */
router.get('/', todos);
router.get('/:id', uno);
router.post('/agregar', agregar);
router.post('/actualizar', actualizar);
router.put('/eliminar', eliminar);

/**
 * @brief Obtiene todos los docentes
 * @return Lista de docentes
*/
async function todos(req, res, next) {
    try {
        const items = await controlador.todos();
        respuesta.success(req, res, items, 200);
    } catch (err) {
        next(err);
    }
};

/**
 * @brief Obtiene un docente
 * @param id Identificador del docente
 * @return Docente
 */
async function uno(req, res, next) {
    try {
        const item = await controlador.uno(req.params.id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        next(err);
    }
};

/**
 * @brief Agrega un docente
 * @param docente Datos del docente
 * @return Docente agregado
 */
async function agregar(req, res, next) {
    try {
        const item = await controlador.agregar(req.body);
        respuesta.success(req, res, 'Docente agregado satisfactoriamente', 201);
    } catch (err) {
        next(err);
    }
};

async function actualizar(req, res, next) {
    try {
        const item = await controlador.actualizar(req.body);
        respuesta.success(req, res, 'Docente actualizado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
};

/** 
 * @brief Elimina un docente
 * @param id Identificador del docente
 * @return Item Eliminado Satisfactoriamente
*/
async function eliminar(req, res, next) {
    try {
        const item = await controlador.eliminar(req.body);
        respuesta.success(req, res, 'Docente eliminado satisfactoriamente', 200);
    } catch (err) {
        next(err);
    }
};

module.exports = router;