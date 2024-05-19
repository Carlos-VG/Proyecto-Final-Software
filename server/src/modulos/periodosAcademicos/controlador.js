
const TABLE_NAME = 'tblPeriodo_Academico';
const TABLE_RELATION = 'tblPeriodo_Programa';
const auth = require('../auth/controlador');
const axios = require('axios');
const jsonServerUrl = 'http://localhost:3000';

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
    }

    async function getAll() {
        const [periodosResponse, programasResponse, relacionesResponse] = await Promise.all([
            controller.getAll(TABLE_NAME),
            axios.get(`${jsonServerUrl}/programas`),
            controller.getAll(TABLE_RELATION)
        ]);

        const periodos = periodosResponse;
        const programas = programasResponse.data;
        const relaciones = relacionesResponse;

        const programasMap = programas.reduce((map, programa) => {
            map[programa.id] = programa;
            return map;
        }, {});

        const periodosConProgramas = periodos.map(periodo => {
            const programasDePeriodo = relaciones
                .filter(relacion => relacion.periodo_id === periodo.periodo_id)
                .map(relacion => programasMap[relacion.programa_id])
                .filter(prog => prog);

            return { ...periodo, programas: programasDePeriodo };
        });

        return periodosConProgramas;
    }

    async function getOne(id) {
        return controller.getOne(TABLE_NAME, 'periodo_id', id);
    }

    async function insert(data) {
        const dataToInsert = { ...data };

        if ('id' in dataToInsert) {
            dataToInsert.docente_id = dataToInsert.id;
            delete dataToInsert.id;
            delete dataToInsert.login;
            delete dataToInsert.password;

        }
        const docenteResult = await controller.insert(TABLE_NAME, dataToInsert);

        let usuarioData = {
            usuario: data.login,
            password: data.password,
            rol: 'docente',
            docente_id: docenteResult
        };

        const usuarioResult = await auth(injectedController).insert(usuarioData);

        return { docenteResult, usuarioResult };
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