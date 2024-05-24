const controladorDocente = requiere('../modulos/docente/controlador');
const controladorHorarios = requiere('../modulos/horarios/controlador');

async function validarHorario(req, res, next) {
    try {
        const { docente_id, horario_dia, horario_hora_inicio, horario_hora_fin } = req.body;
        const duracion = calcularDuracion(horario_hora_inicio, horario_hora_fin);

        // Obtener tipo de docente
        const docente = await controladorDocente.getOne(docente_id);
        if (!docente) {
            return res.status(400).send({ error: 'Docente no encontrado' });
        }

        // Validar horas semanales y diarias
        const horarios = await controlador.getHorariosByDocente(docente_id);
        const horasSemanales = calcularHorasSemanales(horarios);
        const horasDiarias = calcularHorasDiarias(horarios, horario_dia);

        if (docente.tipo === 'PT') {
            if (horasSemanales + duracion > 32) {
                return res.status(400).send({ error: 'El docente PT no puede tener más de 32 horas semanales' });
            }
            if (horasDiarias + duracion > 8) {
                return res.status(400).send({ error: 'El docente PT no puede tener más de 8 horas diarias' });
            }
        } else if (docente.tipo === 'CNT') {
            if (horasSemanales + duracion > 40) {
                return res.status(400).send({ error: 'El docente CNT no puede tener más de 40 horas semanales' });
            }
            if (horasDiarias + duracion > 10) {
                return res.status(400).send({ error: 'El docente CNT no puede tener más de 10 horas diarias' });
            }
        }

        // Verificar disponibilidad del ambiente de aprendizaje
        const ambienteDisponible = await controlador.verificarDisponibilidadAmbiente(req.body.ambiente_id, horario_dia, horario_hora_inicio, horario_hora_fin);
        if (!ambienteDisponible) {
            return res.status(400).send({ error: 'Espacio Ocupado o No disponible en la franja horario seleccionada' });
        }

        next();
    } catch (err) {
        next(err);
    }
}

function calcularDuracion(horaInicio, horaFin) {
    const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
    const [finHoras, finMinutos] = horaFin.split(':').map(Number);
    return (finHoras * 60 + finMinutos - (inicioHoras * 60 + inicioMinutos)) / 60;
}

function calcularHorasSemanales(horarios) {
    return horarios.reduce((acc, horario) => acc + calcularDuracion(horario.horario_hora_inicio, horario.horario_hora_fin), 0);
}

function calcularHorasDiarias(horarios, dia) {
    return horarios.filter(horario => horario.horario_dia === dia).reduce((acc, horario) => acc + calcularDuracion(horario.horario_hora_inicio, horario.horario_hora_fin), 0);
}

module.exports = validarHorario;
