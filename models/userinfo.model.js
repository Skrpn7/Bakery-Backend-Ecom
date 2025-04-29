const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const UserInfo = sequelize.define('UserInfo', {
      Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Role: {
        type: DataTypes.ENUM('Admin', 'Client'),
        allowNull: false,
        defaultValue: 'Client',
      }
    });
  
    UserInfo.beforeCreate(async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.Password = await bcrypt.hash(user.Password, salt);
    });

    return UserInfo;
  };
  