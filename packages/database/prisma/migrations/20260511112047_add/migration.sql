-- CreateEnum
CREATE TYPE "AppType" AS ENUM ('PUBLIC', 'CONFIDENTIAL');

-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "appType" "AppType" NOT NULL DEFAULT 'CONFIDENTIAL';
