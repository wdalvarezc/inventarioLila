// src/routes/orderRoutes.js
import express from "express";
import { createOrder , getOrders, getOrdersDate, updateOrderStatus} from "../controllers/orderController.js";
const router = express.Router();
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/date/", getOrdersDate);
router.patch("/:id/status", updateOrderStatus); 
export default router;
