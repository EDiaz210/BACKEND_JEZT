// Whatsapp_routes.js
import { Router } from "express";
import upload from "../middlewares/Upload.js";
import { sendMessage, getQR, getStatus, logout, listaMensajes, deleteMessage, sendMessageN8N } from "../controllers/Whatsapp_controller.js";

const router = Router();

// Obtener QR para escanear
router.get("/qr", getQR);

// Estado del cliente
router.get("/status", getStatus);

// Enviar mensajes con archivos opcionales
router.post("/send-message", upload.array("files"), sendMessage);

router.get("/listarmensajes", listaMensajes);
router.delete("/mensajes/:id", deleteMessage);
router.post("/send-message-n8n", sendMessageN8N);

// Logout
router.get("/logout", logout);

export default router;
