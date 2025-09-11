// src/models/WhatsappSession.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappSession = sequelize.define("WhatsappSession", {
  session: {
    type: DataTypes.JSON, // usamos JSON en vez de STRING
    allowNull: false,
  },
});

export default WhatsappSession;

