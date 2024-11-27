import express from "express";
import cors from "cors";
import favoriteRouter from "./routers/FavoriteRouter.js";
import userRouter from "./routers/UserRouter.js";
import groupRouter from "./routers/GroupRouter.js";

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/message", (req, res) => {
  res.json({ message: "Test message from backend" });
});

app.use("/user", userRouter);
app.use("/favorite", favoriteRouter);
app.use("/group", groupRouter);

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on ${process.env.SERVER_URL}`);
});
