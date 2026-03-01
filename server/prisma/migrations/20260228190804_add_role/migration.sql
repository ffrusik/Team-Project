-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "guest" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
