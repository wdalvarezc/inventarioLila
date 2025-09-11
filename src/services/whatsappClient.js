// src/services/whatsappClient.js
import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import WhatsappSession from "../models/WhatsappSession.js";

const { Client } = pkg;

let client;
let qrCodeData = null;

export const initWhatsApp = async () => {
  try {
    // Buscar si ya existe sesión guardada
    const saved = await WhatsappSession.findOne();
    let sessionData = saved ? saved.session : null;

    client = new Client({
      session: sessionData, // cargamos sesión desde DB
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    // Generar QR
    client.on("qr", async (qr) => {
      qrCodeData = await qrcode.toDataURL(qr);
      console.log("📲 Escanea el QR con WhatsApp");
    });

    // Guardar sesión en DB al autenticar
    client.on("authenticated", async (session) => {
      console.log("✅ Sesión autenticada, guardando en DB...");
      await WhatsappSession.destroy({ where: {} }); // limpiar anterior
      await WhatsappSession.create({ session });
    });

    // Conectado
    client.on("ready", () => {
      qrCodeData = null;
      console.log("✅ WhatsApp Web conectado y listo!");
    });

    client.on("auth_failure", (msg) => {
      console.error("❌ Error de autenticación:", msg);
    });

    await client.initialize();
  } catch (err) {
    console.error("❌ Error iniciando WhatsApp:", err.message);
  }
};

// Endpoint para obtener QR
export const getQRCode = () => qrCodeData;

// Función para enviar mensajes
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
