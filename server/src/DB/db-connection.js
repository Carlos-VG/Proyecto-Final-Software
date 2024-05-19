const mysqlx = require('@mysql/xdevapi');
const config = require('../config');
const logger = require('../logger');

const dbConfig = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    schema: config.mysql.database,
};

let connection;

async function getConnection() {
    try {
        if (!connection) {
            connection = await mysqlx.getSession(dbConfig);
            logger.info('Conexión a la base de datos establecida');
        }
        return connection;
    } catch (err) {
        logger.error('Error al conectar a la base de datos:', err);
        throw err;
    }
}

module.exports = {
    getConnection,
};