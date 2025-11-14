import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const defaultRooms = [
  { code: "single", name: "單人房", total_rooms: 4, capacity: 1 },
  { code: "double", name: "雙人房", total_rooms: 4, capacity: 2 },
  { code: "family", name: "家庭房", total_rooms: 4, capacity: 4 },
];

async function main() {
  await prisma.room.createMany({
    data: defaultRooms,
    skipDuplicates: true,
  });

  console.log("Seeded default rooms (idempotent)");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
