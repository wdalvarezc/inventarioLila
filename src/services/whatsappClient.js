// src/services/whatsappClient.js
import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import SequelizeStore from "./SequelizeStore.js";

const { Client, RemoteAuth } = pkg;

const store = new SequelizeStore();

// 📌 Variable global para guardar el último QR generado
let qrCodeData = null;

const client = new Client({
  authStrategy: new RemoteAuth({
    store,
    clientId: "myapp", // Identificador único de la sesión
    backupSyncIntervalMs: 300000, // cada 5 min guarda en DB
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// 📌 Guardamos QR en base64 y lo mostramos en consola también
client.on("qr", async (qr) => {
  qrCodeData = await qrcode.toDataURL(qr); // se guarda en memoria
  console.log("📲 Escanea el QR para iniciar sesión");

  // también lo pintamos en consola como antes
  qrcode.toString(qr, { type: "terminal" }, (err, url) => {
    if (!err) console.log(url);
  });
});

client.on("ready", () => {
  console.log("✅ WhatsApp conectado y sesión guardada en DB");
  qrCodeData = null; // limpiamos QR porque ya no es necesario
});

// ⚠️ Manejar desconexión
client.on("disconnected", async () => {
  console.log("⚠️ Cliente desconectado, eliminando sesión...");
  await store.remove("myapp"); // se pasa el clientId que usamos arriba
});

client.initialize();

// 📌 Endpoint para obtener QR
export const getQRCode = () => qrCodeData;

// 📌 Función para enviar mensajes
export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!client) throw new Error("Cliente no inicializado");
    const chatId = `${to}@c.us`;
    await client.sendMessage(chatId, message);
    console.log("✅ Mensaje enviado a", to);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};

export { client };