const mysqlx = require('@mysql/xdevapi');
const config = require('../config');
const e = require('express');

const dbconfig = {
    host: config.mysql.host,
    port: config.mysql.port,
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
        const result = await table.select().where(`${primaryKey} = :id`).bind('id', id).execute();
        return result.fetchOne();
    } catch (err) {
        throw err;
    }
}

async function agregar(tabla, data) {
    if (!session) {
        await conMysql();
    }
    try {
        const table = session.getSchema(dbconfig.schema).getTable(tabla);
        const result = await table.insert(data).execute();
        return result.getAutoIncrementValue();
    } catch (err) {
        throw err;
    }
}

async function actualizar(tabla, primaryKey, data) {
    if (!session) {
        await conMysql();
    }
    try {
        const table = session.getSchema(dbconfig.schema).getTable(tabla);
        const updateQuery = table.update();
        Object.keys(data).forEach(key => {
            if (key !== 'id') {
                updateQuery.set(key, data[key]);
            }
        });
        const result = await updateQuery.where(`${primaryKey} = :id`).bind('id', data.id).execute();
        return { affectedItems: result.getAffectedItemsCount() };
    } catch (err) {
        throw err;
    }
}


async function eliminar(tabla, primaryKey, data) {
    if (!session) {
        await conMysql();
    }
    try {
        const table = session.getSchema(dbconfig.schema).getTable(tabla);
        const result = await table.delete().where(`${primaryKey} = :id`).bind('id', data.id).execute();
        return { affectedItems: result.getAffectedItemsCount() };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    todos,
    uno,
    agregar,
    actualizar,
    eliminar,
}