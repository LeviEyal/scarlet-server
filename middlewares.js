const storage = require("mini-db");

const db = storage("./storage/books.json");

const purchase_middleware = (req, res, next) => {
    console.log("purchase_middleware");
    let badRequest = false;
    let { Items, details } = req.body;
    const stock = db.select("books");
    if (!Items || Items.length === 0) {
      res.status(400).send("No books to purchase");
      return;
    }
    req.body.Items = Items.map((book) => {
      const stockBook = stock.find((b) => b.CatalogNumber == book.CatalogNumber);
      if (!stockBook) {
        res
          .status(400)
          .send(`Book with CatalogNumber ${book.CatalogNumber} not found`);
        badRequest = true;
        return;
      }
      return {
        ...stockBook,
        Quantity: book.Quantity,
      };
    });
    if (badRequest) {
      return;
    }
    next();
}

const saleDetails_middleware = (req, res, next) => {
    console.log("saleDetails_middleware");
    next();
}

const getBooks_middleware = (req, res, next) => {
    console.log("getBooks_middleware");
    next();
}

const addBook_middleware = (req, res, next) => {
    console.log("addBook_middleware");
    next();
}

module.exports = {
    purchase_middleware,
    saleDetails_middleware,
    getBooks_middleware,
    addBook_middleware
}