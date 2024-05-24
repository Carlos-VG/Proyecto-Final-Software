/**
 * @file app.js
 * @description Archivo principal de la aplicación
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');

const docentes = require('./modulos/docentes/rutas');
const auth = require('./modulos/auth/rutas');
const programas = require('./modulos/programas/rutas');
const competencias = require('./modulos/competencias/rutas');
const periodosAcademicos = require('./modulos/periodosAcademicos/rutas');
const ambientes = require('./modulos/ambientes/rutas');
const horarios = require('./modulos/horarios/rutas');
const error = require('./red/errors');

const app = express();

/**
 * @brief Middleware para el manejo de JSON
 */
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * @brief Configuración de la aplicación
 */
app.set('port', config.app.port);

app.use('/api/docentes', docentes);
app.use('/api/auth/', auth);
app.use('/api/programas', programas);
app.use('/api/competencias', competencias);
app.use('/api/periodosAcademicos', periodosAcademicos);
app.use('/api/ambientes', ambientes);
app.use('/api/horarios', horarios);
app.use(error);

module.exports = app;
