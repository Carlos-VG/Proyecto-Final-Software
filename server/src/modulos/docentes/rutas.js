const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Docentes OK');
});

module.exports = router;