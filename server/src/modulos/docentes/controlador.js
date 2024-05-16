const TABLE_NAME = 'tblDocente';

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
    }

    async function getAll() {
        return controller.getAll(TABLE_NAME, 'docente_id');
    }

    async function getOne(id) {
        return controller.getOne(TABLE_NAME, 'docente_id', id);
    }

    async function insert(data) {
        const dataToInsert = { ...data };

        if ('id' in dataToInsert) {
            dataToInsert.docente_id = dataToInsert.id;
            delete dataToInsert.id;
        }

        return controller.insert(TABLE_NAME, dataToInsert);
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