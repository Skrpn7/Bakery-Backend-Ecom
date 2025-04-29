module.exports = (sequelize, DataTypes) => {
    const OrderDetail = sequelize.define('OrderDetail', {
      Username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      TotalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      ModeOfPayment: {
        type: DataTypes.ENUM('Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'),
        allowNull: false,
      },
      OrderStatus: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      PaymentStatus: {
        type: DataTypes.ENUM('Unpaid', 'Paid', 'Failed'),
        allowNull: false,
        defaultValue: 'Unpaid',
      },
      ProductDetails: {
        type: DataTypes.JSON, // To store an array of products with details like ID, name, quantity, etc.
        allowNull: false,
      },
    });
  
    return OrderDetail;
  };
  