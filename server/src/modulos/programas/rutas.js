const express = require('express');
const controlador = require('./controlador');
const seguridad = require('../../middleware/seguridad');
const router = express.Router();

/**
 * @brief Obtener todos los programas
 */
router.get('/', seguridad('coordinador'), controlador.getAll);

/**
 * @brief Obtener un programa por id
 */
router.get('/:id', seguridad('coordinador'), controlador.getById);

/**
 * @brief Insertar un programa
 */
router.post('/', seguridad('coordinador'), controlador.insert);

/**
 * @brief Actualizar un programa
 */
router.put('/:id', seguridad('coordinador'), controlador.update);

/**
 * @brief Cambiar el estado de un programa
 */
router.put('/cambiarEstado/:id', seguridad('coordinador'), controlador.changeState);

module.exports = router;