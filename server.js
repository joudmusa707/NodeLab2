import express from "express";
import dotenv from "dotenv";
import booksRouter from "./routes/books.js";
import cors from "cors";
import morgan from "morgan";
import pgClient from "./db.js";
dotenv.config();

const server = express();
const PORT = process.env.PORT;

server.use(cors());
server.use(express.json());
server.use(morgan("dev"));

server.use("/api/books", booksRouter);
server.get("/", (req, res) => {
  res.send("🚀 PostgreSQL + Express API is running!");
});
pgClient.connect().then(() => {
  console.log("Connected to PostgreSQL database");
  server.listen(PORT, () => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });
});
