const moment = require('moment'); // Asegúrate de tener 'moment' instalado para manejar fechas

async function validarPeriodoAcademico(req, res, next) {
    const { periodo_fecha_inicio, periodo_fecha_fin } = req.body.periodoAcademico;
    const fechaInicio = moment(periodo_fecha_inicio);
    const fechaFin = moment(periodo_fecha_fin);
    const duracion = fechaFin.diff(fechaInicio, 'months', true);

    // Validar la duración del periodo
    if (![3, 6].includes(Math.round(duracion))) {
        return res.status(400).json({ error: "La duración del periodo debe ser de 3 o 6 meses" });
    }

    // Validar que no existan periodos con la misma fecha de inicio
    const periodosExistentes = await controlador.getAll();
    const fechaInicioExistente = periodosExistentes.some(periodo =>
        moment(periodo.periodo_fecha_inicio).isSame(fechaInicio, 'day'));

    if (fechaInicioExistente) {
        return res.status(400).json({ error: "Ya existe un periodo académico que comienza en esta fecha" });
    }

    next();
}

module.exports = validarPeriodoAcademico;