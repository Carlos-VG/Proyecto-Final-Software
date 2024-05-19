const config = require('../config');

const dbConfig = config.mysql;

// Módulo de conexión a la base de datos
const dbConnection = require('./db-connection');

// Operaciones CRUD
async function getAll(table) {
    const db = await dbConnection.getConnection();
    const schema = await db.getSchema(dbConfig.database);
    const tableObj = schema.getTable(table);
    const columnsMetadata = await db.sql(`SHOW COLUMNS FROM ${table}`).execute();
    const columnNames = columnsMetadata.fetchAll().map(col => col[0]);
    const result = await tableObj.select(columnNames).execute();

    const rows = result.fetchAll();
    const objects = rows.map(row => {
        let obj = {};
        row.forEach((value, index) => {
            obj[columnNames[index]] = value;
        });
        return obj;
    });

    return objects;
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

async function executeQuery(query) {
    try {
        const db = await dbConnection.getConnection();
        return (await db.sql(query).execute()).fetchOne();
    } catch (err) {
        console.error('Error executing query:', err);
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
};