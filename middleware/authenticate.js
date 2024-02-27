const jwt = require("jsonwebtoken");
const SECRET_KEY = "ErbayansKey";
const ADMIN_SECRET_KEY = "Zharkynbek";

function authenticate(req, res, next) {
    if (!req.cookies) {
        return res.redirect("/login");
    }

    const token = req.cookies.token;
    const adminToken = req.cookies.adminToken;

    try {
        if (token) {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
        } else if (adminToken) {
            const decoded = jwt.verify(adminToken, ADMIN_SECRET_KEY);
            req.user = decoded;
            req.isAdmin = true; 
        } else {
            return res.redirect("/login");
        }
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
