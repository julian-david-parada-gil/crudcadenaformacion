/**
 * Archivo de configuracion central del backend
 * Este archivo centraliza todas las configuraciones preiniciales de la aplicacion
 * configuracion de JWT tokens de autenticacion
 * configuracion de conexion a MongoDB
 * definicion de roles del sistema
 *
 * Las variables de entorno tienen prioridad sobre los valores por defecto
 */

module.exports = {
  //configuracion de jwt
  SECRET: process.env.JWT_SECRET || "tusecretoparalostokens",
  TOKEN_EXPIRATIO: process.env.JWT_EXPIRATION || "24h",

  //configuracion de base de datos
  DB: {
    URL: process.env.MONGODB_URI || "mongodb://localhost:27017/crud-mongocf",
    OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  //Roles del sistema
  ROLES: {
    ADMIN: "admin",
    COORDINADOR: "coordinador",
    AUXILIAR: "auxiliar",
  },
};
