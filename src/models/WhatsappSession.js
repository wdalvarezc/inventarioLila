// src/models/WhatsappSession.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappSession = sequelize.define("WhatsappSession", {
  session: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  data: {
    type: DataTypes.JSONB, // JSONB es lo ideal en Postgres
    allowNull: false,
  },
}, {
  tableName: "WhatsappSessions", // 👈 el nombre exacto de la tabla
});

export default WhatsappSession;
