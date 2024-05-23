const app = require('./app');
const { createTables } = require('./DB/DBSeeder');

createTables().then(() => {
    app.listen(app.get('port'), () => {
        console.log("Servidor escuchando en el puerto", app.get('port'));
    });
}).catch(err => {
    console.error('Error durante la inicialización de la base de datos:', err);
});
