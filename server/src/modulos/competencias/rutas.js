const express = require('express');
const controlador = require('./controlador');
const router = express.Router();

/**
 * @brief Obtener todos los programas
 */
router.get('/', controlador.getAll);

/**
 * @brief Obtener un programa por id
 */
router.get('/:id', controlador.getById);

module.exports = router;