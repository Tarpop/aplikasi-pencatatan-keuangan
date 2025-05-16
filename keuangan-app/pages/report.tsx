import { useEffect, useState } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

export default function ReportPage() {
  const user = useUser()
const router = useRouter()

useEffect(() => {
  if (!user) router.push('/login')
}, [user])

  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id)
      if (data) setTransactions(data)
    }
  
    fetchTransactions()
  }, [])
  

  const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0)
  const balance = income - expense

  const pieData = [
    { name: 'Pemasukan', value: income },
    { name: 'Pengeluaran', value: expense },
  ]

  const COLORS = ['#4ade80', '#f87171'] // green, red

  const categoryData = Object.values(
    transactions.reduce((acc, curr) => {
      const key = curr.category || 'Lainnya'
      if (!acc[key]) acc[key] = { name: key, income: 0, expense: 0 }
      acc[key][curr.type] += Number(curr.amount)
      return acc
    }, {} as Record<string, any>)
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="p-4 max-w-md mx-auto md:max-w-2xl">
          <Link href="/" className="text-blue-500 text-sm underline">&larr; Kembali ke Beranda</Link>
          <h1 className="text-2xl font-bold mt-2">Laporan Keuangan</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <SummaryCard label="Pemasukan" value={income} color="text-green-600" />
          <SummaryCard label="Pengeluaran" value={expense} color="text-red-600" />
          <SummaryCard label="Saldo" value={balance} color="text-blue-600" />
        </div>

        <h2 className="text-xl font-semibold mb-2">Perbandingan Pemasukan vs Pengeluaran</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <h2 className="text-xl font-semibold mt-10 mb-2">Per Kategori</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" stackId="a" fill="#4ade80" name="Pemasukan" />
            <Bar dataKey="expense" stackId="a" fill="#f87171" name="Pengeluaran" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="p-4 border rounded shadow text-center">
      <div className={`text-sm font-medium mb-1 ${color}`}>{label}</div>
      <div className="text-xl font-bold">{value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
    </div>
  )
}
