-- DropForeignKey
ALTER TABLE "Stock_Product" DROP CONSTRAINT "Stock_Product_product_variantId_fkey";

-- AlterTable
ALTER TABLE "Stock_Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "product_variantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock_Product" ADD CONSTRAINT "Stock_Product_product_variantId_fkey" FOREIGN KEY ("product_variantId") REFERENCES "product_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
