import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { sendBookingNotification } from "../services/lineService";

const router = Router();

const bookingSchema = z
  .object({
    check_in: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid check_in date"),
    check_out: z
      .string()
      .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid check_out date"),
    room_type: z.enum(["single", "double", "family"]),
    people: z.number().int().min(1).max(6),
    name: z.string().min(1).max(80),
    phone: z.string().regex(/^\d{9,15}$/, "Phone must be 9-15 digits"),
    need_pickup: z.boolean(),
    line_user_id: z.string().min(1),
    line_display_name: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    const checkIn = new Date(data.check_in);
    const checkOut = new Date(data.check_out);
    const now = new Date();

    now.setHours(0, 0, 0, 0);

    if (checkIn < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "check_in cannot be in the past",
        path: ["check_in"],
      });
    }

    if (checkOut <= checkIn) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "check_out must be later than check_in",
        path: ["check_out"],
      });
    }
  });

router.post("/", async (req, res, next) => {
  try {
    const parsed = bookingSchema.parse(req.body);
    const checkIn = new Date(parsed.check_in);
    const checkOut = new Date(parsed.check_out);

    const room = await prisma.room.findUnique({
      where: { code: parsed.room_type },
    });

    if (!room) {
      return res.status(400).json({ error: "Invalid room type" });
    }

    const overlappingCount = await prisma.booking.count({
      where: {
        room_type: parsed.room_type,
        check_in: { lt: checkOut },
        check_out: { gt: checkIn },
      },
    });

    if (overlappingCount >= room.total_rooms) {
      return res.status(400).json({
        error: "Selected room type is not available for these dates",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        check_in: checkIn,
        check_out: checkOut,
        room_type: parsed.room_type,
        people: parsed.people,
        name: parsed.name,
        phone: parsed.phone,
        need_pickup: parsed.need_pickup,
        line_user_id: parsed.line_user_id,
        line_display_name: parsed.line_display_name,
        room: {
          connect: { code: parsed.room_type },
        },
      },
    });

    await sendBookingNotification({
      id: booking.id,
      check_in: booking.check_in.toISOString(),
      check_out: booking.check_out.toISOString(),
      room_type: booking.room_type,
      people: booking.people,
      name: booking.name,
      phone: booking.phone,
      need_pickup: booking.need_pickup,
      line_user_id: booking.line_user_id,
      line_display_name: booking.line_display_name,
    });

    res.status(201).json({ id: booking.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.flatten(),
      });
    }
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { room_type, start_date, end_date } = req.query;
    const filters: any = {};

    if (typeof room_type === "string" && ["single", "double", "family"].includes(room_type)) {
      filters.room_type = room_type;
    }

    if (typeof start_date === "string" && !Number.isNaN(Date.parse(start_date))) {
      filters.check_in = { ...(filters.check_in || {}), gte: new Date(start_date) };
    }

    if (typeof end_date === "string" && !Number.isNaN(Date.parse(end_date))) {
      filters.check_out = { ...(filters.check_out || {}), lte: new Date(end_date) };
    }

    const bookings = await prisma.booking.findMany({
      where: filters,
      orderBy: { check_in: "asc" },
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

export default router;
