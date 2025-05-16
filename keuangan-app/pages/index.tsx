import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'

export default function Home() {
  const user = useUser()
const router = useRouter()

useEffect(() => {
  if (!user) router.push('/login')
}, [user])

  const [transactions, setTransactions] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [search, setSearch] = useState('')
const [filterType, setFilterType] = useState('')
const [filterCategory, setFilterCategory] = useState('')
const filteredTransactions = transactions.filter((t) => {
  const matchSearch = t.title?.toLowerCase().includes(search.toLowerCase()) ?? false;
  const matchType = filterType ? t.type === filterType : true;
  const matchCategory = filterCategory ? t.category?.toLowerCase().includes(filterCategory.toLowerCase()) : true;
  return matchSearch && matchType && matchCategory;
});




useEffect(() => {
  const fetchTransactions = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return;
    }

    if (!user) {
      console.log("No user is logged in.");
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching transactions:", error.message);
      return;
    }

    if (data) setTransactions(data);
  };

  fetchTransactions();
}, []);


const handleAddOrEdit = (data: any) => {
  if (!data || typeof data !== 'object' || !data.id) {
    console.error('Data tidak valid dikirim ke handleAddOrEdit:', data)
    return
  }

  setTransactions((prev = []) => {
    const existing = prev.find((t) => t?.id === data.id)
    if (existing) {
      return prev.map((t) => (t?.id === data.id ? data : t))
    }
    return [data, ...prev]
  })

  setEditing(null)
}





  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Apakah anda yakin ingin menghapus transaksi ini?')
    if (!confirmDelete) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      alert('Gagal menghapus transaksi.')
      console.error(error)
      return
    }
    if (!error) {
      setTransactions(prev => prev.filter(item => item.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="p-4 max-w-md mx-auto md:max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Aplikasi Pencatatan Keuangan</h1>
        <div className="p-4 max-w-md mx-auto md:max-w-2xl">
          <Link href="/report" className="text-blue-500 underline text-sm">Lihat Laporan &rarr;</Link>
        </div>
        <TransactionForm onAdd={handleAddOrEdit} editing={editing} />
        <div className="my-4 grid grid-cols-1 md:grid-cols-3 gap-4">
  <input
    type="text"
    placeholder="Cari judul..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="p-2 border rounded w-full"
  />
  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
    className="p-2 border rounded w-full"
  >
    <option value="">Semua Jenis</option>
    <option value="income">Pemasukan</option>
    <option value="expense">Pengeluaran</option>
  </select>
  <input
    type="text"
    placeholder="Cari kategori..."
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    className="p-2 border rounded w-full"
  />
</div>

        <TransactionList data={filteredTransactions} onDelete={handleDelete} onEdit={setEditing} />
      </div>
    </div>
  )
}
