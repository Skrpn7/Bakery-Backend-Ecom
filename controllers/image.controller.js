const db = require('../models');
const path = require("path");
const fs = require("fs");
module.exports = {
    async createImage(req, res) {
        try {
            const image = await Image.create(req.body);
            res.status(201).json(image);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getImages(req, res) {
        try {
            const images = await Image.findAll();
            res.json(images);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


    async getImageById(req, res) {
        try {
          const { id } = req.params;
          const image = await db.Image.findByPk(id);
      
          if (!image) {
            return res.status(404).json({ error: "Image not found" });
          }
      
          const filePath = path.join(__dirname, "..", image.imagePath);
      
          // Check if the file exists
          if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Image file not found" });
          }
      
          // Set content type based on file extension (optional)
          res.sendFile(filePath);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      },


    async updateImage(req, res) {
        try {
            const [updated] = await Image.update(req.body, { where: { id: req.params.id } });
            updated
                ? res.json({ message: 'Image updated' })
                : res.status(404).json({ message: 'Image not found' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async deleteImage(req, res) {
        try {
            const deleted = await Image.destroy({ where: { id: req.params.id } });
            deleted
                ? res.json({ message: 'Image deleted' })
                : res.status(404).json({ message: 'Image not found' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};
