-- AlterTable
ALTER TABLE "public"."usuario" ADD COLUMN     "googleId" TEXT,
ALTER COLUMN "senha" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "usuario_googleId_key" ON "public"."usuario"("googleId");
