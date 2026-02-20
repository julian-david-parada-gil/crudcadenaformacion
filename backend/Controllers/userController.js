/**
 * COntrolador de usuarios 
 * este modulo maneja todas las operaciones del crud para gestion de usuarios
 * incluye control de acceso badaso en roles
 * roles permitidos admin, coordinador, auxiliar
 * seguridad
 * las contraseñas nuenca se devuelven en respuestas
 * los auxiliares no pueden ver y actualizar otros usuarios
 * los coordiandores no pueden ver los administradores 
 * activas y desactivar usuarios
 * eliminar permanentemente un usuario solo admin
 * 
 * operaciones 
 * gerAlluser listar usuarios con filtro por rol
 * getuserByid optener usuario especifico
 * createUser crear un nuevo usuario con validacion
 * updateUser actualizar usuario con restricciones de rol
 * delete user eliminar usuario con restricciones de rol
 */

const User = require('../models/User');
const bcrypt = require('bcrypt');

/**
 * Obtener lista de usuarios
 * Get/ api/users
 * Auth token requerido
 * query params incluir activo o desactivados
 * 
 * retorma 
 * 200 array de usuarios filtrados
 * 500 Error de servidor
 */

exports.getAllUsers = async (req, res) => {
    try{
        // por defecto solo mostrar usuarios activos
        const incluideInactive = req.query.incluideInactive === 'true';
        const activeFilter = incluideInactive ? {} : { active: { $ne: false}};

        let users;
        //control de acceso basado en rol
        if (req.UserRole === 'auxiliar') {
            //los auxiliares solo pueden verse a si mismo
            users = await User.find({_id: req.userId, ...activeFilter}).select('-password');
        } else {
                //los admin y coordinadores ven todos los usuarios
                users = await User.find(activeFilter).select('-password');
            }
            res.status(200).json({
                success: true,
                data: users
            });

        } catch (error){
            console.error('[CONTROLLER] Error en getAllusers: ' , error.message);
            res.status(500).json({
                success: false,
                message: 'error al obtener todos los usuarios'
            });
        }
    }; 

/**
 * Read optener un usuario especificio por id 
 * Get /api/users/:id
 * auth token requerido
 * respuestas
 * 200 usuario encontrado
 * 403 sin permiso para ver el usuario
 * 404 usuario no encontrado
 * 500 error de servidor
 */

exports.getUserById = async (req, res) => {
    try{
        const user = await user.find(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        //validacions de acceso
        //loa auxiliares solo pueden ver su propio perfil
        if (req.userRole === 'coordinador' && role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'no puedes ver usuarios admin'
            });
        }

        res.status(200).json({
            succes: true, 
            user
        });

    } catch (error){
            console.error('Error en getUserByid', error);
            res.status(500).json({
                success: false,
                message: 'error al encontrar al usuario especifico',
                error: error.message
            });
        }
    }; 