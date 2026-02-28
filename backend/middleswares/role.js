/**
 * MIDDLEWARE control de roles de usuario 
 * 
 * sirve para verificar que el usuario autenticado tiene permiso necesarios para acceder a una ruta especifica 
 * 
 * funcion factory checckRole() permite especificar los roles permitidos 
 * funcion Helper para roles especificos isAdmin, isCoordinador, isAuxiliar
 * Requiere que el veryfyToken se haya ejecutado primero 
 * flujo:
 * verifica que el req.userRole exista
 * compara req.userRole contra lista de permitidos
 * si esta en lita continua 
 * si no esta en la lista retorna 403 Forbiden con mensaje descriptivo
 * si no existe userRole retorna 401(token corructo)
 * 
 * uso:
 * checkRole('admin') solo admin
 * checkRole('admin', 'coordinador') admin y coordinador con permisos
 * checkRole('admin', 'coordinador', 'auxiliar') admin y todos con permisos
 *Roles del sistema:
 *admin acceso total
 *coordinador no puede eliminar al gestionar usuarios
 *auziliar acceso lomotado a tareas especificas
 */

/**
 * factory function checkrole
 * retorna middleware que verifica si el usuario tiene uno de los roles permitidos
 * @param {...string} allowedRoles roles permitidos en el sistema
 * @returns {function} middleware de express
 */
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        //validar que el usuario fue autenticado y veryfyToken ejecutado
        //req,userRole es establecido por veryfyToken middleware
        if(!req.userRole) {
            return res.status(401).json({
                success: false,
                message: 'token invalido o expirado',
            });
        }

        //verificar si el rol el usuario esta en la lista de roles permitidos 
        if (!allowedRoles.includes(req.userRole)){
            return res.status(403).json ({
                success: false,
                message: `Permisos insuficientes se require: ${allowedRoles.join(' o ')}`
            });
        }
        //usuario tiene permiso continuar
        next();
    }
};
//funciones helper para roles especificos 
//verifica q el usuario es admin 
//uso: router.delete/('/admin-only', verifyToken, isAdmin, controller.method);

const isAdmin = (req, res, next) => {
    return checkRole('admin')(req, res, next);
};
// verificar si el usuario es auxiliar 
const isAuxiliar = (req, res, next) => {
    return checkRole('Auxiliar')(req, res, next);
};
// verificar si el usuario es coordinador
const isCoordinador = (req, res, next) => {
    return checkRole('Coordinador')(req, res, next);
};
//modulos a exportar 
module.exports = {
    checkRole,
    isAdmin,
    isCoordinador,
    isAuxiliar
}