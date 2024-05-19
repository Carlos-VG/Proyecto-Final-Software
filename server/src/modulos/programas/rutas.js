const express = require('express');
const controlador = require('./controlador');
const seguridad = require('../seguridad');
const router = express.Router();

// Obtener todos los programas con sus competencias
router.get('/', controlador.getAll);

// Obtener un solo programa con sus competencias
router.get('/:id', controlador.getById);

module.exports = router;