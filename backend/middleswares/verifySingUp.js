/**
 * Middleware para validar registro de usuarios
 * - checkDuplicateUsernameOrEmail: verifica que el username o email no existan
 * - checkRolesExisted: verifica que el rol enviado exista en los roles válidos
 */

const User = require('../models/User');

const roles = ['admin', 'coordinador', 'auxiliar'];

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const userByUsername = await User.findOne({ username: req.body.username });
        if (userByUsername) {
            return res.status(400).json({
                success: false,
                message: 'El username ya está en uso'
            });
        }

        const userByEmail = await User.findOne({ email: req.body.email });
        if (userByEmail) {
            return res.status(400).json({
                success: false,
                message: 'El email ya está en uso'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error validando username/email',
            error: error.message
        });
    }
};

const checkRolesExisted = (req, res, next) => {
    if (req.body.role) {
        if (!roles.includes(req.body.role)) {
            return res.status(400).json({
                success: false,
                message: `Rol no permitido: ${req.body.role}`
            });
        }
    }
    next();
};

module.exports = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};