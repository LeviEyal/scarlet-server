const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const cors = require("cors");

const controller = require("./controller");
const middleware = require("./middlewares");

const PORT = process.env.PORT || 5000;
const app = express();

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

const middle = (req, res, next) => {
  console.log("middleware");
  if (req.query.id === "123") {
    res.status(400).send("Bad request");
    return;
  }
  next();
};

/* Routes */
app
  .get("/api", middle, (req, res) => res.sendFile(`${__dirname}/API.html`))
  .post("/api/purchase", middleware.purchase_middleware, controller.purchase)
  .post("/api/saleDetails", middleware.saleDetails_middleware, controller.saleDetails)
  .get("/api/books", controller.getBooks)
  .post("/api/books", middleware.addBook_middleware, controller.addBook)
  .get("/redirectURL", (req, res) => res.sendFile(`${__dirname}/redirectURL.html`));


/* Start server */
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}/api`)
);
