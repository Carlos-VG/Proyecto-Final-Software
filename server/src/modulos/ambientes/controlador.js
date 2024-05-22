
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
        // Validación del piso
        const matchPiso = data.ambiente_ubicacion.match(/Piso\s(\d+)/i);
        const piso = matchPiso ? parseInt(matchPiso[1], 10) : 0;  // Convertimos el resultado a número para validarlo

        if (piso <= 0) {
            throw new Error("El piso debe ser mayor que 0 y estar correctamente especificado.");
        }

        const ambientes = await getAll();

        const ubicacionAbreviatura = data.ambiente_ubicacion.match(/\b(\w{5,})/g).map(word => word[0]).join('').toUpperCase();
        const ambientesEnMismoPiso = ambientes.filter(ambiente => ambiente.ambiente_id && ambiente.ambiente_id.startsWith(ubicacionAbreviatura + piso.toString()));

        const numeroAmbientesMismoPiso = ambientesEnMismoPiso.length;

        const numeroFormateado = (numeroAmbientesMismoPiso + 1).toString().padStart(2, '0');
        const ambienteCodigo = `${ubicacionAbreviatura}${piso}${numeroFormateado}`;

        const dataWithCodigo = {
            ...data,
            ambiente_id: ambienteCodigo,
            ambiente_estado: 1
        };

        return controller.insert(TABLE_NAME, dataWithCodigo);
    }



    async function update(data, id) {
        const dataToUpdate = { ...data };
        return controller.update(TABLE_NAME, 'ambiente_id', dataToUpdate, id);
    }

    async function changeState(id) {
        const obtenerAmbiente = await getOne(id);
        // Cambiar el estado del docente
        const nuevoEstado = obtenerAmbiente.ambiente_estado === 1 ? 0 : 1;
        // Preparar los datos para actualizar
        const dataToUpdate = {
            ...obtenerAmbiente, // Suponiendo que necesitamos pasar todos los datos actuales para actualizar
            ambiente_estado: nuevoEstado // Actualizar solo el estado
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