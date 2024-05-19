
const TABLE_NAME = 'tblDocente';
const auth = require('../auth/controlador');

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
    }

    async function getAll() {
        return controller.getAll(TABLE_NAME);
    }

    async function getOne(id) {
        return controller.getOne(TABLE_NAME, 'docente_id', id);
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
        return controller.update(TABLE_NAME, 'docente_id', dataToUpdate, id);
    }

    async function remove(id) {
        return controller.remove(TABLE_NAME, 'docente_id', id);
    }

    return {
        getAll,
        getOne,
        insert,
        update,
        remove,
    };
};