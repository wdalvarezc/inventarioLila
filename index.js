import app from "./src/app.js";
import { getQRCode } from "./src/services/whatsappClient.js";

const PORT = process.env.PORT || 3000;

// Endpoint para mostrar QR de WhatsApp
app.get("/qr", async (req, res) => {
 const qr = getQRCode();
  if (qr) {
    res.send(`<img src="${qr}" alt="Escanea este código QR con WhatsApp"/>`);
  } else {
    res.send("✅ WhatsApp ya está conectado o aún no se ha generado QR.");
  }
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
