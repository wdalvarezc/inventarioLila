import app from "./src/app.js";
import { getQrImage } from "./src/services/whatsappClient.js";

const PORT = process.env.PORT || 3000;

// Endpoint para mostrar QR de WhatsApp
app.get("/qr", async (req, res) => {
  const qrImage = await getQrImage();
  if (!qrImage) {
    return res.send("⚠️ QR aún no generado. Revisa los logs.");
  }
  res.send(`
    <html>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;font-family:sans-serif">
        <h2>Escanea este QR con WhatsApp 📱</h2>
        <img src="${qrImage}" />
      </body>
    </html>
  `);
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
