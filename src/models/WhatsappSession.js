import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappSession = sequelize.define("WhatsappSession", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  session: {
    type: DataTypes.JSONB, // Guardamos la sesión como JSON
    allowNull: false,
  },
}, {
  tableName: "whatsapp_sessions",
  timestamps: true,
});

export default WhatsappSession;
