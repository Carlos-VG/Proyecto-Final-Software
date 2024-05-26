const moment = require('moment');
const controlador = require('../modulos/periodosAcademicos/controlador')();

async function validarPeriodoAcademico(req, res, next) {
    const { periodo_fecha_inicio, periodo_fecha_fin } = req.body.periodoAcademico;
    const fechaInicio = moment(periodo_fecha_inicio);
    const fechaFin = moment(periodo_fecha_fin);
    const duracion = fechaFin.diff(fechaInicio, 'months', true);
    const periodoId = req.params.id;

    // Validar la duración del periodo
    if (![3, 6].includes(Math.round(duracion))) {
        return res.status(400).json({ error: "La duración del periodo académico debe ser de 3 o 6 meses" });
    }

    // Obtener todos los periodos existentes
    let periodosExistentes = await controlador.getAll();
    if (periodoId) {
        periodosExistentes = periodosExistentes.filter(p => p.periodo_id != periodoId);
    }

    // Verificar solapamientos de fechas
    const esFechaSolapada = periodosExistentes.some(periodo => {
        const existenteInicio = moment(periodo.periodo_fecha_inicio);
        const existenteFin = moment(periodo.periodo_fecha_fin);
        return (fechaInicio.isBetween(existenteInicio, existenteFin, null, '[]') ||
            fechaFin.isBetween(existenteInicio, existenteFin, null, '[]') ||
            existenteInicio.isBetween(fechaInicio, fechaFin, null, '[]') ||
            existenteFin.isBetween(fechaInicio, fechaFin, null, '[]'));
    });

    if (esFechaSolapada) {
        return res.status(400).json({ error: "El periodo académico se solapa con otro existente" });
    }

    next();
}

module.exports = validarPeriodoAcademico;
