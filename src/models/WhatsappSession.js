// src/models/WhatsappSession.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappSession = sequelize.define("WhatsappSession", {
  sessionId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  session: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default WhatsappSession;
