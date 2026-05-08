/*
  Warnings:

  - Made the column `profile_image_url` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" VARCHAR(100),
ADD COLUMN     "date_of_birth" DATE,
ADD COLUMN     "gender" "Gender",
ALTER COLUMN "profile_image_url" SET NOT NULL;
