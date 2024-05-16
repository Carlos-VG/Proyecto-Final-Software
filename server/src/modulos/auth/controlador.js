const TABLE_NAME = 'tblusuario';
const bcrypt = require('bcrypt');
const auth = require('../../../auth');

module.exports = function (injectedController) {
    let controller = injectedController;

    if (!controller) {
        controller = require('../../DB/mysql');
    }

    async function login(usuario, password) {
        const data = await controller.getByUser(TABLE_NAME, 'usu_login', usuario);

        return bcrypt.compare(password, data.usu_pwd)
            .then((res) => {
                if (res === true) {
                    return auth.asignarToken({ ...data });
                } else {
                    throw new Error('Credenciales incorrectas');
                }
            });
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