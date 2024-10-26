const db = require("../utils/database");
const productosCollection = db.collection("productos");
const categoriasCollection = db.collection("categorias");

class Producto {
  constructor(
    id,
    nombreproducto,
    urlImagen,
    precio,
    descripcion,
    caracteristicas,
    categoria_id
  ) {
    this.id = id;
    this.nombreproducto = nombreproducto;
    this.urlImagen = urlImagen;
    this.precio = precio;
    this.descripcion = descripcion;
    this.caracteristicas = caracteristicas;
    this.categoria_id = categoria_id;
  }

  async save() {
    console.log("[models/producto.js > save]");
    const producto = {
      nombreproducto: this.nombreproducto,
      urlImagen: this.urlImagen,
      precio: this.precio,
      descripcion: this.descripcion,
      caracteristicas: this.caracteristicas,
      categoria_id: this.categoria_id,
    };
    return await productosCollection.insertOne(producto);
  }

  static async fetchAll(ruta) {
    console.log("[models/producto.js > fetchAll]");
    let result = [];
    if (ruta) {
      const categoria = await db
        .collection("categorias")
        .findOne({ ruta: ruta });
      result = productosCollection
        .find({ categoria_id: categoria.id })
        .toArray();
    } else {
      result = productosCollection.find().toArray();
    }
    return result;
  }

  static async findById(id) {
    const result = await productosCollection.findOne({ id: id });
    return result;
  }

  static async getCategorias() {
    const result = await categoriasCollection.find().toArray();
    return result;
  }

  static async update(id, updatedData) {
    const result = await productosCollection.updateOne(
      { id: id },
      {
        $set: {
          nombreproducto: updatedData.nombreproducto,
          urlImagen: updatedData.urlImagen,
          precio: updatedData.precio,
          descripcion: updatedData.descripcion,
          caracteristicas: updatedData.caracteristicas,
          categoria_id: updatedData.categoria_id,
        },
      }
    );
    return result;
  }

  static async deleteById(id) {
    console.log("[models/producto.js > deleteById]");
    console.log(id);
    const result = await productosCollection.deleteOne({ id: id });
    console.log(result);
    return result;
  }
}
module.exports = Producto;
