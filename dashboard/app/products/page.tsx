import { catalog, formatCurrency } from "@thumba/shared";

export default function ProductsPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl text-navy-900">Products</h1>
      <p className="mt-2 text-sm text-navy-500">
        Catalog is currently mock data from the shared package. Prisma CRUD is next.
      </p>
      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {catalog.map((product) => (
              <tr key={product.id} className="border-t border-navy-100">
                <td className="px-4 py-3">{product.name}</td>
                <td className="capitalize">{product.category}</td>
                <td>{formatCurrency(product.discountedPrice ?? product.price)}</td>
                <td>{product.inStock ? "In stock" : "Out"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
