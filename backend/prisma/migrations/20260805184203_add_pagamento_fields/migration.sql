-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."StatusCompra" ADD VALUE 'AGUARDANDO_PAGAMENTO';
ALTER TYPE "public"."StatusCompra" ADD VALUE 'CANCELADA';

-- AlterTable
ALTER TABLE "public"."compra" ADD COLUMN     "forma_pagamento" TEXT,
ADD COLUMN     "mp_payment_id" TEXT,
ADD COLUMN     "mp_preference_id" TEXT;
