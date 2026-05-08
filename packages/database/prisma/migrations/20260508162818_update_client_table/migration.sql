/*
  Warnings:

  - Made the column `brand_color_primary` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brand_color_secondary` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `logo_url` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `client_uri` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `policy_uri` on table `clients` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tos_uri` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "brand_color_primary" SET NOT NULL,
ALTER COLUMN "brand_color_secondary" SET NOT NULL,
ALTER COLUMN "logo_url" SET NOT NULL,
ALTER COLUMN "client_uri" SET NOT NULL,
ALTER COLUMN "policy_uri" SET NOT NULL,
ALTER COLUMN "tos_uri" SET NOT NULL;
