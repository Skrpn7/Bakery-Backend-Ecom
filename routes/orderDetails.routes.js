const express = require("express");
const router = express.Router();
const OrderDetailsController = require("../controllers/OrderDetails.Controller");

// Create a new order
router.post("/", OrderDetailsController.createOrder);

// Get all orders
router.get("/", OrderDetailsController.getAllOrders);

// Get order by ID
router.get("/:id", OrderDetailsController.getOrderById);



router.put("/:id", OrderDetailsController.patchUpdateOrderStatus);



// Delete an order
router.delete("/:id", OrderDetailsController.deleteOrder);

module.exports = router;
