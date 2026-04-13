'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel with image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="/auth-bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
            
          <div className="relative z-10 flex flex-col justify-between p-12 h-full">
            <div>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center p-2 mb-4">
                <img src="/logo.png" alt="Axios Logo" className="w-full h-full object-contain" />
              </div>
            </div>
            
            <div className="backdrop-blur-xl bg-black/20 border border-white/10 p-8 rounded-2xl shadow-2xl">
              <blockquote className="text-white/90 text-lg leading-relaxed mb-6 font-medium">
                &ldquo;Axios transformed how we screen candidates. What used to take weeks now takes minutes, with AI-powered insights that actually make sense.&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 text-white font-bold">G</div>
                <div>
                  <p className="text-white text-sm font-semibold">Grace Uwimana</p>
                  <p className="text-white/60 text-xs">Head of HR, TechRwanda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Right panel with form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-[#71717a] text-sm mb-8">Enter your credentials to access your workspace</p>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" required />
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="input w-full pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] hover:text-[#09090b] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    ) : (
                      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    )}
                  </svg>
                </button>
              </div>
  
              <button type="submit" className="btn-primary w-full mt-2">Sign in</button>
            </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-[#71717a]">Don't have an account? </span>
            <Link href="/register" className="font-medium text-[#09090b] hover:underline">
              Create an account
            </Link>
          </div>

          <p className="text-xs text-[#a1a1aa] text-center mt-8">
            By continuing, you agree to our <a href="#" className="underline text-[#71717a]">Terms of Service</a> and <a href="#" className="underline text-[#71717a]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
