const config = require('../config');
const logger = require('../logger');

const dbConfig = config.mysql;

// Módulo de conexión a la base de datos
const dbConnection = require('./db-connection');

// Operaciones CRUD
async function getAll(table) {
    const db = await dbConnection.getConnection();
    const schema = await db.getSchema(dbConfig.database);
    const tableObj = schema.getTable(table);
    const columnNames = (await db.sql(`SHOW COLUMNS FROM ${table}`).execute()).fetchAll().map(col => col[0]);
    const rows = (await tableObj.select(columnNames).execute()).fetchAll();
    return rows.map(row => Object.fromEntries(columnNames.map((col, i) => [col, row[i]])));
}

async function getOne(table, primaryKey, id) {
    const db = await dbConnection.getConnection();
    const schema = await db.getSchema(dbConfig.database);
    const tableObj = schema.getTable(table);
    const columnNames = (await db.sql(`SHOW COLUMNS FROM ${table}`).execute()).fetchAll().map(col => col[0]);
    const row = (await tableObj.select(columnNames).where(`${primaryKey} = :id`).bind('id', id).execute()).fetchOne();
    return row ? Object.fromEntries(columnNames.map((col, i) => [col, row[i]])) : null;
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

async function executeQuery(query) {
    try {
        const db = await dbConnection.getConnection();
        return (await db.sql(query).execute()).fetchOne();
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function executeQueryJSON(query) {
    try {
        const db = await dbConnection.getConnection();
        const result = await db.sql(query).execute();
        const columns = result.getColumns();
        const rows = result.fetchAll();

        return rows.map(row => {
            let obj = {};
            columns.forEach((col, index) => {
                obj[col.getColumnLabel()] = row[index];
            });
            return obj;
        });
    } catch (err) {
        console.error('Error executing query:', err);
        throw err;
    }
}

async function iniciarTransaccion() {
    try {
        const db = await dbConnection.getConnection();
        await db.startTransaction();
        logger.info('Transacción iniciada');
    } catch (err) {
        logger.error('Error al iniciar transacción:', err);
        throw err;
    }
}

async function commitTransaccion() {
    try {
        const db = await dbConnection.getConnection();
        await db.commit();
        logger.info('Transacción confirmada');
    } catch (err) {
        logger.error('Error al confirmar transacción:', err);
        throw err;
    }
}

async function rollbackTransaccion() {
    try {
        const db = await dbConnection.getConnection();
        await db.rollback();
        logger.info('Transacción revertida');
    } catch (err) {
        logger.error('Error al revertir transacción:', err);
        throw err;
    }
}

module.exports = {
    getAll,
    getOne,
    insert,
    update,
    remove,
    executeQuery,
    executeQueryJSON,
    iniciarTransaccion,
    commitTransaccion,
    rollbackTransaccion,
};