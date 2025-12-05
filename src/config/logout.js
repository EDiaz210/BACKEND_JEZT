// logout.js

import fs from "fs";
import path from "path";
import { getClient } from "./client.js";

export const logout = async () => {
  const client = getClient();
  const sessionPath = path.join(process.cwd(), "session");

  try {
    if (client) {
      console.log("Desconectando cliente de WhatsApp...");
      await client.destroy(); // Cierra puppeteer y libera archivos
    }

    console.log("Esperando a que Windows libere los archivos...");
    await new Promise(resolve => setTimeout(resolve, 300000)); // 3 min

    if (fs.existsSync(sessionPath)) {
      console.log("Eliminando carpeta de sesión...");
      fs.rmSync(sessionPath, { recursive: true, force: true });
    }

    console.log("Logout completado correctamente.");
    return { success: true };

  } catch (err) {
    console.error("Error en logout seguro:", err);
    return { success: false, error: err };
  }
};
