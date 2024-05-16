const TABLA = 'tblDocente';

module.exports = function (dbInyectada) {

    let db = dbInyectada;

    if (!db) {
        db = require('../../DB/mysql');
    }

    function todos() {
        return db.todos(TABLA);
    }

    function uno(id) {
        return db.uno(TABLA, 'docente_id', id);
    }

    function agregar(body) {
        let data = { ...body };

        if ('id' in data) {
            data.docente_id = data.id;
            delete data.id;
        }
        return db.agregar(TABLA, data);
    }

    function actualizar(body) {
        return db.actualizar(TABLA, 'docente_id', body);
    }

    function eliminar(body) {
        return db.eliminar(TABLA, 'docente_id', body);
    }

    return {
        todos,
        uno,
        agregar,
        actualizar,
        eliminar,
    }
}