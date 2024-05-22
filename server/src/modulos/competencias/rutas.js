const express = require('express');
const controlador = require('./controlador');
const router = express.Router();
const seguridad = require('../../middleware/seguridad');

/**
 * @brief Obtener todos las competencias
 */
router.get('/', seguridad('coordinador'), controlador.getAll);

/**
 * @brief Obtener una competencia por id
 */
router.get('/:id', seguridad('coordinador'), controlador.getById);

/**
 * @brief Insertar una competencia
 */
router.post('/', seguridad('coordinador'), controlador.insert);

/**
 * @brief Actualizar una competencia
 */
router.put('/:id', seguridad('coordinador'), controlador.update);

/**
 * @brief Cambiar el estado de una competencia
 */
router.put('/cambiarEstado/:id', seguridad('coordinador'), controlador.changeState);

module.exports = router;