// src/services/whatsappClient.js
import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import SequelizeStore from "./SequelizeStore.js";

const { Client, RemoteAuth } = pkg;

const store = new SequelizeStore();

const client = new Client({
  authStrategy: new RemoteAuth({
    store,
    clientId: "myapp", // un identificador único
    backupSyncIntervalMs: 300000,
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

let qrCodeData = null;

client.on("qr", (qr) => {
  qrCodeData = qr;
  qrcode.generate(qr, { small: true });
  console.log("📲 Escanea el QR para iniciar sesión");
});

client.on("ready", () => {
  console.log("✅ WhatsApp conectado y sesión guardada en DB");
});

client.on("disconnected", async () => {
  console.log("⚠️ Cliente desconectado, eliminando sesión...");
  await store.remove("myapp");
});

client.initialize();

// Endpoint para QR
export const getQRCode = () => qrCodeData;

// Envío de mensajes
export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!client) throw new Error("Cliente no inicializado");
    await client.sendMessage(`${to}@c.us`, message);
    console.log("✅ Mensaje enviado a", to);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};
