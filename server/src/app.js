/**
 * @file app.js
 * @description Archivo principal de la aplicación
 */

const express = require('express');
const config = require('./config');

const docentes = require('./modulos/docentes/rutas');

const app = express();

/**
 * @brief Configuración de la aplicación
 */
app.set('port', config.app.port);

app.use('/api/docentes', docentes);

module.exports = app;