const axios = require('axios');
const jsonServerUrl = 'http://localhost:3000';
const logger = require('../../logger');
const competenciasCtrl = require('../competencias/controlador');

exports.getAll = async (req, res) => {
    try {
        const [programasResponse, competenciasResponse, relacionesResponse] = await Promise.all([
            axios.get(`${jsonServerUrl}/programas`),
            axios.get(`${jsonServerUrl}/competencias`),
            axios.get(`${jsonServerUrl}/programasCompetencias`)
        ]);

        const programas = programasResponse.data;
        const competencias = competenciasResponse.data;
        const relaciones = relacionesResponse.data;

        const competenciasMap = competencias.reduce((map, competencia) => {
            map[competencia.id] = competencia;
            return map;
        }, {});

        const programasConCompetencias = programas.map(programa => {
            const competenciasDePrograma = relaciones
                .filter(relacion => relacion.programa_id === programa.id)
                .map(relacion => competenciasMap[relacion.competencia_id])
                .filter(comp => comp);

            return { ...programa, competencias: competenciasDePrograma };
        });

        res.json(programasConCompetencias);
        logger.info('Programas con competencias obtenidos');
    } catch (error) {
        console.error('Error detallado:', error);
        logger.error('Error al obtener programas', error);
        res.status(500).json({ message: 'Error al obtener programas' });
    }
};


exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const [programaResponse, competenciasResponse, relacionesResponse] = await Promise.all([
            axios.get(`${jsonServerUrl}/programas/${id}`),
            axios.get(`${jsonServerUrl}/competencias`),
            axios.get(`${jsonServerUrl}/programasCompetencias`)
        ]);

        const programa = programaResponse.data;
        programa.id = parseInt(programa.id);
        const competencias = competenciasResponse.data;
        const relaciones = relacionesResponse.data;

        const competenciasMap = competencias.reduce((map, competencia) => {
            map[competencia.id] = competencia;
            return map;
        }, {});

        const competenciasDePrograma = relaciones
            .filter(relacion => relacion.programa_id === programa.id)
            .map(relacion => competenciasMap[relacion.competencia_id])
            .filter(comp => comp);

        const programaConCompetencias = { ...programa, competencias: competenciasDePrograma };

        res.json(programaConCompetencias);
        logger.info(`Programa con id ${id} obtenido`);
    } catch (error) {
        respuestas.error(req, res, 'Error al obtener el programa', 500);
        logger.error(`Error al obtener el programa con id ${id}`);
    }
};

exports.insert = async (req, res) => {
    try {
        const { programa, competencias } = req.body;
        const programaResponse = await axios.post(`${jsonServerUrl}/programas`, programa);

        const competenciasPromises = competencias.map(competenciaId =>
            axios.post(`${jsonServerUrl}/programasCompetencias`, {
                programa_id: programaResponse.data.id,
                competencia_id: competenciaId
            })
        );
        await Promise.all(competenciasPromises);

        res.json({ programa: programaResponse.data, competencias: competencias });
        logger.info('Programa y competencias agregadas satisfactoriamente');

    } catch (error) {
        console.error('Error al agregar programa y competencias', error);
        logger.error('Error al agregar programa y competencias', error);
        res.status(500).json({ message: 'Error al agregar programa y competencias' });
    }
};