import { Router } from "express";
import { chatPDF } from "../controllers/chat-pdf.controller";

const router = Router();

router.post("/chat-pdf", chatPDF);

export default router;
