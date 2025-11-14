import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const defaultRooms = [
  { code: "single", name: "单人房", total_rooms: 4, capacity: 1 },
  { code: "double", name: "双人房", total_rooms: 4, capacity: 2 },
  { code: "family", name: "家庭房", total_rooms: 4, capacity: 4 }
];

async function main() {
  for (const room of defaultRooms) {
    await prisma.room.upsert({
      where: { code: room.code },
      update: {
        name: room.name,
        total_rooms: room.total_rooms,
        capacity: room.capacity
      },
      create: room
    });
  }

  console.log("Seeded room inventory");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
