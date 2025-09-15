import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

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
