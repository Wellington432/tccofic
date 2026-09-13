-- CreateEnum
CREATE TYPE "public"."TipoUsuario" AS ENUM ('ADM', 'CLIENTE');

-- CreateEnum
CREATE TYPE "public"."StatusCompra" AS ENUM ('CARRINHO', 'FINALIZADA', 'ENTREGUE');

-- CreateEnum
CREATE TYPE "public"."TipoEntrega" AS ENUM ('RETIRADA', 'ENTREGA');

-- CreateTable
CREATE TABLE "public"."usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "public"."TipoUsuario" NOT NULL DEFAULT 'CLIENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categoria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "unidade" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,
    "id_categoria" TEXT NOT NULL,

    CONSTRAINT "produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."compra" (
    "id" TEXT NOT NULL,
    "status" "public"."StatusCompra" NOT NULL DEFAULT 'CARRINHO',
    "tipo_entrega" "public"."TipoEntrega" NOT NULL DEFAULT 'RETIRADA',
    "endereco" TEXT,
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modificado_em" TIMESTAMP(3) NOT NULL,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."item_compra" (
    "id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_compra" TEXT NOT NULL,
    "id_produto" TEXT NOT NULL,

    CONSTRAINT "item_compra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "public"."usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."produto" ADD CONSTRAINT "produto_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "public"."categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."compra" ADD CONSTRAINT "compra_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_compra" ADD CONSTRAINT "item_compra_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "public"."compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."item_compra" ADD CONSTRAINT "item_compra_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "public"."produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
