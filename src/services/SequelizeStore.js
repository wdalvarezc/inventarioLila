import WhatsappStore from "../models/WhatsappStore.js";

class SequelizeStore {
  constructor() {
    this.sessionId = "default"; // 👈 puedes usar un ID por cliente
  }

  async save(data) {
    await WhatsappStore.upsert({
      id: this.sessionId,
      data,
    });
  }

  async load() {
    const record = await WhatsappStore.findByPk(this.sessionId);
    return record ? record.data : null;
  }

  async remove() {
    await WhatsappStore.destroy({ where: { id: this.sessionId } });
  }
}

export default SequelizeStore;
