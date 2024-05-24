
const TABLE_NAME = 'tblHorario';
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
            delete dataToInsert.usuario;
            delete dataToInsert.password;
        }

        const docenteResult = await controller.insert(TABLE_NAME, dataToInsert);

        let usuarioData = {
            usuario: data.usuario,
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