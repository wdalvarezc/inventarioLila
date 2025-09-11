import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappStore = sequelize.define("WhatsappStore", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSONB, // 👈 Postgres soporta JSONB
    allowNull: false,
  },
});

export default WhatsappStore;

