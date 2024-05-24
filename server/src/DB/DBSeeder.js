const mysqlx = require('@mysql/xdevapi');
const logger = require('../logger');
const config = require('../config');

const dbConfig = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
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

async function createTables() {
    const connection = await getConnection();
    try {
        await connection.sql(`CREATE DATABASE IF NOT EXISTS ${config.mysql.database};`).execute();
        await connection.sql(`USE ${config.mysql.database};`).execute();

        await connection.sql(`
            CREATE TABLE IF NOT EXISTS tblPeriodo_Academico (
                periodo_id INT AUTO_INCREMENT PRIMARY KEY,
                periodo_nombre VARCHAR(255) NOT NULL,
                periodo_fecha_inicio DATE NOT NULL,
                periodo_fecha_fin DATE NOT NULL,
                periodo_estado INT NOT NULL,
                CHECK (periodo_estado IN (0, 1))
            );
        `).execute();

        await connection.sql(`
            CREATE TABLE IF NOT EXISTS tblDocente (
                docente_id INT AUTO_INCREMENT PRIMARY KEY,
                docente_Nombres VARCHAR(100) NOT NULL,
                docente_Apellidos VARCHAR(100) NOT NULL,
                docente_tipoIdentificacion VARCHAR(100) NOT NULL,
                docente_identificacion VARCHAR(10) NOT NULL UNIQUE,
                Docente_tipo VARCHAR(100) NOT NULL,
                Docente_tipoContrato VARCHAR(100) NOT NULL,
                Docente_Area VARCHAR(100) NOT NULL, 
                Docente_estado INT NOT NULL,
                CHECK (Docente_estado IN (0, 1)),
                CHECK (docente_tipoIdentificacion IN ('CC', 'CE')),
                CHECK (Docente_tipo IN ('Tecnico', 'Profesional')),
                CHECK (Docente_tipoContrato IN ('PT', 'CNT'))
            );
        `).execute();

        await connection.sql(`
            CREATE TABLE IF NOT EXISTS tblAmbiente (
                ambiente_id VARCHAR(50) PRIMARY KEY,
                ambiente_nombre VARCHAR(100) NOT NULL,
                ambiente_tipo VARCHAR(100) NOT NULL,
                ambiente_capacidad INT NOT NULL,
                ambiente_ubicacion VARCHAR(255) NOT NULL,
                ambiente_estado INT NOT NULL,
                CHECK (ambiente_estado IN (0, 1)),
                CHECK (ambiente_tipo IN ('Virtual', 'Presencial'))
            );
        `).execute();

        // await connection.sql(`
        //     CREATE TABLE IF NOT EXISTS tblPrograma (
        //         programa_id INT AUTO_INCREMENT PRIMARY KEY,
        //         programa_nombre VARCHAR(100) NOT NULL
        //     );
        // `).execute();

        // await connection.sql(`
        //     CREATE TABLE IF NOT EXISTS tblCompetencia (
        //         competencia_id INT AUTO_INCREMENT PRIMARY KEY,
        //         competencia_nombre VARCHAR(100) NOT NULL,
        //         competencia_tipo VARCHAR(100) NOT NULL,
        //         competencia_estado INT NOT NULL,
        //         CHECK (competencia_estado IN (0, 1)),
        //         CHECK (competencia_tipo IN ('Generica', 'Especifica'))
        //     );
        // `).execute();

        // await connection.sql(`
        //     CREATE TABLE IF NOT EXISTS tblCompetencia_Programa (
        //         competencia_id INT NOT NULL,
        //         programa_id INT NOT NULL,
        //         PRIMARY KEY (competencia_id, programa_id),
        //         FOREIGN KEY (competencia_id) REFERENCES tblCompetencia(competencia_id),
        //         FOREIGN KEY (programa_id) REFERENCES tblPrograma(programa_id)
        //     );
        // `).execute();

        await connection.sql(`
            CREATE TABLE IF NOT EXISTS tblPeriodo_Programa (
                periodo_id INT NOT NULL,
                programa_id INT NOT NULL,
                PRIMARY KEY (periodo_id, programa_id),
                FOREIGN KEY (periodo_id) REFERENCES tblPeriodo_Academico(periodo_id)
            );
        `).execute();

        await connection.sql(`
            CREATE TABLE IF NOT EXISTS tblHorario (
                horario_id INT AUTO_INCREMENT PRIMARY KEY,
                horario_dia VARCHAR(50) NOT NULL,
                horario_hora_inicio TIME NOT NULL,
                horario_hora_fin TIME NOT NULL,
                horario_duracion INT NOT NULL,
                docente_id INT NOT NULL,
                periodo_id INT NOT NULL,
                ambiente_id VARCHAR(50) NOT NULL,
                competencia_id INT NOT NULL,
                programa_id INT NOT NULL,
                FOREIGN KEY (periodo_id) REFERENCES tblPeriodo_Academico(periodo_id),
                FOREIGN KEY (docente_id) REFERENCES tblDocente(docente_id),
                FOREIGN KEY (ambiente_id) REFERENCES tblAmbiente(ambiente_id),
                CHECK (horario_dia IN ('LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'))
            );
        `).execute();

        await connection.sql(`
            CREATE TABLE IF NOT EXISTS tblUsuario (
                usu_id INT AUTO_INCREMENT PRIMARY KEY,
                usu_login VARCHAR(100) NOT NULL UNIQUE,
                usu_pwd VARCHAR(255) NOT NULL,
                usu_rol VARCHAR(50) NOT NULL,
                docente_id INT,
                CHECK (usu_rol IN ('coordinador', 'docente'))
            );
        `).execute();

        logger.info('Tablas creadas correctamente');
    } catch (err) {
        logger.error('Error creando tablas:', err);
        throw err;
    }
}

module.exports = {
    createTables
};
