/**
 * MIDDLEWARE: Authentication JWT
 * 
 * Verifica que el usuario tenga un token valido y carga los datos del usuario en req.user
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Autenticar usuario 
 * valida el token bearer en el header Authorization
 * si no es valido carga el usuario en req.user
 * si no es valido o no existe retorna  4001 Unathorized
 */

exports.authenticate = async (req, res, next) => {
    try{
        //Extraer el token del header Bearer <token>
        const token = req.header('Authorization') ?.replace('Bearer ', '')
        
        // si no hay token rechaza l solicitud
        if (!token) {
            return res.status(401).json({
                sucess: false,
                message: 'Token de autenticacio requerido',
                details: 'Incluye Authorization Bearer <token>'
            });
        }
    }
}
