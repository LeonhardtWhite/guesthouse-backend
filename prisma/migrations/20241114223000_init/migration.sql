-- Create rooms table
CREATE TABLE "rooms" (
    "id" SERIAL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "total_rooms" INTEGER NOT NULL,
    "capacity" INTEGER,
    CONSTRAINT "rooms_code_key" UNIQUE ("code")
);

-- Create bookings table
CREATE TABLE "bookings" (
    "id" TEXT PRIMARY KEY,
    "check_in" TIMESTAMPTZ NOT NULL,
    "check_out" TIMESTAMPTZ NOT NULL,
    "room_type" TEXT NOT NULL,
    "people" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "need_pickup" BOOLEAN NOT NULL,
    "line_user_id" TEXT NOT NULL,
    "line_display_name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookings_room_type_fkey" FOREIGN KEY ("room_type") REFERENCES "rooms"("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "bookings_room_type_idx" ON "bookings" ("room_type");
CREATE INDEX "bookings_check_in_check_out_idx" ON "bookings" ("check_in", "check_out");
