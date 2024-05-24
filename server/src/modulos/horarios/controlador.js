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
        return controller.getOne(TABLE_NAME, 'horario_id', id);
    }

    async function insert(data) {
        const dataToInsert = { ...data };
        dataToInsert.horario_duracion = calcularDuracion(data.horario_hora_inicio, data.horario_hora_fin);
        return controller.insert(TABLE_NAME, dataToInsert);
    }

    function calcularDuracion(horaInicio, horaFin) {
        const [inicioHoras, inicioMinutos, inicioSegundos] = horaInicio.split(':').map(Number);
        const [finHoras, finMinutos, finSegundos] = horaFin.split(':').map(Number);

        const inicioTotalMinutos = inicioHoras * 60 + inicioMinutos + (inicioSegundos / 60);
        const finTotalMinutos = finHoras * 60 + finMinutos + (finSegundos / 60);

        return (finTotalMinutos - inicioTotalMinutos) / 60;
    }

    async function update(data, id) {
        const dataToUpdate = { ...data };
        dataToUpdate.horario_duracion = calcularDuracion(data.horario_hora_inicio, data.horario_hora_fin);
        return controller.update(TABLE_NAME, 'horario_id', dataToUpdate, id);
    }

    async function getDocenteById(id) {
        return await controller.getOne('tblDocente', 'docente_id', id);
    }

    async function getHorariosByDocenteYPeriodo(docente_id, periodo_id) {
        const query = `SELECT * FROM tblHorario WHERE docente_id = ${docente_id} AND periodo_id = ${periodo_id}`;
        const result = await controller.executeQueryJSON(query);
        return result || [];
    }

    async function verificarDisponibilidadAmbiente(ambiente_id, dia, horaInicio, horaFin, periodo_id, horario_id) {
        let query = `
        SELECT COUNT(*) AS count
        FROM tblHorario
        WHERE ambiente_id = '${ambiente_id}' 
        AND horario_dia = '${dia}' 
        AND horario_hora_inicio < '${horaFin}' 
        AND horario_hora_fin > '${horaInicio}'
        AND periodo_id = ${periodo_id}
    `;

        // Añade la condición para excluir el horario_id actual si existe
        if (horario_id) {
            query += ` AND horario_id != ${horario_id}`;
        }

        const result = await controller.executeQueryJSON(query);
        return result[0].count === 0;
    }

    async function verificarHorarioCruzado(docente_id, dia, horaInicio, horaFin, periodo_id) {
        const query = `
            SELECT * 
            FROM tblHorario 
            WHERE docente_id = ${docente_id} 
            AND horario_dia = '${dia}' 
            AND (
                (horario_hora_inicio < '${horaFin}' AND horario_hora_fin > '${horaInicio}')
            ) 
            AND periodo_id = ${periodo_id}
        `;
        const result = await controller.executeQueryJSON(query);
        return result.length > 0;
    }

    async function iniciarTransaccion() {
        return controller.iniciarTransaccion();
    }

    async function commitTransaccion() {
        return controller.commitTransaccion();
    }

    async function rollbackTransaccion() {
        return controller.rollbackTransaccion();
    }

    return {
        getDocenteById,
        getHorariosByDocenteYPeriodo,
        verificarDisponibilidadAmbiente,
        getAll,
        getOne,
        insert,
        update,
        calcularDuracion,
        iniciarTransaccion,
        commitTransaccion,
        rollbackTransaccion,
        verificarHorarioCruzado,
    };
};
