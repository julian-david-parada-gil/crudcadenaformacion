/**
 * Rutas de productos
 * defiene los endpoints CRUD para la gestion de productos
 * los productos son elemntos de la subcategoria
 * endpoints:
 * Post /api/product crea una nuevo producto 
 * Get / api/product obtiene todas los productos 
 * Get / api/product/:id obtiene unm producto por id 
 * Put /api/product/:id actualiza un producto por id 
 * Delete /api/product/:id elimina un producto /desactivar 
 */

const express = require('express');
const router =express.Router();
const productController = require('../Controllers/productController');
const { check } = require('express-validator');
const { verifyToken } = require('../midleswares/auhJwt');
const {checkRole} = require('../middlewares/Role');

const validateProduct = [
    check('name')
    .not().isEmpty()
    .withmessage('el nombre es obligatorio'),

    check('desciption')
    .not().isEmpty()
    .withmessage('la descripcion es obligatorio'),

    check('price')
    .not().isEmpty()
    .withmessage('el precio es obligatorio'),

    check('stock')
    .not().isEmpty()
    .withmessage('el stock es obligatorio'),

    check('category')
    .not().isEmpty()
    .withmessage('la categoria es obligatorio'),

    check('subCategory')
    .not().isEmpty()
    .withmessage('la subCategoria es obligatorio'),
    
]
//rutas CRUD

router.post('/',
    verifyToken,
    checkRole(['admin' , 'coordinador', 'auxiliar']),
    validateProduct,
    productController.createProduct
);

router.get('/', productController.getProducts);

router.get('/:id', productController.getProductById);

router.put('/:id',
    verifyToken,
    checkRole(['admin' , 'coordinador']),
    validateProduct,
    productController.updateProduct
);

router.delete('/:id',
    verifyToken,
    checkRole(['admin']),
    productController.deleteProduct
);

module.exports = router;