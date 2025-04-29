module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isdeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Image.associate = (models) => {
    Image.belongsTo(models.Product, {
      foreignKey: "ProductId",
      as: "product",
    });
  };

  return Image;
};
