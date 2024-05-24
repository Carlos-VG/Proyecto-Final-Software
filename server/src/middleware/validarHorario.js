const controlador = require('../modulos/horarios/controlador')();

async function validarHorario(req, res, next) {
    try {
        const { docente_id, periodo_id, horario_dia, horario_hora_inicio, horario_hora_fin } = req.body;
        const duracion = controlador.calcularDuracion(horario_hora_inicio, horario_hora_fin);
        const horarioId = req.params.id; // Detectamos si es una actualización

        // Iniciar transacción
        await controlador.iniciarTransaccion();

        // Obtener tipo de docente
        const docente = await controlador.getDocenteById(docente_id);
        if (!docente) {
            await controlador.rollbackTransaccion();
            return res.status(400).send({ error: 'Docente no encontrado' });
        }

        // Validar horas semanales y diarias considerando solo el periodo actual
        let horarios = await controlador.getHorariosByDocenteYPeriodo(docente_id, periodo_id);
        if (!horarios) {
            horarios = [];
        }

        // En caso de actualización, excluir el horario actual de los cálculos
        if (horarioId) {
            horarios = horarios.filter(horario => horario.horario_id !== parseInt(horarioId));
        }

        // Incluir la duración del nuevo horario en los cálculos
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

        const ambienteDisponible = await controlador.verificarDisponibilidadAmbiente(req.body.ambiente_id, horario_dia, horario_hora_inicio, horario_hora_fin, periodo_id);
        if (!ambienteDisponible) {
            await controlador.rollbackTransaccion();
            return res.status(400).send({ error: 'Espacio Ocupado o No disponible en la franja horario seleccionada' });
        }

        // Aquí puedes insertar o actualizar el horario en la base de datos
        if (horarioId) {
            await controlador.update(req.body, horarioId);
        } else {
            await controlador.insert(req.body);
        }

        // Hacer commit si todas las validaciones y operaciones fueron exitosas
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
