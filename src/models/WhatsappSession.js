import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const WhatsappSession = sequelize.define("WhatsappSession", {
  id: {
    type: DataTypes.STRING,  // o UUID si prefieres
    primaryKey: true,        // 🔑 IMPORTANTE
  },
  session: {
    type: DataTypes.TEXT,
  },
  data: {
    type: DataTypes.JSONB,   // si usas Postgres
  }
}, {
  timestamps: true,
});

export default WhatsappSession;