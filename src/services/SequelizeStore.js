// src/services/SequelizeStore.js
import WhatsappSession from "../models/WhatsappSession.js";

class SequelizeStore {
    async sessionExists(sessionId) {
        const id = typeof sessionId === "object" ? sessionId.session : sessionId;
        return (await WhatsappSession.count({ where: { session: id } })) > 0;
    }

    async save(sessionId, data) {
        await WhatsappSession.upsert({
            sessionId,
            session: JSON.stringify(data),
        });
    }

    async get(sessionId) {
        const record = await WhatsappSession.findOne({ where: { sessionId } });
        return record ? JSON.parse(record.session) : null;
    }

    async remove(sessionId) {
        await WhatsappSession.destroy({ where: { sessionId } });
    }
}

export default SequelizeStore;
