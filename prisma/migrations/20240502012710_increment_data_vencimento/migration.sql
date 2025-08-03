/*
  Warnings:

  - You are about to drop the column `diaVencimento` on the `parcelas` table. All the data in the column will be lost.
  - Added the required column `dataVencimento` to the `parcelas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parcelas` DROP COLUMN `diaVencimento`,
    ADD COLUMN `dataVencimento` DATETIME(3) NOT NULL,
    MODIFY `updated_at` DATETIME(3) NULL;
