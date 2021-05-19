import express from "express";
import ProductsDB from '../controllers/ProductsDB.js'
import { mysql as config } from '../config.js';

const productsDB = new ProductsDB(config);

try {
  await productsDB.crearTabla();
  console.log('Tabla en MySQL de "Productos" Creada');
} catch (err) {
  console.log(err);
}

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  (async () => {
    try {
      const productos = await productsDB.listar();
      if (productos.length === 0) {
        return res.status(404).json({
          error: "No hay productos cargados.",
        });
      }
      res.status(200).json(productos);
    } catch (err) {
      return res.status(404).json({
        error: "No hay productos cargados.",
      });
    }
  })();
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  (async () => {
    try {
      const prod = await productsDB.select(id);
      if (prod.length === 0) {
        return res.status(404).json({
          error: "Producto no encontrado.",
        });
      }
      res.status(200).json(prod);
    } catch (err) {
      return res.status(404).json({
        error: "Producto no encontrado.",
      });
    }
  })();
});

router.post("/", (req, res) => {
  const product = req.body;
  (async () => {
    try {
      await productsDB.insertar(product);
      res.status(201).json(product);
    } catch (err) {
      res.status(400).send();
    }
  })();
});

router.put("/actualizar/:id", (req, res) => {
  const { id } = req.params;
  const product = req.body;

  (async () => {
    try {
      const prod = await productsDB.actualizar(parseInt(id), product);
      if (!prod) {
        return res.status(404).json({
          error: "Producto no encontrado.",
        });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(404).json({
        error: "Producto no encontrado."
      });
    }
  })();
});

router.delete("/borrar/:id", (req, res) => {
  const { id } = req.params;

  (async () => {
    try {
      const prod = await productsDB.borrarPorId(parseInt(id));
      res.status(201).json(prod);
    } catch (err) {
      res.status(404).json({
        error: "Producto no encontrado."
      });
    }
  })();
});

export default router;