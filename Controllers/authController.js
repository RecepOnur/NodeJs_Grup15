const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const secret = process.env.SECRET_KEY;

const user = {
  username: "admin",
  password: "123456",
};

function createToken(user) {
  const payload = {
    user: user.username,
    role: "admin",
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  return token;
}

function login(username, password) {
  if (username === user.username && password === user.password) {
    const token = createToken(user);
    return { token };
  } else {
    return { error: "Hatalı kullanıcı adı veya şifre" };
  }
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  try {
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Geçersiz token" });
  }
}

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const response = login(username, password);
  if (response.error) {
    res.status(401).json({ error: response.error });
  } else {
    res.json({ token: response.token });
  }
});

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ mesaj: "API'ye erişiminiz var!" });
});

module.exports = { router, authenticateToken };
