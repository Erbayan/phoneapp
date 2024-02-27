const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");
const SECRET_KEY = "ErbayansKey";
const ADMIN_SECRET_KEY = "Zharkynbek"
async function registerUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username or Password is required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully', redirectUrl: '/login' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Поиск пользователя в базе данных
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Сравнение пароля
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Проверка роли пользователя
    if (user.role === "admin") {
      // Генерация сессионного токена для админа
      const adminToken = jwt.sign({ userId: user._id }, ADMIN_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("adminToken", adminToken, { httpOnly: true, maxAge: 3600000 });

      // Перенаправление на административную панель
      return res.redirect("/admin");
    } else {
      // Генерация сессионного токена для обычного пользователя
      const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

      // Перенаправление на другую страницу (например, главную страницу)
      return res.redirect("/main-page");
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to authenticate user" });
  }
}


module.exports = {registerUser,loginUser};
