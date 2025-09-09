import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Customer from "./Customer.js";

const Order = sequelize.define("Order", {
  status: {
    type: DataTypes.ENUM("pendiente", "empacar", "enviar", "entregar"),
    defaultValue: "pendiente"
  },
  deliveryDate: {
    type: DataTypes.DATE,   // fecha de entrega
    allowNull: true
  }
}, {
  timestamps: false
});

// Relación con cliente
Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(Customer, { foreignKey: "customerId" });

export default Order;