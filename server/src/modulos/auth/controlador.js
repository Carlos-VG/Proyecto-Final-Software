const TABLE_NAME = 'tblusuario';
const bcrypt = require('bcrypt');
const auth = require('../../../auth');
const logger = require('../../logger');

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
    }

    async function login(usuario, password) {
        try {
            const query = `SELECT * FROM ${TABLE_NAME} WHERE usu_login = '${usuario}'`;
            const data = await controller.executeQuery(query);

            return bcrypt.compare(password, data[2])
                .then((res) => {
                    if (res === true) {
                        const payload = {
                            id: data[0],
                            username: data[1],
                            rol: data[3]
                        };
                        if (data[3] === 'docente') {
                            payload.docente_id = data[4];
                        }
                        return auth.asignarToken(payload);
                    } else {
                        throw new Error('Credenciales incorrectas');
                    }
                });

        } catch (err) {
            console.error("error al asignar token", err);
            throw err;
        }
    }


    async function insert(data) {
        const authData = {
            usu_login: data.usuario,
            usu_pwd: await bcrypt.hash(data.password, 5),
            usu_rol: data.rol,
            docente_id: data.docente_id,
        };

        return controller.insert(TABLE_NAME, authData);
    }

    return {
        insert,
        login,
    };
};