const db = require('../../DB/mysql');

const TABLA = 'tblDocente';

function todos() {
    return db.todos(TABLA);
}

async function uno(id) {
    return db.uno(TABLA, 'docente_id', id);
}

module.exports = {
    todos,
    uno,
}