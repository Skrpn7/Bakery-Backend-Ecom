const db = require("../models");
const ApiResponse = require("../utils/ApiResponse");

module.exports = {
  // Create a new sale order
  async createOrder(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const {
        Username,
        Contact,
        Address,
        Quantity,
        TotalAmount,
        ModeOfPayment,
        ProductDetails, // should be JSON or an object in request body
      } = req.body;

      if (
        !ProductDetails ||
        !Array.isArray(ProductDetails) ||
        ProductDetails.length === 0
      ) {
        return res
          .status(400)
          .json(ApiResponse.error("ProductDetails must be a non-empty array"));
      }

      const order = await db.OrderDetail.create(
        {
          Username,
          Contact,
          Address,
          Quantity,
          TotalAmount,
          ModeOfPayment,
          ProductDetails,
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json(ApiResponse.success(order));
    } catch (err) {
      await t.rollback();
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  // Patch update: Only update OrderStatus and/or PaymentStatus
  async patchUpdateOrderStatus(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const { id } = req.params;
      const { OrderStatus, PaymentStatus } = req.body;

      const order = await db.OrderDetail.findByPk(id, { transaction: t });

      if (!order) {
        await t.rollback();
        return res.status(404).json(ApiResponse.error("Order not found"));
      }

      // Prepare update fields dynamically
      const updateFields = {};
      if (OrderStatus) updateFields.OrderStatus = OrderStatus;
      if (PaymentStatus) updateFields.PaymentStatus = PaymentStatus;

      if (Object.keys(updateFields).length === 0) {
        return res
          .status(400)
          .json(ApiResponse.error("No valid fields provided to update."));
      }

      await order.update(updateFields, { transaction: t });
      await t.commit();

      res.json(
        ApiResponse.success({ message: "Order status updated successfully" })
      );
    } catch (err) {
      await t.rollback();
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  // Get all sale orders
  async getAllOrders(req, res) {
    try {
      const orders = await db.OrderDetail.findAll();
      res.json(ApiResponse.success(orders));
    } catch (err) {
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  // Get order by ID
  async getOrderById(req, res) {
    try {
      const order = await db.OrderDetails.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json(ApiResponse.error("Order not found"));
      }
      res.json(ApiResponse.success(order));
    } catch (err) {
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  // Delete an order
  async deleteOrder(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const order = await db.OrderDetails.findByPk(req.params.id, {
        transaction: t,
      });

      if (!order) {
        await t.rollback();
        return res.status(404).json(ApiResponse.error("Order not found"));
      }

      await order.destroy({ transaction: t });
      await t.commit();

      res.json(ApiResponse.success({ message: "Order deleted successfully" }));
    } catch (err) {
      await t.rollback();
      res.status(500).json(ApiResponse.error(err.message));
    }
  },
};
