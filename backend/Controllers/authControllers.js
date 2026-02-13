/**
 * Controlador de autenticación
 * Maneja el registro login y generacion de token JWT
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

/** SINGUP : crear nuevo usuario
* POST /api/auth/signup
*Body {username, email, password, role}
*crea un nuevo usuario en la base de datos
*emcripta la contraseña antes de guardar con bcrypt
*genera un token JWT 
*retorna el usuario sin mostrar la contraseña
*/

exports.signup = async (req, res) => {
    try{
        ///Crear nuevo usuario
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'auxiliar' // rol por defecto
        });
        
        //Guardar usuario en la base de datos
        //la contraaseña se encripta automatizamente en el middleware del modelo
        const savedUser = await user.save();

        //Generar token JWT que expira en 24 horas
        const token = jwt.sign(
            { 
                id: savedUser._id,
                role: savedUser.role,
                email: savedUser.email
            },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );
            //preparando respuesta sin la contraseña
            const userResponse = {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
            };

            res.status(201).json({
                sucess: true,
                message: 'Usuario registrado exitosamente',
                token: token,
                user: userResponse
            });
    } catch (error){
        return res.status(500).json({
            sucess: false,
            message: 'Error en el registro del usuario',
            error: error.message
            });
    }
};


