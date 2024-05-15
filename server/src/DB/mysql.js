const mysqlx = require('@mysql/xdevapi');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    port: 33060,
    user: config.mysql.user,
    password: config.mysql.password,
    schema: config.mysql.database
}


let session;

async function conMysql() {
    try {
        session = await mysqlx.getSession(dbconfig);
        console.log('DB conectada');
    } catch (err) {
        console.log('[db err]', err);
        setTimeout(conMysql, 2000);
    }
}

conMysql();


async function todos(tabla) {
    if (!session) {
        await conMysql();
    }
    try {
        const table = session.getSchema(dbconfig.schema).getTable(tabla);
        const result = await table.select().execute();
        return result.fetchAll();
    } catch (err) {
        throw err;
    }
}

async function uno(tabla, primaryKey, id) {
    if (!session) {
        await conMysql();
    }
    try {
        const table = session.getSchema(dbconfig.schema).getTable(tabla);
        // Utiliza el nombre de la clave primaria directamente en la consulta
        const result = await table.select().where(`${primaryKey} = :id`).bind('id', id).execute();
        return result.fetchOne();
    } catch (err) {
        throw err;
    }
}


function agregar(tabla, data) {

}

function eliminar(tabla, id) {

}


module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
}