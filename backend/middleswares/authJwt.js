/**
 * MIDDLEWARE DE VERIFICACION JWT
 * Middleware para verificar y validar tokens JWT en las solicitudes
 * Se usa en rutas protegidas para autenticar usuarios
 */

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyToken = (req, res, next) => {
    try {
        let token = null;

        // Formato Authorization: Bearer <token>
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.substring(7);
        }
        // Formato x-access-token
        else if (req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        // Si no hay token
        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, config.secret);

        // Adjuntar datos del usuario al request
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            error: error.message
        });
    }
};

// Validación extra de seguridad
if (typeof verifyToken !== 'function') {
    throw new Error('verifyToken debe ser una función');
}

module.exports = { verifyToken };