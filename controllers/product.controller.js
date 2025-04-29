const db= require("../models");
const path = require("path")
const fs = require("fs")
const ApiResponse = require("../utils/ApiResponse");

module.exports = {
  async createProduct(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const { name, Price, Desc,IsBread } = req.body;
      const file = req.file;

      if (!file) return res.status(400).json(ApiResponse.error('Image file is required'));

      // Step 1: Create the product
      const product = await db.Product.create({ name, Price, Desc,IsBread }, { transaction: t });

      // Step 2: Save the image with reference to product
      const image = await db.Image.create(
        {
          ProductId: product.id,
          imagePath: path.join('uploads/images', file.filename),
        },
        { transaction: t }
      );

      // Step 3: Update product with imageId
      await db.Product.update(
        { ImageId: image.id },
        {
          where: { id: product.id },
          transaction: t
        }
      );
      

      await t.commit();

      // Step 4: Fetch the complete product with images
      const result = await db.Product.findByPk(product.id, {
        include: [{ model: db.Image, as: 'images' }],
      });

      res.status(201).json(ApiResponse.success(result));
    } catch (err) {
      await t.rollback();
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  async getAllProducts(req, res) {
    try {
      const products = await db.Product.findAll({
        include: [
          {
            model: db.Image,
            as: 'images'
          },
        ],
      });
  
      const formatted = products.map(product => {
        const plain = product.get({ plain: true });
        return {
          ...plain,
          imageId: plain.images?.[0]?.id || null, 
        };
      });
  
      res.json(ApiResponse.success(formatted));
    } catch (err) {
      res.status(500).json(ApiResponse.error(err.message));
    }
  },
  

  async getProductById(req, res) {
    try {
      const product = await db.Product.findByPk(req.params.id, {
        include: ["images"],
      });
      if (!product) {
        return res
          .status(404)
          .json(ApiResponse.error("Product not found", 404));
      }
      res.json(ApiResponse.success(product));
    } catch (err) {
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  async updateProduct(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const { id } = req.params;
      const file = req.file;
  
      // Step 1: Find existing product with its images
      const product = await db.Product.findByPk(id, {
        include: [{ model: db.Image, as: 'images' }],
        transaction: t,
      });
  
      if (!product) {
        await t.rollback();
        return res
          .status(404)
          .json(ApiResponse.error("Product not found", 404));
      }
  
      // Step 2: Update product fields
      await product.update(req.body, { transaction: t });
  
      // Step 3: If there's a new image, delete the old one and add new
      if (file) {
        // Delete previous image (from DB and filesystem)
        if (product.ImageId) {
          const oldImage = await db.Image.findByPk(product.ImageId, { transaction: t });
          if (oldImage) {
            const oldPath = path.join(__dirname, "..", oldImage.imagePath);
            fs.unlink(oldPath, err => {
              if (err) console.warn("Failed to delete image file:", oldPath);
            });
            await oldImage.destroy({ transaction: t });
          }
        }
  
        // Add new image
        const newImage = await db.Image.create(
          {
            ProductId: product.id,
            imagePath: path.join("uploads/images", file.filename),
          },
          { transaction: t }
        );
  
        await product.update({ ImageId: newImage.id }, { transaction: t });
      }
  
      await t.commit();
      res.json(ApiResponse.success({ message: "Product updated" }));
    } catch (err) {
      await t.rollback();
      res.status(500).json(ApiResponse.error(err.message));
    }
  },

  async deleteProduct(req, res) {
    const t = await db.sequelize.transaction();
    try {
      const product = await db.Product.findByPk(req.params.id, {
        include: [{ model: db.Image, as: 'images' }],
        transaction: t,
      });
  
      if (!product) {
        await t.rollback();
        return res
          .status(404)
          .json(ApiResponse.error("Product not found", 404));
      }
  
      // Step 1: Delete associated images from DB and filesystem
      for (const image of product.images) {
        // Optionally delete the image file
        const filePath = path.join(__dirname, "..", image.imagePath);
        fs.unlink(filePath, err => {
          if (err) console.warn("Failed to delete image file:", filePath);
        });
  
        await image.destroy({ transaction: t });
      }
  
      // Step 2: Delete product
      await product.destroy({ transaction: t });
  
      await t.commit();
  
      res.json(ApiResponse.success({ message: "Product and images deleted" }));
    } catch (err) {
      await t.rollback();
      res.status(500).json(ApiResponse.error(err.message));
    }
  },
};
