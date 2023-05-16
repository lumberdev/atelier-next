/*
  Warnings:

  - You are about to drop the column `store_id` on the `Merchants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shop_id]` on the table `Merchants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `access_token` to the `Merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_id` to the `Merchants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Merchants_store_id_key";

-- AlterTable
ALTER TABLE "Merchants" DROP COLUMN "store_id",
ADD COLUMN     "access_token" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shop_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Merchants_shop_id_key" ON "Merchants"("shop_id");
