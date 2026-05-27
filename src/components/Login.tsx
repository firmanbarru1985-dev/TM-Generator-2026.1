import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Lock, User, Sparkles } from 'lucide-react';
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
    // Mengubah background utama menjadi putih (bg-white)
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-white">
      {/* Background Decor - Menggunakan Royal Blue & Hijau Toska lembut */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/30 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-[2rem] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 mb-4"> {/* Anda bisa atur ukuran w dan h di sini */}
              <img 
                src="/logo.png" 
                alt="Logo TM Generator" 
                className="w-full h-full object-contain" 
              />
            </div>
            {/* Judul: Royal Blue */}
            <h1 className="text-3xl font-bold text-blue-900">TM GENERATOR</h1>
            {/* Subtitle: Hijau Toska */}
            <p className="text-teal-700 font-medium">AI Modul Ajar Generator</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              {/* Label & Icon: Royal Blue & Hijau Toska */}
              <label className="text-sm font-semibold text-blue-800 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan Username"
                  {/* Border & Focus ring menggunakan warna tema baru */}
                  className="w-full bg-white/50 border border-blue-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-blue-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* Label & Icon: Royal Blue & Hijau Toska */}
              <label className="text-sm font-semibold text-blue-800 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password"
                  {/* Border & Focus ring menggunakan warna tema baru */}
                  className="w-full bg-white/50 border border-blue-200 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-blue-300"
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

            <button
              type="submit"
              disabled={isSubmitting}
              {/* Tombol: Menggunakan gradasi Royal Blue ke Hijau Toska dengan bayangan warna Blue */}
              className={cn(
                "w-full bg-gradient-to-r from-blue-700 to-teal-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2",
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

          {/* Edisi Profesional: Kuning Emas (Amber) */}
          <p className="mt-8 text-center text-xs text-amber-600 font-medium tracking-wide uppercase">
            Profesional Edition
          </p>
        </div>
      </motion.div>
    </div>
  );
}
