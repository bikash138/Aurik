/*
  Warnings:

  - You are about to drop the column `brand_color_primary` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `brand_color_secondary` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "brand_color_primary",
DROP COLUMN "brand_color_secondary";
