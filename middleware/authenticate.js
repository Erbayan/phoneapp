const jwt = require("jsonwebtoken");
const SECRET_KEY = "ErbayansKey";

function authenticate(req, res, next) {
  if (!req.cookies || !req.cookies.token) {
    console.log("нету");
    return res.redirect("/login");
  }

  const token = req.cookies.token;
  console.log("Токен:", token);
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Token expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = authenticate;
