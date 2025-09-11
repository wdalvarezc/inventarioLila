// src/services/SequelizeStore.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class WhatsappSession extends Model {}
WhatsappSession.init(
  {
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    session: {
      type: DataTypes.JSONB, // o TEXT si prefieres guardar como string
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "WhatsappSession",
  }
);

export default class SequelizeStore {
  async sessionExists(sessionId) {
    const count = await WhatsappSession.count({ where: { sessionId } });
    return count > 0;
  }

  async save(sessionId, data) {
    await WhatsappSession.upsert({ sessionId, session: data });
  }

  async getSession(sessionId) {
    const row = await WhatsappSession.findByPk(sessionId);
    return row ? row.session : null;
  }

  async delete(sessionId) {
    await WhatsappSession.destroy({ where: { sessionId } });
  }

  async listSessions() {
    const rows = await WhatsappSession.findAll({ attributes: ["sessionId"] });
    return rows.map((r) => r.sessionId);
  }
}
