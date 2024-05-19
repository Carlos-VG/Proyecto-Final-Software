const axios = require('axios');
const jsonServerUrl = 'http://localhost:3000'; // Asegúrate de cambiar esto por la URL correcta

exports.getAll = async (req, res) => {
    try {
        const response = await axios.get(`${jsonServerUrl}/programas?_embed=competenciasProgramas`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programas' });
    }
};

exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`${jsonServerUrl}/programas/${id}?_embed=competenciasProgramas`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el programa' });
    }
};
