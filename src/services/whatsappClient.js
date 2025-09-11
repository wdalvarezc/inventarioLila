import pkg from "whatsapp-web.js";
import qrcode from "qrcode";
import WhatsappSession from "../models/WhatsappSession.js";

const { Client } = pkg;

let client;
let qrCodeData = null; // Guardamos el QR en memoria para servirlo por un endpoint

// 🚀 Inicializar WhatsApp con sesión desde la DB
export const initWhatsApp = async () => {
  try {
    // Buscar sesión guardada
    const savedSession = await WhatsappSession.findOne();

    let clientOptions = {
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    };

    if (savedSession) {
      clientOptions.session = savedSession.session;
      console.log("📦 Sesión encontrada en la DB, conectando sin QR...");
    }

    client = new Client(clientOptions);

    // Evento de QR → lo convertimos en base64 para mostrar en el frontend
    client.on("qr", async (qr) => {
      qrCodeData = await qrcode.toDataURL(qr); 
      console.log("📲 Escanea el QR con WhatsApp para iniciar sesión");
    });

    // Evento autenticado → guardar en DB
    client.on("authenticated", async (session) => {
      console.log("✅ Sesión autenticada, guardando en DB...");
      qrCodeData = null; // ya no necesitamos QR
      await WhatsappSession.destroy({ where: {} }); // Limpiar sesiones previas
      await WhatsappSession.create({ session });
    });

    // Listo para usar
    client.on("ready", () => {
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

// 📩 Función para enviar mensajes
export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!client) throw new Error("Cliente de WhatsApp no inicializado");
    const chatId = `${to}@c.us`;
    await client.sendMessage(chatId, message);
    console.log("✅ WhatsApp enviado a", to);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};

// 🔹 Endpoint para obtener el QR actual
export const getQRCode = () => qrCodeData;
