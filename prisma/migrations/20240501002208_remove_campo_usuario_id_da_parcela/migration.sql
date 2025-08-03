/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `parcelas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `parcelas` DROP FOREIGN KEY `parcelas_usuarioId_fkey`;

-- AlterTable
ALTER TABLE `parcelas` DROP COLUMN `usuarioId`;
