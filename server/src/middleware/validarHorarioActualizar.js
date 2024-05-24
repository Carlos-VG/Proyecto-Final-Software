const controlador = require('../modulos/horarios/controlador')();

async function validarHorarioActualizar(req, res, next) {
    try {
        const { docente_id, periodo_id, horario_dia, horario_hora_inicio, horario_hora_fin, ambiente_id } = req.body;
        const horarioId = req.params.id; // Detectamos si es una actualización

        // Obtener el horario actual
        const horarioActual = await controlador.getOne(horarioId);
        if (!horarioActual) {
            return res.status(404).send({ error: 'Horario no encontrado' });
        }

        // Obtener tipo de docente
        const docente = await controlador.getDocenteById(docente_id);
        if (!docente) {
            return res.status(400).send({ error: 'Docente no encontrado' });
        }

        // Calcular la duración del nuevo horario
        const duracion = controlador.calcularDuracion(horario_hora_inicio, horario_hora_fin);

        // Validar horas semanales y diarias considerando solo el periodo actual
        let horarios = await controlador.getHorariosByDocenteYPeriodo(docente_id, periodo_id);
        if (!horarios) {
            horarios = [];
        }

        // Excluir el horario actual de los cálculos
        horarios = horarios.filter(horario => horario.horario_id !== parseInt(horarioId));

        // Incluir la duración del nuevo horario en los cálculos
        const horasSemanales = calcularHorasSemanales(horarios) + duracion;
        const horasDiarias = calcularHorasDiarias(horarios, horario_dia) + duracion;

        if (docente.Docente_tipoContrato === 'PT') {
            if (horasSemanales > 32) {
                return res.status(400).send({ error: 'El docente PT no puede tener más de 32 horas semanales' });
            }
            if (horasDiarias > 8) {
                return res.status(400).send({ error: 'El docente PT no puede tener más de 8 horas diarias' });
            }
        } else if (docente.Docente_tipoContrato === 'CNT') {
            if (horasSemanales > 40) {
                return res.status(400).send({ error: 'El docente CNT no puede tener más de 40 horas semanales' });
            }
            if (horasDiarias > 10) {
                return res.status(400).send({ error: 'El docente CNT no puede tener más de 10 horas diarias' });
            }
        }

        // Verificar disponibilidad del ambiente de aprendizaje
        const ambienteDisponible = await controlador.verificarDisponibilidadAmbienteActualizar(ambiente_id, horario_dia, horario_hora_inicio, horario_hora_fin, periodo_id, horarioId);
        if (!ambienteDisponible) {
            return res.status(400).send({ error: 'Espacio Ocupado o No disponible en la franja horario seleccionada' });
        }

        // verificar si el horario se cruza con otro horario en otro ambiente
        const horarioCruzado = await controlador.verificarHorarioCruzado(docente_id, horario_dia, horario_hora_inicio, horario_hora_fin, periodo_id);
        if (horarioCruzado) {
            return res.status(400).send({ error: 'Horario se cruza con otro horario en otro ambiente' });
        }

        next();
    } catch (err) {
        next(err);
    }
}

function calcularHorasSemanales(horarios) {
    return horarios.reduce((acc, horario) => acc + controlador.calcularDuracion(horario.horario_hora_inicio, horario.horario_hora_fin), 0);
}

function calcularHorasDiarias(horarios, dia) {
    return horarios.filter(horario => horario.horario_dia === dia).reduce((acc, horario) => acc + controlador.calcularDuracion(horario.horario_hora_inicio, horario.horario_hora_fin), 0);
}

module.exports = validarHorarioActualizar;
