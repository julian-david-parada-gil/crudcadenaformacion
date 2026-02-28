/**
 * Rutas de subcategories
 * defiene los endpoints CRUD para la gestion de subcategorias
 * las subcategorias son contenedores padres de subcategorias y productos 
 * endpoints:
 * Post /api/categories crea una nueva categoria 
 * Get / api/categories obtiene todas las categorias 
 * Get / api/categories/:id obtiene una categoria por id 
 * Put /api/categories/:id actualiza una categoria por id 
 * Delete /api/categoies/:id elimina una categoria /desactivar 
 */

const express = require('express');
const router =express.Router();
const subcategoryController = require('../Controllers/subcategoryController');
const { check } = require('express-validator');
const { verifyToken } = require('../midleswares/auhJwt');
const {checkRole} = require('../middlewares/Role');

const validateSubcategory = [
    check('name')
    .not().isEmpty()
    .withmessage('el nombre es obligatorio'),

    check('desciption')
    .not().isEmpty()
    .withmessage('la descripcion es obligatorio'),

    check('category')
    .not().isEmpty()
    .withmessage('la categoria es obligatorio'),
]
//rutas CRUD

router.post('/',
    verifyToken,
    checkRole(['admin' , 'coordinador']),
    validateSubcategory,
    subcategoryController.createSubcategory
);

router.get('/', subcategoryController.getSubcategories);

router.get('/:id', subcategoryController.getSubcategoriesById);

router.put('/:id',
    verifyToken,
    checkRole(['admin' , 'coordinador']),
    subcategoryController.updateSubcategory
);

router.delete('/:id',
    verifyToken,
    checkRole(['admin']),
    subcategoryController.deleteSubcategory
);

module.exports = router;