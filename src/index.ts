import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import roomsRouter from "./routes/rooms";
import bookingsRouter from "./routes/bookings";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

const port = process.env.PORT || 4000;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Guesthouse API server running on port ${port}`);
});
