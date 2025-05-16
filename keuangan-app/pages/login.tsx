import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  const handleAuth = async () => {
    let res
    if (isLogin) {
      res = await supabase.auth.signInWithPassword({ email, password })
    } else {
      res = await supabase.auth.signUp({ email, password })
    }
    if (res.error) alert(res.error.message)
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />
        <button onClick={handleAuth} className="bg-blue-600 text-white w-full py-2 rounded">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p className="text-center mt-3 text-sm">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <button className="text-blue-500 underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Daftar' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
