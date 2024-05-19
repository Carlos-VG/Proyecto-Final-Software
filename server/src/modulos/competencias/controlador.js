const axios = require('axios');
const jsonServerUrl = 'http://localhost:3000';
const logger = require('../../logger');

exports.getAll = async (req, res) => {
    try {
        const response = await axios.get(`${jsonServerUrl}/programas?_embed=competenciasProgramas`);
        res.json(response.data);
        logger.info('Programas obtenidos');
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programas' });
        logger.error('Error al obtener programas');
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${jsonServerUrl}/programas/${id}?_embed=competenciasProgramas`);
        res.json(response.data);
        logger.info(`Programa con id ${id} obtenido`);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el programa' });
        logger.error(`Error al obtener el programa con id ${id}`);
    }
};
