// src/controllers/productController.js
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// ✅ Actualizar un producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sku, price, quantity, description, category } = req.body;

    // Buscar producto por ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar campos
    product.name = name ?? product.name;
    product.sku = sku ?? product.sku;
    product.price = price ?? product.price;
    product.quantity = quantity ?? product.quantity;
    product.category = category ?? product.category;
    product.description = description ?? product.description;

    await product.save();

    res.json({ message: "Producto actualizado", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando producto" });
  }
};