import pkg from "whatsapp-web.js";
import qrcode from "qrcode";

const { Client, LocalAuth } = pkg;

let qrCode; // aquí guardamos el último QR generado

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Captura del QR
client.on("qr", (qr) => {
  console.log("📲 Nuevo QR generado");
  qrCode = qr;
});

// Confirmar conexión
client.on("ready", () => {
  console.log("✅ WhatsApp Web conectado y listo!");
});

// Manejo de errores
client.on("auth_failure", (msg) => {
  console.error("❌ Error de autenticación:", msg);
});

client.initialize();

// 👉 Función para enviar mensajes
export const sendWhatsAppMessage = async (to, message) => {
  try {
    const chatId = `${to}@c.us`; // formato internacional
    await client.sendMessage(chatId, message);
    console.log("✅ WhatsApp enviado a", to);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};

// 👉 Función para obtener el QR como imagen base64
export const getQrImage = async () => {
  if (!qrCode) return null;
  return await qrcode.toDataURL(qrCode);
};

export { client };