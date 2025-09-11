import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import SequelizeStore from "./services/SequelizeStore.js";

const { Client, RemoteAuth } = pkg;

const store = new SequelizeStore();
let lastQR = null;

const client = new Client({
  authStrategy: new RemoteAuth({
    clientId: "myapp", // nombre único de sesión
    store,
    backupSyncIntervalMs: 300000,
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", async (qr) => {
  lastQR = await qrcode.toDataURL(qr)
    console.log('qr listo !!!');
});

client.on("ready", () => {
  console.log("✅ Cliente de WhatsApp listo");
});

client.on("authenticated", () => {
  console.log("🔐 Autenticado correctamente");
});

client.on("auth_failure", (msg) => {
  console.error("❌ Error de autenticación:", msg);
});

export const getQR = async () => {
  if (!lastQR) return null;
  return lastQR // convertimos QR en imagen base64
};


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

export default client;