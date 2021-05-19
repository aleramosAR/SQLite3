import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/", (req, res) => {
  fetch('http://localhost:8080/api/productos').then(res => res.json()).then(function(data) {
    res.render("index", { productos: data });
  });
});

export default router;