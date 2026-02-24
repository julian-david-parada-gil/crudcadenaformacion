/**
 * Controlador de estadisticas
 * get /api/statistics
 * Auth breaker token requerido
 * Estadisticas disponibles:
 * total de usuarios
 * total de proyectos
 * total de ventas
 * total de categorias
 * total de subcategorias
 */

const User = require('../models/User');
const Product =require('../models/Product');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

/**
 * 
 */

const getStatistics = async (req, res) => {
    try {
        //ejecute todas las queries em paralelo
        const [totalUsers, totalProducts, totalCategories, totalSubcategories] = await Promise.all([
            User.countDocuments(), //Contar usuarios
            Product.countDocuments(), //Contar productos
            Category.countDocuments(), //Contar categorias
            Subcategory.countDocuments(), //Contar subcategorias
        ]);
        
        //Retornar las estadisticas
        res.json({
            totalUsers,
            totalProducts,
            totalCategories,
            totalSubcategories
        });
    } catch (error) {
        console.error('Error en obtener estadisticas', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las estadisticas',
            error: error.message
        });
    }
}
module.exports = { getStatistics };