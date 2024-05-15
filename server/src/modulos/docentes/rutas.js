const express = require('express');

const respuesta = require('../../red/respuestas');
const controlador = require('./controlador');

const router = express.Router();

router.get('/', (req, res) => {
    const todos = controlador.todos()
        .then((items) => {
            respuesta.success(req, res, items, 200);
        })
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const item = await controlador.uno(id);
        respuesta.success(req, res, item, 200);
    } catch (err) {
        respuesta.error(req, res, 'Error interno', 500, err);
    }
});

module.exports = router;