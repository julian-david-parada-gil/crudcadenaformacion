/**
 * Controlador de categorias
 * *maneja todas las operaciones (CRUD) relacionadas con las categorias
 * 
 */

const Category = require('../models/Category');
/**
 * create: crear nueva categoria
 * POST /api/categories
 * auth Bearer token requerido
 * roles: admin y coordinador
 * boby requerido: 
 * name: nombre de la categoria
 * description: descripcion de la categoria
 * retorna:
 * 201: categoria creada en MongoDB
 * 400: validacion fallida o nombre duplicado
 * 500: error en base de datos
 */

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        //validacion de los campos de entrada
        if (!name || typeof name !== 'string' || name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es obligatorio y debe ser texto valido'
            });
        }

        //limpiar espacios en blanco
        const trimmedName = name.trim();
        const trimmedDesc = description.trim();

        //verificar si ya existe una categoria con el mismo nombre
        const existingCategory = await Category.findOne({ name: trimmedName });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoria con ese nombre'
            });
        }

        //crear nueva categoria
        const newCategory = new Category({
            name: trimmedName,
            description: trimmedDesc
        });

        await newCategory.save();

        rest.status(201).json({
            success: true,
            message: 'Categoria creada exitosamente',
            category: newCategory
        });
    }    catch (error) {
        console.error('Error en createCategory:', error);
        //manejo de error de indice unico
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoria con ese nombre'
            });
        }
        //Error generico del servidor
        res.status(500).json({
            success: false,
            message: 'Error al crear categoria',
            error: error.message
        });
    }
};

/**
 * GET consultar listado de categorias
 * GET /api/categories
 * por defecto retorna solo las categorias activas 
 * con incluideInactive=true retorna todas las categorias
 * incluyendo las inactivas
 * Ordena por desendente por fecha de creacion 
 * retorna:
 * 200: lista de categorias
 * 500: error en base de datos
 */

exports.getCategoryById = async (req, res) => {
    try {
    // por defecto solo las categorias activas
    //IncluideInactive=true permite ver desactivadas
    

    const category= await Category.findById(req.params.id);
    if(!category){
        return res.status(404).json({
            success: false,
            message: 'Categoria no encontrada'
        });
    }
    res.status(200).json({
        success: true,
        data: categories
    });
} catch (error) {
    console.error('Error en GetCategoryByiD', error);
    res.status(500),json({
        success: false,
        message: 'Error al obtener categoria',
        error: error.message
    });
}
};

/**
 * UPDATE Actualizar categorias existente
 * PUT /api/categories/:id
 * Auth bearer token requerido
 * roles: admin y coordinador
 * boby
 * name: Nuevo nombre de la categoria
 * description: Nueva descripcion
 * validaciones 
 * si quiere solo actualiza el nombre solo la descripcion o los dos 
 * retorna:
 * 200: categoria actualizada
 * 400: Nombre duplicado
 * 404: Categoria no encontrada
 * 505: error de base de datos
 */
exports.updateCategory = async (req,res) => {
    try {
        const { name, description} = req.body;
        const updateData = {};

        //Solo actualizar campos q fueron enviados 

        if (name) {
            updateData.name = name.trim();

            //Verificar si el nuevo ya existe en otra categoria
            const existing = await Category.findOne({
                name: updateData.name,
                _id: {$ne: req.params.id } //asegura que el nombre no sea el mismo
            });
            if(existing){
                return res.status(400).json({
                    success: false,
                    message: 'este nombre ya existe'
                });

            }
        } 
        
        if (description) {
            updateData.description = description.trim();
        }

        //Actualizar la categoria en la base de datos 
        const updateCategory = await Category.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true}
        );

        if(!updateCategory){
            return res.status(404).jsom({
                success: false,
                message: 'Categoria no encontrada'
            });
        }

        res.status(200).jsoN({
            success: true,
            message: 'Categoria actualizada exitosamemte',
            data: updateCategory
        });
    } catch (error) {
        console.error('Error en updateCategory', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoria',
            error: error.message
        });
    }
};

/**
 * Delete eliminar o desactivar una categoria
 * DELETE /api/categories/:id
 * Auth Bearer token requrido
 * roles: admin
 * query param:
 * hardDelete=true elimina permanentemente de la base de datos 
 * Default: Soft delete(solo desactivar)
 * SOFT Delete: marca la categoria como inactiva 
 * Desactiva en cascada todas las subcategorias, productos relacionados 
 * al activar retorna todos los datos incluyendo los inactivos 
 * 
 * HARD Delete: elimina permanentemente la categoria de la base de datos
 * elimina en cascada la categoria, subcategorias y productos relacionados
 * NO se puede recuperar 
 * 
 * Retorna:
 * 200: Categoria eliminada o desacivada 
 * 404: Categoria no encontrada
 * 500: Error de base de datos
 */

exports.deleteCategory = async (req, res) => {
    try {
        const SubCategory = require('../models/SubCategory');
        const Product = require('../models/Product');
        const hardDelete = req.query.hardDelete === 'true';

        //Buscar la categoria a eliminar
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Categoria no encontrada'
            });
        }
        if (isHardDelete){
            //Eliminar en cascada subcategorias y productos relacionados 
            //paso 1 obtener IDs de todas las subcategorias relacionadas
            const subIds = (await SubCategory.find({
            category: req.params.id})).map(s => s._id);
            //paso 2 eliminar todos productos de categoria
            await Product,deleteMay({ category: req.params.id });
            // paso 3 eliminar todos los productos de lasubcategorias de esta categoria
            await Product.deleteMany({ SubCategory: { $in: subIds}});
            // paso 4 eliminar todas las subcategorias de esta categoria
            await SubCategory.deleteMany({ category: req.params.id });
            //paso 5 eliminar la categoria misma 
            await Category.findByIdAndDelete(req.params.id);
            
            res.status(200).json({
                success: true,
                message: 'Categoria eliminada permanentamente y sus subcategorias y productos relacionados',
                data: {
                    category: category
                }
            });
        } else {
            //soft delete solo marcar como inactivo con cascada
            category.active = false,
            await category.save();

            //Desactivar todas las subcategorias relacionadas 
            const subcategories = await SubCategory.updateMany(
                { category: req.params.id },
                {active: false}
            );
            
            //Desactivar todos los productos relacionados por la categoria y subcategoria
            const products = await Product.updateMany(
                { category: req.params.id },
                { active: false }
            );

            res.status(200).json({
                success: true,
                message: 'categoria desactivada exitosamente y sus subcategorias y productos asociados',
                data: {
                    category: category,
                    subcategoriesDeactivated:
                    subcategories.modifiedCount,
                    productsDeactivated: products.modifiedCount
                }
            });
        } 
    } catch (error) {
        console.error('error en deleteCategory: ', error),
        res.status(500).json({
            success: false,
            message: 'error al desactivar l categoria',
            error: error.message
        });
    }
};