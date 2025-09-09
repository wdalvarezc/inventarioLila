import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database.js";
import cors from 'cors';

// Importar modelos (importante para sync)
import "./models/Product.js";
import "./models/Customer.js";
import "./models/Order.js";
import "./models/OrderItem.js";

import productRoutes from "./routes/productRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);

// Conexión y sync
sequelize.sync({ Alter: true }).then(() => {
  console.log("✅ Tablas creadas/sincronizadas");
});

export default app;