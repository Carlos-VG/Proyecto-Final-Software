
const TABLE_NAME = 'tblPeriodo_Academico';
const TABLE_RELATION = 'tblPeriodo_Programa';
const auth = require('../auth/controlador');
const axios = require('axios');
const jsonServerUrl = 'http://localhost:3001';

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
        const { getOne } = require('./controlador'); // Import the getOne function
    }

    async function getAll() {
        const [periodos, programas, relaciones] = await Promise.all([
            controller.getAll(TABLE_NAME),
            axios.get(`${jsonServerUrl}/programas`).then(res => res.data),
            controller.getAll(TABLE_RELATION)
        ]);

        const programasMap = Object.fromEntries(programas.map(p => [p.id, p]));

        return periodos.map(periodo => ({
            ...periodo,
            programas: relaciones
                .filter(r => r.periodo_id === periodo.periodo_id)
                .map(r => programasMap[r.programa_id])
                .filter(Boolean)
        }));
    }

    async function getOne(id) {
        const [periodo, programas, relaciones] = await Promise.all([
            controller.getOne(TABLE_NAME, 'periodo_id', id),
            axios.get(`${jsonServerUrl}/programas`).then(res => res.data),
            controller.getAll(TABLE_RELATION)
        ]);

        const programasMap = Object.fromEntries(programas.map(p => [p.id, p]));

        return {
            ...periodo,
            programas: relaciones
                .filter(r => r.periodo_id === periodo.periodo_id)
                .map(r => programasMap[r.programa_id])
                .filter(Boolean)
        };
    }

    async function insert(data) {
        const { periodoAcademico, programas } = data;

        const periodoData = {
            periodo_nombre: periodoAcademico.periodo_nombre,
            periodo_fecha_inicio: new Date(periodoAcademico.periodo_fecha_inicio),
            periodo_fecha_fin: new Date(periodoAcademico.periodo_fecha_fin),
            periodo_estado: 1
        };
        const periodoId = await controller.insert(TABLE_NAME, periodoData);

        const relacionInserts = programas.map(programaId => controller.insert(TABLE_RELATION, {
            periodo_id: periodoId,
            programa_id: programaId
        }));

        await Promise.all(relacionInserts);

        return { periodoId, periodo: periodoData, programas };
    }

    async function update(data, id) {
        try {
            const { periodoAcademico, programas } = data;

            const periodoData = {
                periodo_nombre: periodoAcademico.periodo_nombre,
                periodo_fecha_inicio: new Date(periodoAcademico.periodo_fecha_inicio),
                periodo_fecha_fin: new Date(periodoAcademico.periodo_fecha_fin),
                periodo_estado: 1
            };
            await controller.update(TABLE_NAME, 'periodo_id', periodoData, id);

            // Eliminar todas las relaciones existentes para el periodo
            await controller.remove(TABLE_RELATION, 'periodo_id', id);

            // Insertar nuevas relaciones
            const relacionInserts = programas.map(programaId =>
                controller.insert(TABLE_RELATION, {
                    periodo_id: id,
                    programa_id: programaId
                })
            );

            await Promise.all(relacionInserts);

            return { periodoId: id, periodo: periodoData, programas };
        } catch (error) {
            console.error('Error updating data:', error);
            throw error;
        }
    }

    async function changeState(id) {
        const obtenerPeriodoAcademico = await getOne(id);
        // Cambiar el estado del docente
        const nuevoEstado = obtenerPeriodoAcademico.periodo_estado === 1 ? 0 : 1;
        // Preparar los datos para actualizar
        const dataToUpdate = {
            ...obtenerPeriodoAcademico,
            periodo_estado: nuevoEstado,
        };
        //retornar el docente con el nuevo estado
        return await controller.update(TABLE_NAME, 'periodo_id', dataToUpdate, id);
    }

    return {
        getAll,
        getOne,
        insert,
        update,
        changeState,
    };
};