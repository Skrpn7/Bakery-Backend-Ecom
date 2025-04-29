module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ImageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      Desc: {
        type: DataTypes.TEXT,
      },
      IsBread: {
        type: DataTypes.ENUM('IsBread', 'IsCookies'),
        allowNull: false,
        defaultValue: 'IsBread',
      }
    });
  
    Product.associate = models => {
      Product.hasMany(models.Image, {
        foreignKey: 'ProductId',
        as: 'images',
      });
    };
  
    return Product;
  };
  