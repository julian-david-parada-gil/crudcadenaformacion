/**
 * archivo indice de middlewares
 * centraliza la importacion de todos los widdlewares de autenticacion y autorizacion
 * permite importar multiples middleswares de forma concisa en las rutas
 */

const authJWT = require('./authJWT');
const verifySingUp = require('./verifySingUp');

// exportar los middleswares agrupados or modulo

module.exports = {
    authJWT: require('./authJWT'),
    verifySingUp: require('./verifySingUp'),
    role: require('./role')
};
