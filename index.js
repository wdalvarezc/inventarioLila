import app from "./src/app.js";
import client, { getQR } from "./src/whatsappClient.js";

const PORT = process.env.PORT || 3000;

// Endpoint para mostrar QR de WhatsApp
app.get("/qr", async (req, res) => {
  const qr = getQR();
  if (qr) {
    res.send(`
      <html>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;">
          <h2>Escanea este código QR con WhatsApp 📲</h2>
          <img src="data:image/png;base64,${qr}" alt="Escanea este código QR con WhatsApp"/>
        </body>
      </html>
    `);
  } else {
    res.send("✅ WhatsApp ya está conectado o aún no se ha generado QR.");
  }
});

// Servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  try {
    // Inicializamos el cliente de WhatsApp
    await client.initialize();
    console.log("📲 Cliente de WhatsApp inicializado");
  } catch (error) {
    console.error("❌ Error inicializando WhatsApp:", error);
  }
});
