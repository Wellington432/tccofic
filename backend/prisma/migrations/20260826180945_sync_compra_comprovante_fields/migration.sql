-- AlterEnum
BEGIN;
CREATE TYPE "public"."StatusCompra_new" AS ENUM ('CARRINHO', 'AGUARDANDO_PAGAMENTO', 'AGUARDANDO_CONFIRMACAO', 'PAGO', 'REJEITADO', 'CANCELADO');
ALTER TABLE "public"."compra" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."compra" ALTER COLUMN "status" TYPE "public"."StatusCompra_new" USING ("status"::text::"public"."StatusCompra_new");
ALTER TYPE "public"."StatusCompra" RENAME TO "StatusCompra_old";
ALTER TYPE "public"."StatusCompra_new" RENAME TO "StatusCompra";
DROP TYPE "public"."StatusCompra_old";
ALTER TABLE "public"."compra" ALTER COLUMN "status" SET DEFAULT 'CARRINHO';
COMMIT;

-- AlterTable
ALTER TABLE "public"."compra" DROP COLUMN "mp_payment_id",
DROP COLUMN "mp_preference_id",
ADD COLUMN     "comprovante_enviado_em" TIMESTAMP(3),
ADD COLUMN     "comprovante_url" TEXT,
ADD COLUMN     "confirmado_em" TIMESTAMP(3),
ADD COLUMN     "confirmado_por" TEXT;
