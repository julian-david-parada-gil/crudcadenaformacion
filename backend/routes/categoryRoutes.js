/**
 * Rutas de categorias
 * defiene los endpoints CRUD para la gestion de categorias
 * las categorias son contenedores padres de subcategorias y productos 
 * endpoints:
 * Post /api/categories crea una nueva categoria 
 * Get / api/categories obtiene todas las categorias 
 * Get / api/categories/:id obtiene una categoria por id 
 * Put /api/categories/:id actualiza una categoria por id 
 * Delete /api/categoies/:id elimina una categoria /desactivar 
 */

const express = require('express');
const router =express.Router();
const categoryController = require('../Controllers/categoryController');
const { verifyToken } = require('../midleswares/auhJwt');
const {checkRole} = require('../middlewares/Role');
//rutas CRUD

router.post('/',
    verifyToken,
    checkRole(['admin' , 'coordinador']),
    categoryController.createCategory
);

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoriesById);

router.put('/:id',
    verifyToken,
    checkRole(['admin' , 'coordinador']),
    categoryController.updateCategory
);

router.delete('/:id',
    verifyToken,
    checkRole(['admin']),
    categoryController.deleteCategory
);

module.exports = router;