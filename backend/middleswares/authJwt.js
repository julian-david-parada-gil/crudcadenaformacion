/**
 * MIDDLEWARE DE VERIFICACION JWT
 * middleware para verificar y validar tokens JWT en las solicitudes
 * se usa en todas las rutas protegidas para autenticar usuarios
 * caracteristicas:
 * soporta dos formatos de token
 * 1 Authorization: Bearer <token> (Estandar REST)
 * 2 x-access-token (header personalizado)
 * extrae informacion del token (id role email)
 * la adjunta a req.userId req.userRole, req,userEmail para uso en los controladores
 * manejo de errores con codigos 403/401 apropiados
 * flujo:
 * 1. lee el header Authorization o x-access-token
 * 2. Extrae el token (quita el Bearer si es necesario)
 * 3. verifica el token con JWT_SECRET
 * 4. si es valido continua al siguiente middleware
 * 5. si es valido retorna error 401 Unauthorized
 * 6. si falta retorna 403 Forbidden
 *
 * validacion del token
 * 1. verifica firma cruptogradica con JWT_SECRET
 * 2. comprueba que no haya expirado
 * 3. Extrae payload {id, role, email}
 */
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

/**
 * verificar token
 * funcionalidad
 * busca el token en las ubicaciones posibles (orden de procedencia)
 * 1.header Authorization con formato Bearer <token>
 * 2.header x-access-token
 * si encuentra el token verifica su validez
 * si no encuentra retorna 403 Forbidden
 * si token es invalido/ expirado retorna 401 Unaythorized
 * si es valido adjunta datos del usuario a req y continua 
 * 
 * Headers soportados:
 * 1.Authorization bearer <jrnbinrblkmldruikkjujuerererg...>
 * 2.x-access-token: <ujpoyukjpoyukpoyuktyrt..> id, role, email
 * propiedades del request despues del middleware:
 * req.userId = (string) Id del usuario MONGODB
 * req.userRole = (string) role del usuario (admin, coordinador, auxiliar)
 * req.userEmail = (string) email del usuario 
 */
const verifyTokenfn = (req, res, next) => {
    try{
        //soporta dos formatos Authorization bearer o access-token
        let token = null;

        //formato Authorization
        if (req.headers.authorization && req.headers.authorization.startWith('Bearer ')) {
            //Extraer token quitando el Beader
            token = req.headers.authorization.substring(7);
        }

        // formato access-token
        else if (req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        //si no encontro token rechaza la solicitud
        if(!token) {
            return res.status(403).json({
                success: false,
                message: 'token no proporcionado'
            });
        }

        //verificar el token con la clave secreta 
        const decoded = jwt.verify(token, config.seceret);

        //aduntar infirmacion del usuario al request object para que los otros middlewars y rutas puedan acceder a ella 
        req.userId = decoded.id; // id de Mongodb
        req.userRole = decoded.role; // rol de usuario
        req.Email = decoded.email; // email de usuario

        //token es valido continuar siguiente middleware o ruta
        next();
    } catch (error) {
        // token invalido o expirado
        return res.status(401).json({
            success: false,
            message: 'token invalido o expirado',
            error: error.message
        })
    }
};

/**
 * validacion de funcion para mejor seguridad y manejo de errores
 * verifica que verifyTokenfn sea una funcion valida 
 * esto es una validacion de seguridad para que el middleware se exporte correctamente 
 * si algo sale mal en su definicion lanzara un error en tiempo de carga del modulo
 */

if (typeof verifyTokenfn !== 'fuction') {
    console.error('Error: verifyTokenFn no es una funcion valida');
    throw new Error('verifyTokenFn debe ser una funcion');
}
//exportar el middleware
module.exports = {
    verifyToken : verifyTokenfn
};