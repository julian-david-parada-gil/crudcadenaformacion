//carga la variables de entorno desde .env
require('dotenv').config();

module.exports={
    //Clave para firmar los tokens de jwt
    secret: process.env.JWT_SECRET || 
    "tusecretoparalostokens",
    // tiempo de expiracion del tokens en segundos
    jwtExpiration: process.env.JWT_EXPIRATION || 
    86400, // 24 horas
    // tiempo de expiracion de refrescar token
    jwtRefresh:  6048000, // 7 dias
    //numero de rondas para encriptar la contraseña
    slatRounds: process.env.SALT_ROUNDS || 8
};