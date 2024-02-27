const User = require('../models/User')
const bcrypt = require("bcrypt");

module.exports = async function createAdminUser() {
    try {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash("admin", 10); 
        await User.create({
          username: "admin",
          password: hashedPassword,
          role: "admin",
        });
        console.log("Admin user created");
      } else {
        console.log("Admin user already exists");
      }
    } catch (error) {
      console.error("Error creating admin user:", error);
    }
  }