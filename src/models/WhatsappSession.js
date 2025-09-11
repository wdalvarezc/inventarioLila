// src/models/WhatsappSession.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappSession = sequelize.define(
  "WhatsappSession",
  {
    session: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB, // Usamos JSONB en Postgres
      allowNull: false,
    },
  },
  {
    tableName: "WhatsappSessions",
  }
);

export default WhatsappSession;
