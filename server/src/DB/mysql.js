const mysqlx = require('@mysql/xdevapi');
const config = require('../config');

const dbConfig = config.mysql;

// Módulo de conexión a la base de datos
const dbConnection = require('./db-connection');

// Operaciones CRUD
async function getAll(table) {
    const db = await dbConnection.getConnection();
    const tableObj = db.getSchema(dbConfig.database).getTable(table);
    const result = await tableObj.select().execute();
    return result.fetchAll();
}

async function getOne(table, primaryKey, id) {
    const db = await dbConnection.getConnection();
    const tableObj = db.getSchema(dbConfig.database).getTable(table);
    const result = await tableObj.select().where(`${primaryKey} = :id`).bind('id', id).execute();
    return result.fetchOne();
}

async function insert(table, data) {
    const db = await dbConnection.getConnection();
    const tableObj = db.getSchema(dbConfig.database).getTable(table);
    const result = await tableObj.insert(data).execute();
    return result.getAutoIncrementValue();
}

async function update(table, primaryKey, data, id) {
    const db = await dbConnection.getConnection();
    const tableObj = db.getSchema(dbConfig.database).getTable(table);
    const updateQuery = tableObj.update();
    Object.keys(data).forEach(key => {
        if (key !== primaryKey) {
            updateQuery.set(key, data[key]);
        }
    });
    const result = await updateQuery.where(`${primaryKey} = :id`).bind('id', id).execute();
    return { affectedItems: result.getAffectedItemsCount() };
}

async function remove(table, primaryKey, id) {
    const db = await dbConnection.getConnection();
    const tableObj = db.getSchema(dbConfig.database).getTable(table);
    const result = await tableObj.delete().where(`${primaryKey} = :id`).bind('id', id).execute();
    return { affectedItems: result.getAffectedItemsCount() };
}

async function getByUser(tabla, columna, usuario) {
    const db = await dbConnection.getConnection();
    const tableObj = db.getSchema(dbConfig.database).getTable(tabla);
    const result = await tableObj.select().where(`${columna} = :usuario`).bind('usuario', usuario).execute();
    return result.fetchOne();
}

module.exports = {
    getAll,
    getOne,
    insert,
    update,
    remove,
    getByUser,
};