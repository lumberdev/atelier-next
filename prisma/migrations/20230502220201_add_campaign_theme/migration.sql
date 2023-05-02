/*
  Warnings:

  - A unique constraint covering the columns `[themeId]` on the table `Campaigns` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `themeId` to the `Campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaigns" ADD COLUMN     "main_image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "themeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Themes" (
    "id" TEXT NOT NULL,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "backgroundColor" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Themes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaigns_themeId_key" ON "Campaigns"("themeId");

-- AddForeignKey
ALTER TABLE "Campaigns" ADD CONSTRAINT "Campaigns_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
