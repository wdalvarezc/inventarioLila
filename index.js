import app from "./src/app.js";
import { getQR} from "./src/whatsappClient.js";

const PORT = process.env.PORT || 3000;

// Endpoint para mostrar QR de WhatsApp
app.get("/qr", async (req, res) => {
  const qr = getQR();
  if (qr) {
    res.send(`<img src="${qr}" alt="Escanea este código QR con WhatsApp"/>`);
  } else {
    res.send("✅ WhatsApp ya está conectado o aún no se ha generado QR.");
  }
});

// Servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
