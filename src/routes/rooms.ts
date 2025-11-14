import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { id: "asc" },
    });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

export default router;
