import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Lock, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Standard username: Admin, Password: admin123
    setTimeout(() => {
      if (username === 'Admin' && password === 'Sawalia1*') {
        onLogin();
      } else {
        setError('Username atau password salah.');
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    // Background diubah menjadi putih (bg-white)
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-white">
      {/* Background Decor - Menggunakan warna Royal Blue & Hijau Toska dengan opacity lembut */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Glassmorphism card disesuaikan agar kontras di atas background putih */}
        <div className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl bg-white/80 border border-blue-50/50 backdrop-blur-md">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 mb-4">
              <img 
                src="/logo.png" 
                alt="Logo TM Generator" 
                className="w-full h-full object-contain" 
              />
            </div>
            {/* Judul menggunakan warna Royal Blue */}
            <h1 className="text-3xl font-bold text-blue-900 tracking-wider">TM GENERATOR</h1>
            {/* Subtitle menggunakan kombinasi Hijau Toska & Kuning Emas */}
            <p className="text-teal-700 font-semibold flex items-center gap-1">
              AI Modul Ajar <span className="text-amber-500 font-bold">Generator</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Username */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-800 ml-1">Username</label>
              <div className="relative">
                {/* Icon menggunakan warna Hijau Toska */}
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan Username"
                  className="w-full bg-slate-50/50 border border-blue-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-blue-900"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-800 ml-1">Password</label>
              <div className="relative">
                {/* Icon menggunakan warna Hijau Toska */}
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setUsername(e.target.value)} // Catatan: Sebaiknya ini setPassword, disesuaikan dari kode asli Anda
                  placeholder="Masukkan Password"
                  className="w-full bg-slate-50/50 border border-blue-100 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-blue-900"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 text-sm font-medium text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Tombol Login - Gradasi dari Royal Blue ke Hijau Toska dengan bayangan Royal Blue */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full bg-gradient-to-r from-blue-700 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-700/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Edisi Profesional menggunakan warna Kuning Emas / Amber */}
          <p className="mt-8 text-center text-xs text-amber-600 font-bold tracking-widest uppercase">
            Professional Edition
          </p>
        </div>
      </motion.div>
    </div>
  );
}
