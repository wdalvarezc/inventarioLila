import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import SequelizeStore from "./SequelizeStore.js";

const { Client, RemoteAuth } = pkg;

const store = new SequelizeStore();

const client = new Client({
  authStrategy: new RemoteAuth({
    store,
    backupSyncIntervalMs: 300000, // cada 5 min guarda en DB
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("📲 Escanea el QR para iniciar sesión");
});

client.on("ready", () => {
  console.log("✅ WhatsApp conectado y sesión guardada en DB");
});

client.on("disconnected", async () => {
  console.log("⚠️ Cliente desconectado, eliminando sesión...");
  await store.remove();
});

client.initialize();

export default client;
