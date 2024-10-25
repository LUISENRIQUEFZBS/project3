const Producto = require('../models/producto');
const Carrito = require('../models/carrito');
const path = require('../utils/path');

exports.getProductos = (req, res) => {
    console.log('getProductos');
    const categoria_ruta = req.params.categoria_ruta; // Obtener la categoría desde los parámetros de la ruta 
    Producto.fetchAll(categoria_ruta).then(data => {
        const productos= data;
        const titulo='Página principal de la Tienda'
        res.render('tienda/index', {
            prods: productos,
            titulo: titulo,
            path: `/${categoria_ruta || ''}`
        });
    });
};

exports.getCarrito = (req, res, next) => {
    Carrito.getCarrito(carrito => {
        Producto.fetchAll(productos => {
            const productosCarrito = [];
            if (carrito && carrito.productos) {
             for (producto of productos) {
                 const productoEnCarrito = carrito.productos.find(
                     prod => prod.id === producto.id
                 );
                 if (productoEnCarrito) {
                     productosCarrito.push({ dataProducto: producto, cantidad: productoEnCarrito.cantidad, nombreproducto: productoEnCarrito.nombreproducto});
                 }
             }
            }
            res.render('tienda/carrito', {
                titulo: 'Mi carrito',
                path: '/carrito',
                productos: productosCarrito
            });
        });
    });
};

exports.postCarrito = (req, res) => {
    const idProducto = req.body.idProducto;
    Producto.findById(idProducto, producto => {
        Carrito.agregarProducto(idProducto, producto.precio, producto.nombreproducto);
        res.redirect('/carrito');
    });
}

exports.postEliminarProductoCarrito = (req, res) => {
    const idProducto = req.body.idProducto;
    Producto.findById(idProducto, producto =>{
        Carrito.eliminarProducto(idProducto, producto.precio);
        res.redirect('/carrito');
    });
};

exports.getProducto = (req, res) => {
    console.log('getProducto');
    const idProducto = Number(req.params.idProducto);
    Producto.findById(idProducto).then((producto) => {
        res.render('tienda/detalle-producto', {
            producto: producto,
            titulo: producto.nombre,
            path: "/"
        })
    });
}
