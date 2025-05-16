import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

type Props = {
  onAdd: (data: any) => void;
  editing: any | null;
};

export default function TransactionForm({ onAdd, editing }: Props) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'income',
    category: ''
  });

  // Isi form saat editing
  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        amount: editing.amount.toString(),
        type: editing.type,
        category: editing.category
      })
    }
  }, [editing])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id
  
    if (!userId) {
      alert('User belum login.')
      return
    }
  
    if (!form.title || !form.amount || !form.type) {
      alert('Harap isi semua field.')
      return
    }
  
    const payload = {
      title: form.title,
      amount: parseFloat(form.amount),
      type: form.type,
      category: form.category,
      user_id: userId,
    }
  
    if (editing) {
      const { data, error } = await supabase
        .from('transactions')
        .update(payload)
        .eq('id', editing.id)
        .select()
  
      if (error) {
        alert('Gagal mengedit transaksi.')
        return
      }
  
      if (data && data.length > 0) {
        onAdd(data[0])
      }
    } else {
      const { data, error } = await supabase
        .from('transactions')
        .insert([payload])
        .select()
  
      if (error) {
        alert('Gagal menambahkan transaksi.')
        return
      }
  
      if (data && data.length > 0) {
        onAdd(data[0])
      }
    }
  
    setForm({
      title: '',
      amount: '',
      type: 'income',
      category: ''
    })
  }
  
  

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <div className="p-4 max-w-md mx-auto md:max-w-2xl">
        <label className="block text-sm mb-1">Judul</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="p-4 max-w-md mx-auto md:max-w-2xl">
        <label className="block text-sm mb-1">Jumlah</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </div>

      <div className="p-4 max-w-md mx-auto md:max-w-2xl">
        <label className="block text-sm mb-1">Kategori</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
      </div>

      <div className="p-4 max-w-md mx-auto md:max-w-2xl">
        <label className="block text-sm mb-1">Jenis</label>
        <select
          className="w-full p-2 border rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {editing ? 'Update Transaksi' : 'Tambah Transaksi'}
      </button>
    </form>
  )
}
