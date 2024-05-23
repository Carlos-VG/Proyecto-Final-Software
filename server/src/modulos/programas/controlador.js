const axios = require('axios');
const jsonServerUrl = 'http://localhost:3001';
const logger = require('../../logger');
const respuestas = require('../../red/respuestas');

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
        const [programa, competencias, relaciones] = await Promise.all([
            axios.get(`${jsonServerUrl}/programas/${id}`),
            axios.get(`${jsonServerUrl}/competencias`),
            axios.get(`${jsonServerUrl}/programasCompetencias`)
        ]);

        const competenciasMap = competencias.data.reduce((map, comp) => {
            map[comp.id] = comp;
            return map;
        }, {});

        const programaConCompetencias = {
            ...programa.data,
            id: parseInt(programa.data.id),
            competencias: relaciones.data
                .filter(rel => rel.programa_id === programa.data.id)
                .map(rel => competenciasMap[rel.competencia_id])
                .filter(Boolean)
        };

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
        programa.programa_estado = 1;
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

async function safeAxiosRequest(url, method, data = {}, retries = 3, delay = 500) {
    try {
        if (method === 'post') {
            return await axios.post(url, data);
        } else if (method === 'delete') {
            return await axios.delete(url);
        } else if (method === 'put') {
            return await axios.put(url, data);
        }
    } catch (error) {
        if (retries > 0) {
            logger.error(`Error en ${method} request, reintentando...`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
            return safeAxiosRequest(url, method, data, retries - 1, delay * 2);
        }
        throw error;
    }
}

exports.update = async (req, res) => {
    try {
        const { programa, competencias } = req.body;
        programa.programa_estado = 1;
        const programaResponse = await safeAxiosRequest(`${jsonServerUrl}/programas/${req.params.id}`, 'put', programa);

        // Obtención de relaciones existentes para eliminarlas
        const relaciones = await axios.get(`${jsonServerUrl}/programasCompetencias?programa_id=${req.params.id}`);
        const relacionesAEliminar = relaciones.data.map(relacion =>
            safeAxiosRequest(`${jsonServerUrl}/programasCompetencias/${relacion.id}`, 'delete').catch(err => {
                logger.error(`Error eliminando relación ${relacion.id}`, err);
                throw err;
            })
        );

        // Esperar que todas las eliminaciones se completen
        await Promise.all(relacionesAEliminar);

        // Creación de nuevas relaciones
        const competenciasPromises = competencias.map(competenciaId =>
            safeAxiosRequest(`${jsonServerUrl}/programasCompetencias`, 'post', {
                programa_id: programaResponse.data.id,
                competencia_id: competenciaId
            })
        );
        await Promise.all(competenciasPromises);

        // Envío de respuesta exitosa
        res.json({ programa: programaResponse.data, competencias: competencias });
        logger.info('Programa y competencias actualizadas satisfactoriamente');

    } catch (error) {
        logger.error('Error al actualizar programa y competencias', error);
        res.status(500).json({ message: 'Error al actualizar programa y competencias' });
    }
};

exports.changeState = async (req, res) => {
    try {
        const { id } = req.params;
        const programa = await axios.get(`${jsonServerUrl}/programas/${id}`);
        const programaData = programa.data;
        programaData.programa_estado = programaData.programa_estado === 1 ? 0 : 1;
        const response = await axios.put(`${jsonServerUrl}/programas/${id}`, programaData);
        res.json(response.data);
        logger.info(`Estado de la competencia con id ${id} actualizado`);
    } catch (error) {
        logger.error('Error al actualizar estado de programa', error);
        res.status(500).json({ message: 'Error al actualizar estado de programa' });
    }
};
