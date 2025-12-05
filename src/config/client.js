// client.js
import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from "qrcode";

let lastQR = null;
let readyAt = null;

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "default",
    dataPath: "./.wwebjs_auth", // sesión persistente
    rmMaxRetries: 8,
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
    ],
  },
});

// ---------------------- EVENTOS ----------------------
client.on("qr", async (qr) => {
  lastQR = await qrcode.toDataURL(qr);
  console.log("📌 QR generado. Escanea en /qr");
});

client.on("authenticated", async () => {
  console.log("✅ Sesión autenticada correctamente");
  // Esperar unos segundos y luego inicializar
  setTimeout(() => {
    client.emit("ready");
  }, 5000); // 5 segundos de espera
});


client.on("ready", () => {
  readyAt = Date.now();
  console.log("✅ Cliente listo y conectado");
});

client.on("auth_failure", (err) => {
  console.error("❌ Fallo de autenticación:", err);
});

client.on("disconnected", (reason) => {
  console.warn("⚠️ Cliente desconectado:", reason);
});

client.on("change_state", (state) => {
  console.log("➡️ Estado del cliente:", state);
  if (state === "CONNECTED" && !readyAt) {
    readyAt = Date.now();
    console.log("✅ Cliente listo y conectado (desde change_state)");
  }
});


// ---------------------- POLLER ----------------------
let pollerId = null;
const startPoller = () => {
  if (pollerId) return;
  pollerId = setInterval(async () => {
    try {
      const state = await client.getState();
      if (state !== "CONNECTED" && getIsReady()) {
        console.warn("⚠️ Cliente desconectado o no conectado, estado actual:", state);
      }
    } catch (err) {
      console.error("❌ Error en poller:", err);
    }
  }, 5000);
};

setTimeout(() => {
  startPoller();
}, 5000); // espera 5 segundos


// ---------------------- FUNCIONES ----------------------

// Verificar si el cliente está listo
const getIsReady = () => !!readyAt;

// Última hora de ready
const getReadyAt = () => readyAt;

// Último QR generado
const getLastQR = () => lastQR;

// Inicializar cliente
client.initialize();

export { client, getIsReady, getReadyAt, getLastQR };
