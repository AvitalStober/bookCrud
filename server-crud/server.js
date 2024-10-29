const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

let ID = 6;

let books = [
  { id: 1, title: "AAA", author: "aaa" },
  { id: 2, title: "BBB", author: "bbb" },
];

app.use(cors());
app.use(express.json());

app.get("/books", (req, res) => {
  res.send(books);
});

app.get("/books/:id", (req, res) => {
  res.send(books.filter((book) => book.id == req.params.id)[0]);
});

app.post("/books", (req, res) => {
  const { title, author } = req.body;

  const newBook = {
    id: ++ID,
    title: title,
    author: author,
  };

  books.push(newBook);
  res.status(201).send(books);
});

app.put("/book/:id", (req, res) => {
  const { title, author } = req.body;

  const newBook = {
    id: parseInt(req.params.id),
    title: title,
    author: author,
  };

  const newArray = books.map((book) =>
    book.id == req.params.id ? newBook : book
  );
  books = newArray;
});

app.delete("/book/:id", (req, res) => {
  const afterDelete = books.filter((book) => book.id != req.params.id);
  books = afterDelete;
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
