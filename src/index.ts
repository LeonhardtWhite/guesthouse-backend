import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import roomsRouter from "./routes/rooms";
import bookingsRouter from "./routes/bookings";
import prisma from "./lib/prisma";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rooms", roomsRouter);
app.use("/api/bookings", bookingsRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 10000;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function ensureRoomsSeeded() {
  const count = await prisma.room.count();
  if (count > 0) {
    return;
  }

  await prisma.room.createMany({
    data: [
      {
        code: "single",
        name: "單人房",
        total_rooms: 4,
        capacity: 1,
      },
      {
        code: "double",
        name: "雙人房",
        total_rooms: 4,
        capacity: 2,
      },
      {
        code: "family",
        name: "家庭房",
        total_rooms: 4,
        capacity: 4,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded default rooms into database.");
}

async function start() {
  try {
    await ensureRoomsSeeded();

    app.listen(port, () => {
      console.log(`Guesthouse API server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
