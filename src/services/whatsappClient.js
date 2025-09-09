import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

// Mostrar QR en consola
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("📲 Escanea el QR con WhatsApp para iniciar sesión");
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

// Función para enviar mensajes
export const sendWhatsAppMessage = async (to, message) => {
  try {
    // Nota: usa formato internacional ej: "573001112233"
    const chatId = `${to}@c.us`;
    await client.sendMessage(chatId, message);
    console.log("✅ WhatsApp enviado a", to);
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};

export default client;
