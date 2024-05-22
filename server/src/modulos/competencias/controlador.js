const axios = require('axios');
const jsonServerUrl = 'http://localhost:3001';
const logger = require('../../logger');

exports.getAll = async (req, res) => {
    try {
        const response = await axios.get(`${jsonServerUrl}/competencias`);
        res.json(response.data);
        logger.info('Competencias obtenidas');
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener competencias' });
        logger.error('Error al obtener competencias');
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${jsonServerUrl}/competencias/${id}?`);
        res.json(response.data);
        logger.info(`Competencia con id ${id} obtenida`);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener competencias' });
        logger.error(`Error al obtener la competencia con id ${id}`);
    }
};

exports.insert = async (req, res) => {
    try {
        const dataToInsert = req.body;
        dataToInsert.competencia_estado = 1;
        const response = await axios.post(`${jsonServerUrl}/competencias`, dataToInsert);
        res.json(response.data);
        logger.info('Competencia insertada');
    } catch (error) {
        res.status(500).json({ message: 'Error al insertar competencia' });
        logger.error('Error al insertar competencia');
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    try {
        req.body.competencia_estado = 1;
        const response = await axios.put(`${jsonServerUrl}/competencias/${id}`, req.body);
        res.json(response.data);
        logger.info(`Competencia con id ${id} actualizada`);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar competencia' });
        logger.error(`Error al actualizar la competencia con id ${id}`);
    }
};

exports.changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const competencia = await axios.get(`${jsonServerUrl}/competencias/${id}`);
        const competenciaData = competencia.data;
        competenciaData.competencia_estado = competenciaData.competencia_estado === 1 ? 0 : 1;
        const response = await axios.put(`${jsonServerUrl}/competencias/${id}`, competenciaData);
        res.json(response.data);
        logger.info(`Estado de competencia con id ${id} actualizado`);
    } catch (error) {
        logger.error('Error al actualizar estado de una competencia', error);
        res.status(500).json({ message: 'Error al actualizar estado de programa' });
    }
};
