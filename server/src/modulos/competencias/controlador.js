const axios = require('axios');
const jsonServerUrl = 'http://localhost:3000';
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
