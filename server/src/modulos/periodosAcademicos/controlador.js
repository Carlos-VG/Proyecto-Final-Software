
const TABLE_NAME = 'tblPeriodo_Academico';
const TABLE_RELATION = 'tblPeriodo_Programa';
const auth = require('../auth/controlador');
const axios = require('axios');
const jsonServerUrl = 'http://localhost:3001';

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
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
            fecha_inicio: periodoAcademico.periodo_fecha_inicio,
            fecha_fin: periodoAcademico.periodo_fecha_fin
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
        const dataToUpdate = { ...data };
        return controller.update(TABLE_NAME, 'periodo_id', dataToUpdate, id);
    }

    async function remove(id) {
        return controller.remove(TABLE_NAME, 'periodo_id', id);
    }

    return {
        getAll,
        getOne,
        insert,
        update,
        remove,
    };
};