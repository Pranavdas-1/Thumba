-- Product catalog no longer stores physical specification fields.
ALTER TABLE "products"
  DROP COLUMN "material",
  DROP COLUMN "weight",
  DROP COLUMN "dimensions";

-- Customers are a single account type; phone is captured for delivery contact.
ALTER TABLE "users" ADD COLUMN "phone" TEXT;
ALTER TABLE "users" DROP COLUMN "role";
DROP TYPE "Role";

-- Collapse legacy order workflow states into the two business states used by admin.
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
CREATE TYPE "OrderStatus" AS ENUM ('INCOMPLETE', 'COMPLETE');
ALTER TABLE "orders"
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING (
    CASE WHEN "status"::text = 'DELIVERED' THEN 'COMPLETE' ELSE 'INCOMPLETE' END
  )::"OrderStatus";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'INCOMPLETE';
DROP TYPE "OrderStatus_old";
