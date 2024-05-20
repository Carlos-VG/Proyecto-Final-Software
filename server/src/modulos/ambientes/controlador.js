
const TABLE_NAME = 'tblAmbiente';
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
        return controller.getOne(TABLE_NAME, 'ambiente_id', id);
    }

    async function insert(data) {
        return controller.insert(TABLE_NAME, data);
    }

    async function update(data, id) {
        const dataToUpdate = { ...data };
        return controller.update(TABLE_NAME, 'ambiente_id', dataToUpdate, id);
    }

    async function changeState(id) {
        const obtenerDocente = await getOne(id);
        // Cambiar el estado del docente
        const nuevoEstado = obtenerDocente.Docente_estado === 1 ? 0 : 1;
        // Preparar los datos para actualizar
        const dataToUpdate = {
            ...obtenerDocente, // Suponiendo que necesitamos pasar todos los datos actuales para actualizar
            Docente_estado: nuevoEstado // Actualizar solo el estado
        };
        //retornar el docente con el nuevo estado
        return await update(dataToUpdate, id);
    }

    return {
        getAll,
        getOne,
        insert,
        update,
        changeState,
    };
};