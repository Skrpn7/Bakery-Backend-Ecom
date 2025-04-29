const db = require("../models");
const { Op } = db.Sequelize;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const winston = require("winston");
const ApiResponse = require("../utils/ApiResponse");
// Create a new admin
const createUser = async (req, res) => {
  try {
    const { Username, Password, Email, Address, Role } = req.body;

    // Check if username or email already exists
    const existingUser = await db.UserInfo.findOne({
      where: {
        [Op.or]: [{ Username }, { Email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already in use." });
    }

    const newUser = await db.UserInfo.create({
      Username,
      Password,
      Email,
      Address,
      Role,
    });
    res.status(201).json(ApiResponse.success(newUser, 1, 201));
  } catch (error) {
    winston.error("Error creating user:", error);
    res.status(400).json(ApiResponse.error(error.message));
  }
};

// Get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await db.UserInfo.findAll();
    res.status(200).json(ApiResponse.success(admins, admins.length));
  } catch (error) {
    winston.error("Error fetching admins:", error);
    res.status(400).json(ApiResponse.error(error.message));
  }
};

// Admin login with email and password
const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await db.UserInfo.findOne({ where: { Email } });

    if (!user || !(await bcrypt.compare(Password, user.Password))) {
      return res
        .status(401)
        .json(ApiResponse.error("Invalid email or password", 401));
    }

    const token = jwt.sign(
      {
        email: user.Email,
        username: user.Username,
        id: user.id,
        role: user.Role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const responsePayload = {
      token,
      username: user.Username,
      email: user.Email,
      role: user.Role,    
    };
    res.status(200).json(ApiResponse.success(responsePayload));
  } catch (error) {
    winston.error("Login error:", error);
    res.status(400).json(ApiResponse.error(error.message));
  }
};

module.exports = { createUser, getAdmins, login };
