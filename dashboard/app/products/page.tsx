import { listCollections, listProducts } from "@thumba/shared/db";
import { ProductsManager } from "@/components/ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, collections] = await Promise.all([listProducts(), listCollections()]);
  return <main><ProductsManager initialProducts={products} collections={collections} /></main>;
}
