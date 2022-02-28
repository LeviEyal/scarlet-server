const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const cors = require("cors");

const controller = require("./controller");

const PORT = process.env.PORT || 5000;
const app = express();

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

/* Routes */
app
  .get("/api", (req, res) => res.sendFile(`${__dirname}/API.html`))
  .post("/api/purchase", controller.purchase)
  .post("/api/saleDetails", controller.saleDetails)
  .get("/api/books", controller.getBooks)
  .post("/api/books", controller.addBook);

/* Start server */
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}/api`)
);
