// src/controllers/orderController.js
import { Op } from "sequelize";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const { customerId, items, deliveryDate, description } = req.body;

  try {
    const order = await Order.create({ customerId, deliveryDate });

    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({ message: "Stock insuficiente para " + product?.name });
      }

      // Crear detalle
      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price * item.quantity
        description: product.description
      });

      // Restar stock
      product.quantity -= item.quantity;
      await product.save();
    }

    res.status(201).json({ message: "Pedido creado", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getOrders = async (req, res) => {
  const orders = await Order.findAll({ include: { all: true } });
  res.json(orders);
};
export const getOrdersDate = async (req, res) => {
  const { date } = req.query; // fecha enviada como ?date=YYYY-MM-DD
  const where = {};

  if (date) {
    // Normalizamos a inicio y fin del día para capturar todas las horas
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    where.deliveryDate = {
      [Op.between]: [start, end]
    };
  }

  try {
    const orders = await Order.findAll({
      where,
      include: [
        { model: Customer, attributes: ["id", "name", "address"] },
        {
          model: Product,
          attributes: ["id", "name", "sku"],
          through: { attributes: ["quantity", "price"] }
        }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 🔹 Cambiar estado del pedido
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByPk(id, {
      include: [
        {
          model: Customer,
          as: "Customer",
          attributes: ["name", "phone"], // 👈 seleccionas solo lo que quieras
        },
      ],
    });
    if (!order) return res.status(404).json({ message: "Pedido no encontrado" });

    // Validar que el estado sea válido
    const validStatuses = ["pendiente", "empacar", "enviar", "entregar"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    order.status = status;
    await order.save();
    res.json({ message: "Estado actualizado", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
