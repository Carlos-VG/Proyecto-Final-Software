/**
 * @file app.js
 * @description Archivo principal de la aplicación
 */

const express = require('express');
const morgan = require('morgan');
const config = require('./config');

const docentes = require('./modulos/docentes/rutas');
const error = require('./red/errors');

const app = express();

/**
 * @brief Middleware para el manejo de JSON
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @brief Configuración de la aplicación
 */
app.set('port', config.app.port);

app.use('/api/docentes', docentes);
app.use(error);

module.exports = app;