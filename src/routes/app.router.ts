import {Router} from 'express'
import {smartSearch} from "../controllers/research.controller";

const router = Router()

router.post("/search", smartSearch)
router.get("/")

export default router;