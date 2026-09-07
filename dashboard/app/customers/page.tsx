import { mockCustomers } from "@/lib/mock-data";

export default function CustomersPage() {
  return (
    <main>
      <h1 className="font-serif text-3xl text-navy-900">Customers</h1>
      <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy-50 text-navy-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {mockCustomers.map((customer) => (
              <tr key={customer.id} className="border-t border-navy-100">
                <td className="px-4 py-3">{customer.name}</td>
                <td>{customer.email}</td>
                <td className="capitalize">{customer.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
