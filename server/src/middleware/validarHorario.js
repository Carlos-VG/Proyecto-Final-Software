const controlador = require('../modulos/horarios/controlador')();

async function validarHorario(req, res, next) {
    try {
        await controlador.iniciarTransaccion();

        const { docente_id, periodo_id, horario_dia, horario_hora_inicio, horario_hora_fin } = req.body;
        const duracion = controlador.calcularDuracion(horario_hora_inicio, horario_hora_fin);
        const horarioId = req.params.id; //por si es una actualizacion

        const docente = await controlador.getDocenteById(docente_id);
        if (!docente) {
            await controlador.rollbackTransaccion();
            return res.status(400).send({ error: 'Docente no encontrado' });
        }
        // Validar horas semanales y diarias considerando solo el periodo actual
        let horarios = await controlador.getHorariosByPeriodoYDocente(docente_id, periodo_id);
        if (!horarios) {
            horarios = [];
        }
        // En caso de actualización, excluir el horario actual de los cálculos
        if (horarioId) {
            horarios = horarios.filter(horario => horario.horario_id !== parseInt(horarioId));
        }
        const horasSemanales = calcularHorasSemanales(horarios) + duracion;
        const horasDiarias = calcularHorasDiarias(horarios, horario_dia) + duracion;

        if (docente.Docente_tipoContrato === 'PT') {
            if (horasSemanales > 32) {
                await controlador.rollbackTransaccion();
                return res.status(400).send({ error: 'El docente PT no puede tener más de 32 horas semanales' });
            }
            if (horasDiarias > 8) {
                await controlador.rollbackTransaccion();
                return res.status(400).send({ error: 'El docente PT no puede tener más de 8 horas diarias' });
            }
        } else if (docente.Docente_tipoContrato === 'CNT') {
            if (horasSemanales > 40) {
                await controlador.rollbackTransaccion();
                return res.status(400).send({ error: 'El docente CNT no puede tener más de 40 horas semanales' });
            }
            if (horasDiarias > 10) {
                await controlador.rollbackTransaccion();
                return res.status(400).send({ error: 'El docente CNT no puede tener más de 10 horas diarias' });
            }
        }
        // Verificar disponibilidad del ambiente de aprendizaje
        const ambienteDisponible = await controlador.verificarDisponibilidadAmbiente(req.body.ambiente_id, horario_dia, horario_hora_inicio, horario_hora_fin, periodo_id, horarioId);
        if (!ambienteDisponible) {
            await controlador.rollbackTransaccion();
            return res.status(400).send({ error: 'Espacio Ocupado o No disponible en la franja horario seleccionada' });
        }
        // verificar si el horario se cruza con otro horario en otro ambiente
        const horarioCruzado = await controlador.verificarHorarioCruzado(docente_id, horario_dia, horario_hora_inicio, horario_hora_fin, periodo_id);
        if (horarioCruzado) {
            await controlador.rollbackTransaccion();
            return res.status(400).send({ error: 'Ambiente inexistente o posible cruce de horarios' });
        }

        await controlador.commitTransaccion();

        next();
    } catch (err) {
        await controlador.rollbackTransaccion();
        next(err);
    }
}

function calcularHorasSemanales(horarios) {
    return horarios.reduce((acc, horario) => acc + controlador.calcularDuracion(horario.horario_hora_inicio, horario.horario_hora_fin), 0);
}

function calcularHorasDiarias(horarios, dia) {
    return horarios.filter(horario => horario.horario_dia === dia).reduce((acc, horario) => acc + controlador.calcularDuracion(horario.horario_hora_inicio, horario.horario_hora_fin), 0);
}

module.exports = validarHorario;
