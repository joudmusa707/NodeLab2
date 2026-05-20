import express from "express";

import pgClient from "../db.js";

const BooksRouter = express.Router();

// Get all books

BooksRouter.get("/", async (req, res) => {
  try {
    const results = await pgClient.query("SELECT * FROM books");
    res.json(results.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a book by ID
BooksRouter.get("/:id", async (req, res) => {
  try {
    const results = await pgClient.query("SELECT * FROM books WHERE id = $1", [
      req.params.id,
    ]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Create a new book

BooksRouter.post("/", async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const results = await pgClient.query(
      "INSERT INTO books (title, author, year) VALUES ($1, $2, $3) RETURNING *",
      [title, author, year],
    );
    res.status(201).json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a book by ID
BooksRouter.delete("/:id", async (req, res) => {
  try {
    const results = await pgClient.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a book by ID
BooksRouter.put("/:id", async (req, res) => {
  const { title, author, year } = req.body;
  try {
    const results = await pgClient.query(
      "UPDATE books SET title = $1, author = $2, year = $3 WHERE id = $4 RETURNING *",
      [title, author, year, req.params.id],
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(results.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export default BooksRouter;
