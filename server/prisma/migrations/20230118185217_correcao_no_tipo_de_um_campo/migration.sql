/*
  Warnings:

  - You are about to alter the column `weekDay` on the `habitWeekDays` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_habitWeekDays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekDay" INTEGER NOT NULL,
    "habitId" TEXT NOT NULL,
    CONSTRAINT "habitWeekDays_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_habitWeekDays" ("habitId", "id", "weekDay") SELECT "habitId", "id", "weekDay" FROM "habitWeekDays";
DROP TABLE "habitWeekDays";
ALTER TABLE "new_habitWeekDays" RENAME TO "habitWeekDays";
CREATE UNIQUE INDEX "habitWeekDays_habitId_weekDay_key" ON "habitWeekDays"("habitId", "weekDay");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
