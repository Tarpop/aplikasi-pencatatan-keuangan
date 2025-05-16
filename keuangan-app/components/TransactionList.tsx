export default function TransactionList({
  data,
  onDelete,
  onEdit
}: {
  data: any[]
  onDelete: (id: string) => void
  onEdit: (item: any) => void
}) {
  return (
    <div className="p-4 max-w-md mx-auto md:max-w-2xl">
      <h2 className="text-lg font-semibold mb-2">Daftar Transaksi</h2>
      <ul className="bg-white rounded shadow divide-y">
        {data.map((item) => (
          <li key={item.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-500">{item.category}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`${item.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {item.type === 'income' ? '+' : '-'}Rp{item.amount}
              </div>
              <button onClick={() => onEdit(item)} className="text-blue-500 text-sm">Edit</button>
              <button onClick={() => onDelete(item.id)} className="text-red-500 text-sm">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
