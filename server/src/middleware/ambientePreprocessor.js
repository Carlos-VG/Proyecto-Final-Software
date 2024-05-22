const mysql = require('../DB/mysql');

async function ambientePreprocessor(req, res, next) {
    const data = req.body;

    // Validación del piso
    const matchPiso = data.ambiente_ubicacion.match(/Piso\s(\d+)/i);
    const piso = matchPiso ? parseInt(matchPiso[1], 10) : 0;

    if (piso <= 0) {
        return res.status(400).json({ error: "El piso debe ser mayor que 0 y estar correctamente especificado." });
    }

    // Preparación del código de ambiente
    const ambientes = await mysql.getAll('tblAmbiente');
    const ubicacionAbreviatura = data.ambiente_ubicacion.match(/\b(\w{5,})/g).map(word => word[0]).join('').toUpperCase();
    const ambientesEnMismoPiso = ambientes.filter(ambiente => ambiente.ambiente_id && ambiente.ambiente_id.startsWith(ubicacionAbreviatura + piso.toString()));
    const numeroAmbientesMismoPiso = ambientesEnMismoPiso.length;
    const numeroFormateado = (numeroAmbientesMismoPiso + 1).toString().padStart(2, '0');
    const ambienteCodigo = `${ubicacionAbreviatura}${piso}${numeroFormateado}`;

    // Agregar al objeto request
    req.ambienteData = {
        ...data,
        ambiente_id: ambienteCodigo,
        ambiente_estado: 1
    };

    next();
}
module.exports = ambientePreprocessor;
