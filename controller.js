const axios = require("axios");
const storage = require("mini-db");
require("dotenv").config();

const db = storage("./storage/books.json");
const rivhit_url = "https://testicredit.rivhit.co.il/API/PaymentPageRequest.svc/";

let redirectURL = "";
if (process.env.NODE_ENV === "production") {
  redirectURL = "https://scarlet-server.herokuapp.com/redirectURL";
} else {
  redirectURL = "http://localhost:5000/redirectURL";
}
  
const purchase = (req, res) => {
  axios
    .post(
      `${rivhit_url}/GetUrl`,
      {
        GroupPrivateToken: process.env.GROUP_PRIVATE_TOKEN,
        RedirectURL: redirectURL,
        ExemptVAT: true,
        MaxPayments: 12,
        Items: req.body.Items,
        ...req.body.details,
      }
    )
    .then((response) => {
      placeOrder(response.data);
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const placeOrder = (order) => {
  db.insert("orders", {
    PrivateSaleToken: order.PrivateSaleToken,
    PublicSaleToken: order.PublicSaleToken,
  });
};

const saleDetails = (req, res) => {
  const saleToken = req.query.PublicSaleToken || req.body.PublicSaleToken;
  const order = db.select("orders").find((o) => o.PublicSaleToken == saleToken);
  if (!order) {
    res.status(400).send("Order not found");
    return;
  }
  axios
    .post(
      `${rivhit_url}/SaleDetails`,
      {
        "SalePrivateToken": order.PrivateSaleToken,
      }
    )
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const getBooks = (req, res) => {
  res.send(db.select("books"));
};

const addBook = (req, res) => {
  const book = req.body;
  const stock = db.select("books");
  const stockBook = stock.find((b) => b.CatalogNumber == book.CatalogNumber);
  if (stockBook) {
    res
      .status(400)
      .send(`Book with CatalogNumber ${book.CatalogNumber} already exists`);
    return;
  } else if (!book.CatalogNumber || !book.Description || !book.UnitPrice) {
    res
      .status(400)
      .send("Book must have an CatalogNumber, Description and UnitPrice");
  } else {
    db.insert("books", book);
    res.send(db.select("books"));
  }
};

module.exports = {
  purchase,
  saleDetails,
  getBooks,
  addBook,
};


